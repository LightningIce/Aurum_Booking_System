import { Booking } from '../types';
import { parseISO } from 'date-fns';
import { supabase } from '../lib/supabaseClient';

export async function checkAvailability(checkin: string, checkout: string): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from('bookings')
    .select('room_type')
    .eq('status', 'confirmed')
    .lt('checkin', checkout)
    .gt('checkout', checkin);

  if (error) {
    console.error('Error fetching availability:', error);
    return {};
  }

  // Count how many overlapping bookings each room type has
  const bookedCounts = (data || []).reduce((acc: Record<string, number>, booking) => {
    acc[booking.room_type] = (acc[booking.room_type] || 0) + 1;
    return acc;
  }, {});

  return bookedCounts;
}

export function isRoomAvailableLocally(
  roomType: string,
  totalUnits: number,
  bookedCounts: Record<string, number>
): boolean {
  const overlappingCount = bookedCounts[roomType] || 0;
  return overlappingCount < totalUnits;
}

export function calculateNights(checkin: string, checkout: string): number {
  const start = parseISO(checkin);
  const end = parseISO(checkout);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
