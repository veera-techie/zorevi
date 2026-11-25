import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, Clock, MapPin, MessageSquare, CheckCircle2, CreditCard, ArrowRight
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { useAuth } from '../../../context/AuthContext';
import ImageWithFallback from '../../../components/common/ImageWithFallback';
import Modal from '../../../components/common/Modal';
import BookingModal from '../../../components/cards/BookingModal';
import {
  formatDate,
  formatDateTime,
  formatTime,
  getBookingStatusMeta,
  isCustomerBooking,
  normalizeBookingStatusKey,
} from '../../../utils';

export default function CustomerBookings() {
  const { bookings, cancelBooking } = useApp();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all'); // all, pending, accepted, confirmed, completed, rejected, cancelled
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState('Change of plans / Schedule conflict');
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [bookingForAdvancePay, setBookingForAdvancePay] = useState(null);
  const [isAdvancePayModalOpen, setIsAdvancePayModalOpen] = useState(false);

  const customerBookings = useMemo(
    () => (bookings || []).filter((b) => isCustomerBooking(b, user)),
    [bookings, user]
  );

  const tabCounts = useMemo(() => ({
    all: customerBookings.length,
    pending: customerBookings.filter((b) => normalizeBookingStatusKey(b.status) === 'pending').length,
    accepted: customerBookings.filter((b) => {
      const k = normalizeBookingStatusKey(b.status);
      return k === 'accepted' || k === 'alternative';
    }).length,
    confirmed: customerBookings.filter((b) => normalizeBookingStatusKey(b.status) === 'confirmed').length,
    completed: customerBookings.filter((b) => normalizeBookingStatusKey(b.status) === 'completed').length,
    rejected: customerBookings.filter((b) => normalizeBookingStatusKey(b.status) === 'rejected').length,
    cancelled: customerBookings.filter((b) => normalizeBookingStatusKey(b.status) === 'cancelled').length,
  }), [customerBookings]);

  const filteredBookings = useMemo(() => customerBookings.filter((b) => {
    const key = normalizeBookingStatusKey(b.status);
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return key === 'pending';
    if (activeTab === 'accepted') return key === 'accepted' || key === 'alternative';
    if (activeTab === 'confirmed') return key === 'confirmed';
    if (activeTab === 'completed') return key === 'completed';
    if (activeTab === 'rejected') return key === 'rejected';
    if (activeTab === 'cancelled') return key === 'cancelled';
    return true;
  }), [customerBookings, activeTab]);

  const handleOpenCancel = (booking) => {
    setSelectedBookingForCancel(booking);
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    if (!selectedBookingForCancel) return;
    cancelBooking(selectedBookingForCancel.id, cancelReason);
    setIsCancelModalOpen(false);
    setSelectedBookingForCancel(null);
  };

  const handleOpenAdvancePay = (booking) => {
    setBookingForAdvancePay(booking);
    setIsAdvancePayModalOpen(true);
  };

  const getPaymentBadge = (status) => {
    switch (status) {
      case 'Advance Paid (30%)':
        return { label: '30% Advance Paid', bg: '#D1FAE5', color: '#065F46' };
      case 'Fully Paid':
      case 'Successful':
        return { label: 'Fully Paid (100%)', bg: '#D1FAE5', color: '#065F46' };
      case 'Refund Initiated':
        return { label: 'Refund Initiated', bg: '#EEF2FF', color: '#4338CA' };
      case 'Cancelled':
        return { label: 'Cancelled', bg: '#F3F4F6', color: '#6B7280' };
      case 'Awaiting 30% Advance':
      case 'Awaiting Advance (30%)':
      case 'Unpaid':
        return { label: 'Advance Pending (30%)', bg: '#FEF3C7', color: '#92400E' };
      default:
        return { label: status || 'Unpaid', bg: '#F3F4F6', color: '#6B7280' };
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: '850', color: '#1E1B4B', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
          My Bookings &amp; Inquiries
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#6B7280', margin: 0 }}>
          Track booking requests, designer approvals, advance payments, and scheduled styling sessions.
        </p>
      </div>

      {/* Tabs Row */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { id: 'all', label: 'All Bookings', count: tabCounts.all },
          { id: 'pending', label: 'Pending Approval', count: tabCounts.pending },
          { id: 'accepted', label: 'Accepted', count: tabCounts.accepted },
          { id: 'confirmed', label: 'Confirmed', count: tabCounts.confirmed },
          { id: 'completed', label: 'Completed', count: tabCounts.completed },
          { id: 'rejected', label: 'Rejected', count: tabCounts.rejected },
          { id: 'cancelled', label: 'Cancelled', count: tabCounts.cancelled },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 18px',
              borderRadius: '9999px',
              border: activeTab === tab.id ? '1px solid #7C3AED' : '1px solid #E5E7EB',
              background: activeTab === tab.id ? '#7C3AED' : '#FFFFFF',
              color: activeTab === tab.id ? '#FFFFFF' : '#4B5563',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              boxShadow: activeTab === tab.id ? '0 4px 12px rgba(124, 58, 237, 0.22)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span
                style={{
                  background: activeTab === tab.id ? 'rgba(255,255,255,0.25)' : (tab.id === 'accepted' ? '#FEF3C7' : '#F3F4F6'),
                  color: activeTab === tab.id ? '#FFFFFF' : (tab.id === 'accepted' ? '#B45309' : '#6B7280'),
                  padding: '1px 7px',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: '700',
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredBookings.map((b) => {
            const statusKey = normalizeBookingStatusKey(b.status);
            const statusBadge = getBookingStatusMeta(b.status);
            const payBadge = getPaymentBadge(b.paymentStatus);
            const designerFee = Number(b.designerFee || b.amount || 999);
            const advanceFee = Math.round(designerFee * 0.3);
            const remainingFee = designerFee - advanceFee;
            const sessionTime = formatTime(b.time || b.startTime, '11:00 AM');
            const submittedAtText = formatDateTime(b.createdAt || b.submittedAt, '—');
            const venueText = b.meetingLocation || b.mall?.name || b.location?.mallName || 'Lakeside Fashion Mall';

            return (
              <div
                key={b.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  border: statusKey === 'accepted' ? '1.5px solid #86EFAC' : '1px solid #EDE9FE',
                  padding: '20px 22px',
                  boxShadow: statusKey === 'accepted' ? '0 6px 24px rgba(16, 185, 129, 0.08)' : '0 4px 16px rgba(124, 58, 237, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                {/* Header row: Designer Info, Ref ID & Status Badges */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <ImageWithFallback
                      src={b.designerAvatar || '/assets/images/designer-aarohi.jpg'}
                      alt={b.designerName || 'Designer'}
                      style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #DDD6FE' }}
                      fallbackType="designer"
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <Link
                          to={`/customer/designers/${b.designerId || 'des-001'}`}
                          style={{ textDecoration: 'none', color: '#1E1B4B', fontWeight: '800', fontSize: '1.05rem' }}
                        >
                          {b.designerName || 'Aarohi Mehta'}
                        </Link>
                        {b.id && (
                          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#7C3AED', background: '#F5F0FF', padding: '2px 8px', borderRadius: '9999px' }}>
                            #{b.id}
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                        {b.designerTitle || "Women's & Bridal Styling"} • {b.designerLocation || 'Hyderabad'}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        background: statusBadge.bg,
                        color: statusBadge.color,
                        border: `1px solid ${statusBadge.border}`,
                      }}
                    >
                      {statusBadge.label}
                    </span>
                    <span
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: '600',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        background: payBadge.bg,
                        color: payBadge.color,
                      }}
                    >
                      {payBadge.label}
                    </span>
                  </div>
                </div>

                {/* Compact Details Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(195px, 1fr))',
                    gap: '12px',
                    padding: '14px 16px',
                    background: '#F9FAFB',
                    borderRadius: '14px',
                    border: '1px solid #F3F4F6',
                    fontSize: '0.84rem',
                  }}
                >
                  <div>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: '#9CA3AF', textTransform: 'uppercase', fontWeight: '600', marginBottom: '2px' }}>
                      Occasion &amp; Service
                    </span>
                    <strong style={{ color: '#1E1B4B' }}>{b.occasion || 'Wedding'}</strong>
                    <span style={{ color: '#6B7280', display: 'block', fontSize: '0.76rem' }}>
                      {Array.isArray(b.services) && b.services.length > 0 ? b.services[0] : (b.service || 'Personal Styling')}
                    </span>
                  </div>

                  <div>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: '#9CA3AF', textTransform: 'uppercase', fontWeight: '600', marginBottom: '2px' }}>
                      Requested Session
                    </span>
                    <strong style={{ color: '#1E1B4B', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Calendar size={13} color="#7C3AED" /> {formatDate(b.date, b.date)} • {sessionTime}
                    </strong>
                    <span style={{ color: '#6B7280', fontSize: '0.76rem', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <MapPin size={12} /> {venueText}
                    </span>
                  </div>

                  <div>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: '#9CA3AF', textTransform: 'uppercase', fontWeight: '600', marginBottom: '2px' }}>
                      Submitted On
                    </span>
                    <strong style={{ color: '#1E1B4B', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Clock size={13} color="#7C3AED" /> {submittedAtText}
                    </strong>
                    <span style={{ color: '#6B7280', fontSize: '0.75rem', display: 'block', marginTop: '2px' }}>
                      Budget: {b.shoppingBudget || 'Up to ₹20,000'}
                    </span>
                  </div>

                  <div>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: '#9CA3AF', textTransform: 'uppercase', fontWeight: '600', marginBottom: '2px' }}>
                      Designer Service Fee
                    </span>
                    <strong style={{ color: '#7C3AED', fontSize: '1.02rem' }}>₹{designerFee}</strong>
                    <span style={{ color: '#6B7280', fontSize: '0.74rem', display: 'block' }}>
                      30% Advance: ₹{advanceFee} • Balance: ₹{remainingFee}
                    </span>
                  </div>
                </div>

                {/* Alternative slot or decline/cancel notice if present */}
                {statusKey === 'alternative' && b.proposedDate && (
                  <div style={{ padding: '10px 14px', borderRadius: '12px', background: '#EFF6FF', border: '1px solid #BFDBFE', fontSize: '0.82rem', color: '#1E40AF' }}>
                    <strong>Alternative Slot Proposed:</strong> {formatDate(b.proposedDate, b.proposedDate)} at {b.proposedTime}
                    {b.designerNote ? ` — "${b.designerNote}"` : ''}
                  </div>
                )}

                {(statusKey === 'rejected' || statusKey === 'cancelled') && (b.declineReason || b.cancelReason) && (
                  <div style={{ padding: '10px 14px', borderRadius: '12px', background: '#FEF2F2', border: '1px solid #FECACA', fontSize: '0.82rem', color: '#991B1B' }}>
                    <strong>{statusKey === 'rejected' ? 'Designer Note:' : 'Cancellation Reason:'}</strong> {b.declineReason || b.cancelReason}
                  </div>
                )}

                {/* Booking Progress Timeline (compact) */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 2px 0', overflowX: 'auto', gap: '8px' }}>
                  {[
                    { step: '1. Request Submitted', done: true },
                    { step: '2. Designer Approved', done: statusKey === 'accepted' || statusKey === 'confirmed' || statusKey === 'completed' },
                    { step: '3. 30% Advance Paid', done: b.paymentStatus === 'Advance Paid (30%)' || b.paymentStatus === 'Fully Paid' || statusKey === 'confirmed' || statusKey === 'completed' },
                    { step: '4. Styling Session', done: statusKey === 'completed' },
                  ].map((st, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: st.done ? '#059669' : '#9CA3AF', fontWeight: st.done ? '700' : '500', whiteSpace: 'nowrap' }}>
                      {st.done ? <CheckCircle2 size={14} color="#059669" /> : <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#E5E7EB' }} />}
                      <span>{st.step}</span>
                      {idx < 3 && <span style={{ color: '#D1D5DB', marginLeft: 4 }}>→</span>}
                    </div>
                  ))}
                </div>

                {/* Bottom Actions Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #F3F4F6', flexWrap: 'wrap', gap: '10px' }}>
                  <Link
                    to={`/customer/bookings/${b.id}`}
                    className="zorevi-btn zorevi-btn--outline zorevi-btn--sm"
                  >
                    <span>View Details</span>
                    <ArrowRight size={14} />
                  </Link>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* If accepted / awaiting payment -> PROMINENT PAY ADVANCE BUTTON */}
                    {statusKey === 'accepted' && b.paymentStatus !== 'Advance Paid (30%)' && b.paymentStatus !== 'Fully Paid' && (
                      <button
                        type="button"
                        className="zorevi-btn zorevi-btn--primary zorevi-btn--sm"
                        onClick={() => handleOpenAdvancePay(b)}
                        style={{
                          background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
                          boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
                        }}
                      >
                        <CreditCard size={15} />
                        <span>Pay 30% Advance (₹{advanceFee})</span>
                      </button>
                    )}

                    {/* If pending -> can cancel */}
                    {statusKey === 'pending' && (
                      <button
                        type="button"
                        className="zorevi-btn zorevi-btn--ghost zorevi-btn--sm"
                        onClick={() => handleOpenCancel(b)}
                        style={{ color: '#DC2626' }}
                      >
                        Cancel Request
                      </button>
                    )}

                    {/* If confirmed -> can chat or cancel */}
                    {statusKey === 'confirmed' && (
                      <>
                        <Link to={`/customer/bookings/${b.id}/messages`} className="zorevi-btn zorevi-btn--outline zorevi-btn--sm">
                          <MessageSquare size={14} /> Message Designer
                        </Link>
                        <button
                          type="button"
                          className="zorevi-btn zorevi-btn--ghost zorevi-btn--sm"
                          onClick={() => handleOpenCancel(b)}
                          style={{ color: '#DC2626' }}
                        >
                          Cancel Booking
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px dashed #DDD6FE', padding: '60px 24px', textAlign: 'center' }}>
          <Calendar size={44} color="#7C3AED" style={{ marginBottom: '14px', opacity: 0.6 }} />
          <h3 style={{ fontSize: '1.25rem', color: '#1E1B4B', margin: '0 0 6px 0' }}>No bookings found in this tab</h3>
          <p style={{ fontSize: '0.88rem', color: '#6B7280', margin: '0 0 20px 0' }}>
            Looking to style an outfit for an upcoming wedding, party, or casual wardrobe refresh?
          </p>
          <Link to="/customer/designers" className="zorevi-btn zorevi-btn--primary">
            <span>Find Nearby Designers</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      )}

      {/* Advance Payment Modal */}
      {isAdvancePayModalOpen && bookingForAdvancePay && (
        <BookingModal
          isOpen={isAdvancePayModalOpen}
          onClose={() => {
            setIsAdvancePayModalOpen(false);
            setBookingForAdvancePay(null);
          }}
          bookingToPay={bookingForAdvancePay}
          initialStep={9}
        />
      )}

      {/* Cancellation Modal */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Cancel Booking Request"
        maxWidth="500px"
      >
        <div style={{ padding: '8px 4px 16px' }}>
          <p style={{ fontSize: '0.9rem', color: '#4B5563', margin: '0 0 16px 0' }}>
            Are you sure you want to cancel booking #{selectedBookingForCancel?.id}?
            {selectedBookingForCancel?.paymentStatus === 'Advance Paid (30%)' && (
              <strong style={{ display: 'block', color: '#059669', marginTop: 6 }}>
                Your 30% advance payment will be 100% refunded to your source account.
              </strong>
            )}
          </p>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#374151', marginBottom: 6 }}>
              Reason for Cancellation
            </label>
            <select
              className="zorevi-select"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            >
              <option value="Change of plans / Schedule conflict">Change of plans / Schedule conflict</option>
              <option value="Found another outfit / designer">Found another outfit / designer</option>
              <option value="Budget considerations">Budget considerations</option>
              <option value="Other reason">Other reason</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="zorevi-btn zorevi-btn--ghost" onClick={() => setIsCancelModalOpen(false)}>
              Keep Booking
            </button>
            <button
              type="button"
              className="zorevi-btn zorevi-btn--primary"
              style={{ background: '#DC2626' }}
              onClick={handleConfirmCancel}
            >
              Confirm Cancellation
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
