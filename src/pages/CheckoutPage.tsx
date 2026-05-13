import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { format, differenceInDays, parseISO } from 'date-fns';
import { 
  ShieldCheck, Lock, CreditCard, ChevronLeft, CheckCircle2, Loader2, Calendar, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ROOMS } from '../data/rooms';
import { supabase } from '../lib/supabaseClient';
import { generateBookingReference } from '../utils/bookingReference';
import { calculatePricing } from '../utils/pricing';
import { Booking } from '../types';
import { cn } from '../lib/utils';
import GuestDetailsForm from '../components/GuestDetailsForm';
import PaymentForm from '../components/PaymentForm';

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const roomId = searchParams.get('roomId');
  const checkin = searchParams.get('checkin') || '';
  const checkout = searchParams.get('checkout') || '';
  const guests = Number(searchParams.get('guests')) || 1;

  const room = ROOMS.find(r => r.id === roomId);

  const [step, setStep] = useState<1 | 2>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [perksApplied, setPerksApplied] = useState(false);
  const [isApplyingPerks, setIsApplyingPerks] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [membershipCode, setMembershipCode] = useState('');
  const [codeError, setCodeError] = useState(false);

  // Form States
  const [guestDetails, setGuestDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialRequests: ''
  });

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const nights = useMemo(() => {
    if (!checkin || !checkout) return 0;
    return differenceInDays(parseISO(checkout), parseISO(checkin));
  }, [checkin, checkout]);

  const { basePrice, discount, totalPrice } = useMemo(() => {
    return calculatePricing(room ? room.price : 0, nights, perksApplied);
  }, [room, nights, perksApplied]);

  const handleApplyPerks = async () => {
    if (!showCodeInput) {
      setShowCodeInput(true);
      return;
    }

    setIsApplyingPerks(true);
    setCodeError(false);
    
    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (membershipCode === '1234') {
      setPerksApplied(true);
      setShowCodeInput(false);
    } else {
      setCodeError(true);
    }
    setIsApplyingPerks(false);
  };

  if (!room) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-3xl font-serif mb-4">No room selected</h2>
        <Link to="/rooms" className="text-accent underline">Back to rooms</Link>
      </div>
    );
  }

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setSubmitError(null);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2500));

    const bookingId = generateBookingReference();
    
    // Save to Supabase
    const { error } = await supabase.from('bookings').insert([{
      booking_reference: bookingId,
      room_id: room.id,
      room_name: room.name,
      room_type: room.type,
      checkin: checkin,
      checkout: checkout,
      nights: nights,
      guests: guests,
      total_price: totalPrice,
      guest_name: guestDetails.fullName,
      guest_email: guestDetails.email,
      guest_phone: guestDetails.phone,
      special_requests: guestDetails.specialRequests,
      status: 'confirmed'
    }]);

    if (error) {
      console.error('Failed to save booking to Supabase:', error);
      setSubmitError('Failed to confirm your booking. Please try again.');
      setIsProcessing(false);
      return;
    }

    try {
      // Calling EmailJS directly from the client to skip backend 404s
      await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: import.meta.env.VITE_EMAILJS_SERVICE_ID,
          template_id: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          user_id: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
          template_params: {
            to_email: guestDetails.email,
            guest_name: guestDetails.fullName,
            booking_id: bookingId,
            room_name: room.name,
            checkin_date: checkin,
            checkout_date: checkout,
            nights_count: nights,
            guests_count: guests,
            total_price: totalPrice
          }
        }),
      });
    } catch (emailError) {
      // Non-blocking, just log the error and continue
      console.error('Failed to trigger email receipt via /api/send-receipt', emailError);
    }

    setIsProcessing(false);
    navigate(`/confirmation/${bookingId}`);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Checkout Header */}
      <div className="bg-primary text-white py-12 px-6 md:px-12 text-center border-b border-accent/20">
        <div className="max-w-7xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif">Complete Reservation</h1>
          <div className="flex justify-center items-center gap-8 text-[10px] uppercase tracking-[0.3em] font-bold">
            <div className={cn("flex items-center gap-2", step === 1 ? "text-accent" : "text-white/50")}>
              <span className={cn("w-6 h-6 border flex items-center justify-center rounded-full", step === 1 ? "border-accent" : "border-white/20")}>1</span> Guest Info
            </div>
            <div className="w-12 h-[1px] bg-white/10" />
            <div className={cn("flex items-center gap-2", step === 2 ? "text-accent" : "text-white/50")}>
              <span className={cn("w-6 h-6 border flex items-center justify-center rounded-full", step === 2 ? "border-accent" : "border-white/20")}>2</span> Payment
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2">
          {isProcessing ? (
            <div className="bg-white p-12 md:p-24 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center space-y-8 animate-pulse">
              <Loader2 className="w-16 h-16 text-accent animate-spin" />
              <div className="space-y-4">
                <h2 className="text-3xl font-serif text-primary">Processing Payment...</h2>
                <p className="text-slate-500 italic">Connecting to luxury gateway. Please do not refresh.</p>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white p-8 md:p-12 shadow-sm border border-slate-100 space-y-10"
                >
                  <div className="flex justify-between items-center pb-6 border-b border-slate-100">
                    <h2 className="text-3xl font-serif text-primary">Guest Details</h2>
                    <ShieldCheck className="w-8 h-8 text-accent/20" />
                  </div>

                  <GuestDetailsForm 
                    guestDetails={guestDetails}
                    setGuestDetails={setGuestDetails}
                    onSubmit={handleGuestSubmit}
                  />
                </motion.div>
              ) : (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white p-8 md:p-12 shadow-sm border border-slate-100 space-y-10"
                >
                  <div className="flex justify-between items-center pb-6 border-b border-slate-100">
                    <div>
                      <h2 className="text-3xl font-serif text-primary">Payment Details</h2>
                      <div className="flex items-center gap-2 mt-1 text-xs text-green-600 font-bold uppercase tracking-widest">
                        <Lock className="w-3 h-3" /> Secure 256-bit SSL encrypted
                      </div>
                    </div>
                    <CreditCard className="w-8 h-8 text-accent/20" />
                  </div>

                  <PaymentForm 
                    paymentDetails={paymentDetails}
                    setPaymentDetails={setPaymentDetails}
                    onSubmit={handlePaymentSubmit}
                    onBack={() => setStep(1)}
                    totalPrice={totalPrice}
                  />

                  {submitError && (
                    <div className="mt-6 p-4 bg-red-50 text-red-600 border border-red-200 text-sm">
                      {submitError}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Aside Summary */}
        <aside className="space-y-8">
           <div className="bg-white p-8 shadow-sm border border-slate-100 space-y-8">
             <h3 className="text-2xl font-serif text-primary border-b border-slate-50 pb-4">Your Retreat</h3>
             <div className="flex gap-4 items-center">
               <img src={room.imageUrl} className="w-24 h-24 object-cover shadow-md" alt={room.name} />
               <div>
                  <p className="text-[10px] uppercase tracking-widest text-accent font-bold">{room.type}</p>
                  <h4 className="font-serif text-lg text-primary">{room.name}</h4>
                  <p className="text-xs text-slate-400 capitalize">{nights} {nights === 1 ? 'Night' : 'Nights'} &bull; {guests} {guests === 1 ? 'Guest' : 'Guests'}</p>
               </div>
             </div>

             <div className="space-y-3 pt-6 border-t border-slate-50">
                <div className="flex justify-between items-center text-sm">
                   <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-widest text-slate-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> Check In</span>
                      <span className="font-bold">{format(parseISO(checkin), 'MMM dd, yyyy')}</span>
                   </div>
                   <ArrowRight className="w-4 h-4 text-slate-200" />
                   <div className="flex flex-col gap-1 text-right">
                      <span className="text-[10px] uppercase tracking-widest text-slate-400 flex items-center gap-1 justify-end"><Calendar className="w-3 h-3" /> Check Out</span>
                      <span className="font-bold">{format(parseISO(checkout), 'MMM dd, yyyy')}</span>
                   </div>
                </div>
             </div>

             <div className="space-y-3 pt-6 border-t border-slate-50">
                <div className="flex justify-between items-center text-sm">
                   <span className="text-slate-400">Rate per night</span>
                   <span className="font-bold">RM {room.price}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <span className="text-slate-400">Total Residence</span>
                   <span className="font-bold">RM {basePrice}</span>
                </div>
                {perksApplied && (
                   <div className="flex justify-between items-center text-sm text-green-600 font-bold">
                      <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Member Discount (10%)</span>
                      <span>- RM {discount}</span>
                   </div>
                )}
                <div className="pt-4 flex justify-between items-end border-t border-slate-50">
                   <span className="text-lg font-serif">Total</span>
                   <span className="text-2xl font-serif text-accent tracking-tighter">RM {totalPrice}</span>
                </div>
             </div>
           </div>

           <div className={cn(
             "transition-all duration-500 overflow-hidden",
             perksApplied ? "bg-green-600" : "bg-primary"
           )}>
             <div className="p-8 space-y-4 text-white">
                <div className="flex items-center gap-3">
                   {perksApplied ? (
                     <CheckCircle2 className="w-5 h-5 text-white" />
                   ) : (
                     <CheckCircle2 className="w-5 h-5 text-accent" />
                   )}
                   <span className="text-xs font-bold uppercase tracking-widest">Aurum Loyalty Members</span>
                </div>
                <p className="text-xs text-white/60 leading-relaxed uppercase tracking-widest">
                  {perksApplied 
                    ? "Perks Applied! You will earn 4,800 Aurum Points." 
                    : "Sign in to earn 4,800 Aurum Points on this reservation."}
                </p>

                {!perksApplied && (
                  <div className="space-y-3">
                    <AnimatePresence>
                      {showCodeInput && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden space-y-2"
                        >
                          <input 
                            type="text"
                            placeholder="Enter Member Code (1234)"
                            value={membershipCode}
                            onChange={(e) => setMembershipCode(e.target.value)}
                            className={cn(
                              "w-full bg-white/10 border px-3 py-2 text-xs focus:outline-none transition-colors",
                              codeError ? "border-red-500" : "border-white/20 focus:border-accent"
                            )}
                          />
                          {codeError && (
                            <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Invalid Code</p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button 
                      onClick={handleApplyPerks}
                      disabled={isApplyingPerks}
                      className="text-[10px] uppercase tracking-widest font-bold text-accent hover:underline flex items-center gap-2"
                    >
                      {isApplyingPerks ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        showCodeInput ? "Submit Code" : "Apply Member Perks"
                      )}
                    </button>
                  </div>
                )}
                {perksApplied && (
                  <div className="text-[10px] uppercase tracking-widest font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3" /> 10% Discount Applied
                  </div>
                )}
             </div>
           </div>
        </aside>
      </div>
    </div>
  );
}
