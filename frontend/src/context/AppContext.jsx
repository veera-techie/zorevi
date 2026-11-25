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
import apiClient from '../services/apiClient';
import { formatDate, parseValidDate } from '../utils';

const AppContext = createContext(null);

const STORAGE_KEYS = {
  BOOKINGS: 'zorevi_shared_bookings_v2',
  WISHLIST: 'zorevi_shared_wishlist',
  CUSTOMER_NOTIFS: 'zorevi_customer_notifs',
  DESIGNER_NOTIFS: 'zorevi_designer_notifs',
  SCHEDULE: 'zorevi_designer_schedule',
  LOCATION: 'zorevi_user_location',
};

function resolveNotificationTimestamp(notif) {
  const direct = parseValidDate(notif?.timestamp) || parseValidDate(notif?.createdAt) || parseValidDate(notif?.date);
  if (direct) return direct.toISOString();
  const epochMatch = typeof notif?.id === 'string' ? /(\d{13})$/.exec(notif.id) : null;
  if (epochMatch) {
    const fromId = parseValidDate(Number(epochMatch[1]));
    if (fromId) return fromId.toISOString();
  }
  return new Date().toISOString();
}

function normalizeNotification(notif, roleHint = 'customer') {
  if (!notif || typeof notif !== 'object') return notif;
  const timestamp = resolveNotificationTimestamp(notif);
  const type = notif.type || (notif.paymentStatus || /advance|payment|paid|invoice/i.test(notif.title || '') ? 'payment' : 'booking');
  const link = notif.link || (
    notif.bookingId
      ? (roleHint === 'designer' ? '/designer/booking-requests' : `/customer/bookings/${notif.bookingId}`)
      : undefined
  );
  return {
    ...notif,
    type,
    timestamp,
    link,
  };
}

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

const initialNotifications = (key, fallback, roleHint) => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.map((n) => normalizeNotification(n, roleHint));
      }
    }
  } catch (e) {
    console.error(`Error loading notifications for ${key}`, e);
  }
  return fallback.map((n) => normalizeNotification(n, roleHint));
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
  const [bookingConfirmation, setBookingConfirmation] = useState(null);
  const [customerNotifications, setCustomerNotifications] = useState(() =>
    initialNotifications(STORAGE_KEYS.CUSTOMER_NOTIFS, mockCustomerNotifications, 'customer')
  );
  const [designerNotifications, setDesignerNotifications] = useState(() =>
    initialNotifications(STORAGE_KEYS.DESIGNER_NOTIFS, mockDesignerNotifications, 'designer')
  );
  const [adminNotifications, setAdminNotifications] = useState(mockAdminNotifications);
  const [selectedCity, setSelectedCity] = useState('Hyderabad');

  const clearBookingConfirmation = useCallback(() => {
    setBookingConfirmation(null);
  }, []);

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

  // Cross-tab sync for bookings & notifications so designer updates reflect in customer views
  useEffect(() => {
    const handleStorage = (event) => {
      try {
        if (event.key === STORAGE_KEYS.BOOKINGS && event.newValue) {
          const parsed = JSON.parse(event.newValue);
          if (Array.isArray(parsed)) setBookings(parsed);
        } else if (event.key === STORAGE_KEYS.CUSTOMER_NOTIFS && event.newValue) {
          const parsed = JSON.parse(event.newValue);
          if (Array.isArray(parsed)) {
            setCustomerNotifications(parsed.map((n) => normalizeNotification(n, 'customer')));
          }
        } else if (event.key === STORAGE_KEYS.DESIGNER_NOTIFS && event.newValue) {
          const parsed = JSON.parse(event.newValue);
          if (Array.isArray(parsed)) {
            setDesignerNotifications(parsed.map((n) => normalizeNotification(n, 'designer')));
          }
        }
      } catch (e) {
        console.error('Failed to sync storage updates', e);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

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
   * 1. CUSTOMER CREATES BOOKING REQUEST
   * Validates via API client, creates booking with 'Pending Approval' status,
   * adds properly timestamped notifications, and triggers confirmation modal.
   */
  const createBookingRequest = useCallback(
    async (draft) => {
      const now = new Date();
      const nowIso = now.toISOString();
      const bookingId = `ZV-${Math.floor(8450 + Math.random() * 1000)}`;
      const designerFee = Number(draft.designerFee || draft.designer?.startingPrice || 999);
      const advanceAmount = Math.round(designerFee * 0.3);
      const remainingAmount = designerFee - advanceAmount;
      const requestedTime = draft.time || draft.startTime || '11:00 AM';
      const requestedDate = draft.date || nowIso.slice(0, 10);
      const venueName =
        draft.meetingLocation ||
        draft.mall?.name ||
        draft.location?.mallName ||
        'Lakeside Fashion Mall';

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
        service: draft.service || (Array.isArray(draft.services) && draft.services[0]) || 'Bridal Styling',
        services: draft.services || (draft.service ? [draft.service] : ['Bridal Styling']),
        category: draft.category || 'Women',
        preferences: {
          clothingPreference: draft.preferences?.clothingPreference || draft.clothingPreference || 'Contemporary & Occasion Wear',
          preferredStyles: draft.preferences?.preferredStyles || draft.preferredStyles || ['Modern', 'Tailored Regular'],
          colorPreferences: draft.preferences?.colorPreferences || draft.preferredColors || 'Palette tailored to selected occasion',
          outfitRequirements: draft.preferences?.outfitRequirements || draft.outfitRequirements || draft.requirements || 'Occasion ensemble curation',
          specialInstructions: draft.preferences?.specialInstructions || draft.specialInstructions || draft.notes || '',
          referenceImages: draft.preferences?.referenceImages || draft.referenceImages || [],
        },
        shoppingBudget: draft.shoppingBudget || 'Up to ₹50,000',
        designerFee,
        advanceAmount,
        remainingAmount,
        date: requestedDate,
        time: requestedTime,
        startTime: requestedTime,
        endTime: draft.endTime || '01:00 PM',
        duration: draft.duration || 2,
        meetingType: draft.meetingType || 'Mall Styling Session',
        meetingLocation: venueName,
        locationType: draft.locationType || (draft.meetingType === 'Online Consultation' ? 'online' : draft.meetingType === 'Designer Studio' ? 'studio' : 'mall'),
        mall: draft.mall || { name: venueName, locality: draft.designer?.location || 'Hyderabad' },
        meetingPoint: draft.meetingPoint || 'Fashion Lounge, Ground Floor',
        notes: draft.notes || draft.outfitRequirements || '',
        status: 'Pending Approval',
        paymentStatus: 'Unpaid',
        timeline: [
          {
            step: 'Request Submitted',
            date: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
            time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            completed: true,
          },
          { step: 'Designer Approval', date: 'Pending designer review', completed: false, active: true },
          { step: '30% Advance Payment', date: 'Awaiting approval', completed: false },
          { step: 'Styling Session', date: formatDate(requestedDate, requestedDate), completed: false },
          { step: 'Completed', date: '', completed: false },
        ],
        createdAt: nowIso,
        submittedAt: nowIso,
      };

      const response = await apiClient.post('/bookings', newBooking);
      if (!response || response.status >= 400) {
        throw new Error(response?.error || 'Failed to submit booking request. Please try again.');
      }

      setBookings((prev) => [newBooking, ...prev]);

      // Notify Designer
      const designerNotif = {
        id: `notif-des-${Date.now()}`,
        type: 'booking',
        role: 'designer',
        title: 'New Booking Request!',
        message: `${newBooking.customerName} submitted a booking request (#${newBooking.id}) for ${newBooking.occasion} on ${formatDate(newBooking.date, newBooking.date)} at ${newBooking.startTime}.`,
        timestamp: nowIso,
        read: false,
        bookingId: newBooking.id,
        link: '/designer/booking-requests',
      };
      setDesignerNotifications((prev) => [designerNotif, ...prev]);

      // Notify Customer
      const customerNotif = {
        id: `notif-cust-${Date.now() + 1}`,
        type: 'booking',
        role: 'customer',
        title: 'Booking Request Submitted',
        message: `Your request (#${newBooking.id}) with ${newBooking.designerName} for ${formatDate(newBooking.date, newBooking.date)} at ${newBooking.startTime} is pending designer approval.`,
        timestamp: nowIso,
        read: false,
        bookingId: newBooking.id,
        link: `/customer/bookings/${newBooking.id}`,
      };
      setCustomerNotifications((prev) => [customerNotif, ...prev]);

      setBookingConfirmation(newBooking);
      return newBooking;
    },
    []
  );

  /**
   * 2. DESIGNER ACCEPTS REQUEST
   * Status changes to 'Awaiting Payment'. Makes 30% advance payable by customer.
   */
  const acceptBookingRequest = useCallback(
    (bookingId) => {
      const nowIso = new Date().toISOString();
      setBookings((prev) =>
        prev.map((b) => {
          if (b.id !== bookingId) return b;
          return {
            ...b,
            status: 'Awaiting Payment',
            updatedAt: nowIso,
            timeline: (b.timeline || []).map((item) => {
              if (item.step === 'Designer Confirmation' || item.step === 'Designer Approval') {
                return { ...item, date: 'Accepted just now', completed: true, active: false };
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
        type: 'booking',
        role: 'customer',
        title: 'Booking Request Accepted! 🎉',
        message: `${designerName} accepted your request (#${bookingId}) for ${target?.occasion || 'Styling'}. Pay 30% advance (₹${target?.advanceAmount || 300}) to confirm your booking.`,
        timestamp: nowIso,
        read: false,
        bookingId,
        link: `/customer/bookings/${bookingId}`,
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
      const nowIso = new Date().toISOString();
      setBookings((prev) =>
        prev.map((b) => {
          if (b.id !== bookingId) return b;
          return {
            ...b,
            status: 'Declined',
            declineReason: reason,
            updatedAt: nowIso,
            timeline: (b.timeline || []).map((item) => {
              if (item.step === 'Designer Confirmation' || item.step === 'Designer Approval') {
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
        type: 'booking',
        role: 'customer',
        title: 'Booking Request Update',
        message: `${target?.designerName || 'Designer'} was unable to accept booking #${bookingId}: ${reason}`,
        timestamp: nowIso,
        read: false,
        bookingId,
        link: `/customer/bookings/${bookingId}`,
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
      const nowIso = new Date().toISOString();
      setBookings((prev) =>
        prev.map((b) => {
          if (b.id !== bookingId) return b;
          return {
            ...b,
            status: 'Alternative Proposed',
            proposedDate,
            proposedTime,
            designerNote: note,
            updatedAt: nowIso,
            timeline: (b.timeline || []).map((item) => {
              if (item.step === 'Designer Confirmation' || item.step === 'Designer Approval') {
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
        type: 'booking',
        role: 'customer',
        title: 'Alternative Slot Proposed',
        message: `${target?.designerName || 'Designer'} suggested an alternative slot for #${bookingId}: ${formatDate(proposedDate, proposedDate)} at ${proposedTime}.`,
        timestamp: nowIso,
        read: false,
        bookingId,
        link: `/customer/bookings/${bookingId}`,
      };
      setCustomerNotifications((prev) => [notif, ...prev]);

      addToast(`Alternative slot proposed for booking #${bookingId}.`, 'success');
    },
    [bookings, addToast]
  );

  /**
   * 5. CUSTOMER PAYS 30% ADVANCE PAYMENT
   * Only accessible AFTER designer confirms. Changes status to 'Confirmed'.
   */
  const payAdvancePayment = useCallback(
    (bookingId, paymentMethod = 'UPI') => {
      const nowIso = new Date().toISOString();
      setBookings((prev) =>
        prev.map((b) => {
          if (b.id !== bookingId) return b;
          return {
            ...b,
            status: 'Confirmed',
            paymentStatus: 'Advance Paid (30%)',
            paymentMethod,
            totalPaid: b.advanceAmount || 300,
            advancePaidAt: nowIso,
            updatedAt: nowIso,
            timeline: (b.timeline || []).map((item) => {
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
        type: 'payment',
        role: 'designer',
        title: '30% Advance Received! 💳',
        message: `${target?.customerName || 'Customer'} paid 30% advance (₹${advance}) for booking #${bookingId}. The styling session is confirmed.`,
        timestamp: nowIso,
        read: false,
        bookingId,
        link: '/designer/bookings',
      };
      setDesignerNotifications((prev) => [desNotif, ...prev]);

      // Notify Customer
      const custNotif = {
        id: `notif-cust-${Date.now() + 1}`,
        type: 'booking',
        role: 'customer',
        title: 'Appointment Confirmed! 🎉',
        message: `Advance payment verified. Your appointment with ${target?.designerName || 'Designer'} on ${formatDate(target?.date, target?.date || 'Date')} is confirmed. Remaining 70% (₹${target?.remainingAmount || 700}) is payable after the session.`,
        timestamp: nowIso,
        read: false,
        bookingId,
        link: `/customer/bookings/${bookingId}`,
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
      const nowIso = new Date().toISOString();
      const target = bookings.find((b) => b.id === bookingId);
      setBookings((prev) =>
        prev.map((b) => {
          if (b.id !== bookingId) return b;
          return {
            ...b,
            status: 'Cancelled',
            cancelReason: reason,
            updatedAt: nowIso,
            paymentStatus: b.paymentStatus === 'Advance Paid (30%)' ? 'Refund Initiated' : 'Cancelled',
          };
        })
      );

      const custNotif = {
        id: `notif-cust-${Date.now()}`,
        type: 'booking',
        role: 'customer',
        title: 'Booking Cancelled',
        message: `Booking #${bookingId} with ${target?.designerName || 'Designer'} has been cancelled.`,
        timestamp: nowIso,
        read: false,
        bookingId,
        link: `/customer/bookings/${bookingId}`,
      };
      setCustomerNotifications((prev) => [custNotif, ...prev]);

      addToast(`Booking #${bookingId} cancelled.`, 'info');
    },
    [bookings, addToast]
  );

  /**
   * 7. COMPLETE SESSION (Designer marks complete)
   */
  const completeBooking = useCallback(
    (bookingId) => {
      const nowIso = new Date().toISOString();
      const target = bookings.find((b) => b.id === bookingId);
      setBookings((prev) =>
        prev.map((b) => {
          if (b.id !== bookingId) return b;
          return {
            ...b,
            status: 'Completed',
            paymentStatus: 'Fully Paid',
            totalPaid: b.designerFee || b.amount || 999,
            updatedAt: nowIso,
            timeline: (b.timeline || []).map((item) => ({ ...item, completed: true, active: false })),
          };
        })
      );

      const custNotif = {
        id: `notif-cust-${Date.now()}`,
        type: 'booking',
        role: 'customer',
        title: 'Session Completed',
        message: `Your styling session #${bookingId} with ${target?.designerName || 'your designer'} is marked as completed.`,
        timestamp: nowIso,
        read: false,
        bookingId,
        link: `/customer/bookings/${bookingId}`,
      };
      setCustomerNotifications((prev) => [custNotif, ...prev]);

      addToast(`Styling session #${bookingId} marked as completed!`, 'success');
    },
    [bookings, addToast]
  );

  /**
   * 8. RESCHEDULE SESSION
   */
  const rescheduleBooking = useCallback(
    (bookingId, newDate, newTime) => {
      const nowIso = new Date().toISOString();
      setBookings((prev) =>
        prev.map((b) => {
          if (b.id !== bookingId) return b;
          return {
            ...b,
            date: newDate,
            time: newTime,
            startTime: newTime,
            status: 'Rescheduled',
            updatedAt: nowIso,
          };
        })
      );

      const custNotif = {
        id: `notif-cust-${Date.now()}`,
        type: 'booking',
        role: 'customer',
        title: 'Booking Rescheduled',
        message: `Booking #${bookingId} rescheduled to ${formatDate(newDate, newDate)} at ${newTime}.`,
        timestamp: nowIso,
        read: false,
        bookingId,
        link: `/customer/bookings/${bookingId}`,
      };
      setCustomerNotifications((prev) => [custNotif, ...prev]);

      addToast('Booking successfully rescheduled! Stylist notified.', 'success');
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
        bookingConfirmation,
        clearBookingConfirmation,
        createBookingRequest,
        acceptBookingRequest,
        rejectBookingRequest,
        proposeAlternativeSlot,
        payAdvancePayment,
        cancelBooking,
        completeBooking,
        rescheduleBooking,
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
