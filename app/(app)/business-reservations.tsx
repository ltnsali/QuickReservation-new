import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Platform } from 'react-native';
import { Text, Card, Chip, Button, Menu, Divider, ActivityIndicator, FAB, SegmentedButtons } from 'react-native-paper';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../features/auth/AuthContext';
import { useAppSelector } from '../../store/hooks';
import { Reservation, getBusinessReservations, updateReservation } from '../../firebase/firestore';

export default function BusinessReservationsScreen() {
  const { user } = useAuth();
  const { currentBusiness } = useAppSelector(state => state.user);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [menuVisible, setMenuVisible] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);

  // Filter reservations based on status
  const filteredReservations = statusFilter === 'all'
    ? reservations
    : reservations.filter(res => res.status === statusFilter);
  
  // Load reservations from Firestore
  const loadReservations = async () => {
    if (!currentBusiness?.id) return;
    
    try {
      setError(null);
      const fetchedReservations = await getBusinessReservations(currentBusiness.id);
      setReservations(fetchedReservations);
    } catch (err) {
      console.error('Failed to load reservations:', err);
      setError('Failed to load reservations. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Initial load
  useEffect(() => {
    if (currentBusiness?.id) {
      loadReservations();
    }
  }, [currentBusiness]);
  
  // Pull to refresh
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadReservations();
  }, [currentBusiness]);
  
  const toggleMenu = (id: string) => {
    setMenuVisible({
      ...menuVisible,
      [id]: !menuVisible[id]
    });
  };
  
  const updateReservationStatus = async (id: string, newStatus: 'confirmed' | 'completed' | 'cancelled') => {
    try {
      // Update in Firestore first
      await updateReservation(id, { status: newStatus });
      
      // Then update local state
      setReservations(reservations.map(res => 
        res.id === id ? { ...res, status: newStatus } : res
      ));
      
      toggleMenu(id);
    } catch (err) {
      console.error('Error updating reservation status:', err);
      // Show error to user
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FF9800';
      case 'confirmed': return '#4CAF50';
      case 'completed': return '#2196F3';
      case 'cancelled': return '#F44336';
      default: return '#9E9E9E';
    }
  };
  
  if (!user || !currentBusiness) {
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator 
          size="large" 
          color="#4A00E0" 
          animating={true}
        />
        <Text style={{ marginTop: 16 }}>Loading reservations...</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <SegmentedButtons
          value={statusFilter}
          onValueChange={setStatusFilter}
          buttons={[
            { value: 'all', label: 'All' },
            { value: 'pending', label: 'Pending' },
            { value: 'confirmed', label: 'Confirmed' },
            { value: 'completed', label: 'Completed' },
          ]}
        />
      </View>
      
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#4A00E0"]} />
        }
      >
        {error && (
          <Card style={styles.errorCard}>
            <Card.Content>
              <Text style={styles.errorText}>{error}</Text>
              <Button 
                mode="contained" 
                onPress={loadReservations} 
                style={{ marginTop: 10 }}
              >
                Try Again
              </Button>
            </Card.Content>
          </Card>
        )}
        
        {!error && filteredReservations.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <MaterialCommunityIcons name="calendar-blank" size={64} color="#4A00E0" />
              <Text variant="titleMedium" style={styles.emptyTitle}>No Reservations</Text>
              <Text style={styles.emptyText}>
                {statusFilter === 'all' 
                  ? 'You don\'t have any reservations yet.' 
                  : `You don't have any ${statusFilter} reservations.`}
              </Text>
            </Card.Content>
          </Card>
        ) : (
          filteredReservations.map(reservation => (
            <Card key={reservation.id} style={styles.reservationCard}>
              <Card.Content>
                <View style={styles.reservationHeader}>
                  <View style={styles.customerInfo}>
                    <Text variant="titleMedium" style={styles.customerName}>
                      {reservation.customerName}
                    </Text>
                    <Chip 
                      style={[styles.statusChip, { backgroundColor: `${getStatusColor(reservation.status)}20` }]}
                      textStyle={{ color: getStatusColor(reservation.status) }}
                    >
                      {reservation.status}
                    </Chip>
                  </View>
                  <Menu
                    visible={!!menuVisible[reservation.id]}
                    onDismiss={() => toggleMenu(reservation.id)}
                    anchor={
                      <Button 
                        icon="dots-vertical" 
                        mode="text" 
                        onPress={() => toggleMenu(reservation.id)}
                        contentStyle={styles.menuButton}
                      >
                        {/* Empty child required by type definition */}
                        <Text>{''}</Text>
                      </Button>
                    }
                  >
                    {reservation.status === 'pending' && (
                      <Menu.Item 
                        title="Confirm"
                        leadingIcon="check-circle"
                        onPress={() => updateReservationStatus(reservation.id, 'confirmed')}
                      />
                    )}
                    {(reservation.status === 'pending' || reservation.status === 'confirmed') && (
                      <Menu.Item 
                        title="Mark as Completed"
                        leadingIcon="check-all"
                        onPress={() => updateReservationStatus(reservation.id, 'completed')}
                      />
                    )}
                    {reservation.status !== 'cancelled' && reservation.status !== 'completed' && (
                      <Menu.Item 
                        title="Cancel"
                        leadingIcon="cancel"
                        onPress={() => updateReservationStatus(reservation.id, 'cancelled')}
                      />
                    )}
                    <Divider />
                    <Menu.Item 
                      title="Send Message"
                      leadingIcon="message-text"
                      onPress={() => toggleMenu(reservation.id)}
                    />
                  </Menu>
                </View>
                
                <Divider style={styles.divider} />
                
                <View style={styles.detailsContainer}>
                  <View style={styles.detailItem}>
                    <MaterialCommunityIcons name="calendar" size={20} color="#666" />
                    <Text style={styles.detailText}>{reservation.date}</Text>
                  </View>
                  
                  <View style={styles.detailItem}>
                    <MaterialCommunityIcons name="clock-outline" size={20} color="#666" />
                    <Text style={styles.detailText}>{reservation.time}</Text>
                  </View>
                  
                  {reservation.customerEmail && (
                    <View style={styles.detailItem}>
                      <MaterialCommunityIcons name="email-outline" size={20} color="#666" />
                      <Text style={styles.detailText}>{reservation.customerEmail}</Text>
                    </View>
                  )}
                  
                  {reservation.customerPhone && (
                    <View style={styles.detailItem}>
                      <MaterialCommunityIcons name="phone-outline" size={20} color="#666" />
                      <Text style={styles.detailText}>{reservation.customerPhone}</Text>
                    </View>
                  )}
                  
                  {reservation.notes && (
                    <View style={styles.detailItem}>
                      <MaterialCommunityIcons name="note-text" size={20} color="#666" />
                      <Text style={styles.detailText}>{reservation.notes}</Text>
                    </View>
                  )}
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
      
      {/* FAB button for adding a manual reservation */}
      <FAB
        icon="calendar-plus"
        style={styles.fab}
        onPress={() => console.log('Add manual reservation')}
        color="white"
        label="Add Manual"
        uppercase={false}
      />
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
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ebebeb',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  reservationCard: {
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // for Android
  },
  reservationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  statusChip: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  menuButton: {
    margin: -8,
  },
  divider: {
    marginVertical: 12,
  },
  detailsContainer: {
    marginTop: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#444',
  },
  emptyCard: {
    borderRadius: 12,
    marginVertical: 20,
  },
  emptyContent: {
    alignItems: 'center',
    padding: 30,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 18,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#4A00E0',
  },
  errorCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#FFEBEE',
  },
  errorText: {
    color: '#D32F2F',
    marginBottom: 8,
  },
});