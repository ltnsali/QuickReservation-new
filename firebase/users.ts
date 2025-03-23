import { db } from './config';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { User, Business } from '../store/slices/userSlice';

const USERS_COLLECTION = 'users';
const BUSINESS_COLLECTION = 'businesses';

export const saveUserToFirestore = async (userData: Omit<User, 'createdAt'>): Promise<User> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userData.id);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // New user - create with createdAt timestamp
      const newUser: User = {
        ...userData,
        role: userData.role || 'customer', // Default to customer role if not specified
        createdAt: new Date().toISOString(),
      };
      await setDoc(userRef, newUser);
      return newUser;
    } else {
      // Existing user - update lastLoginAt and other fields
      const updatedUser = {
        ...userDoc.data(),
        ...userData,
      };
      await updateDoc(userRef, updatedUser);
      return updatedUser as User;
    }
  } catch (error) {
    console.error('Error saving user:', error);
    throw error;
  }
};

export const loadUserFromFirestore = async (userId: string): Promise<User | null> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    return null;
  } catch (error) {
    console.error('Error loading user:', error);
    throw error;
  }
};

export const saveBusinessToFirestore = async (businessData: Omit<Business, 'createdAt'>): Promise<Business> => {
  try {
    // Create a new business doc or update existing one
    let businessId = businessData.id;
    let isNew = false;
    
    // If no ID provided, check if this owner already has a business
    if (!businessId) {
      const q = query(
        collection(db, BUSINESS_COLLECTION),
        where('ownerId', '==', businessData.ownerId)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Owner already has a business, use that ID
        businessId = querySnapshot.docs[0].id;
      } else {
        // Create new business with auto-generated ID
        businessId = doc(collection(db, BUSINESS_COLLECTION)).id;
        isNew = true;
      }
    }
    
    // Clean up the business data to remove undefined values
    // Firebase doesn't accept undefined values in documents
    const cleanedBusinessData: Record<string, any> = {};
    
    // Only add fields that are not undefined
    for (const [key, value] of Object.entries(businessData)) {
      if (value !== undefined) {
        cleanedBusinessData[key] = value;
      }
    }
    
    const businessRef = doc(db, BUSINESS_COLLECTION, businessId);
    const businessDoc = await getDoc(businessRef);

    if (!businessDoc.exists() || isNew) {
      // New business - create with createdAt timestamp
      const newBusiness: Business = {
        ...cleanedBusinessData,
        id: businessId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Business; // Use type assertion since we've cleaned the data
      
      await setDoc(businessRef, newBusiness);
      
      // Also update the user to have the business role if not already set
      const userRef = doc(db, USERS_COLLECTION, businessData.ownerId);
      await updateDoc(userRef, { role: 'business' });
      
      return newBusiness;
    } else {
      // Existing business - update fields
      const currentData = businessDoc.data();
      const updatedBusiness = {
        ...currentData,
        ...cleanedBusinessData,
        updatedAt: new Date().toISOString(),
      };
      
      await updateDoc(businessRef, updatedBusiness);
      return updatedBusiness as Business;
    }
  } catch (error) {
    console.error('Error saving business:', error);
    throw error;
  }
};

export const loadBusinessFromFirestore = async (ownerId: string): Promise<Business | null> => {
  try {
    const q = query(
      collection(db, BUSINESS_COLLECTION),
      where('ownerId', '==', ownerId)
    );
    
    // Using a try-catch specifically for the query execution to handle permission errors
    try {
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data() as Business;
      }
      
      // No business found, but not an error - user just doesn't have a business yet
      console.log('No business found for owner ID:', ownerId);
      return null;
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        console.warn('Permission denied accessing business data. Security rules may need updating.');
      }
      return null; // Return null instead of throwing, so app flow can continue
    }
  } catch (error) {
    console.error('Error loading business (general):', error);
    return null; // Return null to allow app flow to continue
  }
};

export const getBusinessById = async (businessId: string): Promise<Business | null> => {
  try {
    const businessRef = doc(db, BUSINESS_COLLECTION, businessId);
    const businessDoc = await getDoc(businessRef);
    
    if (businessDoc.exists()) {
      return businessDoc.data() as Business;
    }
    return null;
  } catch (error) {
    console.error('Error getting business by ID:', error);
    throw error;
  }
};

export const getAllBusinesses = async (): Promise<Business[]> => {
  try {
    const businessesRef = collection(db, BUSINESS_COLLECTION);
    const businessesSnapshot = await getDocs(businessesRef);
    
    return businessesSnapshot.docs.map(doc => doc.data() as Business);
  } catch (error) {
    console.error('Error loading businesses:', error);
    throw error;
  }
};