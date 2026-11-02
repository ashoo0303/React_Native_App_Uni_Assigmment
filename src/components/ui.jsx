import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';

export function Field({ label, error, style, ...props }) {
  return (
    <View style={styles.field}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.ink400}
        style={[styles.input, props.multiline && styles.multiline, style]}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

export function Button({ label, onPress, variant = 'gold', disabled, style }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        variant === 'gold' && styles.gold,
        variant === 'dark' && styles.dark,
        variant === 'outline' && styles.outline,
        variant === 'light' && styles.light,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}>
      <Text
        style={[
          styles.buttonText,
          variant === 'dark' || variant === 'light' ? styles.lightText : styles.darkText,
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function Chip({ label, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}>
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

export function Eyebrow({ children, light }) {
  return <Text style={[styles.eyebrow, light && styles.eyebrowLight]}>{children}</Text>;
}

export function StatusBanner({ type, message }) {
  if (!message) return null;
  return (
    <Text
      style={[
        styles.status,
        type === 'success' && styles.statusOk,
        type === 'error' && styles.statusError,
        type === 'info' && styles.statusInfo,
      ]}>
      {message}
    </Text>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 6,
  },
  label: {
    fontFamily: fonts.sansSemi,
    fontSize: 13,
    color: colors.ink800,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.ink200,
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.ink,
  },
  multiline: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  error: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.danger,
  },
  button: {
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gold: {
    backgroundColor: colors.gold400,
  },
  dark: {
    backgroundColor: colors.ink900,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.ink300,
  },
  light: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.82,
  },
  buttonText: {
    fontFamily: fonts.sansSemi,
    fontSize: 14,
  },
  darkText: {
    color: colors.ink,
  },
  lightText: {
    color: colors.white,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.ink200,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipSelected: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  chipText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.ink700,
  },
  chipTextSelected: {
    color: colors.white,
  },
  eyebrow: {
    fontFamily: fonts.sansSemi,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.gold700,
  },
  eyebrowLight: {
    color: colors.gold300,
  },
  status: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: fonts.sans,
    fontSize: 14,
    overflow: 'hidden',
  },
  statusOk: {
    backgroundColor: colors.okBg,
    color: colors.ok,
  },
  statusError: {
    backgroundColor: colors.dangerBg,
    color: colors.danger,
  },
  statusInfo: {
    backgroundColor: colors.gold50,
    color: colors.ink900,
  },
});
