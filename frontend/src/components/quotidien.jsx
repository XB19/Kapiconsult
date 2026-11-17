// Quotidien : accès réservé aux membres + acceptation des conditions de mise en relation
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  ArrowRight, Handshake, IdCard, Loader2, LogIn, Scale, Search, ShieldAlert, ShieldCheck, UserPlus, Wrench,
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';
import { PageBanner } from './ui';
import { POINTS_CLES } from '../content/quotidien';

const BANNER = { image: '/storage/kapi/domaine_industrie.jpg', label: 'Quotidien', crumbs: [{ label: 'Bons Plans' }, { label: 'Quotidien' }] };

// Avertissement affiché sur les pages de l'annuaire
export function MiseEnRelation({ compact = false }) {
  return (
    <aside className={`mer ${compact ? 'mer--compact' : ''}`} aria-label="Avertissement">
      <Scale size={compact ? 20 : 24} />
      <div>
        <b>Kapi Consult vous met en relation, sans intervenir dans vos accords.</b>
        <p>
          Les prestations, les prix et les paiements se décident directement entre le client et le prestataire. Kapi Consult n’est pas
          responsable de ce qui se passe en dehors de la plateforme.{' '}
          <Link to="/quotidien/conditions" className="u-link">Lire les conditions d’utilisation</Link>
        </p>
      </div>
    </aside>
  );
}

// Visiteur non connecté : choix du type de compte
function AccesMembres({ next, pro }) {
  const n = encodeURIComponent;
  return (
    <main>
      <PageBanner {...BANNER} title="Un espace réservé aux membres" sub="Pour la sécurité de tous, Quotidien est accessible uniquement avec un compte Kapi Consult." />
      <section className="sec sec--bg">
        <div className="wrap" style={{ maxWidth: 1040 }}>
          <div className="gate-grid">
            <div className={`box gate-card ${pro ? '' : 'is-main'}`}>
              <span className="gate-card__ico"><Search size={26} /></span>
              <h2>Je cherche un professionnel</h2>
              <p>Créez votre compte client gratuit pour rechercher un prestataire près de chez vous, voir ses coordonnées et laisser un avis.</p>
              <Link to={`/inscription?next=${n('/prestataires')}`} className="btn btn--gold btn--block"><UserPlus size={17} />Créer un compte client</Link>
            </div>
            <div className={`box gate-card ${pro ? 'is-main' : ''}`}>
              <span className="gate-card__ico"><Wrench size={26} /></span>
              <h2>Je suis prestataire</h2>
              <p>Créez votre compte, puis votre fiche professionnelle. Votre profil sera publié après vérification de votre identité et de votre qualification.</p>
              <p className="gate-card__need"><IdCard size={16} /><span>Prévoyez une photo du <b>recto et du verso de votre CNI</b> et de votre <b>diplôme ou attestation de formation</b>.</span></p>
              <Link to={`/inscription?next=${n('/prestataires/inscription')}`} className="btn btn--block"><UserPlus size={17} />Créer un compte prestataire</Link>
            </div>
          </div>
          <p className="gate-login">Vous avez déjà un compte ? <Link to={`/login?next=${n(next)}`} className="u-link"><LogIn size={15} style={{ verticalAlign: -2 }} /> Se connecter</Link></p>
          <MiseEnRelation />
        </div>
      </section>
    </main>
  );
}

// Membre connecté qui n'a pas encore accepté les conditions
function AccepterConditions({ onAccept }) {
  const [ok, setOk] = useState(false);
  const [state, setState] = useState({ sending: false, error: '' });
  const submit = async (e) => {
    e.preventDefault();
    setState({ sending: true, error: '' });
    try { await onAccept(); } catch { setState({ sending: false, error: 'Une erreur est survenue, merci de réessayer.' }); }
  };
  return (
    <main>
      <PageBanner {...BANNER} title="Avant d’accéder à Quotidien" sub="Merci de prendre connaissance de la règle essentielle de notre service de mise en relation." />
      <section className="sec sec--bg">
        <div className="wrap" style={{ maxWidth: 820 }}>
          <form className="box consent" onSubmit={submit}>
            <div className="consent__head">
              <span><Handshake size={28} /></span>
              <div>
                <h2>Quotidien est un service de mise en relation</h2>
                <p className="muted">En utilisant Quotidien, vous reconnaissez que :</p>
              </div>
            </div>
            <ol className="consent__list">{POINTS_CLES.map((p) => <li key={p}>{p}</li>)}</ol>
            <Link to="/quotidien/conditions" target="_blank" className="link" style={{ marginBottom: 22 }}>Lire les conditions d’utilisation complètes <ArrowRight size={15} /></Link>
            {state.error && <div className="alert alert--err">{state.error}</div>}
            <label className="check consent__check">
              <input type="checkbox" checked={ok} onChange={(e) => setOk(e.target.checked)} />
              <span>J’ai lu et j’accepte les conditions d’utilisation de Quotidien. Je comprends que Kapi Consult n’est pas responsable des prestations, des paiements ni de ce qui se passe en dehors de la plateforme.</span>
            </label>
            <button className="btn btn--gold" disabled={!ok || state.sending}>
              {state.sending ? <Loader2 size={17} className="spin" /> : <ShieldCheck size={17} />}J’accepte et j’accède à Quotidien
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

// Route parente de toutes les pages Quotidien
export function QuotidienGate() {
  const { pathname } = useLocation();
  const { user, token, logout } = useAuth();
  const [acces, setAcces] = useState({ loading: true });
  const inscription = pathname.startsWith('/prestataires/inscription');

  useEffect(() => {
    if (!token) { setAcces({ loading: false }); return undefined; }
    let alive = true;
    setAcces({ loading: true });
    api('/quotidien/acces', { token })
      .then((d) => alive && setAcces({ loading: false, ...d }))
      .catch((e) => { if (!alive) return; if (e.status === 401) logout(); setAcces({ loading: false, error: true }); });
    return () => { alive = false; };
  }, [token, logout]);

  if (!user) return <AccesMembres next={pathname} pro={inscription} />;
  if (acces.loading) return <main className="sec sec--bg"><div className="wrap"><div className="skeleton" style={{ height: 360 }} /></div></main>;
  if (acces.error) {
    return (
      <main className="sec sec--bg"><div className="wrap" style={{ maxWidth: 760 }}>
        <div className="alert alert--err"><ShieldAlert size={20} /><span>Impossible de vérifier votre accès pour le moment. Merci de réessayer.</span></div>
      </div></main>
    );
  }
  // Le formulaire prestataire contient sa propre acceptation des conditions
  if (!acces.accepte && !inscription) {
    return <AccepterConditions onAccept={async () => {
      const d = await api('/quotidien/conditions', { method: 'POST', body: { accepte: true }, token });
      setAcces({ loading: false, ...d });
      window.scrollTo({ top: 0 });
    }} />;
  }
  return <Outlet />;
}
