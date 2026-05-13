# Aurum Grand Hotel — Room Booking System
## Vision & Architecture Guide for GitHub Copilot

> This file describes the full product vision, architecture, data model, and implementation conventions for the Aurum Grand Hotel booking system. Use it as the authoritative reference when generating code for this project.

---

## What We're Building

A web-based hotel room booking prototype where guests can:
1. Browse rooms and check availability by date
2. Complete a booking and simulated payment
3. Receive an automated email receipt (via EmailJS)
4. Look up their booking anytime using a unique reference number
5. Download a PDF receipt or print their booking

No authentication. No real payments. Supabase as the database. Deployed on Vercel or Netlify.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Language | TypeScript |
| Framework | React (Vite) |
| Styling | Tailwind CSS |
| State | `useState` / `useReducer` + Context API |
| Routing | React Router v6 |
| Database | Supabase (PostgreSQL) via `@supabase/supabase-js` |
| Email | EmailJS (called from client) |
| Date handling | `date-fns` |
| PDF | `react-to-pdf` or `jsPDF` + `html2canvas` |
| Deployment | Vercel or Netlify |

---

## Project Structure

```
src/
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── RoomCard.tsx
│   ├── BookingSummaryPanel.tsx
│   ├── GuestDetailsForm.tsx
│   ├── PaymentForm.tsx
│   └── BookingReceiptCard.tsx     ← shared by confirmation, my-booking, and PDF
├── pages/
│   ├── HomePage.tsx
│   ├── RoomsPage.tsx
│   ├── RoomDetailPage.tsx
│   ├── CheckoutPage.tsx
│   ├── ConfirmationPage.tsx
│   └── MyBookingPage.tsx
├── data/
│   └── rooms.ts                   ← hardcoded room definitions
├── types/
│   └── index.ts                   ← Booking, Room, SearchParams interfaces
├── utils/
│   ├── availability.ts            ← Supabase overlap query logic
│   ├── bookingReference.ts        ← AGH-XXXXXXXX generator
│   └── pricing.ts                 ← night count + total calculation
├── lib/
│   ├── supabaseClient.ts          ← initialised Supabase client singleton
│   └── emailjs.ts                 ← EmailJS configuration and helper
├── App.tsx
└── main.tsx
```

---

## Routes

| Path | Page | Notes |
|---|---|---|
| `/` | HomePage | Search form + hero + room previews |
| `/rooms` | RoomsPage | Query params: `?checkin=&checkout=&guests=` |
| `/rooms/:roomId` | RoomDetailPage | roomId: `standard`, `deluxe`, `suite` |
| `/checkout` | CheckoutPage | Query params carry room + search state |
| `/confirmation/:bookingRef` | ConfirmationPage | e.g. `/confirmation/AGH-U6JWZSCC8` |
| `/my-booking` | MyBookingPage | Search by reference; optionally `/my-booking/:bookingRef` |

---

## Room Data (Hardcoded in `src/data/rooms.ts`)

```typescript
export const ROOMS = [
  {
    id: 'standard',
    name: 'Standard Room',
    type: 'Standard',
    pricePerNight: 280,
    maxGuests: 2,
    units: 5,
    amenities: ['WiFi', 'Air Conditioning', 'TV', 'Private Bathroom', 'Work Desk'],
    description: '...',
  },
  {
    id: 'deluxe',
    name: 'Deluxe Room',
    type: 'Deluxe',
    pricePerNight: 480,
    maxGuests: 2,
    units: 3,
    amenities: ['WiFi', 'Air Conditioning', 'Smart TV', 'Bathtub', 'Mini Bar', 'City View Balcony'],
    description: '...',
  },
  {
    id: 'suite',
    name: 'Grand Suite',
    type: 'Suite',
    pricePerNight: 950,
    maxGuests: 4,
    units: 2,
    amenities: ['WiFi', 'Air Conditioning', '65" Smart TV', 'Jacuzzi', 'Full Living Area', 'Butler Service', 'Panoramic View'],
    description: '...',
  },
];
```

Currency is **Malaysian Ringgit (RM)**.

---

## Supabase Schema

### Table: `bookings`

```sql
create table bookings (
  id                uuid primary key default gen_random_uuid(),
  booking_reference text unique not null,       -- e.g. AGH-U6JWZSCC8
  room_id           text not null,              -- 'standard' | 'deluxe' | 'suite'
  room_name         text not null,
  room_type         text not null,
  checkin           date not null,
  checkout          date not null,
  nights            int not null,
  guests            int not null,
  total_price       numeric(10, 2) not null,
  guest_name        text not null,
  guest_email       text not null,
  guest_phone       text not null,
  special_requests  text,
  status            text not null default 'confirmed', -- 'confirmed' | 'cancelled'
  created_at        timestamptz not null default now()
);
```

### RLS Policies

```sql
-- Anonymous insert (guest creating a booking)
create policy "Allow insert" on bookings
  for insert to anon with check (true);

-- Anonymous select (guest looking up their booking)
create policy "Allow select by reference" on bookings
  for select to anon using (true);

-- Anonymous update: cancellation only
create policy "Allow cancel by reference" on bookings
  for update to anon using (true)
  with check (status = 'cancelled');
```

No `DELETE` permitted for anonymous users.

---

## Core Logic

### Availability Check (`src/utils/availability.ts`)

Query confirmed bookings that overlap with the requested date range, then compare counts against each room type's unit capacity.

```typescript
const { data } = await supabase
  .from('bookings')
  .select('room_type')
  .eq('status', 'confirmed')
  .lt('checkin', checkout)   // existing checkin is before new checkout
  .gt('checkout', checkin);  // existing checkout is after new checkin
```

A room type is **Fully Booked** when `overlappingCount >= room.units`.

### Booking Reference (`src/utils/bookingReference.ts`)

```typescript
function generateBookingReference(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const random = Array.from({ length: 8 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
  return `AGH-${random}`;
}
```

On Supabase unique constraint collision: catch the error, regenerate, retry up to 3 times.

### Checkout Submit Sequence

```
1. Validate all form fields (guest details + payment)
2. Show loading: "Processing payment…" (2-second simulated delay)
3. Generate booking reference: AGH-XXXXXXXX
4. Re-validate room availability (race condition guard)
5. Write booking record to Supabase `bookings`
6. If Supabase write fails → show inline error, stop, do not email
7. Call EmailJS `send` function with booking data
8. If email fails → non-blocking, log error, continue
9. Redirect to /confirmation/:bookingRef
```

---

## Email Receipt (EmailJS)

EmailJS is called directly from the client. Public key and template IDs are used.

```typescript
import emailjs from '@emailjs/browser';

await emailjs.send(
  import.meta.env.VITE_EMAILJS_SERVICE_ID,
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  {
    to_email: guestEmail,
    guest_name: guestName,
    booking_ref: bookingRef,
    // ...other booking details mapped to template variables
  },
  import.meta.env.VITE_EMAILJS_PUBLIC_KEY
);
```

The React app calls EmailJS after a successful Supabase write. Email failure is non-blocking — the booking is already confirmed in the database.

**Email template content:**
- Hotel header, "Booking Confirmed" heading
- Greeting with guest name
- Booking summary table (reference, room, dates, nights, guests, total)
- Simulated payment disclaimer
- Footer with lookup URL and mock hotel contact details

---

## PDF & Print

### PDF Download
- Use a hidden `<div ref={receiptRef}>` in the Booking Detail view styled for PDF output
- On click: capture the div → export as `AGH-XXXXXXXX-receipt.pdf`
- Content mirrors the email receipt layout

### Print
- `window.print()` on click
- Use Tailwind's `print:hidden` / `print:block` utilities
- `@media print` hides navbar, footer, search bar, and action buttons
- Only the booking detail card renders in print output

---

## Validation Rules

| Field | Rule |
|---|---|
| Check-in date | Today or future |
| Check-out date | At least 1 day after check-in |
| Guest count | 1–4; must not exceed room's `maxGuests` |
| Full name | Required, min 2 characters |
| Email | Required, valid format |
| Phone | Required, min 8 digits |
| Card number | Exactly 16 digits |
| Expiry | Future MM/YY |
| CVV | Exactly 3 digits |
| Booking reference (lookup) | Must match `/^AGH-[A-Z0-9]{8}$/` before querying |

---

## Environment Variables

```env
# Client-safe (Vite exposes VITE_ prefix)
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# EmailJS Variables
VITE_EMAILJS_SERVICE_ID=service_xxxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxx
```

`.env` must be in `.gitignore`. Document all variables in `README.md`.

---

## Error Handling

| Scenario | Behaviour |
|---|---|
| Supabase write fails on checkout | Inline error; do not redirect; do not send email |
| Email send fails | Non-blocking; confirm booking anyway; log error; show note on confirmation page |
| Booking reference not found | Inline error on `/my-booking` |
| Room fully booked between search and checkout | Re-validate on submit; show error with redirect back to `/rooms` |
| Supabase availability query fails | Generic error; disable "Check Availability" |
| PDF generation fails | Toast error; print fallback still available |

---

## Key Conventions

- **URL query params** carry search state (`checkin`, `checkout`, `guests`) so pages are bookmarkable and debuggable.
- **`BookingReceiptCard`** is a shared component used on the confirmation page, the My Booking detail view, and as the hidden div for PDF export.
- **No authentication** anywhere in the app. The booking reference (`36^8 ≈ 2.8 trillion` combinations) provides sufficient privacy for a prototype.
- **Supabase over localStorage** — enables cross-device lookup and accurate multi-user availability checks.
- All prices in **RM (Malaysian Ringgit)**.
- Booking statuses are strictly `'confirmed'` or `'cancelled'`.
