import axios from 'axios';
import { stripHtml } from '@/lib/format';

const API_BASE = 'https://www.mejuri.com/products.json';

function mapProduct(raw) {
  const variants = Array.isArray(raw.variants) ? raw.variants : [];
  const firstVariant = variants[0] || {};
  const image =
    raw.images?.[0]?.src ||
    raw.image?.src ||
    firstVariant.featured_image?.src ||
    '';

  return {
    id: `mejuri-${raw.id}`,
    title: raw.title || 'Jewellery piece',
    image,
    pricePkr: Math.round(Number(firstVariant.price || 0) * 280),
    category: raw.product_type || 'Jewellery',
    vendor: raw.vendor || 'Mejuri',
    description: stripHtml(raw.body_html) || 'Fine jewellery from the Mejuri catalogue.',
    available: firstVariant.available === undefined ? true : Boolean(firstVariant.available),
    fromAdmin: false,
  };
}

function productsFromResponse(response) {
  const list = Array.isArray(response.data?.products) ? response.data.products : [];
  return list.map(mapProduct);
}

export async function fetchMejuriCatalogue() {
  try {
    const first = await axios.get(API_BASE, {
      params: { limit: 250, page: 1 },
      timeout: 15000,
    });
    const second = await axios.get(API_BASE, {
      params: { limit: 250, page: 2 },
      timeout: 15000,
    });
    const mapped = [...productsFromResponse(first), ...productsFromResponse(second)];
    return [...mapped.slice(4, 14), ...mapped.slice(33)];
  } catch (error) {
    if (error?.code === 'ECONNABORTED') {
      throw new Error('Loading took too long. Please refresh and try again.');
    }
    if (error?.response?.status) {
      throw new Error('Something went wrong while loading jewellery. Please try again.');
    }
    throw new Error('We could not load the jewellery catalogue. Check your connection and try again.');
  }
}
