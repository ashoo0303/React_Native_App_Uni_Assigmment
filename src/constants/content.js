export const STORE = {
  name: 'Aurelia Jewels',
  addressLines: ['118 Heritage Arcade, Gulberg III,', 'Lahore 54660, Pakistan'],
  phone: '+92 303 4427651',
  phoneHref: 'tel:+923034427651',
  email: 'ayeshababar941@gmail.com',
  emailHref: 'mailto:ayeshababar941@gmail.com',
  whatsapp: 'https://wa.me/923034427651',
  hoursSummary: 'Mon–Sat: 11:00 – 20:00',
  sunday: 'Sunday: by appointment',
  delivery: 'Complimentary insured delivery on orders above Rs. 50,000',
};

export const HOURS = [
  ['Monday – Thursday', '11:00 – 20:00'],
  ['Friday', '14:00 – 21:00'],
  ['Saturday', '11:00 – 21:00'],
  ['Sunday', 'By appointment'],
];

export const TOPICS = [
  'Private viewing / appointment',
  'Bridal & engagement',
  'Custom design',
  'Order or delivery support',
  'Repairs & resizing',
  'Something else',
];

export const BESTSELLERS = [
  {
    id: 'aurora-ring',
    category: 'rings',
    meta: 'Rings · White gold',
    name: 'Aurora Solitaire Ring',
    price: 148000,
    reviews: 214,
    badge: 'Bestseller',
    image: 'assets/images/ring-teal.jpg',
  },
  {
    id: 'rope-bracelet',
    category: 'bracelets',
    meta: 'Bracelets · 22K gold',
    name: 'Rope Chain Bracelet',
    price: 96500,
    reviews: 86,
    badge: 'New',
    image: 'assets/images/bracelet-white.jpg',
  },
  {
    id: 'perle-earrings',
    category: 'earrings',
    meta: 'Earrings · Freshwater pearl',
    name: 'Perle Drop Earrings',
    price: 38000,
    reviews: 142,
    badge: '',
    image: 'assets/images/earrings-white-box.jpg',
  },
  {
    id: 'clover-set',
    category: 'necklaces',
    meta: 'Sets · Gold & enamel',
    name: 'Blush Clover Set',
    price: 124000,
    compare: 141000,
    reviews: 97,
    badge: '-12%',
    image: 'assets/images/jewelry-set-green.jpg',
  },
  {
    id: 'pearl-bracelet',
    category: 'bracelets',
    meta: 'Bracelets · Pearl & gold',
    name: 'Pearl & Gold Bracelet',
    price: 52500,
    reviews: 63,
    badge: '',
    image: 'assets/images/bracelet-pearl.jpg',
  },
  {
    id: 'rose-ring',
    category: 'rings',
    meta: 'Rings · Rose gold',
    name: 'Rose Bloom Ring',
    price: 186000,
    reviews: 171,
    badge: 'Bridal',
    image: 'assets/images/ring-flowers.jpg',
  },
  {
    id: 'petal-necklace',
    category: 'necklaces',
    meta: 'Necklaces · 18K gold',
    name: 'Petal Chain Necklace',
    price: 74000,
    reviews: 118,
    badge: '',
    image: 'assets/images/necklace-pastel.jpg',
  },
  {
    id: 'pearl-cuff',
    category: 'earrings',
    meta: 'Earrings · 14K gold',
    name: 'Lumière Pearl Ear Cuff',
    price: 29500,
    reviews: 54,
    badge: 'New',
    image: 'assets/images/earrings-shell.jpg',
  },
];

export const HOME_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'rings', label: 'Rings' },
  { id: 'necklaces', label: 'Necklaces' },
  { id: 'earrings', label: 'Earrings' },
  { id: 'bracelets', label: 'Bracelets' },
];

export const PROMISES = [
  ['Certified diamonds', 'Graded and laser inscribed'],
  ['Hallmarked gold', 'Purity you can verify'],
  ['Insured delivery', 'Free above Rs. 50,000'],
  ['30 day returns', 'Easy, no questions exchange'],
];

export const WHY = [
  ['Ethically sourced', 'Conflict free diamonds and recycled gold from vetted, traceable partners.'],
  ['Made by hand', 'Every piece is cast, set and polished by artisans with decades of experience.'],
  ['Gift ready', 'Signature velvet box, care card and handwritten note at no extra cost.'],
  ['Lifetime care', 'Free cleaning, polishing and size adjustments for as long as you own it.'],
];

export const REVIEWS = [
  {
    quote: 'The team guided us through every detail of my bridal set. The finish is flawless and it arrived beautifully packaged days before the nikkah.',
    name: 'Ayesha Babar',
    detail: 'Lahore · Bridal set',
    initials: 'AK',
  },
  {
    quote: 'I proposed with the Aurora solitaire and the sparkle is unreal. The certificate, the engraving, the service everything felt truly premium.',
    name: 'Hamza Raza',
    detail: 'Islamabad · Engagement ring',
    initials: 'HR',
  },
  {
    quote: 'Ordered pearl earrings for my mother’s birthday. The gift box and handwritten note made her cry happy tears. We will be back for sure.',
    name: 'Sana Malik',
    detail: 'Karachi · Pearl earrings',
    initials: 'SM',
  },
];

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const PHONE_PATTERN = /^[0-9+ ()-]{7,20}$/;
