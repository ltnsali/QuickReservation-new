import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Platform } from 'react-native';
import { Text, Button, SegmentedButtons } from 'react-native-paper';
import { useAuth } from '../features/auth/AuthContext';
import { Link, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AuthScreen() {
  const { signIn } = useAuth();
  const [userType, setUserType] = useState<'customer' | 'business'>('customer');

  // Store selected user type in AsyncStorage whenever it changes
  useEffect(() => {
    AsyncStorage.setItem('selected_user_type', userType);
  }, [userType]);

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
  },
  button: {
    marginBottom: 12,
    borderRadius: 8,
  },
  registerButton: {
    borderColor: '#4A00E0',
  }
});
