import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cta, PageHead, Reveal, SecHead, pad2 } from '../components/ui';
import { Steps } from './AProposPage';
import {
  APPROCHE, ATOUTS, COUVERTURE, CTA, DOMAINES, DOMAINES_INTRO, HERO, PUBLICATIONS, REALISATIONS, RECRUTEMENTS, SECTEURS, SEMINAIRES, VISION,
} from '../content/activites';

function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-40% 0px -55% 0px' });
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [ids]);
  return active;
}

const goTo = (id) => (e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };

function Domaines() {
  const ids = useMemo(() => DOMAINES.map((d) => d.id), []);
  const active = useScrollSpy(ids);
  return (
    <section className="sec">
      <div className="wrap">
        <SecHead label={DOMAINES_INTRO.tag} title={DOMAINES_INTRO.title} lead={DOMAINES_INTRO.sub} />
        <div className="side-layout">
          <nav className="side-nav" aria-label="Domaines d'expertise">
            <span className="side-nav__title">Sommaire</span>
            {DOMAINES.map((d, i) => (
              <a key={d.id} href={`#${d.id}`} onClick={goTo(d.id)} className={active === d.id ? 'is-active' : ''}><i>{pad2(i)}</i>{d.name}</a>
            ))}
          </nav>
          <div>
            {DOMAINES.map((d, i) => (
              <article key={d.id} id={d.id} className="domain">
                <Reveal className="domain__img"><img src={d.img} alt={d.name} loading="lazy" /></Reveal>
                <Reveal delay={80}>
                  <span className="kicker">Domaine {pad2(i)}</span>
                  <h3>{d.name}</h3>
                  <p>{d.text}</p>
                  <ul className="ticks">{d.items.map((it) => <li key={it}>{it}</li>)}</ul>
                </Reveal>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SecteursVision() {
  return (
    <section className="sec sec--stone">
      <div className="wrap">
        <SecHead label={SECTEURS.tag} title={SECTEURS.title} />
        <Reveal as="ul" className="index-list">
          {SECTEURS.items.map((s, i) => <li key={s}><span>{pad2(i)}</span>{s}</li>)}
        </Reveal>

        <div className="cols cols-6-6 align-center" style={{ marginTop: 96 }}>
          <Reveal><img src={VISION.img} alt="Technology" /></Reveal>
          <Reveal delay={100}>
            <span className="kicker" style={{ marginBottom: 16 }}>{VISION.tag}</span>
            <h2 className="t-2" style={{ marginBottom: 16 }}>{VISION.title}</h2>
            <p className="lead">{VISION.text}</p>
          </Reveal>
        </div>

        <div className="cols cols-6-6 align-center" style={{ marginTop: 96 }}>
          <Reveal>
            <span className="kicker" style={{ marginBottom: 16 }}>{ATOUTS.tag}</span>
            <h2 className="t-2" style={{ marginBottom: 16 }}>{ATOUTS.title}</h2>
            <p style={{ marginBottom: 24 }}>{ATOUTS.text}</p>
            <ul className="ticks ticks--2">{ATOUTS.items.map((a) => <li key={a}>{a}</li>)}</ul>
          </Reveal>
          <Reveal delay={100}><img src={ATOUTS.img} alt="Nos atouts" /></Reveal>
        </div>
      </div>
    </section>
  );
}

function Couverture() {
  const groups = [[COUVERTURE.actuelleLabel, COUVERTURE.actuelle, true], [COUVERTURE.projetLabel, COUVERTURE.projet], [COUVERTURE.secteursLabel, COUVERTURE.secteurs]];
  return (
    <section className="sec sec--navy">
      <div className="wrap cols cols-6-6 align-start">
        <div>
          <Reveal>
            <span className="kicker kicker--light" style={{ marginBottom: 16 }}>{COUVERTURE.tag}</span>
            <h2 className="t-2" style={{ marginBottom: 18 }}>{COUVERTURE.title}</h2>
            <p>{COUVERTURE.text}</p>
          </Reveal>
          <div style={{ marginTop: 36, display: 'grid', gap: 26 }}>
            {groups.map(([label, items, hl]) => (
              <Reveal key={label}>
                <span className="kicker kicker--light" style={{ fontSize: 12, marginBottom: 10 }}>{label}</span>
                <div className="tags">
                  {items.map((x) => <span key={x} className="tag" style={hl ? { background: 'var(--gold)', borderColor: 'var(--gold)', color: '#fff' } : undefined}>{x}</span>)}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <div>
          <Reveal><h3 className="t-3" style={{ marginBottom: 20 }}>{APPROCHE.title}</h3></Reveal>
          <Steps steps={APPROCHE.steps} stack />
        </div>
      </div>
    </section>
  );
}

function Recrutements() {
  return (
    <section className="sec">
      <div className="wrap">
        <SecHead label={RECRUTEMENTS.tag} title={RECRUTEMENTS.title} lead={RECRUTEMENTS.sub} />
        <div className="rows">
          {RECRUTEMENTS.items.map((r, i) => (
            <Reveal key={r.name} className="row">
              <span className="row__num">{pad2(i)}</span>
              <h3 className="row__title" style={{ fontSize: 21 }}>{r.name}</h3>
              <ul className="ticks row__body" style={{ marginTop: 0 }}>{r.missions.map((m) => <li key={m}>{m}</li>)}</ul>
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
    <section className="sec sec--stone">
      <div className="wrap">
        <Reveal className="sec-head">
          <div className="sec-head__label"><span className="kicker">{REALISATIONS.tag}</span></div>
          <div className="sec-head__body">
            <h2 className="t-2">{REALISATIONS.title}</h2>
            <p className="lead">{REALISATIONS.sub[0]}<strong style={{ color: 'var(--ink)' }}>{REALISATIONS.sub[1]}</strong>{REALISATIONS.sub[2]}</p>
          </div>
        </Reveal>
        <div className="filters-line" role="tablist" aria-label="Filtrer par catégorie">
          {cats.map((c) => (
            <button key={c} role="tab" aria-selected={cat === c} className={cat === c ? 'is-active' : ''} onClick={() => setCat(c)}>
              {c}<sup>{c === 'Tous' ? REALISATIONS.items.length : REALISATIONS.items.filter((r) => r.cat === c).length}</sup>
            </button>
          ))}
        </div>
        <div className="entries">
          {items.map((r) => (
            <div key={r.name} className="entry">
              <div className={`entry__img ${r.img ? '' : 'entry__img--placeholder'}`} style={r.logo ? { background: '#fff', border: '1px solid var(--rule)' } : undefined}>
                {r.img ? <img src={r.img} alt={r.name} loading="lazy" style={r.logo ? { objectFit: 'contain', padding: '36px 48px' } : undefined} /> : <span>{r.cat}</span>}
              </div>
              <div className="entry__meta"><span className="cat">{r.cat}</span></div>
              <h3 className="entry__title" style={{ fontSize: 20 }}>{r.name}</h3>
              <p className="entry__text">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SeminairesPublications() {
  return (
    <section className="sec">
      <div className="wrap cols cols-6-6 align-start">
        <Reveal>
          <span className="kicker" style={{ marginBottom: 16 }}>{SEMINAIRES.tag}</span>
          <h2 className="t-2" style={{ marginBottom: 16 }}>{SEMINAIRES.title}</h2>
          <p style={{ marginBottom: 24 }}>{SEMINAIRES.text}</p>
          <ul className="ticks ticks--2">{SEMINAIRES.items.map((s) => <li key={s}>{s}</li>)}</ul>
        </Reveal>
        <Reveal delay={100}>
          <span className="kicker" style={{ marginBottom: 16 }}>{PUBLICATIONS.tag}</span>
          <h2 className="t-2" style={{ marginBottom: 16 }}>{PUBLICATIONS.title}</h2>
          <p style={{ marginBottom: 24 }}>{PUBLICATIONS.text}</p>
          <div className="rows" style={{ borderTopColor: 'var(--rule)' }}>
            {PUBLICATIONS.items.map((p, i) => (
              <div key={p} style={{ display: 'grid', gridTemplateColumns: '40px 1fr', padding: '16px 0', borderBottom: '1px solid var(--rule)' }}>
                <span className="row__num" style={{ fontSize: 15 }}>{pad2(i)}</span>
                <span className="serif" style={{ fontSize: 18, lineHeight: 1.4, color: 'var(--ink)' }}>{p}</span>
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
      <PageHead image={HERO.image} label={HERO.tag} title={HERO.title} sub={HERO.sub} crumbs={[{ label: 'Nos activités' }]} />
      <Domaines />
      <SecteursVision />
      <Couverture />
      <Recrutements />
      <Realisations />
      <SeminairesPublications />
      <Cta title={CTA.title} text={CTA.text}>
        <Link to="/contact" className="btn">Nous contacter</Link>
        <Link to="/offres" className="btn btn--line">Voir nos offres d'emploi</Link>
      </Cta>
    </main>
  );
}
