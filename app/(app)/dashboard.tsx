import { View, StyleSheet, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { Text, Surface, Button, Card, Divider } from 'react-native-paper';
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
              mode="outlined" 
              onPress={() => router.push('/business-reservations')}
              style={styles.actionButton}
              textColor="#4A00E0"
            >
              View Reservations
            </Button>
          </Card.Actions>
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
            </View>              <View style={styles.infoItem}>
              <MaterialCommunityIcons name="clock-outline" size={22} color="#666" />
              <Text style={styles.infoText}>
                {'Hours: Check business profile for details'}
              </Text>
            </View>
          </Card.Content>
          <Card.Actions>
            <Button 
              mode="outlined" 
              onPress={() => router.push('/profile?tab=business')}
              style={styles.actionButton}
              textColor="#4A00E0"
            >
              Edit Information
            </Button>
          </Card.Actions>
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
  infoCard: {
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 12,
    color: '#444',
  },
});