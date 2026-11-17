import React from 'react';
import { ShieldCheck, Lock, Heart, CalendarClock } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const TrustBadgesRow = () => {
  const { bookings, setSelectedBookingForDetail } = useApp();
  const navigate = useNavigate();

  // Find next upcoming or pending booking
  const nextBooking = bookings.find(
    (b) => b.status.toLowerCase() === 'pending' || b.status.toLowerCase() === 'accepted' || b.status.toLowerCase() === 'upcoming'
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* 1. Verified Designer */}
      <div className="zorevi-card p-4 bg-white flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-2xl bg-[#F3EEFF] text-[#6B35D9] flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="w-5 h-5 text-[#6B35D9]" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-[#1E1B2E]">Verified Designer</h4>
          <p className="text-[11px] text-[#6B7280]">Trusted by Thousands</p>
        </div>
      </div>

      {/* 2. Secure Payments */}
      <div className="zorevi-card p-4 bg-white flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-2xl bg-[#F3EEFF] text-[#6B35D9] flex items-center justify-center flex-shrink-0">
          <Lock className="w-5 h-5 text-[#6B35D9]" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-[#1E1B2E]">Secure Payments</h4>
          <p className="text-[11px] text-[#6B7280]">Powered by Razorpay</p>
        </div>
      </div>

      {/* 3. Loved by Customers */}
      <div className="zorevi-card p-4 bg-white flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-2xl bg-[#F3EEFF] text-[#6B35D9] flex items-center justify-center flex-shrink-0">
          <Heart className="w-5 h-5 text-[#6B35D9]" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-[#1E1B2E]">Loved by Customers</h4>
          <p className="text-[11px] text-[#6B7280]">4.9/5 Average Rating</p>
        </div>
      </div>

      {/* 4. Your Next Booking */}
      <div
        onClick={() => {
          if (nextBooking) setSelectedBookingForDetail(nextBooking);
          else navigate('/designer/bookings');
        }}
        className="zorevi-card p-4 bg-[#FAF8FE] border-[#E4D9F5] flex items-center justify-between gap-3 cursor-pointer hover:border-[#6B35D9]/40 hover:bg-[#F3EEFF]/40 transition group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#6B35D9] text-white flex items-center justify-center flex-shrink-0 shadow-purple-glow">
            <CalendarClock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#1E1B2E]">Your Next Booking</h4>
            <p className="text-[11px] text-[#6B7280] font-medium">
              Nov 18, 2025 · 10:00 AM
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#F3EEFF] text-[#6B35D9] border border-[#E9DFFC] whitespace-nowrap">
          Bridal styling
        </span>
      </div>
    </div>
  );
};

export default TrustBadgesRow;
