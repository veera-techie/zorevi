import React from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Check,
  XCircle,
  FileText,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { formatCurrency } from '../../../utils/formatCurrency';

const BookingDetailModal = () => {
  const {
    selectedBookingForDetail,
    setSelectedBookingForDetail,
    updateBookingStatus,
  } = useApp();

  if (!selectedBookingForDetail) return null;

  const booking = selectedBookingForDetail;

  const handleStatusChange = (newStatus) => {
    updateBookingStatus(booking.id, newStatus);
    setSelectedBookingForDetail({ ...booking, status: newStatus });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#EAE4F5] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F3EEFB]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F3EEFF] text-[#6B35D9] flex items-center justify-center font-bold text-sm">
              {booking.id.split('-')[1]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#1E1B2E]">Booking Details</h3>
                <span className="text-xs bg-[#FAF8FE] border border-[#EAE4F5] text-[#6B7280] px-2 py-0.5 rounded-full font-mono">
                  {booking.id}
                </span>
              </div>
              <p className="text-xs text-[#6B7280]">Requested on Zorevi Platform</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedBookingForDetail(null)}
            className="p-1.5 rounded-xl text-[#6B7280] hover:bg-[#F3EEFB] hover:text-[#1E1B2E]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customer Information Card */}
        <div className="mt-4 p-4 rounded-2xl bg-[#FAF8FE] border border-[#EAE4F5]">
          <div className="flex items-center gap-3.5">
            <img
              src={booking.customer.avatar}
              alt={booking.customer.name}
              className="w-12 h-12 rounded-full object-cover border border-[#EAE4F5]"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80';
              }}
            />
            <div className="flex-1">
              <h4 className="font-bold text-sm text-[#1E1B2E]">{booking.customer.name}</h4>
              <p className="text-xs text-[#6B7280] flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-[#6B35D9]" />
                <span>{booking.customer.location || 'Hyderabad, Telangana'}</span>
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#9CA3AF] uppercase block font-semibold">Total Fee</span>
              <span className="text-base font-extrabold text-[#1E1B2E]">
                {formatCurrency(booking.amount)}
              </span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-[#EAE4F5] grid grid-cols-2 gap-2 text-xs text-[#6B7280]">
            <a
              href={`tel:${booking.customer.phone}`}
              className="flex items-center gap-1.5 hover:text-[#6B35D9] transition"
            >
              <Phone className="w-3.5 h-3.5 text-[#6B35D9]" />
              <span>{booking.customer.phone || '+91 98490 23145'}</span>
            </a>
            <a
              href={`mailto:${booking.customer.email}`}
              className="flex items-center gap-1.5 hover:text-[#6B35D9] transition truncate"
            >
              <Mail className="w-3.5 h-3.5 text-[#6B35D9]" />
              <span className="truncate">{booking.customer.email || 'client@zorevi.in'}</span>
            </a>
          </div>
        </div>

        {/* Appointment & Service Specs */}
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white border border-[#EAE4F5]">
              <span className="text-[#9CA3AF] font-medium block">Service Type</span>
              <span className="font-bold text-[#1E1B2E] mt-0.5 block">{booking.service}</span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-[#EAE4F5]">
              <span className="text-[#9CA3AF] font-medium block">Appointment Time</span>
              <span className="font-bold text-[#1E1B2E] mt-0.5 block">{booking.dateTime}</span>
            </div>
          </div>

          {booking.notes && (
            <div className="p-3.5 rounded-xl bg-[#F6F3FB] border border-[#EAE4F5] text-xs">
              <span className="font-bold text-[#1E1B2E] flex items-center gap-1 mb-1">
                <FileText className="w-3.5 h-3.5 text-[#6B35D9]" />
                Client Notes:
              </span>
              <p className="text-[#4B5563] leading-relaxed">{booking.notes}</p>
            </div>
          )}

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Escrow Protected: ₹4,500 held securely in Razorpay Escrow until consultation is concluded.</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-[#F3EEFB] flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[#6B7280]">Current status:</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EDE8F8] text-[#6B35D9]">
              {booking.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {booking.status.toLowerCase() === 'pending' && (
              <>
                <button
                  onClick={() => handleStatusChange('Cancelled')}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-[#EF4444] hover:bg-[#FEF2F2] transition"
                >
                  Decline
                </button>
                <button
                  onClick={() => handleStatusChange('Accepted')}
                  className="px-4 py-2 rounded-xl bg-[#6B35D9] hover:bg-[#5B29C5] text-white text-xs font-bold shadow-purple-glow transition flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Accept Booking</span>
                </button>
              </>
            )}

            {booking.status.toLowerCase() === 'accepted' && (
              <button
                onClick={() => handleStatusChange('Completed')}
                className="px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Completed & Release ₹</span>
              </button>
            )}

            {booking.status.toLowerCase() === 'completed' && (
              <span className="text-xs font-bold text-[#10B981] flex items-center gap-1">
                <Check className="w-4 h-4" /> Consultation Completed
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailModal;
