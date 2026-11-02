import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  KEYS,
  loadProducts,
  readJson,
  sanitizeCart,
  sanitizeWishlist,
  saveProducts as persistProducts,
} from '@/lib/products';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [banner, setBanner] = useState('');
  const cartRef = useRef([]);
  const wishlistRef = useRef([]);
  const enquiryRef = useRef(null);
  const bannerTimer = useRef(null);

  const showBanner = useCallback((message) => {
    setBanner(message);
    if (bannerTimer.current) clearTimeout(bannerTimer.current);
    bannerTimer.current = setTimeout(() => setBanner(''), 2600);
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      const [nextProducts, storedCart, storedWishlist] = await Promise.all([
        loadProducts(),
        readJson(KEYS.cart, []),
        readJson(KEYS.wishlist, []),
      ]);
      if (!active) return;
      const nextCart = sanitizeCart(storedCart);
      const nextWishlist = sanitizeWishlist(storedWishlist);
      cartRef.current = nextCart;
      wishlistRef.current = nextWishlist;
      setProducts(nextProducts);
      setCart(nextCart);
      setWishlist(nextWishlist);
      setReady(true);
    })();
    return () => {
      active = false;
      if (bannerTimer.current) clearTimeout(bannerTimer.current);
    };
  }, []);

  const saveProducts = useCallback(async (next) => {
    const saved = await persistProducts(next);
    if (!saved) {
      showBanner('Storage is full. Use a smaller image (under 800 KB) or an image URL.');
      return false;
    }
    setProducts(next);
    return true;
  }, [showBanner]);

  const reloadProducts = useCallback(async () => {
    const next = await loadProducts();
    setProducts(next);
    return next;
  }, []);

  const addToCart = useCallback((product) => {
    const prev = cartRef.current;
    const existing = prev.find((item) => item.id === product.id);
    let next = prev;
    if (existing && existing.qty >= 10) {
      showBanner('You can add up to 10 of this piece');
    } else if (existing) {
      next = prev.map((item) =>
        item.id === product.id ? { ...item, qty: Math.min(item.qty + 1, 10) } : item,
      );
      showBanner(`${product.name} added to your bag`);
    } else {
      next = [
        ...prev,
        {
          id: String(product.id),
          name: product.name,
          price: Number(product.price) || 0,
          img: product.img || '',
          qty: 1,
        },
      ];
      showBanner(`${product.name} added to your bag`);
    }
    cartRef.current = next;
    setCart(next);
    AsyncStorage.setItem(KEYS.cart, JSON.stringify(next));
  }, [showBanner]);

  const changeQty = useCallback((id, delta) => {
    const next = cartRef.current.flatMap((item) => {
      if (item.id !== id) return [item];
      const qty = item.qty + delta;
      if (qty <= 0) return [];
      return [{ ...item, qty: Math.min(qty, 10) }];
    });
    cartRef.current = next;
    setCart(next);
    AsyncStorage.setItem(KEYS.cart, JSON.stringify(next));
  }, []);

  const removeFromCart = useCallback((id) => {
    const next = cartRef.current.filter((item) => item.id !== id);
    cartRef.current = next;
    setCart(next);
    AsyncStorage.setItem(KEYS.cart, JSON.stringify(next));
  }, []);

  const clearCart = useCallback(() => {
    cartRef.current = [];
    setCart([]);
    AsyncStorage.setItem(KEYS.cart, JSON.stringify([]));
  }, []);

  const toggleWishlist = useCallback((id) => {
    const key = String(id);
    const prev = wishlistRef.current;
    const next = prev.includes(key) ? prev.filter((entry) => entry !== key) : [...prev, key];
    wishlistRef.current = next;
    setWishlist(next);
    AsyncStorage.setItem(KEYS.wishlist, JSON.stringify(next));
    showBanner(next.includes(key) ? 'Saved to your wishlist' : 'Removed from your wishlist');
  }, [showBanner]);

  const stageEnquiry = useCallback((draft) => {
    enquiryRef.current = draft;
  }, []);

  const consumeEnquiry = useCallback(() => {
    const current = enquiryRef.current;
    enquiryRef.current = null;
    return current;
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const value = useMemo(
    () => ({
      ready,
      products,
      saveProducts,
      reloadProducts,
      cart,
      cartCount,
      addToCart,
      changeQty,
      removeFromCart,
      clearCart,
      wishlist,
      toggleWishlist,
      banner,
      showBanner,
      stageEnquiry,
      consumeEnquiry,
    }),
    [
      ready,
      products,
      saveProducts,
      reloadProducts,
      cart,
      cartCount,
      addToCart,
      changeQty,
      removeFromCart,
      clearCart,
      wishlist,
      toggleWishlist,
      banner,
      showBanner,
      stageEnquiry,
      consumeEnquiry,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return value;
}
