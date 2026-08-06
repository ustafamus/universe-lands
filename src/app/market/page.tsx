import type { Metadata } from 'next';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import MarketTicker from '@/components/MarketTicker';
import { allListings, stats } from '@/data/site';

export const metadata: Metadata = {
  title: 'Market',
  description: 'Live settlement activity across the Universe Lands exchange.',
};

export default function MarketPage() {
  const movers = [...allListings]
    .sort((a, b) => parseFloat(b.change) - parseFloat(a.change))
    .slice(0, 6);

  return (
    <>
      <PageHeader
        eyebrow="Live Market"
        title="Settlement, as it happens"
        lede="Every sale, bid, and transfer on the exchange is public. Prices below are last-settled, updated on each block."
      />

      <MarketTicker />

      <section className="market-body" data-screen-label="Market">
        <div className="shell">
          <div className="market-stats">
            {stats.map((s) => (
              <div className="market-stat" key={s.k}>
                <div className="serif value">{s.v}</div>
                <div className="label">{s.k}</div>
              </div>
            ))}
          </div>

          <h2 className="serif section-title" style={{ marginTop: '84px' }}>
            Top movers · 30 days
          </h2>
          <div className="movers">
            {movers.map((m, i) => (
              <Link className="mover" href={`/cities/${m.cityId}`} key={`${m.cityId}-${m.name}`}>
                <div className="rank serif">{String(i + 1).padStart(2, '0')}</div>
                <div className="mover-main">
                  <div className="serif name">{m.name}</div>
                  <div className="meta">
                    {m.city} · {m.size}
                  </div>
                </div>
                <div className="mover-price">
                  <div className="eth">{m.eth}</div>
                  <div className="usd">{m.usd}</div>
                </div>
                <div className="mover-change">{m.change}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="cta" data-screen-label="CTA">
        <div className="kicker">38,000 investors already hold ground</div>
        <h2 className="serif">Begin your acquisition.</h2>
        <p>
          Secure a verified deed in the world&apos;s premier digital land portfolio. Settlement in
          ETH or USD — your title, on-chain, forever.
        </p>
        <div className="cta-actions">
          <a className="btn btn-gold" href="#">
            Connect Wallet
          </a>
          <Link className="btn btn-ghost" href="/listings">
            Browse Listings
          </Link>
        </div>
      </section>
    </>
  );
}
