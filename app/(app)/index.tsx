import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { router } from 'expo-router';

export default function HomeScreen() {
  const handleMakeReservation = () => {
    // TODO: Navigate to reservation form
    router.push('/make-reservation');
  };

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' }}>
      <Text variant="headlineLarge" style={{ marginBottom: 8, textAlign: 'center' }}>
        Quick Reservation
      </Text>

      <Text variant="bodyLarge" style={{ marginBottom: 32, textAlign: 'center', opacity: 0.7 }}>
        Book your appointment in just a few taps
      </Text>

      <Button
        mode="contained"
        onPress={handleMakeReservation}
        style={{ width: '80%', paddingVertical: 8 }}
        contentStyle={{ height: 48 }}
      >
        Make a Reservation
      </Button>
    </View>
  );
}
