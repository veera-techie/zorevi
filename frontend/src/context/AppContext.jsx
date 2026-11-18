import { createContext, useContext, useState, useCallback } from 'react';
import { mockCustomerNotifications, mockDesignerNotifications, mockAdminNotifications, mockWishlist } from '../services/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [wishlist, setWishlist] = useState(mockWishlist);
  const [customerNotifications, setCustomerNotifications] = useState(mockCustomerNotifications);
  const [designerNotifications, setDesignerNotifications] = useState(mockDesignerNotifications);
  const [adminNotifications, setAdminNotifications] = useState(mockAdminNotifications);
  const [selectedCity, setSelectedCity] = useState('Hyderabad');

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toggleWishlist = useCallback((type, itemId) => {
    setWishlist(prev => {
      const exists = prev.find(w => w.type === type && w.itemId === itemId);
      if (exists) {
        return prev.filter(w => w.id !== exists.id);
      }
      return [...prev, { id: `wish-${Date.now()}`, type, itemId, addedAt: new Date().toISOString() }];
    });
  }, []);

  const isInWishlist = useCallback((type, itemId) => {
    return wishlist.some(w => w.type === type && w.itemId === itemId);
  }, [wishlist]);

  const markNotificationRead = useCallback((role, notifId) => {
    const setter = role === 'customer' ? setCustomerNotifications :
                   role === 'designer' ? setDesignerNotifications : setAdminNotifications;
    setter(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback((role) => {
    const setter = role === 'customer' ? setCustomerNotifications :
                   role === 'designer' ? setDesignerNotifications : setAdminNotifications;
    setter(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const getUnreadCount = useCallback((role) => {
    const notifs = role === 'customer' ? customerNotifications :
                   role === 'designer' ? designerNotifications : adminNotifications;
    return notifs.filter(n => !n.read).length;
  }, [customerNotifications, designerNotifications, adminNotifications]);

  return (
    <AppContext.Provider value={{
      toasts,
      addToast,
      removeToast,
      wishlist,
      toggleWishlist,
      isInWishlist,
      customerNotifications,
      designerNotifications,
      adminNotifications,
      markNotificationRead,
      markAllNotificationsRead,
      getUnreadCount,
      selectedCity,
      setSelectedCity,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

