import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCheck,
  Tag,
  Calendar,
  CalendarCheck2,
  Wallet,
  Star,
  Bell,
  Settings,
  LogOut,
  Shirt,
  ArrowRight,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const { setIsAddServiceOpen } = useApp();
  const navigate = useNavigate();

  // Deduplicated primary navigation list
  const primaryNavItems = [
    {
      name: 'Dashboard',
      path: '/designer/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Profile & Portfolio',
      path: '/designer/profile-portfolio',
      icon: UserCheck,
      badge: 'Unified',
    },
    {
      name: 'Services & Pricing',
      path: '/designer/services-pricing',
      icon: Tag,
    },
    {
      name: 'Availability',
      path: '/designer/availability',
      icon: Calendar,
    },
    {
      name: 'Bookings',
      path: '/designer/bookings',
      icon: CalendarCheck2,
      badgeCount: 3,
    },
    {
      name: 'Earnings',
      path: '/designer/earnings',
      icon: Wallet,
    },
    {
      name: 'Reviews',
      path: '/designer/reviews',
      icon: Star,
    },
  ];

  // Utility navigation separated by subtle divider
  const utilityNavItems = [
    {
      name: 'Notifications',
      path: '/designer/notifications',
      icon: Bell,
      badgeCount: 2,
    },
    {
      name: 'Settings',
      path: '/designer/settings',
      icon: Settings,
    },
    {
      name: 'Logout',
      path: '/logout',
      icon: LogOut,
      isDanger: true,
    },
  ];

  const handleNavClick = () => {
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const handleAddServiceClick = () => {
    setIsAddServiceOpen(true);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#FDFCFF] border-r border-[#EAE4F5] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        } overflow-y-auto`}
      >
        <div className="p-4 sm:p-5">
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-5 border-b border-[#F3EEFB]">
            <NavLink
              to="/designer/dashboard"
              onClick={handleNavClick}
              className="flex items-center gap-2.5 group"
            >
              {/* Zorevi Butterfly / Ribbon Logo */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6B35D9] to-[#8B5CF6] flex items-center justify-center p-1.5 shadow-purple-glow group-hover:scale-105 transition-transform duration-200">
                <img
                  src="/logos/zorevi-butterfly.svg"
                  alt="Zorevi Logo"
                  className="w-full h-full object-contain brightness-0 invert"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>

              <div>
                <div className="flex items-center gap-1">
                  <span className="font-extrabold text-xl tracking-tight text-[#1E1B2E] font-sans">
                    Zorevi
                  </span>
                </div>
                <p className="text-[11px] font-medium text-[#6B7280] tracking-wide">
                  Fashion for Everyone
                </p>
              </div>
            </NavLink>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-[#6B7280] hover:text-[#1E1B2E] hover:bg-[#F3EEFB]"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Primary Navigation */}
          <nav className="mt-4 space-y-1">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                      isActive
                        ? 'bg-[#6B35D9] text-white shadow-purple-glow font-semibold'
                        : 'text-[#4B5563] hover:text-[#1E1B2E] hover:bg-[#F3EEFF]/70'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 transition-colors ${
                            isActive ? 'text-white' : 'text-[#6B7280]'
                          }`}
                        />
                        <span>{item.name}</span>
                      </div>
                      {item.badgeCount && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-[#EDE8F8] text-[#6B35D9]'
                          }`}
                        >
                          {item.badgeCount}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Subtle Divider */}
          <div className="my-3 border-t border-[#EAE4F5]" />

          {/* Utility Navigation */}
          <div className="space-y-1">
            {utilityNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                      item.isDanger
                        ? 'text-[#DC2626] hover:bg-[#FEF2F2]'
                        : isActive
                        ? 'bg-[#6B35D9] text-white shadow-purple-glow font-semibold'
                        : 'text-[#6B7280] hover:text-[#1E1B2E] hover:bg-[#F3EEFF]/70'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 ${
                            item.isDanger
                              ? 'text-[#DC2626]'
                              : isActive
                              ? 'text-white'
                              : 'text-[#6B7280]'
                          }`}
                        />
                        <span>{item.name}</span>
                      </div>
                      {item.badgeCount && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#EF4444] text-white font-bold">
                          {item.badgeCount}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Bottom Promo Card: "Grow Your Design Studio With Zorevi" */}
        <div className="p-4 pt-0">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#F5EEFD] to-[#EDE5FA] border border-[#E4D9F5] p-3.5 text-center shadow-zorevi-sm">
            {/* Top Hanger Icon */}
            <div className="w-8 h-8 mx-auto mb-1.5 rounded-xl bg-white/80 shadow-sm flex items-center justify-center text-[#6B35D9]">
              <Shirt className="w-4 h-4 text-[#6B35D9]" />
            </div>

            <h4 className="text-xs font-bold text-[#1E1B2E] leading-snug">
              Grow Your Design Studio With Zorevi
            </h4>
            <p className="text-[10px] text-[#6B7280] mt-0.5">
              Add bespoke packages & attract brides in Hyderabad.
            </p>

            <button
              onClick={handleAddServiceClick}
              className="mt-2.5 w-full py-1.5 px-3 rounded-xl bg-[#6B35D9] hover:bg-[#5B29C5] text-white text-xs font-semibold shadow-purple-glow flex items-center justify-center gap-1.5 transition transform active:scale-95"
            >
              <span>Add a Service</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Shopping bags illustration at bottom */}
            <div className="mt-2.5 flex justify-center">
              <img
                src="/images/shopping-bags.png"
                alt="Studio Growth Bags"
                className="h-14 object-contain drop-shadow-sm"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
