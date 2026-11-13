import { Link, useSearchParams } from 'react-router-dom';
import { useApi } from '../lib/api';
import { dateShort } from '../lib/format';
import { Empty, PageHead, Reveal, SearchField, norm } from '../components/ui';

const TYPES = ['CDI', 'CDD', 'Stage', 'Freelance'];

export default function OffresPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const type = params.get('type') || '';
  const statut = params.get('statut') || '';
  const { data, loading } = useApi('/offres');

  const set = (k, v) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v); else next.delete(k);
    setParams(next, { replace: true });
  };
  const list = (data || []).filter((o) => (!q || norm(o.titre + o.lieu).includes(norm(q)))
    && (!type || o.type_contrat === type)
    && (!statut || (statut === 'active' ? !o.expiree : o.expiree)));

  return (
    <main>
      <PageHead image="/storage/kapi/banner_offres.jpg" label="Rejoignez-nous" title="Offres d'emploi"
        sub="Découvrez nos opportunités de carrière et rejoignez une équipe dynamique et engagée." crumbs={[{ label: 'Carrière' }, { label: "Offres d'emploi" }]} />

      <section className="sec">
        <div className="wrap" style={{ maxWidth: 1040 }}>
          <div className="job-filters">
            <SearchField value={q} onChange={(v) => set('q', v)} placeholder="Rechercher un poste..." />
            <select className="input" value={type} onChange={(e) => set('type', e.target.value)} aria-label="Type de contrat">
              <option value="">Tous les types</option>
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select className="input" value={statut} onChange={(e) => set('statut', e.target.value)} aria-label="Statut">
              <option value="">Tous les statuts</option>
              <option value="active">Active</option>
              <option value="expiree">Expirée</option>
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', margin: '28px 0 14px' }} className="small">
            <b style={{ color: 'var(--ink)' }}>{loading ? 'Chargement…' : `${list.length} offre(s) trouvée(s)`}</b>
            {(q || type || statut) && <button className="u-link" onClick={() => setParams({}, { replace: true })}>Réinitialiser les filtres</button>}
          </div>

          <div className="jobs">
            {loading && [0, 1, 2].map((i) => <div key={i} className="skeleton" style={{ height: 100, margin: '16px 0' }} />)}
            {list.map((o) => (
              <Reveal key={o.id} className={`job ${o.expiree ? 'job--expired' : ''}`}>
                <div>
                  <div className="job__labels">
                    <span className="label">{o.type_contrat}</span>
                    {o.expiree ? <span className="label label--ko">Expirée</span> : <span className="label label--ok">Active</span>}
                  </div>
                  <h3 className="job__title">{o.titre}</h3>
                  <div className="job__meta">
                    <span><b>Lieu :</b> {o.lieu}</span>
                    {o.experience && <span><b>Expérience :</b> {o.experience}</span>}
                    <span>Publié le {dateShort(o.published_at)}</span>
                  </div>
                </div>
                <div className="job__cta">
                  {o.expiree
                    ? <><button className="btn btn--sm" disabled>Offre expirée</button><span className="job__deadline">Expirée le {dateShort(o.date_limite)}</span></>
                    : <><Link to="/candidature-spontanee" className="btn btn--sm">Postuler</Link>{o.date_limite && <span className="job__deadline">Date limite : {dateShort(o.date_limite)}</span>}</>}
                </div>
              </Reveal>
            ))}
          </div>
          {!loading && !list.length && <Empty title="Aucune offre ne correspond à votre recherche">Modifiez vos filtres ou déposez une candidature spontanée.</Empty>}

          <Reveal className="panel" style={{ marginTop: 56, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', gap: 28, alignItems: 'center', borderTop: '3px solid var(--gold)' }}>
            <div>
              <h3 className="t-3" style={{ marginBottom: 6 }}>Candidature Spontanée</h3>
              <p className="muted">Vous ne trouvez pas le poste idéal ? Soumettez votre candidature et nous vous contacterons dès qu'une opportunité se présente.</p>
            </div>
            <Link to="/candidature-spontanee" className="btn btn--gold">Soumettre ma candidature</Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
