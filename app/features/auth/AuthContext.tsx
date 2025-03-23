import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { router } from 'expo-router';
import { useAppDispatch } from '../../../store/hooks';
import { createOrUpdateUser, fetchBusiness } from '../../../store/slices/userSlice';
import { auth } from '../../../firebase/config';
import { GoogleAuthProvider, signInWithCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
  name: string;
  photo?: string;
  role: 'customer' | 'business';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (userData?: any) => Promise<void>;
  signOut: () => Promise<void>;
  emailPasswordSignIn: (email: string, password: string) => Promise<void>;
  emailPasswordSignUp: (name: string, email: string, password: string, role: 'customer' | 'business') => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback: (notification: any) => void) => void;
          renderButton: (parent: HTMLElement, config: any) => void;
          cancel: () => void;
          revoke: (userId: string, callback: () => void) => void;
        };
      };
    };
  }
}

const USER_STORAGE_KEY = '@user_data';
const SELECTED_USER_TYPE_KEY = 'selected_user_type';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  // Load stored user data when app starts
  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        // Optionally refresh the user data from Firestore
        dispatch(createOrUpdateUser(userData));
        
        // If user is a business owner, also load their business data
        if (userData.role === 'business') {
          dispatch(fetchBusiness(userData.id));
        }
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const persistUser = async (userData: User) => {
    try {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  };

  useEffect(() => {
    if (Platform.OS === 'web') {
      // Load the Google Identity Services script
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      script.onload = () => {
        window.google?.accounts.id.initialize({
          client_id: '57102764070-q106sapm1qn0rh33qrgqlpjnha9hpu0r.apps.googleusercontent.com',
          callback: handleCredentialResponse,
          auto_select: false,
          use_fedcm_for_prompt: true
        });
      };
    }
  }, []);

  // Replace the prompt method with modern FedCM-compatible approach
  const initiateGoogleSignIn = () => {
    try {
      setError(null);
      setIsLoading(true);
      
      if (Platform.OS === 'web' && window.google) {
        // Use the FedCM-compatible method
        window.google.accounts.id.prompt((notification) => {
          if (notification.isSkippedMoment()) {
            setError('Sign-in was skipped. Please try again.');
            setIsLoading(false);
          } else if (notification.isDismissedMoment()) {
            setError(null);
            setIsLoading(false);
          }
        });
      }
    } catch (error: any) {
      console.error('Error initiating sign in:', error);
      setError(error.message || 'Failed to initiate sign in');
      setIsLoading(false);
    }
  };

  const handleCredentialResponse = async (response: any) => {
    try {
      setError(null);
      setIsLoading(true);
      
      // First sign in with Firebase
      const credential = GoogleAuthProvider.credential(response.credential);
      const result = await signInWithCredential(auth, credential);

      if (!result.user) {
        throw new Error('Failed to sign in with Firebase');
      }

      // Decode the JWT token for additional user info
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );

      const { email, name, picture } = JSON.parse(jsonPayload);

      // Get the best available photo URL:
      // 1. Try Firebase auth photoURL first
      // 2. Fall back to picture from token
      // Make sure it's a larger size for Google photos
      let photoUrl = result.user.photoURL || picture || '';

      if (photoUrl && photoUrl.includes('googleusercontent.com') && photoUrl.includes('=')) {
        // For Google profile photos, use a larger size (s400 instead of default s96)
        photoUrl = photoUrl.split('=')[0] + '=s400-c';
      }

      // Get the user type from AsyncStorage
      const selectedUserType = await AsyncStorage.getItem(SELECTED_USER_TYPE_KEY) || 'customer';
      console.log('Selected user type from AsyncStorage:', selectedUserType);

      const userData: User = {
        id: result.user.uid,
        email: result.user.email || email || '',
        name: result.user.displayName || name || 'User',
        photo: photoUrl,
        role: selectedUserType as 'customer' | 'business',
      };

      console.log('User data being saved with role:', userData.role);

      // Save user data to Firestore
      await dispatch(createOrUpdateUser(userData)).unwrap();
      await persistUser(userData); // Store user data
      setUser(userData);
      
      try {
        // If user is a business owner, check if they need to complete business setup
        if (userData.role === 'business') {
          // Fetch business data to check if it exists
          const businessResponse = await dispatch(fetchBusiness(userData.id)).unwrap();
          
          if (businessResponse) {
            // Business already exists, go to main app
            router.replace('/(app)');
          } else {
            // Business doesn't exist yet, go to business setup
            router.replace('/business-setup');
          }
        } else {
          // Regular customer, go to main app
          router.replace('/(app)');
        }
      } catch (businessError) {
        console.warn('Error checking business data:', businessError);
        // If there's any issue fetching business data,
        // assume we need to create the business profile
        if (userData.role === 'business') {
          router.replace('/business-setup');
        } else {
          router.replace('/(app)');
        }
      }
    } catch (error: any) {
      console.error('Error handling credential response:', error);
      setError(error.message || 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (userData?: any) => {
    try {
      setError(null);
      setIsLoading(true);
      
      if (userData) {
        console.log('Mobile sign in data received:', userData);
        // Handle direct user data (from mobile flow)
        const userInfo: User = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          photo: userData.photoUrl || userData.picture,
          role: userData.role || 'customer', // Get role from passed data
        };

        // Save user data to Firestore
        await dispatch(createOrUpdateUser(userInfo)).unwrap();
        await persistUser(userInfo); // Store user data
        setUser(userInfo);
        
        // If user is a business owner, check if they need to complete business setup
        if (userInfo.role === 'business') {
          // Fetch business data to check if it exists
          const businessResponse = await dispatch(fetchBusiness(userInfo.id)).unwrap();
          
          if (businessResponse) {
            // Business already exists, go to main app
            router.replace('/(app)');
          } else {
            // Business doesn't exist yet, go to business setup
            router.replace('/business-setup');
          }
        } else {
          // Regular customer, go to main app
          router.replace('/(app)');
        }
      } else if (Platform.OS === 'web' && window.google) {
        // For web, just trigger the prompt again
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed()) {
            console.error(
              'Google Sign-In prompt not displayed:',
              notification.getNotDisplayedReason()
            );
            setError('Google Sign-In failed to display. Please try again.');
          }
        });
      }
    } catch (error: any) {
      console.error('Error signing in:', error);
      setError(error.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const emailPasswordSignIn = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const result = await signInWithEmailAndPassword(auth, email, password);
      const userId = result.user.uid;
      
      // Fetch the user data from Firestore
      const userResponse = await dispatch(createOrUpdateUser({
        id: userId,
        email: email,
        name: result.user.displayName || email.split('@')[0], // Use part of email as name if no display name
        role: 'customer' // Will be updated from Firestore if different
      })).unwrap();
      
      await persistUser(userResponse); // Store user data
      setUser(userResponse);
      
      // If user is a business owner, also load their business data
      if (userResponse.role === 'business') {
        dispatch(fetchBusiness(userResponse.id));
      }
      
      router.replace('/(app)');
    } catch (error: any) {
      console.error('Error signing in with email/password:', error);
      setError(error.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const emailPasswordSignUp = async (name: string, email: string, password: string, role: 'customer' | 'business' = 'customer') => {
    try {
      setError(null);
      setIsLoading(true);
      
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const userId = result.user.uid;
      
      // Create the user in Firestore
      const userResponse = await dispatch(createOrUpdateUser({
        id: userId,
        email: email,
        name: name,
        role: role
      })).unwrap();
      
      await persistUser(userResponse); // Store user data
      setUser(userResponse);
      
      // If registering as business, redirect to business setup
      if (role === 'business') {
        router.replace('/business-setup');
      } else {
        router.replace('/(app)');
      }
    } catch (error: any) {
      console.error('Error signing up with email/password:', error);
      setError(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      if (Platform.OS === 'web' && window.google && user) {
        window.google.accounts.id.cancel();
        window.google.accounts.id.revoke(user.id, async () => {
          await handleSignOut();
        });
      } else {
        await handleSignOut();
      }
    } catch (error: any) {
      console.error('Error during sign out:', error);
      setError(error.message || 'Failed to sign out');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await auth.signOut();
    await AsyncStorage.removeItem(USER_STORAGE_KEY); // Remove stored user data
    setUser(null);
    router.replace('/(auth)');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      signIn, 
      signOut, 
      emailPasswordSignIn, 
      emailPasswordSignUp,
      error 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
