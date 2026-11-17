import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, MessageSquare, CheckCircle2, User } from 'lucide-react';
import { mockBookings } from '../../../services/mockData';
import Badge from '../../../components/common/Badge';

export default function DesignerBookings() {
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'completed', 'cancelled'

  const filteredBookings = mockBookings.filter((b) => {
    if (activeTab === 'upcoming') return b.status === 'Confirmed' || b.status === 'Upcoming' || b.status === 'Pending';
    if (activeTab === 'completed') return b.status === 'Completed';
    if (activeTab === 'cancelled') return b.status === 'Cancelled';
    return true;
  });

  return (
    <div style={{ width: '100%', paddingBottom: '60px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#1E1B4B', margin: '0 0 4px 0' }}>
          My Client Bookings
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: 0 }}>
          Manage your schedule, agreed meeting locations, and customer messaging.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {['upcoming', 'completed', 'cancelled'].map((tab) => (
          <button
            key={tab}
            className={`zorevi-btn zorevi-btn--sm ${activeTab === tab ? 'zorevi-btn--primary' : 'zorevi-btn--outline'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Bookings
          </button>
        ))}
      </div>

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
              gridTemplateColumns: '1fr auto',
              gap: '20px',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1E1B4B', margin: 0 }}>
                  {b.service}
                </h3>
                <Badge variant={b.status === 'Confirmed' ? 'confirmed' : b.status === 'Completed' ? 'completed' : 'pending'} size="sm">
                  {b.status}
                </Badge>
                <span style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>#{b.id}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#4B5563', marginBottom: '8px' }}>
                <User size={15} color="#7C3AED" />
                <span>Client: <strong>{b.customerName}</strong></span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '0.8rem', color: '#6B7280' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={13} color="#7C3AED" /> {b.date} at {b.startTime}
                </span>
                <span>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={13} color="#7C3AED" /> {b.duration} hours
                </span>
                <span>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={13} color="#7C3AED" /> {b.location?.mallName || 'Lakeside Fashion Mall'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
              <strong style={{ fontSize: '1.25rem', color: '#7C3AED' }}>₹{b.amount}</strong>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link to={`/designer/bookings/${b.id}/messages`} className="zorevi-btn zorevi-btn--primary zorevi-btn--sm">
                  <MessageSquare size={13} /> Chat with Client
                </Link>
                <Link to={`/customer/bookings/${b.id}`} className="zorevi-btn zorevi-btn--outline zorevi-btn--sm">
                  Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

