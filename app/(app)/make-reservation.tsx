import { View, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import {
  Text,
  Button,
  TextInput,
  Chip,
  Surface,
  ActivityIndicator,
  Snackbar,
} from 'react-native-paper';
import { useState, useCallback, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { useAppDispatch } from '../../store/hooks';
import { addReservationAsync } from '../../store/slices/reservationSlice';
import { Calendar } from 'react-native-calendars';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../features/auth/AuthContext';
import { RouteGuard } from '../utils/RouteGuard';
import type { Reservation } from '../../firebase/firestore';

// Available time slots
const TIME_SLOTS = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
];

export default function MakeReservationScreen() {
  return (
    <RouteGuard allowedRoles={['customer']}>
      <MakeReservationContent />
    </RouteGuard>
  );
}

function MakeReservationContent() {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [nameError, setNameError] = useState('');
  const [dateError, setDateError] = useState('');
  const [timeError, setTimeError] = useState('');
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [isTimeSlotsVisible, setTimeSlotsVisible] = useState(false);
  const [isFormValid, setFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Redirect business users away from this screen
  useEffect(() => {
    if (user?.role === 'business') {
      // Redirect to business dashboard
      router.replace('/');
    }
  }, [user]);

  // Return early if user is a business owner
  if (user?.role === 'business') {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator 
          size="large" 
          color="#4A00E0" 
          animating={true}
        />
        <Text style={{ marginTop: 16 }}>Redirecting...</Text>
      </View>
    );
  }

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Create marked dates object for the calendar
  const markedDates = {
    [selectedDate]: { selected: true, selectedColor: '#6200ee' },
  };

  // Update form validity whenever inputs change
  useEffect(() => {
    setFormValid(name.trim() !== '' && selectedDate !== '' && selectedTime !== '');
  }, [name, selectedDate, selectedTime]);

  const validateForm = () => {
    let valid = true;
    if (!name.trim()) {
      setNameError('Please enter your name');
      valid = false;
    } else {
      setNameError('');
    }
    if (!selectedDate) {
      setDateError('Please select a date');
      valid = false;
    } else {
      setDateError('');
    }
    if (!selectedTime) {
      setTimeError('Please select a time slot');
      valid = false;
    } else {
      setTimeError('');
    }
    return valid;
  };

  // Get businessId from URL params
  const params = useLocalSearchParams();
  const businessId = typeof params.businessId === 'string' ? params.businessId : '';

  const handleDateSelect = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (!user) {
      setNameError('You must be logged in to make a reservation');
      return;
    }

    // Create reservation with correct type
    const newReservation: Omit<Reservation, 'id' | 'userId' | 'createdAt'> = {
      customerName: name,
      date: selectedDate,
      time: selectedTime,
      notes,
      businessId: businessId || '',
      status: 'pending' as const,
      updatedAt: new Date().toISOString(),
      customerId: user.id
    };

    try {
      setIsLoading(true);
      await dispatch(addReservationAsync({ 
        reservation: newReservation, 
        userId: user.id 
      }));
      setShowSuccess(true);
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (error) {
      console.error('Failed to add reservation:', error);
      setNameError('Failed to save reservation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.formContainer} elevation={2}>
          <TextInput
            label="Full Name"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
            error={!!nameError}
            outlineColor="#4A00E0"
            activeOutlineColor="#4A00E0"
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

          <TouchableOpacity onPress={() => setCalendarVisible(!isCalendarVisible)}>
            <TextInput
              label="Selected Date"
              value={selectedDate}
              mode="outlined"
              style={styles.input}
              editable={false}
              error={!!dateError}
              right={<TextInput.Icon icon="calendar" />}
              outlineColor="#4A00E0"
              activeOutlineColor="#4A00E0"
            />
          </TouchableOpacity>
          {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}

          {isCalendarVisible && (
            <Surface style={styles.calendarContainer} elevation={1}>
              <Calendar
                minDate={today}
                onDayPress={(day: { dateString: string }) => {
                  handleDateSelect(day);
                  setCalendarVisible(false);
                }}
                markedDates={markedDates}
                theme={{
                  todayTextColor: '#4A00E0',
                  selectedDayBackgroundColor: '#4A00E0',
                  arrowColor: '#4A00E0',
                }}
              />
            </Surface>
          )}

          <TouchableOpacity onPress={() => setTimeSlotsVisible(!isTimeSlotsVisible)}>
            <TextInput
              label="Selected Time"
              value={selectedTime}
              mode="outlined"
              style={styles.input}
              editable={false}
              error={!!timeError}
              right={<TextInput.Icon icon="clock" />}
              outlineColor="#4A00E0"
              activeOutlineColor="#4A00E0"
            />
          </TouchableOpacity>
          {timeError ? <Text style={styles.errorText}>{timeError}</Text> : null}

          {isTimeSlotsVisible && (
            <View style={styles.timeSlotContainer}>
              {TIME_SLOTS.map(time => (
                <Chip
                  key={time}
                  selected={selectedTime === time}
                  onPress={() => handleTimeSelect(time)}
                  style={styles.timeChip}
                  selectedColor="#4A00E0"
                  mode={selectedTime === time ? 'flat' : 'outlined'}
                >
                  {time}
                </Chip>
              ))}
            </View>
          )}

          <TextInput
            label="Additional Notes"
            value={notes}
            onChangeText={setNotes}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.notesInput}
            outlineColor="#4A00E0"
            activeOutlineColor="#4A00E0"
          />

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.submitButton}
            loading={isLoading}
            disabled={isLoading}
          >
            Make Reservation
          </Button>

          <Button
            mode="outlined"
            onPress={() => router.back()}
            style={styles.cancelButton}
            disabled={isLoading}
            textColor="#4A00E0"
          >
            Cancel
          </Button>
        </Surface>
      </ScrollView>

      <Snackbar
        visible={showSuccess}
        duration={1500}
        onDismiss={() => setShowSuccess(false)}
        style={styles.snackbar}
      >
        Reservation saved successfully!
      </Snackbar>
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
  formContainer: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  input: {
    marginBottom: 8,
    backgroundColor: 'white',
  },
  errorText: {
    color: '#B00020',
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 8,
  },
  calendarContainer: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  timeSlotContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    marginTop: 8,
  },
  timeChip: {
    margin: 4,
  },
  notesInput: {
    marginBottom: 24,
    backgroundColor: 'white',
  },
  submitButton: {
    marginBottom: 12,
    borderRadius: 8,
  },
  buttonContent: {
    height: 48,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    borderColor: '#4A00E0',
    borderRadius: 8,
  },
  snackbar: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#4CAF50',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
