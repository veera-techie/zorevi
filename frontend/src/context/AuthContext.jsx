import { createContext, useContext, useState, useCallback } from 'react';
import { mockAuthUsers } from '../services/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock sign-in: accepts any email/password and logs in as the given role.
  // This is NOT production security – replace with real auth later.
  const login = useCallback(async (role, email, _password) => {
    setIsLoading(true);
    // Simulate network delay
    await new Promise(r => setTimeout(r, 600));
    const mockUser = mockAuthUsers[role];
    if (mockUser) {
      const activeUser = email ? { ...mockUser, email: email.includes('@') ? email : mockUser.email } : mockUser;
      setUser(activeUser);
      setIsLoading(false);
      return { success: true, user: activeUser };
    }
    setIsLoading(false);
    return { success: false, error: 'Invalid credentials' };
  }, []);

  // Mock registration: creates user session with given name/email
  const register = useCallback(async (role = 'customer', userData = {}) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const baseUser = mockAuthUsers[role] || mockAuthUsers.customer;
    const newUser = {
      ...baseUser,
      name: userData?.name || baseUser.name,
      email: userData?.email || baseUser.email,
      avatar: userData?.avatar || '/images/customer-praveen.png',
    };
    setUser(newUser);
    setIsLoading(false);
    return { success: true, user: newUser };
  }, []);

  // Mock Google sign-in
  const loginWithGoogle = useCallback(async (role = 'customer') => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const baseUser = mockAuthUsers[role] || mockAuthUsers.customer;
    const googleUser = {
      ...baseUser,
      name: baseUser.name || 'Praveen Kumar',
      email: 'praveen.kumar@gmail.com',
      avatar: '/images/customer-praveen.png',
    };
    setUser(googleUser);
    setIsLoading(false);
    return { success: true, user: googleUser };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const isAuthenticated = !!user;
  const isCustomer = user?.role === 'customer';
  const isDesigner = user?.role === 'designer';
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated,
      isCustomer,
      isDesigner,
      isAdmin,
      login,
      register,
      loginWithGoogle,
      logout,
      setUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

