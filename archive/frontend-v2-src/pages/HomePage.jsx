import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../lib/api';
import { Arrow, CardSkeleton, Counter, Marquee, Reveal, SectionHead } from '../components/ui';
import { ArticleCard, ProductCard } from '../components/cards';
import { AnnivPopup } from '../components/AnnivBanner';
import {
  EXPERTISES, HERO, HOME_STATS, LOGOS_REALISATIONS, PARTENAIRES, PRESENTATION, REALISATIONS_HOME, SERVICES,
} from '../content/site';

// Particules dorées et bleutées en fond du héro
function Particles() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let W = 0; let H = 0; let raf;
    const resize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    const rand = (a, b) => Math.random() * (b - a) + a;
    const ps = Array.from({ length: 70 }, () => ({ x: rand(0, 1), y: rand(0, 1), r: rand(0.5, 2.2), vx: rand(-0.08, 0.08), vy: rand(-0.12, -0.04), a: rand(0.15, 0.55), g: Math.random() > 0.6 }));
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of ps) {
        p.x += (p.vx / W) * 0.8; p.y += (p.vy / H) * 0.8;
        if (p.y < -0.01) p.y = 1; if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
        ctx.beginPath(); ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.g ? `rgba(217,178,95,${p.a})` : `rgba(200,210,255,${p.a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} style={{ width: '100%', height: '100%' }} aria-hidden="true" />;
}

// Sous-titre en machine à écrire
function Typewriter({ text }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (i >= text.length) return undefined;
    const t = setTimeout(() => setI((n) => n + 1), i === 0 ? 900 : i < 30 ? 35 : 20);
    return () => clearTimeout(t);
  }, [i, text]);
  return (
    <p className="hero-sub">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{text.slice(0, i)}<span className="caret" /></span>
    </p>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg"><img src="/storage/kapi/hero_bg.png" alt="" /></div>
      <Particles />
      <div className="container">
        <div className="hero-grid">
          <div>
            <span className="hero-tag"><i /> {HERO.tag}</span>
            <h1 className="hero-title">
              {HERO.title.map((l) => <span key={l}><em>{l}</em></span>)}
            </h1>
            <Typewriter text={HERO.sub} />
            <div className="hero-ctas">
              <Link to="/nos-activites" className="btn btn-gold btn-lg">Découvrir nos services <Arrow /></Link>
              <Link to="/offres" className="btn btn-ghost-light btn-lg">Offres d'emploi →</Link>
            </div>
          </div>
          <Reveal variant="from-right" delay={300} className="hero-visual">
            <div className="hero-ring" />
            <div className="hero-photo"><img src="/storage/kapi/equipe.png" alt="Équipe Kapi Consult" /></div>
            <div className="hero-float f1">
              <div className="ico">📈</div>
              <div><b>300<small style={{ fontSize: 15 }}>Mds+</small></b><small>FCFA mobilisés</small></div>
            </div>
            <div className="hero-float f2">
              <div className="ico">🏆</div>
              <div><b>20+</b><small>Années d'expérience</small></div>
            </div>
          </Reveal>
        </div>
      </div>
      <div className="scroll-hint" aria-hidden="true" />
    </section>
  );
}

function Kpis() {
  const { data } = useApi('/offres?statut=active');
  const offres = data ? data.length : 0;
  return (
    <div className="kpis">
      <div className="container">
        <Reveal className="kpis-inner">
          {HERO.kpis.map((k) => (
            <div className="kpi" key={k.label}>
              <div className="kpi-ico">{k.icon}</div>
              <div>
                <div className="kpi-val"><Counter value={`${k.value ?? offres}${k.suffix}`} /></div>
                <div className="kpi-label">{k.label}</div>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </div>
  );
}

function Expertises() {
  return (
    <div className="expertise-strip">
      <div className="container" style={{ marginBottom: 14 }}><span className="eyebrow">Nos expertises</span></div>
      <Marquee speed={55}>
        {EXPERTISES.map((e) => <span key={e} className="expertise-item">{e}</span>)}
      </Marquee>
    </div>
  );
}

function Services() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head-row">
          <SectionHead tag="Nos Activités" title="Ce que nous faisons" sub="Des expertises complémentaires au service du développement des organisations." />
          <Reveal><Link to="/nos-activites" className="btn btn-outline">Voir toutes nos activités <Arrow /></Link></Reveal>
        </div>
        <div className="grid grid-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.name} delay={i * 120}>
              <Link to="/nos-activites" className="service-card">
                <img src={s.img} alt={s.name} loading="lazy" />
                <div className="service-body">
                  <span className="service-num">0{i + 1}</span>
                  <h3>{s.name}</h3>
                  <p>{s.desc}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="section bg-paper">
      <div className="container split">
        <Reveal variant="from-left" className="photo-stack" style={{ position: 'relative', isolation: 'isolate' }}>
          <div className="deco" />
          <div className="main"><img src="/storage/kapi/equipe.png" alt="Équipe Kapi Consult" loading="lazy" /></div>
          <div className="photo-badge"><b>300<small>Mds+</small></b><span>FCFA mobilisés</span></div>
        </Reveal>
        <div>
          <SectionHead tag="Qui sommes-nous" title="Cabinet d'Études et de Conseils en management" />
          {PRESENTATION.map((p, i) => <Reveal key={i} delay={i * 100}><p className="lead" style={{ marginBottom: 18 }}>{p}</p></Reveal>)}
          <div className="stat-grid" style={{ margin: '34px 0' }}>
            {HOME_STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 90} className="stat"><b><Counter value={s.value} /></b><span>{s.label}</span></Reveal>
            ))}
          </div>
          <Reveal><Link to="/a-propos" className="btn">En savoir plus <Arrow /></Link></Reveal>
        </div>
      </div>
    </section>
  );
}

function Realisations() {
  return (
    <section className="section bg-ink on-dark" style={{ overflow: 'hidden' }}>
      <div className="container">
        <SectionHead center light tag="Nos Réalisations" title="Des projets à fort impact"
          sub="Des centaines d'études réalisées, des centaines de projets évalués — Plus de 300 milliards FCFA mobilisés." />
        <div className="grid grid-4">
          {REALISATIONS_HOME.map((r, i) => (
            <Reveal key={r.name} delay={i * 100}>
              <article className="real-card">
                <div className="media"><img src={r.img} alt={r.name} loading="lazy" /></div>
                <div className="body"><h3>{r.name}</h3><p>{r.desc}</p></div>
              </article>
            </Reveal>
          ))}
        </div>
        <div className="grid grid-4" style={{ marginTop: 20 }}>
          {LOGOS_REALISATIONS.map((l, i) => (
            <Reveal key={l.name} delay={i * 80} className="logo-tile">
              <img src={l.img} alt={l.name} loading="lazy" /><b>{l.name}</b>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function News() {
  const { data, loading } = useApi('/articles?type=actualite&limit=3');
  return (
    <section className="section">
      <div className="container">
        <div className="section-head-row">
          <SectionHead tag="Nos Actualités" title="Dernières publications" sub="Actualités, articles de fond et ressources utiles de Kapi Consult." />
          <Reveal><Link to="/actualites" className="btn btn-outline">Toutes les actualités <Arrow /></Link></Reveal>
        </div>
        <div className="grid grid-3">
          {loading ? <CardSkeleton n={3} /> : (data || []).map((a, i) => (
            <Reveal key={a.id} delay={i * 120}><ArticleCard a={a} excerpt={100} /></Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Products() {
  const { data, loading } = useApi('/produits');
  const list = (data?.produits || []).slice(0, 4);
  return (
    <section className="section bg-paper">
      <div className="container">
        <div className="section-head-row">
          <SectionHead tag="Nos Produits" title="Notre catalogue" />
          <Reveal><Link to="/nos-produits" className="btn btn-outline">Voir tout le catalogue <Arrow /></Link></Reveal>
        </div>
        <div className="grid grid-4">
          {loading ? <CardSkeleton n={4} /> : list.map((p, i) => (
            <Reveal key={p.id} delay={i * 100}><ProductCard p={p} excerpt={60} /></Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Partners() {
  const half = Math.ceil(PARTENAIRES.length / 2);
  const row = (items) => items.map((p) => (
    <div key={p.name} className="partner" title={p.name}>
      {p.img ? <img src={p.img} alt={p.name} loading="lazy" /> : <span>{p.name}</span>}
    </div>
  ));
  return (
    <section className="section">
      <div className="container">
        <SectionHead center tag="Nos Partenaires" title="Ils nous font confiance" sub="Ensemble, nous construisons des solutions durables pour l'Afrique de l'Ouest." />
      </div>
      <Marquee speed={60}>{row(PARTENAIRES.slice(0, half))}</Marquee>
      <div style={{ height: 18 }} />
      <Marquee speed={60} reverse>{row(PARTENAIRES.slice(half))}</Marquee>
    </section>
  );
}

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Kpis />
      <Expertises />
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
