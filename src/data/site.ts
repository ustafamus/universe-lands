import { badgeColor, cities } from './cities';

/** Prototype knobs — these were the editable props on the original mockup. */
export const siteConfig = {
  autoRotate: true,
  rotateSpeed: 1,
  showTicker: true,
};

export const stats = [
  { v: '$284M', k: 'Volume traded' },
  { v: '12,480', k: 'Parcels on-chain' },
  { v: '96', k: 'Cities live' },
  { v: '+8.2%', k: '30-day yield' },
];

const tickerBase = [
  { kind: 'Sold', color: '#79d6a3', text: 'Shibuya Crossing · Block 07 — Tokyo', price: '92.4 ETH ($323,400)' },
  { kind: 'New Listing', color: '#7fd6c2', text: 'Mayfair Row · No. 1 — London', price: '132.5 ETH' },
  { kind: 'Bid', color: '#e0a35a', text: 'Fifth Avenue · Parcel 60 — New York', price: '149.0 ETH' },
  { kind: 'Sold', color: '#79d6a3', text: 'Marina Skyline · Plot 3 — Dubai', price: '118.2 ETH ($413,700)' },
  { kind: 'Transfer', color: '#b9bdc9', text: 'Galata Quarter · Plot 17 — Istanbul', price: '—' },
  { kind: 'Sold', color: '#79d6a3', text: 'Barangaroo · Tower Site C — Sydney', price: '128.0 ETH ($448,000)' },
  { kind: 'New Listing', color: '#7fd6c2', text: 'Sentosa Cove · Isle 6 — Singapore', price: '110.9 ETH' },
];

/** Doubled so the marquee loops seamlessly at -50%. */
export const ticker = [...tickerBase, ...tickerBase];

export type Listing = {
  cityId: string;
  city: string;
  country: string;
  coords: string;
  name: string;
  size: string;
  eth: string;
  usd: string;
  change: string;
  badge: string;
  badgeColor: string;
};

/** Every parcel across every city, flattened for the marketplace page. */
export const allListings: Listing[] = cities.flatMap((city) =>
  city.parcels.map((p) => ({
    cityId: city.id,
    city: city.name,
    country: city.country,
    coords: city.coords,
    name: p.name,
    size: p.size,
    eth: p.eth,
    usd: p.usd,
    change: p.change,
    badge: p.badge,
    badgeColor: badgeColor(p.badge),
  }))
);

const featuredKeys = [
  'dubai:2',
  'newyork:1',
  'london:0',
  'tokyo:0',
  'istanbul:0',
  'paris:2',
] as const;

export const featured = featuredKeys.map((key) => {
  const [cityId, i] = key.split(':');
  const city = cities.find((c) => c.id === cityId)!;
  return allListings.find(
    (l) => l.cityId === cityId && l.name === city.parcels[Number(i)].name
  )!;
});

export const steps = [
  {
    n: 'I',
    t: 'Acquire verified parcels',
    d: 'Every district is surveyed and issued as a finite set of on-chain deeds — one owner per parcel, provable forever.',
    detail: [
      'Boundaries surveyed against real-world cadastral data',
      'Deed minted as a single non-fungible title',
      'Provenance visible from the first mint onward',
    ],
  },
  {
    n: 'II',
    t: 'Trade peer-to-peer',
    d: 'List, bid, and settle directly with other members in ETH or USD. Escrow is automatic; settlement is instant.',
    detail: [
      'Fixed-price listings and timed auctions',
      'Escrow held by contract, released on settlement',
      '1.5% protocol fee — no listing or bidding costs',
    ],
  },
  {
    n: 'III',
    t: 'Build and monetize',
    d: 'Develop storefronts, galleries, and venues on your land — then lease, license, or resell at your price.',
    detail: [
      'Build permits included with every deed',
      'Lease terms from 30 days to 99 years',
      'Revenue routed straight to the title holder',
    ],
  },
];

export const faqs = [
  {
    q: 'What exactly do I own?',
    a: 'A transferable on-chain deed to a surveyed parcel. It carries build rights, lease rights, and resale rights, and it is the sole title to that coordinate.',
  },
  {
    q: 'How is a parcel priced?',
    a: 'By district demand, footfall, and adjacency to landmark plots. Every past sale for a district is public, so the comparables are always in view.',
  },
  {
    q: 'Can I pay in fiat?',
    a: 'Yes. Settlement is in ETH or USD; USD purchases are converted at the point of escrow so the deed still settles on-chain.',
  },
  {
    q: 'What are the fees?',
    a: '1.5% of the settled price, charged to the seller. Listing, bidding, and transfers between wallets you own are free.',
  },
];
