import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

export default function ProfileScreen() {
  const colors = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: colors.tint }]}>
            <Text style={[styles.avatarText, { color: colors.onTint }]}>
              A
            </Text>
          </View>

          <Text style={[styles.name, { color: colors.text }]}>
            ayesha babar
          </Text>

          <Text style={[styles.role, { color: colors.textSecondary }]}>
            Student developer
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarText: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '700',
  },
  name: {
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '700',
  },
  role: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
});
