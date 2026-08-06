import type { Metadata, Viewport } from 'next';
import { Albert_Sans, Marcellus } from 'next/font/google';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import './globals.css';

const marcellus = Marcellus({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-serif',
  display: 'swap',
});

const albertSans = Albert_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Universe Lands — The Premium Metaverse Land Exchange',
    template: '%s — Universe Lands',
  },
  description:
    "Acquire, trade, and build on verified digital parcels mapped to the world's greatest cities — from Istanbul to Tokyo. Peer-to-peer, in ETH or USD.",
};

export const viewport: Viewport = {
  themeColor: '#05070d',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${marcellus.variable} ${albertSans.variable}`}>
      <body>
        <div className="page">
          <SiteNav />
          <main>{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
