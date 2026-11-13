import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, FileText, LogIn, LogOut, Plus, UserPlus } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';
import { dateFr } from '../lib/format';
import { Field } from '../components/forms';
import { LogoMark } from '../components/Header';
import { Title } from '../components/ui';

function AuthShell({ title, hl, sub, children }) {
  return (
    <main className="auth">
      <div className="auth__bg" aria-hidden="true"><img src="/storage/kapi/equipe.png" alt="" /></div>
      <div className="auth__box">
        <div className="auth__logo"><LogoMark height={46} /></div>
        <Title text={title} hl={hl} as="h1" className="t-lg" />
        <p className="muted" style={{ margin: '6px 0 26px' }}>{sub}</p>
        {children}
      </div>
    </main>
  );
}

function Password({ name, placeholder, invalid }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <input id={name} type={show ? 'text' : 'password'} name={name} className={`input ${invalid ? 'is-invalid' : ''}`} placeholder={placeholder} required style={{ paddingRight: 46 }} />
      <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}>
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
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
      const data = await api(path, { method: 'POST', body: Object.fromEntries(new FormData(e.currentTarget)) });
      login(data);
      const next = new URLSearchParams(window.location.search).get('next');
      navigate(data.user.role === 'admin' ? (next || '/admin') : '/mon-compte');
    } catch (err) {
      setErrors(Object.keys(err.errors || {}).length ? err.errors : { email: 'Une erreur est survenue, merci de réessayer.' });
    } finally { setSending(false); }
  };
  return { errors, sending, submit };
}

export function LoginPage() {
  const { user } = useAuth();
  const { errors, sending, submit } = useAuthSubmit('/auth/login');
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/mon-compte'} replace />;
  return (
    <AuthShell title="Connexion" hl="Connexion" sub="Accédez à votre espace personnel">
      <form onSubmit={submit} className="form">
        <Field label="Adresse email" name="email" error={errors.email}><input id="email" type="email" name="email" className={`input ${errors.email ? 'is-invalid' : ''}`} placeholder="votre@email.com" required autoComplete="email" /></Field>
        <Field label="Mot de passe" name="password"><Password name="password" placeholder="••••••••" /></Field>
        <label className="check"><input type="checkbox" name="remember" /> Se souvenir de moi</label>
        <button type="submit" className="btn btn--block" disabled={sending}><LogIn size={17} />{sending ? 'Connexion…' : 'Se connecter'}</button>
      </form>
      <p className="small muted" style={{ marginTop: 22, textAlign: 'center' }}>Pas encore de compte ? <Link to="/inscription" className="u-link" style={{ color: 'var(--brand)', fontWeight: 500 }}>S'inscrire</Link></p>
      <p className="small" style={{ marginTop: 8, textAlign: 'center' }}><Link to="/" className="link" style={{ fontSize: 13.5 }}><ArrowLeft size={14} />Retour au site</Link></p>
    </AuthShell>
  );
}

export function InscriptionPage() {
  const { user } = useAuth();
  const { errors, sending, submit } = useAuthSubmit('/auth/register');
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/mon-compte'} replace />;
  return (
    <AuthShell title="Créer un compte" hl="Créer" sub="Espace candidat — Kapi Consult">
      <form onSubmit={submit} className="form">
        <div className="form__row">
          <Field label="Prénom" name="prenom" required error={errors.prenom}><input id="prenom" name="prenom" className="input" required autoComplete="given-name" /></Field>
          <Field label="Nom" name="name" required error={errors.name}><input id="name" name="name" className="input" required autoComplete="family-name" /></Field>
        </div>
        <Field label="Email" name="email" required error={errors.email}><input id="email" type="email" name="email" className={`input ${errors.email ? 'is-invalid' : ''}`} required autoComplete="email" /></Field>
        <Field label="Téléphone" name="telephone"><input id="telephone" name="telephone" className="input" placeholder="+228 XX XX XX XX" autoComplete="tel" /></Field>
        <Field label="Mot de passe" name="password" required error={errors.password} hint="8 caractères minimum"><Password name="password" invalid={!!errors.password} /></Field>
        <Field label="Confirmer le mot de passe" name="password_confirmation" required><Password name="password_confirmation" /></Field>
        <button type="submit" className="btn btn--block" disabled={sending}><UserPlus size={17} />{sending ? 'Création…' : 'Créer mon compte'}</button>
      </form>
      <p className="small muted" style={{ marginTop: 22, textAlign: 'center' }}>Déjà un compte ? <Link to="/login" className="u-link" style={{ color: 'var(--brand)', fontWeight: 500 }}>Se connecter</Link></p>
    </AuthShell>
  );
}

const STATUTS = { en_cours: ['En cours', 'pill--soft'], retenu: ['Retenu', 'pill--ok'], rejete: ['Rejeté', 'pill--ko'] };

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
    <main className="sec sec--bg">
      <div className="wrap" style={{ maxWidth: 920 }}>
        <div className="box" style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--brand)', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: 'var(--head-font)', fontWeight: 600, fontSize: 22 }}>{user.prenom?.[0]}{user.nom?.[0]}</div>
          <div style={{ flex: 1 }}>
            <span className="over">Mon espace candidat</span>
            <h1 className="t-md">{user.prenom} {user.nom}</h1>
            <p className="small muted">{user.email}{user.telephone ? ` · ${user.telephone}` : ''}</p>
          </div>
          <button className="btn btn--outline btn--sm" onClick={() => { logout(); navigate('/'); }}><LogOut size={15} />Se déconnecter</button>
        </div>
        <div className="box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
            <Title text="Mes candidatures" hl="candidatures" className="t-md" />
            <Link to="/candidature-spontanee" className="btn btn--gold btn--sm"><Plus size={15} />Nouvelle candidature</Link>
          </div>
          {!data && <div className="skeleton" style={{ height: 70 }} />}
          {data && !cands.length && <p className="muted">Aucune candidature pour le moment. Déposez une candidature spontanée pour la suivre ici.</p>}
          {cands.map((c) => {
            const [lbl, cl] = STATUTS[c.statut] || [c.statut, 'pill--soft'];
            return (
              <div key={c.id} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '16px 0', borderTop: '1px solid var(--line)' }}>
                <FileText size={22} color="var(--gold)" />
                <div style={{ flex: 1 }}><b style={{ color: 'var(--ink)' }}>Candidature spontanée — {c.domaine}</b><div className="small muted">Envoyée le {dateFr(c.created_at)}</div></div>
                <span className={`pill ${cl}`}>{lbl}</span>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
