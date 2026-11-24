import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, UserRound, Images, Tags, CalendarDays, CalendarCheck2,
  Wallet, Star, Bell, Settings, LogOut, Shirt, ArrowRight, X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import './Sidebar.css';

export default function DesignerSidebar({ isOpen, onClose }) {
  const { logout } = useAuth();
  const { getUnreadCount, bookings } = useApp();
  const navigate = useNavigate();

  const pendingRequestsCount = (bookings || []).filter(
    (b) => b.status === 'Pending Confirmation' || b.status === 'Pending'
  ).length;

  const navItems = [
    { label: 'Dashboard', path: '/designer', icon: LayoutDashboard, end: true },
    { label: 'Booking Requests', path: '/designer/booking-requests', icon: CalendarCheck2, badge: pendingRequestsCount },
    { label: 'My Bookings', path: '/designer/bookings', icon: CalendarCheck2 },
    { label: 'Availability', path: '/designer/availability', icon: CalendarDays },
    { label: 'Services & Pricing', path: '/designer/services', icon: Tags },
    { label: 'Profile & Portfolio', path: '/designer/profile', icon: UserRound },
    { label: 'Earnings', path: '/designer/earnings', icon: Wallet },
    { label: 'Reviews', path: '/designer/reviews', icon: Star },
    { label: 'Notifications', path: '/designer/notifications', icon: Bell, badge: getUnreadCount('designer') },
    { label: 'Settings', path: '/designer/settings', icon: Settings },
  ];

  const finishNavigation = () => onClose?.();

  return (
    <>
      {isOpen && <div className="zorevi-sidebar-backdrop" onClick={onClose} />}
      <aside className={`zorevi-sidebar zorevi-designer-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="zorevi-designer-sidebar__top">
          <div className="zorevi-designer-sidebar__brand-row">
            <button className="zorevi-designer-sidebar__close" onClick={onClose} aria-label="Close navigation"><X size={19} /></button>
          </div>

          <nav className="zorevi-designer-sidebar__nav" aria-label="Designer navigation">
            {navItems.map(({ label, path, icon: Icon, end, badge }, index) => (
              <div className={index === 8 ? 'zorevi-designer-sidebar__utility' : ''} key={label}>
                <NavLink to={path} end={end} onClick={finishNavigation} className={({ isActive }) => `zorevi-sidebar__item ${isActive ? 'active' : ''}`}>
                  <Icon size={17} />
                  <span>{label}</span>
                  {badge > 0 && <span className="zorevi-sidebar__badge">{badge}</span>}
                </NavLink>
              </div>
            ))}
          </nav>

          <div className="zorevi-designer-sidebar__logout-wrap">
            <button className="zorevi-sidebar__item zorevi-designer-sidebar__logout" onClick={() => { logout(); finishNavigation(); navigate('/'); }}>
              <LogOut size={17} /><span>Logout</span>
            </button>
          </div>
        </div>

        <div className="zorevi-designer-sidebar__bottom">
          <div className="zorevi-sidebar__promo zorevi-designer-sidebar__promo">
            <div className="zorevi-designer-sidebar__promo-icon"><Shirt size={16} /></div>
            <h3>Grow your design studio</h3>
            <p>Add services and reach more fashion clients.</p>
            <NavLink to="/designer/services" className="zorevi-sidebar__promo-btn" onClick={finishNavigation}>Add a service <ArrowRight size={13} /></NavLink>
            <img src="/images/shopping-bags.png" alt="Fashion shopping bags" />
          </div>
        </div>
      </aside>
    </>
  );
}
