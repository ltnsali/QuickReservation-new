import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { GoogleSignIn } from './GoogleSignIn';
import { router } from 'expo-router';

export const AuthScreen = () => {
  const handleSignIn = (userData: any) => {
    // Here you would typically:
    // 1. Store the user data in your global state management (Redux, Context, etc.)
    // 2. Store the authentication token securely
    // 3. Navigate to the main app
    console.log('User signed in:', userData);
    router.replace('/(app)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={require('../../../assets/icon.png')} style={styles.logo} />
        <Text style={styles.title}>Welcome to QReserv</Text>
        <Text style={styles.subtitle}>Sign in to manage your reservations easily</Text>
        <View style={styles.signInContainer}>
          <GoogleSignIn onSignIn={handleSignIn} />
        </View>
      </View>
    </View>
  );
};

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
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  signInContainer: {
    width: '100%',
    maxWidth: 320,
  },
});
