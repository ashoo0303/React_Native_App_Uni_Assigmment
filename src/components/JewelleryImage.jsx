import { Image, StyleSheet, View } from 'react-native';
import { colors } from '@/constants/colors';
import { resolveImageSource } from '@/constants/images';

export function JewelleryImage({ src, style }) {
  const source = resolveImageSource(src);
  if (!source) {
    return <View style={[styles.fallback, style]} />;
  }
  return <Image source={source} style={[styles.image, style]} />;
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.sand,
  },
  fallback: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.sand,
  },
});
