import { useColorScheme } from 'react-native';
import { lightColors, darkColors } from '@/constants/colors';

export function useTheme() {
  const colorScheme = useColorScheme();

  if (colorScheme === 'dark') {
    return darkColors;
  }

  return lightColors;
}
