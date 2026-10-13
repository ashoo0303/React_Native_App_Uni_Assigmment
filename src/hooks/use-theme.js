import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

// This hook returns the correct colors for light or dark mode
export function useTheme() {
  const colorScheme = useColorScheme();

  if (colorScheme === 'dark') {
    return Colors.dark;
  }

  return Colors.light;
}
