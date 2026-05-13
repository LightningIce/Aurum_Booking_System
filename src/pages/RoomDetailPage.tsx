import { useState, useMemo } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { format, differenceInDays, parseISO, addDays } from 'date-fns';
import { 
  Wifi, Tv, Coffee, Wind, Utensils, Bath, Map, 
  Calendar, Users, ShieldCheck, ChevronLeft, ArrowRight,
  Clock, Info, CigaretteOff
} from 'lucide-react';
import { motion } from 'motion/react';
import { ROOMS } from '../data/rooms';

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

export default function RoomDetailPage() {
  const { roomId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const room = ROOMS.find(r => r.id === roomId);

  const checkin = searchParams.get('checkin') || format(new Date(), 'yyyy-MM-dd');
  const checkout = searchParams.get('checkout') || format(addDays(new Date(), 2), 'yyyy-MM-dd');
  const guests = Number(searchParams.get('guests')) || 1;

  const handleDateChange = (field: 'checkin' | 'checkout', value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set(field, value);
    
    // Simple validation: ensure checkout is after checkin
    if (field === 'checkin') {
      const newCheckin = parseISO(value);
      const currentCheckout = parseISO(checkout);
      if (newCheckin >= currentCheckout) {
        newParams.set('checkout', format(addDays(newCheckin, 1), 'yyyy-MM-dd'));
      }
    } else if (field === 'checkout') {
      const newCheckout = parseISO(value);
      const currentCheckin = parseISO(checkin);
      if (newCheckout <= currentCheckin) {
        newParams.set('checkin', format(addDays(newCheckout, -1), 'yyyy-MM-dd'));
      }
    }
    
    setSearchParams(newParams);
  };

  const handleGuestChange = (value: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('guests', value.toString());
    setSearchParams(newParams);
  };

  const nights = useMemo(() => {
    return differenceInDays(parseISO(checkout), parseISO(checkin));
  }, [checkin, checkout]);

  const totalPrice = room ? room.price * nights : 0;

  if (!room) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-3xl font-serif mb-4">Room not found</h2>
        <Link to="/rooms" className="text-accent underline">Back to listings</Link>
      </div>
    );
  }

  const handleProceed = () => {
    navigate(`/checkout?roomId=${room.id}&checkin=${checkin}&checkout=${checkout}&guests=${guests}`);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header Image */}
      <div className="relative h-[60vh] overflow-hidden">
        <img 
          src={room.imageUrl} 
          alt={room.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px]" />
        <div className="absolute top-8 left-8 md:left-12">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white bg-primary/50 hover:bg-primary px-4 py-2 text-xs uppercase tracking-widest font-bold backdrop-blur-md transition-all border border-white/20"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
        </div>
        <div className="absolute bottom-12 left-8 md:left-12 text-white">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs uppercase tracking-[0.2em] bg-accent text-primary px-3 py-1 font-bold">
              {room.type} Room
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif mb-2">{room.name}</h1>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <Map className="w-4 h-4 text-accent" />
            Apex of Manhattan, New York City
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 flex flex-col lg:flex-row gap-16 relative">
        <div className="flex-grow space-y-16">
          {/* Main Content */}
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-8 border-b border-slate-200">
              <h2 className="text-3xl font-serif text-primary">Overview</h2>
              <div className="flex gap-8">
                <div className="flex items-center gap-2">
                   <Users className="w-5 h-5 text-accent" />
                   <div>
                     <span className="text-[10px] block uppercase tracking-widest text-slate-400">Occupancy</span>
                     <span className="text-sm font-bold">{room.maxGuests} Guests</span>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                   <Wind className="w-5 h-5 text-accent" />
                   <div>
                     <span className="text-[10px] block uppercase tracking-widest text-slate-400">View</span>
                     <span className="text-sm font-bold">City Skyline</span>
                   </div>
                </div>
              </div>
            </div>
            
            <p className="text-slate-600 leading-relaxed text-lg italic font-serif">
              "{room.description}"
            </p>
            
            <div className="prose prose-slate max-w-none text-slate-600">
              <p>
                Each {room.name} at Aurum Grand Hotel is carefully designed to provide an atmosphere of relaxation and exclusivity. Our custom-designed furnishings and luxury linens ensure that every moment of your stay is wrapped in comfort.
              </p>
            </div>
          </div>

          {/* Amenities Grid */}
          <div className="space-y-8">
            <h2 className="text-3xl font-serif text-primary">In-Room Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-12">
              {room.amenities.map(feature => {
                const Icon = AMENITY_ICONS[feature] || Info;
                return (
                  <div key={feature} className="flex gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:border-accent group-hover:shadow-lg transition-all shrink-0">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-primary mb-1">{feature}</h4>
                      <p className="text-[10px] uppercase tracking-widest text-slate-400">Complimentary</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Policies */}
          <div className="bg-white p-10 border border-slate-100 shadow-sm space-y-8">
            <h2 className="text-3xl font-serif text-primary">Hotel Policies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <Clock className="w-6 h-6 text-accent shrink-0" />
                <div>
                  <h4 className="font-bold text-primary mb-2">Arrival & Departure</h4>
                  <ul className="text-sm text-slate-500 space-y-1">
                    <li>Check-in from 2:00 PM</li>
                    <li>Check-out by 12:00 PM</li>
                    <li>Late departure available upon request</li>
                  </ul>
                </div>
              </div>
              <div className="flex gap-4">
                <CigaretteOff className="w-6 h-6 text-accent shrink-0" />
                <div>
                  <h4 className="font-bold text-primary mb-2">Smoke-Free Retreat</h4>
                  <p className="text-sm text-slate-500">Aurum Grand is a strictly non-smoking property to maintain our luxury air quality standard.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <ShieldCheck className="w-6 h-6 text-accent shrink-0" />
                <div>
                  <h4 className="font-bold text-primary mb-2">Safe & Secure</h4>
                  <p className="text-sm text-slate-500">24/7 Concierge and security details ensure your absolute peace of mind during your residence.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Info className="w-6 h-6 text-accent shrink-0" />
                <div>
                  <h4 className="font-bold text-primary mb-2">Cancellation Policy</h4>
                  <p className="text-sm text-slate-500">Cancellations must be made 24 hours prior to arrival to avoid penalty.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Summary */}
        <aside className="w-full lg:w-[400px] shrink-0">
          <div className="bg-primary text-white p-8 md:p-10 sticky top-[100px] shadow-2xl border-t-8 border-accent">
            <h3 className="text-3xl font-serif mb-8 text-accent">Booking Summary</h3>
            
            <div className="space-y-6 pb-8 border-b border-white/10">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="checkin" className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">Check In</label>
                  <input 
                    id="checkin"
                    type="date" 
                    value={checkin}
                    onChange={(e) => handleDateChange('checkin', e.target.value)}
                    className="bg-white/10 border border-white/20 text-white text-sm font-bold p-2 w-full focus:outline-none focus:border-accent transition-colors [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label htmlFor="checkout" className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">Check Out</label>
                  <input 
                    id="checkout"
                    type="date" 
                    value={checkout}
                    onChange={(e) => handleDateChange('checkout', e.target.value)}
                    className="bg-white/10 border border-white/20 text-white text-sm font-bold p-2 w-full focus:outline-none focus:border-accent transition-colors [color-scheme:dark]"
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-widest text-white/50">Guests</span>
                <select 
                  value={guests}
                  onChange={(e) => handleGuestChange(Number(e.target.value))}
                  className="bg-transparent text-white text-sm font-bold focus:outline-none cursor-pointer border-b border-white/20 hover:border-accent transition-colors pb-1"
                >
                  {[...Array(room.maxGuests)].map((_, i) => (
                    <option key={i + 1} value={i + 1} className="bg-primary text-white">
                      {i + 1} {i + 1 === 1 ? 'Adult' : 'Adults'}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-widest text-white/50">Nights</span>
                <span className="text-sm font-bold">{nights} {nights === 1 ? 'Night' : 'Nights'}</span>
              </div>
            </div>

            <div className="py-8 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/80">RM {room.price} x {nights} nights</span>
                <span className="font-serif">RM {totalPrice}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-white/50">
                <span>Taxes & Fees</span>
                <span>Included</span>
              </div>
              <div className="pt-4 flex justify-between items-end">
                <span className="text-xl font-serif text-accent">Total</span>
                <span className="text-3xl font-serif text-accent tracking-tighter">RM {totalPrice}</span>
              </div>
            </div>

            <button 
              onClick={handleProceed}
              className="w-full bg-accent hover:bg-gold-dark text-primary py-4 font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 group mt-4 shadow-xl"
            >
              Reserve My Stay <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-[10px] text-center text-white/40 uppercase tracking-widest mt-6">
              Instant Confirmation & Safe Payment
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
