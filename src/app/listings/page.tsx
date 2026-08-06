import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import ListingsBrowser from '@/components/ListingsBrowser';
import { allListings } from '@/data/site';

export const metadata: Metadata = {
  title: 'Listings',
  description: 'Every verified parcel currently on the Universe Lands exchange.',
};

export default function ListingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Marketplace"
        title="Every parcel on the exchange"
        lede="Twenty-four surveyed parcels across eight cities. Fixed-price listings settle instantly; auctions close on the clock shown on each deed."
      />
      <section className="listings" data-screen-label="Listings">
        <div className="shell">
          <ListingsBrowser listings={allListings} />
        </div>
      </section>
    </>
  );
}
