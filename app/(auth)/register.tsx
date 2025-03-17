import { View } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';
import { useState } from 'react';
import { Link } from 'expo-router';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  const handleRegister = () => {
    // TODO: Implement registration logic
  };

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
      <Text variant="headlineMedium" style={{ marginBottom: 24, textAlign: 'center' }}>
        Create Account
      </Text>

      <TextInput
        label="Full Name"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={{ marginBottom: 16 }}
      />

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
        style={{ marginBottom: 16 }}
      />

      <TextInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        mode="outlined"
        style={{ marginBottom: 24 }}
      />

      <Button mode="contained" onPress={handleRegister} style={{ marginBottom: 16 }}>
        Register
      </Button>

      <Button mode="text">
        <Link href="/login">Already have an account? Login</Link>
      </Button>
    </View>
  );
}
