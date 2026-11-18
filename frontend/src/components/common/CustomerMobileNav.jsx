import { NavLink } from 'react-router-dom';
import { Home, Compass, Calendar, Heart, User } from 'lucide-react';
import './MobileNav.css';

export default function CustomerMobileNav() {
  return (
    <nav className="zorevi-mobile-nav">
      <NavLink
        to="/customer"
        end
        className={({ isActive }) => `zorevi-mobile-nav__item ${isActive ? 'active' : ''}`}
      >
        <Home size={20} />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/customer/designers"
        className={({ isActive }) => `zorevi-mobile-nav__item ${isActive ? 'active' : ''}`}
      >
        <Compass size={20} />
        <span>Explore</span>
      </NavLink>

      <NavLink
        to="/customer/bookings"
        className={({ isActive }) => `zorevi-mobile-nav__item ${isActive ? 'active' : ''}`}
      >
        <Calendar size={20} />
        <span>Bookings</span>
      </NavLink>

      <NavLink
        to="/customer/wishlist"
        className={({ isActive }) => `zorevi-mobile-nav__item ${isActive ? 'active' : ''}`}
      >
        <Heart size={20} />
        <span>Wishlist</span>
      </NavLink>

      <NavLink
        to="/customer/profile"
        className={({ isActive }) => `zorevi-mobile-nav__item ${isActive ? 'active' : ''}`}
      >
        <User size={20} />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
}

