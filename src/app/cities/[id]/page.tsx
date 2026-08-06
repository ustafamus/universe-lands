import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { badgeColor, cities } from '@/data/cities';

type Params = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return cities.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const city = cities.find((c) => c.id === id);
  if (!city) return { title: 'District not found' };
  return {
    title: `${city.name} District`,
    description: `${city.tagline} — ${city.parcels.length} verified parcels in ${city.name}, ${city.country}.`,
  };
}

export default async function CityPage({ params }: Params) {
  const { id } = await params;
  const city = cities.find((c) => c.id === id);
  if (!city) notFound();

  const others = cities.filter((c) => c.id !== city.id);
  const total = city.parcels.reduce((sum, p) => sum + parseFloat(p.eth), 0);
  const area = city.parcels.reduce((sum, p) => sum + parseInt(p.size.replace(/\D/g, ''), 10), 0);

  return (
    <>
      <header className="district-head">
        <div className="shell">
          <Link className="back-link" href="/cities">
            ← All cities
          </Link>
          <div className="eyebrow">
            <div className="rule" />
            <div className="text">{city.country}</div>
          </div>
          <h1 className="serif page-title">{city.name}</h1>
          <p className="page-lede">{city.tagline}</p>

          <div className="district-stats">
            <div>
              <div className="serif value">{city.parcels.length}</div>
              <div className="label">Parcels released</div>
            </div>
            <div>
              <div className="serif value">{total.toFixed(1)} ETH</div>
              <div className="label">District floor value</div>
            </div>
            <div>
              <div className="serif value">{area.toLocaleString('en-US')} m²</div>
              <div className="label">Surveyed area</div>
            </div>
            <div>
              <div className="serif value">{city.coords}</div>
              <div className="label">Anchor coordinates</div>
            </div>
          </div>
        </div>
      </header>

      <section className="district-body">
        <div className="shell">
          <h2 className="serif section-title">Available parcels</h2>

          <div className="parcel-table">
            {city.parcels.map((p) => (
              <article className="parcel-line" key={p.name}>
                <div className="parcel-line-main">
                  <div className="serif name">{p.name}</div>
                  <div className="meta">
                    {p.size} ·{' '}
                    <span style={{ color: badgeColor(p.badge), letterSpacing: '.06em' }}>
                      {p.badge}
                    </span>
                  </div>
                </div>
                <div className="parcel-line-price">
                  <div className="eth">{p.eth}</div>
                  <div className="usd">
                    {p.usd} · <span className="up">{p.change}</span>
                  </div>
                </div>
                <div className="parcel-line-actions">
                  <Link className="btn btn-gold" href="/market">
                    Make an Offer
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="district-next">
            <div className="eyebrow">
              <div className="rule" />
              <div className="text">Other districts</div>
            </div>
            <div className="district-links">
              {others.map((c) => (
                <Link key={c.id} className="district-link" href={`/cities/${c.id}`}>
                  <span className="serif">{c.name}</span>
                  <span className="country">{c.country}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
