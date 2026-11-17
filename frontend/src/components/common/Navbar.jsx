import React, { useState, useRef, useEffect } from 'react';
import { 
  MapPin, 
  ChevronDown, 
  Search, 
  Bell, 
  Check, 
  SlidersHorizontal,
  User,
  ShieldCheck,
  LogOut,
  Sparkles,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CITIES } from '../../constants';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ onToggleMobileSidebar }) => {
  const { 
    profile, 
    isOnline, 
    toggleOnlineStatus, 
    selectedCity, 
    setSelectedCity,
    searchQuery,
    setSearchQuery,
    unreadNotifications,
    setUnreadNotifications,
    setIsEditProfileOpen,
    showToast
  } = useApp();

  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const cityRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cityRef.current && !cityRef.current.contains(event.target)) {
        setIsCityDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sampleNotifications = [
    {
      id: 1,
      title: 'New Bridal Booking Request',
      desc: 'Mira Kapoor requested a 3-hour consultation for Nov 18',
      time: '12m ago',
      unread: true,
      tag: 'New'
    },
    {
      id: 2,
      title: 'Payment Credited ₹4,500',
      desc: 'Razorpay settlement for Booking #BK-1075 completed',
      time: '1h ago',
      unread: true,
      tag: 'Earnings'
    },
    {
      id: 3,
      title: 'New 5★ Customer Review',
      desc: 'Pooja Reddy: "Aarohi helped me pick the dream saree!"',
      time: 'Yesterday',
      unread: false,
      tag: 'Review'
    }
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#F6F3FB]/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left Section: Mobile Menu Button + Location Pill + Global Search */}
        <div className="flex items-center gap-3 flex-1 max-w-2xl">
          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl bg-white border border-[#EAE4F5] text-[#1E1B2E] hover:bg-[#F3EEFB] transition"
            aria-label="Open sidebar menu"
          >
            <SlidersHorizontal className="w-5 h-5 text-[#6B35D9]" />
          </button>

          {/* Location Selector Pill */}
          <div className="relative" ref={cityRef}>
            <button
              type="button"
              onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-[#EAE4F5] shadow-zorevi-sm hover:border-[#6B35D9]/40 hover:bg-[#FAF8FE] transition text-sm font-medium text-[#1E1B2E] whitespace-nowrap"
            >
              <MapPin className="w-4 h-4 text-[#6B35D9]" />
              <span>{selectedCity}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#6B7280] transition-transform duration-200 ${isCityDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* City Dropdown Menu */}
            {isCityDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-2xl shadow-zorevi-md border border-[#EAE4F5] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                  Service Location
                </div>
                {CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setSelectedCity(city);
                      setIsCityDropdownOpen(false);
                      showToast(`Location set to ${city}`);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-sm flex items-center justify-between hover:bg-[#F3EEFF] hover:text-[#6B35D9] transition ${
                      selectedCity === city ? 'font-semibold text-[#6B35D9] bg-[#F3EEFF]/50' : 'text-[#1E1B2E]'
                    }`}
                  >
                    <span>{city}</span>
                    {selectedCity === city && <Check className="w-4 h-4 text-[#6B35D9]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Global Search Bar */}
          <div className="relative flex-1 hidden sm:block">
            <div className={`relative flex items-center rounded-full bg-white border transition-all duration-200 shadow-zorevi-sm ${
              isSearchFocused ? 'border-[#6B35D9] ring-2 ring-[#6B35D9]/15' : 'border-[#EAE4F5] hover:border-[#D9D2E9]'
            }`}>
              <Search className="w-4 h-4 text-[#9CA3AF] ml-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Search bookings, services or customers..."
                className="w-full py-2 pl-3 pr-9 text-sm bg-transparent rounded-full text-[#1E1B2E] placeholder-[#9CA3AF] focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 p-1 text-[#9CA3AF] hover:text-[#1E1B2E]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Section: Notification Bell + Online Status Pill + Profile Dropdown */}
        <div className="flex items-center gap-3">
          
          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                if (unreadNotifications > 0) {
                  setUnreadNotifications(0);
                }
              }}
              className="relative p-2.5 rounded-full bg-white border border-[#EAE4F5] shadow-zorevi-sm hover:bg-[#FAF8FE] hover:border-[#6B35D9]/30 transition text-[#1E1B2E]"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4 text-[#1E1B2E]" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#EF4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {/* Notifications Dropdown Panel */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-zorevi-lg border border-[#EAE4F5] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-3 border-b border-[#EAE4F5] flex items-center justify-between bg-[#FAF8FE]">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[#1E1B2E]">Notifications</span>
                    <span className="text-xs bg-[#6B35D9] text-white font-semibold px-2 py-0.5 rounded-full">
                      Studio
                    </span>
                  </div>
                  <Link
                    to="/designer/notifications"
                    onClick={() => setIsNotificationsOpen(false)}
                    className="text-xs font-semibold text-[#6B35D9] hover:underline"
                  >
                    View all
                  </Link>
                </div>
                <div className="divide-y divide-[#F3EEFB] max-h-80 overflow-y-auto">
                  {sampleNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-3.5 hover:bg-[#F9F7FC] transition flex items-start gap-3 cursor-pointer"
                      onClick={() => {
                        setIsNotificationsOpen(false);
                        navigate('/designer/bookings');
                      }}
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-[#6B35D9] mt-1.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="text-xs font-semibold text-[#1E1B2E]">{notif.title}</p>
                          <span className="text-[10px] text-[#9CA3AF]">{notif.time}</span>
                        </div>
                        <p className="text-xs text-[#6B7280] line-clamp-2">{notif.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-2.5 text-center border-t border-[#EAE4F5] bg-[#FAF8FE]">
                  <button 
                    onClick={() => {
                      setIsNotificationsOpen(false);
                      showToast('All notifications marked as read');
                    }}
                    className="text-xs font-medium text-[#6B7280] hover:text-[#6B35D9] transition"
                  >
                    Mark all as read
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Availability Status Pill */}
          <button
            type="button"
            onClick={toggleOnlineStatus}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition shadow-zorevi-sm font-medium text-xs sm:text-sm ${
              isOnline
                ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46] hover:bg-[#D1FAE5]'
                : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#4B5563] hover:bg-[#E5E7EB]'
            }`}
            title="Click to toggle studio online/offline status"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isOnline ? 'bg-[#10B981] animate-pulse' : 'bg-[#9CA3AF]'
              }`}
            />
            <span>{isOnline ? 'Online' : 'Offline'}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>

          {/* Designer Profile Menu Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full bg-white border border-[#EAE4F5] shadow-zorevi-sm hover:border-[#6B35D9]/40 hover:bg-[#FAF8FE] transition"
            >
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-8 h-8 rounded-full object-cover border border-[#EAE4F5]"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80';
                }}
              />
              <span className="text-sm font-semibold text-[#1E1B2E] hidden md:inline-block">
                {profile.name}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#6B7280] transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile Dropdown */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-zorevi-lg border border-[#EAE4F5] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-3 border-b border-[#F3EEFB]">
                  <p className="text-sm font-bold text-[#1E1B2E] flex items-center gap-1.5">
                    {profile.name}
                    <ShieldCheck className="w-4 h-4 text-[#3B82F6]" />
                  </p>
                  <p className="text-xs text-[#6B7280] mt-0.5">{profile.title}</p>
                  <div className="mt-2 text-[11px] bg-[#F3EEFF] text-[#6B35D9] px-2 py-0.5 rounded-full inline-block font-semibold">
                    ⭐ 4.9 · 86 Reviews
                  </div>
                </div>

                <div className="py-1 text-sm text-[#1E1B2E]">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      setIsEditProfileOpen(true);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-[#F3EEFF] hover:text-[#6B35D9] flex items-center gap-2.5 transition"
                  >
                    <User className="w-4 h-4 text-[#6B7280]" />
                    <span>Edit Studio Profile</span>
                  </button>
                  <Link
                    to="/designer/profile-portfolio"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="w-full px-4 py-2 text-left hover:bg-[#F3EEFF] hover:text-[#6B35D9] flex items-center gap-2.5 transition"
                  >
                    <Sparkles className="w-4 h-4 text-[#6B7280]" />
                    <span>View Public Portfolio</span>
                  </Link>
                  <Link
                    to="/customer/explore"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="w-full px-4 py-2 text-left hover:bg-[#F3EEFF] hover:text-[#6B35D9] flex items-center gap-2.5 transition"
                  >
                    <span className="text-xs bg-[#ECFDF5] text-[#065F46] px-1.5 py-0.5 rounded font-medium">Switch</span>
                    <span>Customer View</span>
                  </Link>
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="w-full px-4 py-2 text-left hover:bg-[#F3EEFF] hover:text-[#6B35D9] flex items-center gap-2.5 transition"
                  >
                    <span className="text-xs bg-[#FEF3C7] text-[#92400E] px-1.5 py-0.5 rounded font-medium">Switch</span>
                    <span>Admin View</span>
                  </Link>
                </div>

                <div className="border-t border-[#F3EEFB] pt-1">
                  <Link
                    to="/logout"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="w-full px-4 py-2 text-left text-sm text-[#EF4444] hover:bg-[#FEF2F2] flex items-center gap-2.5 transition"
                  >
                    <LogOut className="w-4 h-4 text-[#EF4444]" />
                    <span>Logout</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};

export default Navbar;
