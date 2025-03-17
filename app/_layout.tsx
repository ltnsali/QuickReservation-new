import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { store } from '../store';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <Stack>
          <Stack.Screen
            name="(auth)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(app)"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </PaperProvider>
    </Provider>
  );
}
