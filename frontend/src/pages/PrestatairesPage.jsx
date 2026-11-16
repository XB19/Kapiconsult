import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowRight, BadgeCheck, SlidersHorizontal, ChevronLeft, ChevronRight, Loader2, LocateFixed, MapPin, RotateCcw, Search, ShieldCheck, Star, UserPlus, Users, X,
} from 'lucide-react';
import { useApi } from '../lib/api';
import { Empty, PageBanner, Reveal, SecTitle } from '../components/ui';
import { ProCard } from '../components/annuaire';
import { ANNUAIRE, METIERS, METIERS_POPULAIRES, RAYONS, VILLES, metierIcon } from '../content/prestataires';

const NOTES = [['', 'Toutes'], ['3', '3+'], ['4', '4+'], ['4.5', '4,5+']];
const TRIS = [['', 'Pertinence'], ['note', 'Mieux notés'], ['recent', 'Plus récents'], ['distance', 'Plus proches']];

export default function PrestatairesPage() {
  const [params, setParams] = useSearchParams();
  const get = (k) => params.get(k) || '';
  const [q, setQ] = useState(get('q'));
  const [ville, setVille] = useState(get('ville'));
  const [geo, setGeo] = useState({ loading: false, error: '' });
  const [showFilters, setShowFilters] = useState(false);
  useEffect(() => { setQ(get('q')); setVille(get('ville')); }, [params]); // eslint-disable-line react-hooks/exhaustive-deps

  const apiQuery = new URLSearchParams([...params].filter(([, v]) => v)).toString();
  const { data, loading } = useApi(`/prestataires?${apiQuery}`);
  const { data: filtres } = useApi('/prestataires/filtres');

  const update = (patch, keepPage = false) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    if (!keepPage) next.delete('page');
    setParams(next, { replace: !keepPage });
  };
  const search = (e) => { e.preventDefault(); update({ q: q.trim(), ville: ville.trim() }); };
  const nearMe = () => {
    if (!navigator.geolocation) { setGeo({ loading: false, error: 'La localisation n’est pas disponible sur cet appareil.' }); return; }
    setGeo({ loading: true, error: '' });
    navigator.geolocation.getCurrentPosition(
      (pos) => { setGeo({ loading: false, error: '' }); update({ lat: pos.coords.latitude.toFixed(4), lng: pos.coords.longitude.toFixed(4), rayon: get('rayon') || '20', tri: 'distance', ville: '' }); },
      () => setGeo({ loading: false, error: 'Impossible d’obtenir votre position. Autorisez la localisation ou indiquez une ville.' }),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  };
  const located = get('lat') && get('lng');
  const filtered = ['q', 'metier', 'ville', 'note', 'lat'].some((k) => get(k));
  const items = data?.items || [];
  const page = data?.page || 1;
  const counts = Object.fromEntries((filtres?.metiers || []).map((m) => [m.metier, m.n]));
  const villes = [...new Set([...(filtres?.villes || []).map((v) => v.ville), ...VILLES])];
  const goPage = (n) => { update({ page: n > 1 ? String(n) : '' }, true); window.scrollTo({ top: document.getElementById('resultats')?.offsetTop - 120 || 0, behavior: 'smooth' }); };

  return (
    <main>
      <PageBanner image="/storage/kapi/domaine_industrie.jpg" label={ANNUAIRE.label} title={ANNUAIRE.title} sub={ANNUAIRE.sub} crumbs={[{ label: 'Bons Plans' }, { label: 'Quotidien' }]}>
        <form className="finder" onSubmit={search} role="search">
          <label className="finder__field">
            <Search size={18} />
            <span className="sr-only">Métier ou service recherché</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Métier, service… (ex. mécanicien, climatisation)" />
          </label>
          <label className="finder__field">
            <MapPin size={18} />
            <span className="sr-only">Ville</span>
            <input value={located ? '' : ville} onChange={(e) => setVille(e.target.value)} list="villes-annuaire" placeholder={located ? 'Autour de ma position' : 'Ville (ex. Lomé)'} disabled={!!located} />
          </label>
          <button type="button" className="finder__locate" onClick={located ? () => update({ lat: '', lng: '', rayon: '', tri: '' }) : nearMe} aria-pressed={!!located}>
            {geo.loading ? <Loader2 size={17} className="spin" /> : located ? <X size={17} /> : <LocateFixed size={17} />}
            {located ? 'Retirer ma position' : 'Autour de moi'}
          </button>
          <button type="submit" className="btn btn--gold"><Search size={17} />Rechercher</button>
          <datalist id="villes-annuaire">{villes.map((v) => <option key={v} value={v} />)}</datalist>
        </form>
        {geo.error && <p className="finder__error">{geo.error}</p>}
        <div className="finder__trust">
          <span><ShieldCheck size={16} />Profils validés par Kapi Consult</span>
          <span><Star size={16} />Avis de vrais clients</span>
          <span><Users size={16} />{filtres?.total ?? '…'} professionnel{filtres?.total > 1 ? 's' : ''} inscrit{filtres?.total > 1 ? 's' : ''}</span>
        </div>
      </PageBanner>

      <section className="sec sec--bg" id="resultats">
        <div className="wrap">
          {!filtered && (
            <div className="tabs pro-popular" aria-label="Métiers recherchés">
              {METIERS_POPULAIRES.map((m) => {
                const Icon = metierIcon(m);
                return <button key={m} className="tab" onClick={() => update({ metier: m })}><Icon size={16} />{m}</button>;
              })}
            </div>
          )}

          <button className="btn btn--outline btn--block dir__toggle" onClick={() => setShowFilters((v) => !v)} aria-expanded={showFilters}>
            <SlidersHorizontal size={17} />{showFilters ? 'Masquer les filtres' : 'Filtrer les résultats'}
            {['metier', 'ville', 'note'].filter((k) => get(k)).length > 0 && <span className="dir__count">{['metier', 'ville', 'note'].filter((k) => get(k)).length}</span>}
          </button>
          <div className="dir">
            <aside className={`dir__filters ${showFilters ? 'is-open' : ''}`} aria-label="Filtres">
              <div className="dir__block">
                <h4>Métier</h4>
                <select className="input" value={get('metier')} onChange={(e) => update({ metier: e.target.value })} aria-label="Métier">
                  <option value="">Tous les métiers</option>
                  {METIERS.map((m) => <option key={m.label} value={m.label}>{m.label}{counts[m.label] ? ` (${counts[m.label]})` : ''}</option>)}
                </select>
              </div>
              {!located && (
                <div className="dir__block">
                  <h4>Ville</h4>
                  <select className="input" value={get('ville')} onChange={(e) => update({ ville: e.target.value })} aria-label="Ville">
                    <option value="">Toutes les villes</option>
                    {(filtres?.villes || []).map((v) => <option key={v.ville} value={v.ville}>{v.ville} ({v.n})</option>)}
                    {get('ville') && !(filtres?.villes || []).some((v) => v.ville === get('ville')) && <option value={get('ville')}>{get('ville')}</option>}
                  </select>
                </div>
              )}
              {located && (
                <div className="dir__block">
                  <h4>Distance maximale</h4>
                  <div className="seg">
                    {RAYONS.map((r) => <button key={r} className={get('rayon') === String(r) ? 'is-active' : ''} onClick={() => update({ rayon: String(r) })}>{r} km</button>)}
                  </div>
                </div>
              )}
              <div className="dir__block">
                <h4>Note minimale</h4>
                <div className="seg">
                  {NOTES.map(([v, l]) => <button key={l} className={get('note') === v ? 'is-active' : ''} onClick={() => update({ note: v })}>{v && <Star size={13} />}{l}</button>)}
                </div>
              </div>
              {filtered && <button className="link" onClick={() => setParams({}, { replace: true })}><RotateCcw size={15} />Réinitialiser les filtres</button>}
              <div className="dir__join">
                <UserPlus size={22} />
                <b>{ANNUAIRE.ctaTitle}</b>
                <p>Créez votre profil gratuitement et recevez des demandes de clients.</p>
                <Link to="/prestataires/inscription" className="btn btn--gold btn--sm btn--block">Inscrire mon activité</Link>
              </div>
            </aside>

            <div>
              <div className="dir__bar">
                <b>{loading ? 'Recherche…' : `${data?.total ?? 0} prestataire${data?.total > 1 ? 's' : ''} trouvé${data?.total > 1 ? 's' : ''}`}
                  {get('metier') && <span className="muted"> · {get('metier')}</span>}
                  {located ? <span className="muted"> · dans un rayon de {get('rayon') || 20} km</span> : get('ville') && <span className="muted"> · {get('ville')}</span>}
                </b>
                <label className="dir__sort">Trier par
                  <select className="input" value={get('tri')} onChange={(e) => update({ tri: e.target.value })}>
                    {TRIS.filter(([v]) => v !== 'distance' || located).map(([v, l]) => <option key={l} value={v}>{l}</option>)}
                  </select>
                </label>
              </div>

              {loading && !data && <div className="grid g-3 pro-grid">{[0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="skeleton" style={{ height: 250 }} />)}</div>}
              {data && items.length > 0 && (
                <div className="grid g-3 pro-grid" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity .2s' }}>
                  {items.map((p, i) => <Reveal key={p.id} delay={(i % 3) * 60} style={{ height: '100%' }}><ProCard p={p} /></Reveal>)}
                </div>
              )}
              {data && !items.length && (
                filtered
                  ? <Empty title="Aucun prestataire ne correspond à votre recherche">Élargissez la zone, changez de ville ou essayez un autre métier.</Empty>
                  : <Empty title="L’annuaire s’ouvre bientôt">Les premiers professionnels sont en cours de validation. Vous êtes artisan ou technicien ? <Link to="/prestataires/inscription" className="u-link">Inscrivez-vous</Link>.</Empty>
              )}

              {data?.pages > 1 && (
                <nav className="pager" aria-label="Pagination">
                  <button onClick={() => goPage(page - 1)} disabled={page <= 1} aria-label="Page précédente"><ChevronLeft size={18} /></button>
                  {Array.from({ length: data.pages }, (_, i) => i + 1).map((n) => <button key={n} className={n === page ? 'is-active' : ''} onClick={() => goPage(n)}>{n}</button>)}
                  <button onClick={() => goPage(page + 1)} disabled={page >= data.pages} aria-label="Page suivante"><ChevronRight size={18} /></button>
                </nav>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <SecTitle title="Comment ça marche ?" hl="Comment" center sub="Un annuaire simple, pensé pour les clients comme pour les professionnels." />
          <div className="grid g-3">
            {[
              [Search, 'Recherchez', 'Indiquez le métier dont vous avez besoin et votre ville, ou utilisez votre position pour voir les professionnels les plus proches.'],
              [BadgeCheck, 'Comparez', 'Consultez les profils, l’expérience, les spécialités et les avis laissés par les clients précédents.'],
              [MapPin, 'Contactez', 'Appelez ou écrivez directement au prestataire choisi, puis laissez un avis après la prestation.'],
            ].map(([Icon, t, d], i) => (
              <Reveal key={t} delay={i * 80} className="feature">
                <div className="feature__ico"><Icon size={26} /></div>
                <h3>{t}</h3>
                <p>{d}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="pro-cta">
            <div>
              <h3>{ANNUAIRE.ctaTitle}</h3>
              <p>{ANNUAIRE.ctaText}</p>
            </div>
            <Link to="/prestataires/inscription" className="btn btn--gold">Inscrire mon activité <ArrowRight size={16} /></Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
