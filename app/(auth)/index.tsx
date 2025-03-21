import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import { useAuth } from '../features/auth/AuthContext';
import { GoogleSignIn } from '../features/auth/GoogleSignIn';

export default function AuthScreen() {
  const { signIn } = useAuth();
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (Platform.OS === 'web' && window.google && googleButtonRef.current) {
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        width: googleButtonRef.current.offsetWidth
      });
    }
  }, []);

  const handleSignIn = (userData: any) => {
    console.log('Handling sign in with user data:', userData);
    signIn(userData);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={require('../../assets/icon.png')} style={styles.logo} resizeMode="contain" />
        <Text variant="headlineMedium" style={styles.title}>
          Welcome to QReserv
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Sign in to manage your reservations
        </Text>
        <View style={styles.signInContainer}>
          {Platform.OS === 'web' ? (
            <div ref={googleButtonRef} style={{ width: '100%', height: 40 }} />
          ) : (
            <GoogleSignIn onSignIn={handleSignIn} />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
    color: '#1E293B',
  },
  subtitle: {
    marginBottom: 32,
    textAlign: 'center',
    color: '#64748B',
  },
  signInContainer: {
    width: '100%',
    maxWidth: 320,
  }
});
