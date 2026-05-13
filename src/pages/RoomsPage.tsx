import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { format, differenceInDays, parseISO, addDays } from 'date-fns';
import { Wifi, Tv, Coffee, Wind, Utensils, Bath, Map, Filter, ArrowUpDown, ChevronRight, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ROOMS } from '../data/rooms';
import { checkAvailability, isRoomAvailableLocally } from '../utils/availability';
import { cn } from '../lib/utils';

const AMENITY_ICONS: Record<string, any> = {
  'WiFi': Wifi,
  'Air Conditioning': Wind,
  'TV': Tv,
  'Smart TV': Tv,
  '65" Smart TV': Tv,
  'Private Bathroom': Bath,
  'Work Desk': Map,
  'Bathtub': Bath,
  'Mini Bar': Coffee,
  'City View Balcony': Wind,
  'Jacuzzi': Bath,
  'Full Living Area': Map,
  'Butler Service': Utensils,
  'Panoramic View': Map,
};

export default function RoomsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [roomTypeFilter, setRoomTypeFilter] = useState('All');
  const [priceSort, setPriceSort] = useState<'asc' | 'desc' | null>(null);
  const [bookedCounts, setBookedCounts] = useState<Record<string, number>>({});

  const checkin = searchParams.get('checkin') || format(new Date(), 'yyyy-MM-dd');
  const checkout = searchParams.get('checkout') || format(addDays(new Date(), 2), 'yyyy-MM-dd');
  const guests = Number(searchParams.get('guests')) || 1;

  const nights = useMemo(() => {
    return differenceInDays(parseISO(checkout), parseISO(checkin));
  }, [checkin, checkout]);

  useEffect(() => {
    async function fetchAvailability() {
      const counts = await checkAvailability(checkin, checkout);
      setBookedCounts(counts);
    }
    fetchAvailability();
  }, [checkin, checkout]);

  const availableRooms = useMemo(() => {
    let results = ROOMS.map(room => ({
      ...room,
      isAvailable: isRoomAvailableLocally(room.type, room.units, bookedCounts)
    }));

    if (roomTypeFilter !== 'All') {
      results = results.filter(room => room.type.includes(roomTypeFilter));
    }

    if (priceSort) {
      results.sort((a, b) => priceSort === 'asc' ? a.price - b.price : b.price - a.price);
    }

    return results;
  }, [bookedCounts, roomTypeFilter, priceSort]);

  return (
    <div className="bg-slate-50 pb-24">
      {/* Search Summary Bar */}
      <div className="bg-primary text-white py-6 px-6 md:px-12 border-t border-white/5 border-b border-accent/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center w-full">
            <div className="flex-1 w-full">
              <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">Check-in</label>
              <input
                type="date"
                value={checkin}
                min={format(new Date(), 'yyyy-MM-dd')}
                onChange={(e) => {
                  const newCheckin = e.target.value;
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set('checkin', newCheckin);
                  
                  if (newCheckin >= checkout) {
                    newParams.set('checkout', format(addDays(parseISO(newCheckin), 1), 'yyyy-MM-dd'));
                  }
                  
                  setSearchParams(newParams);
                }}
                className="w-full bg-white/10 border border-white/20 text-white text-sm px-3 py-2 outline-none focus:border-accent"
              />
            </div>
            <div className="flex-1 w-full">
              <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">Check-out</label>
              <input
                type="date"
                value={checkout}
                min={format(addDays(parseISO(checkin), 1), 'yyyy-MM-dd')}
                onChange={(e) => {
                  const newCheckout = e.target.value;
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set('checkout', newCheckout);
                  
                  if (newCheckout <= checkin) {
                    newParams.set('checkin', format(addDays(parseISO(newCheckout), -1), 'yyyy-MM-dd'));
                  }
                  
                  setSearchParams(newParams);
                }}
                className="w-full bg-white/10 border border-white/20 text-white text-sm px-3 py-2 outline-none focus:border-accent"
              />
            </div>
            <div className="flex-1 w-full md:max-w-[150px]">
              <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">Guests</label>
              <input
                type="number"
                min="1"
                max="4"
                value={guests}
                onChange={(e) => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set('guests', e.target.value);
                  setSearchParams(newParams);
                }}
                className="w-full bg-white/10 border border-white/20 text-white text-sm px-3 py-2 outline-none focus:border-accent"
              />
            </div>
            <div className="hidden md:block">
              <span className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">Duration</span>
              <p className="text-sm font-serif p-2">{nights} {nights === 1 ? 'Night' : 'Nights'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 flex flex-col lg:flex-row gap-12">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-72 shrink-0 space-y-12">
          <div className="space-y-6">
            <h4 className="font-serif text-xl border-b border-slate-200 pb-2 flex items-center gap-2">
              <Filter className="w-4 h-4 text-accent" /> Filter By
            </h4>
            
            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Room Type</p>
              {['All', 'Standard', 'Deluxe', 'Suite'].map(type => (
                <button
                  key={type}
                  onClick={() => setRoomTypeFilter(type)}
                  className={cn(
                    "block w-full text-left py-2 px-4 text-sm transition-all border-l-2",
                    roomTypeFilter === type 
                      ? "bg-white border-accent text-primary font-bold shadow-sm" 
                      : "bg-transparent border-transparent text-slate-500 hover:border-slate-200"
                  )}
                >
                  {type} {type !== 'All' ? 'Rooms' : ''}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Sort Price</p>
              <button
                onClick={() => setPriceSort(priceSort === 'asc' ? null : 'asc')}
                className={cn(
                  "flex items-center justify-between w-full py-2 px-4 text-sm transition-all border-l-2",
                  priceSort === 'asc' 
                    ? "bg-white border-accent text-primary font-bold shadow-sm" 
                    : "bg-transparent border-transparent text-slate-500 hover:border-slate-200"
                )}
              >
                <span>Low to High</span>
                <ArrowUpDown className="w-3 h-3" />
              </button>
              <button
                onClick={() => setPriceSort(priceSort === 'desc' ? null : 'desc')}
                className={cn(
                  "flex items-center justify-between w-full py-2 px-4 text-sm transition-all border-l-2",
                  priceSort === 'desc' 
                    ? "bg-white border-accent text-primary font-bold shadow-sm" 
                    : "bg-transparent border-transparent text-slate-500 hover:border-slate-200"
                )}
              >
                <span>High to Low</span>
                <ArrowUpDown className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="bg-primary p-6 text-white space-y-4">
            <h4 className="font-serif text-lg text-accent">Need Help?</h4>
            <p className="text-xs text-white/70 leading-relaxed">Our reservation specialists are available 24/7 to assist with your booking.</p>
            <div className="text-sm font-bold text-white">+1 (800) 123-GOLD</div>
          </div>
        </aside>

        {/* Room Listings */}
        <div className="flex-grow space-y-8">
          <AnimatePresence mode="popLayout">
            {availableRooms.map((room) => (
              <motion.div
                key={room.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                  "bg-white flex flex-col md:flex-row group overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100",
                  !room.isAvailable && "opacity-80"
                )}
              >
                <div className="w-full md:w-[40%] h-64 md:h-auto overflow-hidden relative">
                  <img 
                    src={room.imageUrl} 
                    alt={room.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  {!room.isAvailable && (
                    <div className="absolute inset-0 bg-primary/40 flex items-center justify-center backdrop-blur-[2px]">
                      <span className="bg-primary text-white py-2 px-6 uppercase tracking-[0.2em] font-bold text-sm shadow-xl border border-accent/30">
                        Fully Booked
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-8 flex-grow flex flex-col justify-between gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] uppercase tracking-widest bg-slate-100 text-slate-500 px-2 py-0.5 font-bold">
                            {room.type}
                          </span>
                          {room.isAvailable && (
                            <span className="text-[10px] uppercase tracking-widest bg-green-50 text-green-600 px-2 py-0.5 font-bold">
                              Available
                            </span>
                          )}
                        </div>
                        <h3 className="text-2xl font-serif text-primary">{room.name}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-serif font-bold text-primary tracking-tighter">RM {room.price}</p>
                        <p className="text-[10px] uppercase tracking-widest text-slate-400">per night</p>
                      </div>
                    </div>
                    
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                      {room.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-4">
                      {room.amenities.slice(0, 4).map(feature => {
                        const Icon = AMENITY_ICONS[feature] || Wifi;
                        return (
                          <div key={feature} className="flex items-center gap-1.5 text-slate-400">
                            <Icon className="w-3.5 h-3.5 text-accent" />
                            <span className="text-xs">{feature}</span>
                          </div>
                        );
                      })}
                      {room.amenities.length > 4 && (
                        <span className="text-xs text-slate-300">+{room.amenities.length - 4} more</span>
                      )}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                    <div className="text-xs text-slate-400 flex items-center gap-2">
                      <Users className="w-3.5 h-3.5" /> Max {room.maxGuests} {room.maxGuests === 1 ? 'Guest' : 'Guests'}
                    </div>
                    <Link
                      to={room.isAvailable ? `/rooms/${room.id}?checkin=${checkin}&checkout=${checkout}&guests=${guests}` : '#'}
                      className={cn(
                        "flex items-center gap-2 px-8 py-3 text-xs uppercase tracking-widest font-bold transition-all",
                        room.isAvailable 
                          ? "bg-accent hover:bg-gold-dark text-primary shadow-lg hover:shadow-accent/20" 
                          : "bg-slate-200 text-slate-400 cursor-not-allowed"
                      )}
                      onClick={(e) => !room.isAvailable && e.preventDefault()}
                    >
                      {room.isAvailable ? 'Book This Room' : 'Sold Out'}
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {availableRooms.length === 0 && (
            <div className="bg-white py-24 text-center border border-dashed border-slate-200">
              <p className="text-slate-400 font-serif italic mb-4">No rooms found matching your criteria.</p>
              <button 
                onClick={() => { setRoomTypeFilter('All'); setPriceSort(null); }}
                className="text-accent uppercase tracking-widest text-xs font-bold underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
