export type RoomType = 'Standard' | 'Deluxe' | 'Suite';

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  price: number;
  maxGuests: number;
  units: number;
  description: string;
  amenities: string[];
  imageUrl: string;
}

export interface Booking {
  bookingId: string;
  roomId: string;
  roomName: string;
  roomType: string;
  checkin: string; // ISO string
  checkout: string; // ISO string
  nights: number;
  guests: number;
  totalPrice: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string; // ISO string
}

export interface SearchParams {
  checkin: string;
  checkout: string;
  guests: number;
}
