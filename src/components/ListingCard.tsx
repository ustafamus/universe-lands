import Link from 'next/link';
import type { Listing } from '@/data/site';

export default function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link className="listing-card" href={`/cities/${listing.cityId}`}>
      <div className="listing-viz">
        <div className="grid" />
        <div className="horizon" />
        <div className="coords">{listing.coords}</div>
        <div
          className="badge"
          style={{ color: listing.badgeColor, border: `1px solid ${listing.badgeColor}` }}
        >
          {listing.badge}
        </div>
      </div>
      <div className="listing-body">
        <div className="city">{listing.city}</div>
        <div className="serif name">{listing.name}</div>
        <div className="listing-foot">
          <div className="size">{listing.size}</div>
          <div style={{ textAlign: 'right' }}>
            <div className="eth">{listing.eth}</div>
            <div className="usd">{listing.usd}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
