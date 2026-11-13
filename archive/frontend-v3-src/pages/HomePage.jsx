import { Link } from 'react-router-dom';
import { useApi } from '../lib/api';
import { EntrySkeleton, Figures, Reveal, SecHead, pad2 } from '../components/ui';
import { ArticleEntry, ProductEntry } from '../components/cards';
import { AnnivPopup } from '../components/AnnivBanner';
import {
  EXPERTISES, HERO, HOME_STATS, LOGOS_REALISATIONS, PARTENAIRES, PRESENTATION, REALISATIONS_HOME, SERVICES,
} from '../content/site';

function Hero() {
  return (
    <section className="hero">
      <div className="hero__bg"><img src="/storage/kapi/hero_bg.png" alt="" /></div>
      <div className="wrap">
        <div className="hero__content">
          <span className="kicker kicker--light">{HERO.tag}</span>
          <h1 className="t-display">{HERO.title[0]} <em>{HERO.title[1]}</em> {HERO.title[2]}</h1>
          <p>{HERO.sub}</p>
          <div className="hero__actions">
            <Link to="/nos-activites" className="btn btn--gold">Découvrir nos services</Link>
            <Link to="/offres" className="btn btn--line-white">Offres d'emploi</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function KeyFigures() {
  const { data } = useApi('/offres?statut=active');
  const items = HERO.kpis.map((k) => ({ value: `${k.value ?? (data ? data.length : 0)}${k.suffix}`, label: k.label }));
  return (
    <section className="sec--tight" style={{ paddingTop: 0, paddingBottom: 0 }}>
      <div className="wrap"><Figures items={items} /></div>
    </section>
  );
}

function Services() {
  return (
    <section className="sec">
      <div className="wrap">
        <SecHead label="Nos Activités" title="Ce que nous faisons" lead="Des expertises complémentaires au service du développement des organisations." />
        <div className="rows">
          {SERVICES.map((s, i) => (
            <Reveal key={s.name} className="row row--media">
              <span className="row__num">{pad2(i)}</span>
              <h3 className="row__title">{s.name}</h3>
              <div className="row__img"><img src={s.img} alt={s.name} loading="lazy" /></div>
              <p className="row__body">{s.desc}</p>
            </Reveal>
          ))}
        </div>
        <Reveal style={{ marginTop: 32 }}><Link to="/nos-activites" className="more">Voir toutes nos activités →</Link></Reveal>
        <Reveal style={{ marginTop: 72 }}>
          <span className="kicker" style={{ marginBottom: 18 }}>Nos expertises</span>
          <ul className="index-list">
            {EXPERTISES.map((e, i) => <li key={e}><span>{pad2(i)}</span>{e}</li>)}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="sec sec--stone">
      <div className="wrap cols cols-6-6 align-center">
        <Reveal as="figure" className="figure-img">
          <img src="/storage/kapi/equipe.png" alt="Équipe Kapi Consult" loading="lazy" />
          <figcaption><span>Équipe Kapi Consult</span><span><b>300 Mds+</b> FCFA mobilisés</span></figcaption>
        </Reveal>
        <div>
          <Reveal>
            <span className="kicker" style={{ marginBottom: 16 }}>Qui sommes-nous</span>
            <h2 className="t-2" style={{ marginBottom: 24 }}>Cabinet d'Études et de Conseils en management</h2>
            {PRESENTATION.map((p, i) => <p key={i}>{p}</p>)}
          </Reveal>
          <Reveal style={{ margin: '36px 0' }}>
            <div className="figures" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              {HOME_STATS.map((s, i) => (
                <div className="figure" key={s.label} style={i % 2 === 0 ? { borderLeft: 0, paddingLeft: 0 } : undefined}>
                  <span className="figure__value num" style={{ fontSize: 40 }}>{s.value}</span>
                  <span className="figure__label">{s.label}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal><Link to="/a-propos" className="btn btn--line">En savoir plus</Link></Reveal>
        </div>
      </div>
    </section>
  );
}

function Realisations() {
  return (
    <section className="sec sec--navy">
      <div className="wrap">
        <SecHead light label="Nos Réalisations" title="Des projets à fort impact"
          lead="Des centaines d'études réalisées, des centaines de projets évalués — Plus de 300 milliards FCFA mobilisés." />
        <div className="cols cols-4">
          {REALISATIONS_HOME.map((r, i) => (
            <Reveal key={r.name} delay={i * 60}>
              <div className="entry__img" style={{ aspectRatio: '4 / 3' }}><img src={r.img} alt={r.name} loading="lazy" /></div>
              <h3 className="t-4" style={{ marginBottom: 8 }}>{r.name}</h3>
              <p style={{ fontSize: 15.5 }}>{r.desc}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="logo-grid" style={{ marginTop: 56, borderColor: 'rgba(255,255,255,.16)' }}>
          {LOGOS_REALISATIONS.map((l) => <div key={l.name}><img src={l.img} alt={l.name} loading="lazy" /><b>{l.name}</b></div>)}
        </Reveal>
      </div>
    </section>
  );
}

function News() {
  const { data, loading } = useApi('/articles?type=actualite&limit=3');
  return (
    <section className="sec">
      <div className="wrap">
        <SecHead label="Nos Actualités" title="Dernières publications" lead="Actualités, articles de fond et ressources utiles de Kapi Consult.">
          <Link to="/actualites" className="more">Toutes les actualités →</Link>
        </SecHead>
        <div className="entries">
          {loading ? <EntrySkeleton n={3} /> : (data || []).map((a, i) => <Reveal key={a.id} delay={i * 60}><ArticleEntry a={a} excerpt={100} /></Reveal>)}
        </div>
      </div>
    </section>
  );
}

function Products() {
  const { data, loading } = useApi('/produits');
  return (
    <section className="sec sec--stone">
      <div className="wrap">
        <SecHead label="Nos Produits" title="Notre catalogue">
          <Link to="/nos-produits" className="more">Voir tout le catalogue →</Link>
        </SecHead>
        <div className="entries entries--4">
          {loading ? <EntrySkeleton n={4} /> : (data?.produits || []).slice(0, 4).map((p, i) => <Reveal key={p.id} delay={i * 60}><ProductEntry p={p} excerpt={60} /></Reveal>)}
        </div>
      </div>
    </section>
  );
}

function Partners() {
  return (
    <section className="sec">
      <div className="wrap">
        <SecHead label="Nos Partenaires" title="Ils nous font confiance" lead="Ensemble, nous construisons des solutions durables pour l'Afrique de l'Ouest." />
        <Reveal className="logo-grid logo-grid--6">
          {PARTENAIRES.map((p) => (
            <div key={p.name} title={p.name}>{p.img ? <img src={p.img} alt={p.name} loading="lazy" /> : <span className="txt">{p.name}</span>}</div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main>
      <Hero />
      <KeyFigures />
      <Services />
      <About />
      <Realisations />
      <News />
      <Products />
      <Partners />
      <AnnivPopup />
    </main>
  );
}
