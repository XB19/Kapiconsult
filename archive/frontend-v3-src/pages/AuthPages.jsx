import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';
import { dateFr } from '../lib/format';
import { Field } from '../components/forms';

function AuthShell({ title, sub, children }) {
  return (
    <main className="auth">
      <aside className="auth__side">
        <span className="kicker kicker--light">Espace candidat</span>
        <div>
          <h2 className="t-2" style={{ marginBottom: 16 }}>Votre partenaire stratégique de confiance</h2>
          <p>Depuis 2004, Kapi Consult accompagne les acteurs économiques vers l'excellence et la compétitivité.</p>
        </div>
        <span className="small" style={{ color: 'rgba(255,255,255,.5)' }}>Groupe OSEOR S.A. · Lomé, Togo</span>
      </aside>
      <div className="auth__main">
        <div className="auth__box">
          <h1 className="t-2">{title}</h1>
          <p className="muted" style={{ margin: '6px 0 28px' }}>{sub}</p>
          {children}
        </div>
      </div>
    </main>
  );
}

function Password({ name, placeholder, invalid }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <input id={name} type={show ? 'text' : 'password'} name={name} className={`input ${invalid ? 'is-invalid' : ''}`} placeholder={placeholder} required style={{ paddingRight: 84 }} />
      <button type="button" className="u-link small" onClick={() => setShow((s) => !s)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--navy-2)' }}>
        {show ? 'Masquer' : 'Afficher'}
      </button>
    </div>
  );
}

function useAuthSubmit(path) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setSending(true); setErrors({});
    try {
      login(await api(path, { method: 'POST', body: Object.fromEntries(new FormData(e.currentTarget)) }));
      navigate('/mon-compte');
    } catch (err) {
      setErrors(Object.keys(err.errors || {}).length ? err.errors : { email: 'Une erreur est survenue, merci de réessayer.' });
    } finally { setSending(false); }
  };
  return { errors, sending, submit };
}

export function LoginPage() {
  const { user } = useAuth();
  const { errors, sending, submit } = useAuthSubmit('/auth/login');
  if (user) return <Navigate to="/mon-compte" replace />;
  return (
    <AuthShell title="Connexion" sub="Accédez à votre espace personnel">
      <form onSubmit={submit} className="form">
        <Field label="Adresse email" name="email" error={errors.email}><input id="email" type="email" name="email" className={`input ${errors.email ? 'is-invalid' : ''}`} placeholder="votre@email.com" required autoComplete="email" /></Field>
        <Field label="Mot de passe" name="password"><Password name="password" placeholder="••••••••" /></Field>
        <label className="check"><input type="checkbox" name="remember" /> Se souvenir de moi</label>
        <button type="submit" className="btn btn--block" disabled={sending}>{sending ? 'Connexion…' : 'Se connecter'}</button>
      </form>
      <p className="small muted" style={{ marginTop: 24 }}>Pas encore de compte ? <Link to="/inscription" className="u-link" style={{ color: 'var(--navy-2)', fontWeight: 600 }}>S'inscrire</Link></p>
      <p className="small" style={{ marginTop: 8 }}><Link to="/" className="muted u-link">← Retour au site</Link></p>
    </AuthShell>
  );
}

export function InscriptionPage() {
  const { user } = useAuth();
  const { errors, sending, submit } = useAuthSubmit('/auth/register');
  if (user) return <Navigate to="/mon-compte" replace />;
  return (
    <AuthShell title="Créer un compte" sub="Espace candidat — Kapi Consult">
      <form onSubmit={submit} className="form">
        <div className="form__row">
          <Field label="Prénom" name="prenom" required error={errors.prenom}><input id="prenom" name="prenom" className="input" required autoComplete="given-name" /></Field>
          <Field label="Nom" name="name" required error={errors.name}><input id="name" name="name" className="input" required autoComplete="family-name" /></Field>
        </div>
        <Field label="Email" name="email" required error={errors.email}><input id="email" type="email" name="email" className={`input ${errors.email ? 'is-invalid' : ''}`} required autoComplete="email" /></Field>
        <Field label="Téléphone" name="telephone"><input id="telephone" name="telephone" className="input" placeholder="+228 XX XX XX XX" autoComplete="tel" /></Field>
        <Field label="Mot de passe" name="password" required error={errors.password} hint="8 caractères minimum"><Password name="password" invalid={!!errors.password} /></Field>
        <Field label="Confirmer le mot de passe" name="password_confirmation" required><Password name="password_confirmation" /></Field>
        <button type="submit" className="btn btn--block" disabled={sending}>{sending ? 'Création…' : 'Créer mon compte'}</button>
      </form>
      <p className="small muted" style={{ marginTop: 24 }}>Déjà un compte ? <Link to="/login" className="u-link" style={{ color: 'var(--navy-2)', fontWeight: 600 }}>Se connecter</Link></p>
    </AuthShell>
  );
}

const STATUTS = { en_cours: ['En cours', ''], retenu: ['Retenu', 'label--ok'], rejete: ['Rejeté', 'label--ko'] };

export function MonComptePage() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  useEffect(() => {
    if (!token) return undefined;
    let alive = true;
    api('/auth/me', { token }).then((d) => alive && setData(d)).catch((e) => { if (alive && e.status === 401) logout(); });
    return () => { alive = false; };
  }, [token, logout]);
  if (!user) return <Navigate to="/login" replace />;
  const cands = data?.candidatures || [];

  return (
    <main className="sec sec--stone">
      <div className="wrap" style={{ maxWidth: 900 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap', paddingBottom: 24, borderBottom: '1px solid var(--rule)', marginBottom: 40 }}>
          <div>
            <span className="kicker">Mon espace candidat</span>
            <h1 className="t-1" style={{ margin: '10px 0 6px' }}>{user.prenom} {user.nom}</h1>
            <p className="muted">{user.email}{user.telephone ? ` · ${user.telephone}` : ''}</p>
          </div>
          <button className="btn btn--line btn--sm" onClick={() => { logout(); navigate('/'); }}>Se déconnecter</button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
          <h2 className="t-3">Mes candidatures</h2>
          <Link to="/candidature-spontanee" className="btn btn--sm">Nouvelle candidature</Link>
        </div>
        <div className="jobs">
          {!data && <div className="skeleton" style={{ height: 70, margin: '16px 0' }} />}
          {data && !cands.length && <div className="empty" style={{ borderTop: 0 }}><b>Aucune candidature pour le moment</b>Déposez une candidature spontanée pour la suivre ici.</div>}
          {cands.map((c) => {
            const [lbl, cl] = STATUTS[c.statut] || [c.statut, ''];
            return (
              <div key={c.id} className="job" style={{ padding: '20px 0' }}>
                <div>
                  <h3 className="t-4">Candidature spontanée — {c.domaine}</h3>
                  <span className="small muted">Envoyée le {dateFr(c.created_at)}</span>
                </div>
                <span className={`label ${cl}`}>{lbl}</span>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
