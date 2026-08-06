export type Parcel = {
  name: string;
  size: string;
  eth: string;
  usd: string;
  change: string;
  badge: string;
};

export type City = {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  coords: string;
  tagline: string;
  parcels: Parcel[];
};

export const cities: City[] = [
  {
    id: 'istanbul',
    name: 'Istanbul',
    country: 'Türkiye',
    lat: 41.0082,
    lon: 28.9784,
    coords: '41.0082° N · 28.9784° E',
    tagline: 'Where two continents trade',
    parcels: [
      { name: 'Bosphorus Line · Block 04', size: '4,096 m²', eth: '48.2 ETH', usd: '$168,700', change: '+12.4%', badge: 'For Sale' },
      { name: 'Galata Quarter · Plot 17', size: '2,048 m²', eth: '26.8 ETH', usd: '$93,800', change: '+8.1%', badge: 'Auction · 6h' },
      { name: 'Levent Axis · Tower Site A', size: '8,192 m²', eth: '96.5 ETH', usd: '$337,750', change: '+15.2%', badge: 'New' },
    ],
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    lat: 48.8566,
    lon: 2.3522,
    coords: '48.8566° N · 2.3522° E',
    tagline: 'The gallery district of the grid',
    parcels: [
      { name: 'Champs-Élysées Row · No. 8', size: '3,072 m²', eth: '74.0 ETH', usd: '$259,000', change: '+9.6%', badge: 'For Sale' },
      { name: 'Le Marais · Plot 22', size: '1,536 m²', eth: '38.4 ETH', usd: '$134,400', change: '+6.3%', badge: 'For Sale' },
      { name: 'Rive Gauche · Quay 3', size: '4,096 m²', eth: '88.1 ETH', usd: '$308,350', change: '+11.0%', badge: 'Auction · 2d' },
    ],
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    lat: 35.6762,
    lon: 139.6503,
    coords: '35.6762° N · 139.6503° E',
    tagline: 'Highest footfall in the metaverse',
    parcels: [
      { name: 'Shibuya Crossing · Block 07', size: '2,560 m²', eth: '92.4 ETH', usd: '$323,400', change: '+18.7%', badge: 'Auction · 12h' },
      { name: 'Ginza Strip · Plot 2', size: '2,048 m²', eth: '81.0 ETH', usd: '$283,500', change: '+10.2%', badge: 'For Sale' },
      { name: 'Shinjuku Grid · Sector 5', size: '6,144 m²', eth: '118.6 ETH', usd: '$415,100', change: '+14.9%', badge: 'New' },
    ],
  },
  {
    id: 'newyork',
    name: 'New York',
    country: 'United States',
    lat: 40.7128,
    lon: -74.006,
    coords: '40.7128° N · 74.0060° W',
    tagline: 'Blue-chip digital frontage',
    parcels: [
      { name: 'SoHo Cast-Iron · Lot 12', size: '2,304 m²', eth: '104.2 ETH', usd: '$364,700', change: '+13.5%', badge: 'For Sale' },
      { name: 'Fifth Avenue · Parcel 60', size: '3,584 m²', eth: '156.0 ETH', usd: '$546,000', change: '+21.3%', badge: 'Auction · 4h' },
      { name: 'DUMBO Waterfront · Pier K', size: '5,120 m²', eth: '97.7 ETH', usd: '$341,950', change: '+9.8%', badge: 'New' },
    ],
  },
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    lat: 51.5074,
    lon: -0.1278,
    coords: '51.5074° N · 0.1278° W',
    tagline: 'Heritage parcels, modern deeds',
    parcels: [
      { name: 'Mayfair Row · No. 1', size: '2,816 m²', eth: '132.5 ETH', usd: '$463,750', change: '+16.4%', badge: 'For Sale' },
      { name: 'Shoreditch Works · Unit 9', size: '1,792 m²', eth: '44.6 ETH', usd: '$156,100', change: '+7.7%', badge: 'New' },
      { name: 'South Bank · Berth 5', size: '4,608 m²', eth: '90.3 ETH', usd: '$316,050', change: '+12.1%', badge: 'For Sale' },
    ],
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    lat: 25.2048,
    lon: 55.2708,
    coords: '25.2048° N · 55.2708° E',
    tagline: 'The fastest-appreciating skyline',
    parcels: [
      { name: 'Marina Skyline · Plot 3', size: '6,144 m²', eth: '121.8 ETH', usd: '$426,300', change: '+19.5%', badge: 'For Sale' },
      { name: 'Palm Frond · Villa Site 41', size: '4,096 m²', eth: '88.8 ETH', usd: '$310,800', change: '+11.6%', badge: 'Auction · 1d' },
      { name: 'Downtown Axis · Tower B', size: '9,216 m²', eth: '168.4 ETH', usd: '$589,400', change: '+24.0%', badge: 'New' },
    ],
  },
  {
    id: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    lat: 1.3521,
    lon: 103.8198,
    coords: '1.3521° N · 103.8198° E',
    tagline: 'The port of digital trade',
    parcels: [
      { name: 'Marina Bay · Berth 1', size: '3,328 m²', eth: '98.6 ETH', usd: '$345,100', change: '+15.8%', badge: 'For Sale' },
      { name: 'Orchard Belt · Plot 14', size: '2,560 m²', eth: '72.2 ETH', usd: '$252,700', change: '+9.1%', badge: 'For Sale' },
      { name: 'Sentosa Cove · Isle 6', size: '5,632 m²', eth: '110.9 ETH', usd: '$388,150', change: '+13.3%', badge: 'Auction · 8h' },
    ],
  },
  {
    id: 'sydney',
    name: 'Sydney',
    country: 'Australia',
    lat: -33.8688,
    lon: 151.2093,
    coords: '33.8688° S · 151.2093° E',
    tagline: 'Harbourfront of the southern grid',
    parcels: [
      { name: 'Circular Quay · Lot 2', size: '2,944 m²', eth: '76.4 ETH', usd: '$267,400', change: '+10.7%', badge: 'For Sale' },
      { name: 'Bondi Strip · Plot 33', size: '2,048 m²', eth: '51.3 ETH', usd: '$179,550', change: '+8.9%', badge: 'New' },
      { name: 'Barangaroo · Tower Site C', size: '7,168 m²', eth: '128.0 ETH', usd: '$448,000', change: '+17.2%', badge: 'For Sale' },
    ],
  },
];

export const badgeColor = (badge: string) =>
  badge.startsWith('Auction') ? '#e0a35a' : badge === 'New' ? '#7fd6c2' : '#d8b578';

export const globeMarkers = cities.map(({ id, name, lat, lon }) => ({ id, name, lat, lon }));

export const getCity = (id: string | null) =>
  id ? cities.find((c) => c.id === id) ?? null : null;
