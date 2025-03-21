import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { saveUserToFirestore, loadUserFromFirestore } from '../../firebase/users';

export interface User {
  id: string;
  email: string;
  name: string;
  photo?: string;
  createdAt: string;
  lastLoginAt: string;
}

interface UserState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
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

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.currentUser = null;
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
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer; 