import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image, ActivityIndicator, Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import Constants from 'expo-constants';
import { useAuth } from './AuthContext';

WebBrowser.maybeCompleteAuthSession();

// Web client ID
const WEB_CLIENT_ID = '57102764070-q106sapm1qn0rh33qrgqlpjnha9hpu0r.apps.googleusercontent.com';
// Android client ID
const ANDROID_CLIENT_ID = '57102764070-jq4fglluu8tlmp5790qq91s53kismp9o.apps.googleusercontent.com';
// Expo client ID (for Expo Go)
const EXPO_CLIENT_ID = '57102764070-q106sapm1qn0rh33qrgqlpjnha9hpu0r.apps.googleusercontent.com';

export const GoogleSignIn = ({ onSignIn }: { onSignIn?: (userData: any) => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();  // Use the AuthContext
  
  // For Android, we'll use the default configuration that works with the package name and SHA-1
  const redirectUri = makeRedirectUri({ scheme: 'qreserv' });

  console.log('Redirect URI:', redirectUri); // This will help us debug
  console.log('Platform:', Platform.OS);

  const [request, response, promptAsync] = Platform.OS === 'web' 
    ? [null, null, async () => {}] 
    : Google.useAuthRequest({
        androidClientId: ANDROID_CLIENT_ID,
        webClientId: WEB_CLIENT_ID, // This is needed for Android too
        expoClientId: EXPO_CLIENT_ID,
        // For Android with expo-auth-session, we need to simplify this
        ...(Platform.OS === 'android' ? {} : { redirectUri }),
        scopes: ['profile', 'email']
      });
  useEffect(() => {
    if (Platform.OS !== 'web') {
      handleAuthResponse();
    }
  }, [response]);  
  
  const handleAuthResponse = async () => {
    console.log('📱 Auth response received:', JSON.stringify(response, null, 2));
    
    if (response?.type === 'success') {
      setIsLoading(true);
      const { authentication } = response;
      console.log('📱 Authentication successful:', JSON.stringify(authentication, null, 2));
      
      // Check if we have a valid token before proceeding
      if (authentication?.accessToken) {
        console.log('📱 Valid access token received, proceeding with user info fetch');
        await fetchUserInfo(authentication.accessToken);
      } else {
        console.error('📱 No access token in successful response');
        setError('Authentication succeeded but no access token was received. Please try again.');
        setIsLoading(false);
      }
    } else if (response?.type === 'error') {
      console.error('Google sign-in error:', response.error);
      // Log the full error details for debugging
      console.error('Error details:', JSON.stringify(response, null, 2));
      setError(`Failed to sign in with Google: ${response.error?.message || 'Unknown error'}. Please try again.`);
      setIsLoading(false);
    } else if (response) {
      console.log('Other response type:', response.type);
      setError(`Sign in process returned ${response.type}. Please try again.`);
      setIsLoading(false);
    }
  };  const fetchUserInfo = async (token: string | undefined) => {
    if (!token) {
      console.log('📱 Authentication failed: No token received');
      setError('Authentication failed. Please try again.');
      setIsLoading(false);
      return;
    }

    try {
      console.log('📱 Fetching user info from Google API');
      console.log(`📱 Token length: ${token.length} characters`);
      console.log(`📱 Token preview: ${token.substring(0, 10)}...`);
        const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('📱 Google API response status:', response.status);
      
      if (!response.ok) {
        console.log('📱 Google API error:', response.status, response.statusText);
        const errorText = await response.text();
        console.log('📱 Error response body:', errorText);
        throw new Error(`Failed to fetch user info: ${response.status} ${response.statusText}`);
      }

      const userData = await response.json();
      console.log('📱 User data retrieved:', JSON.stringify(userData, null, 2));
      
      const userDataWithPhoto = {
        ...userData,
        photoUrl: userData.picture,
        // Adding an ID field to ensure Firebase auth integration works properly
        id: userData.id || userData.sub, // Google uses 'sub' as the unique identifier
      };
      
      console.log('📱 Enhanced user data prepared for auth:', JSON.stringify(userDataWithPhoto, null, 2));
      
      // Call the AuthContext's signIn function ONLY
      console.log('📱 Calling AuthContext signIn function');
      try {
        await signIn(userDataWithPhoto);
        console.log('📱 SignIn function completed successfully');
      } catch (signInError) {
        console.error('📱 Error in signIn function:', signInError);
        if (signInError instanceof Error) {
          console.error('📱 SignIn error details:', signInError.message);
        }
        throw signInError;
      }
    
    // Don't call onSignIn anymore - we're using the AuthContext navigation exclusively
    // to avoid conflicts between navigation methods
    } catch (error) {
      console.error('Error fetching user info:', error);
      setError('Failed to get user information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };  const handleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (Platform.OS === 'web') {
        // Web sign-in is handled by the parent component
        return;
      } else {
        console.log('📱 Starting Google Sign-In flow on Android');
        console.log('📱 Redirect URI:', redirectUri);
        console.log('📱 Android Client ID:', ANDROID_CLIENT_ID);
        
        // Try to use promptAsync and log the result
        const result = await promptAsync();
        console.log('📱 promptAsync result:', JSON.stringify(result, null, 2));
      }
    } catch (error) {
      console.error('📱 Error during sign in:', error);
      if (error instanceof Error) {
        console.error('📱 Error details - Name:', error.name);
        console.error('📱 Error details - Message:', error.message);
        console.error('📱 Error stack:', error.stack);
      }
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  if (Platform.OS === 'web') {
    return null; // Don't render anything on web
  }

  return (
    <View>
      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSignIn}
        disabled={isLoading || !request}
      >
        <View style={styles.buttonContent}>
          {isLoading ? (
            <ActivityIndicator 
              color="#757575" 
              size="small"
              animating={true}
            />
          ) : (
            <>
              <Image
                source={require('../../../assets/google-icon.png')}
                style={styles.googleIcon}
              />
              <Text style={styles.buttonText}>Sign in with Google</Text>
            </>
          )}
        </View>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ffffff',
    borderRadius: 4,
    padding: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        // Web için alternatif stil
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
      }
    }),
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  buttonText: {
    color: '#757575',
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    color: '#dc2626',
    marginTop: 8,
    textAlign: 'center',
  },
});
