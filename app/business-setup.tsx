import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, TextInput, Text, HelperText, Divider, Portal, Dialog } from 'react-native-paper';
import { router } from 'expo-router';
import { useAuth } from './features/auth/AuthContext';
import { useAppDispatch } from '../store/hooks';
import { createOrUpdateBusiness } from '../store/slices/userSlice';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Business categories options
const BUSINESS_CATEGORIES = [
  'Salon & Beauty',
  'Health & Wellness',
  'Fitness',
  'Restaurant',
  'Professional Services',
  'Education & Training',
  'Retail',
  'Other',
];

export default function BusinessSetupScreen() {
  const { user, signOut } = useAuth();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Business details form state
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [website, setWebsite] = useState('');

  // Form validation errors
  const [businessNameError, setBusinessNameError] = useState('');

  const validateBusinessName = () => {
    if (!businessName.trim()) {
      setBusinessNameError('Business name is required');
      return false;
    }
    setBusinessNameError('');
    return true;
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!validateBusinessName()) {
      return;
    }

    if (!user) {
      setError('You must be signed in to create a business');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await dispatch(createOrUpdateBusiness({
        ownerId: user.id,
        name: businessName.trim(),
        category: category.trim() || undefined,
        description: description.trim() || undefined,
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
        website: website.trim() || undefined,
      })).unwrap();

      setShowSuccessDialog(true);
    } catch (err) {
      console.error('Error creating business:', err);
      setError('Failed to create business. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    setShowSuccessDialog(false);
    router.replace('/(app)');
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>You need to be signed in as a business owner to access this page.</Text>
        <Button onPress={() => router.replace('/(auth)')} style={styles.button}>
          Go to Sign In
        </Button>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <LinearGradient colors={['#4A00E0', '#8E2DE2']} style={styles.header}>
        <View style={styles.headerContent}>
          <MaterialCommunityIcons name="store" size={32} color="white" />
          <Text variant="headlineMedium" style={styles.headerTitle}>
            Business Setup
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Business Information
          </Text>
          <Text variant="bodyMedium" style={styles.instructions}>
            Tell us about your business to help customers find you
          </Text>

          <TextInput
            label="Business Name"
            value={businessName}
            onChangeText={setBusinessName}
            onBlur={validateBusinessName}
            mode="outlined"
            style={styles.input}
            outlineColor="#4A00E0"
            activeOutlineColor="#4A00E0"
            error={!!businessNameError}
            required
          />
          {businessNameError ? <HelperText type="error">{businessNameError}</HelperText> : null}

          <TextInput
            label="Business Category"
            value={category}
            onChangeText={setCategory}
            mode="outlined"
            style={styles.input}
            outlineColor="#4A00E0"
            activeOutlineColor="#4A00E0"
            placeholder="e.g., Salon, Restaurant, Healthcare"
          />

          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            style={styles.input}
            outlineColor="#4A00E0"
            activeOutlineColor="#4A00E0"
            multiline
            numberOfLines={3}
            placeholder="Tell customers about your business"
          />

          <Divider style={styles.divider} />

          <Text variant="titleMedium" style={styles.sectionTitle}>
            Contact Information
          </Text>

          <TextInput
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            mode="outlined"
            style={styles.input}
            outlineColor="#4A00E0"
            activeOutlineColor="#4A00E0"
            keyboardType="phone-pad"
          />

          <TextInput
            label="Address"
            value={address}
            onChangeText={setAddress}
            mode="outlined"
            style={styles.input}
            outlineColor="#4A00E0"
            activeOutlineColor="#4A00E0"
            multiline
            numberOfLines={2}
          />

          <TextInput
            label="Website (Optional)"
            value={website}
            onChangeText={setWebsite}
            mode="outlined"
            style={styles.input}
            outlineColor="#4A00E0"
            activeOutlineColor="#4A00E0"
            keyboardType="url"
          />

          {error && <HelperText type="error">{error}</HelperText>}

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.button}
            buttonColor="#4A00E0"
            loading={isLoading}
            disabled={isLoading}
            animating={true}
            useNativeDriver={Platform.OS !== 'web'}
          >
            Create Business
          </Button>

          <Button
            mode="text"
            onPress={signOut}
            style={styles.signOutButton}
            textColor="#dc2626"
          >
            Cancel and Sign Out
          </Button>
        </View>
      </ScrollView>

      <Portal>
        <Dialog visible={showSuccessDialog} onDismiss={handleContinue}>
          <Dialog.Title>Business Created!</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Your business has been set up successfully. You can now start accepting reservations.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleContinue}>Continue</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: 'white',
    marginLeft: 12,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 8,
    color: '#333',
  },
  instructions: {
    color: '#666',
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
    backgroundColor: 'white',
  },
  divider: {
    marginVertical: 24,
    height: 1,
  },
  button: {
    marginTop: 24,
    borderRadius: 8,
  },
  signOutButton: {
    marginTop: 16,
  },
});