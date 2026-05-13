import React from 'react';
import { CreditCard, Info, ChevronLeft } from 'lucide-react';

interface PaymentDetails {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

interface PaymentFormProps {
  paymentDetails: PaymentDetails;
  setPaymentDetails: (details: PaymentDetails) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  totalPrice: number;
}

export default function PaymentForm({ paymentDetails, setPaymentDetails, onSubmit, onBack, totalPrice }: PaymentFormProps) {
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-2 md:col-span-2">
        <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Card Number</label>
        <div className="relative">
          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            required
            maxLength={19}
            value={paymentDetails.cardNumber}
            onChange={e => setPaymentDetails({...paymentDetails, cardNumber: formatCardNumber(e.target.value)})}
            placeholder="XXXX XXXX XXXX XXXX"
            className="w-full border border-slate-200 py-3 pl-10 pr-4 focus:outline-none focus:border-accent text-sm font-mono tracking-widest"
          />
        </div>
      </div>

      <div className="space-y-2 md:col-span-2">
        <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Cardholder Name</label>
        <input 
          type="text" 
          required
          value={paymentDetails.cardName}
          onChange={e => setPaymentDetails({...paymentDetails, cardName: e.target.value})}
          placeholder="NAME ASH SHOWN ON CARD"
          className="w-full border border-slate-200 py-3 px-4 focus:outline-none focus:border-accent text-sm uppercase tracking-widest"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Expiry Date</label>
        <input 
          type="text" 
          required
          maxLength={5}
          value={paymentDetails.expiryDate}
          onChange={e => {
            let v = e.target.value.replace(/\D/g, '');
            if (v.length > 2) v = v.substring(0, 2) + '/' + v.substring(2, 4);
            setPaymentDetails({...paymentDetails, expiryDate: v});
          }}
          placeholder="MM/YY"
          className="w-full border border-slate-200 py-3 px-4 focus:outline-none focus:border-accent text-sm font-mono"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500">CVV</label>
        <input 
          type="password" 
          required
          maxLength={3}
          value={paymentDetails.cvv}
          onChange={e => setPaymentDetails({...paymentDetails, cvv: e.target.value.replace(/\D/g, '')})}
          placeholder="123"
          className="w-full border border-slate-200 py-3 px-4 focus:outline-none focus:border-accent text-sm font-mono"
        />
      </div>

      <div className="md:col-span-2 flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
        <Info className="w-4 h-4 text-accent" />
        This is a demo prototype. No real transaction will be processed.
      </div>

      <div className="md:col-span-2 flex justify-between items-center pt-6">
        <button 
          type="button"
          onClick={onBack}
          className="text-xs uppercase tracking-widest font-bold text-primary hover:text-accent flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> Guest Info
        </button>
        <button 
          type="submit"
          className="bg-accent hover:bg-gold-dark text-primary py-4 px-12 font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-2 shadow-xl"
        >
          Confirm & Pay RM {totalPrice}
        </button>
      </div>
    </form>
  );
}