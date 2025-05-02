import { db } from './config';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, query, where, orderBy, Timestamp, deleteDoc } from 'firebase/firestore';

const RESERVATIONS_COLLECTION = 'reservations';

export interface Reservation {
  id: string;
  businessId: string;
  customerId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Get all reservations for a business
export const getBusinessReservations = async (businessId: string): Promise<Reservation[]> => {
  try {
    const q = query(
      collection(db, RESERVATIONS_COLLECTION),
      where('businessId', '==', businessId),  // Filter by business ID
      orderBy('date', 'asc'),                 // Sort by date ascending
      orderBy('time', 'asc')                  // Then sort by time ascending
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Convert Firestore timestamps to strings if needed
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
      } as Reservation;
    });
  } catch (error) {
    console.error('Error fetching business reservations:', error);
    throw error;
  }
};

// Get all reservations for a customer
export const getCustomerReservations = async (customerId: string): Promise<Reservation[]> => {
  try {
    const q = query(
      collection(db, RESERVATIONS_COLLECTION),
      where('customerId', '==', customerId),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Convert Firestore timestamps to strings if needed
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
      } as Reservation;
    });
  } catch (error) {
    console.error('Error fetching customer reservations:', error);
    throw error;
  }
};

// Create a new reservation
export const createReservation = async (reservationData: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Reservation> => {
  try {
    const now = new Date().toISOString();
    const newReservation = {
      ...reservationData,
      createdAt: now,
      updatedAt: now,
    };
    
    const docRef = await addDoc(collection(db, RESERVATIONS_COLLECTION), newReservation);
    
    return {
      id: docRef.id,
      ...newReservation,
    } as Reservation;
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
};

// Update a reservation
export const updateReservation = async (id: string, updateData: Partial<Reservation>): Promise<Reservation> => {
  try {
    const reservationRef = doc(db, RESERVATIONS_COLLECTION, id);
    const reservationDoc = await getDoc(reservationRef);
    
    if (!reservationDoc.exists()) {
      throw new Error('Reservation not found');
    }
    
    const updatedData = {
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    
    await updateDoc(reservationRef, updatedData);
    
    const updatedDoc = await getDoc(reservationRef);
    return {
      id: updatedDoc.id,
      ...updatedDoc.data()
    } as Reservation;
  } catch (error) {
    console.error('Error updating reservation:', error);
    throw error;
  }
};

// Delete a reservation
export const deleteReservation = async (id: string): Promise<void> => {
  try {
    const reservationRef = doc(db, RESERVATIONS_COLLECTION, id);
    await deleteDoc(reservationRef);
  } catch (error) {
    console.error('Error deleting reservation:', error);
    throw error;
  }
};

// Save a reservation to Firestore
export const saveReservationToFirestore = async (reservationInput: { 
  userId: string;  // From the app
  customerName: string;
  businessId: string;
  date: string;
  time: string;
  notes?: string;
}) => {
  try {
    if (!reservationInput.userId) {
      throw new Error('userId is required for creating a reservation');
    }

    const reservationData = {
      customerId: reservationInput.userId,
      customerName: reservationInput.customerName,
      businessId: reservationInput.businessId,
      date: reservationInput.date,
      time: reservationInput.time,
      notes: reservationInput.notes,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, RESERVATIONS_COLLECTION), reservationData);
    return { ...reservationData, id: docRef.id } as Reservation;
  } catch (error) {
    console.error('Error saving reservation:', error);
    throw error;
  }
};

// Delete a reservation from Firestore
export const deleteReservationFromFirestore = async (id: string, userId: string) => {
  try {
    // First verify that this reservation belongs to the user
    const reservationRef = doc(db, RESERVATIONS_COLLECTION, id);
    const q = query(collection(db, RESERVATIONS_COLLECTION), where('customerId', '==', userId));
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

// Load reservations from Firestore
export const loadReservationsFromFirestore = async (userId: string): Promise<Reservation[]> => {
  try {
    if (!userId) {
      throw new Error('User ID is required to load reservations');
    }
    
    console.log('Loading reservations for userId:', userId);
    
    // Try a simpler approach - get all reservations first, then filter client-side
    // This works around potential permission issues by fetching all accessible documents
    try {
      const allReservationsRef = collection(db, RESERVATIONS_COLLECTION);
      const snapshot = await getDocs(allReservationsRef);
      console.log(`Found ${snapshot.docs.length} total reservations`);
      
      // Filter client-side for reservations belonging to this user
      // This works with any field name (userId, customerId, etc.)
      const userReservations = snapshot.docs
        .filter(doc => {
          const data = doc.data();
          return data.userId === userId || 
                 data.customerId === userId || 
                 (data.user && data.user.id === userId);
        })
        .map(doc => ({
          ...(doc.data() as Omit<Reservation, 'id'>),
          id: doc.id,
        }));
      
      console.log(`After filtering, found ${userReservations.length} reservations for user`);
      return userReservations;
    } catch (error) {
      console.error('Error getting all reservations:', error);
      
      // If the above approach fails, try direct queries as fallback
      // First try querying by customerId
      try {
        const customerQuery = query(
          collection(db, RESERVATIONS_COLLECTION),
          where('customerId', '==', userId)
        );
        
        const customerSnapshot = await getDocs(customerQuery);
        console.log(`Found ${customerSnapshot.docs.length} reservations by customerId`);
        
        if (customerSnapshot.docs.length > 0) {
          return customerSnapshot.docs.map(doc => ({
            ...(doc.data() as Omit<Reservation, 'id'>),
            id: doc.id,
          }));
        }
      } catch (customerError) {
        console.error('Error querying by customerId:', customerError);
      }
      
      // Then try querying by userId if customerId fails
      try {
        const userQuery = query(
          collection(db, RESERVATIONS_COLLECTION),
          where('userId', '==', userId)
        );
        
        const userSnapshot = await getDocs(userQuery);
        console.log(`Found ${userSnapshot.docs.length} reservations by userId`);
        
        if (userSnapshot.docs.length > 0) {
          return userSnapshot.docs.map(doc => ({
            ...(doc.data() as Omit<Reservation, 'id'>),
            id: doc.id,
          }));
        }
      } catch (userError) {
        console.error('Error querying by userId:', userError);
      }
      
      // If all attempts fail, re-throw the original error
      throw error;
    }
  } catch (error) {
    console.error('Error loading reservations:', error);
    // Create a more user-friendly error message
    if (error instanceof Error) {
      if (error.message.includes('permission')) {
        throw new Error(`Unable to access reservations. Please check your account permissions. (User ID: ${userId})`);
      }
      throw new Error(`Failed to load reservations: ${error.message}`);
    }
    throw error;
  }
};
