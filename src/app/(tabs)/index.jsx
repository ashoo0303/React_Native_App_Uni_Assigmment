import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

export default function HomeScreen() {
  const colors = useTheme();

  function handleButtonPress() {
    Alert.alert('Button pressed');
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        ayesha babar
      </Text>

      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Welcome to my React Native university assignment app.
      </Text>

      <Pressable
        onPress={handleButtonPress}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: colors.tint },
          pressed ? styles.buttonPressed : null,
        ]}>
        <Text style={[styles.buttonText, { color: colors.onTint }]}>
          Click me
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    textAlign: 'center',
  },
  button: {
    marginTop: 8,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 999,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
});
