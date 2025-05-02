import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { Text, Button, Surface, Divider, Card } from 'react-native-paper';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../features/auth/AuthContext';
import { useAppSelector } from '../../store/hooks';
import { UserAvatar } from '../../components/ui/UserAvatar';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { currentBusiness } = useAppSelector(state => state.user);
  
  // Determine if the user is a business owner
  const isBusinessOwner = user?.role === 'business';

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

          {isBusinessOwner ? (
            // Business Owner Stats
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text variant="bodyLarge" style={styles.statValue}>
                  0
                </Text>
                <Text variant="bodyMedium" style={styles.statLabel}>
                  Total Services
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="bodyLarge" style={styles.statValue}>
                  0
                </Text>
                <Text variant="bodyMedium" style={styles.statLabel}>
                  Total Reservations
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="bodyLarge" style={styles.statValue}>
                  0
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
                  0
                </Text>
                <Text variant="bodyMedium" style={styles.statLabel}>
                  Pending
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="bodyLarge" style={styles.statValue}>
                  0
                </Text>
                <Text variant="bodyMedium" style={styles.statLabel}>
                  Completed
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="bodyLarge" style={styles.statValue}>
                  0
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
});
