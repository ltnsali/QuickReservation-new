import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../features/auth/AuthContext';
import { Redirect } from 'expo-router';

export default function AuthLayout() {
  const { user } = useAuth();

  // If user is authenticated, redirect to app
  if (user) {
    // Redirect to the appropriate screen based on user type
    return <Redirect href="/(app)/index" />;
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#f5f5f5' },
          animation: 'fade',
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
      </Stack>
    </>
  );
}
