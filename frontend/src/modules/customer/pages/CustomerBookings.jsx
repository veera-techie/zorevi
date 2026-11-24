import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, Clock, MapPin, MessageSquare, Star, RotateCcw,
  AlertCircle, CheckCircle2, ChevronRight, CreditCard, X, ShieldCheck,
  Building2, ArrowRight
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import ImageWithFallback from '../../../components/common/ImageWithFallback';
import Modal from '../../../components/common/Modal';
import BookingModal from '../../../components/cards/BookingModal';

export default function CustomerBookings() {
  const { bookings, cancelBooking, addToast } = useApp();
  const [activeTab, setActiveTab] = useState('all'); // all, pending, awaiting, confirmed, upcoming, completed, cancelled
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState('Change of plans / Schedule conflict');
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [bookingForAdvancePay, setBookingForAdvancePay] = useState(null);
  const [isAdvancePayModalOpen, setIsAdvancePayModalOpen] = useState(false);

  const allBookings = bookings || [];

  const tabCounts = {
    all: allBookings.length,
    pending: allBookings.filter((b) => b.status === 'Pending Confirmation' || b.status === 'Pending').length,
    awaiting: allBookings.filter((b) => b.status === 'Awaiting Payment' || b.status === 'Alternative Proposed').length,
    confirmed: allBookings.filter((b) => b.status === 'Confirmed' || b.paymentStatus === 'Advance Paid (30%)').length,
    upcoming: allBookings.filter((b) => b.status === 'Confirmed' || b.status === 'Upcoming').length,
    completed: allBookings.filter((b) => b.status === 'Completed').length,
    cancelled: allBookings.filter((b) => b.status === 'Cancelled' || b.status === 'Declined').length,
  };

  const filteredBookings = allBookings.filter((b) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return b.status === 'Pending Confirmation' || b.status === 'Pending';
    if (activeTab === 'awaiting') return b.status === 'Awaiting Payment' || b.status === 'Alternative Proposed';
    if (activeTab === 'confirmed') return b.status === 'Confirmed' || b.paymentStatus === 'Advance Paid (30%)';
    if (activeTab === 'upcoming') return b.status === 'Confirmed' || b.status === 'Upcoming';
    if (activeTab === 'completed') return b.status === 'Completed';
    if (activeTab === 'cancelled') return b.status === 'Cancelled' || b.status === 'Declined';
    return true;
  });

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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending Confirmation':
      case 'Pending':
        return { label: 'Pending Confirmation', bg: '#FEF3C7', color: '#B45309', border: '#FDE68A' };
      case 'Awaiting Payment':
        return { label: 'Designer Accepted • Awaiting 30% Advance', bg: '#ECFDF5', color: '#047857', border: '#6EE7B7' };
      case 'Alternative Proposed':
        return { label: 'Alternative Slot Proposed', bg: '#EFF6FF', color: '#1D4ED8', border: '#93C5FD' };
      case 'Confirmed':
      case 'Upcoming':
        return { label: 'Confirmed Appointment', bg: '#EDE9FE', color: '#6D28D9', border: '#C4B5FD' };
      case 'Completed':
        return { label: 'Completed Session', bg: '#F3F4F6', color: '#374151', border: '#E5E7EB' };
      case 'Cancelled':
      case 'Declined':
        return { label: status, bg: '#FEE2E2', color: '#B91C1C', border: '#FCA5A5' };
      default:
        return { label: status, bg: '#F3F4F6', color: '#4B5563', border: '#E5E7EB' };
    }
  };

  const getPaymentBadge = (status) => {
    switch (status) {
      case 'Advance Paid (30%)':
        return { label: '30% Advance Paid', bg: '#D1FAE5', color: '#065F46' };
      case 'Fully Paid':
        return { label: 'Fully Paid (100%)', bg: '#D1FAE5', color: '#065F46' };
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
          My Bookings & Inquiries
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#6B7280', margin: 0 }}>
          Track booking requests, designer confirmations, advance payments, and scheduled sessions.
        </p>
      </div>

      {/* Tabs Row */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { id: 'all', label: 'All Bookings', count: tabCounts.all },
          { id: 'awaiting', label: 'Awaiting Payment', count: tabCounts.awaiting },
          { id: 'pending', label: 'Pending Confirmation', count: tabCounts.pending },
          { id: 'confirmed', label: 'Confirmed', count: tabCounts.confirmed },
          { id: 'completed', label: 'Completed', count: tabCounts.completed },
          { id: 'cancelled', label: 'Cancelled', count: tabCounts.cancelled },
        ].map((tab) => (
          <button
            key={tab.id}
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
                  background: activeTab === tab.id ? 'rgba(255,255,255,0.25)' : (tab.id === 'awaiting' ? '#FEF3C7' : '#F3F4F6'),
                  color: activeTab === tab.id ? '#FFFFFF' : (tab.id === 'awaiting' ? '#B45309' : '#6B7280'),
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredBookings.map((b) => {
            const statusBadge = getStatusBadge(b.status);
            const payBadge = getPaymentBadge(b.paymentStatus);
            const designerFee = Number(b.designerFee || b.amount || 999);
            const advanceFee = Math.round(designerFee * 0.3);
            const remainingFee = designerFee - advanceFee;

            return (
              <div
                key={b.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '24px',
                  border: b.status === 'Awaiting Payment' ? '1.5px solid #86EFAC' : '1px solid #EDE9FE',
                  padding: '24px',
                  boxShadow: b.status === 'Awaiting Payment' ? '0 6px 24px rgba(16, 185, 129, 0.08)' : '0 4px 16px rgba(124, 58, 237, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '18px',
                }}
              >
                {/* Header row: Designer Info & Status Badges */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <ImageWithFallback
                      src={b.designerAvatar || '/assets/images/designer-aarohi.jpg'}
                      alt={b.designerName}
                      style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #DDD6FE' }}
                      fallbackType="designer"
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Link to={`/customer/designers/${b.designerId || 'des-001'}`} style={{ textDecoration: 'none', color: '#1E1B4B', fontWeight: '800', fontSize: '1.1rem' }}>
                          {b.designerName || 'Aarohi Mehta'}
                        </Link>
                        <span style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>#{b.id}</span>
                      </div>
                      <span style={{ fontSize: '0.82rem', color: '#6B7280' }}>
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
                        fontSize: '0.75rem',
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

                {/* Middle details: Occasion, Services, Schedule, Budget */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '14px',
                    padding: '16px',
                    background: '#F9FAFB',
                    borderRadius: '16px',
                    border: '1px solid #F3F4F6',
                    fontSize: '0.85rem',
                  }}
                >
                  <div>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: '#9CA3AF', textTransform: 'uppercase', fontWeight: '600', marginBottom: '2px' }}>
                      Occasion & Category
                    </span>
                    <strong style={{ color: '#1E1B4B' }}>{b.occasion || 'Wedding'}</strong>
                    <span style={{ color: '#6B7280' }}> ({b.category || 'Women'})</span>
                  </div>

                  <div>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: '#9CA3AF', textTransform: 'uppercase', fontWeight: '600', marginBottom: '2px' }}>
                      Schedule & Meeting
                    </span>
                    <strong style={{ color: '#1E1B4B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={13} color="#7C3AED" /> {b.date} at {b.time || b.startTime}
                    </strong>
                    <span style={{ color: '#6B7280', fontSize: '0.78rem' }}>
                      {b.meetingLocation || b.location?.mallName || 'Lakeside Fashion Mall'}
                    </span>
                  </div>

                  <div>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: '#9CA3AF', textTransform: 'uppercase', fontWeight: '600', marginBottom: '2px' }}>
                      Customer Shopping Budget
                    </span>
                    <strong style={{ color: '#1E1B4B' }}>{b.shoppingBudget || 'Up to ₹20,000'}</strong>
                    <span style={{ color: '#6B7280', fontSize: '0.75rem', display: 'block' }}>Wardrobe purchase fund</span>
                  </div>

                  <div>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: '#9CA3AF', textTransform: 'uppercase', fontWeight: '600', marginBottom: '2px' }}>
                      Designer Service Fee
                    </span>
                    <strong style={{ color: '#7C3AED', fontSize: '1.05rem' }}>₹{designerFee}</strong>
                    <span style={{ color: '#6B7280', fontSize: '0.75rem', display: 'block' }}>
                      30% Advance: ₹{advanceFee} • Remaining 70%: ₹{remainingFee}
                    </span>
                  </div>
                </div>

                {/* Booking Progress Timeline */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 4px 4px', overflowX: 'auto', gap: '8px' }}>
                  {[
                    { step: '1. Request Sent', done: true },
                    { step: '2. Designer Accepted', done: b.status !== 'Pending Confirmation' && b.status !== 'Declined' },
                    { step: '3. 30% Advance Paid', done: b.paymentStatus === 'Advance Paid (30%)' || b.status === 'Confirmed' || b.status === 'Completed' },
                    { step: '4. Styling Session', done: b.status === 'Completed' },
                  ].map((st, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: st.done ? '#059669' : '#9CA3AF', fontWeight: st.done ? '700' : '500', whiteSpace: 'nowrap' }}>
                      {st.done ? <CheckCircle2 size={14} color="#059669" /> : <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#E5E7EB' }} />}
                      <span>{st.step}</span>
                      {idx < 3 && <span style={{ color: '#D1D5DB', marginLeft: 6 }}>→</span>}
                    </div>
                  ))}
                </div>

                {/* Bottom Actions Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid #F3F4F6', flexWrap: 'wrap', gap: '10px' }}>
                  <Link
                    to={`/customer/bookings/${b.id}`}
                    style={{ fontSize: '0.85rem', color: '#7C3AED', fontWeight: '700', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <span>View Booking Details</span>
                    <ArrowRight size={14} />
                  </Link>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* If awaiting payment -> PROMINENT PAY ADVANCE BUTTON */}
                    {b.status === 'Awaiting Payment' && (
                      <button
                        type="button"
                        className="zorevi-btn zorevi-btn--primary"
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
                    {(b.status === 'Pending Confirmation' || b.status === 'Pending') && (
                      <button
                        type="button"
                        className="zorevi-btn zorevi-btn--ghost zorevi-btn--sm"
                        onClick={() => handleOpenCancel(b)}
                        style={{ color: '#DC2626' }}
                      >
                        Cancel Request
                      </button>
                    )}

                    {/* If confirmed -> can chat or directions */}
                    {(b.status === 'Confirmed' || b.status === 'Upcoming') && (
                      <>
                        <Link to={`/customer/bookings/${b.id}`} className="zorevi-btn zorevi-btn--outline zorevi-btn--sm">
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
            <button className="zorevi-btn zorevi-btn--ghost" onClick={() => setIsCancelModalOpen(false)}>
              Keep Booking
            </button>
            <button
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
