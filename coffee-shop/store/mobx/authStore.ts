// =====================================================
// MOBX AUTH STORE
// =====================================================
import { makeAutoObservable, runInAction } from 'mobx';
import {
    AuthUser,
    loadCurrentUser,
    loginUser,
    logoutUser,
    registerUser,
    saveCurrentUser,
} from '../authService';

class AuthStore {
  user: AuthUser | null = null;
  isLoading = true;
  isAuthenticated = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async initialize() {
    this.isLoading = true;
    try {
      const user = await loadCurrentUser();
      runInAction(() => {
        this.user = user;
        this.isAuthenticated = !!user;
        this.isLoading = false;
      });
    } catch {
      runInAction(() => {
        this.user = null;
        this.isAuthenticated = false;
        this.isLoading = false;
      });
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    this.isLoading = true;
    this.error = null;
    try {
      const result = await loginUser(email, password);
      if (result.success && result.user) {
        await saveCurrentUser(result.user);
        runInAction(() => {
          this.user = result.user!;
          this.isAuthenticated = true;
          this.isLoading = false;
        });
        return true;
      } else {
        runInAction(() => {
          this.error = result.error || 'Login failed';
          this.isLoading = false;
        });
        return false;
      }
    } catch {
      runInAction(() => {
        this.error = 'An error occurred';
        this.isLoading = false;
      });
      return false;
    }
  }

  async register(email: string, name: string, password: string): Promise<boolean> {
    this.isLoading = true;
    this.error = null;
    try {
      const result = await registerUser(email, name, password);
      if (result.success && result.user) {
        await saveCurrentUser(result.user);
        runInAction(() => {
          this.user = result.user!;
          this.isAuthenticated = true;
          this.isLoading = false;
        });
        return true;
      } else {
        runInAction(() => {
          this.error = result.error || 'Registration failed';
          this.isLoading = false;
        });
        return false;
      }
    } catch {
      runInAction(() => {
        this.error = 'An error occurred';
        this.isLoading = false;
      });
      return false;
    }
  }

  async logout() {
    await logoutUser();
    runInAction(() => {
      this.user = null;
      this.isAuthenticated = false;
    });
  }

  clearError() {
    this.error = null;
  }
}

export const mobxAuthStore = new AuthStore();
