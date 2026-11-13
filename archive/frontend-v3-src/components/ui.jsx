import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return undefined;
    if (!('IntersectionObserver' in window)) { setInView(true); return undefined; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } }, { threshold, rootMargin: '0px 0px -40px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [inView, threshold]);
  return [ref, inView];
}

// Apparition discrète (fondu court)
export function Reveal({ as: Tag = 'div', delay = 0, className = '', style, children, ...rest }) {
  const [ref, inView] = useInView();
  return (
    <Tag ref={ref} className={`reveal ${inView ? 'in' : ''} ${className}`} style={{ '--d': `${delay}ms`, ...style }} {...rest}>
      {children}
    </Tag>
  );
}

// En-tête de section : rubrique à gauche, titre et chapeau à droite
export function SecHead({ label, title, lead, light = false, stack = false, children }) {
  return (
    <Reveal className={`sec-head ${stack ? 'sec-head--stack' : ''}`}>
      <div className="sec-head__label"><span className={`kicker ${light ? 'kicker--light' : ''}`}>{label}</span></div>
      <div className="sec-head__body">
        <h2 className="t-2">{title}</h2>
        {lead && <p className="lead">{lead}</p>}
        {children && <div className="sec-head__aside">{children}</div>}
      </div>
    </Reveal>
  );
}

// Bandeau des pages intérieures : texte sur fond marine + photo à droite
export function PageHead({ image, label, title, sub, crumbs = [], children }) {
  return (
    <header className="page-head">
      <div className="wrap page-head__grid">
        <div className="page-head__text">
          <nav className="crumbs" aria-label="Fil d'Ariane">
            <Link to="/">Accueil</Link>
            {crumbs.map((c) => (
              <span key={c.label} style={{ display: 'contents' }}>
                <span aria-hidden="true">/</span>
                {c.to ? <Link to={c.to}>{c.label}</Link> : <span>{c.label}</span>}
              </span>
            ))}
          </nav>
          <span className="kicker kicker--light" style={{ marginTop: 34 }}>{label}</span>
          <h1 className="t-1">{title}</h1>
          {sub && <p className="lead">{sub}</p>}
          {children && <div className="page-head__extra">{children}</div>}
        </div>
        {image && <div className="page-head__media"><img src={image} alt="" /></div>}
      </div>
    </header>
  );
}

export function Figures({ items, dark = false }) {
  return (
    <div className={`figures ${dark ? 'figures--dark' : ''}`}>
      {items.map((f) => (
        <div className="figure" key={f.label}>
          <span className="figure__value num">{f.value}</span>
          <span className="figure__label">{f.label}</span>
        </div>
      ))}
    </div>
  );
}

export function Cta({ title, text, children }) {
  return (
    <section className="cta">
      <div className="wrap">
        <Reveal>
          <h2 className="t-2">{title}</h2>
          {text && <p className="lead">{text}</p>}
        </Reveal>
        <Reveal className="cta__actions" delay={100}>{children}</Reveal>
      </div>
    </section>
  );
}

export const SearchIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);

export function SearchField({ value, onChange, placeholder }) {
  return (
    <label className="search">
      <span className="sr-only">{placeholder}</span>
      <SearchIcon />
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </label>
  );
}

export function Empty({ title, children }) {
  return <div className="empty"><b>{title}</b>{children}</div>;
}

export function EntrySkeleton({ n = 3, ratio = '3 / 2' }) {
  return Array.from({ length: n }, (_, i) => (
    <div key={i}>
      <div className="skeleton" style={{ aspectRatio: ratio, marginBottom: 20 }} />
      <div className="skeleton" style={{ height: 12, width: '35%', marginBottom: 12 }} />
      <div className="skeleton" style={{ height: 22, width: '90%', marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 22, width: '60%' }} />
    </div>
  ));
}

export const pad2 = (i) => String(i + 1).padStart(2, '0');
export const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
export const readingTime = (text) => Math.max(1, Math.round(String(text || '').split(/\s+/).length / 200));
