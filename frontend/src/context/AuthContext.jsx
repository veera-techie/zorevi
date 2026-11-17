import { createContext, useContext, useState, useCallback } from 'react';
import { mockAuthUsers } from '../services/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock sign-in: accepts any email/password and logs in as the given role.
  // This is NOT production security – replace with real auth later.
  const login = useCallback(async (role, _email, _password) => {
    setIsLoading(true);
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));
    const mockUser = mockAuthUsers[role];
    if (mockUser) {
      setUser(mockUser);
      setIsLoading(false);
      return { success: true, user: mockUser };
    }
    setIsLoading(false);
    return { success: false, error: 'Invalid credentials' };
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

