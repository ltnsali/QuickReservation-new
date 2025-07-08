import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider } from './features/auth/AuthContext';
import { Provider } from 'react-redux';
import { store } from '../store';
import { StyleSheet, View, Platform } from 'react-native';
import { LoggerProvider, DebugOverlay } from '../components/DebugLogger';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <PaperProvider>
          <LoggerProvider>
            <View style={[styles.container, { pointerEvents: 'box-none' }]}>
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(app)" options={{ headerShown: false }} />
              </Stack>
              {/* Only show debug overlay on native platforms */}
              {Platform.OS !== 'web' && <DebugOverlay />}
            </View>
          </LoggerProvider>
        </PaperProvider>
      </AuthProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
