import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useAuth } from '../features/auth/AuthContext';
import { useAppSelector } from '../../store/hooks';
import DashboardScreen from './dashboard';

export default function HomeScreen() {
  const { user } = useAuth();
  const { currentBusiness } = useAppSelector(state => state.user);

  // If user is a business owner, render the dashboard directly instead of redirecting
  if (user?.role === 'business') {
    return <DashboardScreen />;
  }

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Welcome to QuickReservation</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
});
