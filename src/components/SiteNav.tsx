'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/listings', label: 'Listings' },
  { href: '/cities', label: 'Cities' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/market', label: 'Market' },
];

export default function SiteNav() {
  const pathname = usePathname();
  // The home page puts the globe behind the bar, so the nav floats there.
  const overlay = pathname === '/';

  return (
    <nav className={`nav${overlay ? ' is-overlay' : ' is-solid'}`}>
      <Link className="nav-brand" href="/">
        <div className="diamond" />
        <div className="serif wordmark">UNIVERSE&nbsp;LANDS</div>
      </Link>

      <div className="nav-links">
        {links.map((l) => {
          const active = pathname === l.href || pathname.startsWith(l.href + '/');
          return (
            <Link key={l.href} className={`nav-link${active ? ' is-active' : ''}`} href={l.href}>
              {l.label}
            </Link>
          );
        })}
        <div className="nav-divider" />
        <Link className="nav-link is-plain" href="/market">
          Sign In
        </Link>
        <Link className="btn btn-gold" href="/market">
          Connect Wallet
        </Link>
      </div>
    </nav>
  );
}
