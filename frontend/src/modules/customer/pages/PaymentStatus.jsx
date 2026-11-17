import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Calendar, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatCurrency';

const PaymentStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const booking = location.state?.booking || {
    id: 'BK-1099',
    customer: { name: 'Priyanka Sen' },
    service: 'Bridal Grand Couture Consultation',
    dateTime: 'Nov 20, 2025 · 10:00 AM',
    amount: 4500,
    status: 'Pending',
  };

  return (
    <div className="max-w-md mx-auto space-y-6 pb-12 pt-6 text-center animate-in zoom-in-95 duration-200">
      <div className="zorevi-card p-8 bg-white space-y-5">
        <div className="w-16 h-16 rounded-full bg-[#ECFDF5] text-[#10B981] flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <div>
          <span className="text-xs font-bold text-[#10B981] uppercase tracking-wider block">
            Payment Confirmed
          </span>
          <h1 className="text-2xl font-extrabold text-[#1E1B2E] mt-1">
            Appointment Requested!
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">
            Your booking request has been sent to designer Aarohi Mehta.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAF8FE] border border-[#EAE4F5] text-left text-xs space-y-2">
          <div className="flex justify-between font-bold text-sm text-[#1E1B2E]">
            <span>Booking Ref:</span>
            <span className="font-mono text-[#6B35D9]">{booking.id}</span>
          </div>
          <div className="flex justify-between text-[#6B7280]">
            <span>Service:</span>
            <span className="font-semibold text-[#1E1B2E]">{booking.service}</span>
          </div>
          <div className="flex justify-between text-[#6B7280]">
            <span>Schedule:</span>
            <span className="font-semibold text-[#1E1B2E]">{booking.dateTime}</span>
          </div>
          <div className="flex justify-between text-[#6B7280]">
            <span>Amount Held in Escrow:</span>
            <span className="font-bold text-[#10B981]">{formatCurrency(booking.amount)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={() => navigate('/designer/dashboard')}
            className="w-full py-2.5 rounded-xl bg-[#6B35D9] hover:bg-[#5B29C5] text-white text-xs font-bold shadow-purple-glow transition"
          >
            Switch to Designer View to Confirm
          </button>
          <button
            onClick={() => navigate('/customer/my-bookings')}
            className="w-full py-2.5 rounded-xl border border-[#EAE4F5] text-xs font-bold text-[#1E1B2E] hover:bg-[#FAF8FE]"
          >
            View in My Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus;
