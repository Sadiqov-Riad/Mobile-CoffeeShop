// =====================================================
// ZUSTAND AUTH STORE
// =====================================================
import { create } from 'zustand';
import {
    AuthUser,
    loadCurrentUser,
    loginUser,
    logoutUser,
    registerUser,
    saveCurrentUser,
    updateCurrentUserName,
} from '../authService';

interface ZustandAuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, name: string, password: string) => Promise<boolean>;
  updateName: (name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useZustandAuth = create<ZustandAuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,

  initialize: async () => {
    set({ isLoading: true });
    try {
      const user = await loadCurrentUser();
      set({ user, isAuthenticated: !!user, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const result = await loginUser(email, password);
      if (result.success && result.user) {
        await saveCurrentUser(result.user);
        set({ user: result.user, isAuthenticated: true, isLoading: false });
        return true;
      } else {
        set({ error: result.error || 'Login failed', isLoading: false });
        return false;
      }
    } catch {
      set({ error: 'An error occurred', isLoading: false });
      return false;
    }
  },

  register: async (email, name, password) => {
    set({ isLoading: true, error: null });
    try {
      const result = await registerUser(email, name, password);
      if (result.success && result.user) {
        await saveCurrentUser(result.user);
        set({ user: result.user, isAuthenticated: true, isLoading: false });
        return true;
      } else {
        set({ error: result.error || 'Registration failed', isLoading: false });
        return false;
      }
    } catch {
      set({ error: 'An error occurred', isLoading: false });
      return false;
    }
  },

  updateName: async (name) => {
    set({ isLoading: true, error: null });
    try {
      const result = await updateCurrentUserName(name);
      if (result.success && result.user) {
        set({ user: result.user, isAuthenticated: true, isLoading: false });
        return true;
      }
      set({ error: result.error || 'Update failed', isLoading: false });
      return false;
    } catch {
      set({ error: 'An error occurred', isLoading: false });
      return false;
    }
  },

  logout: async () => {
    await logoutUser();
    set({ user: null, isAuthenticated: false });
  },

  clearError: () => set({ error: null }),
}));
