import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Heart, Bell, ShoppingBag, Menu, X, ChevronDown, LogOut, User, Settings, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import HeaderLocationSelector from './HeaderLocationSelector';
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
    const query = searchQuery.trim();
    if (!query) return;

    const lower = query.toLowerCase();
    const isFashionHubSearch = [
      'mall', 'hub', 'boutique', 'store', 'shop', 'outlet',
      'ethnic', 'bridal', 'saree', 'jewelry', 'footwear', 'fashion',
      'zara', 'h&m', 'sarath', 'inorbit', 'nexus', 'forum', 'manyavar',
      'fabindia', 'neeru', 'mugadha', 'aldo', 'steve madden', 'lulu', 'gvk'
    ].some((k) => lower.includes(k));

    const isCurrentOnHubs = location.pathname.includes('mall') || location.pathname.includes('fashion-hub');

    if (isCurrentOnHubs || isFashionHubSearch) {
      navigate(`/explore/fashion-hubs?search=${encodeURIComponent(query)}`);
    } else {
      navigate(`/explore/designers?search=${encodeURIComponent(query)}`);
    }
  };

  const unreadCount = isAuthenticated ? getUnreadCount(user?.role) : 0;

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo" aria-label="Zorevi Homepage">
          <img
            src="/images/zorevi-logo.png"
            alt="Zorevi – Shopping | Happy | Stylish"
            className="navbar__logo-img"
          />
        </Link>

        <div className="navbar__center">
          <HeaderLocationSelector />

          <form className="navbar__search" onSubmit={handleSearch} role="search">
            <Search size={18} className="navbar__search-icon" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search designers, fashion hubs, styles..."
              aria-label="Search designers, fashion hubs, styles"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        <div className="navbar__right">
          <nav className="navbar__public-links" aria-label="Main navigation">
            <Link
              to="/explore/designers"
              className={location.pathname.startsWith('/explore/designers') ? 'active' : ''}
            >
              Explore Designers
            </Link>
            <Link
              to="/explore/fashion-hubs"
              className={location.pathname.startsWith('/explore/fashion-hubs') ? 'active' : ''}
            >
              Fashion Hubs
            </Link>
          </nav>

          <div className="navbar__actions">
            {isAuthenticated ? (
              <>
                {user?.role === 'customer' && (
                  <Link
                    to="/customer/bookings"
                    className="navbar__action-btn"
                    title="My Bookings"
                    aria-label="My Bookings"
                  >
                    <Calendar size={20} />
                  </Link>
                )}
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
                      {user.role === 'customer' && (
                        <Link to="/customer/bookings" className="navbar__dropdown-item" onClick={() => setShowUserDropdown(false)}>
                          <Calendar size={16} /> My Bookings
                        </Link>
                      )}
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
                <Link to="/for-designers" className="navbar__btn-designer">
                  For Designers
                </Link>
                <Link to="/customer/login" className="navbar__login-btn">
                  Login
                </Link>
              </div>
            )}
          </div>
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
            <input
              type="text"
              placeholder="Search designers, fashion hubs, styles..."
              aria-label="Search designers, fashion hubs, styles"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <div style={{ marginBottom: '14px' }}>
            <HeaderLocationSelector isMobile={true} />
          </div>
          <nav className="navbar__mobile-nav">
            <Link to="/">Home</Link>
            <Link to="/explore/designers">Explore Designers</Link>
            <Link to="/explore/fashion-hubs">Fashion Hubs</Link>
            {isAuthenticated && user?.role === 'customer' && (
              <Link to="/customer/bookings">My Bookings</Link>
            )}
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

