import React, { createContext, useContext, useState } from 'react';
import { DESIGNER_PROFILE, RECENT_BOOKINGS, PORTFOLIO_HIGHLIGHTS } from '../constants';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [profile, setProfile] = useState(DESIGNER_PROFILE);
  const [isOnline, setIsOnline] = useState(true);
  const [selectedCity, setSelectedCity] = useState('Hyderabad');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState(RECENT_BOOKINGS);
  const [portfolio, setPortfolio] = useState(PORTFOLIO_HIGHLIGHTS);
  const [unreadNotifications, setUnreadNotifications] = useState(2);
  const [toastMessage, setToastMessage] = useState(null);

  // Modals state
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isUploadProjectOpen, setIsUploadProjectOpen] = useState(false);
  const [selectedBookingForDetail, setSelectedBookingForDetail] = useState(null);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const toggleOnlineStatus = () => {
    const nextStatus = !isOnline;
    setIsOnline(nextStatus);
    showToast(
      nextStatus
        ? 'Studio status updated: Online and accepting new bookings!'
        : 'Studio status updated: Offline / taking a break',
      nextStatus ? 'success' : 'info'
    );
  };

  const updateBookingStatus = (bookingId, newStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );
    showToast(`Booking ${bookingId} marked as ${newStatus}!`);
  };

  const addPortfolioProject = (project) => {
    setPortfolio((prev) => [
      {
        id: `port_${Date.now()}`,
        ...project,
      },
      ...prev,
    ]);
    showToast('New project added to your portfolio!');
  };

  const updateProfileData = (updatedFields) => {
    setProfile((prev) => ({
      ...prev,
      ...updatedFields,
    }));
    showToast('Designer profile updated successfully!');
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        setProfile,
        updateProfileData,
        isOnline,
        setIsOnline,
        toggleOnlineStatus,
        selectedCity,
        setSelectedCity,
        searchQuery,
        setSearchQuery,
        bookings,
        setBookings,
        updateBookingStatus,
        portfolio,
        setPortfolio,
        addPortfolioProject,
        unreadNotifications,
        setUnreadNotifications,
        toastMessage,
        showToast,
        isEditProfileOpen,
        setIsEditProfileOpen,
        isUploadProjectOpen,
        setIsUploadProjectOpen,
        selectedBookingForDetail,
        setSelectedBookingForDetail,
        isAddServiceOpen,
        setIsAddServiceOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
