import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, MapPin, Heart, Bell, ShoppingBag, Menu, X, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { CITIES } from '../../constants';
import { AAROHI_PROFILE_IMAGE } from '../../utils/aarohiProfileImage';
import './Navbar.css';

export default function PublicNavbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { getUnreadCount, selectedCity, setSelectedCity } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const cityRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);

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
      navigate(`/explore/designers?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const unreadCount = isAuthenticated ? getUnreadCount(user?.role) : 0;

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          <div className="navbar__logo-icon">
            <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
              <path d="M16 4C12 4 8 8 8 12c0 4 4 8 8 12 4-4 8-8 8-12 0-4-4-8-8-8z" fill="url(#ng)"/>
              <path d="M8 12c-4 0-6 2-6 4s2 4 6 4c2 0 4-2 6-4-2-2-4-4-6-4z" fill="url(#ng)" opacity="0.8"/>
              <path d="M24 12c4 0 6 2 6 4s-2 4-6 4c-2 0-4-2-6-4 2-2 4-4 6-4z" fill="url(#ng)" opacity="0.8"/>
              <defs><linearGradient id="ng" x1="0" y1="0" x2="32" y2="32"><stop stopColor="#7C3AED"/><stop offset="1" stopColor="#A855F7"/></linearGradient></defs>
            </svg>
          </div>
          <div className="navbar__logo-text">
            <span className="navbar__brand">Zorevi</span>
            <span className="navbar__tagline">Fashion for Everyone</span>
          </div>
        </Link>

        <div className="navbar__center">
          <div className="navbar__city-selector" ref={cityRef}>
            <button
              type="button"
              className="navbar__city-btn"
              aria-expanded={showCityDropdown}
              onClick={() => setShowCityDropdown(!showCityDropdown)}
            >
              <MapPin size={16} />
              <span>{selectedCity}</span>
              <ChevronDown size={14} />
            </button>
            {showCityDropdown && (
              <div className="navbar__city-dropdown">
                {CITIES.map(city => (
                  <button key={city} className={`navbar__city-option ${city === selectedCity ? 'active' : ''}`}
                    onClick={() => { setSelectedCity(city); setShowCityDropdown(false); }}>
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form className="navbar__search" onSubmit={handleSearch} role="search">
            <Search size={18} className="navbar__search-icon" aria-hidden="true" />
            <input type="text" placeholder="Search designers or styles..."
              aria-label="Search designers or styles"
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </form>
        </div>

        <nav className="navbar__public-links" aria-label="Main navigation">
          <Link to="/for-designers">For Designers</Link>
        </nav>

        <div className="navbar__actions">
          {isAuthenticated ? (
            <>
              <Link to={`/${user.role}/wishlist`} className="navbar__action-btn" title="Wishlist" aria-label="Wishlist">
                <Heart size={20} />
              </Link>
              <Link to={`/${user.role}/notifications`} className="navbar__action-btn navbar__notif-btn" title="Notifications" aria-label="Notifications">
                <Bell size={20} />
                {unreadCount > 0 && <span className="navbar__badge">{unreadCount}</span>}
              </Link>
              <div className="navbar__user-menu" ref={userRef}>
                <button className="navbar__user-btn" onClick={() => setShowUserDropdown(!showUserDropdown)}>
                  <img src={user.avatar} alt={user.name} className="navbar__avatar"
                    onError={(e) => { e.target.onerror = null; e.target.src = user.role === 'designer' ? AAROHI_PROFILE_IMAGE : '/images/customer-praveen.png'; }} />
                  <span className="navbar__username">Hi, {user.name.split(' ')[0]}</span>
                  <ChevronDown size={14} />
                </button>
                {showUserDropdown && (
                  <div className="navbar__user-dropdown">
                    <div className="navbar__user-info">
                      <strong>{user.name}</strong>
                      <span>{user.email}</span>
                    </div>
                    <Link to={`/${user.role}/profile`} className="navbar__dropdown-item" onClick={() => setShowUserDropdown(false)}>
                      <User size={16} /> My Profile
                    </Link>
                    <Link to={`/${user.role}/settings`} className="navbar__dropdown-item" onClick={() => setShowUserDropdown(false)}>
                      <Settings size={16} /> Settings
                    </Link>
                    <button className="navbar__dropdown-item navbar__logout" onClick={() => { logout(); setShowUserDropdown(false); navigate('/'); }}>
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="navbar__auth-btns">
              <Link to="/customer/login" className="navbar__login-btn">Login</Link>
            </div>
          )}
        </div>

        <button
          type="button"
          className="navbar__hamburger"
          aria-expanded={mobileMenuOpen}
          aria-controls={mobileMenuOpen ? 'navbar-mobile-menu' : undefined}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="navbar__mobile-menu" id="navbar-mobile-menu">
          <form className="navbar__mobile-search" onSubmit={handleSearch} role="search">
            <Search size={18} aria-hidden="true" />
            <input type="text" placeholder="Search designers or styles..." aria-label="Search designers or styles" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </form>
          <label className="navbar__mobile-city">
            <MapPin size={16} aria-hidden="true" />
            <span>Location</span>
            <select value={selectedCity} onChange={(event) => setSelectedCity(event.target.value)}>
              {CITIES.map((city) => <option key={city} value={city}>{city}</option>)}
            </select>
          </label>
          <nav className="navbar__mobile-nav">
            <Link to="/">Home</Link>
            <Link to="/explore/malls">Nearby Malls</Link>
            <Link to="/categories">Fashion Categories</Link>
            <Link to="/for-designers">For Designers</Link>
            <Link to="/help">Help & Support</Link>
          </nav>
          {!isAuthenticated && (
            <div className="navbar__mobile-auth">
              <Link to="/customer/login" className="navbar__login-btn navbar__login-btn--mobile">Login</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

