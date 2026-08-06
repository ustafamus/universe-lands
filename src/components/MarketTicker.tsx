import { ticker } from '@/data/site';

export default function MarketTicker() {
  return (
    <section className="ticker" data-screen-label="Live Market Ticker">
      <div className="ticker-track">
        {ticker.map((t, i) => (
          <div className="ticker-item" key={`${t.text}-${i}`}>
            <span className="pip" style={{ background: t.color }} />
            <span className="kind" style={{ color: t.color }}>
              {t.kind}
            </span>
            <span className="text">{t.text}</span>
            <span className="price">{t.price}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
