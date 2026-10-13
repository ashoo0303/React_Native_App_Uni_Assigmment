import { View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

// A View that automatically uses the theme background color
// type = which theme color to use (example: "background" or "tint")
export function ThemedView({ style, type = 'background', ...props }) {
  const theme = useTheme();
  const backgroundColor = theme[type];

  return (
    <View
      style={[{ backgroundColor: backgroundColor }, style]}
      {...props}
    />
  );
}
