// ============================================
// useTheme = a small helper function
// It checks if the phone is in dark or light mode
// and gives us the matching colors
// ============================================

import { useColorScheme } from 'react-native';
import { lightColors, darkColors } from '@/constants/colors';

export function useTheme() {
  // useColorScheme tells us: "light" or "dark"
  const colorScheme = useColorScheme();

  // If phone is in dark mode, return dark colors
  if (colorScheme === 'dark') {
    return darkColors;
  }

  // Otherwise return light colors
  return lightColors;
}
