import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, Clock, MapPin, MessageSquare, CheckCircle2, User,
  Check, ArrowRight, ShieldCheck, DollarSign
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import ImageWithFallback from '../../../components/common/ImageWithFallback';
import { normalizeBookingStatusKey } from '../../../utils';

export default function DesignerBookings() {
  const { bookings, completeBooking, addToast } = useApp();
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'completed', 'cancelled'

  const allBookings = bookings || [];

  const filteredBookings = allBookings.filter((b) => {
    const key = normalizeBookingStatusKey(b.status);
    if (activeTab === 'upcoming') {
      return key === 'confirmed' || key === 'accepted';
    }
    if (activeTab === 'completed') return key === 'completed';
    if (activeTab === 'cancelled') return key === 'cancelled' || key === 'rejected';
    return true;
  });

  const handleMarkComplete = (bookingId) => {
    completeBooking(bookingId);
  };

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: '850', color: '#1E1B4B', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
          My Confirmed Bookings
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#6B7280', margin: 0 }}>
          Manage your schedule, agreed meeting locations, advance payment statuses, and mark sessions as completed.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {[
          { id: 'upcoming', label: 'Upcoming & Confirmed' },
          { id: 'completed', label: 'Completed Sessions' },
          { id: 'cancelled', label: 'Cancelled / Declined' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '9px 18px',
              borderRadius: '9999px',
              border: activeTab === tab.id ? '1px solid #7C3AED' : '1px solid #E5E7EB',
              background: activeTab === tab.id ? '#7C3AED' : '#FFFFFF',
              color: activeTab === tab.id ? '#FFFFFF' : '#4B5563',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: activeTab === tab.id ? '0 4px 12px rgba(124, 58, 237, 0.22)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {filteredBookings.map((b) => {
            const fee = Number(b.designerFee || b.amount || 999);
            const advance = Math.round(fee * 0.3);
            const remaining = fee - advance;

            return (
              <div
                key={b.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '24px',
                  border: '1px solid #EDE9FE',
                  padding: '24px',
                  boxShadow: '0 4px 16px rgba(124, 58, 237, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                {/* Top header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <ImageWithFallback
                      src={b.customerAvatar || '/images/customer-praveen.png'}
                      alt={b.customerName}
                      style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                      fallbackType="avatar"
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ fontSize: '1.1rem', color: '#1E1B4B' }}>{b.customerName || 'Praveen Kumar'}</strong>
                        <span style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>#{b.id}</span>
                      </div>
                      <span style={{ fontSize: '0.82rem', color: '#7C3AED', fontWeight: '600' }}>
                        {b.occasion || 'Wedding'} • {b.category || 'Women'}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        background: b.status === 'Completed' ? '#F3F4F6' : '#ECFDF5',
                        color: b.status === 'Completed' ? '#374151' : '#059669',
                        border: `1px solid ${b.status === 'Completed' ? '#E5E7EB' : '#A7F3D0'}`,
                      }}
                    >
                      {b.status}
                    </span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        background: '#FAF5FF',
                        color: '#7C3AED',
                        border: '1px solid #DDD6FE',
                      }}
                    >
                      {b.paymentStatus || '30% Advance Paid'}
                    </span>
                  </div>
                </div>

                {/* Details row */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px',
                    padding: '14px 18px',
                    background: '#F9FAFB',
                    borderRadius: '16px',
                    border: '1px solid #F3F4F6',
                    fontSize: '0.84rem',
                  }}
                >
                  <div>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: '#9CA3AF', textTransform: 'uppercase', fontWeight: '600', marginBottom: '2px' }}>
                      Schedule
                    </span>
                    <strong style={{ color: '#1E1B4B' }}>{b.date} at {b.time || b.startTime}</strong>
                  </div>

                  <div>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: '#9CA3AF', textTransform: 'uppercase', fontWeight: '600', marginBottom: '2px' }}>
                      Meeting Location
                    </span>
                    <strong style={{ color: '#1E1B4B' }}>{b.meetingLocation || b.location?.mallName || 'Lakeside Fashion Mall'}</strong>
                  </div>

                  <div>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: '#9CA3AF', textTransform: 'uppercase', fontWeight: '600', marginBottom: '2px' }}>
                      Client Shopping Budget
                    </span>
                    <strong style={{ color: '#1E1B4B' }}>{b.shoppingBudget || 'Up to ₹20,000'}</strong>
                  </div>

                  <div>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: '#9CA3AF', textTransform: 'uppercase', fontWeight: '600', marginBottom: '2px' }}>
                      Designer Service Fee
                    </span>
                    <strong style={{ color: '#7C3AED' }}>₹{fee}</strong>
                    <small style={{ display: 'block', color: '#6B7280', fontSize: '0.72rem' }}>Advance: ₹{advance} • Due at session: ₹{remaining}</small>
                  </div>
                </div>

                {/* Actions row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px', borderTop: '1px solid #F3F4F6' }}>
                  <Link to={`/customer/bookings/${b.id}/messages`} className="zorevi-btn zorevi-btn--outline zorevi-btn--sm">
                    <MessageSquare size={14} /> Message Client
                  </Link>

                  {b.status !== 'Completed' && (
                    <button
                      type="button"
                      className="zorevi-btn zorevi-btn--primary zorevi-btn--sm"
                      style={{ background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)' }}
                      onClick={() => handleMarkComplete(b.id)}
                    >
                      <Check size={14} strokeWidth={3} />
                      <span>Mark Session Completed</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px dashed #DDD6FE', padding: '60px 24px', textAlign: 'center' }}>
          <Calendar size={44} color="#7C3AED" style={{ marginBottom: '14px', opacity: 0.6 }} />
          <h3 style={{ fontSize: '1.25rem', color: '#1E1B4B', margin: '0 0 6px 0' }}>No bookings in this tab</h3>
          <p style={{ fontSize: '0.88rem', color: '#6B7280', margin: 0 }}>
            Check your Booking Requests tab to review and accept incoming client inquiries.
          </p>
        </div>
      )}
    </div>
  );
}
