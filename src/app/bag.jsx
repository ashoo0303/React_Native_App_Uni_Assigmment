import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { JewelleryImage } from '@/components/JewelleryImage';
import { Button } from '@/components/ui';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { useStore } from '@/context/StoreContext';
import { formatPrice } from '@/lib/format';

export default function BagScreen() {
  const router = useRouter();
  const { cart, changeQty, removeFromCart, clearCart, stageEnquiry } = useStore();
  const subtotal = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  function requestOrder() {
    const lines = cart.map(
      (item) => `- ${item.name} x ${item.qty} (${formatPrice(item.price * item.qty)})`,
    );
    const message = [
      'Hello Aurelia team, I would like to place an order for the following pieces:',
      '',
      ...lines,
      '',
      `Estimated total: ${formatPrice(subtotal)}`,
    ].join('\n');
    stageEnquiry({
      topic: 'Order or delivery support',
      message: message.slice(0, 1000),
    });
    router.navigate('/contact');
  }

  return (
    <FlatList
      data={cart}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      style={styles.screen}
      ListEmptyComponent={
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>Your bag is empty</Text>
          <Text style={styles.copy}>Discover handcrafted pieces and add your favourites here.</Text>
          <Button label="Browse the shop" variant="dark" onPress={() => router.navigate('/shop')} />
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.row}>
          <View style={styles.thumb}>
            <JewelleryImage src={item.img} />
          </View>
          <View style={styles.body}>
            <View style={styles.top}>
              <Text style={styles.name}>{item.name}</Text>
              <Pressable onPress={() => removeFromCart(item.id)}>
                <Text style={styles.remove}>Remove</Text>
              </Pressable>
            </View>
            <View style={styles.bottom}>
              <View style={styles.qty}>
                <Pressable onPress={() => changeQty(item.id, -1)} style={styles.qtyBtn}>
                  <Text style={styles.qtyText}>−</Text>
                </Pressable>
                <Text style={styles.qtyValue}>{item.qty}</Text>
                <Pressable onPress={() => changeQty(item.id, 1)} style={styles.qtyBtn}>
                  <Text style={styles.qtyText}>+</Text>
                </Pressable>
              </View>
              <Text style={styles.price}>{formatPrice(item.price * item.qty)}</Text>
            </View>
          </View>
        </View>
      )}
      ListFooterComponent={
        cart.length ? (
          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.copy}>Subtotal</Text>
              <Text style={styles.total}>{formatPrice(subtotal)}</Text>
            </View>
            <Text style={styles.note}>
              {subtotal >= 50000
                ? 'Insured delivery is free for this order.'
                : 'Insured delivery is free above Rs. 50,000. Orders are confirmed with our concierge.'}
            </Text>
            <Button label="Request this order" onPress={requestOrder} />
            <Pressable onPress={clearCart}>
              <Text style={styles.clear}>Clear bag</Text>
            </Pressable>
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ivory },
  list: { padding: 16, gap: 12, paddingBottom: 32 },
  emptyWrap: { gap: 12, paddingVertical: 32 },
  emptyTitle: { fontFamily: fonts.serif, fontSize: 28, color: colors.ink },
  copy: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 20, color: colors.ink600 },
  row: { flexDirection: 'row', gap: 12, backgroundColor: colors.white, borderRadius: 18, padding: 12, borderWidth: 1, borderColor: colors.ink100 },
  thumb: { width: 84, height: 84, borderRadius: 12, overflow: 'hidden', backgroundColor: colors.sand },
  body: { flex: 1, justifyContent: 'space-between' },
  top: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  name: { flex: 1, fontFamily: fonts.serif, fontSize: 18, color: colors.ink },
  remove: { fontFamily: fonts.sansMedium, color: colors.danger, fontSize: 12 },
  bottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  qty: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.ink200, borderRadius: 999 },
  qtyBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  qtyText: { fontFamily: fonts.sansSemi, fontSize: 18, color: colors.ink700 },
  qtyValue: { minWidth: 18, textAlign: 'center', fontFamily: fonts.sansSemi, color: colors.ink },
  price: { fontFamily: fonts.sansSemi, color: colors.ink, fontSize: 14 },
  footer: { marginTop: 8, backgroundColor: colors.white, borderRadius: 18, padding: 16, gap: 10, borderWidth: 1, borderColor: colors.ink100 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  total: { fontFamily: fonts.serif, fontSize: 24, color: colors.ink },
  note: { fontFamily: fonts.sans, fontSize: 12, lineHeight: 18, color: colors.ink500 },
  clear: { textAlign: 'center', fontFamily: fonts.sansMedium, color: colors.ink500, textDecorationLine: 'underline' },
});
