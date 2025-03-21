import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { router } from 'expo-router';
import { useAppDispatch } from '../../../store/hooks';
import { createOrUpdateUser } from '../../../store/slices/userSlice';
import { auth } from '../../../firebase/config';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();

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
          use_fedcm_for_prompt: false // Disable FedCM
        });

        // Configure the button first
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'none';
        document.body.appendChild(buttonContainer);

        window.google?.accounts.id.renderButton(buttonContainer, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          width: 400
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

      // Get photo URL from Google provider data
      const googleProvider = result.user.providerData.find(
        provider => provider.providerId === 'google.com'
      );

      // Get base photo URL and ensure it's HTTPS
      let photoUrl = googleProvider?.photoURL || picture || '';
      
      // Format Google photo URL to ensure it works in React Native
      if (photoUrl.includes('googleusercontent.com')) {
        // Remove any existing size parameters
        photoUrl = photoUrl.split('=')[0];
        // Add size parameter that works well with Avatar
        photoUrl += '=s400-c';
      }

      const userData: User = {
        id: result.user.uid,
        email: result.user.email || email || '',
        name: result.user.displayName || name || 'User',
        photo: photoUrl
      };

      console.log('User data being saved:', userData);

      // Save user data to Firestore
      await dispatch(createOrUpdateUser(userData)).unwrap();
      
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
        photo: userData.photoUrl || userData.picture
      };

      // Save user data to Firestore
      await dispatch(createOrUpdateUser(userInfo)).unwrap();
      
      setUser(userInfo);
      router.replace('/(app)');
    } else if (Platform.OS === 'web' && window.google) {
      // For web, just trigger the prompt again
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed()) {
          console.error('Google Sign-In prompt not displayed:', notification.getNotDisplayedReason());
        }
      });
    }
  };

  const signOut = async () => {
    if (Platform.OS === 'web' && window.google && user) {
      window.google.accounts.id.cancel();
      window.google.accounts.id.revoke(user.id, async () => {
        await auth.signOut();
        setUser(null);
        router.replace('/(auth)');
      });
    } else {
      await auth.signOut();
      setUser(null);
      router.replace('/(auth)');
    }
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
