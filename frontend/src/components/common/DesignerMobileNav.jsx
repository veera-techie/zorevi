import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, CreditCard, MessageSquare, User } from 'lucide-react';
import './MobileNav.css';

export default function DesignerMobileNav() {
  return (
    <nav className="zorevi-mobile-nav">
      <NavLink
        to="/designer"
        end
        className={({ isActive }) => `zorevi-mobile-nav__item ${isActive ? 'active' : ''}`}
      >
        <LayoutDashboard size={20} />
        <span>Dashboard</span>
      </NavLink>

      <NavLink
        to="/designer/bookings"
        className={({ isActive }) => `zorevi-mobile-nav__item ${isActive ? 'active' : ''}`}
      >
        <Calendar size={20} />
        <span>Bookings</span>
      </NavLink>

      <NavLink
        to="/designer/earnings"
        className={({ isActive }) => `zorevi-mobile-nav__item ${isActive ? 'active' : ''}`}
      >
        <CreditCard size={20} />
        <span>Earnings</span>
      </NavLink>

      <NavLink
        to="/designer/messages"
        className={({ isActive }) => `zorevi-mobile-nav__item ${isActive ? 'active' : ''}`}
      >
        <MessageSquare size={20} />
        <span>Messages</span>
        <span className="zorevi-mobile-nav__badge">2</span>
      </NavLink>

      <NavLink
        to="/designer/profile"
        className={({ isActive }) => `zorevi-mobile-nav__item ${isActive ? 'active' : ''}`}
      >
        <User size={20} />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
}

