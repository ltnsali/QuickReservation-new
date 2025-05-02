import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import {
  Text,
  Surface,
  IconButton,
  useTheme,
  ActivityIndicator,
  Portal,
  Dialog,
  Button,
} from 'react-native-paper';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { fetchReservations, deleteReservationAsync } from '../../store/slices/reservationSlice';
import { useState, useEffect } from 'react';
import { useAuth } from '../features/auth/AuthContext';

export default function BookingsScreen() {
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { reservations, loading, error } = useAppSelector(state => state.reservations);

  useEffect(() => {
    if (user) {
      dispatch(fetchReservations(user.id));
    }
  }, [dispatch, user]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator 
          size="large" 
          color="#4A00E0" 
          animating={true}
        />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons name="alert" size={64} color="#dc2626" />
        <Text variant="titleMedium" style={styles.errorText}>
          {error}
        </Text>
        <Button 
          mode="contained" 
          onPress={() => user && dispatch(fetchReservations(user.id))}
          style={{ marginTop: 20 }}
          buttonColor="#4A00E0"
        >
          Try Again
        </Button>
      </View>
    );
  }

  const handleDelete = async (id: string) => {
    setSelectedReservation(id);
    setDeleteDialogVisible(true);
  };

  const confirmDelete = async () => {
    if (selectedReservation && user) {
      await dispatch(deleteReservationAsync({ id: selectedReservation, userId: user.id }));
      setDeleteDialogVisible(false);
      setSelectedReservation(null);
    }
  };
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {reservations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="calendar-blank" size={64} color="#4A00E0" />
            <Text variant="titleMedium" style={styles.emptyText}>
              No reservations yet
            </Text>
            <Text style={styles.emptySubText}>Your upcoming reservations will appear here</Text>
          </View>
        ) : (
          reservations.map(reservation => (
            <Surface key={reservation.id} style={styles.card} elevation={2}>
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <MaterialCommunityIcons name="account" size={24} color="#4A00E0" />
                  <Text variant="titleMedium" style={styles.nameText}>
                    {reservation.customerName}
                  </Text>
                </View>
                <IconButton
                  icon="delete"
                  iconColor="#dc2626"
                  size={20}
                  onPress={() => handleDelete(reservation.id)}
                />
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

      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Title>Delete Reservation</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">Are you sure you want to delete this reservation?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
            <Button onPress={confirmDelete} textColor="#dc2626">
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    color: '#dc2626',
    textAlign: 'center',
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
    marginBottom: 8,
  },
  emptySubText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
