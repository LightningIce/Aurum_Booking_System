import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Hotel, Phone, Mail, MapPin, Instagram, Facebook, Twitter, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleJoin = () => {
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    // Success
    setStatus('success');
    setIsModalOpen(true);
    setEmail('');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('idle');
    }, 3000);
  };
  return (
    <footer className="bg-primary text-white/80 pt-16 pb-8 border-t border-accent/20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Hotel className="w-6 h-6 text-accent" />
            <span className="text-xl font-serif tracking-widest uppercase text-white">
              Aurum <span className="text-accent">Grand</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed">
            Experience the pinnacle of luxury at Aurum Grand Hotel. Where timeless elegance meets modern sophistication in the heart of the city.
          </p>
          <div className="flex gap-4 pt-2">
            <Facebook className="w-5 h-5 hover:text-accent cursor-pointer" />
            <Instagram className="w-5 h-5 hover:text-accent cursor-pointer" />
            <Twitter className="w-5 h-5 hover:text-accent cursor-pointer" />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-white font-serif text-lg tracking-wide">Contact Us</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-accent shrink-0" />
              <span>123 Golden Avenue, Luxury District, NY 10001</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-accent shrink-0" />
              <span>+1 (555) 234-5678</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-accent shrink-0" />
              <span>reservations@aurumgrand.com</span>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-white font-serif text-lg tracking-wide">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-accent">About Us</Link></li>
            <li><Link to="/dining" className="hover:text-accent">Dine & Drink</Link></li>
            <li><Link to="/spa" className="hover:text-accent">Spa & Wellness</Link></li>
            <li><Link to="/meetings" className="hover:text-accent">Meetings & Events</Link></li>
            <li><Link to="/offers" className="hover:text-accent">Special Offers</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-white font-serif text-lg tracking-wide">Newsletter</h4>
          <p className="text-sm leading-relaxed">Subscribe to receive updates and exclusive offers.</p>
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex">
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`bg-white/10 border ${status === 'error' ? 'border-red-500' : 'border-white/20'} px-4 py-2 text-sm w-full focus:outline-none focus:border-accent transition-colors`}
              />
              <button 
                onClick={handleJoin}
                className="bg-accent text-primary px-4 py-2 text-sm font-bold uppercase tracking-widest hover:bg-gold-dark transition-colors shrink-0"
              >
                Join
              </button>
            </div>
            {status === 'error' && (
              <p className="text-[10px] text-red-400 uppercase tracking-widest font-bold">Please enter a valid email address</p>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white text-primary p-8 md:p-12 max-w-md w-full shadow-2xl text-center border-t-4 border-accent"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex justify-center mb-6">
                <div className="bg-accent/10 p-4 rounded-full">
                  <CheckCircle2 className="w-12 h-12 text-accent" />
                </div>
              </div>
              
              <h3 className="text-3xl font-serif mb-4">Welcome to the Club</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Thank you for subscribing! You'll be the first to receive our stories, exclusive offers, and invitations to our private events.
              </p>
              
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-primary text-white py-4 font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors"
              >
                Start Exploring
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs tracking-widest uppercase">
        <p>&copy; {new Date().getFullYear()} Aurum Grand Hotel. All rights reserved.</p>
        <div className="flex gap-8">
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
