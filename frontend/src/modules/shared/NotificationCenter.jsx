import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell, CheckCheck, Calendar, CreditCard, MessageCircle, Star,
  AlertCircle, ChevronRight, CheckCircle2, User, Heart, Settings
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import './NotificationCenter.css';

export default function NotificationCenter({ role = 'customer' }) {
  const {
    customerNotifications,
    designerNotifications,
    adminNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    addToast,
  } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState('all');

  const notifications = role === 'customer'
    ? customerNotifications
    : role === 'designer'
    ? designerNotifications
    : adminNotifications;

  const filteredNotifications = notifications.filter((notif) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !notif.read;
    return notif.type === activeFilter;
  });

  const unreadList = filteredNotifications.filter((n) => !n.read);
  const earlierList = filteredNotifications.filter((n) => n.read);

  const getIcon = (type) => {
    switch (type) {
      case 'booking': return <Calendar size={18} color="#7C3AED" />;
      case 'payment': return <CreditCard size={18} color="#10B981" />;
      case 'message': return <MessageCircle size={18} color="#3B82F6" />;
      case 'review': return <Star size={18} color="#F59E0B" />;
      default: return <Bell size={18} color="#7C3AED" />;
    }
  };

  const handleNotificationClick = (notif) => {
    markNotificationRead(role, notif.id);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const handleMarkAll = () => {
    markAllNotificationsRead(role);
    addToast('All notifications marked as read', 'info');
  };

  return (
    <div className="zorevi-notifs-page">
      <div className="zorevi-notifs-grid">
        {/* Left Column: Notifications Feed */}
        <div className="zorevi-notifs-feed">
          <div className="zorevi-notifs-feed__header">
            <div>
              <h2 className="zorevi-notifs-feed__title">Notifications</h2>
              <p className="zorevi-notifs-feed__subtitle">
                Stay updated on your bookings, payments, and messages.
              </p>
            </div>
            <button className="zorevi-notifs-mark-btn" onClick={handleMarkAll}>
              <CheckCheck size={16} /> Mark all as read
            </button>
          </div>

          {/* Filter Pills */}
          <div className="zorevi-notifs-filters">
            {['all', 'unread', 'booking', 'payment', 'message'].map((f) => (
              <button
                key={f}
                className={`zorevi-notifs-filter-pill ${activeFilter === f ? 'active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Unread Section */}
          {unreadList.length > 0 && (
            <div className="zorevi-notifs-section">
              <h4 className="zorevi-notifs-section__title">
                Unread ({unreadList.length})
              </h4>
              <div className="zorevi-notifs-list">
                {unreadList.map((notif) => (
                  <div
                    key={notif.id}
                    className="zorevi-notif-item zorevi-notif-item--unread"
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <div className="zorevi-notif-item__icon-wrap">
                      {getIcon(notif.type)}
                    </div>
                    <div className="zorevi-notif-item__content">
                      <div className="zorevi-notif-item__title-row">
                        <strong>{notif.title}</strong>
                        <span className="zorevi-notif-item__dot"></span>
                      </div>
                      <p>{notif.message}</p>
                      <small>{new Date(notif.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</small>
                    </div>
                    <ChevronRight size={16} className="zorevi-notif-item__arrow" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Earlier Section */}
          <div className="zorevi-notifs-section" style={{ marginTop: '24px' }}>
            <h4 className="zorevi-notifs-section__title">Earlier</h4>
            {earlierList.length > 0 ? (
              <div className="zorevi-notifs-list">
                {earlierList.map((notif) => (
                  <div
                    key={notif.id}
                    className="zorevi-notif-item"
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <div className="zorevi-notif-item__icon-wrap">
                      {getIcon(notif.type)}
                    </div>
                    <div className="zorevi-notif-item__content">
                      <div className="zorevi-notif-item__title-row">
                        <strong>{notif.title}</strong>
                      </div>
                      <p>{notif.message}</p>
                      <small>{new Date(notif.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</small>
                    </div>
                    <ChevronRight size={16} className="zorevi-notif-item__arrow" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="zorevi-notifs-empty">
                <Bell size={28} color="#9CA3AF" />
                <p>No earlier notifications found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Account Snapshot for Customer/Designer */}
        {role === 'customer' && (
          <div className="zorevi-notifs-account-card">
            <h3 className="zorevi-notifs-account-card__title">My Account</h3>

            <div className="zorevi-notifs-account-user">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={user?.name || 'Customer'}
                className="zorevi-notifs-account-avatar"
              />
              <div>
                <strong>{user?.name || 'Praveen Kumar'}</strong>
                <span>{user?.email || 'praveen.kumar@email.com'}</span>
                <small>{user?.phone || '+91 98765 43210'}</small>
              </div>
              <Link to="/customer/profile" className="zorevi-btn zorevi-btn--outline zorevi-btn--sm" style={{ marginLeft: 'auto' }}>
                Edit Profile
              </Link>
            </div>

            <h4 className="zorevi-notifs-account-subtitle">Quick Actions</h4>
            <div className="zorevi-notifs-quick-stats">
              <Link to="/customer/bookings" className="zorevi-notifs-stat-box">
                <Calendar size={18} color="#7C3AED" />
                <strong>6</strong>
                <span>My Bookings</span>
              </Link>
              <Link to="/customer/wishlist" className="zorevi-notifs-stat-box">
                <Heart size={18} color="#EC4899" />
                <strong>18</strong>
                <span>My Wishlist</span>
              </Link>
              <Link to="/customer/reviews" className="zorevi-notifs-stat-box">
                <Star size={18} color="#F59E0B" />
                <strong>4</strong>
                <span>My Reviews</span>
              </Link>
            </div>

            <h4 className="zorevi-notifs-account-subtitle" style={{ marginTop: '20px' }}>
              Account & Preferences
            </h4>
            <div className="zorevi-notifs-pref-links">
              <Link to="/customer/profile" className="zorevi-notifs-pref-item">
                <User size={16} />
                <span>Profile Details</span>
                <ChevronRight size={14} />
              </Link>
              <Link to="/customer/profile" className="zorevi-notifs-pref-item">
                <CheckCircle2 size={16} />
                <span>Styling Preferences (Occasions, styles, sizes)</span>
                <ChevronRight size={14} />
              </Link>
              <Link to="/customer/settings" className="zorevi-notifs-pref-item">
                <Bell size={16} />
                <span>Notification Preferences (In-app, email, SMS)</span>
                <ChevronRight size={14} />
              </Link>
              <Link to="/customer/settings" className="zorevi-notifs-pref-item">
                <Settings size={16} />
                <span>Privacy & Security</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

