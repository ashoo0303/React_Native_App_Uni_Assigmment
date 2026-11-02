import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { BrandHeader } from '@/components/BrandHeader';
import { JewelleryImage } from '@/components/JewelleryImage';
import { Button, Eyebrow, Field, StatusBanner } from '@/components/ui';
import { colors } from '@/constants/colors';
import {
  BESTSELLERS,
  EMAIL_PATTERN,
  HOME_FILTERS,
  PROMISES,
  REVIEWS,
  STORE,
  WHY,
} from '@/constants/content';
import { fonts } from '@/constants/fonts';
import { useStore } from '@/context/StoreContext';
import { formatPrice } from '@/lib/format';
import { postFormspree } from '@/lib/forms';

export default function HomeScreen() {
  const router = useRouter();
  const scrollRef = useRef(null);
  const whyOffset = useRef(0);
  const { addToCart, wishlist, toggleWishlist, showBanner } = useStore();
  const [filter, setFilter] = useState('all');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [sending, setSending] = useState(false);

  const visible = BESTSELLERS.filter((item) => filter === 'all' || item.category === filter);

  async function subscribe() {
    const value = email.trim();
    if (!value || !EMAIL_PATTERN.test(value)) {
      setEmailError('Please enter a valid email address.');
      setStatus({ type: '', message: '' });
      return;
    }
    setEmailError('');
    setSending(true);
    try {
      await postFormspree({
        email: value,
        _subject: 'Aurelia Jewels newsletter signup',
      });
      setEmail('');
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
      <ScrollView ref={scrollRef} contentContainerStyle={styles.content}>
        <View style={styles.announce}>
          <Text style={styles.announceText}>{STORE.delivery}</Text>
        </View>

        <View style={styles.hero}>
          <Text style={styles.badge}>New season collection</Text>
          <Text style={styles.heroTitle}>
            Jewellery that tells <Text style={styles.italic}>your story</Text>
          </Text>
          <Text style={styles.heroCopy}>
            Hallmarked gold, certified diamonds and lustrous pearls handcrafted by master artisans and delivered to your door, fully insured.
          </Text>
          <View style={styles.heroActions}>
            <Button label="Shop the collection" onPress={() => router.navigate('/shop')} />
            <Button label="Book a private viewing" variant="light" onPress={() => router.navigate('/contact')} />
          </View>
          <View style={styles.metrics}>
            <Metric label="Designs" value="1,200+" />
            <Metric label="Happy clients" value="48k" />
            <Metric label="Heritage" value="17 yrs" />
          </View>
          <View style={styles.heroImage}>
            <JewelleryImage src="assets/images/hero-necklace.jpg" />
          </View>
          <View style={styles.floatCard}>
            <Text style={styles.floatTitle}>22K hallmarked</Text>
            <Text style={styles.floatCopy}>Certificate with every piece</Text>
          </View>
          <Text style={styles.rating}>★★★★★  4.9 / 5 · 2,300+ verified reviews</Text>
        </View>

        <View style={styles.promises}>
          {PROMISES.map(([title, copy]) => (
            <View key={title} style={styles.promiseSlot}>
              <View style={styles.promise}>
                <Text style={styles.promiseTitle}>{title}</Text>
                <Text style={styles.promiseCopy}>{copy}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Eyebrow>Customer favourites</Eyebrow>
          <Text style={styles.sectionTitle}>This season’s bestsellers</Text>
          <Text style={styles.lead}>Tap a category, then add a favourite to your bag.</Text>
          <View style={styles.chips}>
            {HOME_FILTERS.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => setFilter(item.id)}
                style={[styles.chip, filter === item.id && styles.chipOn]}>
                <Text style={[styles.chipText, filter === item.id && styles.chipTextOn]}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
          {visible.length === 0 ? (
            <Text style={styles.empty}>No pieces in this category yet — check back soon.</Text>
          ) : null}
          <View style={styles.grid}>
          {visible.map((item) => {
            const wished = wishlist.includes(item.id);
            return (
              <View key={item.id} style={styles.productSlot}>
              <View style={styles.product}>
                <View style={styles.figure}>
                  <JewelleryImage src={item.image} />
                  {item.badge ? (
                    <View style={styles.productBadge}>
                      <Text style={styles.productBadgeText}>{item.badge}</Text>
                    </View>
                  ) : null}
                  <Pressable
                    onPress={() => toggleWishlist(item.id)}
                    style={styles.heart}
                    accessibilityLabel={`Wishlist ${item.name}`}>
                    <Ionicons name={wished ? 'heart' : 'heart-outline'} size={18} color={wished ? '#c43b3b' : colors.ink} />
                  </Pressable>
                </View>
                <View style={styles.productBody}>
                  <Text style={styles.meta}>{item.meta}</Text>
                  <Text style={styles.productName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.price}>
                    {formatPrice(item.price)}
                    {item.compare ? <Text style={styles.compare}>  {formatPrice(item.compare)}</Text> : null}
                  </Text>
                  <Pressable
                    onPress={() =>
                      addToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        img: item.image,
                      })
                    }
                    style={styles.add}>
                    <Text style={styles.addText}>Add</Text>
                  </Pressable>
                </View>
              </View>
              </View>
            );
          })}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.bridalImage}>
            <JewelleryImage src="assets/images/jewelry-set-green-2.jpg" />
          </View>
          <View style={styles.offer}>
            <Text style={styles.offerKicker}>Limited offer</Text>
            <Text style={styles.offerTitle}>15% off</Text>
            <Text style={styles.offerCopy}>on complete bridal sets this wedding season.</Text>
          </View>
          <Eyebrow>The bridal edit</Eyebrow>
          <Text style={styles.sectionTitle}>Crafted for the most important day</Text>
          <Text style={styles.lead}>
            Our bridal consultants help you build a matching set necklace, earrings, tikka and bangles tailored to your outfit, budget and timeline.
          </Text>
          <Text style={styles.bullet}>Complimentary one to one styling session in our showroom</Text>
          <Text style={styles.bullet}>Custom engraving and resizing included with every ring</Text>
          <Text style={styles.bullet}>Secure, insured storage until your wedding week</Text>
          <View style={styles.heroActions}>
            <Button label="Book a consultation" variant="dark" onPress={() => router.navigate('/contact')} />
            <Button
              label="Our craftsmanship"
              variant="outline"
              onPress={() => scrollRef.current?.scrollTo({ y: whyOffset.current, animated: true })}
            />
          </View>
        </View>

        <View
          style={styles.section}
          onLayout={(event) => {
            whyOffset.current = event.nativeEvent.layout.y;
          }}>
          <Eyebrow>Why Aurelia</Eyebrow>
          <Text style={styles.sectionTitle}>Luxury you can trust, service you will love</Text>
          {WHY.map(([title, copy]) => (
            <View key={title} style={styles.why}>
              <Text style={styles.whyTitle}>{title}</Text>
              <Text style={styles.lead}>{copy}</Text>
            </View>
          ))}
        </View>

        <View style={styles.reviews}>
          <Eyebrow light>Client stories</Eyebrow>
          <Text style={styles.reviewHeading}>Loved by thousands of families</Text>
          {REVIEWS.map((review) => (
            <View key={review.name} style={styles.review}>
              <Text style={styles.stars}>★★★★★</Text>
              <Text style={styles.quote}>“{review.quote}”</Text>
              <Text style={styles.reviewName}>{review.name}</Text>
              <Text style={styles.reviewDetail}>{review.detail}</Text>
            </View>
          ))}
        </View>

        <View style={styles.newsletter}>
          <Text style={styles.sectionTitle}>Be first to see new collections</Text>
          <Text style={styles.lead}>
            Join our private list for early access, styling notes and an exclusive welcome gift on your first order.
          </Text>
          <Field
            label="Email address"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={emailError}
          />
          <StatusBanner type={status.type} message={status.message} />
          <Button label={sending ? 'Sending…' : 'Subscribe'} variant="dark" onPress={subscribe} disabled={sending} />
        </View>
      </ScrollView>
    </View>
  );
}

function Metric({ label, value }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ivory },
  content: { paddingBottom: 36 },
  announce: { backgroundColor: colors.ink, paddingHorizontal: 16, paddingVertical: 10 },
  announceText: { fontFamily: fonts.sansMedium, color: colors.gold200, fontSize: 12, textAlign: 'center' },
  hero: { backgroundColor: colors.ink, padding: 20, gap: 12 },
  badge: {
    alignSelf: 'flex-start',
    color: colors.gold300,
    borderColor: 'rgba(223,191,95,0.4)',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontFamily: fonts.sansSemi,
    fontSize: 12,
    overflow: 'hidden',
  },
  heroTitle: { fontFamily: fonts.serif, fontSize: 30, lineHeight: 36, color: colors.white },
  italic: { fontFamily: fonts.serif, color: colors.gold300 },
  heroCopy: { fontFamily: fonts.sans, fontSize: 16, lineHeight: 24, color: colors.ink300 },
  heroActions: { gap: 10 },
  metrics: { flexDirection: 'row', gap: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: 14 },
  metric: { flex: 1, gap: 4 },
  metricLabel: { fontFamily: fonts.sansSemi, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: colors.ink400 },
  metricValue: { fontFamily: fonts.serif, fontSize: 22, color: colors.white },
  heroImage: { height: 220, borderRadius: 20, overflow: 'hidden' },
  floatCard: { backgroundColor: colors.white, borderRadius: 16, padding: 14 },
  floatTitle: { fontFamily: fonts.sansSemi, color: colors.ink, fontSize: 15 },
  floatCopy: { fontFamily: fonts.sans, color: colors.ink500, fontSize: 12, marginTop: 2 },
  rating: { fontFamily: fonts.sansSemi, color: colors.gold300, fontSize: 13 },
  promises: { backgroundColor: colors.sand, paddingVertical: 10, paddingHorizontal: 10, flexDirection: 'row', flexWrap: 'wrap' },
  promiseSlot: { width: '50%', padding: 6 },
  promise: { flex: 1, backgroundColor: colors.white, borderRadius: 16, padding: 14, gap: 2 },
  promiseTitle: { fontFamily: fonts.sansSemi, color: colors.ink, fontSize: 15 },
  promiseCopy: { fontFamily: fonts.sans, color: colors.ink500, fontSize: 13 },
  section: { padding: 16, gap: 12 },
  sectionTitle: { fontFamily: fonts.serif, fontSize: 24, lineHeight: 30, color: colors.ink },
  lead: { fontFamily: fonts.sans, fontSize: 15, lineHeight: 22, color: colors.ink600 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderRadius: 999, borderWidth: 1, borderColor: colors.ink200, backgroundColor: colors.white, paddingHorizontal: 14, paddingVertical: 8 },
  chipOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  chipText: { fontFamily: fonts.sansMedium, color: colors.ink700, fontSize: 13 },
  chipTextOn: { color: colors.white },
  empty: { fontFamily: fonts.sans, color: colors.ink500, textAlign: 'center', marginVertical: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 },
  productSlot: { width: '50%', padding: 6 },
  product: { flex: 1, backgroundColor: colors.white, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: colors.ink100 },
  figure: { height: 148, backgroundColor: colors.sand },
  productBadge: { position: 'absolute', left: 12, top: 12, backgroundColor: colors.ink, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  productBadgeText: { color: colors.white, fontFamily: fonts.sansSemi, fontSize: 11 },
  heart: { position: 'absolute', right: 12, top: 12, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' },
  productBody: { padding: 10, gap: 4 },
  meta: { fontFamily: fonts.sansSemi, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: colors.ink400 },
  productName: { fontFamily: fonts.serif, fontSize: 16, lineHeight: 20, color: colors.ink, minHeight: 40 },
  stars: { fontFamily: fonts.sansMedium, color: colors.gold500, fontSize: 13 },
  price: { fontFamily: fonts.sansSemi, fontSize: 13, color: colors.ink },
  compare: { fontFamily: fonts.sans, fontSize: 11, color: colors.ink400, textDecorationLine: 'line-through' },
  add: { backgroundColor: colors.ink900, borderRadius: 999, paddingVertical: 8, alignItems: 'center', marginTop: 4 },
  addText: { color: colors.white, fontFamily: fonts.sansSemi, fontSize: 12 },
  bridalImage: { height: 200, borderRadius: 20, overflow: 'hidden' },
  offer: { backgroundColor: colors.ink, borderRadius: 18, padding: 16, gap: 4 },
  offerKicker: { fontFamily: fonts.sansSemi, color: colors.gold300, letterSpacing: 1.4, textTransform: 'uppercase', fontSize: 11 },
  offerTitle: { fontFamily: fonts.serif, color: colors.white, fontSize: 28 },
  offerCopy: { fontFamily: fonts.sans, color: colors.ink300, fontSize: 14 },
  bullet: { fontFamily: fonts.sans, color: colors.ink800, fontSize: 15, lineHeight: 22 },
  why: { backgroundColor: colors.white, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.ink100, gap: 6 },
  whyTitle: { fontFamily: fonts.serif, fontSize: 22, color: colors.ink },
  reviews: { backgroundColor: colors.ink, padding: 16, gap: 12 },
  reviewHeading: { fontFamily: fonts.serif, fontSize: 24, lineHeight: 30, color: colors.white },
  review: { borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', padding: 16, gap: 8 },
  quote: { fontFamily: fonts.sans, color: colors.ink200, fontSize: 15, lineHeight: 22 },
  reviewName: { fontFamily: fonts.sansSemi, color: colors.white, fontSize: 15 },
  reviewDetail: { fontFamily: fonts.sans, color: colors.ink400, fontSize: 13 },
  newsletter: { margin: 16, backgroundColor: colors.gold50, borderRadius: 24, padding: 18, gap: 12 },
});
