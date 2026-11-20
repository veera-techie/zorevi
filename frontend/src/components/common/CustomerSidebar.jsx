import { useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import { Calendar, HelpCircle, LogOut, Settings, User, X, Edit2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';
import './CustomerSidebar.css';

export default function CustomerSidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const drawerRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;
      const focusable = drawerRef.current?.querySelectorAll('a[href], button:not([disabled])');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const handleOutsidePointerDown = (event) => {
      const target = event.target;
      if (
        drawerRef.current?.contains(target)
        || target.closest?.('#customer-profile-trigger')
        || target.closest?.('.zorevi-customer-drawer-backdrop')
      ) return;
      onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handleOutsidePointerDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handleOutsidePointerDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isProfileActive = location.pathname === '/customer/profile' || location.pathname === '/customer';

  const navItems = [
    { label: 'My Profile', path: '/customer/profile', icon: User, forceActive: isProfileActive },
    { label: 'My Bookings', path: '/customer/bookings', icon: Calendar },
    { label: 'Settings', path: '/customer/settings', icon: Settings },
    { label: 'Help & Support', path: '/customer/support', icon: HelpCircle },
  ];

  const handleLogout = () => {
    onClose();
    logout();
    navigate('/');
  };

  return (
    <>
      <button
        type="button"
        className="zorevi-customer-drawer-backdrop"
        aria-label="Close profile navigation"
        onClick={onClose}
      />
      <aside
        ref={drawerRef}
        id="customer-profile-drawer"
        className="zorevi-customer-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Customer navigation"
      >
        <div className="zorevi-customer-drawer__header">
          <div className="zorevi-customer-drawer__user-info">
            <Link to="/customer/profile" onClick={onClose} className="zorevi-customer-drawer__avatar-link" title="Edit Profile & Photo">
              <img
                src={user?.avatar || '/zorevi-icon.svg'}
                alt={user?.name || 'Customer'}
                className="zorevi-customer-drawer__avatar"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/zorevi-icon.svg';
                }}
              />
              <span className="zorevi-customer-drawer__avatar-edit-badge" title="Edit photo">
                <Edit2 size={11} />
              </span>
            </Link>
            <div>
              <h3 className="zorevi-customer-drawer__user-name">
                {user?.name ? `Hi, ${user.name.split(' ')[0]}` : 'Hi, Customer'}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <p className="zorevi-customer-drawer__user-role">Customer Account</p>
                <Link to="/customer/profile" onClick={onClose} className="zorevi-customer-drawer__edit-link">
                  Edit
                </Link>
              </div>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="zorevi-customer-drawer__close"
            aria-label="Close navigation drawer"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="zorevi-customer-drawer__nav" aria-label="Profile navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) => `zorevi-customer-drawer__item ${(isActive || item.forceActive) ? 'is-selected' : ''}`}
                onClick={onClose}
              >
                <Icon size={19} aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
          <button type="button" className="zorevi-customer-drawer__item zorevi-customer-drawer__logout" onClick={handleLogout}>
            <LogOut size={19} aria-hidden="true" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>
    </>
  );
}
