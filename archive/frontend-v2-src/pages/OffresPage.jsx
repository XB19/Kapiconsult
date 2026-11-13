import { Link, useSearchParams } from 'react-router-dom';
import { useApi } from '../lib/api';
import { dateShort } from '../lib/format';
import { Arrow, Empty, PageHead, Reveal, SearchIcon } from '../components/ui';
import { norm } from './ActualitesPage';

const TYPES = ['CDI', 'CDD', 'Stage', 'Freelance'];

export default function OffresPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const type = params.get('type') || '';
  const statut = params.get('statut') || '';
  const { data, loading } = useApi('/offres');

  // Filtrage instantané, l'URL reste partageable
  const set = (k, v) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v); else next.delete(k);
    setParams(next, { replace: true });
  };
  const list = (data || []).filter((o) => (!q || norm(o.titre + o.lieu).includes(norm(q)))
    && (!type || o.type_contrat === type)
    && (!statut || (statut === 'active' ? !o.expiree : o.expiree)));
  const hasFilters = q || type || statut;

  return (
    <main>
      <PageHead image="/storage/kapi/banner_offres.jpg" tag="Rejoignez-nous" title="Offres d'emploi"
        sub="Découvrez nos opportunités de carrière et rejoignez une équipe dynamique et engagée." crumbs={[{ label: 'Carrière' }, { label: "Offres d'emploi" }]} />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: 1040 }}>
          <Reveal className="filters" style={{ marginTop: -36, position: 'relative', zIndex: 2 }}>
            <label className="search">
              <span className="sr-only">Rechercher un poste</span>
              <SearchIcon />
              <input type="search" value={q} onChange={(e) => set('q', e.target.value)} placeholder="Rechercher un poste..." />
            </label>
            <select className="input" value={type} onChange={(e) => set('type', e.target.value)} aria-label="Type de contrat">
              <option value="">Tous les types</option>
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select className="input" value={statut} onChange={(e) => set('statut', e.target.value)} aria-label="Statut">
              <option value="">Tous les statuts</option>
              <option value="active">Active</option>
              <option value="expiree">Expirée</option>
            </select>
          </Reveal>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '36px 0 20px', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700 }}>{loading ? 'Chargement…' : `${list.length} offre(s) trouvée(s)`}</span>
            {hasFilters && <button className="link-arrow" onClick={() => setParams({}, { replace: true })}>Réinitialiser les filtres <span>×</span></button>}
          </div>

          <div style={{ display: 'grid', gap: 14 }}>
            {loading && [0, 1, 2].map((i) => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 18 }} />)}
            {list.map((o, i) => (
              <Reveal key={o.id} delay={i * 60} className={`job ${o.expiree ? 'expired' : ''}`}>
                <div className="job-ico">💼</div>
                <div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span className="badge badge-soft">{o.type_contrat}</span>
                    {o.expiree ? <span className="badge badge-ko">✗ Expirée</span> : <span className="badge badge-ok">✓ Active</span>}
                  </div>
                  <h3 className="job-title">{o.titre}</h3>
                  <div className="job-meta">
                    <span>📍 {o.lieu}</span>
                    {o.experience && <span>⏱ {o.experience}</span>}
                    <span>📅 Publié le {dateShort(o.published_at)}</span>
                  </div>
                </div>
                <div className="job-cta">
                  {o.expiree ? (
                    <>
                      <button className="btn btn-sm" disabled>Offre expirée</button>
                      <span className="job-deadline" style={{ color: 'var(--danger)' }}>✗ Expirée le {dateShort(o.date_limite)}</span>
                    </>
                  ) : (
                    <>
                      <Link to="/candidature-spontanee" className="btn btn-sm">Postuler <Arrow /></Link>
                      {o.date_limite && <span className="job-deadline muted">Date limite : {dateShort(o.date_limite)}</span>}
                    </>
                  )}
                </div>
              </Reveal>
            ))}
            {!loading && !list.length && <Empty icon="💼" title="Aucune offre ne correspond à votre recherche">Modifiez vos filtres ou déposez une candidature spontanée.</Empty>}
          </div>

          <Reveal className="cta-band" style={{ marginTop: 48, padding: 44, background: 'linear-gradient(120deg, var(--gold-soft), #fff8e0)', color: 'var(--ink)', border: '1.5px dashed var(--gold)' }}>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              <div style={{ fontSize: 40 }}>📨</div>
              <div>
                <h3 className="h3">Candidature Spontanée</h3>
                <p style={{ color: 'var(--muted)', fontSize: 15, marginTop: 6 }}>Vous ne trouvez pas le poste idéal ? Soumettez votre candidature et nous vous contacterons dès qu'une opportunité se présente.</p>
              </div>
            </div>
            <Link to="/candidature-spontanee" className="btn btn-gold">Soumettre ma candidature <Arrow /></Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
