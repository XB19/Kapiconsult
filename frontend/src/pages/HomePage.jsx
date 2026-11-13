import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApi } from '../lib/api';
import { dateShort, limit } from '../lib/format';
import { CardSkeleton, Frieze, Reveal, SecTitle, Stats } from '../components/ui';
import { ProductCard } from '../components/cards';
import { AnnivPopup } from '../components/AnnivBanner';
import { HERO, LOGOS_REALISATIONS, PARTENAIRES, PRESENTATION, REALISATIONS_HOME, SERVICES } from '../content/site';
import { ATOUTS } from '../content/activites';
import { DOMAINES } from '../content/activites';
import { DOMAINE_ICONS, KPI_ICONS, SERVICE_ICONS } from '../content/icons';

const SLIDES = [
  { img: '/storage/kapi/hero_bg.png', tag: HERO.tag, title: HERO.title, text: HERO.sub, h1: true },
  { img: SERVICES[0].img, tag: 'Nos Activités', title: [SERVICES[0].name], text: SERVICES[0].desc },
  { img: SERVICES[1].img, tag: 'Nos Activités', title: [SERVICES[1].name], text: SERVICES[1].desc },
  { img: SERVICES[2].img, tag: 'Nos Activités', title: [SERVICES[2].name], text: SERVICES[2].desc },
];

function Slider() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = useCallback((d) => setI((n) => (n + d + SLIDES.length) % SLIDES.length), []);
  useEffect(() => {
    if (paused) return undefined;
    const t = setInterval(() => go(1), 7000);
    return () => clearInterval(t);
  }, [paused, go]);

  return (
    <section className="slider" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} aria-roledescription="carrousel">
      {SLIDES.map((s, n) => {
        const H = s.h1 ? 'h1' : 'h2';
        return (
          <div key={n} className={`slide ${n === i ? 'is-active' : ''}`} aria-hidden={n !== i}>
            <img src={s.img} alt="" />
            <div className="slide__body">
              <div className="wrap">
                <div className="slide__content">
                  <span className="over">{s.tag}</span>
                  <H className="t-xl">{s.title.length === 3 ? <>{s.title[0]} <span>{s.title[1]}</span> {s.title[2]}</> : s.title[0]}</H>
                  <p>{s.text}</p>
                  <div className="slide__actions">
                    <Link to="/nos-activites" className="btn btn--gold" tabIndex={n === i ? 0 : -1}>Découvrir nos services <ArrowRight size={17} /></Link>
                    <Link to="/offres" className="btn btn--ghost" tabIndex={n === i ? 0 : -1}>Offres d'emploi</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <button className="slider__arrow slider__arrow--prev" onClick={() => go(-1)} aria-label="Diapositive précédente"><ChevronLeft size={24} /></button>
      <button className="slider__arrow slider__arrow--next" onClick={() => go(1)} aria-label="Diapositive suivante"><ChevronRight size={24} /></button>
      <div className="slider__dots"><div className="wrap">
        {SLIDES.map((_, n) => <button key={n} className={n === i ? 'is-active' : ''} onClick={() => setI(n)} aria-label={`Diapositive ${n + 1}`} />)}
      </div></div>
    </section>
  );
}

// Les quatre panneaux qui chevauchent le carrousel
function Panels() {
  const { data } = useApi('/produits');
  const produits = (data?.produits || []).slice(0, 3);
  return (
    <div className="panels">
      <div className="wrap">
        <Reveal className="panels__grid">
          <div className="panel">
            <h3>À propos de <b>Kapi</b></h3>
            <div className="panel__img"><img src="/storage/kapi/equipe.png" alt="Équipe Kapi Consult" /></div>
            <p>{PRESENTATION[0]}</p>
            <div className="panel__foot"><Link to="/a-propos" className="link">En savoir plus <ArrowRight size={15} /></Link></div>
          </div>
          <div className="panel">
            <h3>Nos <b>domaines</b> clés</h3>
            <div className="icon-grid">
              {DOMAINES.map((d) => {
                const Icon = DOMAINE_ICONS[d.id];
                return <Link key={d.id} to={`/nos-activites#${d.id}`}><span className="ico"><Icon size={22} strokeWidth={1.8} /></span>{d.name}</Link>;
              })}
            </div>
          </div>
          <div className="panel">
            <h3>Nos <b>atouts</b></h3>
            <ul className="checks">{ATOUTS.items.map((a) => <li key={a}><CheckCircle2 size={17} />{a}</li>)}</ul>
          </div>
          <div className="panel">
            <h3>Nos <b>produits</b></h3>
            <div className="mini-list">
              {produits.map((p) => (
                <Link key={p.id} to={`/nos-produits/${p.slug}`}>
                  <img src={p.image} alt="" loading="lazy" />
                  <span><span>{p.categorie}</span><b>{p.nom}</b></span>
                </Link>
              ))}
            </div>
            <div className="panel__foot"><Link to="/nos-produits" className="link">Voir tout le catalogue <ArrowRight size={15} /></Link></div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

function Chiffres() {
  const { data } = useApi('/offres?statut=active');
  const items = HERO.kpis.map((k, n) => ({ icon: KPI_ICONS[n], value: `${k.value ?? (data ? data.length : 0)}${k.suffix}`, label: k.label }));
  return (
    <section className="sec sec--cream">
      <div className="wrap">
        <SecTitle title="Kapi Consult en chiffres" hl="Kapi Consult" center />
        <Stats items={items} />
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="sec">
      <div className="wrap">
        <div className="sec-title-row">
          <SecTitle title="Ce que nous faisons" hl="Ce que nous" sub="Des expertises complémentaires au service du développement des organisations." />
          <Link to="/nos-activites" className="btn btn--outline">Voir toutes nos activités <ArrowRight size={16} /></Link>
        </div>
        <div className="grid g-3">
          {SERVICES.map((s, n) => {
            const Icon = SERVICE_ICONS[n];
            return (
              <Reveal key={s.name} delay={n * 100}>
                <Link to="/nos-activites" className="service">
                  <img src={s.img} alt={s.name} loading="lazy" />
                  <div className="service__body">
                    <div className="service__ico"><Icon size={24} /></div>
                    <h3>{s.name}</h3>
                    <p>{s.desc}</p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Realisations() {
  return (
    <section className="sec sec--bg">
      <div className="wrap">
        <SecTitle title="Des projets à fort impact" hl="projets" center
          sub="Des centaines d'études réalisées, des centaines de projets évalués — Plus de 300 milliards FCFA mobilisés." />
        <div className="grid g-4">
          {REALISATIONS_HOME.map((r, n) => (
            <Reveal key={r.name} delay={n * 80} className="card card--hover">
              <div className="card__img" style={{ aspectRatio: '4 / 3' }}><img src={r.img} alt={r.name} loading="lazy" /></div>
              <div className="card__body"><h3 className="card__title">{r.name}</h3><p className="card__text">{r.desc}</p></div>
            </Reveal>
          ))}
        </div>
        <div className="logos logos--4" style={{ marginTop: 28 }}>
          {LOGOS_REALISATIONS.map((l) => <div key={l.name}><img src={l.img} alt={l.name} loading="lazy" /><span>{l.name}</span></div>)}
        </div>
      </div>
    </section>
  );
}

function Actualite() {
  const { data, loading } = useApi('/articles?type=actualite&limit=4');
  const [une, ...autres] = data || [];
  return (
    <section className="sec">
      <div className="wrap">
        <div className="sec-title-row">
          <SecTitle title="L'actualité chez Kapi Consult" hl="L'actualité" sub="Actualités, articles de fond et ressources utiles de Kapi Consult." />
          <Link to="/actualites" className="btn btn--outline">Toutes les actualités <ArrowRight size={16} /></Link>
        </div>
        {loading && <div className="grid g-3"><CardSkeleton n={3} /></div>}
        {une && (
          <div className="headline">
            <Reveal as={Link} to={`/articles/${une.slug}`} className="headline__main">
              {une.card_image && <img src={une.card_image} alt={une.title} />}
              <div className="headline__body">
                <span className="pill pill--gold">{une.badge}</span>
                <h3>{une.title}</h3>
                <p>{limit(une.content, 100)}</p>
                <time><Calendar size={14} />{dateShort(une.published_at)}</time>
              </div>
            </Reveal>
            <div className="headline__side">
              {autres.map((a) => (
                <Link key={a.id} to={`/articles/${a.slug}`} className="side-item">
                  {a.card_image ? <img src={a.card_image} alt="" loading="lazy" /> : <span />}
                  <span>
                    <span className="card__meta"><Calendar size={13} />{dateShort(a.published_at)}</span>
                    <h4>{a.title}</h4>
                    <span className="small muted">{limit(a.content, 70)}</span>
                  </span>
                </Link>
              ))}
              <Link to="/blog" className="link">Lire aussi notre blog <ArrowRight size={15} /></Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Catalogue() {
  const { data, loading } = useApi('/produits');
  return (
    <section className="sec sec--bg">
      <div className="wrap">
        <div className="sec-title-row">
          <SecTitle title="Notre catalogue" hl="catalogue" />
          <Link to="/nos-produits" className="btn btn--outline">Voir tout le catalogue <ArrowRight size={16} /></Link>
        </div>
        <div className="grid g-4">
          {loading ? <CardSkeleton n={4} /> : (data?.produits || []).slice(0, 4).map((p, n) => <Reveal key={p.id} delay={n * 80}><ProductCard p={p} excerpt={60} /></Reveal>)}
        </div>
      </div>
    </section>
  );
}

function Partenaires() {
  return (
    <section className="sec">
      <div className="wrap">
        <SecTitle title="Nos Partenaires" hl="Nos" center sub="Ensemble, nous construisons des solutions durables pour l'Afrique de l'Ouest." />
        <div className="logos">
          {PARTENAIRES.map((p) => <div key={p.name} title={p.name}>{p.img ? <img src={p.img} alt={p.name} loading="lazy" /> : <span>{p.name}</span>}</div>)}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main>
      <Slider />
      <Panels />
      <div style={{ height: 70 }} />
      <Frieze />
      <Chiffres />
      <Frieze />
      <Services />
      <Realisations />
      <Actualite />
      <Catalogue />
      <Partenaires />
      <AnnivPopup />
    </main>
  );
}
