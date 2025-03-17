import { View, ScrollView, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Text, Button, TextInput, Chip, Surface } from 'react-native-paper';
import { useState, useCallback, useEffect } from 'react';
import { router } from 'expo-router';
import { useDispatch } from 'react-redux';
import { addReservation } from '../../store/slices/reservationSlice';
import { Calendar } from 'react-native-calendars';

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
  const dispatch = useDispatch();
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

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const newReservation = {
      id: Date.now().toString(),
      name,
      date: selectedDate,
      time: selectedTime,
      notes,
      createdAt: new Date().toISOString(),
    };

    dispatch(addReservation(newReservation));
    router.back();
  };

  const handleDateSelect = day => {
    setSelectedDate(day.dateString);
  };

  const handleTimeSelect = time => {
    setSelectedTime(time);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Make a Reservation
        </Text>

        {nameError || dateError || timeError ? (
          <Text style={styles.errorText}>{nameError || dateError || timeError}</Text>
        ) : null}

        <TextInput
          label="Full Name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
        />
        {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

        <TouchableOpacity onPress={() => setCalendarVisible(!isCalendarVisible)}>
          <TextInput
            label="Selected Date"
            value={selectedDate}
            mode="outlined"
            style={styles.input}
            editable={false}
          />
        </TouchableOpacity>
        {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}

        {isCalendarVisible && (
          <Surface style={styles.calendarContainer} elevation={1}>
            <Calendar
              minDate={today}
              onDayPress={day => {
                handleDateSelect(day);
                setCalendarVisible(false);
              }}
              markedDates={markedDates}
              theme={{
                todayTextColor: '#6200ee',
                selectedDayBackgroundColor: '#6200ee',
                arrowColor: '#6200ee',
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
        />

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
          disabled={!isFormValid}
        >
          Submit Reservation
        </Button>

        <Button mode="outlined" onPress={() => router.back()}>
          Cancel
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 8,
    marginTop: 8,
  },
  calendarContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  timeSlotContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  timeChip: {
    margin: 4,
  },
  notesInput: {
    marginBottom: 24,
  },
  submitButton: {
    marginBottom: 16,
  },
});
