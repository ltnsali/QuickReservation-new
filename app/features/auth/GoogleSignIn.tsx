import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image, ActivityIndicator, Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const CLIENT_ID = '57102764070-q106sapm1qn0rh33qrgqlpjnha9hpu0r.apps.googleusercontent.com';

export const GoogleSignIn = ({ onSignIn }: { onSignIn: (userData: any) => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Only initialize auth request for mobile
  const [request, response, promptAsync] = Platform.OS === 'web' ? [null, null, async () => {}] : Google.useAuthRequest({
    clientId: CLIENT_ID,
    redirectUri: makeRedirectUri({
      scheme: 'qreserv'
    }),
    // Add additional scopes if needed
    scopes: ['profile', 'email']
  });

  useEffect(() => {
    if (Platform.OS !== 'web') {
      handleAuthResponse();
    }
  }, [response]);

  const handleAuthResponse = async () => {
    if (response?.type === 'success') {
      setIsLoading(true);
      const { authentication } = response;
      await fetchUserInfo(authentication?.accessToken);
    } else if (response?.type === 'error') {
      setError('Failed to sign in with Google. Please try again.');
      setIsLoading(false);
    }
  };

  const fetchUserInfo = async (token: string | undefined) => {
    if (!token) {
      setError('Authentication failed. Please try again.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }

      const userData = await response.json();
      const userDataWithPhoto = {
        ...userData,
        photoUrl: userData.picture,
      };
      onSignIn(userDataWithPhoto);
    } catch (error) {
      console.error('Error fetching user info:', error);
      setError('Failed to get user information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (Platform.OS === 'web') {
        // Web sign-in is handled by the parent component
        return;
      } else {
        await promptAsync();
      }
    } catch (error) {
      console.error('Error during sign in:', error);
      setError('An unexpected error occurred. Please try again.');
    }
    setIsLoading(false);
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
