import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useApi } from '../lib/api';
import { dateShort } from '../lib/format';
import { PageHero } from '../components/Heroes';

const TYPES = ['CDI', 'CDD', 'Stage', 'Freelance'];

export default function OffresPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ q: params.get('q') || '', type: params.get('type') || '', statut: params.get('statut') || '' });
  const qs = params.toString();
  const { data } = useApi(`/offres${qs ? `?${qs}` : ''}`);
  const offres = data || [];

  const submit = (e) => {
    e.preventDefault();
    const p = new URLSearchParams(form);
    navigate(`/offres?${p.toString()}`);
  };
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <main>
      <PageHero image="/storage/kapi/banner_offres.jpg" tag="Rejoignez-nous" title="Offres d'emploi"
        sub="Découvrez nos opportunités de carrière et rejoignez une équipe dynamique et engagée." />

      <form onSubmit={submit}>
        <div className="filters-bar">
          <div className="filters-inner">
            <input className="filter-input" type="text" name="q" value={form.q} onChange={set('q')} placeholder="🔍 Rechercher un poste..." />
            <select className="filter-select" name="type" value={form.type} onChange={set('type')}>
              <option value="">Tous les types</option>
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select className="filter-select" name="statut" value={form.statut} onChange={set('statut')}>
              <option value="">Tous les statuts</option>
              <option value="active">Active</option>
              <option value="expiree">Expirée</option>
            </select>
            <button type="submit" className="filter-btn">Filtrer</button>
            <span style={{ marginLeft: 'auto', fontSize: '13px', color: 'var(--gray)' }}>{offres.length} offre(s) trouvée(s)</span>
          </div>
        </div>
      </form>

      <div className="offres-list">
        {offres.map((o) => (
          <div key={o.id} className={`offre-card${o.expiree ? ' expired' : ''}`}>
            <div className="offre-icon">💼</div>
            <div className="offre-main">
              <div className="offre-tags">
                <span className="tag tag-blue">{o.type_contrat}</span>
                {o.expiree ? <span className="tag tag-red">✗ Expirée</span> : <span className="tag tag-green">✓ Active</span>}
              </div>
              <div className="offre-title">{o.titre}</div>
              <div className="offre-meta">
                <span>📍 {o.lieu}</span>
                {o.experience && <span>⏱ {o.experience}</span>}
                <span>📅 Publié le {dateShort(o.published_at)}</span>
              </div>
            </div>
            <div className="offre-cta">
              {o.expiree ? (
                <>
                  <button className="btn-apply disabled" disabled>Offre expirée</button>
                  <div className="deadline" style={{ color: '#C0392B' }}>✗ Expirée le {dateShort(o.date_limite)}</div>
                </>
              ) : (
                <>
                  <Link to="/candidature-spontanee" className="btn-apply">Postuler</Link>
                  {o.date_limite && <div className="deadline">Date limite : {dateShort(o.date_limite)}</div>}
                </>
              )}
            </div>
          </div>
        ))}

        <div style={{ background: 'linear-gradient(135deg,var(--gold-pale),#FFF8E0)', border: '1.5px dashed var(--gold)', borderRadius: '16px', padding: '24px 28px', display: 'flex', alignItems: 'center', gap: '22px', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '34px' }}>📨</div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '17px', fontWeight: 700, color: 'var(--black)', marginBottom: '5px' }}>Candidature Spontanée</div>
            <div style={{ fontSize: '14px', color: 'var(--gray)' }}>Vous ne trouvez pas le poste idéal ? Soumettez votre candidature et nous vous contacterons dès qu'une opportunité se présente.</div>
          </div>
          <Link to="/candidature-spontanee" className="btn-primary">Soumettre ma candidature</Link>
        </div>
      </div>
    </main>
  );
}
