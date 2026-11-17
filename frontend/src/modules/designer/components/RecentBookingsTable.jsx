import React, { useState } from 'react';
import {
  Calendar,
  ArrowRight,
  Clock,
  Shirt,
  Users,
  Eye,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { formatCurrency } from '../../../utils/formatCurrency';
import { useNavigate } from 'react-router-dom';

const RecentBookingsTable = () => {
  const { bookings, setSelectedBookingForDetail } = useApp();
  const [filter, setFilter] = useState('ALL');
  const navigate = useNavigate();

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'ALL') return true;
    return b.status.toUpperCase() === filter;
  });

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
            <Clock className="w-3 h-3 text-[#D97706]" />
            <span>Pending</span>
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#DBEAFE] text-[#2563EB] border border-[#BFDBFE]">
            <Check className="w-3 h-3 text-[#2563EB]" />
            <span>Accepted</span>
          </span>
        );
      case 'upcoming':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
            <Calendar className="w-3 h-3 text-[#059669]" />
            <span>Upcoming</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]">
            <span>Completed</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  const getServiceIcon = (service) => {
    const s = service.toLowerCase();
    if (s.includes('family')) return <Users className="w-3.5 h-3.5 text-[#6B35D9]" />;
    return <Shirt className="w-3.5 h-3.5 text-[#6B35D9]" />;
  };

  return (
    <div className="zorevi-card p-5 sm:p-6 bg-white">
      {/* Header with Title + Filter Tabs + View All */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#F3EEFF] text-[#6B35D9] flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1E1B2E]">
              Recent Booking Activity
            </h3>
            <p className="text-xs text-[#6B7280]">
              Review upcoming styling sessions & instant client requests
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick status filter pills */}
          <div className="flex bg-[#F6F3FB] p-1 rounded-xl text-xs font-medium border border-[#EAE4F5]">
            {['ALL', 'PENDING', 'ACCEPTED'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-lg transition ${
                  filter === f
                    ? 'bg-white text-[#6B35D9] font-bold shadow-xs'
                    : 'text-[#6B7280] hover:text-[#1E1B2E]'
                }`}
              >
                {f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <button
            onClick={() => navigate('/designer/bookings')}
            className="text-xs font-bold text-[#6B35D9] hover:underline flex items-center gap-1 ml-2"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto -mx-5 sm:mx-0">
        <table className="w-full text-left border-collapse min-w-[620px]">
          <thead>
            <tr className="border-b border-[#F3EEFB] text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">
              <th className="py-3 px-4 sm:px-3">CUSTOMER</th>
              <th className="py-3 px-3">SERVICE</th>
              <th className="py-3 px-3">DATE & TIME</th>
              <th className="py-3 px-3">AMOUNT</th>
              <th className="py-3 px-3">STATUS</th>
              <th className="py-3 px-3 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3EEFB] text-xs">
            {filteredBookings.map((booking) => (
              <tr
                key={booking.id}
                onClick={() => setSelectedBookingForDetail(booking)}
                className="hover:bg-[#FAF8FE] cursor-pointer transition-colors group"
              >
                {/* Customer */}
                <td className="py-3.5 px-4 sm:px-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={booking.customer.avatar}
                      alt={booking.customer.name}
                      className="w-8 h-8 rounded-full object-cover border border-[#EAE4F5] flex-shrink-0"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80';
                      }}
                    />
                    <div>
                      <span className="font-bold text-[#1E1B2E] block group-hover:text-[#6B35D9] transition-colors">
                        {booking.customer.name}
                      </span>
                      <span className="text-[10px] text-[#9CA3AF]">
                        {booking.customer.location || 'Hyderabad'}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Service */}
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-md bg-[#F3EEFF]">
                      {getServiceIcon(booking.service)}
                    </span>
                    <span className="font-semibold text-[#1E1B2E]">
                      {booking.service}
                    </span>
                  </div>
                </td>

                {/* Date & Time */}
                <td className="py-3.5 px-3 text-[#6B7280]">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#9CA3AF]" />
                    <span>{booking.dateTime}</span>
                  </div>
                </td>

                {/* Amount */}
                <td className="py-3.5 px-3">
                  <span className="font-bold text-sm text-[#1E1B2E]">
                    {formatCurrency(booking.amount)}
                  </span>
                </td>

                {/* Status */}
                <td className="py-3.5 px-3">
                  {getStatusBadge(booking.status)}
                </td>

                {/* Action Arrow */}
                <td className="py-3.5 px-3 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBookingForDetail(booking);
                    }}
                    className="w-7 h-7 rounded-full bg-[#FAF8FE] group-hover:bg-[#6B35D9] group-hover:text-white text-[#6B7280] inline-flex items-center justify-center transition-all duration-200"
                    aria-label="View booking details"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentBookingsTable;
