import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="cta" style={{ minHeight: '70vh', display: 'grid', alignContent: 'center' }}>
      <div className="kicker">Error 404</div>
      <h2 className="serif">This parcel is unmapped.</h2>
      <p>The deed you are looking for has not been surveyed — or the link has expired.</p>
      <div className="cta-actions">
        <Link className="btn btn-gold" href="/">
          Back to the globe
        </Link>
        <Link className="btn btn-ghost" href="/listings">
          Browse Listings
        </Link>
      </div>
    </section>
  );
}
