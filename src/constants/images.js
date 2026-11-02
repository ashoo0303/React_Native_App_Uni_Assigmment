const localImages = {
  'assets/images/hero-necklace.jpg': require('../../assets/images/jewellery/hero-necklace.jpg'),
  'assets/images/ring-teal.jpg': require('../../assets/images/jewellery/ring-teal.jpg'),
  'assets/images/bracelet-white.jpg': require('../../assets/images/jewellery/bracelet-white.jpg'),
  'assets/images/earrings-white-box.jpg': require('../../assets/images/jewellery/earrings-white-box.jpg'),
  'assets/images/jewelry-set-green.jpg': require('../../assets/images/jewellery/jewelry-set-green.jpg'),
  'assets/images/bracelet-pearl.jpg': require('../../assets/images/jewellery/bracelet-pearl.jpg'),
  'assets/images/ring-flowers.jpg': require('../../assets/images/jewellery/ring-flowers.jpg'),
  'assets/images/necklace-pastel.jpg': require('../../assets/images/jewellery/necklace-pastel.jpg'),
  'assets/images/earrings-shell.jpg': require('../../assets/images/jewellery/earrings-shell.jpg'),
  'assets/images/jewelry-set-green-2.jpg': require('../../assets/images/jewellery/jewelry-set-green-2.jpg'),
};

export function resolveImageSource(src) {
  if (!src) return null;
  if (localImages[src]) return localImages[src];
  if (typeof src === 'string' && /^(data:|https?:|file:)/i.test(src)) {
    return { uri: src };
  }
  return null;
}
