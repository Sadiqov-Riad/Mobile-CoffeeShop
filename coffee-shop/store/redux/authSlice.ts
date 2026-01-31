// =====================================================
// REDUX AUTH SLICE
// =====================================================
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    AuthUser,
    loadCurrentUser,
    loginUser,
    logoutUser as logoutUserService,
    registerUser,
    saveCurrentUser,
} from '../authService';

interface ReduxAuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: ReduxAuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
};

// Async Thunks
export const initializeAuth = createAsyncThunk('auth/initialize', async () => {
  const user = await loadCurrentUser();
  return user;
});

export const loginAsync = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    const result = await loginUser(email, password);
    if (result.success && result.user) {
      await saveCurrentUser(result.user);
      return result.user;
    } else {
      return rejectWithValue(result.error || 'Login failed');
    }
  }
);

export const registerAsync = createAsyncThunk(
  'auth/register',
  async (
    { email, name, password }: { email: string; name: string; password: string },
    { rejectWithValue }
  ) => {
    const result = await registerUser(email, name, password);
    if (result.success && result.user) {
      await saveCurrentUser(result.user);
      return result.user;
    } else {
      return rejectWithValue(result.error || 'Registration failed');
    }
  }
);

export const logoutAsync = createAsyncThunk('auth/logout', async () => {
  await logoutUserService();
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Initialize
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action: PayloadAction<AuthUser | null>) => {
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
        state.isLoading = false;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      });

    // Login
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action: PayloadAction<AuthUser>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      });

    // Register
    builder
      .addCase(registerAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action: PayloadAction<AuthUser>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      });

    // Logout
    builder.addCase(logoutAsync.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
    });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
