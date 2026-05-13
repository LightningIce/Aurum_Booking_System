import { Booking } from '../types';
import { supabase } from '../lib/supabaseClient';

export async function getBookings(): Promise<Booking[]> {
  const { data, error } = await supabase.from('bookings').select('*');
  if (error || !data) return [];
  
  return data.map(dbBooking => ({
    bookingId: dbBooking.booking_reference,
    roomId: dbBooking.room_id,
    roomName: dbBooking.room_name,
    roomType: dbBooking.room_type,
    checkin: dbBooking.checkin,
    checkout: dbBooking.checkout,
    nights: dbBooking.nights,
    guests: dbBooking.guests,
    totalPrice: dbBooking.total_price,
    guestName: dbBooking.guest_name,
    guestEmail: dbBooking.guest_email,
    guestPhone: dbBooking.guest_phone,
    specialRequests: dbBooking.special_requests,
    status: dbBooking.status,
    createdAt: dbBooking.created_at
  }));
}

export async function saveBooking(booking: Booking): Promise<void> {
  await supabase.from('bookings').insert([{
    booking_reference: booking.bookingId,
    room_id: booking.roomId,
    room_name: booking.roomName,
    room_type: booking.roomType,
    checkin: booking.checkin,
    checkout: booking.checkout,
    nights: booking.nights,
    guests: booking.guests,
    total_price: booking.totalPrice,
    guest_name: booking.guestName,
    guest_email: booking.guestEmail,
    guest_phone: booking.guestPhone,
    special_requests: booking.specialRequests,
    status: booking.status
  }]);
}

export async function updateBookingStatus(bookingId: string, status: 'confirmed' | 'cancelled'): Promise<void> {
  await supabase.from('bookings')
    .update({ status })
    .eq('booking_reference', bookingId);
}

export async function getBookingById(bookingId: string): Promise<Booking | undefined> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('booking_reference', bookingId)
    .single();

  if (error || !data) return undefined;

  return {
    bookingId: data.booking_reference,
    roomId: data.room_id,
    roomName: data.room_name,
    roomType: data.room_type,
    checkin: data.checkin,
    checkout: data.checkout,
    nights: data.nights,
    guests: data.guests,
    totalPrice: data.total_price,
    guestName: data.guest_name,
    guestEmail: data.guest_email,
    guestPhone: data.guest_phone,
    specialRequests: data.special_requests,
    status: data.status,
    createdAt: data.created_at
  };
}
