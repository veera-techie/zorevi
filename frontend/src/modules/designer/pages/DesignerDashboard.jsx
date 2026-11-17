import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, CheckCircle2, DollarSign, Star, Eye, TrendingUp,
  ArrowRight, Clock, PlusCircle, Check, X, ChevronRight, Sparkles
} from 'lucide-react';
import { mockDesigners, mockBookings } from '../../../services/mockData';
import ImageWithFallback from '../../../components/common/ImageWithFallback';
import { useApp } from '../../../context/AppContext';
import './DesignerPages.css';

export default function DesignerDashboard() {
  const designer = mockDesigners[0]; // Aarohi Mehta
  const { addToast } = useApp();

  const [requests, setRequests] = useState([
    { id: 'req-1', customer: 'Priya Nair', service: 'Bridal Styling', date: '25 Nov', time: '10:00 AM', amount: 4500, avatar: '/images/customer-neha.jpg' },
    { id: 'req-2', customer: 'Aditya Rao', service: 'Wardrobe Consultation', date: '23 Nov', time: '02:00 PM', amount: 1200, avatar: '/images/customer-karan.jpg' },
    { id: 'req-3', customer: 'The Mehta Family', service: 'Family Styling', date: '24 Nov', time: '11:00 AM', amount: 3800, avatar: '/images/customer-pooja.jpg' },
  ]);

  const handleAccept = (req) => {
    setRequests(requests.filter((r) => r.id !== req.id));
    addToast(`Accepted booking request from ${req.customer}`, 'success');
  };

  const handleDecline = (req) => {
    setRequests(requests.filter((r) => r.id !== req.id));
    addToast(`Declined booking request from ${req.customer}`, 'info');
  };

  return (
    <div className="zorevi-designer-dash">
      {/* Title */}
      <div className="zorevi-designer-dash__header">
        <div>
          <h1 className="zorevi-designer-dash__title">Welcome Back, Designer!</h1>
          <p className="zorevi-designer-dash__subtitle">Your creative studio and bookings at a glance.</p>
        </div>
        <Link to="/designer/services" className="zorevi-btn zorevi-btn--primary">
          <PlusCircle size={16} /> Add a Service
        </Link>
      </div>

      {/* Top 6 Stats Cards matching screenshot */}
      <div className="zorevi-designer-stats-grid">
        <div className="zorevi-des-stat-card">
          <div className="zorevi-des-stat-header">
            <span>Total Bookings</span>
            <Calendar size={18} color="#7C3AED" />
          </div>
          <div className="zorevi-des-stat-val">128</div>
          <span className="zorevi-des-stat-trend positive">↑ +12.8%</span>
        </div>

        <div className="zorevi-des-stat-card">
          <div className="zorevi-des-stat-header">
            <span>Upcoming Bookings</span>
            <Clock size={18} color="#7C3AED" />
          </div>
          <div className="zorevi-des-stat-val">08</div>
          <span className="zorevi-des-stat-trend neutral">4 this week</span>
        </div>

        <div className="zorevi-des-stat-card">
          <div className="zorevi-des-stat-header">
            <span>Completed Bookings</span>
            <CheckCircle2 size={18} color="#10B981" />
          </div>
          <div className="zorevi-des-stat-val">112</div>
          <span className="zorevi-des-stat-trend positive">↑ +8.2%</span>
        </div>

        <div className="zorevi-des-stat-card">
          <div className="zorevi-des-stat-header">
            <span>Total Earnings</span>
            <DollarSign size={18} color="#7C3AED" />
          </div>
          <div className="zorevi-des-stat-val">₹84,650</div>
          <span className="zorevi-des-stat-trend positive">↑ +18.4%</span>
        </div>

        <div className="zorevi-des-stat-card">
          <div className="zorevi-des-stat-header">
            <span>Average Rating</span>
            <Star size={18} fill="#F59E0B" color="#F59E0B" />
          </div>
          <div className="zorevi-des-stat-val">4.9 / 5</div>
          <span className="zorevi-des-stat-trend neutral">★ ★ ★ ★ ★</span>
        </div>

        <div className="zorevi-des-stat-card">
          <div className="zorevi-des-stat-header">
            <span>Profile Views</span>
            <Eye size={18} color="#3B82F6" />
          </div>
          <div className="zorevi-des-stat-val">2,340</div>
          <span className="zorevi-des-stat-trend positive">↑ +24.6%</span>
        </div>
      </div>

      {/* Middle Grid: Profile card on Left, Earnings chart in Center, Promo Right */}
      <div className="zorevi-designer-mid-grid">
        {/* Profile Card */}
        <div className="zorevi-card">
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '14px' }}>
            <img src={designer.avatar} alt={designer.name} className="zorevi-des-avatar-md" />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <strong style={{ fontSize: '1.05rem', color: '#1E1B4B' }}>{designer.name}</strong>
                <CheckCircle2 size={16} color="#10B981" />
              </div>
              <span style={{ fontSize: '0.78rem', color: '#6B7280', display: 'block' }}>{designer.title}</span>
              <small style={{ fontSize: '0.72rem', color: '#7C3AED' }}>Hyderabad • {designer.serviceRadius} radius</small>
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '600', marginBottom: '4px' }}>
              <span>Profile Completion</span>
              <span style={{ color: '#7C3AED' }}>85%</span>
            </div>
            <div style={{ height: '6px', background: '#F3F4F6', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{ width: '85%', height: '100%', background: 'linear-gradient(90deg, #7C3AED, #A855F7)' }} />
            </div>
          </div>

          <ul style={{ fontSize: '0.75rem', color: '#4B5563', lineHeight: '1.6', listStyle: 'none', padding: 0, marginBottom: '16px' }}>
            <li>✓ Basic Details (Verified)</li>
            <li>✓ Credentials & NIFT Diploma</li>
            <li>✓ Services & Pricing Configured</li>
            <li>✓ Portfolio (12 Projects)</li>
          </ul>

          <Link to="/designer/profile" className="zorevi-btn zorevi-btn--outline zorevi-btn--sm zorevi-btn--full">
            Edit Profile
          </Link>
        </div>

        {/* Monthly Earnings Chart Card */}
        <div className="zorevi-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Monthly Earnings</span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1E1B4B', margin: '2px 0 0' }}>
                ₹84,650 <span style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: '600' }}>↑ +18.4%</span>
              </h3>
            </div>
            <div className="zorevi-designer-status-badge">
              <span className="dot"></span> Online / Accepting Bookings
            </div>
          </div>

          {/* Simulated SVG Graph */}
          <div style={{ height: '130px', width: '100%', position: 'relative', marginTop: '10px' }}>
            <svg viewBox="0 0 400 120" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <defs>
                <linearGradient id="earn-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 10 90 Q 70 80, 130 65 T 250 40 T 390 15 L 390 120 L 10 120 Z"
                fill="url(#earn-grad)"
              />
              <path
                d="M 10 90 Q 70 80, 130 65 T 250 40 T 390 15"
                fill="none"
                stroke="#7C3AED"
                strokeWidth="3"
              />
              <circle cx="390" cy="15" r="5" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="2" />
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#9CA3AF', marginTop: '8px' }}>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
            </div>
          </div>
        </div>

        {/* Promo Starting at 499 Card */}
        <div className="zorevi-card" style={{ background: 'linear-gradient(135deg, #FAF5FF 0%, #EDE9FE 100%)', border: '1px solid #E9D5FF' }}>
          <span style={{ fontSize: '0.72rem', color: '#7C3AED', fontWeight: '700', textTransform: 'uppercase' }}>
            ZOREVI STANDARD PACKAGE
          </span>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1E1B4B', margin: '4px 0 8px' }}>
            Starting at Just ₹499
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#4B5563', lineHeight: '1.4', marginBottom: '14px' }}>
            Attract more new clients with our entry 2-hour discovery styling package, then upsell bridal and custom services.
          </p>
          <Link to="/designer/pricing" className="zorevi-btn zorevi-btn--primary zorevi-btn--sm zorevi-btn--full">
            Manage Package Rates
          </Link>
        </div>
      </div>

      {/* Booking Requests & Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', marginTop: '24px' }}>
        {/* Recent Booking Activity */}
        <div className="zorevi-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 className="zorevi-card-title" style={{ margin: 0 }}>Recent Booking Activity</h3>
            <Link to="/designer/bookings" style={{ fontSize: '0.8rem', color: '#7C3AED', fontWeight: '600', textDecoration: 'none' }}>
              View all →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {mockBookings.slice(0, 4).map((b) => (
              <div key={b.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: '12px', background: '#F9FAFB', border: '1px solid #F3F4F6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={b.customerAvatar} alt={b.customerName} style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <strong style={{ fontSize: '0.88rem', color: '#1E1B4B' }}>{b.customerName}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{b.service} • {b.date}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong style={{ fontSize: '0.9rem', color: '#7C3AED' }}>₹{b.amount}</strong>
                  <div style={{ fontSize: '0.7rem', color: b.status === 'Confirmed' ? '#059669' : '#B45309', fontWeight: '600' }}>{b.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Booking Requests */}
        <div className="zorevi-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 className="zorevi-card-title" style={{ margin: 0 }}>Pending Requests ({requests.length})</h3>
            <Link to="/designer/booking-requests" style={{ fontSize: '0.8rem', color: '#7C3AED', fontWeight: '600', textDecoration: 'none' }}>
              View all →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {requests.map((req) => (
              <div key={req.id} style={{ padding: '14px', borderRadius: '14px', background: '#FAFAFC', border: '1px solid #E5E7EB' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: '#1E1B4B' }}>{req.customer}</strong>
                    <div style={{ fontSize: '0.78rem', color: '#6B7280' }}>{req.service} • {req.date} at {req.time}</div>
                  </div>
                  <strong style={{ fontSize: '0.95rem', color: '#7C3AED' }}>₹{req.amount}</strong>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <button className="zorevi-btn zorevi-btn--primary zorevi-btn--sm" style={{ flex: 1 }} onClick={() => handleAccept(req)}>
                    Accept
                  </button>
                  <button className="zorevi-btn zorevi-btn--outline zorevi-btn--sm" style={{ flex: 1 }} onClick={() => handleDecline(req)}>
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

