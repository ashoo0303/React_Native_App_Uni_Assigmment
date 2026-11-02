import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

export const KEYS = {
  products: 'aurelia.products.v1',
  legacy: 'aurelia.catalogue.v1',
  cart: 'aurelia.cart.v1',
  wishlist: 'aurelia.wishlist.v1',
};

export const CATEGORIES = ['rings', 'necklaces', 'earrings', 'bracelets', 'sets'];

export const METALS = [
  '22K gold',
  '18K gold',
  '14K gold',
  'white gold',
  'rose gold',
  'pearl',
  'diamond',
];

export const CATEGORY_LABELS = {
  rings: 'Rings',
  necklaces: 'Necklaces',
  earrings: 'Earrings',
  bracelets: 'Bracelets',
  sets: 'Sets',
};

const CATEGORY_IMAGES = {
  rings: 'assets/images/ring-teal.jpg',
  earrings: 'assets/images/earrings-white-box.jpg',
  sets: 'assets/images/jewelry-set-green.jpg',
  necklaces: 'assets/images/necklace-pastel.jpg',
  bracelets: 'assets/images/bracelet-white.jpg',
};

const SAMPLE_DEFAULTS = [
  {
    name: 'Aurora Solitaire Ring',
    category: 'rings',
    metal: 'white gold',
    price: 148000,
    stock: 4,
    notes: 'Certified diamond, bridal favourite',
    image: 'assets/images/ring-teal.jpg',
  },
  {
    name: 'Perle Drop Earrings',
    category: 'earrings',
    metal: 'pearl',
    price: 38000,
    stock: 8,
    notes: 'Freshwater pearls with gold posts',
    image: 'assets/images/earrings-white-box.jpg',
  },
  {
    name: 'Blush Clover Set',
    category: 'sets',
    metal: '18K gold',
    price: 124000,
    stock: 3,
    notes: 'Necklace, earrings and ring set',
    image: 'assets/images/jewelry-set-green.jpg',
  },
];

function parseList(raw) {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function createSeed() {
  const createdAt = Date.now();
  return SAMPLE_DEFAULTS.map((item) => ({
    ...item,
    id: Crypto.randomUUID(),
    createdAt,
  }));
}

export function withDefaultImages(list) {
  const byName = Object.fromEntries(SAMPLE_DEFAULTS.map((item) => [item.name.toLowerCase(), item]));
  return list.map((item) => {
    const fallback = byName[String(item.name || '').toLowerCase()];
    return {
      ...item,
      id: String(item.id || Crypto.randomUUID()),
      name: String(item.name || ''),
      category: item.category || fallback?.category || 'rings',
      metal: item.metal || fallback?.metal || '',
      price: Number(item.price) || 0,
      stock: Number.isFinite(Number(item.stock)) ? Number(item.stock) : fallback?.stock ?? 5,
      notes: item.notes || '',
      image: item.image || fallback?.image || CATEGORY_IMAGES[item.category] || '',
      createdAt: item.createdAt || Date.now(),
    };
  });
}

export async function loadProducts() {
  const current = parseList(await AsyncStorage.getItem(KEYS.products));
  if (current) {
    const hydrated = withDefaultImages(current);
    const needsImage = hydrated.some((item, index) => item.image && item.image !== current[index]?.image);
    if (needsImage) {
      await AsyncStorage.setItem(KEYS.products, JSON.stringify(hydrated));
    }
    return hydrated;
  }

  const legacy = parseList(await AsyncStorage.getItem(KEYS.legacy));
  if (legacy) {
    const hydrated = withDefaultImages(legacy);
    await AsyncStorage.setItem(KEYS.products, JSON.stringify(hydrated));
    return hydrated;
  }

  const seed = createSeed();
  await AsyncStorage.setItem(KEYS.products, JSON.stringify(seed));
  return seed;
}

export async function saveProducts(records) {
  try {
    await AsyncStorage.setItem(KEYS.products, JSON.stringify(records));
    return true;
  } catch {
    return false;
  }
}

export async function readJson(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function sanitizeCart(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => item && item.id)
    .map((item) => ({
      id: String(item.id),
      name: String(item.name || 'Jewellery'),
      price: Number(item.price) || 0,
      img: String(item.img || ''),
      qty: Math.min(10, Math.max(1, Number(item.qty) || 1)),
    }));
}

export function sanitizeWishlist(value) {
  if (!Array.isArray(value)) return [];
  return value.map((id) => String(id));
}
