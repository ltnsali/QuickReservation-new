import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Reservation {
  id: string;
  name: string;
  date: string;
  time: string;
  notes: string;
  createdAt: string;
}

interface ReservationState {
  reservations: Reservation[];
}

const initialState: ReservationState = {
  reservations: [],
};

const reservationSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {
    addReservation: (state, action: PayloadAction<Reservation>) => {
      state.reservations.push(action.payload);
    },
    deleteReservation: (state, action: PayloadAction<string>) => {
      state.reservations = state.reservations.filter(
        reservation => reservation.id !== action.payload
      );
    },
  },
});

export const { addReservation, deleteReservation } = reservationSlice.actions;
export default reservationSlice.reducer;
