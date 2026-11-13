import { Link } from 'react-router-dom';
import { Cta, Figures, PageHead, Reveal, SecHead, pad2 } from '../components/ui';
import { APPROCHE, ATOUTS, CTA, GROUPE, HERO, MISSION, REALISATIONS, STATS, VALEURS, ZONES } from '../content/apropos';
import { LOGOS_REALISATIONS } from '../content/site';

export function Steps({ steps, stack = false }) {
  return (
    <div className={`steps ${stack ? 'steps--stack' : ''}`}>
      {steps.map((s, i) => (
        <Reveal key={s.n} delay={i * 70} className="step">
          <span className="step__n">{s.n}</span>
          <h4>{s.name}</h4>
          <p>{s.text}</p>
        </Reveal>
      ))}
    </div>
  );
}

export default function AProposPage() {
  return (
    <main>
      <PageHead image={HERO.image} label={HERO.tag} title={HERO.title} sub={HERO.sub} crumbs={[{ label: 'À propos' }]} />

      {/* Mission */}
      <section className="sec">
        <div className="wrap cols cols-7-5 align-start">
          <Reveal>
            <span className="kicker" style={{ marginBottom: 16 }}>{MISSION.tag}</span>
            <h2 className="t-2" style={{ marginBottom: 26 }}>{MISSION.title}</h2>
            {MISSION.paragraphs.map((p, i) => <p key={i} className={i === 0 ? 'lead' : ''}>{p}</p>)}
          </Reveal>
          <Reveal as="figure" className="figure-img" delay={100}>
            <img src="/storage/kapi/equipe.png" alt="Équipe Kapi Consult" />
            <figcaption><span>Équipe Kapi Consult</span><span><b>300 Mds+</b> FCFA mobilisés</span></figcaption>
          </Reveal>
        </div>
        <div className="wrap" style={{ marginTop: 72 }}>
          <Reveal><Figures items={STATS} /></Reveal>
          <Reveal style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 9fr)', gap: 32, marginTop: 40 }} className="zones">
            <span className="kicker">Zones d'intervention</span>
            <div>
              <div className="tags">{ZONES.map((z) => <span key={z} className="tag">{z}</span>)}</div>
              <p className="small muted" style={{ marginTop: 14 }}>Groupe OSEOR S.A. · Lomé, Togo</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Atouts + valeurs */}
      <section className="sec sec--stone">
        <div className="wrap">
          <div className="cols cols-6-6 align-center" style={{ marginBottom: 88 }}>
            <Reveal>
              <span className="kicker" style={{ marginBottom: 16 }}>{ATOUTS.tag}</span>
              <h2 className="t-2" style={{ marginBottom: 18 }}>{ATOUTS.title}</h2>
              <p className="lead">{ATOUTS.text}</p>
            </Reveal>
            <Reveal delay={100}><img src={ATOUTS.img} alt="Nos atouts" /></Reveal>
          </div>
          <div className="cols cols-6-6 align-center" style={{ marginBottom: 48 }}>
            <Reveal><img src={VALEURS.img} alt="Nos valeurs" /></Reveal>
            <Reveal delay={100}>
              <span className="kicker" style={{ marginBottom: 16 }}>{VALEURS.tag}</span>
              <h2 className="t-2" style={{ marginBottom: 18 }}>{VALEURS.title}</h2>
              <p className="lead">{VALEURS.text}</p>
            </Reveal>
          </div>
          <Reveal className="blocks">
            {VALEURS.items.map((v, i) => (
              <div className="block" key={v.name}>
                <span className="block__n">{pad2(i)}</span>
                <h3>{v.name}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Approche */}
      <section className="sec sec--navy">
        <div className="wrap">
          <SecHead light label={APPROCHE.tag} title={APPROCHE.title} />
          <Steps steps={APPROCHE.steps} />
        </div>
      </section>

      {/* Références */}
      <section className="sec">
        <div className="wrap">
          <SecHead label={REALISATIONS.tag} title={REALISATIONS.title} lead={REALISATIONS.sub} />
          <div className="cols cols-4">
            {REALISATIONS.items.map((r, i) => (
              <Reveal key={r.name} delay={i * 60}>
                <div className="entry__img" style={{ aspectRatio: '4 / 3' }}><img src={r.img} alt={r.name} loading="lazy" /></div>
                <div className="entry__meta"><span className="cat">{r.cat}</span></div>
                <h3 className="t-4" style={{ marginBottom: 8 }}>{r.name}</h3>
                <p className="small muted">{r.text}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="logo-grid" style={{ marginTop: 56 }}>
            {LOGOS_REALISATIONS.map((l) => <div key={l.name}><img src={l.img} alt={l.name} loading="lazy" /><b>{l.name}</b><small>{l.sub}</small></div>)}
          </Reveal>
        </div>
      </section>

      {/* Groupe OSEOR */}
      <section className="sec sec--stone">
        <div className="wrap">
          <SecHead label={GROUPE.tag} title={GROUPE.title} lead={GROUPE.intro} />
          <div className="cols cols-6-6 align-start" style={{ marginBottom: 64 }}>
            <Reveal>
              <h3 className="t-3" style={{ marginBottom: 12 }}>{GROUPE.multiTitle}</h3>
              <p>{GROUPE.multiText}</p>
              <div className="tags" style={{ marginTop: 20 }}>{GROUPE.villes.map((v) => <span key={v} className="tag">{v}</span>)}</div>
            </Reveal>
            <Reveal delay={100}>
              <h3 className="t-3" style={{ marginBottom: 12 }}>{GROUPE.forceTitle}</h3>
              <p>{GROUPE.forceText}</p>
            </Reveal>
          </div>
          <Reveal style={{ marginBottom: 64 }}><Figures items={GROUPE.forceStats} /></Reveal>

          <Reveal><h3 className="t-3" style={{ marginBottom: 20 }}>{GROUPE.filialesTitle}</h3></Reveal>
          <Reveal className="blocks">
            {GROUPE.filiales.map((f, i) => (
              <div className="block" key={f.name} style={{ padding: '24px 26px' }}>
                <span className="block__n">{pad2(i)}</span>
                <h3 style={{ fontSize: 19, margin: '6px 0 6px' }}>{f.name}</h3>
                <p style={{ fontSize: 15 }}>{f.text}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <Cta title={CTA.title} text={CTA.text}>
        <Link to="/contact" className="btn">Nous contacter</Link>
      </Cta>
    </main>
  );
}
