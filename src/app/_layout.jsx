import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

// Smooth fade when the splash screen hides
SplashScreen.setOptions({ duration: 600, fade: true });

// Root layout - this wraps the whole app
export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
