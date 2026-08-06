import type { Metadata } from 'next';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import { faqs, steps } from '@/data/site';

export const metadata: Metadata = {
  title: 'How It Works',
  description: 'Three moves to ownership on the Universe Lands protocol.',
};

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Protocol"
        title="Three moves to ownership"
        lede="Survey, settle, build. Every deed follows the same path from mint to monetisation — no intermediaries at any step."
      />

      <section className="how" data-screen-label="How It Works">
        <div className="shell">
          <div className="steps">
            {steps.map((s) => (
              <div className="step" key={s.n}>
                <div className="serif numeral">{s.n}</div>
                <div className="rule" />
                <div className="serif title">{s.t}</div>
                <p>{s.d}</p>
                <ul className="step-list">
                  {s.detail.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="faq" data-screen-label="FAQ">
        <div className="shell">
          <div className="eyebrow">
            <div className="rule" />
            <div className="text">Common questions</div>
          </div>
          <h2 className="serif section-title">Before you bid</h2>
          <div className="faq-grid">
            {faqs.map((f) => (
              <div className="faq-item" key={f.q}>
                <div className="serif q">{f.q}</div>
                <p>{f.a}</p>
              </div>
            ))}
          </div>

          <div className="cta-actions" style={{ marginTop: '56px' }}>
            <Link className="btn btn-gold" href="/listings">
              Browse Listings
            </Link>
            <Link className="btn btn-ghost" href="/cities">
              Explore Districts
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
