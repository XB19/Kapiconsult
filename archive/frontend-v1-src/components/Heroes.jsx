// Les deux bandeaux de titre utilisés sur le site d'origine

export function SectionHero({ image, tag = 'Kapi Consult', title, sub }) {
  return (
    <section style={{ backgroundImage: `linear-gradient(135deg,rgba(10,14,100,0.88) 0%,rgba(8,10,45,0.92) 100%),url('${image}')`, backgroundSize: 'cover', backgroundPosition: 'center', padding: '80px 0', textAlign: 'center' }}>
      <div className="container">
        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gold-light)', marginBottom: '14px' }}>{tag}</div>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '42px', fontWeight: 700, color: 'var(--white)', marginBottom: '16px' }}>{title}</h1>
        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.75)' }}>{sub}</p>
      </div>
    </section>
  );
}

export function PageHero({ image, tag, title, sub }) {
  return (
    <div className="page-hero" style={{ backgroundImage: `linear-gradient(120deg,rgba(10,14,100,0.82),rgba(8,10,45,0.88)),url('${image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="page-hero-inner">
        <div className="page-hero-tag">{tag}</div>
        <h1 className="page-hero-title">{title}</h1>
        <p className="page-hero-sub">{sub}</p>
      </div>
    </div>
  );
}

export const hover = (on, off) => ({
  onMouseOver: (e) => Object.assign(e.currentTarget.style, on),
  onMouseOut: (e) => Object.assign(e.currentTarget.style, off),
});

export const Loading = () => <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--gray)' }}>Chargement…</div>;
