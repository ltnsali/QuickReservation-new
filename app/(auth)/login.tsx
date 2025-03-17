import { View } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';
import { useState } from 'react';
import { Link } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // TODO: Implement login logic
  };

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
      <Text variant="headlineMedium" style={{ marginBottom: 24, textAlign: 'center' }}>
        Welcome Back
      </Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={{ marginBottom: 16 }}
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        mode="outlined"
        style={{ marginBottom: 24 }}
      />

      <Button mode="contained" onPress={handleLogin} style={{ marginBottom: 16 }}>
        Login
      </Button>

      <Button mode="text" style={{ marginBottom: 16 }}>
        <Link href="/register">Don't have an account? Register</Link>
      </Button>

      <Button mode="text">
        <Link href="/forgot-password">Forgot Password?</Link>
      </Button>
    </View>
  );
}
