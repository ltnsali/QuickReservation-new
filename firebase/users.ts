import { db } from './config';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { User } from '../store/slices/userSlice';

const USERS_COLLECTION = 'users';

export const saveUserToFirestore = async (userData: Omit<User, 'createdAt'>): Promise<User> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userData.id);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // New user - create with createdAt timestamp
      const newUser: User = {
        ...userData,
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