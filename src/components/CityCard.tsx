import Link from 'next/link';
import type { City } from '@/data/cities';

export default function CityCard({ city }: { city: City }) {
  const from = Math.min(...city.parcels.map((p) => parseFloat(p.eth)));

  return (
    <Link className="city-card" href={`/cities/${city.id}`}>
      <div className="city-card-viz">
        <div className="grid" />
        <div className="horizon" />
        <div className="beacon" />
      </div>
      <div className="city-card-body">
        <div className="country">{city.country}</div>
        <div className="serif name">{city.name}</div>
        <div className="tagline">{city.tagline}</div>
        <div className="city-card-foot">
          <div className="coords">{city.coords}</div>
          <div className="from">
            <span>From</span> {from.toFixed(1)} ETH
          </div>
        </div>
      </div>
    </Link>
  );
}
