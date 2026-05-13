import { Link } from 'react-router-dom';
import { Hotel } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-primary text-white py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50 shadow-lg border-b border-accent/20">
      <Link to="/" className="flex items-center gap-2 group">
        <Hotel className="w-8 h-8 text-accent group-hover:scale-110 transition-transform" />
        <span className="text-xl md:text-2xl font-serif tracking-widest uppercase">
          Aurum <span className="text-accent">Grand</span>
        </span>
      </Link>
      
      <div className="flex items-center gap-6 md:gap-10">
        <Link to="/about" className="text-sm uppercase tracking-widest hover:text-accent transition-colors">About Us</Link>
        <Link to="/offers" className="text-sm uppercase tracking-widest hover:text-accent transition-colors">Special Offers</Link>
        <Link to="/my-booking" className="text-sm uppercase tracking-widest hover:text-accent transition-colors">My Bookings</Link>
        <Link 
          to="/rooms" 
          className="hidden md:block bg-accent hover:bg-gold-dark text-primary px-6 py-2 text-sm uppercase tracking-widest font-bold transition-all"
        >
          Book Now
        </Link>
      </div>
    </nav>
  );
}
