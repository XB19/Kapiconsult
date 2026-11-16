import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft, BadgeCheck, Briefcase, CalendarClock, ChevronRight, Clock3, Mail, MapPin, MessageCircle, Navigation, Pencil, Phone, Route,
  Send, Star, Wallet,
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';
import { dateFr } from '../lib/format';
import { Empty, Reveal } from '../components/ui';
import { Flash } from '../components/forms';
import { ProAvatar, Rating, Stars, lieu } from '../components/annuaire';
import { MiseEnRelation } from '../components/quotidien';

const digits = (t) => String(t || '').replace(/[^\d+]/g, '');
const waLink = (t) => `https://wa.me/${digits(t).replace(/^\+/, '')}`;
const STATUT_INFO = {
  en_attente: 'Votre profil est en cours de validation : il n’est pas encore visible dans l’annuaire.',
  refuse: 'Votre profil n’a pas été validé. Modifiez-le pour le soumettre à nouveau.',
  suspendu: 'Votre profil est suspendu. Contactez Kapi Consult pour plus d’informations.',
};

// Choix de la note par étoiles
function StarInput({ value, onChange }) {
  const [hover, setHover] = useState(0);
  const labels = ['', 'Décevant', 'Moyen', 'Bien', 'Très bien', 'Excellent'];
  return (
    <div className="star-input" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" onClick={() => onChange(n)} onMouseEnter={() => setHover(n)} aria-label={`${n} étoile${n > 1 ? 's' : ''}`}
          className={(hover || value) >= n ? 'is-on' : ''}><Star size={28} /></button>
      ))}
      <span>{labels[hover || value] || 'Choisissez une note'}</span>
    </div>
  );
}

function AvisForm({ id, mine, onDone }) {
  const { user, token } = useAuth();
  const [note, setNote] = useState(mine?.note || 0);
  const [text, setText] = useState(mine?.commentaire || '');
  const [state, setState] = useState({ sending: false, errors: {}, flash: {} });
  if (!user) {
    return (
      <div className="alert alert--info" style={{ marginBottom: 0 }}>
        <Star size={20} />
        <span>Vous avez fait appel à ce prestataire ? <Link to={`/login?next=/prestataires/${id}`} className="u-link">Connectez-vous</Link> ou <Link to={`/inscription?next=/prestataires/${id}`} className="u-link">créez un compte</Link> pour laisser un avis.</span>
      </div>
    );
  }
  const submit = async (e) => {
    e.preventDefault();
    setState({ sending: true, errors: {}, flash: {} });
    try {
      const res = await api(`/prestataires/${id}/avis`, { method: 'POST', body: { note, commentaire: text }, token });
      setState({ sending: false, errors: {}, flash: { success: res.message } });
      onDone();
    } catch (err) {
      setState({ sending: false, errors: err.errors || {}, flash: { error: err.errors ? '' : 'Une erreur est survenue, merci de réessayer.' } });
    }
  };
  return (
    <form className="form avis-form" onSubmit={submit}>
      <h3>{mine ? 'Modifier mon avis' : 'Donner mon avis'}</h3>
      <Flash {...state.flash} />
      <StarInput value={note} onChange={setNote} />
      {state.errors.note && <span className="field__error">{state.errors.note}</span>}
      <textarea className={`input ${state.errors.commentaire ? 'is-invalid' : ''}`} rows={4} value={text} onChange={(e) => setText(e.target.value)}
        placeholder="Qualité du travail, ponctualité, prix, accueil… Votre retour aide les autres clients." />
      {state.errors.commentaire && <span className="field__error">{state.errors.commentaire}</span>}
      <div><button className="btn btn--gold" disabled={state.sending}><Send size={16} />{state.sending ? 'Publication…' : 'Publier mon avis'}</button></div>
    </form>
  );
}

export default function PrestatairePage() {
  const { id } = useParams();
  const { token } = useAuth();
  const [d, setD] = useState({ loading: true });
  const load = useCallback(() => {
    api(`/prestataires/${id}`, { token }).then((x) => setD({ ...x, loading: false })).catch((error) => setD({ loading: false, error }));
  }, [id, token]);
  useEffect(() => { setD({ loading: true }); load(); }, [load]);

  if (d.loading) return <main className="sec sec--bg"><div className="wrap"><div className="skeleton" style={{ height: 320 }} /></div></main>;
  if (d.error || !d.prestataire) {
    return (
      <main className="sec sec--bg"><div className="wrap" style={{ maxWidth: 760 }}>
        <Empty title="Prestataire introuvable">Ce profil n’existe pas ou n’est plus disponible. <Link to="/prestataires" className="u-link">Retour à l’annuaire</Link></Empty>
      </div></main>
    );
  }
  const p = d.prestataire;
  const mine = d.avis.find((a) => a.mien);
  const total = d.avis.length;
  const maps = p.latitude != null
    ? `https://www.google.com/maps/dir/?api=1&destination=${p.latitude},${p.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([p.quartier, p.ville, p.pays].filter(Boolean).join(', '))}`;

  return (
    <main className="sec sec--bg pro-page">
      <div className="wrap">
        <nav className="crumbs crumbs--dark" aria-label="Fil d'Ariane">
          <Link to="/">Accueil</Link><ChevronRight size={14} /><Link to="/prestataires">Quotidien</Link><ChevronRight size={14} />
          <Link to={`/prestataires?metier=${encodeURIComponent(p.metier)}`}>{p.metier}</Link><ChevronRight size={14} /><span>{p.nom_affiche}</span>
        </nav>

        {d.proprietaire && (
          <div className={`alert ${p.statut === 'valide' ? 'alert--ok' : 'alert--info'}`}>
            <BadgeCheck size={20} />
            <span style={{ flex: 1 }}>{p.statut === 'valide' ? 'Voici votre profil tel que les clients le voient.' : STATUT_INFO[p.statut]}</span>
            <Link to="/prestataires/inscription" className="btn btn--sm btn--outline"><Pencil size={14} />Modifier</Link>
          </div>
        )}

        <div className="pro-layout">
          <div>
            <Reveal className="box pro-hero">
              <ProAvatar p={p} size={112} />
              <div style={{ minWidth: 0 }}>
                <span className="pill pill--gold">{p.metier}</span>
                <h1 className="pro-hero__name">{p.nom_affiche}{p.verifie && <BadgeCheck size={24} className="pro-verified" aria-label="Identité vérifiée" />}</h1>
                <Rating note={p.note} n={p.nb_avis} size={17} />
                <div className="pro-card__meta" style={{ marginTop: 14 }}>
                  <span><MapPin size={16} />{lieu(p)}{p.pays ? ` — ${p.pays}` : ''}</span>
                  {p.experience > 0 && <span><Clock3 size={16} />{p.experience} an{p.experience > 1 ? 's' : ''} d'expérience</span>}
                  {p.verifie && <span className="pro-dist"><BadgeCheck size={16} />Identité vérifiée par Kapi Consult</span>}
                </div>
              </div>
            </Reveal>

            <Reveal className="box pro-section">
              <h2>Présentation</h2>
              <p className="pro-desc">{p.description}</p>
              {p.specialites?.length > 0 && (
                <>
                  <h3>Spécialités</h3>
                  <div className="pro-tags pro-tags--lg">{p.specialites.map((s) => <span key={s}>{s}</span>)}</div>
                </>
              )}
              <div className="pro-facts">
                <div><Route size={20} /><span><b>Zone d'intervention</b>{p.deplacement ? `Se déplace jusqu’à ${p.rayon_km} km autour de ${p.ville}` : `Reçoit les clients à ${lieu(p)}`}</span></div>
                {p.disponibilite && <div><CalendarClock size={20} /><span><b>Disponibilités</b>{p.disponibilite}</span></div>}
                <div><Wallet size={20} /><span><b>Tarifs</b>Sur devis, à convenir selon la prestation</span></div>
                <div><Briefcase size={20} /><span><b>Membre depuis</b>{dateFr(p.created_at)}</span></div>
              </div>
            </Reveal>

            <Reveal className="box pro-section" id="avis">
              <h2>Avis clients <span className="muted" style={{ fontWeight: 400 }}>({total})</span></h2>
              {total > 0 && (
                <div className="avis-summary">
                  <div className="avis-summary__score"><b>{Number(p.note).toFixed(1)}</b><Stars value={p.note} size={18} /><span>{total} avis</span></div>
                  <div className="avis-summary__bars">
                    {d.repartition.map((r) => (
                      <div key={r.note}><span>{r.note} <Star size={12} /></span><i><em style={{ width: `${total ? (r.n / total) * 100 : 0}%` }} /></i><span>{r.n}</span></div>
                    ))}
                  </div>
                </div>
              )}
              {!total && <p className="muted" style={{ marginBottom: 20 }}>Aucun avis pour le moment. Soyez le premier à partager votre expérience.</p>}
              {d.avis.map((a) => (
                <article key={a.id} className="avis">
                  <span className="avis__who">{a.prenom?.[0]}{a.initiale}</span>
                  <div>
                    <div className="avis__head"><b>{a.prenom} {a.initiale}.</b><Stars value={a.note} size={14} /><span className="muted small">{dateFr(a.created_at)}</span></div>
                    <p>{a.commentaire}</p>
                  </div>
                </article>
              ))}
              {!d.proprietaire && <AvisForm id={p.id} mine={mine} onDone={load} />}
            </Reveal>
          </div>

          <aside className="pro-contact">
            <div className="box">
              <h3>Contacter {p.nom_affiche.split(' ')[0]}</h3>
              <p className="muted small" style={{ marginBottom: 18 }}>Mentionnez que vous l’avez trouvé sur l’annuaire Kapi Consult.</p>
              <a href={`tel:${digits(p.telephone)}`} className="btn btn--block"><Phone size={17} />{p.telephone}</a>
              {p.whatsapp && <a href={waLink(p.whatsapp)} target="_blank" rel="noopener noreferrer" className="btn btn--block btn--wa"><MessageCircle size={17} />WhatsApp</a>}
              {p.email && <a href={`mailto:${p.email}`} className="btn btn--block btn--outline"><Mail size={17} />Envoyer un e-mail</a>}
              <a href={maps} target="_blank" rel="noopener noreferrer" className="btn btn--block btn--outline"><Navigation size={17} />Itinéraire</a>
              <div className="pro-contact__safe">
                <BadgeCheck size={18} />
                <span>Conseil : demandez un devis avant le début des travaux et ne payez jamais l’intégralité à l’avance.</span>
              </div>
            </div>
            <MiseEnRelation compact />
            <Link to={`/prestataires?metier=${encodeURIComponent(p.metier)}&ville=${encodeURIComponent(p.ville)}`} className="link" style={{ marginTop: 18 }}>
              <ArrowLeft size={15} />Prestataires similaires à {p.ville}
            </Link>
          </aside>
        </div>
      </div>
      {/* Mobile : contact toujours à portée de main */}
      <div className="pro-mobilebar">
        <a href={`tel:${digits(p.telephone)}`} className="btn"><Phone size={17} />Appeler</a>
        {p.whatsapp
          ? <a href={waLink(p.whatsapp)} target="_blank" rel="noopener noreferrer" className="btn btn--wa"><MessageCircle size={17} />WhatsApp</a>
          : <a href={maps} target="_blank" rel="noopener noreferrer" className="btn btn--outline"><Navigation size={17} />Itinéraire</a>}
      </div>
    </main>
  );
}
