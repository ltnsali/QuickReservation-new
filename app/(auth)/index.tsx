import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Image, Platform } from 'react-native';
import { Text, Button, SegmentedButtons } from 'react-native-paper';
import { useAuth } from '../features/auth/AuthContext';
import { GoogleSignIn } from '../features/auth/GoogleSignIn';
import { Link, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AuthScreen() {
  const { signIn } = useAuth();
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [userType, setUserType] = useState<'customer' | 'business'>('customer');

  // Store selected user type in AsyncStorage whenever it changes
  useEffect(() => {
    AsyncStorage.setItem('selected_user_type', userType);
  }, [userType]);

  useEffect(() => {
    if (Platform.OS === 'web' && window.google && googleButtonRef.current) {
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        width: googleButtonRef.current.offsetWidth,
        logo_alignment: 'center'
      });
    }
  }, [googleButtonRef.current]);

  const handleSignIn = (userData: any) => {
    console.log('Handling sign in with user data:', userData);
    // Add the user type to the userData object
    const enhancedUserData = {
      ...userData,
      role: userType
    };
    signIn(enhancedUserData);
  };
  const navigateToLogin = () => {
    router.push({
      pathname: Platform.OS === 'web' ? '/login' : '(auth)/login',
      params: { type: userType }
    });
  };

  const navigateToRegister = () => {
    router.push({
      pathname: Platform.OS === 'web' ? '/register' : '(auth)/register',
      params: { type: userType }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={require('../../assets/icon.png')} style={styles.logo} resizeMode="contain" />
        <Text variant="headlineMedium" style={styles.title}>
          Welcome to QReserv
        </Text>
        
        <SegmentedButtons
          value={userType}
          onValueChange={(value) => setUserType(value as 'customer' | 'business')}
          buttons={[
            {
              value: 'customer',
              label: 'Customer',
              icon: 'account'
            },
            {
              value: 'business',
              label: 'Business',
              icon: 'store'
            }
          ]}
          style={styles.segmentedButtons}
        />
        
        <Text variant="bodyLarge" style={styles.subtitle}>
          {userType === 'customer' 
            ? 'Sign in to manage your reservations' 
            : 'Sign in to manage your business'}
        </Text>

        <View style={styles.buttonContainer}>
          <Button 
            mode="contained" 
            onPress={navigateToLogin} 
            style={styles.button}
            buttonColor="#4A00E0"
          >
            Sign In
          </Button>
          
          <Button 
            mode="outlined" 
            onPress={navigateToRegister}
            style={[styles.button, styles.registerButton]} 
            textColor="#4A00E0"
          >
            Create Account
          </Button>
        </View>
        
        <View style={styles.separator}>
          <View style={styles.line} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.line} />
        </View>
        
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
    marginBottom: 16,
    textAlign: 'center',
    color: '#1E293B',
  },
  subtitle: {
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
    color: '#64748B',
  },
  segmentedButtons: {
    width: '100%',
    maxWidth: 320,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 320,
    marginBottom: 24,
  },
  button: {
    marginBottom: 12,
    borderRadius: 8,
  },
  registerButton: {
    borderColor: '#4A00E0',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    marginBottom: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#CBD5E1',
  },
  orText: {
    paddingHorizontal: 16,
    color: '#64748B',
  },
  signInContainer: {
    width: '100%',
    maxWidth: 320,
  }
});
