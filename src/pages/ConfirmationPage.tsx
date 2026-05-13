import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ChevronRight, Download, Printer, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { supabase } from '../lib/supabaseClient';
import BookingReceiptCard from '../components/BookingReceiptCard';
import { Booking } from '../types';

export default function ConfirmationPage() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadBooking() {
      if (!bookingId) return;
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('booking_reference', bookingId)
        .single();
      
      if (!error && data) {
        setBooking({
          bookingId: data.booking_reference,
          roomId: data.room_id,
          roomName: data.room_name,
          roomType: data.room_type,
          checkin: data.checkin,
          checkout: data.checkout,
          nights: data.nights,
          guests: data.guests,
          totalPrice: Number(data.total_price),
          guestName: data.guest_name,
          guestEmail: data.guest_email,
          guestPhone: data.guest_phone,
          specialRequests: data.special_requests,
          status: data.status,
          createdAt: data.created_at
        });
      }
      setIsLoading(false);
    }
    loadBooking();
  }, [bookingId]);

  if (isLoading) {
    return (
      <div className="bg-slate-50 min-h-screen py-24 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
      </div>
    );
  }

  if (!booking) {
    return <Navigate to="/" />;
  }

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;
    try {
      const canvas = await html2canvas(receiptRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${booking.bookingId}-receipt.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF', error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-50 min-h-screen py-24 px-6 md:px-12 flex items-center justify-center print:bg-white print:py-0 print:px-0">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full print:max-w-none print:shadow-none"
      >
        <BookingReceiptCard ref={receiptRef} booking={booking} />

        <div className="bg-white px-8 md:px-12 pb-12 rounded-b-sm print:hidden">
            {/* Actions */}
            <div className="flex flex-col md:flex-row gap-4 justify-center">
               <Link
                 to="/my-booking"
                 className="flex items-center justify-center gap-2 border border-primary px-8 py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-primary hover:text-white transition-all"
               >
                 View My Bookings
               </Link>
               <Link
                 to="/"
                 className="flex items-center justify-center gap-2 bg-accent px-8 py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-gold-dark text-primary transition-all shadow-lg"
               >
                 Back to Home <ChevronRight className="w-4 h-4" />
               </Link>
            </div>
            
            <div className="flex justify-center gap-8 pt-4">
               <button 
                 onClick={handleDownloadPDF}
                 className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 hover:text-primary"
               >
                  <Download className="w-3 h-3" /> Save PDF
               </button>
               <button 
                 onClick={handlePrint}
                 className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 hover:text-primary"
               >
                  <Printer className="w-3 h-3" /> Print
               </button>
            </div>
        </div>
      </motion.div>
    </div>
  );
}
