import { Stack } from 'expo-router';
import { Provider, useDispatch } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { store, AppDispatch } from '../store';
import { useEffect } from 'react';
import { fetchReservations } from '../store/slices/reservationSlice';
import { Slot } from 'expo-router';

// Create a separate component for Redux-dependent code
function AppContent() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    void dispatch(fetchReservations());
  }, [dispatch]);

  return <Slot />;
}

// Root layout that provides the Redux store
export default function RootLayout() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <AppContent />
      </PaperProvider>
    </Provider>
  );
}
