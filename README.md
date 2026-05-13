<div align="center">
  <img alt="Aurum Hotel Booking System" src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop" width="100%" style="border-radius: 8px; margin-bottom: 20px;" />
</div>

# Aurum Hotel Booking System

A modern, full-featured hotel booking web application built with React, Vite, and Tailwind CSS.

**Live Demo:** [aurum-booking-system.vercel.app](https://aurum-booking-system.vercel.app)

## Features

- **Room Browsing & Details:** View available rooms, amenities, and pricing.
- **Booking Flow:** Complete checkout process with guest details and payment form.
- **Booking Management:** View past and upcoming bookings, receive booking receipts.
- **Static Pages:** Check out extra hotel services like Dining, Spa, Meetings, and Offers.
- **Database Integration:** Seamless integration with Supabase.
- **AI Integration:** Includes `@google/genai` for smart features.

## Tech Stack

- **Frontend:** React 19, React Router v7, Tailwind CSS (v4)
- **Tooling:** Vite, TypeScript
- **Backend/BaaS:** Supabase
- **UI & Animations:** Lucide React, Framer Motion
- **Utilities:** date-fns, jsPDF, clsx, tailwind-merge

## Getting Started

### Prerequisites

- Node.js installed on your machine.

### Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Environment Setup:
   Create a `.env.local` file in the root directory and add your environment variables (e.g., Supabase keys, Gemini API key):
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

- `src/components/`: Reusable UI components (Navbar, Footer, Forms, Cards, etc.)
- `src/pages/`: Page components for routing (Home, Checkout, Rooms, Spa, etc.)
- `src/lib/`: Library integrations (e.g., Supabase client setup)
- `src/data/`: Static data and content (e.g., Rooms)
- `src/utils/`: Helper functions (availability, pricing, booking storage)
- `api/`: Serverless functions (e.g., send-receipt)
