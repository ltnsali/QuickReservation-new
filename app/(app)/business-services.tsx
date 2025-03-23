import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Text, Card, Button, FAB, Portal, Dialog, TextInput, Divider, IconButton, HelperText, ActivityIndicator } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../features/auth/AuthContext';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { createOrUpdateBusiness, Business } from '../../store/slices/userSlice';
import { RouteGuard } from '../utils/RouteGuard';

type Service = {
  id: string;
  name: string;
  duration: number;
  price?: number;
};

export default function BusinessServicesScreen() {
  return (
    <RouteGuard allowedRoles={['business']}>
      <BusinessServicesContent />
    </RouteGuard>
  );
}

function BusinessServicesContent() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { currentBusiness } = useAppSelector(state => state.user);
  
  const [services, setServices] = useState<Service[]>(
    currentBusiness?.services || []
  );
  
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [serviceName, setServiceName] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');
  
  // Form validation errors
  const [serviceNameError, setServiceNameError] = useState('');
  const [durationError, setDurationError] = useState('');
  
  const showDialog = (service?: Service) => {
    if (service) {
      // Edit mode
      setEditingService(service);
      setServiceName(service.name);
      setDuration(service.duration.toString());
      setPrice(service.price ? service.price.toString() : '');
    } else {
      // Add mode
      setEditingService(null);
      setServiceName('');
      setDuration('');
      setPrice('');
    }
    
    // Clear errors
    setServiceNameError('');
    setDurationError('');
    
    setDialogVisible(true);
  };
  
  const hideDialog = () => {
    setDialogVisible(false);
  };
  
  const validateForm = () => {
    let isValid = true;
    
    if (!serviceName.trim()) {
      setServiceNameError('Service name is required');
      isValid = false;
    } else {
      setServiceNameError('');
    }
    
    if (!duration) {
      setDurationError('Duration is required');
      isValid = false;
    } else if (isNaN(Number(duration)) || Number(duration) <= 0) {
      setDurationError('Duration must be a positive number');
      isValid = false;
    } else {
      setDurationError('');
    }
    
    return isValid;
  };
  
  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const serviceData: Service = {
        id: editingService?.id || `service-${Date.now()}`,
        name: serviceName.trim(),
        duration: Number(duration),
        price: price ? Number(price) : undefined,
      };
      
      let updatedServices: Service[];
      
      if (editingService) {
        // Update existing service
        updatedServices = services.map(s => 
          s.id === editingService.id ? serviceData : s
        );
      } else {
        // Add new service
        updatedServices = [...services, serviceData];
      }
      
      setServices(updatedServices);
      
      // Save to business data
      if (currentBusiness && user) {
        await dispatch(createOrUpdateBusiness({
          ...currentBusiness,
          services: updatedServices,
        }));
      }
      
      hideDialog();
    } catch (error) {
      console.error('Error saving service:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async (serviceId: string) => {
    try {
      const updatedServices = services.filter(s => s.id !== serviceId);
      setServices(updatedServices);
      
      // Save to business data
      if (currentBusiness && user) {
        await dispatch(createOrUpdateBusiness({
          ...currentBusiness,
          services: updatedServices,
        }));
      }
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };
  
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours} hr`;
    }
    
    return `${hours} hr ${remainingMinutes} min`;
  };
  
  if (!user || !currentBusiness) {
    return (
      <View style={styles.container}>
        <ActivityIndicator 
          size="large" 
          color="#4A00E0" 
          animating={true}
          useNativeDriver={Platform.OS !== 'web'} 
        />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4A00E0', '#8E2DE2']} style={styles.header}>
        <View style={styles.headerContent}>
          <MaterialCommunityIcons name="briefcase" size={32} color="white" />
          <Text variant="headlineMedium" style={styles.headerTitle}>
            Services
          </Text>
        </View>
      </LinearGradient>
      
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Card style={styles.infoCard}>
          <Card.Content>
            <View style={styles.infoHeader}>
              <Text variant="titleLarge" style={styles.infoTitle}>
                Your Services
              </Text>
              <Text variant="bodyMedium" style={styles.infoSubtitle}>
                Manage what you offer to your customers
              </Text>
            </View>
          </Card.Content>
        </Card>
        
        {services.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <MaterialCommunityIcons name="package-variant" size={64} color="#4A00E0" />
              <Text variant="titleMedium" style={styles.emptyTitle}>No Services</Text>
              <Text style={styles.emptyText}>
                You haven't added any services yet. Add services that your customers can book.
              </Text>
              <Button 
                mode="contained" 
                onPress={() => showDialog()}
                style={styles.addFirstButton}
              >
                Add Your First Service
              </Button>
            </Card.Content>
          </Card>
        ) : (
          <>
            {services.map(service => (
              <Card key={service.id} style={styles.serviceCard}>
                <Card.Content>
                  <View style={styles.serviceHeader}>
                    <Text variant="titleMedium" style={styles.serviceName}>{service.name}</Text>
                    <View style={styles.serviceActions}>
                      <IconButton 
                        icon="pencil" 
                        size={20} 
                        onPress={() => showDialog(service)}
                        style={styles.editButton}
                      />
                      <IconButton 
                        icon="delete" 
                        size={20} 
                        onPress={() => handleDelete(service.id)}
                        style={styles.deleteButton}
                      />
                    </View>
                  </View>
                  
                  <View style={styles.serviceDetails}>
                    <View style={styles.detailItem}>
                      <MaterialCommunityIcons name="clock-outline" size={18} color="#666" />
                      <Text style={styles.detailText}>{formatDuration(service.duration)}</Text>
                    </View>
                    
                    {service.price !== undefined && (
                      <View style={styles.detailItem}>
                        <MaterialCommunityIcons name="currency-usd" size={18} color="#666" />
                        <Text style={styles.detailText}>${service.price.toFixed(2)}</Text>
                      </View>
                    )}
                  </View>
                </Card.Content>
              </Card>
            ))}
          </>
        )}
      </ScrollView>
      
      {/* FAB for adding service */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => showDialog()}
        color="white"
      />
      
      {/* Dialog for adding/editing service */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDialog} style={styles.dialog}>
          <Dialog.Title>{editingService ? 'Edit Service' : 'Add New Service'}</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Service Name"
              value={serviceName}
              onChangeText={setServiceName}
              mode="outlined"
              error={!!serviceNameError}
              style={styles.input}
            />
            {serviceNameError ? <HelperText type="error">{serviceNameError}</HelperText> : null}
            
            <TextInput
              label="Duration (minutes)"
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
              mode="outlined"
              error={!!durationError}
              style={styles.input}
            />
            {durationError ? <HelperText type="error">{durationError}</HelperText> : null}
            
            <TextInput
              label="Price (optional)"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
              placeholder="Leave empty if price varies"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button 
              onPress={handleSave} 
              mode="contained"
              loading={isSubmitting}
              disabled={isSubmitting}
              animating={true}
            >
              {editingService ? 'Update' : 'Add'}
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
    paddingBottom: 80, // Add padding for FAB
  },
  infoCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  infoHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  infoTitle: {
    fontWeight: 'bold',
    color: '#4A00E0',
    marginBottom: 4,
  },
  infoSubtitle: {
    color: '#666',
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
    marginBottom: 24,
  },
  addFirstButton: {
    borderRadius: 8,
  },
  serviceCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  serviceName: {
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  serviceActions: {
    flexDirection: 'row',
  },
  editButton: {
    margin: -8,
  },
  deleteButton: {
    margin: -8,
  },
  serviceDetails: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#555',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#4A00E0',
  },
  dialog: {
    borderRadius: 12,
  },
  input: {
    marginBottom: 12,
  },
  divider: {
    marginVertical: 16,
  },
});