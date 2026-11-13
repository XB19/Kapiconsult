import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// Déclenche une seule fois quand l'élément entre dans l'écran
export function useInView(options = { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return undefined;
    if (!('IntersectionObserver' in window)) { setInView(true); return undefined; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } }, options);
    io.observe(el);
    return () => io.disconnect();
  }, [inView]); // eslint-disable-line react-hooks/exhaustive-deps
  return [ref, inView];
}

// Apparition progressive au défilement
export function Reveal({ as: Tag = 'div', delay = 0, variant = '', className = '', style, children, ...rest }) {
  const [ref, inView] = useInView();
  return (
    <Tag ref={ref} className={`reveal ${variant} ${inView ? 'in' : ''} ${className}`} style={{ '--d': `${delay}ms`, ...style }} {...rest}>
      {children}
    </Tag>
  );
}

// Compteur animé — accepte "20+", "300Mds", ">300Mds", "100s"
export function Counter({ value, duration = 1800 }) {
  const str = String(value);
  const m = str.match(/^(\D*)(\d+(?:[.,]\d+)?)(.*)$/);
  const [ref, inView] = useInView({ threshold: 0.4 });
  const [n, setN] = useState(0);
  const target = m ? Number(m[2].replace(',', '.')) : 0;
  useEffect(() => {
    if (!inView || !m) return undefined;
    let raf; const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration);
      setN(Math.round(target * (1 - (1 - p) ** 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!m) return <span>{str}</span>;
  return <span ref={ref}>{m[1]}{n}{m[3]}</span>;
}

export function Marquee({ children, speed = 40, reverse = false }) {
  return (
    <div className={`marquee ${reverse ? 'reverse' : ''}`} style={{ '--speed': `${speed}s` }}>
      <div className="marquee-track">{children}{children}</div>
    </div>
  );
}

export function SectionHead({ tag, title, sub, center = false, light = false, children }) {
  return (
    <Reveal className={`section-head ${center ? 'center' : ''}`}>
      {tag && <span className={`eyebrow ${center ? 'center' : ''} ${light ? 'light' : ''}`}>{tag}</span>}
      <h2 className="h2" style={light ? { color: '#fff' } : undefined}>{title}</h2>
      {sub && <p className="lead" style={light ? { color: 'rgba(255,255,255,.7)' } : undefined}>{sub}</p>}
      {children}
    </Reveal>
  );
}

export function PageHead({ image, tag, title, sub, crumbs = [], children }) {
  return (
    <header className="page-head">
      {image && <div className="page-head-bg"><img src={image} alt="" /></div>}
      <div className="page-head-deco" />
      <div className="container">
        <div className="page-head-inner">
          <nav className="crumbs" aria-label="Fil d'Ariane">
            <Link to="/">Accueil</Link>
            {crumbs.map((c) => (
              <span key={c.label} style={{ display: 'contents' }}>
                <span className="sep">/</span>
                {c.to ? <Link to={c.to}>{c.label}</Link> : <span>{c.label}</span>}
              </span>
            ))}
          </nav>
          {tag && <Reveal><span className="eyebrow light">{tag}</span></Reveal>}
          <Reveal delay={80}><h1 className="h1">{title}</h1></Reveal>
          {sub && <Reveal delay={160}><p className="lead">{sub}</p></Reveal>}
          {children && <Reveal delay={240}>{children}</Reveal>}
        </div>
      </div>
    </header>
  );
}

export const Arrow = () => <span className="arrow" aria-hidden="true">→</span>;

export const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);

export function CardSkeleton({ n = 3, ratio = '16 / 10' }) {
  return Array.from({ length: n }, (_, i) => (
    <div key={i} className="card">
      <div className="skeleton" style={{ aspectRatio: ratio, borderRadius: 0 }} />
      <div className="card-body">
        <div className="skeleton" style={{ height: 12, width: '30%' }} />
        <div className="skeleton" style={{ height: 22, width: '85%' }} />
        <div className="skeleton" style={{ height: 14, width: '95%' }} />
        <div className="skeleton" style={{ height: 14, width: '70%' }} />
      </div>
    </div>
  ));
}

export function Empty({ icon = '🔎', title, children }) {
  return (
    <div className="empty">
      <div className="ico">{icon}</div>
      <b style={{ display: 'block', color: 'var(--ink)', fontSize: 18, marginBottom: 6 }}>{title}</b>
      {children}
    </div>
  );
}

export function CtaBand({ title, text, children }) {
  return (
    <section className="section-tight">
      <div className="container">
        <Reveal variant="zoom" className="cta-band">
          <div>
            <h2 className="h2">{title}</h2>
            {text && <p>{text}</p>}
          </div>
          <div className="cta-actions">{children}</div>
        </Reveal>
      </div>
    </section>
  );
}

// Temps de lecture estimé
export const readingTime = (text) => Math.max(1, Math.round(String(text || '').split(/\s+/).length / 200));
