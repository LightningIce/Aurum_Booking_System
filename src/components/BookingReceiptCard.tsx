import React, { forwardRef } from 'react';
import { format, parseISO } from 'date-fns';
import { User, Phone, MailIcon, ShieldCheck, CheckCircle2, Info } from 'lucide-react';
import { Booking } from '../types';

interface BookingReceiptCardProps {
  booking: Booking;
}

const BookingReceiptCard = forwardRef<HTMLDivElement, BookingReceiptCardProps>(({ booking }, ref) => {
  return (
    <div ref={ref} className="bg-white shadow-2xl border border-slate-100 overflow-hidden print:shadow-none print:border-none">
      {/* Status Header */}
      <div className="bg-primary text-white p-12 text-center space-y-6 relative overflow-hidden print:bg-primary print:text-black print:[color-adjust:exact] print:[-webkit-print-color-adjust:exact]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full -translate-y-1/2 translate-x-1/2 print:hidden" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 print:hidden" />
        
        <div className="flex justify-center mb-4 relative z-10">
          <div className="w-20 h-20 bg-accent text-primary rounded-full flex items-center justify-center shadow-2xl">
            <CheckCircle2 className="w-12 h-12" />
          </div>
        </div>
        <div className="space-y-2 relative z-10">
          <h1 className="text-4xl font-serif">Reservation Confirmed</h1>
          <p className="text-white/60 text-sm uppercase tracking-[0.3em] font-bold">Thank you for choosing Aurum Grand Hotel</p>
        </div>
        <div className="inline-block bg-white/10 px-8 py-3 rounded-full backdrop-blur-sm border border-white/10 relative z-10">
          <span className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">Booking Reference</span>
          <p className="text-xl font-serif tracking-widest text-accent">{booking.bookingId}</p>
        </div>
      </div>

      <div className="p-8 md:p-12 space-y-12">
        {/* Quick Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-xl font-serif text-primary border-b border-slate-100 pb-2">Guest Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-accent" />
                <span className="text-sm font-bold">{booking.guestName}</span>
              </div>
              <div className="flex items-center gap-3">
                <MailIcon className="w-4 h-4 text-accent" />
                <span className="text-sm">{booking.guestEmail}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-accent" />
                <span className="text-sm">{booking.guestPhone}</span>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="text-xl font-serif text-primary border-b border-slate-100 pb-2">Stay Details</h3>
            <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 uppercase tracking-widest text-[10px] font-bold">Room</span>
                  <span className="font-bold">{booking.roomName}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 uppercase tracking-widest text-[10px] font-bold">Dates</span>
                  <span className="font-bold">{format(parseISO(booking.checkin), 'MMM dd')} - {format(parseISO(booking.checkout), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 uppercase tracking-widest text-[10px] font-bold">Guests</span>
                  <span className="font-bold">{booking.guests} Guests</span>
                </div>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-slate-50 p-8 rounded-sm space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400 italic">Prepaid Residence Rate (RM {booking.totalPrice / booking.nights} x {booking.nights} nights)</span>
            <span className="font-serif">RM {booking.totalPrice}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400 italic">Luxury Service Fee & Taxes</span>
            <span className="font-serif">Included</span>
          </div>
          <div className="pt-4 border-t border-slate-200 flex justify-between items-end">
            <div>
                <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">Total Amount Paid</h4>
                <span className="text-sm font-bold text-green-600 uppercase tracking-widest flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Processed Successfully
                </span>
            </div>
            <span className="text-4xl font-serif text-primary tracking-tighter">RM {booking.totalPrice}</span>
          </div>
        </div>

        {/* Important Info */}
        <div className="flex gap-4 p-6 border-l-4 border-accent bg-slate-50">
            <Info className="w-6 h-6 text-accent shrink-0" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-primary">A copy of this confirmation has been sent to your email.</h4>
              <p className="text-xs text-slate-500 leading-relaxed uppercase tracking-widest">Please present your reference number at the front desk upon arrival. Check-in begins at 2:00 PM local time.</p>
            </div>
        </div>
      </div>
    </div>
  );
});

BookingReceiptCard.displayName = 'BookingReceiptCard';

export default BookingReceiptCard;