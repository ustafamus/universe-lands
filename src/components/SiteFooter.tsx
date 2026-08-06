import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="site-footer" data-screen-label="Footer">
      <Link className="brand" href="/">
        <div className="diamond" />
        <div className="serif wordmark">UNIVERSE LANDS</div>
      </Link>
      <nav>
        <Link href="/listings">Listings</Link>
        <Link href="/cities">Cities</Link>
        <Link href="/how-it-works">How It Works</Link>
        <Link href="/market">Market</Link>
      </nav>
      <div className="copy">© 2026 Universe Lands — concept mockup</div>
    </footer>
  );
}
