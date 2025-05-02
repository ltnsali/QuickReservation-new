import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { saveUserToFirestore, loadUserFromFirestore, saveBusinessToFirestore, loadBusinessFromFirestore } from '../../firebase/users';

export interface User {
  id: string;
  email: string;
  name: string;
  photo?: string;
  role: 'customer' | 'business';
  createdAt: string;
  lastLoginAt: string;
}

export interface Business {
  id: string;
  ownerId: string; // connects to the User id
  name: string;
  description?: string;
  category?: string;
  address?: string;
  phone?: string;
  website?: string;
  photo?: string;
  operatingHours?: {
    monday?: { open: string; close: string; isOpen: boolean };
    tuesday?: { open: string; close: string; isOpen: boolean };
    wednesday?: { open: string; close: string; isOpen: boolean };
    thursday?: { open: string; close: string; isOpen: boolean };
    friday?: { open: string; close: string; isOpen: boolean };
    saturday?: { open: string; close: string; isOpen: boolean };
    sunday?: { open: string; close: string; isOpen: boolean };
  };
  createdAt: string;
  updatedAt: string;
}

interface UserState {
  currentUser: User | null;
  currentBusiness: Business | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  currentBusiness: null,
  loading: false,
  error: null,
};

export const createOrUpdateUser = createAsyncThunk(
  'user/createOrUpdate',
  async (userData: Omit<User, 'createdAt' | 'lastLoginAt'>) => {
    const user = await saveUserToFirestore({
      ...userData,
      lastLoginAt: new Date().toISOString(),
    });
    return user;
  }
);

export const fetchUser = createAsyncThunk(
  'user/fetch',
  async (userId: string) => {
    const user = await loadUserFromFirestore(userId);
    return user;
  }
);

export const createOrUpdateBusiness = createAsyncThunk(
  'user/createOrUpdateBusiness',
  async (businessData: Omit<Business, 'createdAt' | 'updatedAt'>) => {
    const business = await saveBusinessToFirestore({
      ...businessData,
      updatedAt: new Date().toISOString(),
    });
    return business;
  }
);

export const fetchBusiness = createAsyncThunk(
  'user/fetchBusiness',
  async (ownerId: string) => {
    const business = await loadBusinessFromFirestore(ownerId);
    return business;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.currentUser = null;
      state.currentBusiness = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create or Update User
      .addCase(createOrUpdateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrUpdateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(createOrUpdateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to save user data';
      })
      // Fetch User
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user data';
      })
      // Create or Update Business
      .addCase(createOrUpdateBusiness.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrUpdateBusiness.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBusiness = action.payload;
      })
      .addCase(createOrUpdateBusiness.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to save business data';
      })
      // Fetch Business
      .addCase(fetchBusiness.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusiness.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBusiness = action.payload;
      })
      .addCase(fetchBusiness.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch business data';
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;