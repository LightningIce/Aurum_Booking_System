import { useState, useRef, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { 
  History, Calendar, Hotel, AlertCircle, XCircle, 
  MapPin, Clock, ArrowLeft, User, Trash2, ShieldAlert,
  FileText, Printer, CheckCircle2, Phone, Mail, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import { getBookings, updateBookingStatus } from '../utils/bookingStorage';
import { Booking } from '../types';
import { ROOMS } from '../data/rooms';
import { cn } from '../lib/utils';

export default function MyBookingsPage() {
  const [searchRef, setSearchRef] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [foundBooking, setFoundBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const detailRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const match = await getBookings().then(bookings => bookings.find(b => b.bookingId.toLowerCase() === searchRef.trim().toLowerCase()));

    if (match) {
      setFoundBooking(match);
    } else {
      setError('No booking found with that reference. Please check and try again.');
    }
    setIsLoading(false);
  };

  const handleBackToSearch = () => {
    setFoundBooking(null);
    setSearchRef('');
    setError(null);
    setConfirmCancel(false);
  };

  const handleCancelBooking = async () => {
    if (!foundBooking) return;
    
    setIsUpdating(true);
    
    await updateBookingStatus(foundBooking.bookingId, 'cancelled');
    
    // Update local state
    setFoundBooking({ ...foundBooking, status: 'cancelled' });
    setConfirmCancel(false);
    setIsUpdating(false);
  };

  const downloadPDF = () => {
    if (!foundBooking) return;

    const doc = new jsPDF();
    const margin = 20;
    let y = 30;

    // Header
    doc.setFontSize(22);
    doc.text('AURUM GRAND HOTEL', margin, y);
    y += 10;
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('LUXURY RESIDENCE RECEIPT', margin, y);
    
    y += 20;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text(`Booking Reference: ${foundBooking.bookingId}`, margin, y);
    y += 10;
    doc.setFontSize(10);
    doc.text(`Status: ${foundBooking.status.toUpperCase()}`, margin, y);
    y += 15;

    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, 190, y);
    y += 15;

    // Details Grid
    doc.text('GUEST DETAILS', margin, y);
    doc.text('STAY DETAILS', 110, y);
    
    y += 10;
    doc.text(`Name: ${foundBooking.guestName}`, margin, y);
    doc.text(`Room: ${foundBooking.roomName}`, 110, y);
    y += 7;
    doc.text(`Email: ${foundBooking.guestEmail}`, margin, y);
    doc.text(`Check-in: ${format(parseISO(foundBooking.checkin), 'MMM dd, yyyy')}`, 110, y);
    y += 7;
    doc.text(`Phone: ${foundBooking.guestPhone}`, margin, y);
    doc.text(`Check-out: ${format(parseISO(foundBooking.checkout), 'MMM dd, yyyy')}`, 110, y);
    y += 7;
    doc.text(`Guests: ${foundBooking.guests}`, 110, y);

    y += 20;
    doc.line(margin, y, 190, y);
    y += 15;

    doc.setFontSize(16);
    doc.text(`Total Paid: RM ${foundBooking.totalPrice}`, margin, y);
    
    y += 20;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('This is a computer-generated confirmation for your records.', margin, y);

    doc.save(`AurumGrand-Booking-${foundBooking.bookingId}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-6 md:px-12 print:bg-white print:p-0">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {!foundBooking ? (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-6xl font-serif text-primary">Find Your Booking</h1>
                <p className="text-slate-500 uppercase tracking-[0.3em] text-xs font-bold">Enter your booking reference to view your booking details.</p>
              </div>

              <div className="bg-white p-8 md:p-12 shadow-xl border border-slate-100 max-w-xl mx-auto">
                <form onSubmit={handleSearch} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="bookingRef" className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Booking Reference</label>
                    <input 
                      id="bookingRef"
                      type="text" 
                      placeholder="e.g. AGH-U6JWZSCC8"
                      value={searchRef}
                      onChange={(e) => setSearchRef(e.target.value.toUpperCase())}
                      className="w-full bg-slate-50 border border-slate-200 px-6 py-4 text-primary focus:outline-none focus:border-accent transition-all font-mono tracking-widest text-center"
                      required
                    />
                  </div>
                  
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="flex items-center gap-3 p-4 bg-red-50 text-red-600 text-sm border border-red-100"
                    >
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <p>{error}</p>
                    </motion.div>
                  )}

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary text-white py-5 font-bold uppercase tracking-[0.2em] text-xs hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 disabled:bg-slate-300 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Searching...' : 'Search Booking'}
                  </button>
                </form>
              </div>

              <div className="text-center">
                 <Link to="/rooms" className="text-[10px] uppercase tracking-widest font-bold text-accent hover:underline inline-flex items-center gap-2">
                   Plan a new residence <ArrowLeft className="w-3 h-3 rotate-180" />
                 </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
                <button 
                  onClick={handleBackToSearch}
                  className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-[10px] uppercase font-bold tracking-widest"
                >
                  <ArrowLeft className="w-4 h-4" /> Search Again
                </button>

                <div className="flex gap-4">
                  <button 
                    onClick={downloadPDF}
                    className="flex items-center gap-2 bg-white border border-slate-200 px-6 py-2.5 text-[10px] uppercase font-bold tracking-widest hover:bg-slate-50 transition-all shadow-sm"
                  >
                    <FileText className="w-4 h-4 text-accent" /> Download PDF
                  </button>
                  <button 
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-white border border-slate-200 px-6 py-2.5 text-[10px] uppercase font-bold tracking-widest hover:bg-slate-50 transition-all shadow-sm"
                  >
                    <Printer className="w-4 h-4 text-accent" /> Print
                  </button>
                </div>
              </div>

              <div id="booking-receipt" ref={detailRef} className="bg-white shadow-2xl overflow-hidden border border-slate-100 print:shadow-none print:border-none">
                {/* Status Bar */}
                <div className={cn(
                  "p-4 text-center text-white text-[10px] uppercase tracking-[0.4em] font-bold",
                  foundBooking.status === 'confirmed' ? "bg-green-600" : "bg-red-600"
                )}>
                  Booking {foundBooking.status}
                </div>

                <div className="p-10 md:p-16 space-y-16">
                  {/* Header */}
                  <div className="flex flex-col md:flex-row justify-between gap-12 pb-12 border-b border-slate-100">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                         <div className="bg-primary p-3 rounded-sm shadow-lg">
                           <Hotel className="w-8 h-8 text-accent" />
                         </div>
                         <div>
                            <h2 className="text-3xl font-serif text-primary uppercase tracking-tighter">Aurum Grand</h2>
                            <p className="text-[10px] text-accent uppercase tracking-widest font-bold">Luxury Collection Resort</p>
                         </div>
                      </div>
                      <div className="space-y-1 text-sm text-slate-500">
                        <p>123 Golden Avenue</p>
                        <p>Luxury District, NY 10001</p>
                        <p>+1 (555) 234-5678</p>
                      </div>
                    </div>

                    <div className="text-left md:text-right space-y-2">
                       <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">Reference No</span>
                       <h3 className="text-3xl font-mono text-primary tracking-tighter">{foundBooking.bookingId}</h3>
                       <p className="text-xs text-slate-400 mt-2">
                         Reserved on {format(parseISO(foundBooking.createdAt), 'MMM dd, yyyy HH:mm')}
                       </p>
                    </div>
                  </div>

                  {/* Room Info */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="relative group overflow-hidden h-64 md:h-80 shadow-2xl">
                      <img 
                        src={ROOMS.find(r => r.id === foundBooking.roomId)?.imageUrl || `https://images.unsplash.com/photo-1590490360182-c33d5733427?auto=format&fit=crop&q=80&w=1000`}
                        alt={foundBooking.roomName} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-6 flex flex-col justify-end">
                         <span className="text-accent text-[10px] uppercase tracking-widest font-bold">{foundBooking.roomType}</span>
                         <h4 className="text-white text-2xl font-serif">{foundBooking.roomName}</h4>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-8">
                          <div className="space-y-1">
                             <span className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                               <Calendar className="w-3 h-3 text-accent" /> Check-In
                             </span>
                             <p className="font-serif text-xl text-primary">{format(parseISO(foundBooking.checkin), 'eee, MMM dd, yyyy')}</p>
                          </div>
                          <div className="space-y-1">
                             <span className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                               <Clock className="w-3 h-3 text-accent" /> Arrival time
                             </span>
                             <p className="text-sm font-bold text-slate-600">Standard Check-in 15:00</p>
                          </div>
                          <div className="space-y-1">
                             <span className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                               <User className="w-3 h-3 text-accent" /> Guests
                             </span>
                             <p className="text-sm font-bold text-slate-600">{foundBooking.guests} Adults</p>
                          </div>
                       </div>
                       <div className="space-y-8">
                          <div className="space-y-1">
                             <span className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                               <Calendar className="w-3 h-3 text-accent" /> Check-Out
                             </span>
                             <p className="font-serif text-xl text-primary">{format(parseISO(foundBooking.checkout), 'eee, MMM dd, yyyy')}</p>
                          </div>
                          <div className="space-y-1">
                             <span className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                               <History className="w-3 h-3 text-accent" /> Stay Duration
                             </span>
                             <p className="text-sm font-bold text-slate-600">{foundBooking.nights} Night{foundBooking.nights > 1 ? 's' : ''}</p>
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* Guest Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-slate-50">
                    <div className="space-y-6">
                       <h5 className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold">Guest Particulars</h5>
                       <div className="space-y-4">
                          <div className="flex items-start gap-4">
                             <User className="w-4 h-4 text-slate-300 mt-1" />
                             <div>
                                <p className="text-[10px] uppercase tracking-widest text-slate-400">Full Name</p>
                                <p className="font-bold text-primary">{foundBooking.guestName}</p>
                             </div>
                          </div>
                          <div className="flex items-start gap-4">
                             <Mail className="w-4 h-4 text-slate-300 mt-1" />
                             <div>
                                <p className="text-[10px] uppercase tracking-widest text-slate-400">Email Address</p>
                                <p className="font-bold text-primary">{foundBooking.guestEmail}</p>
                             </div>
                          </div>
                          <div className="flex items-start gap-4">
                             <Phone className="w-4 h-4 text-slate-300 mt-1" />
                             <div>
                                <p className="text-[10px] uppercase tracking-widest text-slate-400">Phone Contact</p>
                                <p className="font-bold text-primary">{foundBooking.guestPhone}</p>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <h5 className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold">Additional Notes</h5>
                       <div className="flex items-start gap-4 p-6 bg-slate-50 border border-slate-100 italic text-sm text-slate-500 leading-relaxed min-h-[120px]">
                          <p>{foundBooking.specialRequests || "No special requests specified."}</p>
                       </div>
                    </div>
                  </div>

                  {/* Total Bar */}
                  <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-slate-100 bg-slate-50/50 -mx-10 md:-mx-16 px-10 md:px-16 py-12">
                     <div className="text-center md:text-left space-y-2">
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent">Payment Settled</span>
                        <h4 className="text-4xl md:text-5xl font-serif text-primary tracking-tighter">RM {foundBooking.totalPrice}</h4>
                        <p className="text-xs text-slate-400">Processed securely via Aurum Pay</p>
                     </div>
                     <div className="flex flex-col items-center md:items-end gap-2">
                        <div className="flex items-center gap-2 text-green-600 font-bold uppercase tracking-widest text-xs">
                           <CheckCircle2 className="w-5 h-5" /> Secured Residence
                        </div>
                        <p className="text-[10px] text-slate-300 uppercase tracking-widest">Taxes and fees included</p>
                     </div>
                  </div>
                </div>
              </div>

              {/* Cancellation Area */}
              {foundBooking.status === 'confirmed' && (
                <div className="bg-white p-10 md:p-12 shadow-xl border-t-4 border-red-500 flex flex-col items-center text-center space-y-6 print:hidden">
                   <div className="space-y-2">
                     <h3 className="text-2xl font-serif text-primary">Need to change your plans?</h3>
                     <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                       You can cancel your reservation before the arrival date. Please note that this action is immediate and cannot be reversed.
                     </p>
                   </div>

                   <AnimatePresence mode="wait">
                     {!confirmCancel ? (
                       <motion.button 
                         key="cancel-btn"
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         exit={{ opacity: 0 }}
                         onClick={() => setConfirmCancel(true)}
                         className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-red-500 hover:text-red-700 transition-colors border-b border-red-200 pb-1"
                       >
                         Request Cancellation
                       </motion.button>
                     ) : (
                       <motion.div 
                         key="confirm-area"
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0 }}
                         className="space-y-4"
                       >
                         <p className="text-xs font-bold text-red-600 tracking-widest uppercase">Are you sure? This cannot be undone.</p>
                         <div className="flex gap-4">
                           <button 
                             onClick={handleCancelBooking}
                             disabled={isUpdating}
                             className="bg-red-600 text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-50"
                           >
                             {isUpdating ? "Processing..." : "Yes, Confirm Cancellation"}
                           </button>
                           <button 
                             onClick={() => setConfirmCancel(false)}
                             disabled={isUpdating}
                             className="bg-slate-100 text-primary px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 transition-all"
                           >
                             Nevermind
                           </button>
                         </div>
                       </motion.div>
                     )}
                   </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          nav, footer { display: none !important; }
          #booking-receipt { box-shadow: none !important; border: none !important; margin: 0 !important; width: 100% !important; }
          .print:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}
