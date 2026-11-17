import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, Clock, MapPin, MessageSquare, Star, RotateCcw,
  AlertCircle, CheckCircle2, ChevronRight
} from 'lucide-react';
import { mockBookings } from '../../../services/mockData';
import { useApp } from '../../../context/AppContext';
import ImageWithFallback from '../../../components/common/ImageWithFallback';
import Badge from '../../../components/common/Badge';
import Modal from '../../../components/common/Modal';

export default function CustomerBookings() {
  const [activeTab, setActiveTab] = useState('upcoming'); // upcoming, pending, completed, cancelled
  const [bookingsList, setBookingsList] = useState(mockBookings);
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState('Schedule Conflict');
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const { addToast } = useApp();

  const filteredBookings = bookingsList.filter((b) => {
    if (activeTab === 'upcoming') return b.status === 'Confirmed' || b.status === 'Upcoming';
    if (activeTab === 'pending') return b.status === 'Pending';
    if (activeTab === 'completed') return b.status === 'Completed';
    if (activeTab === 'cancelled') return b.status === 'Cancelled';
    return true;
  });

  const handleOpenCancel = (booking) => {
    setSelectedBookingForCancel(booking);
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    if (!selectedBookingForCancel) return;
    setBookingsList((prev) =>
      prev.map((b) => (b.id === selectedBookingForCancel.id ? { ...b, status: 'Cancelled' } : b))
    );
    setIsCancelModalOpen(false);
    addToast(`Booking #${selectedBookingForCancel.id} has been cancelled. Refund initiated.`, 'info');
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#1E1B4B', margin: '0 0 6px 0' }}>
          My Bookings
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#6B7280', margin: 0 }}>
          View, manage and track all your past and upcoming styling sessions.
        </p>
      </div>

      {/* Tabs Row matching screenshot */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { id: 'upcoming', label: 'Upcoming', count: bookingsList.filter(b => b.status === 'Confirmed' || b.status === 'Upcoming').length },
          { id: 'pending', label: 'Pending', count: bookingsList.filter(b => b.status === 'Pending').length },
          { id: 'completed', label: 'Completed', count: bookingsList.filter(b => b.status === 'Completed').length },
          { id: 'cancelled', label: 'Cancelled', count: bookingsList.filter(b => b.status === 'Cancelled').length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 20px',
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
              boxShadow: activeTab === tab.id ? '0 4px 12px rgba(124, 58, 237, 0.25)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span
                style={{
                  background: activeTab === tab.id ? 'rgba(255,255,255,0.25)' : '#F3F4F6',
                  color: activeTab === tab.id ? '#FFFFFF' : '#6B7280',
                  padding: '1px 7px',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Bookings Cards List matching screenshot */}
      {filteredBookings.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid #F3F4F6',
                padding: '20px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                display: 'grid',
                gridTemplateColumns: '120px 1fr auto',
                gap: '20px',
                alignItems: 'center',
              }}
            >
              {/* Thumbnail image */}
              <div style={{ width: '120px', height: '100px', borderRadius: '14px', overflow: 'hidden', background: '#F5F0FF' }}>
                <ImageWithFallback
                  src={b.designerAvatar}
                  alt={b.service}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  fallbackType="fashion"
                />
              </div>

              {/* Booking Info */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1E1B4B', margin: 0 }}>
                    {b.service}
                  </h3>
                  <Badge variant={b.status === 'Confirmed' ? 'confirmed' : b.status === 'Pending' ? 'pending' : b.status === 'Completed' ? 'completed' : 'cancelled'} size="sm">
                    {b.status}
                  </Badge>
                </div>

                <div style={{ fontSize: '0.85rem', color: '#4B5563', marginBottom: '6px' }}>
                  <strong>Designer:</strong> {b.designerName}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.8rem', color: '#6B7280', flexWrap: 'wrap' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} color="#7C3AED" /> {b.date}
                  </span>
                  <span>•</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={13} color="#7C3AED" /> {b.startTime} ({b.duration} hrs)
                  </span>
                  {b.location?.mallName && (
                    <>
                      <span>•</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={13} color="#7C3AED" /> {b.location.mallName}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Actions Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '160px' }}>
                <Link to={`/customer/bookings/${b.id}`} className="zorevi-btn zorevi-btn--primary zorevi-btn--sm">
                  View Details
                </Link>

                {b.status === 'Confirmed' && (
                  <Link to={`/customer/bookings/${b.id}/messages`} className="zorevi-btn zorevi-btn--outline zorevi-btn--sm">
                    <MessageSquare size={13} /> Join Chat
                  </Link>
                )}

                {b.status === 'Pending' && (
                  <button
                    className="zorevi-btn zorevi-btn--ghost zorevi-btn--sm"
                    onClick={() => handleOpenCancel(b)}
                  >
                    Cancel Request
                  </button>
                )}

                {b.status === 'Completed' && (
                  <Link to="/customer/reviews" className="zorevi-btn zorevi-btn--outline zorevi-btn--sm">
                    <Star size={13} /> Leave a Review
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FFFFFF', borderRadius: '20px', border: '1px dashed #DDD6FE' }}>
          <Calendar size={36} color="#7C3AED" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.2rem', color: '#1E1B4B', marginBottom: '6px' }}>No bookings in this category</h3>
          <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '20px' }}>
            Ready for your next styling makeover? Explore expert stylists in your area.
          </p>
          <Link to="/customer/designers" className="zorevi-btn zorevi-btn--primary">
            Explore Designers
          </Link>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {isCancelModalOpen && (
        <Modal
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          title="Cancel Booking Request"
          maxWidth="480px"
        >
          <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: '1.5', marginBottom: '16px' }}>
            Are you sure you want to cancel booking <strong>#{selectedBookingForCancel?.id}</strong>? If already paid, a full refund will be processed to your original payment method.
          </p>

          <div className="zorevi-form-group">
            <label className="zorevi-form-label">Reason for Cancellation</label>
            <select
              className="zorevi-input"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            >
              <option>Schedule Conflict</option>
              <option>Found Alternate Stylist</option>
              <option>Event Cancelled / Postponed</option>
              <option>Cost / Pricing Change</option>
              <option>Other Reason</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '24px' }}>
            <button className="zorevi-btn zorevi-btn--outline" onClick={() => setIsCancelModalOpen(false)}>
              Keep Booking
            </button>
            <button className="zorevi-btn zorevi-btn--primary" style={{ background: '#EF4444' }} onClick={handleConfirmCancel}>
              Confirm Cancellation
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

