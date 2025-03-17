import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, IconButton, useTheme, ActivityIndicator } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RootState } from '../../store';

export default function BookingsScreen() {
  const theme = useTheme();
  const { reservations, loading } = useSelector((state: RootState) => state.reservations);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A00E0" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4A00E0', '#8E2DE2']} style={styles.header}>
        <View style={styles.headerContent}>
          <MaterialCommunityIcons name="calendar-multiple" size={32} color="white" />
          <Text variant="headlineMedium" style={styles.headerTitle}>
            My Bookings
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {reservations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="calendar-blank" size={64} color="#4A00E0" />
            <Text variant="titleMedium" style={styles.emptyText}>
              No reservations yet
            </Text>
          </View>
        ) : (
          reservations.map(reservation => (
            <Surface key={reservation.id} style={styles.card} elevation={2}>
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="account" size={24} color="#4A00E0" />
                <Text variant="titleMedium" style={styles.nameText}>
                  {reservation.name}
                </Text>
              </View>

              <View style={styles.cardContent}>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="calendar" size={20} color="#666" />
                  <Text style={styles.infoText}>{reservation.date}</Text>
                </View>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="clock-outline" size={20} color="#666" />
                  <Text style={styles.infoText}>{reservation.time}</Text>
                </View>
                {reservation.notes && (
                  <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="note-text" size={20} color="#666" />
                    <Text style={styles.infoText}>{reservation.notes}</Text>
                  </View>
                )}
              </View>
            </Surface>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    marginTop: 16,
    color: '#666',
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  nameText: {
    marginLeft: 12,
    color: '#4A00E0',
    fontWeight: '600',
  },
  cardContent: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#444',
  },
});
