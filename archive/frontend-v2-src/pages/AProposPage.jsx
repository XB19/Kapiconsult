import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Arrow, Counter, CtaBand, PageHead, Reveal, SectionHead, useInView } from '../components/ui';
import { APPROCHE, ATOUTS, CTA, GROUPE, HERO, MISSION, REALISATIONS, STATS, VALEURS, ZONES } from '../content/apropos';
import { LOGOS_REALISATIONS } from '../content/site';

export function Steps({ steps, dark = false }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={`steps ${inView ? 'in' : ''} ${dark ? 'on-dark' : ''}`}>
      {steps.map((s, i) => (
        <Reveal key={s.n} delay={i * 140} className="step">
          <div className="step-num">{s.n}</div>
          <div><h4>{s.name}</h4><p>{s.text}</p></div>
        </Reveal>
      ))}
    </div>
  );
}

function Mission() {
  return (
    <section className="section">
      <div className="container split">
        <div>
          <SectionHead tag={MISSION.tag} title={MISSION.title} />
          {MISSION.paragraphs.map((p, i) => <Reveal key={i} delay={i * 100}><p className="lead" style={{ marginBottom: 16 }}>{p}</p></Reveal>)}
        </div>
        <Reveal variant="from-right" className="photo-stack" style={{ isolation: 'isolate' }}>
          <div className="deco" />
          <div className="main"><img src="/storage/kapi/equipe.png" alt="Équipe Kapi Consult" /></div>
          <div className="photo-badge"><b>300<small>Mds+</small></b><span>FCFA mobilisés</span></div>
        </Reveal>
      </div>
    </section>
  );
}

function Chiffres() {
  return (
    <section className="section bg-paper">
      <div className="container split split-60">
        <Reveal className="form-card" style={{ boxShadow: 'none' }}>
          <div className="stat-grid">
            {STATS.map((s) => <div key={s.label} className="stat"><b><Counter value={s.value} /></b><span>{s.label}</span></div>)}
          </div>
          <div style={{ marginTop: 28 }}>
            <span className="eyebrow">Zones d'intervention</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
              {ZONES.map((z) => <span key={z} className="chip">{z}</span>)}
            </div>
            <p className="muted" style={{ fontSize: 13, marginTop: 16 }}>Groupe OSEOR S.A. · Lomé, Togo</p>
          </div>
        </Reveal>
        <div>
          <SectionHead tag={ATOUTS.tag} title={ATOUTS.title} sub={ATOUTS.text} />
          <Reveal variant="zoom"><img src={ATOUTS.img} alt="Nos atouts" style={{ borderRadius: 20 }} /></Reveal>
        </div>
      </div>
    </section>
  );
}

function Valeurs() {
  return (
    <section className="section">
      <div className="container">
        <div className="split" style={{ marginBottom: 56 }}>
          <SectionHead tag={VALEURS.tag} title={VALEURS.title} sub={VALEURS.text} />
          <Reveal variant="from-right"><img src={VALEURS.img} alt="Nos valeurs" style={{ borderRadius: 20, marginLeft: 'auto' }} /></Reveal>
        </div>
        <div className="grid grid-3">
          {VALEURS.items.map((v, i) => (
            <Reveal key={v.name} delay={(i % 3) * 100}>
              <div className="value-card"><div className="value-ico">{v.icon}</div><h3>{v.name}</h3><p>{v.text}</p></div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Approche() {
  return (
    <section className="section bg-ink on-dark">
      <div className="container">
        <SectionHead center light tag={APPROCHE.tag} title={APPROCHE.title} />
        <Steps steps={APPROCHE.steps} dark />
      </div>
    </section>
  );
}

function References() {
  return (
    <section className="section">
      <div className="container">
        <SectionHead center tag={REALISATIONS.tag} title={REALISATIONS.title} sub={REALISATIONS.sub} />
        <div className="grid grid-4">
          {REALISATIONS.items.map((r, i) => (
            <Reveal key={r.name} delay={i * 100}>
              <article className="card card-hover">
                <div className="card-media" style={{ aspectRatio: '4 / 3' }}>
                  <img src={r.img} alt={r.name} loading="lazy" />
                  <span className="badge">{r.cat}</span>
                </div>
                <div className="card-body"><h3 className="card-title" style={{ fontSize: 19 }}>{r.name}</h3><p className="card-text">{r.text}</p></div>
              </article>
            </Reveal>
          ))}
        </div>
        <div className="grid grid-4" style={{ marginTop: 20 }}>
          {LOGOS_REALISATIONS.map((l, i) => (
            <Reveal key={l.name} delay={i * 80} className="logo-tile" style={{ border: '1px solid var(--line)' }}>
              <img src={l.img} alt={l.name} loading="lazy" /><b>{l.name}</b><small>{l.sub}</small>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Groupe() {
  const [all, setAll] = useState(false);
  const filiales = all ? GROUPE.filiales : GROUPE.filiales.slice(0, 9);
  return (
    <section className="section bg-paper">
      <div className="container">
        <SectionHead tag={GROUPE.tag} title={GROUPE.title} sub={GROUPE.intro} />
        <div className="split split-60" style={{ alignItems: 'start', gap: 48 }}>
          <div>
            <Reveal><h3 className="h3" style={{ marginBottom: 22 }}>{GROUPE.filialesTitle}</h3></Reveal>
            <div className="grid grid-3" style={{ gap: 14 }}>
              {filiales.map((f, i) => (
                <Reveal key={f.name} delay={(i % 3) * 70}>
                  <div className="filiale" style={{ flexDirection: 'column', gap: 12 }}>
                    <div className="filiale-ico">{f.icon}</div>
                    <div><b>{f.name}</b><span>{f.text}</span></div>
                  </div>
                </Reveal>
              ))}
            </div>
            {!all && (
              <div style={{ textAlign: 'center', marginTop: 24 }}>
                <button className="btn btn-outline" onClick={() => setAll(true)}>Voir les {GROUPE.filiales.length} filiales <span>↓</span></button>
              </div>
            )}
          </div>
          <div style={{ display: 'grid', gap: 20 }}>
            <Reveal className="value-card">
              <div className="value-ico">🏛️</div>
              <h3>{GROUPE.multiTitle}</h3>
              <p>{GROUPE.multiText}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 18 }}>
                {GROUPE.villes.map((v) => <span key={v} className="chip chip-soft">📍 {v}</span>)}
              </div>
            </Reveal>
            <Reveal delay={120} className="value-card on-dark" style={{ background: 'linear-gradient(140deg, var(--brand), var(--navy))', color: '#fff', border: 0 }}>
              <h3 style={{ color: '#fff' }}>{GROUPE.forceTitle}</h3>
              <p style={{ color: 'rgba(255,255,255,.75)' }}>{GROUPE.forceText}</p>
              <div className="stat-grid" style={{ marginTop: 22 }}>
                {GROUPE.forceStats.map((s) => <div key={s.label} className="stat"><b><Counter value={s.value} /></b><span>{s.label}</span></div>)}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AProposPage() {
  return (
    <main>
      <PageHead image={HERO.image} tag={HERO.tag} title={HERO.title} sub={HERO.sub} crumbs={[{ label: 'À propos' }]} />
      <Mission />
      <Chiffres />
      <Valeurs />
      <Approche />
      <References />
      <Groupe />
      <CtaBand title={CTA.title} text={CTA.text}>
        <Link to="/contact" className="btn btn-gold btn-lg">Nous contacter <Arrow /></Link>
      </CtaBand>
    </main>
  );
}
