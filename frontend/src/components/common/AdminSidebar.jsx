import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, UserCheck, ShieldCheck, Building2, Scissors,
  Grid, Calendar, CreditCard, RotateCcw, Percent, DollarSign,
  Star, HelpCircle, Bell, BarChart2, Settings, LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import './Sidebar.css';

export default function AdminSidebar({ isOpen, onClose }) {
  const { logout } = useAuth();
  const { getUnreadCount } = useApp();
  const navigate = useNavigate();
  const unreadCount = getUnreadCount('admin');

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Manage Customers', path: '/admin/customers', icon: Users },
    { label: 'Manage Designers', path: '/admin/designers', icon: UserCheck },
    { label: 'Designer Verification', path: '/admin/verification', icon: ShieldCheck, badge: 12 },
    { label: 'Manage Malls & Stores', path: '/admin/malls', icon: Building2 },
    { label: 'Manage Services', path: '/admin/services', icon: Scissors },
    { label: 'Manage Categories', path: '/admin/categories', icon: Grid },
    { label: 'Manage Bookings', path: '/admin/bookings', icon: Calendar },
    { label: 'Manage Payments', path: '/admin/payments', icon: CreditCard },
    { label: 'Manage Refunds', path: '/admin/refunds', icon: RotateCcw, badge: 8 },
    { label: 'Commission Management', path: '/admin/commissions', icon: Percent },
    { label: 'Pricing Configuration', path: '/admin/pricing', icon: DollarSign },
    { label: 'Reviews & Ratings', path: '/admin/reviews', icon: Star },
    { label: 'Complaints & Support', path: '/admin/support', icon: HelpCircle, badge: 4 },
    { label: 'Notifications', path: '/admin/notifications', icon: Bell, badge: unreadCount },
    { label: 'Reports & Analytics', path: '/admin/reports', icon: BarChart2 },
    { label: 'Admin Settings', path: '/admin/settings', icon: Settings },
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
                  <span className={`zorevi-sidebar__badge ${item.label === 'Complaints & Support' ? 'zorevi-sidebar__badge--danger' : ''}`}>
                    {item.badge}
                  </span>
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
      </aside>
    </>
  );
}

