import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  mockCustomerNotifications,
  mockDesignerNotifications,
  mockAdminNotifications,
  mockWishlist,
  mockBookings,
} from '../services/mockData';
import {
  DEFAULT_LOCATION,
  getCurrentDevicePosition,
  reverseGeocodeCoordinates,
} from '../services/locationService';

const AppContext = createContext(null);

const STORAGE_KEYS = {
  BOOKINGS: 'zorevi_shared_bookings_v2',
  WISHLIST: 'zorevi_shared_wishlist',
  CUSTOMER_NOTIFS: 'zorevi_customer_notifs',
  DESIGNER_NOTIFS: 'zorevi_designer_notifs',
  SCHEDULE: 'zorevi_designer_schedule',
  LOCATION: 'zorevi_user_location',
};

const initialBookings = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error loading stored bookings', e);
  }
  return mockBookings;
};

const initialNotifications = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error(`Error loading notifications for ${key}`, e);
  }
  return fallback;
};

export function AppProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      return saved ? JSON.parse(saved) : mockWishlist;
    } catch {
      return mockWishlist;
    }
  });

  const [bookings, setBookings] = useState(initialBookings);
  const [customerNotifications, setCustomerNotifications] = useState(() =>
    initialNotifications(STORAGE_KEYS.CUSTOMER_NOTIFS, mockCustomerNotifications)
  );
  const [designerNotifications, setDesignerNotifications] = useState(() =>
    initialNotifications(STORAGE_KEYS.DESIGNER_NOTIFS, mockDesignerNotifications)
  );
  const [adminNotifications, setAdminNotifications] = useState(mockAdminNotifications);
  const [selectedCity, setSelectedCity] = useState('Hyderabad');

  // Real-time location state
  const [userLocation, setUserLocation] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOCATION);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.lat && parsed.lng) return parsed;
      }
    } catch (e) {
      console.error('Error loading stored user location', e);
    }
    return DEFAULT_LOCATION;
  });
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const updateUserLocation = useCallback((newLoc) => {
    if (!newLoc || !newLoc.lat || !newLoc.lng) return;
    setUserLocation(newLoc);
    if (newLoc.city) {
      setSelectedCity(newLoc.city);
    }
    try {
      localStorage.setItem(STORAGE_KEYS.LOCATION, JSON.stringify(newLoc));
    } catch (e) {
      console.error('Failed to persist user location', e);
    }
  }, []);

  const detectUserLocation = useCallback(async () => {
    setIsDetectingLocation(true);
    try {
      const position = await getCurrentDevicePosition();
      const geocoded = await reverseGeocodeCoordinates(position.lat, position.lng);
      const fullLocation = {
        ...geocoded,
        accuracy: position.accuracy,
        isDetected: true,
      };
      updateUserLocation(fullLocation);
      addToast(`Detected location: ${fullLocation.formatted}`, 'success');
      setIsDetectingLocation(false);
      return fullLocation;
    } catch (err) {
      setIsDetectingLocation(false);
      const message = err?.message || 'Could not detect current location. Please choose manually.';
      addToast(message, 'warning');
      throw err;
    }
  }, [updateUserLocation, addToast]);

  // Sync bookings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    } catch (e) {
      console.error('Failed to persist bookings', e);
    }
  }, [bookings]);

  // Sync notifications to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOMER_NOTIFS, JSON.stringify(customerNotifications));
      localStorage.setItem(STORAGE_KEYS.DESIGNER_NOTIFS, JSON.stringify(designerNotifications));
    } catch (e) {
      console.error('Failed to persist notifications', e);
    }
  }, [customerNotifications, designerNotifications]);

  // Sync wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to persist wishlist', e);
    }
  }, [wishlist]);

  const toggleWishlist = useCallback((type, itemId) => {
    setWishlist((prev) => {
      const exists = prev.find((w) => w.type === type && w.itemId === itemId);
      if (exists) {
        return prev.filter((w) => w.id !== exists.id);
      }
      return [...prev, { id: `wish-${Date.now()}`, type, itemId, addedAt: new Date().toISOString() }];
    });
  }, []);

  const isInWishlist = useCallback(
    (type, itemId) => wishlist.some((w) => w.type === type && w.itemId === itemId),
    [wishlist]
  );

  const markNotificationRead = useCallback((role, notifId) => {
    const setter =
      role === 'customer'
        ? setCustomerNotifications
        : role === 'designer'
        ? setDesignerNotifications
        : setAdminNotifications;
    setter((prev) => prev.map((n) => (n.id === notifId ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback((role) => {
    const setter =
      role === 'customer'
        ? setCustomerNotifications
        : role === 'designer'
        ? setDesignerNotifications
        : setAdminNotifications;
    setter((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const getUnreadCount = useCallback(
    (role) => {
      const notifs =
        role === 'customer'
          ? customerNotifications
          : role === 'designer'
          ? designerNotifications
          : adminNotifications;
      return notifs.filter((n) => !n.read).length;
    },
    [customerNotifications, designerNotifications, adminNotifications]
  );

  /**
   * 1. CUSTOMER CREATES BOOKING REQUEST (Step 8)
   * Status starts as 'Pending Confirmation'. Never requests payment upfront!
   */
  const createBookingRequest = useCallback(
    (draft) => {
      const bookingId = `ZV-${Math.floor(8450 + Math.random() * 1000)}`;
      const designerFee = Number(draft.designerFee || draft.designer?.startingPrice || 999);
      const advanceAmount = Math.round(designerFee * 0.3);
      const remainingAmount = designerFee - advanceAmount;

      const newBooking = {
        id: bookingId,
        customerId: draft.customerId || 'cust-001',
        customerName: draft.customerName || 'Praveen Kumar',
        customerAvatar: draft.customerAvatar || '/images/customer-praveen.png',
        customerPhone: draft.customerPhone || '+91 98765 43210',
        customerEmail: draft.customerEmail || 'praveen.kumar@email.com',
        designerId: draft.designer?.id || draft.designerId || 'des-001',
        designerName: draft.designer?.name || draft.designerName || 'Aarohi Mehta',
        designerAvatar: draft.designer?.avatar || draft.designerAvatar || '/assets/images/designer-aarohi.jpg',
        designerTitle: draft.designer?.title || "Women's & Bridal Styling",
        designerLocation: draft.designer?.location || 'Hyderabad',
        occasion: draft.occasion || 'Wedding',
        services: draft.services || (draft.service ? [draft.service] : ['Bridal Styling']),
        category: draft.category || 'Women',
        preferences: {
          clothingPreference: draft.preferences?.clothingPreference || 'Traditional & Ethnic',
          preferredStyles: draft.preferences?.preferredStyles || ['Royal & Heavy'],
          colorPreferences: draft.preferences?.colorPreferences || 'Maroon, Gold, Rose Pink',
          outfitRequirements: draft.preferences?.outfitRequirements || draft.requirements || 'Occasion ensemble curation',
          specialInstructions: draft.preferences?.specialInstructions || draft.notes || '',
          referenceImages: draft.preferences?.referenceImages || [],
        },
        shoppingBudget: draft.shoppingBudget || 'Up to ₹50,000',
        designerFee,
        advanceAmount,
        remainingAmount,
        date: draft.date || '2025-11-26',
        startTime: draft.time || draft.startTime || '11:00 AM',
        endTime: draft.endTime || '01:00 PM',
        duration: draft.duration || 2,
        locationType: draft.locationType || 'mall',
        mall: draft.mall || { name: 'Lakeside Fashion Mall', locality: 'Kukatpally, Hyderabad' },
        meetingPoint: draft.meetingPoint || 'Fashion Lounge, Ground Floor',
        status: 'Pending Confirmation',
        paymentStatus: 'Unpaid',
        timeline: [
          { step: 'Request Submitted', date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }), time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), completed: true },
          { step: 'Designer Confirmation', date: 'Pending review', completed: false, active: true },
          { step: '30% Advance Payment', date: 'Awaiting confirmation', completed: false },
          { step: 'Styling Session', date: draft.date || 'Scheduled Date', completed: false },
          { step: 'Completed', date: '', completed: false },
        ],
        createdAt: new Date().toISOString(),
      };

      setBookings((prev) => [newBooking, ...prev]);

      // Notify Designer
      const designerNotif = {
        id: `notif-des-${Date.now()}`,
        role: 'designer',
        title: 'New Booking Request!',
        message: `${newBooking.customerName} submitted a booking request for ${newBooking.occasion} on ${newBooking.date} (${newBooking.startTime}).`,
        date: 'Just now',
        read: false,
        bookingId: newBooking.id,
      };
      setDesignerNotifications((prev) => [designerNotif, ...prev]);

      // Notify Customer
      const customerNotif = {
        id: `notif-cust-${Date.now()}`,
        role: 'customer',
        title: 'Booking Request Sent',
        message: `Your request for ${newBooking.designerName} was sent. You will be notified once the designer accepts.`,
        date: 'Just now',
        read: false,
        bookingId: newBooking.id,
      };
      setCustomerNotifications((prev) => [customerNotif, ...prev]);

      addToast(`Booking request #${bookingId} sent to ${newBooking.designerName}!`, 'success');
      return newBooking;
    },
    [addToast]
  );

  /**
   * 2. DESIGNER ACCEPTS REQUEST
   * Status changes to 'Awaiting Payment'. Makes 30% advance payable by customer.
   */
  const acceptBookingRequest = useCallback(
    (bookingId) => {
      setBookings((prev) =>
        prev.map((b) => {
          if (b.id !== bookingId) return b;
          return {
            ...b,
            status: 'Awaiting Payment',
            timeline: b.timeline.map((item, idx) => {
              if (item.step === 'Designer Confirmation') {
                return { ...item, date: 'Confirmed just now', completed: true, active: false };
              }
              if (item.step === '30% Advance Payment') {
                return { ...item, date: 'Ready to pay (30%)', active: true };
              }
              return item;
            }),
          };
        })
      );

      const target = bookings.find((b) => b.id === bookingId);
      const designerName = target?.designerName || 'Your designer';

      // Notify Customer
      const notif = {
        id: `notif-cust-${Date.now()}`,
        role: 'customer',
        title: 'Booking Request Accepted! 🎉',
        message: `${designerName} confirmed your slot for ${target?.occasion || 'Styling'}. Please pay 30% advance (₹${target?.advanceAmount || 300}) to lock your booking.`,
        date: 'Just now',
        read: false,
        bookingId,
      };
      setCustomerNotifications((prev) => [notif, ...prev]);

      addToast(`Accepted booking #${bookingId}! Customer notified to pay 30% advance.`, 'success');
    },
    [bookings, addToast]
  );

  /**
   * 3. DESIGNER REJECTS REQUEST
   */
  const rejectBookingRequest = useCallback(
    (bookingId, reason = 'Schedule unavailable') => {
      setBookings((prev) =>
        prev.map((b) => {
          if (b.id !== bookingId) return b;
          return {
            ...b,
            status: 'Declined',
            declineReason: reason,
            timeline: b.timeline.map((item) => {
              if (item.step === 'Designer Confirmation') {
                return { ...item, date: `Declined: ${reason}`, completed: false, active: false };
              }
              return item;
            }),
          };
        })
      );

      const target = bookings.find((b) => b.id === bookingId);
      const notif = {
        id: `notif-cust-${Date.now()}`,
        role: 'customer',
        title: 'Booking Request Update',
        message: `${target?.designerName || 'Designer'} was unable to accept booking #${bookingId}: ${reason}`,
        date: 'Just now',
        read: false,
        bookingId,
      };
      setCustomerNotifications((prev) => [notif, ...prev]);

      addToast(`Booking #${bookingId} has been declined.`, 'info');
    },
    [bookings, addToast]
  );

  /**
   * 4. DESIGNER PROPOSES ALTERNATIVE DATE/TIME
   */
  const proposeAlternativeSlot = useCallback(
    (bookingId, proposedDate, proposedTime, note = '') => {
      setBookings((prev) =>
        prev.map((b) => {
          if (b.id !== bookingId) return b;
          return {
            ...b,
            status: 'Alternative Proposed',
            proposedDate,
            proposedTime,
            designerNote: note,
            timeline: b.timeline.map((item) => {
              if (item.step === 'Designer Confirmation') {
                return { ...item, date: `Alternative suggested: ${proposedDate} at ${proposedTime}`, active: true };
              }
              return item;
            }),
          };
        })
      );

      const target = bookings.find((b) => b.id === bookingId);
      const notif = {
        id: `notif-cust-${Date.now()}`,
        role: 'customer',
        title: 'Alternative Slot Proposed',
        message: `${target?.designerName || 'Designer'} suggested an alternative slot: ${proposedDate} at ${proposedTime}.`,
        date: 'Just now',
        read: false,
        bookingId,
      };
      setCustomerNotifications((prev) => [notif, ...prev]);

      addToast(`Alternative slot proposed for booking #${bookingId}.`, 'success');
    },
    [bookings, addToast]
  );

  /**
   * 5. CUSTOMER PAYS 30% ADVANCE PAYMENT (Step 9)
   * Only accessible AFTER designer confirms. Changes status to 'Confirmed'.
   */
  const payAdvancePayment = useCallback(
    (bookingId, paymentMethod = 'UPI') => {
      setBookings((prev) =>
        prev.map((b) => {
          if (b.id !== bookingId) return b;
          return {
            ...b,
            status: 'Confirmed',
            paymentStatus: 'Advance Paid (30%)',
            paymentMethod,
            totalPaid: b.advanceAmount || 300,
            advancePaidAt: new Date().toISOString(),
            timeline: b.timeline.map((item) => {
              if (item.step === '30% Advance Payment') {
                return { ...item, date: `Paid ₹${b.advanceAmount || 300} via ${paymentMethod}`, completed: true, active: false };
              }
              if (item.step === 'Styling Session') {
                return { ...item, active: true };
              }
              return item;
            }),
          };
        })
      );

      const target = bookings.find((b) => b.id === bookingId);
      const advance = target?.advanceAmount || 300;

      // Notify Designer of incoming advance payout
      const desNotif = {
        id: `notif-des-${Date.now()}`,
        role: 'designer',
        title: '30% Advance Received! 💳',
        message: `${target?.customerName || 'Customer'} paid 30% advance (₹${advance}) for booking #${bookingId}. The styling session is confirmed.`,
        date: 'Just now',
        read: false,
        bookingId,
      };
      setDesignerNotifications((prev) => [desNotif, ...prev]);

      // Notify Customer
      const custNotif = {
        id: `notif-cust-${Date.now()}`,
        role: 'customer',
        title: 'Appointment Confirmed! 🎉',
        message: `Advance payment verified. Your appointment with ${target?.designerName || 'Designer'} on ${target?.date || 'Date'} is confirmed. Remaining 70% (₹${target?.remainingAmount || 700}) is payable after the session.`,
        date: 'Just now',
        read: false,
        bookingId,
      };
      setCustomerNotifications((prev) => [custNotif, ...prev]);

      addToast(`30% Advance of ₹${advance} verified! Booking #${bookingId} is confirmed.`, 'success');
    },
    [bookings, addToast]
  );

  /**
   * 6. CANCEL BOOKING
   */
  const cancelBooking = useCallback(
    (bookingId, reason = 'Customer requested cancellation') => {
      setBookings((prev) =>
        prev.map((b) => {
          if (b.id !== bookingId) return b;
          return {
            ...b,
            status: 'Cancelled',
            cancelReason: reason,
            paymentStatus: b.paymentStatus === 'Advance Paid (30%)' ? 'Refund Initiated' : 'Cancelled',
          };
        })
      );

      addToast(`Booking #${bookingId} cancelled.`, 'info');
    },
    [addToast]
  );

  /**
   * 7. COMPLETE SESSION (Designer marks complete)
   */
  const completeBooking = useCallback(
    (bookingId) => {
      setBookings((prev) =>
        prev.map((b) => {
          if (b.id !== bookingId) return b;
          return {
            ...b,
            status: 'Completed',
            paymentStatus: 'Fully Paid',
            totalPaid: b.designerFee || b.amount || 999,
            timeline: b.timeline.map((item) => ({ ...item, completed: true, active: false })),
          };
        })
      );

      addToast(`Styling session #${bookingId} marked as completed!`, 'success');
    },
    [addToast]
  );

  return (
    <AppContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        wishlist,
        toggleWishlist,
        isInWishlist,
        bookings,
        createBookingRequest,
        acceptBookingRequest,
        rejectBookingRequest,
        proposeAlternativeSlot,
        payAdvancePayment,
        cancelBooking,
        completeBooking,
        customerNotifications,
        designerNotifications,
        adminNotifications,
        markNotificationRead,
        markAllNotificationsRead,
        getUnreadCount,
        selectedCity,
        setSelectedCity,
        userLocation,
        updateUserLocation,
        detectUserLocation,
        isDetectingLocation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
