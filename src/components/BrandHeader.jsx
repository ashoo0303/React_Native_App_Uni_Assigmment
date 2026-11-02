import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { useStore } from '@/context/StoreContext';

export function BrandHeader() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { cartCount, banner } = useStore();

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + 6 }]}>
      <View style={styles.row}>
        <View style={styles.brandBlock}>
          <Image source={require('../../assets/images/icon.png')} style={styles.mark} />
          <View>
            <Text style={styles.brand} numberOfLines={1}>
              Aurelia
            </Text>
            <Text style={styles.sub}>Jewels</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <HeaderButton icon="log-in-outline" label="Sign in" onPress={() => router.push('/sign-in')} />
          <HeaderButton icon="person-add-outline" label="Sign up" onPress={() => router.push('/sign-up')} />
          <HeaderButton
            icon="bag-handle-outline"
            label="Bag"
            badge={cartCount > 0 ? String(cartCount) : ''}
            onPress={() => router.push('/bag')}
          />
        </View>
      </View>
      {banner ? <Text style={styles.banner}>{banner}</Text> : null}
    </View>
  );
}

function HeaderButton({ icon, label, onPress, badge }) {
  return (
    <Pressable onPress={onPress} style={styles.iconBtn} accessibilityLabel={label}>
      <View>
        <Ionicons name={icon} size={20} color={colors.ink} />
        {badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.iconLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.ink100,
    paddingHorizontal: 12,
    paddingBottom: 8,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  brandBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  mark: {
    width: 36,
    height: 36,
    borderRadius: 10,
  },
  brand: {
    fontFamily: fonts.serif,
    fontSize: 18,
    lineHeight: 20,
    color: colors.ink,
  },
  sub: {
    fontFamily: fonts.sansSemi,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.gold700,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  iconBtn: {
    width: 54,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    gap: 2,
  },
  iconLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 10,
    color: colors.ink700,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 4,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: fonts.sansSemi,
    fontSize: 10,
    color: colors.ink,
  },
  banner: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.white,
    backgroundColor: colors.ink,
    borderRadius: 12,
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
