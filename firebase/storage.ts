import { storage } from './config';
import { ref, uploadString, getDownloadURL, listAll } from 'firebase/storage';
import { Reservation } from '../store/slices/reservationSlice';

export const saveReservationsToStorage = async (reservations: Reservation[]) => {
  try {
    const storageRef = ref(storage, 'reservations/data.json');
    await uploadString(storageRef, JSON.stringify(reservations));
    return true;
  } catch (error) {
    console.error('Error saving reservations:', error);
    return false;
  }
};

export const loadReservationsFromStorage = async (): Promise<Reservation[]> => {
  try {
    const storageRef = ref(storage, 'reservations/data.json');
    const url = await getDownloadURL(storageRef);
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading reservations:', error);
    return [];
  }
};
