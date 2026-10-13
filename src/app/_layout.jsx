// ============================================
// ROOT LAYOUT
// This is the main wrapper for the whole app
// Expo Router starts here
// ============================================

import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

// Make the splash screen fade out smoothly
SplashScreen.setOptions({ duration: 600, fade: true });

export default function RootLayout() {
  return (
    // Stack = how screens are stacked on top of each other
    // headerShown: false = hide the default top header here
    // (the tabs layout has its own header)
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
