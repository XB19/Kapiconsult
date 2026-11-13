import { Link } from 'react-router-dom';
import { ArrowRight, Award, Briefcase, CheckCircle2, Globe, Layers, MapPin, TrendingUp } from 'lucide-react';
import { Cta, Frieze, PageBanner, Reveal, SecTitle, Stats, Title } from '../components/ui';
import { APPROCHE, ATOUTS, CTA, GROUPE, HERO, MISSION, REALISATIONS, STATS, VALEURS, ZONES } from '../content/apropos';
import { LOGOS_REALISATIONS } from '../content/site';
import { FILIALE_ICONS, VALEUR_ICONS } from '../content/icons';

export function Steps({ steps, list = false }) {
  return (
    <div className={`steps ${list ? 'steps--list' : ''}`}>
      {steps.map((s, i) => (
        <Reveal key={s.n} delay={i * 80} className="step">
          <span className="step__n">{s.n}</span>
          <h4>{s.name}</h4>
          <p>{s.text}</p>
        </Reveal>
      ))}
    </div>
  );
}

const STAT_ICONS = [Globe, Award, Layers, TrendingUp];
const FORCE_ICONS = [Briefcase, Globe, Award, TrendingUp];

export default function AProposPage() {
  return (
    <main>
      <PageBanner image={HERO.image} label={HERO.tag} title={HERO.title} sub={HERO.sub} crumbs={[{ label: 'À propos' }]} />

      <section className="sec">
        <div className="wrap split">
          <Reveal>
            <span className="over">{MISSION.tag}</span>
            <Title text={MISSION.title} hl="Un cabinet" className="t-lg" />
            <div style={{ height: 3, width: 56, background: 'var(--gold)', margin: '16px 0 22px' }} />
            {MISSION.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </Reveal>
          <Reveal delay={120} className="photo">
            <img src="/storage/kapi/equipe.png" alt="Équipe Kapi Consult" />
            <div className="photo__badge"><span className="ico"><TrendingUp size={22} /></span><div><b>300 Mds+</b><span>FCFA mobilisés</span></div></div>
          </Reveal>
        </div>
      </section>

      <Frieze />
      <section className="sec sec--cream">
        <div className="wrap">
          <Stats items={STATS.map((s, i) => ({ ...s, icon: STAT_ICONS[i] }))} />
          <Reveal style={{ marginTop: 48, textAlign: 'center' }}>
            <h3 className="t-sm" style={{ color: 'var(--brand)', marginBottom: 14 }}>Zones d'intervention</h3>
            <div className="chips" style={{ justifyContent: 'center' }}>{ZONES.map((z) => <span key={z} className="chip"><MapPin size={14} />{z}</span>)}</div>
            <p className="small muted" style={{ marginTop: 12 }}>Groupe OSEOR S.A. · Lomé, Togo</p>
          </Reveal>
        </div>
      </section>
      <Frieze />

      <section className="sec">
        <div className="wrap split" style={{ marginBottom: 80 }}>
          <Reveal>
            <span className="over">{ATOUTS.tag}</span>
            <Title text={ATOUTS.title} hl="notre force" className="t-lg" />
            <p className="lead" style={{ marginTop: 16 }}>{ATOUTS.text}</p>
          </Reveal>
          <Reveal delay={120}><img src={ATOUTS.img} alt="Nos atouts" style={{ borderRadius: 'var(--radius)' }} /></Reveal>
        </div>
        <div className="wrap">
          <SecTitle title={VALEURS.title} hl="nous guide" sub={VALEURS.text} center />
          <div className="grid g-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))' }}>
            {VALEURS.items.map((v, i) => {
              const Icon = VALEUR_ICONS[v.name];
              return (
                <Reveal key={v.name} delay={i * 80} className="feature feature--gold">
                  <div className="feature__ico"><Icon size={26} strokeWidth={1.8} /></div>
                  <h3>{v.name}</h3>
                  <p>{v.text}</p>
                </Reveal>
              );
            })}
          </div>
          <Reveal style={{ marginTop: 40 }}><img src={VALEURS.img} alt="Nos valeurs" style={{ margin: '0 auto', borderRadius: 'var(--radius)' }} /></Reveal>
        </div>
      </section>

      <section className="sec sec--brand">
        <div className="wrap">
          <SecTitle title={APPROCHE.title} hl="démarche structurée" light center />
          <Steps steps={APPROCHE.steps} />
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <SecTitle title={REALISATIONS.title} hl="références emblématiques" sub={REALISATIONS.sub} center />
          <div className="grid g-4">
            {REALISATIONS.items.map((r, i) => (
              <Reveal key={r.name} delay={i * 80} className="card card--hover">
                <div className="card__img" style={{ aspectRatio: '4 / 3' }}><img src={r.img} alt={r.name} loading="lazy" /><span className="pill pill--gold card__tag">{r.cat}</span></div>
                <div className="card__body"><h3 className="card__title">{r.name}</h3><p className="card__text">{r.text}</p></div>
              </Reveal>
            ))}
          </div>
          <div className="logos logos--4" style={{ marginTop: 28 }}>
            {LOGOS_REALISATIONS.map((l) => <div key={l.name}><img src={l.img} alt={l.name} loading="lazy" /><span>{l.name}<small>{l.sub}</small></span></div>)}
          </div>
        </div>
      </section>

      <section className="sec sec--bg">
        <div className="wrap">
          <SecTitle title={GROUPE.title} hl="OSEOR S.A." sub={GROUPE.intro} />
          <div className="grid g-2" style={{ marginBottom: 48 }}>
            <Reveal className="feature">
              <div className="feature__ico"><Layers size={26} /></div>
              <h3>{GROUPE.multiTitle}</h3>
              <p>{GROUPE.multiText}</p>
              <div className="chips" style={{ marginTop: 16 }}>{GROUPE.villes.map((v) => <span key={v} className="chip"><MapPin size={14} />{v}</span>)}</div>
            </Reveal>
            <Reveal delay={100} className="feature">
              <div className="feature__ico"><CheckCircle2 size={26} /></div>
              <h3>{GROUPE.forceTitle}</h3>
              <p>{GROUPE.forceText}</p>
            </Reveal>
          </div>
          <Stats items={GROUPE.forceStats.map((s, i) => ({ ...s, icon: FORCE_ICONS[i] }))} />
          <Reveal style={{ margin: '56px 0 24px' }}><Title text={GROUPE.filialesTitle} hl="15 filiales" as="h3" className="t-lg" /></Reveal>
          <div className="grid g-3">
            {GROUPE.filiales.map((f, i) => {
              const Icon = FILIALE_ICONS[f.name];
              return (
                <Reveal key={f.name} delay={(i % 3) * 60} className="list-card">
                  <div className="list-card__ico"><Icon size={24} strokeWidth={1.8} /></div>
                  <div><h3 style={{ marginBottom: 4 }}>{f.name}</h3><p className="small muted">{f.text}</p></div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <Cta title={CTA.title} text={CTA.text}>
        <Link to="/contact" className="btn btn--white">Nous contacter <ArrowRight size={16} /></Link>
      </Cta>
    </main>
  );
}
