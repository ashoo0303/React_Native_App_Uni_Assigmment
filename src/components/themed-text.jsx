import { StyleSheet, Text } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

// A Text component that uses theme colors and text styles
// type = text style: default, title, subtitle, small, smallBold, or link
// themeColor = optional color name (example: "textSecondary")
export function ThemedText({ style, type = 'default', themeColor, ...props }) {
  const theme = useTheme();

  // Choose text color
  let color = theme.text;

  if (themeColor) {
    color = theme[themeColor];
  } else if (type === 'link') {
    color = theme.tint;
  }

  return (
    <Text
      style={[{ color: color }, styles[type], style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  title: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '700',
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  smallBold: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
});
