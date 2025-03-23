import { View, StyleSheet, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { Text, Surface, Button, Card, Divider } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../features/auth/AuthContext';
import { useAppSelector } from '../../store/hooks';

export default function DashboardScreen() {
  const { user } = useAuth();
  const { currentBusiness } = useAppSelector(state => state.user);
  
  // If not a business user or no business data, render a placeholder
  if (!user || user.role !== 'business' || !currentBusiness) {
    return (
      <View style={styles.container}>
        <ActivityIndicator 
          size="large" 
          color="#4A00E0" 
          animating={true}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4A00E0', '#8E2DE2']} style={styles.header}>
        <View style={styles.headerContent}>
          <MaterialCommunityIcons name="view-dashboard" size={32} color="white" />
          <Text variant="headlineMedium" style={styles.headerTitle}>
            Business Dashboard
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Card style={styles.welcomeCard}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.welcomeTitle}>
              {currentBusiness.name}
            </Text>
            <Text variant="bodyMedium" style={styles.businessCategory}>
              {currentBusiness.category || 'General Business'}
            </Text>

            {currentBusiness.description && (
              <Text style={styles.description}>
                {currentBusiness.description}
              </Text>
            )}

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>Today's Bookings</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>Pending</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
            </View>
          </Card.Content>
          <Card.Actions>
            <Button 
              mode="contained" 
              onPress={() => router.push('/business-services')}
              style={styles.actionButton}
            >
              Manage Services
            </Button>
            <Button 
              mode="outlined" 
              onPress={() => router.push('/business-reservations')}
              style={styles.actionButton}
              textColor="#4A00E0"
            >
              View Reservations
            </Button>
          </Card.Actions>
        </Card>

        <Card style={styles.quickActionsCard}>
          <Card.Title 
            title="Quick Actions" 
            left={(props) => <MaterialCommunityIcons {...props} name="lightning-bolt" size={24} color="#4A00E0" />} 
          />
          <Card.Content>
            <View style={styles.quickActionButtons}>
              <Button 
                mode="contained-tonal" 
                icon="clock-edit"
                onPress={() => {}} 
                style={[styles.quickActionButton, { backgroundColor: '#E8DEF8' }]}
                textColor="#4A00E0"
              >
                Set Hours
              </Button>
              <Button 
                mode="contained-tonal" 
                icon="update"
                onPress={() => {}} 
                style={[styles.quickActionButton, { backgroundColor: '#F6EDFF' }]}
                textColor="#6200EA"
              >
                Update Info
              </Button>
              <Button 
                mode="contained-tonal" 
                icon="message"
                onPress={() => {}} 
                style={[styles.quickActionButton, { backgroundColor: '#E3F4FB' }]}
                textColor="#0277BD"
              >
                Messages
              </Button>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.infoCard}>
          <Card.Title 
            title="Business Information"
            subtitle="Contact & Details"
            left={(props) => <MaterialCommunityIcons {...props} name="information" size={24} color="#4A00E0" />}
          />
          <Card.Content>
            <View style={styles.infoItem}>
              <MaterialCommunityIcons name="phone" size={22} color="#666" />
              <Text style={styles.infoText}>
                {currentBusiness.phone || 'No phone number added'}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <MaterialCommunityIcons name="map-marker" size={22} color="#666" />
              <Text style={styles.infoText}>
                {currentBusiness.address || 'No address added'}
              </Text>
            </View>

            {currentBusiness.website && (
              <View style={styles.infoItem}>
                <MaterialCommunityIcons name="web" size={22} color="#666" />
                <Text style={styles.infoText}>
                  {currentBusiness.website}
                </Text>
              </View>
            )}

            <Button 
              mode="text" 
              icon="pencil" 
              onPress={() => router.push('/business-edit')}
              style={styles.editButton}
            >
              Edit Information
            </Button>
          </Card.Content>
        </Card>
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
    height: 120,
    justifyContent: 'flex-end',
    padding: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  welcomeCard: {
    marginBottom: 16,
  },
  welcomeTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  businessCategory: {
    color: '#666',
    marginBottom: 12,
  },
  description: {
    marginTop: 8,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A00E0',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  quickActionsCard: {
    marginBottom: 16,
  },
  quickActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickActionButton: {
    flex: 1,
    minWidth: '30%',
  },
  infoCard: {
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  infoText: {
    flex: 1,
    color: '#333',
  },
  editButton: {
    marginTop: 8,
  },
});