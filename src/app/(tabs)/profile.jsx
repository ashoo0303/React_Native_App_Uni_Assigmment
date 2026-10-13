// ============================================
// PROFILE SCREEN
// This screen shows the student profile
// ============================================

import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

export default function ProfileScreen() {
  // Get the correct colors (light or dark)
  const colors = useTheme();

  return (
    // Outer box for the whole screen
    <View style={[styles.screen, { backgroundColor: colors.background }]}>

      {/* ScrollView lets the user scroll if content is long */}
      <ScrollView contentContainerStyle={styles.content}>

        {/* Header section in the middle */}
        <View style={styles.header}>

          {/* Circle avatar with the letter A */}
          <View style={[styles.avatar, { backgroundColor: colors.tint }]}>
            <Text style={[styles.avatarText, { color: colors.onTint }]}>
              A
            </Text>
          </View>

          {/* Name */}
          <Text style={[styles.name, { color: colors.text }]}>
            ayesha babar
          </Text>

          {/* Job / role under the name */}
          <Text style={[styles.role, { color: colors.textSecondary }]}>
            Student developer
          </Text>

        </View>
      </ScrollView>
    </View>
  );
}

// ============================================
// STYLES for the Profile screen
// ============================================
const styles = StyleSheet.create({
  // Full screen
  screen: {
    flex: 1,
  },

  // Content inside the scroll area
  content: {
    width: '100%',
    maxWidth: 640,           // don't get too wide on big screens
    alignSelf: 'center',     // center the content
    padding: 24,
  },

  // Top profile section
  header: {
    alignItems: 'center',    // center everything
    gap: 4,
    paddingVertical: 16,
  },

  // Purple circle for the avatar
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 999,       // round circle
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  // Big letter inside the avatar
  avatarText: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '700',
  },

  // Student name
  name: {
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '700',
  },

  // "Student developer" text
  role: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
});
