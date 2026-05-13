import { Room } from '../types';

export const ROOMS: Room[] = [
  {
    id: 'standard-room',
    name: 'Standard Room',
    type: 'Standard',
    price: 280,
    maxGuests: 2,
    units: 5,
    description: 'A comfortable, well-appointed room for the practical traveller. Clean lines, city view, and everything you need for a restful stay.',
    amenities: ['WiFi', 'Air Conditioning', 'TV', 'Private Bathroom', 'Work Desk'],
    imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'deluxe-room',
    name: 'Deluxe Room',
    type: 'Deluxe',
    price: 480,
    maxGuests: 2,
    units: 3,
    description: 'Elevated comfort with premium furnishings, a private balcony overlooking the city skyline, and thoughtful in-room extras.',
    amenities: ['WiFi', 'Air Conditioning', 'Smart TV', 'Bathtub', 'Mini Bar', 'City View Balcony'],
    imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'grand-suite',
    name: 'Grand Suite',
    type: 'Grand Suite' as any, // PRD says Suite but internal data call it Grand Suite
    price: 950,
    maxGuests: 4,
    units: 2,
    description: "The pinnacle of Aurum Grand's hospitality. Expansive living space, a private jacuzzi, and panoramic views — designed for those who expect nothing less.",
    amenities: ['WiFi', 'Air Conditioning', '65" Smart TV', 'Jacuzzi', 'Full Living Area', 'Butler Service', 'Panoramic View'],
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200',
  },
];
