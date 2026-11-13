import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, CheckCircle2, FileText, MapPin } from 'lucide-react';
import { Cta, Frieze, PageBanner, Reveal, SecTitle, Title } from '../components/ui';
import { Steps } from './AProposPage';
import {
  APPROCHE, ATOUTS, COUVERTURE, CTA, DOMAINES, DOMAINES_INTRO, HERO, PUBLICATIONS, REALISATIONS, RECRUTEMENTS, SECTEURS, SEMINAIRES, VISION,
} from '../content/activites';
import { DOMAINE_ICONS, REAL_ICONS, RECRUT_ICONS, SECTEUR_ICONS } from '../content/icons';

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
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return undefined;
    const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 150);
    return () => clearTimeout(t);
  }, [hash]);
  // Sur mobile, la barre des domaines défile horizontalement : on garde l'onglet actif visible
  const navRef = useRef(null);
  useEffect(() => {
    const nav = navRef.current; const a = nav?.querySelector('.is-active');
    if (!nav || !a || nav.scrollWidth <= nav.clientWidth) return;
    nav.scrollTo({ left: a.offsetLeft - (nav.clientWidth - a.offsetWidth) / 2, behavior: 'smooth' });
  }, [active]);

  return (
    <section className="sec sec--bg">
      <div className="wrap">
        <SecTitle title={DOMAINES_INTRO.title} hl="8 domaines" sub={DOMAINES_INTRO.sub} />
        <div className="side-layout">
          <nav ref={navRef} className="side-nav" aria-label="Domaines d'expertise">
            <span className="side-nav__title">{DOMAINES_INTRO.tag}</span>
            {DOMAINES.map((d) => {
              const Icon = DOMAINE_ICONS[d.id];
              return <a key={d.id} href={`#${d.id}`} onClick={goTo(d.id)} className={active === d.id ? 'is-active' : ''}><Icon size={17} />{d.name}</a>;
            })}
          </nav>
          <div>
            {DOMAINES.map((d) => {
              const Icon = DOMAINE_ICONS[d.id];
              return (
                <article key={d.id} id={d.id} className="domain">
                  <div className="domain__img"><img src={d.img} alt={d.name} loading="lazy" /><span className="domain__ico"><Icon size={24} /></span></div>
                  <div>
                    <span className="over">Domaine</span>
                    <h3>{d.name}</h3>
                    <p>{d.text}</p>
                    <ul className="checks checks--plain">{d.items.map((it) => <li key={it}><CheckCircle2 size={17} />{it}</li>)}</ul>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function Secteurs() {
  return (
    <section className="sec">
      <div className="wrap">
        <SecTitle title={SECTEURS.title} hl="tous les secteurs" center />
        <div className="grid g-4" style={{ gap: 18 }}>
          {SECTEURS.items.map((s, i) => {
            const Icon = SECTEUR_ICONS[s];
            return (
              <Reveal key={s} delay={(i % 4) * 60} className="feature" style={{ padding: '22px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div className="feature__ico" style={{ margin: 0, width: 48, height: 48 }}><Icon size={22} /></div>
                <h3 style={{ fontSize: 15.5, margin: 0 }}>{s}</h3>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function VisionAtouts() {
  return (
    <section className="sec sec--cream">
      <div className="wrap split" style={{ marginBottom: 80 }}>
        <Reveal><img src={VISION.img} alt="Technology" style={{ borderRadius: 'var(--radius)' }} /></Reveal>
        <Reveal delay={100}>
          <span className="over">{VISION.tag}</span>
          <Title text={VISION.title} hl="Innovation & Expertise" className="t-lg" />
          <p className="lead" style={{ marginTop: 16 }}>{VISION.text}</p>
        </Reveal>
      </div>
      <div className="wrap split">
        <Reveal>
          <span className="over">{ATOUTS.tag}</span>
          <Title text={ATOUTS.title} hl="RESULTATS" className="t-lg" />
          <p style={{ margin: '16px 0 22px' }}>{ATOUTS.text}</p>
          <ul className="checks checks--2">{ATOUTS.items.map((a) => <li key={a}><CheckCircle2 size={17} />{a}</li>)}</ul>
        </Reveal>
        <Reveal delay={100}><img src={ATOUTS.img} alt="Nos atouts" style={{ borderRadius: 'var(--radius)' }} /></Reveal>
      </div>
    </section>
  );
}

function Couverture() {
  return (
    <section className="sec sec--brand">
      <div className="wrap split split--top">
        <div>
          <Reveal>
            <span className="over">{COUVERTURE.tag}</span>
            <Title text={COUVERTURE.title} hl="Présence régionale" light className="t-lg" />
            <p style={{ marginTop: 16 }}>{COUVERTURE.text}</p>
          </Reveal>
          {[[COUVERTURE.actuelleLabel, COUVERTURE.actuelle, true], [COUVERTURE.projetLabel, COUVERTURE.projet], [COUVERTURE.secteursLabel, COUVERTURE.secteurs]].map(([label, items, hl]) => (
            <Reveal key={label} style={{ marginTop: 26 }}>
              <h4 style={{ fontSize: 15, color: 'var(--gold)', marginBottom: 10 }}>{label}</h4>
              <div className="chips">
                {items.map((x) => {
                  const name = x.replace(/^[\u{1F1E6}-\u{1F1FF}]{2}\s*/u, '');
                  return <span key={x} className="chip" style={hl ? { background: 'var(--gold)', borderColor: 'var(--gold)' } : undefined}><MapPin size={14} style={hl ? { color: '#fff' } : undefined} />{name}</span>;
                })}
              </div>
            </Reveal>
          ))}
        </div>
        <div>
          <Reveal><h3 className="t-md" style={{ marginBottom: 14 }}>{APPROCHE.title}</h3></Reveal>
          <Steps steps={APPROCHE.steps} list />
        </div>
      </div>
    </section>
  );
}

function Recrutements() {
  return (
    <section className="sec">
      <div className="wrap">
        <SecTitle title={RECRUTEMENTS.title} hl="centaines de profils" sub={RECRUTEMENTS.sub} center />
        <div className="grid g-2">
          {RECRUTEMENTS.items.map((r, i) => {
            const Icon = RECRUT_ICONS[i];
            return (
              <Reveal key={r.name} delay={(i % 2) * 100} className="list-card">
                <div className="list-card__ico"><Icon size={24} /></div>
                <div>
                  <h3>{r.name}</h3>
                  <ul className="checks checks--plain">{r.missions.map((m) => <li key={m}><CheckCircle2 size={16} />{m}</li>)}</ul>
                </div>
              </Reveal>
            );
          })}
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
    <section className="sec sec--bg">
      <div className="wrap">
        <Reveal className="sec-title center">
          <Title text={REALISATIONS.title} hl="Mobilisation de ressources" />
          <p>{REALISATIONS.sub[0]}<strong style={{ color: 'var(--brand)' }}>{REALISATIONS.sub[1]}</strong>{REALISATIONS.sub[2]}</p>
        </Reveal>
        <div className="tabs tabs--center" role="tablist">
          {cats.map((c) => (
            <button key={c} role="tab" aria-selected={cat === c} className={`tab ${cat === c ? 'is-active' : ''}`} onClick={() => setCat(c)}>
              {c}<sup>{c === 'Tous' ? REALISATIONS.items.length : REALISATIONS.items.filter((r) => r.cat === c).length}</sup>
            </button>
          ))}
        </div>
        <div className="grid g-3">
          {items.map((r) => {
            const Icon = REAL_ICONS[r.name];
            return (
              <div key={r.name} className="card card--hover">
                <div className={`card__img ${r.img ? '' : 'card__img--empty'}`} style={r.logo ? { background: '#fff', borderBottom: '1px solid var(--line)' } : undefined}>
                  {r.img ? <img src={r.img} alt={r.name} loading="lazy" style={r.logo ? { objectFit: 'contain', padding: '30px 50px' } : undefined} /> : <Icon size={52} strokeWidth={1.3} />}
                  <span className="pill pill--gold card__tag">{r.cat}</span>
                </div>
                <div className="card__body"><h3 className="card__title">{r.name}</h3><p className="card__text">{r.text}</p></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SeminairesPublications() {
  return (
    <section className="sec">
      <div className="wrap split split--top">
        <Reveal className="feature" style={{ padding: 36 }}>
          <span className="over">{SEMINAIRES.tag}</span>
          <h3 className="t-md" style={{ margin: '8px 0 12px' }}>{SEMINAIRES.title}</h3>
          <p style={{ marginBottom: 20 }}>{SEMINAIRES.text}</p>
          <ul className="checks checks--2">{SEMINAIRES.items.map((s) => <li key={s}><CheckCircle2 size={17} />{s}</li>)}</ul>
        </Reveal>
        <Reveal delay={100} className="feature" style={{ padding: 36, background: 'var(--brand-dark)', color: 'rgba(255,255,255,.8)' }}>
          <span className="over">{PUBLICATIONS.tag}</span>
          <h3 className="t-md" style={{ margin: '8px 0 12px', color: '#fff' }}>{PUBLICATIONS.title}</h3>
          <p style={{ marginBottom: 8 }}>{PUBLICATIONS.text}</p>
          {PUBLICATIONS.items.map((p) => <div key={p} className="doc"><FileText size={18} /><span>{p}</span></div>)}
        </Reveal>
      </div>
    </section>
  );
}

export default function NosActivitesPage() {
  return (
    <main>
      <PageBanner image={HERO.image} label={HERO.tag} title={HERO.title} sub={HERO.sub} crumbs={[{ label: 'Nos activités' }]} />
      <Domaines />
      <Secteurs />
      <Frieze />
      <VisionAtouts />
      <Frieze />
      <Couverture />
      <Recrutements />
      <Realisations />
      <SeminairesPublications />
      <Cta title={CTA.title} text={CTA.text}>
        <Link to="/contact" className="btn btn--white">Nous contacter <ArrowRight size={16} /></Link>
        <Link to="/offres" className="btn btn--ghost">Voir nos offres d'emploi</Link>
      </Cta>
    </main>
  );
}
