import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { format, addDays, isPast } from 'date-fns';
import { Calendar, Users, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { ROOMS } from '../data/rooms';

export default function HomePage() {
  const navigate = useNavigate();
  const [checkin, setCheckin] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [checkout, setCheckout] = useState(format(addDays(new Date(), 2), 'yyyy-MM-dd'));
  const [guests, setGuests] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/rooms?checkin=${checkin}&checkout=${checkout}&guests=${guests}`);
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 scale-105"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2000")',
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        >
          <div className="absolute inset-0 bg-primary/60 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 text-center text-white px-6 max-w-4xl">
          <motion.h4 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-accent uppercase tracking-[0.4em] text-sm md:text-base font-bold mb-4"
          >
            Welcome to the Apex of Elegance
          </motion.h4>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-8xl font-serif mb-8 leading-tight"
          >
            Aurum Grand Hotel
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white text-primary p-4 md:p-8 shadow-2xl max-w-5xl mx-auto border-t-4 border-accent mt-12"
          >
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex flex-col items-start gap-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Check In
                </label>
                <input 
                  type="date"
                  required
                  min={format(new Date(), 'yyyy-MM-dd')}
                  value={checkin}
                  onChange={(e) => setCheckin(e.target.value)}
                  className="w-full border-b border-slate-200 py-2 focus:outline-none focus:border-accent text-sm"
                />
              </div>
              <div className="flex flex-col items-start gap-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Check Out
                </label>
                <input 
                  type="date"
                  required
                  min={format(addDays(new Date(checkin), 1), 'yyyy-MM-dd')}
                  value={checkout}
                  onChange={(e) => setCheckout(e.target.value)}
                  className="w-full border-b border-slate-200 py-2 focus:outline-none focus:border-accent text-sm"
                />
              </div>
              <div className="flex flex-col items-start gap-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 flex items-center gap-1">
                  <Users className="w-3 h-3" /> Guests
                </label>
                <div className="w-full flex items-center border-b border-slate-200 py-2">
                  <select 
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full bg-transparent focus:outline-none text-sm appearance-none cursor-pointer"
                  >
                    {[1, 2, 3, 4].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button 
                type="submit"
                className="bg-primary hover:bg-slate-800 text-white font-bold uppercase tracking-widest text-sm py-4 transition-all flex items-center justify-center gap-2 group shadow-lg"
              >
                Find Rooms <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-24 px-6 md:px-12 bg-white flex flex-col md:flex-row items-center gap-16 overflow-hidden">
        <div className="w-full md:w-1/2 space-y-8">
          <h4 className="text-accent uppercase tracking-widest text-sm font-bold">Unparalleled Sophistication</h4>
          <h2 className="text-4xl md:text-5xl font-serif text-primary leading-tight">A Sanctuary in the Heart of Manhattan</h2>
          <p className="text-slate-600 leading-relaxed max-w-xl">
            Established in 1912, Aurum Grand Hotel combines historic charm with modern luxury. Each detail is curated to provide our guests with an unforgettable experience, from the hand-carved mahogany lobby to the panoramic views from our rooftop terrace.
          </p>
          <div className="grid grid-cols-2 gap-8 py-4 border-y border-slate-100 italic font-serif text-lg">
            <div>"Timeless elegance at every turn"</div>
            <div>"The finest service in the city"</div>
          </div>
        </div>
        <div className="w-full md:w-1/2 relative h-[500px]">
          <div className="absolute top-0 right-0 w-4/5 h-[400px] shadow-2xl z-20 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" alt="Luxury Hotel Interior" />
          </div>
          <div className="absolute bottom-0 left-0 w-3/5 h-[350px] shadow-2xl z-10 border-8 border-white overflow-hidden">
            <img src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" alt="Hotel Pool" />
          </div>
        </div>
      </section>

      {/* Rooms Preview Cards */}
      <section className="py-24 px-6 md:px-12 bg-slate-50">
        <div className="text-center mb-16 space-y-4">
          <h4 className="text-accent uppercase tracking-widest text-sm font-bold">Explore Our Retreats</h4>
          <h2 className="text-4xl md:text-5xl font-serif text-primary">Luxury Accommodations</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {ROOMS.map((room) => (
            <div key={room.id} className="bg-white group overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 flex flex-col">
              <div className="h-72 overflow-hidden relative">
                <img 
                  src={room.imageUrl} 
                  alt={room.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute top-4 right-4 bg-primary text-accent px-4 py-1 text-[10px] uppercase tracking-widest font-bold">
                  {room.type}
                </div>
              </div>
              <div className="p-8 space-y-4 flex-grow flex flex-col">
                <h3 className="text-2xl font-serif text-primary">{room.name}</h3>
                <p className="text-slate-500 text-sm leading-relaxed flex-grow">{room.description}</p>
                <div className="pt-6 border-t border-slate-100 flex justify-between items-center mt-auto">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-slate-400 block mb-1">From</span>
                    <p className="text-xl font-bold font-serif text-primary tracking-tighter">RM {room.price} <span className="text-sm font-normal text-slate-400">/ night</span></p>
                  </div>
                  <Link 
                    to={`/rooms?checkin=${checkin}&checkout=${checkout}&guests=${guests}`}
                    className="text-xs uppercase tracking-widest font-bold text-accent hover:text-gold-dark flex items-center gap-1 group/btn"
                  >
                    View Details <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section className="luxury-gradient py-24 px-6 md:px-12 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 flex flex-col justify-around text-8xl font-serif italic select-none">
          <span>Elegance</span>
          <span>Comfort</span>
          <span>Serenity</span>
        </div>
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-serif leading-tight">Every Amenity, Redefined for Your Comfort</h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-10">
              <div className="space-y-2">
                <div className="w-8 h-[1px] bg-accent" />
                <h4 className="font-serif text-xl">Private Spa</h4>
                <p className="text-white/60 text-sm">Exclusive access to our award-winning serene retreat.</p>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-[1px] bg-accent" />
                <h4 className="font-serif text-xl">Fine Dining</h4>
                <p className="text-white/60 text-sm">Michelin-star cuisine served in breath-taking settings.</p>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-[1px] bg-accent" />
                <h4 className="font-serif text-xl">Butler Service</h4>
                <p className="text-white/60 text-sm">Personalized attention for every aspect of your stay.</p>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-[1px] bg-accent" />
                <h4 className="font-serif text-xl">City Views</h4>
                <p className="text-white/60 text-sm">Panoramic vistas of Manhattan's iconic skyline.</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4 pt-12">
              <img src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1000" className="w-full h-64 object-cover shadow-2xl" alt="Hotel Amenity 1" />
              <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1000" className="w-full h-80 object-cover shadow-2xl" alt="Hotel Amenity 2" />
            </div>
            <div className="space-y-4">
              <img src="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&q=80&w=1000" className="w-full h-80 object-cover shadow-2xl" alt="Hotel Amenity 3" />
              <img src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1000" className="w-full h-64 object-cover shadow-2xl" alt="Hotel Amenity 4" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
