import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Field } from '@/components/ui';
import { colors } from '@/constants/colors';
import { EMAIL_PATTERN } from '@/constants/content';
import { fonts } from '@/constants/fonts';

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});

  function onSubmit() {
    const next = {};
    if (!EMAIL_PATTERN.test(email.trim())) next.email = 'Please enter a valid email address.';
    if (password.length < 8) next.password = 'Please use at least 8 characters.';
    setErrors(next);
    if (Object.keys(next).length) return;
    router.replace('/');
  }

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" style={styles.screen}>
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.copy}>Sign in to view your orders, wishlist and private offers.</Text>
      <Field
        label="Email address"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
      />
      <Field
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry={!showPassword}
        error={errors.password}
      />
      <Pressable onPress={() => setShowPassword((value) => !value)}>
        <Text style={styles.link}>{showPassword ? 'Hide password' : 'Show password'}</Text>
      </Pressable>
      <Pressable onPress={() => setRemember((value) => !value)} style={styles.row}>
        <View style={[styles.box, remember && styles.boxOn]}>
          <Text style={styles.tick}>{remember ? '✓' : ''}</Text>
        </View>
        <Text style={styles.copy}>Keep me signed in on this device</Text>
      </Pressable>
      <Button label="Sign in" onPress={onSubmit} />
      <Button label="Continue shopping as a guest" variant="outline" onPress={() => router.replace('/')} />
      <Pressable onPress={() => router.navigate('/contact')}>
        <Text style={styles.link}>Forgot password?</Text>
      </Pressable>
      <Pressable onPress={() => router.push('/sign-up')}>
        <Text style={styles.switchText}>
          New to Aurelia? <Text style={styles.link}>Create an account</Text>
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ivory },
  content: { padding: 20, gap: 12, paddingBottom: 40 },
  title: { fontFamily: fonts.serif, fontSize: 28, color: colors.ink },
  copy: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 21, color: colors.ink600, flex: 1 },
  link: { fontFamily: fonts.sansSemi, color: colors.gold700, fontSize: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  box: { width: 22, height: 22, borderRadius: 6, borderWidth: 1, borderColor: colors.ink300, alignItems: 'center', justifyContent: 'center' },
  boxOn: { backgroundColor: colors.gold500, borderColor: colors.gold500 },
  tick: { fontFamily: fonts.sansBold, color: colors.ink },
  switchText: { fontFamily: fonts.sans, color: colors.ink600, textAlign: 'center', marginTop: 8 },
});
