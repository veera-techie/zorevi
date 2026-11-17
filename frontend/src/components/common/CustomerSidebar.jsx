import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home, Compass, Users, Building2, Grid, Calendar, Heart,
  Star, Bell, User, Settings, HelpCircle, LogOut, ArrowRight, Sparkles, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import './Sidebar.css';

export default function CustomerSidebar({ isOpen, onClose }) {
  const { logout } = useAuth();
  const { getUnreadCount } = useApp();
  const navigate = useNavigate();
  const unreadCount = getUnreadCount('customer');

  const navItems = [
    { label: 'Home', path: '/customer', icon: Home, end: true },
    { label: 'Explore', path: '/customer/designers', icon: Compass },
    { label: 'Nearby Designers', path: '/customer/designers', icon: Users },
    { label: 'Nearby Malls', path: '/customer/malls', icon: Building2 },
    { label: 'Fashion Categories', path: '/categories', icon: Grid },
    { label: 'My Bookings', path: '/customer/bookings', icon: Calendar },
    { label: 'My Wishlist', path: '/customer/wishlist', icon: Heart },
    { label: 'My Reviews', path: '/customer/reviews', icon: Star },
    { label: 'Notifications', path: '/customer/notifications', icon: Bell, badge: unreadCount },
    { label: 'My Profile', path: '/customer/profile', icon: User },
    { label: 'Settings', path: '/customer/settings', icon: Settings },
    { label: 'Help & Support', path: '/customer/support', icon: HelpCircle },
  ];

  return (
    <>
      {isOpen && <div className="zorevi-sidebar-backdrop" onClick={onClose}></div>}
      <aside className={`zorevi-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="zorevi-sidebar__nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `zorevi-sidebar__item ${isActive ? 'active' : ''}`
                }
                onClick={onClose}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {item.badge > 0 && (
                  <span className="zorevi-sidebar__badge">{item.badge}</span>
                )}
              </NavLink>
            );
          })}

          <div className="zorevi-sidebar__divider"></div>

          <button
            className="zorevi-sidebar__item"
            onClick={() => {
              logout();
              if (onClose) onClose();
              navigate('/');
            }}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>

        <div className="zorevi-sidebar__promo">
          <div className="zorevi-sidebar__promo-icon">
            <Sparkles size={16} />
          </div>
          <div className="zorevi-sidebar__promo-title">Style your way with Zorevi</div>
          <NavLink to="/customer/designers" className="zorevi-sidebar__promo-btn" onClick={onClose}>
            Explore styles <ArrowRight size={12} />
          </NavLink>
        </div>
      </aside>
    </>
  );
}

