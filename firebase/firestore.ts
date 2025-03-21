import { db } from './config';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, where } from 'firebase/firestore';
import { Reservation } from '../store/slices/reservationSlice';

const RESERVATIONS_COLLECTION = 'reservations';

export const saveReservationToFirestore = async (reservation: Omit<Reservation, 'id'>) => {
  try {
    if (!reservation.userId) {
      throw new Error('userId is required for creating a reservation');
    }

    const reservationData = {
      userId: reservation.userId,
      name: reservation.name,
      date: reservation.date,
      time: reservation.time,
      notes: reservation.notes,
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, RESERVATIONS_COLLECTION), reservationData);
    return { ...reservationData, id: docRef.id };
  } catch (error) {
    console.error('Error saving reservation:', error);
    throw error;
  }
};

export const deleteReservationFromFirestore = async (id: string, userId: string) => {
  try {
    // First verify that this reservation belongs to the user
    const reservationRef = doc(db, RESERVATIONS_COLLECTION, id);
    const q = query(collection(db, RESERVATIONS_COLLECTION), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const reservation = querySnapshot.docs.find(doc => doc.id === id);

    if (!reservation) {
      throw new Error('Reservation not found or unauthorized');
    }

    await deleteDoc(reservationRef);
    return true;
  } catch (error) {
    console.error('Error deleting reservation:', error);
    throw error;
  }
};

export const loadReservationsFromFirestore = async (userId: string): Promise<Reservation[]> => {
  try {
    const q = query(
      collection(db, RESERVATIONS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
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
