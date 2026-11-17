import React, { useState } from 'react';
import {
  CalendarCheck2,
  Search,
  Filter,
  Check,
  X,
  Clock,
  Eye,
  MapPin,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { formatCurrency } from '../../../utils/formatCurrency';

const Bookings = () => {
  const { bookings, updateBookingStatus, setSelectedBookingForDetail } = useApp();
  const [activeTab, setActiveTab] = useState('ALL');
  const [search, setSearch] = useState('');

  const filterTabs = [
    { id: 'ALL', label: 'All Bookings', count: bookings.length },
    {
      id: 'PENDING',
      label: 'Pending Requests',
      count: bookings.filter((b) => b.status.toLowerCase() === 'pending').length,
    },
    {
      id: 'ACCEPTED',
      label: 'Accepted / Upcoming',
      count: bookings.filter((b) => b.status.toLowerCase() === 'accepted' || b.status.toLowerCase() === 'upcoming').length,
    },
    {
      id: 'COMPLETED',
      label: 'Completed',
      count: bookings.filter((b) => b.status.toLowerCase() === 'completed').length,
    },
  ];

  const filteredBookings = bookings.filter((b) => {
    // tab filter
    if (activeTab === 'PENDING' && b.status.toLowerCase() !== 'pending') return false;
    if (activeTab === 'ACCEPTED' && b.status.toLowerCase() !== 'accepted' && b.status.toLowerCase() !== 'upcoming') return false;
    if (activeTab === 'COMPLETED' && b.status.toLowerCase() !== 'completed') return false;

    // text search
    if (search) {
      const q = search.toLowerCase();
      return (
        b.customer.name.toLowerCase().includes(q) ||
        b.service.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#1E1B2E]">
          Client Bookings & Requests
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
          Manage, confirm, and complete all your personal styling appointments
        </p>
      </div>

      {/* Tabs & Search Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex bg-[#F6F3FB] p-1 rounded-2xl border border-[#EAE4F5] overflow-x-auto">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-[#6B35D9] shadow-zorevi-sm'
                  : 'text-[#6B7280] hover:text-[#1E1B2E]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === tab.id
                    ? 'bg-[#F3EEFF] text-[#6B35D9]'
                    : 'bg-[#EDE8F8] text-[#6B7280]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter bookings..."
            className="w-full py-2 pl-9 pr-4 text-xs bg-white border border-[#EAE4F5] rounded-xl text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#6B35D9]/20"
          />
        </div>
      </div>

      {/* Bookings List Cards */}
      <div className="space-y-3.5">
        {filteredBookings.length === 0 ? (
          <div className="zorevi-card p-12 text-center bg-white">
            <AlertCircle className="w-10 h-10 text-[#9CA3AF] mx-auto mb-2" />
            <h3 className="font-bold text-sm text-[#1E1B2E]">No bookings found</h3>
            <p className="text-xs text-[#6B7280] mt-1">
              Try switching your filter or search query
            </p>
          </div>
        ) : (
          filteredBookings.map((b) => (
            <div
              key={b.id}
              className="zorevi-card p-4 sm:p-5 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#6B35D9]/30 transition group"
            >
              <div className="flex items-start sm:items-center gap-4">
                <img
                  src={b.customer.avatar}
                  alt={b.customer.name}
                  className="w-12 h-12 rounded-full object-cover border border-[#EAE4F5] flex-shrink-0"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80';
                  }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-[#1E1B2E]">
                      {b.customer.name}
                    </h3>
                    <span className="text-[11px] font-mono text-[#9CA3AF]">#{b.id}</span>
                  </div>
                  <p className="text-xs font-semibold text-[#6B35D9] mt-0.5">
                    {b.service}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#6B7280]">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[#9CA3AF]" />
                      {b.dateTime}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#9CA3AF]" />
                      {b.customer.location || 'Hyderabad'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-[#F3EEFB]">
                <div className="text-left md:text-right">
                  <span className="text-base font-extrabold text-[#1E1B2E] block">
                    {formatCurrency(b.amount)}
                  </span>
                  <span className="text-[10px] text-[#9CA3AF] uppercase font-bold">
                    Escrow Secured
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedBookingForDetail(b)}
                    className="p-2 rounded-xl border border-[#EAE4F5] hover:border-[#6B35D9] text-[#6B7280] hover:text-[#6B35D9] transition"
                    title="View Full Booking"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {b.status.toLowerCase() === 'pending' && (
                    <button
                      onClick={() => updateBookingStatus(b.id, 'Accepted')}
                      className="px-3.5 py-2 rounded-xl bg-[#6B35D9] hover:bg-[#5B29C5] text-white text-xs font-bold shadow-purple-glow transition flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept</span>
                    </button>
                  )}

                  {b.status.toLowerCase() === 'accepted' && (
                    <button
                      onClick={() => updateBookingStatus(b.id, 'Completed')}
                      className="px-3 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold transition flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Done</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Bookings;
