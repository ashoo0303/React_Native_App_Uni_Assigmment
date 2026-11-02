import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Field } from '@/components/ui';
import { colors } from '@/constants/colors';
import { EMAIL_PATTERN, PHONE_PATTERN } from '@/constants/content';
import { fonts } from '@/constants/fonts';

export default function SignUpScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [terms, setTerms] = useState(false);
  const [newsletter, setNewsletter] = useState(true);
  const [errors, setErrors] = useState({});

  const rules = [
    { label: '8+ characters', ok: password.length >= 8 },
    { label: 'Upper & lower case', ok: /[a-z]/.test(password) && /[A-Z]/.test(password) },
    { label: 'A number', ok: /\d/.test(password) },
  ];
  const score = rules.filter((rule) => rule.ok).length;
  const strength = ['Too weak', 'Fair', 'Good', 'Strong'][password ? Math.max(score - 1, 0) : 0];

  function onSubmit() {
    const next = {};
    if (firstName.trim().length < 2) next.firstName = 'Please use at least 2 characters.';
    if (lastName.trim().length < 2) next.lastName = 'Please use at least 2 characters.';
    if (!EMAIL_PATTERN.test(email.trim())) next.email = 'Please enter a valid email address.';
    if (phone.trim() && !PHONE_PATTERN.test(phone.trim())) next.phone = 'Please enter a valid phone number.';
    const strong = password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password);
    if (!strong) next.password = 'Use 8+ characters with upper & lower case letters and a number.';
    if (confirm !== password) next.confirm = 'Passwords do not match.';
    if (!terms) next.terms = 'Please tick this box to continue.';
    setErrors(next);
    if (Object.keys(next).length) return;
    router.replace('/');
  }

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" style={styles.screen}>
      <Text style={styles.kicker}>Join the Aurelia circle</Text>
      <Text style={styles.title}>Create your account</Text>
      <Text style={styles.copy}>It takes less than a minute. No payment details required, and nothing is stored as an account.</Text>
      <Text style={styles.benefit}>Welcome gift on your first order</Text>
      <Text style={styles.benefit}>Save favourites and build wishlists</Text>
      <Text style={styles.benefit}>Free lifetime cleaning and care</Text>
      <Field label="First name" value={firstName} onChangeText={setFirstName} placeholder="Ayesha" error={errors.firstName} />
      <Field label="Last name" value={lastName} onChangeText={setLastName} placeholder="Babar" error={errors.lastName} />
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
        label="Phone (optional)"
        value={phone}
        onChangeText={setPhone}
        placeholder="+92 300 0000000"
        keyboardType="phone-pad"
        error={errors.phone}
      />
      <Field
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Create a strong password"
        secureTextEntry={!showPassword}
        error={errors.password}
      />
      <Pressable onPress={() => setShowPassword((value) => !value)}>
        <Text style={styles.link}>{showPassword ? 'Hide password' : 'Show password'}</Text>
      </Pressable>
      <Text style={styles.strength}>{password ? `Password strength: ${strength}` : 'Password strength: enter a password'}</Text>
      {rules.map((rule) => (
        <Text key={rule.label} style={[styles.rule, rule.ok && styles.ruleOk]}>
          {rule.ok ? '✓' : '•'} {rule.label}
        </Text>
      ))}
      <Field
        label="Confirm password"
        value={confirm}
        onChangeText={setConfirm}
        placeholder="Re-enter your password"
        secureTextEntry={!showConfirm}
        error={errors.confirm}
      />
      <Pressable onPress={() => setShowConfirm((value) => !value)}>
        <Text style={styles.link}>{showConfirm ? 'Hide password' : 'Show password'}</Text>
      </Pressable>
      <Check label="I agree to the Terms of Service and acknowledge the Privacy Policy." checked={terms} onPress={() => setTerms((value) => !value)} />
      {errors.terms ? <Text style={styles.error}>{errors.terms}</Text> : null}
      <Check label="Send me news about new collections and private offers." checked={newsletter} onPress={() => setNewsletter((value) => !value)} />
      <Button label="Create account" onPress={onSubmit} />
      <Pressable onPress={() => router.push('/sign-in')}>
        <Text style={styles.switchText}>
          Already have an account? <Text style={styles.link}>Sign in</Text>
        </Text>
      </Pressable>
    </ScrollView>
  );
}

function Check({ label, checked, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <View style={[styles.box, checked && styles.boxOn]}>
        <Text style={styles.tick}>{checked ? '✓' : ''}</Text>
      </View>
      <Text style={styles.copy}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ivory },
  content: { padding: 20, gap: 12, paddingBottom: 48 },
  kicker: { fontFamily: fonts.sansSemi, color: colors.gold700, letterSpacing: 1.4, textTransform: 'uppercase', fontSize: 11 },
  title: { fontFamily: fonts.serif, fontSize: 28, color: colors.ink },
  copy: { flex: 1, fontFamily: fonts.sans, fontSize: 14, lineHeight: 21, color: colors.ink600 },
  benefit: { fontFamily: fonts.sansMedium, color: colors.ink800, fontSize: 14 },
  link: { fontFamily: fonts.sansSemi, color: colors.gold700, fontSize: 14 },
  strength: { fontFamily: fonts.sansMedium, color: colors.ink600, fontSize: 12 },
  rule: { fontFamily: fonts.sans, color: colors.ink500, fontSize: 12 },
  ruleOk: { color: colors.ok },
  error: { fontFamily: fonts.sans, color: colors.danger, fontSize: 12 },
  row: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  box: { width: 22, height: 22, borderRadius: 6, borderWidth: 1, borderColor: colors.ink300, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  boxOn: { backgroundColor: colors.gold500, borderColor: colors.gold500 },
  tick: { fontFamily: fonts.sansBold, color: colors.ink },
  switchText: { textAlign: 'center', fontFamily: fonts.sans, color: colors.ink600, marginTop: 8 },
});
