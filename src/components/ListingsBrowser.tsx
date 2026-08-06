'use client';

import { useMemo, useState } from 'react';
import ListingCard from './ListingCard';
import { cities } from '@/data/cities';
import type { Listing } from '@/data/site';

const ethValue = (eth: string) => parseFloat(eth);

type Sort = 'price-desc' | 'price-asc' | 'city';

const sorts: { id: Sort; label: string }[] = [
  { id: 'price-desc', label: 'Price · high to low' },
  { id: 'price-asc', label: 'Price · low to high' },
  { id: 'city', label: 'City · A–Z' },
];

export default function ListingsBrowser({ listings }: { listings: Listing[] }) {
  const [city, setCity] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>('price-desc');

  const visible = useMemo(() => {
    const rows = city ? listings.filter((l) => l.cityId === city) : [...listings];
    if (sort === 'city') return rows.sort((a, b) => a.city.localeCompare(b.city));
    return rows.sort((a, b) =>
      sort === 'price-asc'
        ? ethValue(a.eth) - ethValue(b.eth)
        : ethValue(b.eth) - ethValue(a.eth)
    );
  }, [listings, city, sort]);

  return (
    <>
      <div className="filter-bar">
        <div className="chips">
          <button
            className={`chip${city === null ? ' is-active' : ''}`}
            onClick={() => setCity(null)}
          >
            All cities
          </button>
          {cities.map((c) => (
            <button
              key={c.id}
              className={`chip${city === c.id ? ' is-active' : ''}`}
              onClick={() => setCity(c.id)}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="filter-sort">
          <label htmlFor="sort">Sort</label>
          <select id="sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            {sorts.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="result-count">
        {visible.length} parcel{visible.length === 1 ? '' : 's'}
        {city ? ` in ${cities.find((c) => c.id === city)?.name}` : ' across 8 cities'}
      </div>

      <div className="listings-grid">
        {visible.map((l) => (
          <ListingCard key={`${l.cityId}-${l.name}`} listing={l} />
        ))}
      </div>
    </>
  );
}
