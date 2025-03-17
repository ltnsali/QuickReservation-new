import { View, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
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
            Quick Reservation
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.welcomeCard} elevation={2}>
          <Text variant="headlineSmall" style={styles.welcomeTitle}>
            Welcome to Quick Reservation
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

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Why Choose Us?
        </Text>

        <View style={styles.featuresContainer}>
          <Surface style={styles.featureCard} elevation={1}>
            <MaterialCommunityIcons name="flash" size={32} color="#4A00E0" />
            <Text variant="titleMedium" style={styles.featureTitle}>
              Quick Booking
            </Text>
            <Text variant="bodyMedium" style={styles.featureText}>
              Reserve your spot in seconds
            </Text>
          </Surface>

          <Surface style={styles.featureCard} elevation={1}>
            <MaterialCommunityIcons name="calendar-check" size={32} color="#4A00E0" />
            <Text variant="titleMedium" style={styles.featureTitle}>
              Easy Management
            </Text>
            <Text variant="bodyMedium" style={styles.featureText}>
              View and manage your bookings
            </Text>
          </Surface>

          <Surface style={styles.featureCard} elevation={1}>
            <MaterialCommunityIcons name="bell-ring" size={32} color="#4A00E0" />
            <Text variant="titleMedium" style={styles.featureTitle}>
              Instant Updates
            </Text>
            <Text variant="bodyMedium" style={styles.featureText}>
              Get notified about your reservations
            </Text>
          </Surface>
        </View>

        <Surface style={styles.statsCard} elevation={1}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text variant="headlineMedium" style={styles.statNumber}>
                24/7
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                Available
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text variant="headlineMedium" style={styles.statNumber}>
                100%
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                Secure
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text variant="headlineMedium" style={styles.statNumber}>
                Fast
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                Booking
              </Text>
            </View>
          </View>
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
  sectionTitle: {
    marginBottom: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  featureCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'white',
    marginBottom: 16,
    alignItems: 'center',
  },
  featureTitle: {
    marginTop: 12,
    marginBottom: 4,
    color: '#333',
    fontWeight: '600',
  },
  featureText: {
    color: '#666',
    textAlign: 'center',
  },
  statsCard: {
    borderRadius: 12,
    backgroundColor: 'white',
    padding: 24,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    color: '#4A00E0',
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#666',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 16,
  },
});
