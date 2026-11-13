import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Arrow, CtaBand, Marquee, PageHead, Reveal, SectionHead } from '../components/ui';
import { Steps } from './AProposPage';
import {
  APPROCHE, ATOUTS, COUVERTURE, CTA, DOMAINES, DOMAINES_INTRO, HERO, PUBLICATIONS, REALISATIONS, RECRUTEMENTS, SECTEURS, SEMINAIRES, VISION,
} from '../content/activites';

// Navigation latérale qui suit le défilement (scrollspy)
function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [ids]);
  return active;
}

function Domaines() {
  const ids = useMemo(() => DOMAINES.map((d) => d.id), []);
  const active = useScrollSpy(ids);
  return (
    <section className="section">
      <div className="container">
        <SectionHead tag={DOMAINES_INTRO.tag} title={DOMAINES_INTRO.title} sub={DOMAINES_INTRO.sub} />
        <div className="domains">
          <nav className="domains-nav" aria-label="Domaines d'expertise">
            {DOMAINES.map((d, i) => (
              <a key={d.id} href={`#${d.id}`} className={active === d.id ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); document.getElementById(d.id)?.scrollIntoView({ behavior: 'smooth' }); }}>
                <i>{String(i + 1).padStart(2, '0')}</i>{d.name}
              </a>
            ))}
          </nav>
          <div>
            {DOMAINES.map((d) => (
              <Reveal as="article" key={d.id} id={d.id} className="domain">
                <div className="domain-media"><img src={d.img} alt={d.name} loading="lazy" /><span className="badge">Domaine</span></div>
                <div>
                  <h3>{d.name}</h3>
                  <p>{d.text}</p>
                  <ul className="ticks">{d.items.map((it) => <li key={it}>{it}</li>)}</ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Secteurs() {
  return (
    <section className="section-tight bg-paper">
      <div className="container">
        <SectionHead center tag={SECTEURS.tag} title={SECTEURS.title} />
      </div>
      <Marquee speed={45}>
        {SECTEURS.items.map((s) => <span key={s} className="chip" style={{ marginRight: 12, padding: '14px 24px', fontSize: 16 }}>{s}</span>)}
      </Marquee>
    </section>
  );
}

function VisionAtouts() {
  return (
    <section className="section">
      <div className="container">
        <Reveal variant="zoom" className="cta-band vision-band" style={{ gridTemplateColumns: '1fr 1fr', padding: 0, marginBottom: 96 }}>
          <div style={{ padding: 56 }}>
            <span className="eyebrow light">{VISION.tag}</span>
            <h3 className="h2" style={{ marginTop: 14 }}>{VISION.title}</h3>
            <p>{VISION.text}</p>
          </div>
          <img src={VISION.img} alt="Technology" style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 300 }} />
        </Reveal>
        <div className="split">
          <div>
            <SectionHead tag={ATOUTS.tag} title={ATOUTS.title} sub={ATOUTS.text} />
            <Reveal><ul className="ticks two">{ATOUTS.items.map((a) => <li key={a}>{a}</li>)}</ul></Reveal>
          </div>
          <Reveal variant="from-right"><img src={ATOUTS.img} alt="Nos atouts" style={{ borderRadius: 24 }} /></Reveal>
        </div>
      </div>
    </section>
  );
}

function Couverture() {
  return (
    <section className="section bg-ink on-dark">
      <div className="container">
        <div className="split" style={{ alignItems: 'start' }}>
          <div>
            <SectionHead light tag={COUVERTURE.tag} title={COUVERTURE.title} sub={COUVERTURE.text} />
            <Reveal style={{ display: 'grid', gap: 22 }}>
              {[[COUVERTURE.actuelleLabel, COUVERTURE.actuelle, true], [COUVERTURE.projetLabel, COUVERTURE.projet], [COUVERTURE.secteursLabel, COUVERTURE.secteurs]].map(([label, items, hl]) => (
                <div key={label}>
                  <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gold-2)', marginBottom: 10 }}>{label}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {items.map((x) => <span key={x} className="chip" style={hl ? { background: 'var(--gold)', color: '#fff', borderColor: 'transparent' } : { background: 'rgba(255,255,255,.06)', color: '#fff', borderColor: 'rgba(255,255,255,.14)' }}>{x}</span>)}
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
          <div>
            <Reveal><h3 className="h3" style={{ color: '#fff', marginBottom: 32 }}>{APPROCHE.title}</h3></Reveal>
            <div className="steps-vertical"><Steps steps={APPROCHE.steps} dark /></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Recrutements() {
  return (
    <section className="section">
      <div className="container">
        <SectionHead center tag={RECRUTEMENTS.tag} title={RECRUTEMENTS.title} sub={RECRUTEMENTS.sub} />
        <div className="grid grid-2">
          {RECRUTEMENTS.items.map((r, i) => (
            <Reveal key={r.name} delay={(i % 2) * 120}>
              <div className="value-card">
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 18 }}>
                  <div className="value-ico" style={{ marginBottom: 0 }}>{r.icon}</div>
                  <h3 style={{ marginBottom: 0, fontSize: 20 }}>{r.name}</h3>
                </div>
                <ul className="ticks">{r.missions.map((m) => <li key={m}>{m}</li>)}</ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Realisations() {
  const cats = ['Tous', ...new Set(REALISATIONS.items.map((r) => r.cat))];
  const [cat, setCat] = useState('Tous');
  const items = REALISATIONS.items.filter((r) => cat === 'Tous' || r.cat === cat);
  return (
    <section className="section bg-paper">
      <div className="container">
        <Reveal className="section-head center">
          <span className="eyebrow center">{REALISATIONS.tag}</span>
          <h2 className="h2">{REALISATIONS.title}</h2>
          <p className="lead">{REALISATIONS.sub[0]}<strong style={{ color: 'var(--brand)' }}>{REALISATIONS.sub[1]}</strong>{REALISATIONS.sub[2]}</p>
        </Reveal>
        <Reveal style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}>
          <div className="tabs" role="tablist">
            {cats.map((c) => (
              <button key={c} role="tab" aria-selected={cat === c} className={`tab ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>
                {c}<span className="count">{c === 'Tous' ? REALISATIONS.items.length : REALISATIONS.items.filter((r) => r.cat === c).length}</span>
              </button>
            ))}
          </div>
        </Reveal>
        <div className="grid grid-3" key={cat}>
          {items.map((r, i) => (
            <Reveal key={r.name} delay={(i % 3) * 90}>
              <article className="card card-hover">
                <div className="card-media" style={{ aspectRatio: '16 / 9', background: r.logo ? '#fff' : undefined }}>
                  {r.img
                    ? <img src={r.img} alt={r.name} loading="lazy" style={r.logo ? { objectFit: 'contain', padding: 34 } : undefined} />
                    : <div className="media-fallback" style={{ fontSize: 54 }}>{r.icon}</div>}
                  <span className="badge">{r.cat}</span>
                </div>
                <div className="card-body"><h3 className="card-title" style={{ fontSize: 19 }}>{r.name}</h3><p className="card-text">{r.text}</p></div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SeminairesPublications() {
  return (
    <section className="section">
      <div className="container grid grid-2" style={{ gap: 28 }}>
        <Reveal className="value-card">
          <span className="eyebrow">{SEMINAIRES.tag}</span>
          <h3 className="h3" style={{ margin: '14px 0 12px' }}>{SEMINAIRES.title}</h3>
          <p>{SEMINAIRES.text}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 22 }}>
            {SEMINAIRES.items.map((s) => <span key={s} className="chip chip-soft">{s}</span>)}
          </div>
        </Reveal>
        <Reveal delay={120} className="value-card" style={{ background: 'var(--ink)', borderColor: 'var(--ink)' }}>
          <span className="eyebrow light">{PUBLICATIONS.tag}</span>
          <h3 className="h3" style={{ margin: '14px 0 12px', color: '#fff' }}>{PUBLICATIONS.title}</h3>
          <p style={{ color: 'rgba(255,255,255,.65)' }}>{PUBLICATIONS.text}</p>
          <div style={{ display: 'grid', gap: 10, marginTop: 22 }}>
            {PUBLICATIONS.items.map((p) => (
              <div key={p} style={{ display: 'flex', gap: 12, padding: '14px 16px', borderRadius: 14, background: 'rgba(255,255,255,.06)', color: 'rgba(255,255,255,.88)', fontSize: 14.5, fontWeight: 600 }}>
                <span>📄</span><span>{p}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function NosActivitesPage() {
  return (
    <main>
      <PageHead image={HERO.image} tag={HERO.tag} title={HERO.title} sub={HERO.sub} crumbs={[{ label: 'Nos activités' }]}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 28 }}>
          {DOMAINES.map((d) => (
            <a key={d.id} href={`#${d.id}`} className="chip" style={{ background: 'rgba(255,255,255,.08)', color: '#fff', borderColor: 'rgba(255,255,255,.2)' }}
              onClick={(e) => { e.preventDefault(); document.getElementById(d.id)?.scrollIntoView({ behavior: 'smooth' }); }}>{d.name}</a>
          ))}
        </div>
      </PageHead>
      <Domaines />
      <Secteurs />
      <VisionAtouts />
      <Couverture />
      <Recrutements />
      <Realisations />
      <SeminairesPublications />
      <CtaBand title={CTA.title} text={CTA.text}>
        <Link to="/contact" className="btn btn-gold btn-lg">Nous contacter <Arrow /></Link>
        <Link to="/offres" className="btn btn-ghost-light btn-lg">Voir nos offres d'emploi</Link>
      </CtaBand>
    </main>
  );
}
