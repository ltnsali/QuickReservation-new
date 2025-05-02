import { View, StyleSheet } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { useAuth } from '../features/auth/AuthContext';
import { useAppSelector } from '../../store/hooks';
import DashboardScreen from './dashboard';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  const { user } = useAuth();
  const { currentBusiness } = useAppSelector(state => state.user);

  // If user is a business owner, render the dashboard directly instead of redirecting
  if (user?.role === 'business') {
    return <DashboardScreen />;
  }

  const navigateToReservation = () => {
    router.push('/make-reservation');
  };

  const navigateToBookings = () => {
    router.push('/bookings');
  };

  return (
    <View style={styles.container}>
      <View style={styles.welcomeContainer}>
        <Text variant="headlineMedium" style={styles.welcomeText}>Welcome to QuickReservation</Text>
        <Text variant="bodyLarge" style={styles.subtitleText}>
          {user ? `Hello, ${user.name}!` : 'Book your next appointment easily'}
        </Text>
      </View>

      <View style={styles.cardsContainer}>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <MaterialCommunityIcons name="calendar-plus" size={48} color="#4A00E0" />
            <Text variant="titleLarge" style={styles.cardTitle}>Make a Reservation</Text>
            <Text variant="bodyMedium" style={styles.cardDescription}>
              Browse businesses and make a new reservation quickly and easily
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button 
              mode="contained" 
              onPress={navigateToReservation}
              style={styles.button}
              buttonColor="#4A00E0"
            >
              Make Reservation
            </Button>
          </Card.Actions>
        </Card>

        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <MaterialCommunityIcons name="calendar-check" size={48} color="#4A00E0" />
            <Text variant="titleLarge" style={styles.cardTitle}>View My Bookings</Text>
            <Text variant="bodyMedium" style={styles.cardDescription}>
              Check and manage all your existing reservations
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button 
              mode="contained" 
              onPress={navigateToBookings}
              style={styles.button}
              buttonColor="#4A00E0"
            >
              View Bookings
            </Button>
          </Card.Actions>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  welcomeContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  welcomeText: {
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitleText: {
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  cardsContainer: {
    flex: 1,
    gap: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
  },
  cardContent: {
    alignItems: 'center',
    padding: 16,
  },
  cardTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  cardDescription: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  button: {
    width: '100%',
    borderRadius: 8,
  }
});
