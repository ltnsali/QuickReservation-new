import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { Text, Button, Surface, Divider } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../features/auth/AuthContext';
import { UserAvatar } from '../../components/ui/UserAvatar';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4A00E0', '#8E2DE2']} style={styles.header}>
        <View style={styles.headerContent}>
          <MaterialCommunityIcons name="account-circle" size={32} color="white" />
          <Text variant="headlineMedium" style={styles.headerTitle}>
            Profile
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.profileCard} elevation={2}>
          <View style={styles.profileHeader}>
            <UserAvatar user={user} size={80} />
            <View style={styles.profileInfo}>
              <Text variant="headlineSmall" style={styles.nameText}>
                {user.name}
              </Text>
              <Text variant="bodyMedium" style={styles.emailText}>
                {user.email}
              </Text>
            </View>
          </View>

          <Divider style={styles.divider} />

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
        </Surface>

        <Surface style={styles.actionsCard} elevation={2}>
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
  },
  actionsCard: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: 'white',
  },
  signOutButton: {
    borderColor: '#4A00E0',
  },
});
