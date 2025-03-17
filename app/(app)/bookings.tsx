import { View, ScrollView } from 'react-native';
import { Text, Card, IconButton, Divider } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { deleteReservation } from '../../store/slices/reservationSlice';

export default function BookingsScreen() {
  const dispatch = useDispatch();
  const reservations = useSelector((state: RootState) =>
    [...state.reservations.reservations].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  );

  const handleDelete = (id: string) => {
    dispatch(deleteReservation(id));
  };

  if (reservations.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <Text variant="headlineSmall" style={{ textAlign: 'center', marginBottom: 8 }}>
          No Reservations Yet
        </Text>
        <Text variant="bodyMedium" style={{ textAlign: 'center', opacity: 0.7 }}>
          Your upcoming reservations will appear here
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ padding: 16 }}>
        <Text variant="headlineMedium" style={{ marginBottom: 24 }}>
          My Reservations
        </Text>

        {reservations.map(reservation => (
          <Card key={reservation.id} style={{ marginBottom: 16 }}>
            <Card.Content>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text variant="titleLarge" style={{ marginBottom: 4 }}>
                    {reservation.name}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <IconButton icon="calendar" size={20} style={{ margin: 0, marginRight: 4 }} />
                    <Text variant="bodyMedium">{reservation.date}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <IconButton icon="clock" size={20} style={{ margin: 0, marginRight: 4 }} />
                    <Text variant="bodyMedium">{reservation.time}</Text>
                  </View>
                </View>
                <IconButton
                  icon="delete"
                  mode="outlined"
                  onPress={() => handleDelete(reservation.id)}
                />
              </View>
              {reservation.notes && (
                <>
                  <Divider style={{ marginVertical: 8 }} />
                  <Text variant="bodySmall" style={{ opacity: 0.7 }}>
                    {reservation.notes}
                  </Text>
                </>
              )}
            </Card.Content>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}
