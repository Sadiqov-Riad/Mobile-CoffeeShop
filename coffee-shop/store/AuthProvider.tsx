import React, { createContext, useContext, useEffect } from 'react';
import { AuthUser } from './authService';
import { useZustandAuth } from './zustand/authStore';

// =====================================================
// Unified Auth Interface
// =====================================================
interface UnifiedAuthContext {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, name: string, password: string) => Promise<boolean>;
  updateName: (name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<UnifiedAuthContext | null>(null);

// =====================================================
// Zustand Provider Component
// =====================================================
function ZustandAuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useZustandAuth();

  useEffect(() => {
    auth.initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: UnifiedAuthContext = {
    user: auth.user,
    isLoading: auth.isLoading,
    isAuthenticated: auth.isAuthenticated,
    error: auth.error,
    login: auth.login,
    register: auth.register,
    updateName: auth.updateName,
    logout: auth.logout,
    clearError: auth.clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <ZustandAuthProvider>{children}</ZustandAuthProvider>;
}

// =====================================================
// Hook to use auth
// =====================================================
export function useAuth(): UnifiedAuthContext {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
