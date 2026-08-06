'use client';

import Link from 'next/link';
import { useCallback, useState } from 'react';
import Globe from './Globe';
import CityPanel from './CityPanel';
import { cities, getCity, globeMarkers } from '@/data/cities';
import { siteConfig, stats } from '@/data/site';

export default function Hero() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedCity = getCity(selected);

  const handleSelect = useCallback((id: string) => setSelected(id), []);
  const handleClear = useCallback(() => setSelected(null), []);

  return (
    <section className="hero" data-screen-label="Hero — 3D Globe Explorer">
      <Globe
        className="hero-globe"
        markers={globeMarkers}
        selected={selected}
        autoRotate={siteConfig.autoRotate}
        speed={siteConfig.rotateSpeed}
        onSelect={handleSelect}
        onClear={handleClear}
      />
      <div className="hero-scrim" />

      <div className="hero-copy">
        <div className="hero-copy-inner">
          <div className="eyebrow fade-up" style={{ animationDelay: '.1s' }}>
            <div className="rule" />
            <div className="text">The Premium Metaverse Land Exchange</div>
          </div>

          <h1 className="serif hero-title fade-up" style={{ animationDelay: '.22s' }}>
            Own the world.
            <br />
            <span className="accent">Virtually.</span>
          </h1>

          <p className="hero-lede fade-up" style={{ animationDelay: '.36s' }}>
            Acquire, trade, and build on verified digital parcels mapped to the world&apos;s greatest
            cities — from Istanbul to Tokyo. Peer-to-peer, in ETH or USD.
          </p>

          <div className="hero-actions fade-up" style={{ animationDelay: '.5s' }}>
            <Link className="btn btn-gold" href="/listings">
              View Listings
            </Link>
            <Link className="btn btn-ghost" href="/how-it-works">
              How It Works
            </Link>
          </div>

          <div className="hero-stats fade-up" style={{ animationDelay: '.64s' }}>
            {stats.map((s) => (
              <div key={s.k}>
                <div className="serif value">{s.v}</div>
                <div className="label">{s.k}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedCity && <CityPanel city={selectedCity} onClose={handleClear} />}

      <div className="hero-foot fade-up" style={{ animationDelay: '.8s' }}>
        <div className="hero-hint">Drag to rotate · Scroll to zoom · Select a beacon</div>
        <div className="chips">
          {cities.map((c) => (
            <button
              key={c.id}
              className={`chip${c.id === selected ? ' is-active' : ''}`}
              onClick={() => setSelected(c.id)}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
