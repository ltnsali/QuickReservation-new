import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider } from './features/auth/AuthContext';
import { Provider } from 'react-redux';
import { store } from '../store';
import { StyleSheet, View } from 'react-native';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <PaperProvider>
          <View style={styles.container}>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(app)" options={{ headerShown: false }} />
            </Stack>
          </View>
        </PaperProvider>
      </AuthProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    style: { pointerEvents: 'box-none' }
  },
});
