import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar, Clock, MapPin, CheckCircle2, MessageSquare, Phone,
  FileText, ShieldCheck, ChevronLeft, ArrowRight, Share2, AlertCircle,
  CreditCard, Sparkles, User, Building2
} from 'lucide-react';
import { mockBookings } from '../../../services/mockData';
import ImageWithFallback from '../../../components/common/ImageWithFallback';
import Modal from '../../../components/common/Modal';
import BookingModal from '../../../components/cards/BookingModal';
import { useApp } from '../../../context/AppContext';

export default function CustomerBookingDetails() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { bookings, addToast, cancelBooking } = useApp();

  const foundBooking = (bookings || []).find((b) => b.id === bookingId)
    || mockBookings.find((b) => b.id === bookingId)
    || mockBookings[0];

  const [booking, setBooking] = useState(foundBooking);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [newDate, setNewDate] = useState('2025-11-26');
  const [newTime, setNewTime] = useState('14:00');
  const [isAdvancePayModalOpen, setIsAdvancePayModalOpen] = useState(false);

  const designerFee = Number(booking.designerFee || booking.amount || 999);
  const advanceFee = Math.round(designerFee * 0.3);
  const remainingFee = designerFee - advanceFee;

  const handleRescheduleSubmit = () => {
    setBooking((prev) => ({
      ...prev,
      date: newDate,
      startTime: newTime,
      status: 'Rescheduled',
    }));
    setIsRescheduleOpen(false);
    addToast('Booking successfully rescheduled! Stylist notified.', 'success');
  };

  const handleDownloadInvoice = () => {
    addToast(`Generating PDF invoice for Booking #${booking.id}`, 'info');
  };

  return (
    <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Back button */}
      <div style={{ marginBottom: '16px' }}>
        <Link
          to="/customer/bookings"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#6B7280', fontSize: '0.85rem', textDecoration: 'none' }}
        >
          <ChevronLeft size={16} /> Back to My Bookings
        </Link>
      </div>

      {/* Title & Status */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '850', color: '#1E1B4B', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
            Booking Details #{booking.id}
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: 0 }}>
            Session schedule, location, customer preferences, and payment status.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              fontWeight: '700',
              fontSize: '0.82rem',
              background: booking.status === 'Confirmed' ? '#ECFDF5' : (booking.status === 'Awaiting Payment' ? '#FEF3C7' : '#F3F4F6'),
              color: booking.status === 'Confirmed' ? '#059669' : (booking.status === 'Awaiting Payment' ? '#B45309' : '#4B5563'),
              border: `1px solid ${booking.status === 'Confirmed' ? '#A7F3D0' : (booking.status === 'Awaiting Payment' ? '#FDE68A' : '#E5E7EB')}`,
            }}
          >
            {booking.status}
          </span>
          <span
            style={{
              padding: '6px 12px',
              borderRadius: '9999px',
              fontWeight: '600',
              fontSize: '0.8rem',
              background: '#F5F0FF',
              color: '#7C3AED',
              border: '1px solid #DDD6FE',
            }}
          >
            {booking.paymentStatus || 'Payment Pending'}
          </span>
        </div>
      </div>

      {/* Awaiting Payment Banner Alert */}
      {booking.status === 'Awaiting Payment' && (
        <div
          style={{
            background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
            border: '1.5px solid #6EE7B7',
            borderRadius: '20px',
            padding: '20px 24px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <strong style={{ fontSize: '1.05rem', color: '#065F46', display: 'block', marginBottom: 4 }}>
              🎉 Designer Accepted Your Request! 30% Advance Due
            </strong>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#047857' }}>
              {booking.designerName} has confirmed availability. Please pay the 30% advance of ₹{advanceFee} to confirm your appointment.
            </p>
          </div>
          <button
            type="button"
            className="zorevi-btn zorevi-btn--primary"
            style={{ background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)' }}
            onClick={() => setIsAdvancePayModalOpen(true)}
          >
            <CreditCard size={16} />
            <span>Pay 30% Advance (₹{advanceFee})</span>
          </button>
        </div>
      )}

      {/* Top Banner Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '180px 1.2fr 1fr', gap: '20px', background: '#FFFFFF', borderRadius: '24px', border: '1px solid #EDE9FE', padding: '24px', boxShadow: '0 4px 16px rgba(124, 58, 237, 0.04)', marginBottom: '24px' }}>
        <div style={{ borderRadius: '16px', overflow: 'hidden', height: '140px', background: '#F5F0FF' }}>
          <ImageWithFallback
            src={booking.designerAvatar || '/assets/images/designer-aarohi.jpg'}
            alt={booking.service || 'Styling'}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            fallbackType="designer"
          />
        </div>

        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#1E1B4B', margin: '0 0 8px 0' }}>
            {booking.occasion || 'Wedding'} Styling Session
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: '#4B5563' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={14} color="#7C3AED" /> {booking.date} • {booking.time || booking.startTime}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={14} color="#7C3AED" /> {booking.meetingLocation || booking.location?.mallName || 'Lakeside Fashion Mall'}
            </span>
            <span>Category: <strong>{booking.category || 'Women'}</strong> • Occasion: <strong>{booking.occasion || 'Wedding'}</strong></span>
          </div>
        </div>

        <div style={{ background: '#FAF5FF', border: '1px solid #DDD6FE', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: '700' }}>Designer Fee Breakdown</span>
            <div style={{ fontSize: '1.5rem', fontWeight: '850', color: '#7C3AED', margin: '2px 0' }}>
              ₹{designerFee}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#4B5563', lineHeight: 1.4 }}>
              <div>30% Advance: <strong>₹{advanceFee}</strong> ({booking.paymentStatus === 'Advance Paid (30%)' ? 'Paid' : 'Due'})</div>
              <div>Remaining 70%: <strong>₹{remainingFee}</strong> (Payable at session)</div>
            </div>
          </div>

          <button
            className="zorevi-btn zorevi-btn--outline zorevi-btn--sm"
            style={{ marginTop: '10px' }}
            onClick={handleDownloadInvoice}
          >
            <FileText size={13} /> View Invoice & Receipt
          </button>
        </div>
      </div>

      {/* Two Column details: Customer Preferences & Venue */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Customer Requirements & Shopping Budget */}
        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EDE9FE', padding: '20px' }}>
          <h4 style={{ fontSize: '0.88rem', color: '#7C3AED', textTransform: 'uppercase', fontWeight: '700', marginBottom: '14px' }}>
            Customer Preferences & Shopping Budget
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
            <div>
              <span style={{ color: '#6B7280', display: 'block', fontSize: '0.75rem' }}>Total Shopping Budget for Clothes</span>
              <strong style={{ color: '#1E1B4B', fontSize: '1.05rem' }}>{booking.shoppingBudget || 'Up to ₹20,000'}</strong>
            </div>
            <div>
              <span style={{ color: '#6B7280', display: 'block', fontSize: '0.75rem' }}>Aesthetic / Style Preference</span>
              <strong style={{ color: '#1E1B4B' }}>{booking.clothingPreference || 'Indo-Western / Fusion'}</strong>
            </div>
            <div>
              <span style={{ color: '#6B7280', display: 'block', fontSize: '0.75rem' }}>Preferred Colors</span>
              <strong style={{ color: '#1E1B4B' }}>{booking.preferredColors || 'Jewel Tones'}</strong>
            </div>
            <div>
              <span style={{ color: '#6B7280', display: 'block', fontSize: '0.75rem' }}>Outfit Requirements / Instructions</span>
              <p style={{ margin: '2px 0 0 0', color: '#4B5563', lineHeight: 1.4 }}>
                {booking.requirements || booking.notes || 'Curated styling recommendations matching modern aesthetics.'}
              </p>
            </div>
          </div>
        </div>

        {/* Confirmed Designer */}
        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EDE9FE', padding: '20px' }}>
          <h4 style={{ fontSize: '0.88rem', color: '#7C3AED', textTransform: 'uppercase', fontWeight: '700', marginBottom: '14px' }}>
            Stylist Information
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
            <ImageWithFallback
              src={booking.designerAvatar || '/assets/images/designer-aarohi.jpg'}
              alt={booking.designerName}
              style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
              fallbackType="designer"
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <strong style={{ fontSize: '1rem', color: '#1E1B4B' }}>{booking.designerName}</strong>
                <CheckCircle2 size={16} color="#7C3AED" />
              </div>
              <div style={{ fontSize: '0.8rem', color: '#6B7280', margin: '2px 0 6px' }}>
                {booking.designerTitle || "Women's & Bridal Styling"}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link to={`/customer/designers/${booking.designerId || 'des-001'}`} className="zorevi-btn zorevi-btn--outline zorevi-btn--sm">
                  View Profile
                </Link>
                <Link to={`/customer/bookings/${booking.id}/messages`} className="zorevi-btn zorevi-btn--primary zorevi-btn--sm">
                  <MessageSquare size={13} /> Chat with Stylist
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Toolbar */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', background: '#FFFFFF', padding: '20px', borderRadius: '20px', border: '1px solid #EDE9FE' }}>
        {booking.status === 'Awaiting Payment' ? (
          <button className="zorevi-btn zorevi-btn--primary" onClick={() => setIsAdvancePayModalOpen(true)}>
            <CreditCard size={16} /> Pay 30% Advance (₹{advanceFee})
          </button>
        ) : (
          <Link to={`/customer/bookings/${booking.id}/messages`} className="zorevi-btn zorevi-btn--primary">
            <MessageSquare size={16} /> Open Chat
          </Link>
        )}

        <button className="zorevi-btn zorevi-btn--outline" onClick={() => setIsRescheduleOpen(true)}>
          <Calendar size={16} /> Reschedule Session
        </button>

        <button
          className="zorevi-btn zorevi-btn--ghost"
          style={{ color: '#EF4444' }}
          onClick={() => {
            cancelBooking(booking.id, 'Customer requested cancellation from details');
            setBooking((prev) => ({ ...prev, status: 'Cancelled' }));
          }}
        >
          Cancel Booking
        </button>

        <button
          className="zorevi-btn zorevi-btn--ghost"
          style={{ marginLeft: 'auto' }}
          onClick={() => addToast('Event synced to your calendar', 'success')}
        >
          Sync to Calendar
        </button>
      </div>

      {/* Advance Payment Modal */}
      {isAdvancePayModalOpen && (
        <BookingModal
          isOpen={isAdvancePayModalOpen}
          onClose={() => setIsAdvancePayModalOpen(false)}
          bookingToPay={booking}
          initialStep={9}
        />
      )}

      {/* Reschedule Modal */}
      {isRescheduleOpen && (
        <Modal
          isOpen={isRescheduleOpen}
          onClose={() => setIsRescheduleOpen(false)}
          title="Reschedule Styling Session"
          maxWidth="480px"
        >
          <p style={{ fontSize: '0.85rem', color: '#4B5563', marginBottom: '16px' }}>
            Choose a new date and time slot for your styling session with {booking.designerName}.
          </p>

          <div className="zorevi-form-group">
            <label className="zorevi-form-label">New Date</label>
            <input
              type="date"
              className="zorevi-input"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
          </div>

          <div className="zorevi-form-group" style={{ marginTop: '14px' }}>
            <label className="zorevi-form-label">New Time Slot</label>
            <select
              className="zorevi-input"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
            >
              <option value="11:00 AM">11:00 AM</option>
              <option value="02:00 PM">02:00 PM</option>
              <option value="04:00 PM">04:00 PM</option>
              <option value="06:00 PM">06:00 PM</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '24px' }}>
            <button className="zorevi-btn zorevi-btn--outline" onClick={() => setIsRescheduleOpen(false)}>
              Back
            </button>
            <button className="zorevi-btn zorevi-btn--primary" onClick={handleRescheduleSubmit}>
              Confirm Reschedule
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
