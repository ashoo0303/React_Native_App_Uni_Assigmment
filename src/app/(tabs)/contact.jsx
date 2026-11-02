import { useCallback, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { BrandHeader } from '@/components/BrandHeader';
import { Button, Chip, Eyebrow, Field, StatusBanner } from '@/components/ui';
import { colors } from '@/constants/colors';
import { EMAIL_PATTERN, HOURS, PHONE_PATTERN, STORE, TOPICS } from '@/constants/content';
import { fonts } from '@/constants/fonts';
import { useStore } from '@/context/StoreContext';
import { postFormspree } from '@/lib/forms';

export default function ContactScreen() {
  const { consumeEnquiry, showBanner } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', message: '' });
  const [sending, setSending] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const draft = consumeEnquiry();
      if (!draft) return;
      if (draft.topic) setTopic(draft.topic);
      if (typeof draft.message === 'string') setMessage(draft.message.slice(0, 1000));
      setStatus({
        type: 'info',
        message:
          'We have added the items from your bag to your message. Fill in your details and send it to complete your order request.',
      });
    }, [consumeEnquiry]),
  );

  function validate() {
    const next = {};
    if (name.trim().length < 2) next.name = 'Please use at least 2 characters.';
    if (!EMAIL_PATTERN.test(email.trim())) next.email = 'Please enter a valid email address.';
    if (phone.trim() && !PHONE_PATTERN.test(phone.trim())) next.phone = 'Please enter a valid phone number.';
    if (!topic) next.topic = 'Please choose an option.';
    if (message.trim().length < 10) next.message = 'Please use at least 10 characters.';
    if (message.length > 1000) next.message = 'Please keep the message within 1000 characters.';
    if (!consent) next.consent = 'Please tick this box to continue.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit() {
    setStatus({ type: '', message: '' });
    if (!validate()) return;
    setSending(true);
    try {
      await postFormspree({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        topic,
        message: message.trim(),
        consent: 'yes',
        _subject: 'New enquiry from the Aurelia Jewels website',
      });
      setName('');
      setEmail('');
      setPhone('');
      setTopic('');
      setMessage('');
      setConsent(false);
      setErrors({});
      setStatus({
        type: 'success',
        message: 'Thank you! Your message has been sent and our team will reply shortly.',
      });
      showBanner('Message sent successfully');
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Network error. Please check your connection and try again.',
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <View style={styles.screen}>
      <BrandHeader />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <Eyebrow light>We’d love to hear from you</Eyebrow>
          <Text style={styles.heroTitle}>Let’s talk jewellery</Text>
          <Text style={styles.heroCopy}>
            Whether you are planning a proposal, a wedding or a thoughtful gift, our concierge team will reply within one working day.
          </Text>
        </View>

        <InfoCard title="Visit the showroom" body={STORE.addressLines.join('\n')} />
        <InfoCard title="Call us" body={`${STORE.phone}\n11:00 – 20:00, Mon–Sat`} onPress={() => Linking.openURL(STORE.phoneHref)} />
        <InfoCard title="Email us" body={`${STORE.email}\nReplies within 24 hours`} onPress={() => Linking.openURL(STORE.emailHref)} />

        <View style={styles.card}>
          <Eyebrow>Send a message</Eyebrow>
          <Text style={styles.heading}>How can we help?</Text>
          <Text style={styles.copy}>Fill in the form and a member of our team will get back to you personally.</Text>
          <Field label="Full name *" value={name} onChangeText={setName} placeholder="e.g. Ayesha Babar" error={errors.name} />
          <Field
            label="Email address *"
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
          <Text style={styles.label}>Enquiry type *</Text>
          <View style={styles.topics}>
            {TOPICS.map((item) => (
              <Chip key={item} label={item} selected={topic === item} onPress={() => setTopic(item)} />
            ))}
          </View>
          {errors.topic ? <Text style={styles.error}>{errors.topic}</Text> : null}
          <Field
            label="Your message *"
            value={message}
            onChangeText={(value) => setMessage(value.slice(0, 1000))}
            placeholder="Tell us about the piece, occasion or question you have in mind..."
            multiline
            error={errors.message}
          />
          <Text style={styles.counter}>{message.length}/1000</Text>
          <Pressable onPress={() => setConsent((value) => !value)} style={styles.consent}>
            <View style={[styles.box, consent && styles.boxOn]}>
              <Text style={styles.tick}>{consent ? '✓' : ''}</Text>
            </View>
            <Text style={styles.consentText}>I agree to be contacted by Aurelia Jewels about my enquiry. *</Text>
          </Pressable>
          {errors.consent ? <Text style={styles.error}>{errors.consent}</Text> : null}
          <StatusBanner type={status.type} message={status.message} />
          <Button label={sending ? 'Sending…' : 'Send message'} onPress={onSubmit} disabled={sending} />
        </View>

        <View style={styles.card}>
          <Text style={styles.heading}>Opening hours</Text>
          {HOURS.map(([day, time]) => (
            <View key={day} style={styles.hour}>
              <Text style={styles.hourDay}>{day}</Text>
              <Text style={styles.hourTime}>{time}</Text>
            </View>
          ))}
          <Text style={styles.copy}>{STORE.hoursSummary}. {STORE.sunday}.</Text>
        </View>

        <View style={styles.note}>
          <Text style={styles.copy}>
            Planning a bridal visit? Book at least 3 days ahead so we can reserve a private lounge and prepare pieces for you.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.heading}>Prefer chat?</Text>
          <Text style={styles.copy}>Message our concierge on WhatsApp for quick questions and photos of pieces.</Text>
          <Button label="Chat on WhatsApp" variant="dark" onPress={() => Linking.openURL(STORE.whatsapp)} />
        </View>

        <View style={styles.card}>
          <Eyebrow>Quick answers</Eyebrow>
          <Text style={styles.heading}>Before you write to us</Text>
          <Text style={styles.question}>How quickly will I get a reply?</Text>
          <Text style={styles.copy}>We respond to every enquiry within one working day, and usually within a few hours during showroom opening times.</Text>
          <Text style={styles.question}>Can I see a piece before I buy it?</Text>
          <Text style={styles.copy}>Yes. Book a private viewing and we will have your selected pieces ready, or arrange a video consultation if you are out of town.</Text>
          <Text style={styles.question}>Do you offer repairs for jewellery bought elsewhere?</Text>
          <Text style={styles.copy}>We service most fine jewellery. Send us a photo through the form and we will give you an estimate before any work begins.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function InfoCard({ title, body, onPress }) {
  const content = (
    <View style={styles.info}>
      <Text style={styles.infoTitle}>{title}</Text>
      <Text style={styles.copy}>{body}</Text>
    </View>
  );
  if (!onPress) return content;
  return <Pressable onPress={onPress}>{content}</Pressable>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ivory },
  content: { padding: 16, gap: 12, paddingBottom: 36 },
  hero: { backgroundColor: colors.ink, borderRadius: 24, padding: 20, gap: 8 },
  heroTitle: { fontFamily: fonts.serif, fontSize: 28, lineHeight: 34, color: colors.white },
  heroCopy: { fontFamily: fonts.sans, fontSize: 15, lineHeight: 22, color: colors.ink300 },
  info: { backgroundColor: colors.white, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.ink100, gap: 4 },
  infoTitle: { fontFamily: fonts.serif, fontSize: 20, color: colors.ink },
  card: { backgroundColor: colors.white, borderRadius: 24, padding: 16, gap: 10, borderWidth: 1, borderColor: colors.ink100 },
  heading: { fontFamily: fonts.serif, fontSize: 28, color: colors.ink },
  copy: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 21, color: colors.ink600 },
  label: { fontFamily: fonts.sansSemi, fontSize: 13, color: colors.ink800 },
  topics: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  counter: { alignSelf: 'flex-end', fontFamily: fonts.sans, fontSize: 12, color: colors.ink400 },
  error: { fontFamily: fonts.sans, fontSize: 12, color: colors.danger },
  consent: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  box: { width: 22, height: 22, borderRadius: 6, borderWidth: 1, borderColor: colors.ink300, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  boxOn: { backgroundColor: colors.gold500, borderColor: colors.gold500 },
  tick: { color: colors.ink, fontSize: 14, fontFamily: fonts.sansBold },
  consentText: { flex: 1, fontFamily: fonts.sans, fontSize: 14, lineHeight: 20, color: colors.ink700 },
  hour: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.ink100 },
  hourDay: { fontFamily: fonts.sansMedium, color: colors.ink800, fontSize: 14 },
  hourTime: { fontFamily: fonts.sans, color: colors.ink600, fontSize: 14 },
  note: { backgroundColor: colors.gold50, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: colors.gold200 },
  question: { fontFamily: fonts.sansSemi, color: colors.ink, fontSize: 15, marginTop: 6 },
});
