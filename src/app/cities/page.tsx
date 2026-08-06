import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import CityCard from '@/components/CityCard';
import { cities } from '@/data/cities';

export const metadata: Metadata = {
  title: 'Cities',
  description: 'The eight districts currently live on Universe Lands.',
};

export default function CitiesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Live Districts"
        title="Eight cities, mapped and issued"
        lede="Each district is surveyed against real coordinates and released as a finite set of deeds. Ninety-six more cities are queued for survey."
      />
      <section className="listings" data-screen-label="Cities">
        <div className="shell">
          <div className="city-grid">
            {cities.map((c) => (
              <CityCard key={c.id} city={c} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
