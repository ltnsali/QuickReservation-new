import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { router } from 'expo-router';
import { useAppDispatch } from '../../../store/hooks';
import { createOrUpdateUser } from '../../../store/slices/userSlice';
import { auth } from '../../../firebase/config';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
  name: string;
  photo?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (userData?: any) => Promise<void>;
  signOut: () => Promise<void>;
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
          cancel_on_tap_outside: false,
          use_fedcm_for_prompt: false, // Disable FedCM
        });

        // Configure the button first
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'none';
        document.body.appendChild(buttonContainer);

        window.google?.accounts.id.renderButton(buttonContainer, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          width: 400,
        });

        // Then show the One Tap dialog
        window.google?.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed()) {
            console.log('One Tap dialog not displayed:', notification.getNotDisplayedReason());
            // If One Tap fails, we already have a rendered button as fallback
          } else if (notification.isSkippedMoment()) {
            console.log('One Tap dialog skipped:', notification.getSkippedReason());
          } else if (notification.isDismissedMoment()) {
            console.log('One Tap dialog dismissed:', notification.getDismissedReason());
          }
        });
      };
    }
    setIsLoading(false);
  }, []);

  const handleCredentialResponse = async (response: any) => {
    try {
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

      const userData: User = {
        id: result.user.uid,
        email: result.user.email || email || '',
        name: result.user.displayName || name || 'User',
        photo: photoUrl,
      };

      console.log('User data being saved:', userData);

      // Save user data to Firestore
      await dispatch(createOrUpdateUser(userData)).unwrap();
      await persistUser(userData); // Store user data
      setUser(userData);
      router.replace('/(app)');
    } catch (error) {
      console.error('Error handling credential response:', error);
    }
  };

  const signIn = async (userData?: any) => {
    if (userData) {
      console.log('Mobile sign in data received:', userData);
      // Handle direct user data (from mobile flow)
      const userInfo = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        photo: userData.photoUrl || userData.picture,
      };

      // Save user data to Firestore
      await dispatch(createOrUpdateUser(userInfo)).unwrap();
      await persistUser(userInfo); // Store user data
      setUser(userInfo);
      router.replace('/(app)');
    } else if (Platform.OS === 'web' && window.google) {
      // For web, just trigger the prompt again
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed()) {
          console.error(
            'Google Sign-In prompt not displayed:',
            notification.getNotDisplayedReason()
          );
        }
      });
    }
  };

  const signOut = async () => {
    try {
      if (Platform.OS === 'web' && window.google && user) {
        window.google.accounts.id.cancel();
        window.google.accounts.id.revoke(user.id, async () => {
          await handleSignOut();
        });
      } else {
        await handleSignOut();
      }
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  const handleSignOut = async () => {
    await auth.signOut();
    await AsyncStorage.removeItem(USER_STORAGE_KEY); // Remove stored user data
    setUser(null);
    router.replace('/(auth)');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
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
