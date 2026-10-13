// ============================================
// HOME SCREEN
// This is the first screen you see in the app
// ============================================

// Import tools from React Native
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

// Import our color helper
import { useTheme } from '@/hooks/use-theme';

// This is the Home screen component
export default function HomeScreen() {
  // Get the correct colors (light or dark)
  const colors = useTheme();

  // This function runs when the user taps the button
  function handleButtonPress() {
    // Alert shows a popup message on the phone
    Alert.alert('Button pressed');
  }

  // return = what shows on the screen
  return (
    // View is like a <div> in HTML — a box/container
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      {/* Text shows words on the screen */}
      <Text style={[styles.title, { color: colors.text }]}>
        ayesha babar
      </Text>

      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Welcome to my React Native university assignment app.
      </Text>

      {/* Pressable is a button you can tap */}
      <Pressable
        onPress={handleButtonPress}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: colors.tint },
          // When pressed, make the button a little see-through
          pressed ? styles.buttonPressed : null,
        ]}>
        <Text style={[styles.buttonText, { color: colors.onTint }]}>
          Click me
        </Text>
      </Pressable>

    </View>
  );
}

// ============================================
// STYLES
// StyleSheet is how we style things in React Native
// (similar to CSS, but written in JavaScript)
// ============================================
const styles = StyleSheet.create({
  // Main screen box
  container: {
    flex: 1,                 // take up the full screen
    alignItems: 'center',    // center left-right
    justifyContent: 'center', // center top-bottom
    gap: 16,                 // space between children
    paddingHorizontal: 24,   // space on left and right
  },

  // Big title text
  title: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '700',       // bold
    textAlign: 'center',
  },

  // Smaller gray text under the title
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    textAlign: 'center',
  },

  // Purple button
  button: {
    marginTop: 8,
    paddingHorizontal: 32,   // left/right padding inside button
    paddingVertical: 16,     // top/bottom padding inside button
    borderRadius: 999,       // makes it fully round (pill shape)
  },

  // Style when finger is pressing the button
  buttonPressed: {
    opacity: 0.8,            // 80% visible
  },

  // Text inside the button
  buttonText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
});
