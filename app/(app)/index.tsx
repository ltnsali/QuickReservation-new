import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4A00E0', '#8E2DE2']} style={styles.header}>
        <View style={styles.headerContent}>
          <MaterialCommunityIcons name="calendar-check" size={32} color="white" />
          <Text variant="headlineMedium" style={styles.headerTitle}>
            Home
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.welcomeCard} elevation={2}>
          <Text variant="headlineSmall" style={styles.welcomeTitle}>
            Welcome to QReserv
          </Text>
          <Text variant="bodyLarge" style={styles.welcomeSubtitle}>
            Book your appointment in just a few taps
          </Text>
          <Button
            mode="contained"
            onPress={() => router.push('/make-reservation')}
            style={styles.bookButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            buttonColor="#4A00E0"
          >
            Make a Reservation
          </Button>
        </Surface>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingVertical: 24,
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
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Add padding for bottom navigation
  },
  welcomeCard: {
    padding: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    marginBottom: 24,
  },
  welcomeTitle: {
    fontWeight: 'bold',
    color: '#4A00E0',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    color: '#666',
    marginBottom: 24,
  },
  bookButton: {
    borderRadius: 8,
  },
  buttonContent: {
    height: 48,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
