import { db } from './config';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { Reservation } from '../store/slices/reservationSlice';

const RESERVATIONS_COLLECTION = 'reservations';

export const saveReservationToFirestore = async (reservation: Reservation) => {
  try {
    const docRef = await addDoc(collection(db, RESERVATIONS_COLLECTION), reservation);
    return { ...reservation, id: docRef.id };
  } catch (error) {
    console.error('Error saving reservation:', error);
    throw error;
  }
};

export const deleteReservationFromFirestore = async (id: string) => {
  try {
    await deleteDoc(doc(db, RESERVATIONS_COLLECTION, id));
    return true;
  } catch (error) {
    console.error('Error deleting reservation:', error);
    throw error;
  }
};

export const loadReservationsFromFirestore = async (): Promise<Reservation[]> => {
  try {
    const q = query(collection(db, RESERVATIONS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...(doc.data() as Omit<Reservation, 'id'>),
      id: doc.id,
    }));
  } catch (error) {
    console.error('Error loading reservations:', error);
    throw error;
  }
};
