import Link from 'next/link';
import { badgeColor, type City } from '@/data/cities';

export default function CityPanel({ city, onClose }: { city: City; onClose: () => void }) {
  return (
    <aside className="city-panel">
      <div className="city-panel-head">
        <div className="city-panel-country">{city.country}</div>
        <button className="city-panel-close" onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>
      <h3 className="serif city-panel-name">{city.name}</h3>
      <div className="city-panel-meta">
        {city.coords} · {city.tagline}
      </div>
      <div className="city-panel-rule" />

      {city.parcels.map((p) => (
        <div className="parcel-row" key={p.name}>
          <div>
            <div className="name">{p.name}</div>
            <div className="sub">
              {p.size} ·{' '}
              <span className="badge" style={{ color: badgeColor(p.badge) }}>
                {p.badge}
              </span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="price">{p.eth}</div>
            <div className="price-sub">
              {p.usd} · <span className="up">{p.change}</span>
            </div>
          </div>
        </div>
      ))}

      <div className="city-panel-actions">
        <Link className="btn btn-gold" href={`/cities/${city.id}`}>
          Make an Offer
        </Link>
        <Link className="btn btn-ghost" href={`/cities/${city.id}`}>
          View District
        </Link>
      </div>
    </aside>
  );
}
