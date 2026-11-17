import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Heart, Bell, ChevronDown, LogOut, User, Settings, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { CITIES } from '../../constants';
import './DashboardHeader.css';

export default function DashboardHeader({ onToggleSidebar, role = 'customer' }) {
  const { user, logout } = useAuth();
  const { getUnreadCount, selectedCity, setSelectedCity } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const cityRef = useRef(null);
  const userRef = useRef(null);
  const navigate = useNavigate();

  const unreadCount = getUnreadCount(role);

  useEffect(() => {
    function handleClickOutside(e) {
      if (cityRef.current && !cityRef.current.contains(e.target)) setShowCityDropdown(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUserDropdown(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (role === 'customer') {
        navigate(`/customer/designers?search=${encodeURIComponent(searchQuery)}`);
      } else if (role === 'designer') {
        navigate(`/designer/bookings?search=${encodeURIComponent(searchQuery)}`);
      } else {
        navigate(`/admin/customers?search=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  return (
    <header className="zorevi-dash-header">
      <div className="zorevi-dash-header__left">
        <button
          className="zorevi-dash-header__toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>

        <Link to={`/${role}`} className="zorevi-dash-header__brand">
          <div className="zorevi-dash-header__logo-icon">
            {role === 'designer' ? <img src="/zorevi-butterfly-hd.svg" alt="" /> : (
              <svg viewBox="0 0 32 32" fill="none" width="28" height="28">
                <path d="M16 4C12 4 8 8 8 12c0 4 4 8 8 12 4-4 8-8 8-12 0-4-4-8-8-8z" fill="url(#dash-logo-g)"/>
                <path d="M8 12c-4 0-6 2-6 4s2 4 6 4c2 0 4-2 6-4-2-2-4-4-6-4z" fill="url(#dash-logo-g)" opacity="0.8"/>
                <path d="M24 12c4 0 6 2 6 4s-2 4-6 4c-2 0-4-2-6-4 2-2 4-4 6-4z" fill="url(#dash-logo-g)" opacity="0.8"/>
                <defs>
                  <linearGradient id="dash-logo-g" x1="0" y1="0" x2="32" y2="32">
                    <stop stopColor="#7C3AED"/>
                    <stop offset="1" stopColor="#A855F7"/>
                  </linearGradient>
                </defs>
              </svg>
            )}
          </div>
          <div className="zorevi-dash-header__brand-text">
            <span className="zorevi-dash-header__title">Zorevi</span>
            <span className="zorevi-dash-header__subtitle">
              {role === 'designer' ? 'Designer Studio' : role === 'admin' ? 'Admin Console' : 'Fashion for Everyone'}
            </span>
          </div>
        </Link>
      </div>

      <div className="zorevi-dash-header__center">
        <div className="zorevi-dash-header__city" ref={cityRef}>
          <button
            className="zorevi-dash-header__city-btn"
            onClick={() => setShowCityDropdown(!showCityDropdown)}
          >
            <MapPin size={15} className="zorevi-dash-header__pin" />
            <span>{selectedCity}</span>
            <ChevronDown size={13} />
          </button>
          {showCityDropdown && (
            <div className="zorevi-dash-header__city-dropdown">
              {CITIES.map((city) => (
                <button
                  key={city}
                  className={`zorevi-dash-header__city-item ${city === selectedCity ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedCity(city);
                    setShowCityDropdown(false);
                  }}
                >
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>

        <form className="zorevi-dash-header__search" onSubmit={handleSearch}>
          <Search size={17} className="zorevi-dash-header__search-icon" />
          <input
            type="text"
            placeholder={
              role === 'designer'
                ? 'Search bookings, services or customers...'
                : role === 'admin'
                ? 'Search customers, designers, bookings...'
                : 'Search designers, malls, services or occasions...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      <div className="zorevi-dash-header__right">
        {role === 'customer' && (
          <Link
            to="/customer/wishlist"
            className="zorevi-dash-header__icon-btn"
            title="Wishlist"
            aria-label="Wishlist"
          >
            <Heart size={20} />
          </Link>
        )}

        <Link
          to={`/${role}/notifications`}
          className="zorevi-dash-header__icon-btn zorevi-dash-header__notif-btn"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell size={20} />
          {unreadCount > 0 && <span className="zorevi-dash-header__badge">{unreadCount}</span>}
        </Link>

        {role === 'designer' && (
          <div className="zorevi-dash-header__status-indicator">
            <span className="zorevi-dash-header__status-dot"></span>
            <span className="zorevi-dash-header__status-text">Online</span>
          </div>
        )}

        <div className="zorevi-dash-header__user" ref={userRef}>
          <button
            className="zorevi-dash-header__user-trigger"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={user?.name || 'User'}
              className="zorevi-dash-header__avatar"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Z')}&background=7C3AED&color=fff`;
              }}
            />
            <div className="zorevi-dash-header__user-label">
              <span className="zorevi-dash-header__user-name">
                {role === 'customer'
                  ? `Hi, ${user?.name ? user.name.split(' ')[0] : 'Praveen'}`
                  : user?.name || (role === 'designer' ? 'Aarohi Mehta' : 'Priya Sharma')}
              </span>
            </div>
            <ChevronDown size={14} className="zorevi-dash-header__user-chevron" />
          </button>

          {showUserDropdown && (
            <div className="zorevi-dash-header__user-dropdown">
              <div className="zorevi-dash-header__user-meta">
                <strong>{user?.name || (role === 'designer' ? 'Aarohi Mehta' : role === 'admin' ? 'Priya Sharma' : 'Praveen Kumar')}</strong>
                <small>{user?.email || (role === 'designer' ? 'aarohi@zorevi.in' : role === 'admin' ? 'admin@zorevi.in' : 'praveen.kumar@email.com')}</small>
              </div>
              <Link
                to={`/${role}/profile`}
                className="zorevi-dash-header__dropdown-link"
                onClick={() => setShowUserDropdown(false)}
              >
                <User size={16} /> My Profile
              </Link>
              <Link
                to={`/${role}/settings`}
                className="zorevi-dash-header__dropdown-link"
                onClick={() => setShowUserDropdown(false)}
              >
                <Settings size={16} /> Settings
              </Link>
              <button
                className="zorevi-dash-header__dropdown-link zorevi-dash-header__dropdown-link--danger"
                onClick={() => {
                  logout();
                  setShowUserDropdown(false);
                  navigate('/');
                }}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

