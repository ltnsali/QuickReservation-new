import { Provider, useDispatch } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { store, AppDispatch } from '../store';
import { Slot } from 'expo-router';
import { useEffect } from 'react';
import { fetchReservations } from '../store/slices/reservationSlice';

// Create a separate component for Redux-dependent code
function AppContent() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Fetch reservations when the app starts
    void dispatch(fetchReservations());
  }, [dispatch]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <AppContent />
      </PaperProvider>
    </Provider>
  );
}
