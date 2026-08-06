import Link from 'next/link';
import Hero from '@/components/Hero';
import MarketTicker from '@/components/MarketTicker';
import ListingCard from '@/components/ListingCard';
import { featured, siteConfig } from '@/data/site';

export default function Home() {
  return (
    <>
      <Hero />
      {siteConfig.showTicker && <MarketTicker />}

      <section className="listings" data-screen-label="Featured Listings">
        <div className="shell">
          <div className="listings-head">
            <div>
              <div className="eyebrow">
                <div className="rule" />
                <div className="text">Curated This Week</div>
              </div>
              <h2 className="serif section-title">Featured acquisitions</h2>
            </div>
            <Link className="all-link" href="/listings">
              View all 24 parcels →
            </Link>
          </div>

          <div className="listings-grid">
            {featured.slice(0, 3).map((l) => (
              <ListingCard key={`${l.cityId}-${l.name}`} listing={l} />
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
          <Link className="btn btn-gold" href="/market">
            Connect Wallet
          </Link>
          <Link className="btn btn-ghost" href="/listings">
            Browse Listings
          </Link>
        </div>
      </section>
    </>
  );
}
