import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
  saveReservationToFirestore,
  deleteReservationFromFirestore,
  loadReservationsFromFirestore,
} from '../../firebase/firestore';

export interface Reservation {
  id: string;
  userId: string;
  name: string;
  date: string;
  time: string;
  notes: string;
  createdAt: string;
}

interface ReservationState {
  reservations: Reservation[];
  loading: boolean;
  error: string | null;
}

const initialState: ReservationState = {
  reservations: [],
  loading: false,
  error: null,
};

// Async thunks for Firestore operations
export const fetchReservations = createAsyncThunk(
  'reservations/fetchReservations',
  async (userId: string) => {
    const reservations = await loadReservationsFromFirestore(userId);
    return reservations;
  }
);

export const addReservationAsync = createAsyncThunk(
  'reservations/addReservation',
  async ({ reservation, userId }: { reservation: Omit<Reservation, 'id' | 'userId' | 'createdAt'>, userId: string }) => {
    const reservationData = {
      ...reservation,
      userId,
      createdAt: new Date().toISOString()
    };
    const savedReservation = await saveReservationToFirestore(reservationData);
    return savedReservation;
  }
);

export const deleteReservationAsync = createAsyncThunk(
  'reservations/deleteReservation',
  async ({ id, userId }: { id: string; userId: string }) => {
    await deleteReservationFromFirestore(id, userId);
    return id;
  }
);

const reservationSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Fetch reservations
      .addCase(fetchReservations.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReservations.fulfilled, (state, action) => {
        state.loading = false;
        state.reservations = action.payload;
      })
      .addCase(fetchReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch reservations';
      })
      // Add reservation
      .addCase(addReservationAsync.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReservationAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.reservations.unshift(action.payload);
      })
      .addCase(addReservationAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add reservation';
      })
      // Delete reservation
      .addCase(deleteReservationAsync.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReservationAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.reservations = state.reservations.filter(
          reservation => reservation.id !== action.payload
        );
      })
      .addCase(deleteReservationAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete reservation';
      });
  },
});

export default reservationSlice.reducer;
