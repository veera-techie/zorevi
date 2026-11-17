import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, User, Image, Sparkles, Award, Scissors, DollarSign,
  CalendarDays, Inbox, Calendar, CreditCard, Star, Bell, Settings,
  LogOut, PlusCircle, ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import './Sidebar.css';

export default function DesignerSidebar({ isOpen, onClose }) {
  const { logout } = useAuth();
  const { getUnreadCount } = useApp();
  const navigate = useNavigate();
  const unreadCount = getUnreadCount('designer');

  const navItems = [
    { label: 'Dashboard', path: '/designer', icon: LayoutDashboard, end: true },
    { label: 'My Profile', path: '/designer/profile', icon: User },
    { label: 'My Portfolio', path: '/designer/portfolio', icon: Image },
    { label: 'My Skills', path: '/designer/skills', icon: Sparkles },
    { label: 'Experience & Certifications', path: '/designer/experience', icon: Award },
    { label: 'Manage Services', path: '/designer/services', icon: Scissors },
    { label: 'Pricing Management', path: '/designer/pricing', icon: DollarSign },
    { label: 'Availability Calendar', path: '/designer/availability', icon: CalendarDays },
    { label: 'Booking Requests', path: '/designer/booking-requests', icon: Inbox, badge: 3 },
    { label: 'My Bookings', path: '/designer/bookings', icon: Calendar },
    { label: 'Earnings & Payments', path: '/designer/earnings', icon: CreditCard },
    { label: 'Customer Reviews', path: '/designer/reviews', icon: Star },
    { label: 'Notifications', path: '/designer/notifications', icon: Bell, badge: unreadCount },
    { label: 'Settings', path: '/designer/settings', icon: Settings },
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
            <PlusCircle size={16} />
          </div>
          <div className="zorevi-sidebar__promo-title">Grow Your Design Studio</div>
          <NavLink to="/designer/services" className="zorevi-sidebar__promo-btn" onClick={onClose}>
            Add a Service <ArrowRight size={12} />
          </NavLink>
        </div>
      </aside>
    </>
  );
}

