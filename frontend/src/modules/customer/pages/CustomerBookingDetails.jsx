import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar, Clock, MapPin, CheckCircle2, MessageSquare,
  FileText, ChevronLeft, CreditCard, Sparkles
} from 'lucide-react';
import { mockBookings } from '../../../services/mockData';
import ImageWithFallback from '../../../components/common/ImageWithFallback';
import Modal from '../../../components/common/Modal';
import BookingModal from '../../../components/cards/BookingModal';
import { useApp } from '../../../context/AppContext';
import {
  formatDate,
  formatDateTime,
  formatTime,
  getBookingStatusMeta,
  normalizeBookingStatusKey,
} from '../../../utils';

export default function CustomerBookingDetails({ isDesigner = false }) {
  const { bookingId } = useParams();
  const { bookings, addToast, cancelBooking, rescheduleBooking } = useApp();

  const booking = useMemo(() => {
    const fromState = (bookings || []).find((b) => b.id === bookingId);
    if (fromState) return fromState;
    return mockBookings.find((b) => b.id === bookingId) || null;
  }, [bookings, bookingId]);

  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [newDate, setNewDate] = useState(booking?.date || '');
  const [newTime, setNewTime] = useState('02:00 PM');
  const [isAdvancePayModalOpen, setIsAdvancePayModalOpen] = useState(false);

  const backPath = isDesigner ? '/designer/bookings' : '/customer/bookings';

  if (!booking) {
    return (
      <div style={{ width: '100%', maxWidth: '760px', margin: '40px auto', textAlign: 'center', background: '#FFFFFF', padding: '48px 24px', borderRadius: '24px', border: '1px solid #EDE9FE' }}>
        <Calendar size={40} color="#7C3AED" style={{ marginBottom: '12px', opacity: 0.7 }} />
        <h2 style={{ color: '#1E1B4B', marginBottom: '8px' }}>Booking Not Found</h2>
        <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '20px' }}>
          We couldn&apos;t locate booking reference #{bookingId}.
        </p>
        <Link to={backPath} className="zorevi-btn zorevi-btn--primary">
          <ChevronLeft size={16} /> Back to My Bookings
        </Link>
      </div>
    );
  }

  const statusKey = normalizeBookingStatusKey(booking.status);
  const statusMeta = getBookingStatusMeta(booking.status);
  const designerFee = Number(booking.designerFee || booking.amount || 999);
  const advanceFee = Math.round(designerFee * 0.3);
  const remainingFee = designerFee - advanceFee;
  const sessionTime = formatTime(booking.time || booking.startTime, '11:00 AM');
  const venueName = booking.meetingLocation || booking.mall?.name || booking.location?.mallName || 'Lakeside Fashion Mall';
  const venueAddress = booking.mall?.locality || booking.location?.address || booking.designerLocation || 'Hyderabad';
  const servicesList = Array.isArray(booking.services) && booking.services.length > 0
    ? booking.services
    : [booking.service || 'Personal Styling'];
  const clothingPref = booking.preferences?.clothingPreference || booking.clothingPreference || 'Contemporary & Occasion Wear';
  const colorPref = booking.preferences?.colorPreferences || booking.preferredColors || 'Tailored to occasion';
  const styleTags = booking.preferences?.preferredStyles || booking.preferredStyles || [];
  const outfitReqs = booking.preferences?.outfitRequirements || booking.requirements || booking.notes || 'Curated styling recommendations matching modern aesthetics.';
  const specialNotes = booking.preferences?.specialInstructions || booking.specialInstructions || '';
  const isActionable = !['completed', 'cancelled', 'rejected'].includes(statusKey);

  const handleOpenReschedule = () => {
    setNewDate(booking.date || new Date().toISOString().slice(0, 10));
    setNewTime(sessionTime || '02:00 PM');
    setIsRescheduleOpen(true);
  };

  const handleRescheduleSubmit = () => {
    if (!newDate) {
      addToast('Please select a new date.', 'error');
      return;
    }
    rescheduleBooking(booking.id, newDate, newTime);
    setIsRescheduleOpen(false);
  };

  const handleDownloadInvoice = () => {
    addToast(`Generating PDF invoice for Booking #${booking.id}`, 'info');
  };

  return (
    <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Back button */}
      <div style={{ marginBottom: '16px' }}>
        <Link
          to={backPath}
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
            Submitted on <strong>{formatDateTime(booking.createdAt || booking.submittedAt)}</strong> • Session schedule, preferences, and payment status.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              fontWeight: '700',
              fontSize: '0.82rem',
              background: statusMeta.bg,
              color: statusMeta.color,
              border: `1px solid ${statusMeta.border}`,
            }}
          >
            {statusMeta.label}
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
            {booking.paymentStatus || 'Unpaid'}
          </span>
        </div>
      </div>

      {/* Accepted / Awaiting Payment Banner Alert */}
      {!isDesigner && statusKey === 'accepted' && booking.paymentStatus !== 'Advance Paid (30%)' && booking.paymentStatus !== 'Fully Paid' && (
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
              {booking.designerName} has confirmed availability. Please pay the 30% advance of ₹{advanceFee} to lock your appointment.
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

      {/* Alternative slot / Decline / Cancel notice */}
      {statusKey === 'alternative' && booking.proposedDate && (
        <div style={{ background: '#EFF6FF', border: '1.5px solid #93C5FD', borderRadius: '18px', padding: '16px 20px', marginBottom: '24px', color: '#1E40AF', fontSize: '0.88rem' }}>
          <strong>Alternative Slot Proposed by {booking.designerName}:</strong>{' '}
          {formatDate(booking.proposedDate, booking.proposedDate)} at {booking.proposedTime}
          {booking.designerNote && <p style={{ margin: '6px 0 0', color: '#1E3A8A' }}>{booking.designerNote}</p>}
        </div>
      )}

      {(statusKey === 'rejected' || statusKey === 'cancelled') && (booking.declineReason || booking.cancelReason) && (
        <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: '18px', padding: '16px 20px', marginBottom: '24px', color: '#991B1B', fontSize: '0.88rem' }}>
          <strong>{statusKey === 'rejected' ? 'Request Declined:' : 'Booking Cancelled:'}</strong>{' '}
          {booking.declineReason || booking.cancelReason}
        </div>
      )}

      {/* Top Banner Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', background: '#FFFFFF', borderRadius: '24px', border: '1px solid #EDE9FE', padding: '24px', boxShadow: '0 4px 16px rgba(124, 58, 237, 0.04)', marginBottom: '24px' }}>
        <div style={{ borderRadius: '16px', overflow: 'hidden', height: '160px', background: '#F5F0FF' }}>
          <ImageWithFallback
            src={booking.designerAvatar || '/assets/images/designer-aarohi.jpg'}
            alt={booking.designerName || 'Styling'}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            fallbackType="designer"
          />
        </div>

        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#1E1B4B', margin: '0 0 10px 0' }}>
            {booking.occasion || 'Wedding'} Styling Session
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', fontSize: '0.85rem', color: '#4B5563' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={14} color="#7C3AED" /> <strong>Session:</strong> {formatDate(booking.date, booking.date)} • {sessionTime}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} color="#7C3AED" /> <strong>Submitted:</strong> {formatDateTime(booking.createdAt || booking.submittedAt)}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={14} color="#7C3AED" /> {venueName} ({venueAddress})
            </span>
            {booking.meetingType && (
              <span>Session Format: <strong>{booking.meetingType}</strong></span>
            )}
            <span>Category: <strong>{booking.category || 'Women'}</strong> • Occasion: <strong>{booking.occasion || 'Wedding'}</strong></span>
          </div>
        </div>

        <div style={{ background: '#FAF5FF', border: '1px solid #DDD6FE', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: '700' }}>Designer Fee Breakdown</span>
            <div style={{ fontSize: '1.5rem', fontWeight: '850', color: '#7C3AED', margin: '2px 0' }}>
              ₹{designerFee}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#4B5563', lineHeight: 1.45 }}>
              <div>30% Advance: <strong>₹{advanceFee}</strong> ({booking.paymentStatus === 'Advance Paid (30%)' || booking.paymentStatus === 'Fully Paid' ? 'Paid' : 'Due after approval'})</div>
              <div>Remaining 70%: <strong>₹{remainingFee}</strong> (Payable at session)</div>
            </div>
          </div>

          <button
            type="button"
            className="zorevi-btn zorevi-btn--outline zorevi-btn--sm"
            style={{ marginTop: '10px' }}
            onClick={handleDownloadInvoice}
          >
            <FileText size={13} /> View Invoice &amp; Receipt
          </button>
        </div>
      </div>

      {/* Selected Services & Timeline */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EDE9FE', padding: '20px' }}>
          <h4 style={{ fontSize: '0.88rem', color: '#7C3AED', textTransform: 'uppercase', fontWeight: '700', marginBottom: '12px' }}>
            Selected Styling Services
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
            {servicesList.map((srv, idx) => (
              <span
                key={`${srv}-${idx}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  background: '#F5F0FF',
                  border: '1px solid #DDD6FE',
                  color: '#5B21B6',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                }}
              >
                <Sparkles size={12} /> {srv}
              </span>
            ))}
          </div>
          {booking.meetingPoint && (
            <div style={{ fontSize: '0.83rem', color: '#4B5563' }}>
              <span style={{ color: '#6B7280' }}>Meeting Point: </span>
              <strong style={{ color: '#1E1B4B' }}>{booking.meetingPoint}</strong>
            </div>
          )}
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EDE9FE', padding: '20px' }}>
          <h4 style={{ fontSize: '0.88rem', color: '#7C3AED', textTransform: 'uppercase', fontWeight: '700', marginBottom: '12px' }}>
            Booking Lifecycle
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
            {(booking.timeline && booking.timeline.length > 0 ? booking.timeline : [
              { step: 'Request Submitted', date: formatDateTime(booking.createdAt), completed: true },
              { step: 'Designer Approval', date: statusMeta.label, completed: ['accepted', 'confirmed', 'completed'].includes(statusKey) },
            ]).map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontWeight: item.completed ? '700' : '600', color: item.completed ? '#059669' : item.active ? '#7C3AED' : '#6B7280' }}>
                  <CheckCircle2 size={14} color={item.completed ? '#059669' : item.active ? '#7C3AED' : '#D1D5DB'} />
                  {item.step}
                </span>
                <small style={{ color: '#6B7280' }}>{[item.date, item.time].filter(Boolean).join(' • ')}</small>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column details: Customer Preferences & Stylist Info */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* Customer Requirements & Shopping Budget */}
        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EDE9FE', padding: '20px' }}>
          <h4 style={{ fontSize: '0.88rem', color: '#7C3AED', textTransform: 'uppercase', fontWeight: '700', marginBottom: '14px' }}>
            Customer Preferences &amp; Shopping Budget
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
            <div>
              <span style={{ color: '#6B7280', display: 'block', fontSize: '0.75rem' }}>Total Shopping Budget for Clothes</span>
              <strong style={{ color: '#1E1B4B', fontSize: '1.05rem' }}>{booking.shoppingBudget || 'Up to ₹20,000'}</strong>
            </div>
            <div>
              <span style={{ color: '#6B7280', display: 'block', fontSize: '0.75rem' }}>Aesthetic / Style Preference</span>
              <strong style={{ color: '#1E1B4B' }}>
                {clothingPref}{styleTags.length > 0 ? ` (${styleTags.join(', ')})` : ''}
              </strong>
            </div>
            <div>
              <span style={{ color: '#6B7280', display: 'block', fontSize: '0.75rem' }}>Preferred Colors</span>
              <strong style={{ color: '#1E1B4B' }}>{colorPref}</strong>
            </div>
            <div>
              <span style={{ color: '#6B7280', display: 'block', fontSize: '0.75rem' }}>Outfit Requirements / Instructions</span>
              <p style={{ margin: '2px 0 0 0', color: '#4B5563', lineHeight: 1.45 }}>
                {outfitReqs}
              </p>
              {specialNotes && specialNotes !== outfitReqs && (
                <p style={{ margin: '4px 0 0 0', color: '#6B7280', fontSize: '0.8rem' }}>
                  Note: {specialNotes}
                </p>
              )}
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
              alt={booking.designerName || 'Designer'}
              style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #DDD6FE' }}
              fallbackType="designer"
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <strong style={{ fontSize: '1rem', color: '#1E1B4B' }}>{booking.designerName}</strong>
                <CheckCircle2 size={16} color="#7C3AED" />
              </div>
              <div style={{ fontSize: '0.8rem', color: '#6B7280', margin: '2px 0 8px' }}>
                {booking.designerTitle || "Women's & Bridal Styling"} • {booking.designerLocation || 'Hyderabad'}
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
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
        {!isDesigner && statusKey === 'accepted' && booking.paymentStatus !== 'Advance Paid (30%)' && booking.paymentStatus !== 'Fully Paid' ? (
          <button type="button" className="zorevi-btn zorevi-btn--primary" onClick={() => setIsAdvancePayModalOpen(true)}>
            <CreditCard size={16} /> Pay 30% Advance (₹{advanceFee})
          </button>
        ) : (
          <Link to={`/${isDesigner ? 'designer' : 'customer'}/bookings/${booking.id}/messages`} className="zorevi-btn zorevi-btn--primary">
            <MessageSquare size={16} /> Open Chat
          </Link>
        )}

        {isActionable && (
          <>
            <button type="button" className="zorevi-btn zorevi-btn--outline" onClick={handleOpenReschedule}>
              <Calendar size={16} /> Reschedule Session
            </button>

            <button
              type="button"
              className="zorevi-btn zorevi-btn--ghost"
              style={{ color: '#EF4444' }}
              onClick={() => cancelBooking(booking.id, 'Customer requested cancellation from details')}
            >
              Cancel Booking
            </button>
          </>
        )}

        <button
          type="button"
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
            <button type="button" className="zorevi-btn zorevi-btn--outline" onClick={() => setIsRescheduleOpen(false)}>
              Back
            </button>
            <button type="button" className="zorevi-btn zorevi-btn--primary" onClick={handleRescheduleSubmit}>
              Confirm Reschedule
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
