import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, MapPin, Heart, Bell, ChevronDown, LogOut, User, Settings, Menu, Home, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import HeaderLocationSelector from './HeaderLocationSelector';
import { CITIES } from '../../constants';
import { AAROHI_PROFILE_IMAGE } from '../../utils/aarohiProfileImage';
import './DashboardHeader.css';

export default function DashboardHeader({ onToggleSidebar, profileDrawerOpen = false, role = 'customer' }) {
  const { user, logout } = useAuth();
  const { getUnreadCount, selectedCity, setSelectedCity } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const cityRef = useRef(null);
  const userRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const unreadCount = getUnreadCount(role);
  const localAvatarFallback = role === 'designer'
    ? AAROHI_PROFILE_IMAGE
    : role === 'admin'
      ? '/images/admin-priya.png'
      : '/images/customer-praveen.png';

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
    const query = searchQuery.trim();
    if (!query) return;

    if (role === 'customer') {
      const lower = query.toLowerCase();
      const isFashionHubSearch = [
        'mall', 'hub', 'boutique', 'store', 'shop', 'outlet',
        'ethnic', 'bridal', 'saree', 'footwear', 'fashion', 'zara',
        'h&m', 'sarath', 'inorbit', 'nexus', 'forum', 'manyavar',
        'fabindia', 'neeru', 'mugadha', 'aldo', 'steve madden',
        'lulu', 'gvk', 'shopping'
      ].some((k) => lower.includes(k));

      const isCurrentOnHubs = location.pathname.includes('mall') || location.pathname.includes('fashion-hub');

      if (isCurrentOnHubs || isFashionHubSearch) {
        navigate(`/customer/fashion-hubs?search=${encodeURIComponent(query)}`);
      } else {
        navigate(`/customer/designers?search=${encodeURIComponent(query)}`);
      }
    } else if (role === 'designer') {
      navigate(`/designer/bookings?search=${encodeURIComponent(query)}`);
    } else {
      navigate(`/admin/customers?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className={`zorevi-dash-header ${role === 'customer' ? 'zorevi-dash-header--customer' : ''}`}>
      <div className="zorevi-dash-header__left">
        {role !== 'customer' && (
          <button
            type="button"
            className="zorevi-dash-header__toggle-btn"
            onClick={onToggleSidebar}
            aria-label="Toggle navigation menu"
          >
            <Menu size={22} />
          </button>
        )}

        <Link to={`/${role}`} className="zorevi-dash-header__brand" aria-label="Zorevi">
          <img
            src="/images/zorevi-logo.png"
            alt="Zorevi – Shopping | Happy | Stylish"
            className="zorevi-dash-header__logo-img"
          />
          {role !== 'customer' && (
            <span className={`zorevi-dash-header__role-badge zorevi-dash-header__role-badge--${role}`}>
              {role === 'designer' ? 'Designer Studio' : 'Admin'}
            </span>
          )}
        </Link>

        {role === 'customer' && (
          <>
            <div className="zorevi-dash-header__divider" aria-hidden="true" />
            <Link
              to="/customer"
              className={`zorevi-dash-header__home-link ${location.pathname === '/customer' ? 'is-active' : ''}`}
            >
              <Home size={18} /> <span>Home</span>
            </Link>
            <Link
              to="/customer/bookings"
              className={`zorevi-dash-header__home-link zorevi-dash-header__bookings-link ${location.pathname.startsWith('/customer/bookings') ? 'is-active' : ''}`}
            >
              <Calendar size={18} /> <span>My Bookings</span>
            </Link>
            <div className="zorevi-dash-header__location-wrap">
              <HeaderLocationSelector />
            </div>
          </>
        )}
      </div>

      <div className="zorevi-dash-header__center">
        {role !== 'customer' && (
          <div className="zorevi-dash-header__city" ref={cityRef}>
            <button
              type="button"
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
                    type="button"
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
        )}

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
            type="button"
            id={role === 'customer' ? 'customer-profile-trigger' : undefined}
            className="zorevi-dash-header__user-trigger"
            aria-label={role === 'customer' ? 'Open profile navigation' : 'Open account menu'}
            aria-haspopup={role === 'customer' ? 'dialog' : 'menu'}
            aria-expanded={role === 'customer' ? profileDrawerOpen : showUserDropdown}
            aria-controls={role === 'customer' ? 'customer-profile-drawer' : undefined}
            onClick={() => {
              if (role === 'customer') onToggleSidebar?.();
              else setShowUserDropdown(!showUserDropdown);
            }}
          >
            <img
              src={user?.avatar || localAvatarFallback}
              alt={user?.name || 'User'}
              className="zorevi-dash-header__avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = localAvatarFallback;
              }}
            />
            <div className="zorevi-dash-header__user-label">
              <span className="zorevi-dash-header__user-name">
                {role === 'customer'
                  ? (user?.name ? `Hi, ${user.name.split(' ')[0]}` : 'Hi, Customer')
                  : user?.name || (role === 'designer' ? 'Aarohi Mehta' : 'Priya Sharma')}
              </span>
            </div>
            <ChevronDown size={14} className="zorevi-dash-header__user-chevron" />
          </button>

          {showUserDropdown && role !== 'customer' && (
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

