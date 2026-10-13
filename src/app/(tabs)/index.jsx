import { Alert, Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function HomeScreen() {
  const theme = useTheme();

  // This function runs when the button is pressed
  function handleButtonPress() {
    Alert.alert('Button pressed');
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.centerText}>
        ayesha babar
      </ThemedText>

      <ThemedText themeColor="textSecondary" style={styles.centerText}>
        Welcome to my React Native university assignment app.
      </ThemedText>

      <Pressable
        onPress={handleButtonPress}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: theme.tint },
          pressed ? styles.pressed : null,
        ]}>
        <ThemedText type="link" style={{ color: theme.onTint }}>
          Click me
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  centerText: {
    textAlign: 'center',
  },
  button: {
    marginTop: Spacing.two,
    paddingHorizontal: Spacing.five,
    paddingVertical: Spacing.three,
    borderRadius: Radius.pill,
  },
  pressed: {
    opacity: 0.8,
  },
});
