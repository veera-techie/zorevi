import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, UserCheck, ShieldCheck, Calendar, DollarSign,
  TrendingUp, Download, CheckCircle2, AlertCircle, ArrowRight
} from 'lucide-react';
import { mockAdminStats, mockBookings, mockDesignerApplications } from '../../../services/mockData';
import { useApp } from '../../../context/AppContext';
import './AdminStyles.css';

export default function AdminDashboard() {
  const { addToast } = useApp();

  return (
    <div className="zorevi-admin-dash">
      {/* Header */}
      <div className="zorevi-admin-dash__header">
        <div>
          <h1 className="zorevi-admin-dash__title">Good morning, Admin</h1>
          <p className="zorevi-admin-dash__sub">Here's your live marketplace overview across India.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="zorevi-btn zorevi-btn--outline zorevi-btn--sm" onClick={() => addToast('Exporting platform report', 'info')}>
            <Download size={14} /> Export Report
          </button>
          <Link to="/admin/verification" className="zorevi-btn zorevi-btn--primary zorevi-btn--sm">
            Review Applications ({mockAdminStats.totalApprovals})
          </Link>
        </div>
      </div>

      {/* 6 Key Stats Cards */}
      <div className="zorevi-admin-stats-grid">
        <div className="zorevi-admin-stat-card">
          <span className="zorevi-admin-stat-label">Registered Customers</span>
          <div className="zorevi-admin-stat-val">24,680</div>
          <span className="zorevi-admin-stat-sub">↑ +12.4% this month</span>
        </div>

        <div className="zorevi-admin-stat-card">
          <span className="zorevi-admin-stat-label">Total Designers</span>
          <div className="zorevi-admin-stat-val">1,248</div>
          <span className="zorevi-admin-stat-sub">↑ +8.6% verified</span>
        </div>

        <div className="zorevi-admin-stat-card" style={{ background: '#FAF5FF', borderColor: '#DDD6FE' }}>
          <span className="zorevi-admin-stat-label" style={{ color: '#7C3AED' }}>Pending Approvals</span>
          <div className="zorevi-admin-stat-val" style={{ color: '#7C3AED' }}>12</div>
          <span style={{ fontSize: '0.7rem', color: '#7C3AED', fontWeight: '600' }}>In verification queue</span>
        </div>

        <div className="zorevi-admin-stat-card">
          <span className="zorevi-admin-stat-label">Total Bookings</span>
          <div className="zorevi-admin-stat-val">8,942</div>
          <span className="zorevi-admin-stat-sub">↑ +16.2% volume</span>
        </div>

        <div className="zorevi-admin-stat-card">
          <span className="zorevi-admin-stat-label">Platform GMV</span>
          <div className="zorevi-admin-stat-val">₹18.6L</div>
          <span className="zorevi-admin-stat-sub">↑ +14.8% growth</span>
        </div>

        <div className="zorevi-admin-stat-card">
          <span className="zorevi-admin-stat-label">Pending Payouts</span>
          <div className="zorevi-admin-stat-val">₹2.4L</div>
          <span style={{ fontSize: '0.7rem', color: '#6B7280' }}>8 designer batches</span>
        </div>
      </div>

      {/* Charts Grid: Performance Line Chart & Booking Breakdown Donut */}
      <div className="zorevi-admin-charts-grid">
        {/* Marketplace Performance Curve */}
        <div className="zorevi-admin-card">
          <div className="zorevi-admin-card__title">
            <span>Marketplace Growth & Bookings</span>
            <span style={{ fontSize: '0.75rem', color: '#7C3AED', fontWeight: '600' }}>Last 6 Months</span>
          </div>

          <div style={{ height: '180px', width: '100%', position: 'relative' }}>
            <svg viewBox="0 0 500 160" style={{ width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id="book-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 10 130 Q 100 110, 180 80 T 350 45 T 490 20 L 490 160 L 10 160 Z"
                fill="url(#book-grad)"
              />
              <path
                d="M 10 130 Q 100 110, 180 80 T 350 45 T 490 20"
                fill="none"
                stroke="#7C3AED"
                strokeWidth="3"
              />
              <path
                d="M 10 145 Q 100 135, 180 115 T 350 85 T 490 60"
                fill="none"
                stroke="#EC4899"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#9CA3AF', marginTop: '4px' }}>
              <span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', marginTop: '16px', fontSize: '0.75rem', color: '#4B5563' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#7C3AED' }}></span> Customer Bookings
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EC4899' }}></span> Stylist Registrations
            </span>
          </div>
        </div>

        {/* Booking Status Breakdown */}
        <div className="zorevi-admin-card">
          <div className="zorevi-admin-card__title">
            <span>Booking Status</span>
            <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>8,942 Total</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span style={{ color: '#059669', fontWeight: '600' }}>Completed Sessions</span>
                <strong>68% (6,080)</strong>
              </div>
              <div style={{ height: '6px', background: '#F3F4F6', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: '68%', height: '100%', background: '#10B981' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span style={{ color: '#7C3AED', fontWeight: '600' }}>Upcoming Confirmed</span>
                <strong>18% (1,610)</strong>
              </div>
              <div style={{ height: '6px', background: '#F3F4F6', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: '18%', height: '100%', background: '#7C3AED' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span style={{ color: '#EF4444', fontWeight: '600' }}>Cancelled & Refunded</span>
                <strong>8% (715)</strong>
              </div>
              <div style={{ height: '6px', background: '#F3F4F6', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: '8%', height: '100%', background: '#EF4444' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span style={{ color: '#3B82F6', fontWeight: '600' }}>In Progress / Trial</span>
                <strong>6% (537)</strong>
              </div>
              <div style={{ height: '6px', background: '#F3F4F6', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: '6%', height: '100%', background: '#3B82F6' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Categories Strip matching screenshot */}
      <div className="zorevi-admin-card" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1E1B4B', marginBottom: '14px' }}>
          Popular Styling Categories
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {[
            { name: 'Bridal & Groom', share: '28%' },
            { name: 'Personal Styling', share: '24%' },
            { name: "Men's Styling", share: '19%' },
            { name: 'Family Styling', share: '16%' },
            { name: "Women's Occasion", share: '13%' },
          ].map((cat) => (
            <div key={cat.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: '#FAF5FF', border: '1px solid #DDD6FE', borderRadius: '14px', fontSize: '0.85rem' }}>
              <strong>{cat.name}</strong>
              <span style={{ color: '#7C3AED', fontWeight: '700' }}>{cat.share}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Table Previews: Verification Queue & Recent Bookings */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Verification Queue Preview */}
        <div className="zorevi-admin-card">
          <div className="zorevi-admin-card__title">
            <span>Designer Verification Queue</span>
            <Link to="/admin/verification" style={{ fontSize: '0.8rem', color: '#7C3AED', fontWeight: '600', textDecoration: 'none' }}>
              View all (12) →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {mockDesignerApplications.map((app) => (
              <div key={app.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#F9FAFB', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={app.avatar} alt={app.name} style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: '#1E1B4B' }}>{app.name}</strong>
                    <div style={{ fontSize: '0.72rem', color: '#6B7280' }}>{app.specializations[0]} • {app.location}</div>
                  </div>
                </div>

                <Link to="/admin/verification" className="zorevi-btn zorevi-btn--outline zorevi-btn--sm">
                  Review
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings Preview */}
        <div className="zorevi-admin-card">
          <div className="zorevi-admin-card__title">
            <span>Recent Bookings</span>
            <Link to="/admin/bookings" style={{ fontSize: '0.8rem', color: '#7C3AED', fontWeight: '600', textDecoration: 'none' }}>
              View all →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {mockBookings.slice(0, 3).map((b) => (
              <div key={b.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#F9FAFB', borderRadius: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <strong style={{ fontSize: '0.85rem', color: '#1E1B4B' }}>#{b.id}</strong>
                    <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>• {b.customerName}</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#7C3AED' }}>{b.service} with {b.designerName}</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <strong style={{ fontSize: '0.85rem', color: '#1E1B4B' }}>₹{b.amount}</strong>
                  <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: '600' }}>{b.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Health Strip matching screenshot */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', background: '#FFFFFF', padding: '18px 24px', borderRadius: '20px', border: '1px solid #F3F4F6' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem' }}>
          <CheckCircle2 size={18} color="#10B981" />
          <span>Payment Gateway: <strong>Razorpay (Connected)</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem' }}>
          <DollarSign size={18} color="#7C3AED" />
          <span>Platform Commission: <strong>12% Default</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem' }}>
          <Calendar size={18} color="#7C3AED" />
          <span>Starting Package: <strong>₹499 / 2 hours</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem' }}>
          <AlertCircle size={18} color="#F59E0B" />
          <span>Open Support Tickets: <strong>24 Pending</strong></span>
        </div>
      </div>
    </div>
  );
}

