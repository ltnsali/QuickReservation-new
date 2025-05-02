import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { Text, Button, Surface, Divider, Card, ActivityIndicator } from 'react-native-paper';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { UserAvatar } from '../../components/ui/UserAvatar';
import { getBusinessReservations, getCustomerReservations, Reservation } from '../../firebase/firestore';
import { fetchReservations } from '../../store/slices/reservationSlice';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { currentBusiness } = useAppSelector(state => state.user);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  
  // Determine if the user is a business owner
  const isBusinessOwner = user?.role === 'business';

  useEffect(() => {
    const loadReservations = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        let data: Reservation[] = [];
        
        if (isBusinessOwner && currentBusiness?.id) {
          // For business owners, fetch all business reservations
          data = await getBusinessReservations(currentBusiness.id);
        } else {
          // For customers, fetch their reservations
          data = await getCustomerReservations(user.id);
          
          // Also update Redux store
          dispatch(fetchReservations(user.id));
        }
        
        setReservations(data);
      } catch (error) {
        console.error('Failed to load profile reservations:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadReservations();
  }, [user, currentBusiness, isBusinessOwner, dispatch]);

  // Calculate statistics
  const today = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format
    // Business statistics
  const totalReservations = reservations.length;
  const activeToday = reservations.filter(res => 
    res.date === today && res.status !== 'cancelled'
  ).length;
  const confirmedReservations = reservations.filter(res => res.status === 'confirmed').length;
  const pendingReservations = reservations.filter(res => res.status === 'pending').length;
  
  // Customer statistics
  const completedReservations = reservations.filter(res => res.status === 'completed').length;
  const cancelledReservations = reservations.filter(res => res.status === 'cancelled').length;

  if (!user) {
    return null;
  }
  return (
    <View style={styles.container}>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.profileCard} elevation={2}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <UserAvatar user={user} size={80} />
              {isBusinessOwner && <View style={styles.businessBadge} />}
            </View>
            <View style={styles.profileInfo}>
              <Text variant="headlineSmall" style={styles.nameText}>
                {user.name}
              </Text>
              <Text variant="bodyMedium" style={styles.emailText}>
                {user.email}
              </Text>
              {isBusinessOwner && (
                <Text variant="bodySmall" style={styles.businessLabel}>
                  Business Account
                </Text>
              )}
            </View>
          </View>

          <Divider style={styles.divider} />

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#4A00E0" />
            </View>          ) : isBusinessOwner ? (
            // Business Owner Stats
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text variant="bodyLarge" style={styles.statValue}>
                  {pendingReservations}
                </Text>
                <Text variant="bodyMedium" style={styles.statLabel}>
                  Pending
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="bodyLarge" style={styles.statValue}>
                  {confirmedReservations}
                </Text>
                <Text variant="bodyMedium" style={styles.statLabel}>
                  Confirmed
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="bodyLarge" style={styles.statValue}>
                  {activeToday}
                </Text>
                <Text variant="bodyMedium" style={styles.statLabel}>
                  Active Today
                </Text>
              </View>
            </View>
          ) : (
            // Customer Stats
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text variant="bodyLarge" style={styles.statValue}>
                  {pendingReservations}
                </Text>
                <Text variant="bodyMedium" style={styles.statLabel}>
                  Pending
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="bodyLarge" style={styles.statValue}>
                  {completedReservations}
                </Text>
                <Text variant="bodyMedium" style={styles.statLabel}>
                  Completed
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="bodyLarge" style={styles.statValue}>
                  {cancelledReservations}
                </Text>
                <Text variant="bodyMedium" style={styles.statLabel}>
                  Cancelled
                </Text>
              </View>
            </View>
          )}
        </Surface>

        {isBusinessOwner && (
          <Card style={styles.businessCard}>
            <Card.Title title="Business Management" />
            <Card.Content>
              <Button
                mode="contained"
                icon="calendar-check"
                onPress={() => router.push('/business-reservations')}
                style={styles.actionButton}
                buttonColor="#8E2DE2"
              >
                View Reservations
              </Button>
            </Card.Content>
          </Card>
        )}

        <Surface style={styles.actionsCard} elevation={2}>
          {!isBusinessOwner && (
            // Only show for customers
            <Button
              mode="contained"
              icon="calendar-plus"
              onPress={() => router.push('/make-reservation4')}
              style={styles.reserveButton}
              buttonColor="#8E2DE2"
            >
              Make a Reservation
            </Button>
          )}
          <Button
            mode="outlined"
            onPress={signOut}
            icon="logout"
            style={styles.signOutButton}
            textColor="#4A00E0"
          >
            Sign Out
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
    paddingBottom: 32,
  },
  profileCard: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  businessBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FF9500',
    borderWidth: 2,
    borderColor: 'white',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  nameText: {
    fontWeight: '600',
    color: '#333',
  },
  emailText: {
    color: '#666',
    marginTop: 4,
  },
  businessLabel: {
    color: '#4A00E0',
    fontWeight: 'bold',
    marginTop: 4,
  },
  divider: {
    marginVertical: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontWeight: 'bold',
    color: '#4A00E0',
    fontSize: 20,
  },
  statLabel: {
    color: '#666',
    textAlign: 'center',
  },
  businessCard: {
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: 'white',
  },
  actionsCard: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: 'white',
  },
  actionButton: {
    marginBottom: 12,
  },
  reserveButton: {
    marginBottom: 12,
  },
  signOutButton: {
    borderColor: '#4A00E0',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
});
