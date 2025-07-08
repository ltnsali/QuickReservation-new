import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Platform } from 'react-native';
import { Button, TextInput, Text, HelperText } from 'react-native-paper';
import { Link, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../features/auth/AuthContext';
import { GoogleSignIn } from '../features/auth/GoogleSignIn';

export default function LoginScreen() {
  const { type = 'customer' } = useLocalSearchParams<{ type: string }>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { emailPasswordSignIn, error, isLoading } = useAuth();
  const googleButtonRef = useRef<HTMLDivElement>(null);

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

  const handleLogin = async () => {
    if (validateEmail() && validatePassword()) {
      await emailPasswordSignIn(email, password);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={require('../../assets/icon.png')} style={styles.logo} />
        <Text variant="headlineMedium" style={styles.title}>
          {type === 'business' ? 'Business Login' : 'Welcome Back'}
        </Text>
        
        <View style={styles.form}>
          <View style={styles.googleSignInContainer}>
            {Platform.OS === 'web' ? (
              <div ref={googleButtonRef} style={{ width: '100%', height: 40 }} />
            ) : (
              <GoogleSignIn onSignIn={handleLogin} />
            )}
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

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
          
          {error && <HelperText type="error">{error}</HelperText>}
          
          <Button 
            mode="contained" 
            onPress={handleLogin} 
            style={styles.button}
            buttonColor="#4A00E0"
            loading={isLoading}
            disabled={isLoading}
          >
            Sign In
          </Button>
          
          <Button 
            mode="text" 
            style={styles.textButton}
            textColor="#4A00E0"
          >
            <Link 
              href={{
                pathname: '/register',
                params: { type }
              }}
            >
              Don't have an account? Register
            </Link>
          </Button>
          
          <Button 
            mode="text"
            style={styles.textButton}
            textColor="#4A00E0"
          >
            <Link href="/forgot-password">Forgot Password?</Link>
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
    width: 80,
    height: 80,
    marginBottom: 24,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
    color: '#1E293B',
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
  googleSignInContainer: {
    width: '100%',
    marginBottom: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#64748B',
  },
});
