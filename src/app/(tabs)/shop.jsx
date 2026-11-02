import { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from 'expo-router';
import { BrandHeader } from '@/components/BrandHeader';
import { JewelleryImage } from '@/components/JewelleryImage';
import { Eyebrow } from '@/components/ui';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { useStore } from '@/context/StoreContext';
import { fetchMejuriCatalogue } from '@/lib/catalogue';
import { formatPrice, previewText } from '@/lib/format';

export default function ShopScreen() {
  const { ready, products, reloadProducts, addToCart, wishlist, toggleWishlist } = useStore();
  const [apiProducts, setApiProducts] = useState([]);
  const [phase, setPhase] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [requestId, setRequestId] = useState(0);

  useEffect(() => {
    if (!ready) return undefined;
    let active = true;

    (async () => {
      try {
        const remote = await fetchMejuriCatalogue();
        if (!active) return;
        const local = await reloadProducts();
        if (!active) return;
        setApiProducts(remote);
        setPhase(remote.length || local.length ? 'ready' : 'empty');
      } catch (error) {
        if (!active) return;
        const local = await reloadProducts();
        if (!active) return;
        setApiProducts([]);
        if (local.length) {
          setPhase('offline');
          return;
        }
        setPhase('error');
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'We could not load the jewellery catalogue. Check your connection and try again.',
        );
      }
    })();

    return () => {
      active = false;
    };
  }, [ready, reloadProducts, requestId]);

  function onRetry() {
    setErrorMessage('');
    setPhase('loading');
    setRequestId((current) => current + 1);
  }

  useFocusEffect(
    useCallback(() => {
      if (!ready || phase === 'loading') return;
      reloadProducts();
    }, [ready, phase, reloadProducts]),
  );

  const adminCards = products.map((item) => ({
    id: String(item.id),
    title: item.name,
    image: item.image || '',
    pricePkr: Number(item.price) || 0,
    category: item.category || 'Jewellery',
    vendor: 'Aurelia Admin',
    description: item.notes || '',
    available: Number(item.stock) > 0,
    fromAdmin: true,
  }));

  const cards = phase === 'offline' ? adminCards : phase === 'ready' ? [...adminCards, ...apiProducts] : [];

  return (
    <View style={styles.screen}>
      <BrandHeader />
      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        extraData={wishlist}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <ShopHeader phase={phase} errorMessage={errorMessage} onRetry={onRetry} />
        }
        ListEmptyComponent={
          phase === 'loading' ? (
            <View style={styles.panel}>
              <Text style={styles.panelTitle}>Fetching jewellery catalogue…</Text>
              <Text style={styles.panelCopy}>Loading jewellery from Mejuri API…</Text>
            </View>
          ) : phase === 'error' ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMessage}</Text>
              <Pressable onPress={onRetry} style={styles.retry}>
                <Text style={styles.retryText}>Retry</Text>
              </Pressable>
            </View>
          ) : (
            <Text style={styles.empty}>
              No pieces are available right now. Please try refreshing the collection.
            </Text>
          )
        }
        renderItem={({ item }) => (
          <ShopCard
            item={item}
            wished={wishlist.includes(item.id)}
            onWish={() => toggleWishlist(item.id)}
            onAdd={() =>
              addToCart({
                id: item.id,
                name: item.title,
                price: item.pricePkr,
                img: item.image,
              })
            }
          />
        )}
      />
    </View>
  );
}

function ShopHeader({ phase, errorMessage, onRetry }) {
  let status = '';
  if (phase === 'loading') status = 'Loading jewellery from Mejuri API…';
  else if (phase === 'offline') status = 'Admin products · API unavailable';
  else if (phase === 'error') status = errorMessage;
  else if (phase === 'empty') status = 'No jewellery available.';

  return (
    <View style={styles.header}>
      <Eyebrow>Shop collection</Eyebrow>
      <Text style={styles.sectionTitle}>Jewellery for sale</Text>
      {status ? <Text style={styles.status}>{status}</Text> : null}
      {phase === 'offline' ? (
        <Pressable onPress={onRetry} style={styles.retry}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function ShopCard({ item, wished, onWish, onAdd }) {
  return (
    <View style={styles.card}>
      <View style={styles.figure}>
        <JewelleryImage src={item.image} />
        <View style={[styles.badge, item.fromAdmin ? styles.badgeAdmin : styles.badgeLive]}>
          <Text style={[styles.badgeText, item.fromAdmin && styles.badgeTextLight]} numberOfLines={1}>
            {item.fromAdmin ? 'Admin' : item.category}
          </Text>
        </View>
        <Pressable onPress={onWish} style={styles.heart} accessibilityLabel="Toggle wishlist">
          <Ionicons name={wished ? 'heart' : 'heart-outline'} size={18} color={wished ? '#c43b3b' : colors.ink} />
        </Pressable>
      </View>
      <View style={styles.body}>
        <Text style={styles.vendor} numberOfLines={1}>
          {item.vendor}
        </Text>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        {item.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {previewText(item.description)}
          </Text>
        ) : null}
        <Text style={styles.price}>{formatPrice(item.pricePkr)}</Text>
        <Pressable
          onPress={onAdd}
          disabled={!item.available}
          style={[styles.add, !item.available && styles.addDisabled]}>
          <Text style={[styles.addText, !item.available && styles.addTextDisabled]}>
            {item.available ? 'Add' : 'Unavailable'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.ivory,
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  row: {
    gap: 10,
    marginBottom: 10,
  },
  header: {
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: fonts.serif,
    fontSize: 22,
    color: colors.ink,
  },
  status: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: colors.ink600,
  },
  panel: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.ink100,
    padding: 24,
    gap: 6,
  },
  panelTitle: {
    fontFamily: fonts.serif,
    fontSize: 22,
    color: colors.ink,
    textAlign: 'center',
  },
  panelCopy: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.ink600,
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: colors.dangerBg,
    borderRadius: 18,
    padding: 20,
    gap: 12,
  },
  errorText: {
    fontFamily: fonts.sansMedium,
    color: colors.danger,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  retry: {
    alignSelf: 'flex-start',
    backgroundColor: colors.ink,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  retryText: {
    fontFamily: fonts.sansSemi,
    color: colors.white,
    fontSize: 14,
  },
  empty: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.ink200,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    textAlign: 'center',
    fontFamily: fonts.sans,
    color: colors.ink600,
  },
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.ink100,
  },
  figure: {
    height: 132,
    backgroundColor: colors.sand,
  },
  badge: {
    position: 'absolute',
    left: 8,
    top: 8,
    maxWidth: '68%',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeAdmin: {
    backgroundColor: colors.ink,
  },
  badgeLive: {
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  badgeText: {
    fontFamily: fonts.sansSemi,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.ink700,
  },
  badgeTextLight: {
    color: colors.white,
  },
  heart: {
    position: 'absolute',
    right: 8,
    top: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: 10,
    gap: 4,
  },
  vendor: {
    fontFamily: fonts.sansSemi,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.ink400,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 15,
    lineHeight: 19,
    color: colors.ink,
    minHeight: 38,
  },
  description: {
    fontFamily: fonts.sans,
    fontSize: 12,
    lineHeight: 16,
    color: colors.ink600,
    minHeight: 32,
  },
  price: {
    fontFamily: fonts.sansSemi,
    fontSize: 13,
    color: colors.ink,
    marginTop: 4,
  },
  add: {
    backgroundColor: colors.ink900,
    borderRadius: 999,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  addDisabled: {
    backgroundColor: colors.ink200,
  },
  addText: {
    fontFamily: fonts.sansSemi,
    fontSize: 12,
    color: colors.white,
  },
  addTextDisabled: {
    color: colors.ink700,
  },
});
