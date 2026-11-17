import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatCurrency';

const BookingCard = ({ booking, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="zorevi-card p-4 bg-white cursor-pointer hover:border-[#6B35D9]/40 transition"
    >
      <div className="flex items-center justify-between">
        <span className="font-bold text-sm text-[#1E1B2E]">{booking.service}</span>
        <span className="font-extrabold text-[#6B35D9]">{formatCurrency(booking.amount)}</span>
      </div>
      <p className="text-xs text-[#6B7280] mt-1 flex items-center gap-1">
        <Calendar className="w-3.5 h-3.5" /> {booking.dateTime}
      </p>
    </div>
  );
};

export default BookingCard;
