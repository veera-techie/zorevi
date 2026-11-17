import React from 'react';
import { useApp } from '../../../context/AppContext';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatCurrency';
import { useNavigate } from 'react-router-dom';

const MyBookings = () => {
  const { bookings } = useApp();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#1E1B2E]">My Bookings</h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
          View your scheduled personal styling sessions and past consultations
        </p>
      </div>

      <div className="space-y-3.5">
        {bookings.map((b) => (
          <div key={b.id} className="zorevi-card p-5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#6B35D9] font-bold">#{b.id}</span>
                <span className="text-xs bg-[#FAF8FE] border border-[#EAE4F5] text-[#6B7280] px-2 py-0.5 rounded-full font-bold">
                  {b.status}
                </span>
              </div>
              <h3 className="font-bold text-base text-[#1E1B2E] mt-1">{b.service}</h3>
              <p className="text-xs text-[#6B7280] flex items-center gap-2 mt-1">
                <span>Stylist: Aarohi Mehta</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#6B35D9]" /> {b.dateTime}
                </span>
              </p>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4">
              <span className="text-base font-extrabold text-[#1E1B2E]">
                {formatCurrency(b.amount)}
              </span>
              <button
                onClick={() => navigate('/customer/designer-details')}
                className="px-3.5 py-1.5 rounded-xl border border-[#EAE4F5] hover:border-[#6B35D9] text-xs font-semibold text-[#6B35D9]"
              >
                View Stylist
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
