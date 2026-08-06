export default function PageHeader({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="page-head">
      <div className="shell">
        <div className="eyebrow">
          <div className="rule" />
          <div className="text">{eyebrow}</div>
        </div>
        <h1 className="serif page-title">{title}</h1>
        {lede && <p className="page-lede">{lede}</p>}
        {children}
      </div>
    </header>
  );
}
