import React, { useState } from 'react';
import { View, StyleSheet, Image, ScrollView, Platform } from 'react-native';
import { Button, TextInput, Text, HelperText, SegmentedButtons } from 'react-native-paper';
import { Link, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../features/auth/AuthContext';

export default function RegisterScreen() {
  // Get user type from URL params or use default
  const params = useLocalSearchParams<{ type: string }>();
  const [userType, setUserType] = useState<'customer' | 'business'>(
    (params.type === 'business' ? 'business' : 'customer') as 'customer' | 'business'
  );
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  const { emailPasswordSignUp, error, isLoading } = useAuth();

  const validateName = () => {
    if (!name.trim()) {
      setNameError('Name is required');
      return false;
    }
    setNameError('');
    return true;
  };

  const validateEmail = () => {
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = () => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = () => {
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      return false;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const handleRegister = async () => {
    if (
      validateName() && 
      validateEmail() && 
      validatePassword() && 
      validateConfirmPassword()
    ) {
      await emailPasswordSignUp(name, email, password, userType);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.content}>
        <Image source={require('../../assets/icon.png')} style={styles.logo} />
        <Text variant="headlineMedium" style={styles.title}>
          Create Account
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
        
        <Text variant="bodyMedium" style={styles.subtitle}>
          {userType === 'business' 
            ? 'Register your business to accept reservations' 
            : 'Register to make reservations'}
        </Text>
        
        <View style={styles.form}>
          <TextInput
            label="Full Name"
            value={name}
            onChangeText={setName}
            onBlur={validateName}
            mode="outlined"
            style={styles.input}
            outlineColor="#4A00E0"
            activeOutlineColor="#4A00E0"
            error={!!nameError}
          />
          {nameError ? <HelperText type="error">{nameError}</HelperText> : null}
          
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            onBlur={validateEmail}
            mode="outlined"
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            outlineColor="#4A00E0"
            activeOutlineColor="#4A00E0"
            error={!!emailError}
          />
          {emailError ? <HelperText type="error">{emailError}</HelperText> : null}
          
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            onBlur={validatePassword}
            secureTextEntry
            mode="outlined"
            style={styles.input}
            outlineColor="#4A00E0"
            activeOutlineColor="#4A00E0"
            error={!!passwordError}
          />
          {passwordError ? <HelperText type="error">{passwordError}</HelperText> : null}
          
          <TextInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            onBlur={validateConfirmPassword}
            secureTextEntry
            mode="outlined"
            style={styles.input}
            outlineColor="#4A00E0"
            activeOutlineColor="#4A00E0"
            error={!!confirmPasswordError}
          />
          {confirmPasswordError ? <HelperText type="error">{confirmPasswordError}</HelperText> : null}
          
          {error && <HelperText type="error">{error}</HelperText>}
          
          <Button 
            mode="contained" 
            onPress={handleRegister} 
            style={styles.button}
            buttonColor="#4A00E0"
            loading={isLoading}
            disabled={isLoading}
            animating={true}
            useNativeDriver={Platform.OS !== 'web'}
          >
            {userType === 'business' ? 'Register Business' : 'Register'}
          </Button>
          
          <Button 
            mode="text" 
            style={styles.textButton}
            textColor="#4A00E0"
          >
            <Link 
              href={{
                pathname: '/login',
                params: { type: userType }
              }}
            >
              Already have an account? Sign In
            </Link>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 24,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
    color: '#1E293B',
  },
  subtitle: {
    marginTop: 12,
    marginBottom: 24,
    textAlign: 'center',
    color: '#64748B',
  },
  segmentedButtons: {
    width: '100%',
    maxWidth: 320,
  },
  form: {
    width: '100%',
    maxWidth: 320,
  },
  input: {
    marginBottom: 8,
    backgroundColor: '#ffffff',
  },
  button: {
    marginTop: 24,
    marginBottom: 16,
    borderRadius: 8,
  },
  textButton: {
    marginBottom: 8,
  },
});
