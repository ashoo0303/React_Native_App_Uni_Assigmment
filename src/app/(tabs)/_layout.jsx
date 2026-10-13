// ============================================
// TAB LAYOUT
// This creates the bottom tabs: Home and Profile
// ============================================

import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';

export default function TabLayout() {
  const colors = useTheme();

  return (
    <Tabs
      screenOptions={{
        // Top header bar
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: { color: colors.text, fontWeight: '700' },
        headerShadowVisible: false,

        // Screen background
        sceneStyle: { backgroundColor: colors.background },

        // Bottom tab bar colors
        tabBarActiveTintColor: colors.tint,           // selected tab
        tabBarInactiveTintColor: colors.textSecondary, // other tabs
        tabBarStyle: {
          backgroundColor: colors.backgroundElement,
          borderTopColor: colors.border,
        },
      }}>

      {/* HOME tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          // Icon changes when the tab is selected
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* PROFILE tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
