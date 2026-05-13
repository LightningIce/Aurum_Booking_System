import React from 'react';
import { User, Mail, Phone, MessageSquare, ArrowRight } from 'lucide-react';

interface GuestDetails {
  fullName: string;
  email: string;
  phone: string;
  specialRequests: string;
}

interface GuestDetailsFormProps {
  guestDetails: GuestDetails;
  setGuestDetails: (details: GuestDetails) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function GuestDetailsForm({ guestDetails, setGuestDetails, onSubmit }: GuestDetailsFormProps) {
  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Full Name</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            required
            value={guestDetails.fullName}
            onChange={e => setGuestDetails({...guestDetails, fullName: e.target.value})}
            placeholder="Johnathan Doe"
            className="w-full border border-slate-200 py-3 pl-10 pr-4 focus:outline-none focus:border-accent text-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="email" 
            required
            value={guestDetails.email}
            onChange={e => setGuestDetails({...guestDetails, email: e.target.value})}
            placeholder="john@example.com"
            className="w-full border border-slate-200 py-3 pl-10 pr-4 focus:outline-none focus:border-accent text-sm"
          />
        </div>
      </div>

      <div className="space-y-2 md:col-span-2">
        <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Phone Number</label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="tel" 
            required
            value={guestDetails.phone}
            onChange={e => setGuestDetails({...guestDetails, phone: e.target.value})}
            placeholder="+1 (555) 000-0000"
            className="w-full border border-slate-200 py-3 pl-10 pr-4 focus:outline-none focus:border-accent text-sm"
          />
        </div>
      </div>

      <div className="space-y-2 md:col-span-2">
        <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Special Requests (Optional)</label>
        <div className="relative">
          <MessageSquare className="absolute left-3 top-4 w-4 h-4 text-slate-400" />
          <textarea 
            rows={4}
            value={guestDetails.specialRequests}
            onChange={e => setGuestDetails({...guestDetails, specialRequests: e.target.value})}
            placeholder="Allergies, high floor preference, champagne on arrival..."
            className="w-full border border-slate-200 py-3 pl-10 pr-4 focus:outline-none focus:border-accent text-sm"
          />
        </div>
      </div>

      <div className="md:col-span-2 pt-6">
        <button 
          type="submit"
          className="bg-primary hover:bg-slate-800 text-white py-4 px-12 font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-2 group ml-auto"
        >
          Next: Payment <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </form>
  );
}