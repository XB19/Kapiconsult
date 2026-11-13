import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Search, SearchX } from 'lucide-react';

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

export function Reveal({ as: Tag = 'div', delay = 0, className = '', style, children, ...rest }) {
  const [ref, inView] = useInView();
  return <Tag ref={ref} className={`reveal ${inView ? 'in' : ''} ${className}`} style={{ '--d': `${delay}ms`, ...style }} {...rest}>{children}</Tag>;
}

// Titre bicolore façon Togo Invest : « Nos **Activités** ». `hl` = partie mise en valeur (premier mot par défaut)
export function Title({ text, hl, as: Tag = 'h2', light = false, className = '' }) {
  const strong = hl ?? text.split(' ')[0];
  const i = text.indexOf(strong);
  return (
    <Tag className={`title ${light ? 'title--light' : ''} ${className}`}>
      {i < 0 ? text : <>{text.slice(0, i)}<b>{strong}</b>{text.slice(i + strong.length)}</>}
    </Tag>
  );
}

export function SecTitle({ title, hl, sub, center = false, light = false, children }) {
  return (
    <Reveal className={`sec-title ${center ? 'center' : ''}`}>
      <Title text={title} hl={hl} light={light} />
      {sub && <p style={light ? { color: 'rgba(255,255,255,.75)' } : undefined}>{sub}</p>}
      {children}
    </Reveal>
  );
}

export function PageBanner({ image, label, title, sub, crumbs = [], children }) {
  return (
    <header className="page-banner">
      {image && <div className="page-banner__bg"><img src={image} alt="" /></div>}
      <div className="wrap">
        <nav className="crumbs" aria-label="Fil d'Ariane">
          <Link to="/">Accueil</Link>
          {crumbs.map((c) => (
            <span key={c.label} style={{ display: 'contents' }}>
              <ChevronRight size={14} />
              {c.to ? <Link to={c.to}>{c.label}</Link> : <span>{c.label}</span>}
            </span>
          ))}
        </nav>
        <h1 style={{ marginTop: 18 }}>{title}</h1>
        {label && <span className="over">{label}</span>}
        {sub && <p style={{ marginTop: 10 }}>{sub}</p>}
        {children && <div className="page-banner__extra">{children}</div>}
      </div>
    </header>
  );
}

export function Stats({ items }) {
  return (
    <div className="stats">
      {items.map(({ icon: Icon, value, label, cat }, i) => (
        <Reveal key={label} delay={i * 80} className="stat">
          {Icon && <div className="stat__ico"><Icon size={28} strokeWidth={1.7} /></div>}
          {cat && <div className="stat__cat">{cat}</div>}
          <div className="stat__val">{value}</div>
          <div className="stat__label">{label}</div>
        </Reveal>
      ))}
    </div>
  );
}

export function Cta({ title, text, children }) {
  return (
    <section className="cta">
      <div className="wrap">
        <div><h2>{title}</h2>{text && <p>{text}</p>}</div>
        <div className="cta__actions">{children}</div>
      </div>
    </section>
  );
}

export const Frieze = () => <div className="frieze" aria-hidden="true" />;

export function SearchField({ value, onChange, placeholder }) {
  return (
    <label className="search">
      <span className="sr-only">{placeholder}</span>
      <Search size={17} />
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </label>
  );
}

export function Empty({ title, children }) {
  return <div className="empty"><SearchX size={36} strokeWidth={1.5} /><b>{title}</b>{children}</div>;
}

export function CardSkeleton({ n = 3, ratio = '16 / 10' }) {
  return Array.from({ length: n }, (_, i) => (
    <div key={i} className="card">
      <div className="skeleton" style={{ aspectRatio: ratio, borderRadius: 0 }} />
      <div className="card__body">
        <div className="skeleton" style={{ height: 12, width: '35%' }} />
        <div className="skeleton" style={{ height: 20, width: '90%' }} />
        <div className="skeleton" style={{ height: 14, width: '70%' }} />
      </div>
    </div>
  ));
}

export const pad2 = (i) => String(i + 1).padStart(2, '0');
export const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
export const readingTime = (text) => Math.max(1, Math.round(String(text || '').split(/\s+/).length / 200));
