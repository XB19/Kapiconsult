import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';
import { dateFr } from '../lib/format';
import { BrandMark } from '../components/Header';
import { Field } from '../components/forms';
import { Reveal } from '../components/ui';

function AuthShell({ title, sub, children }) {
  return (
    <main className="auth">
      <div className="auth-side">
        <img src="/storage/kapi/equipe.png" alt="" />
        <Reveal>
          <span className="badge" style={{ marginBottom: 20 }}>20 ANS</span>
          <h2 className="h2" style={{ color: '#fff', maxWidth: 480 }}>Votre partenaire <span className="italic-accent">stratégique</span> de confiance</h2>
          <p style={{ color: 'rgba(255,255,255,.7)', marginTop: 14, maxWidth: 460 }}>Depuis 2004, Kapi Consult accompagne les acteurs économiques vers l'excellence et la compétitivité.</p>
        </Reveal>
      </div>
      <div className="auth-main">
        <Reveal className="auth-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <BrandMark /><span className="brand-name">Kapi Consult</span>
          </div>
          <h1 className="h2" style={{ fontSize: 40 }}>{title}</h1>
          <p className="muted" style={{ margin: '8px 0 30px' }}>{sub}</p>
          {children}
        </Reveal>
      </div>
    </main>
  );
}

function PasswordInput({ name, placeholder, invalid }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <input id={name} type={show ? 'text' : 'password'} name={name} className={`input ${invalid ? 'invalid' : ''}`} placeholder={placeholder} required style={{ paddingRight: 90 }} />
      <button type="button" onClick={() => setShow((s) => !s)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 13, fontWeight: 700, color: 'var(--brand)' }}>
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
      <form onSubmit={submit} className="form-grid">
        <Field label="Adresse email" name="email" error={errors.email}><input id="email" type="email" name="email" className={`input ${errors.email ? 'invalid' : ''}`} placeholder="votre@email.com" required autoComplete="email" /></Field>
        <Field label="Mot de passe" name="password"><PasswordInput name="password" placeholder="••••••••" /></Field>
        <label className="check"><input type="checkbox" name="remember" /> Se souvenir de moi</label>
        <button type="submit" className="btn btn-lg btn-block" disabled={sending}>{sending ? 'Connexion…' : 'Se connecter'}</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14 }} className="muted">
        Pas encore de compte ? <Link to="/inscription" className="link-underline" style={{ color: 'var(--brand)', fontWeight: 700 }}>S'inscrire</Link>
      </p>
      <p style={{ textAlign: 'center', marginTop: 10 }}><Link to="/" className="muted" style={{ fontSize: 13 }}>← Retour au site</Link></p>
    </AuthShell>
  );
}

export function InscriptionPage() {
  const { user } = useAuth();
  const { errors, sending, submit } = useAuthSubmit('/auth/register');
  if (user) return <Navigate to="/mon-compte" replace />;
  return (
    <AuthShell title="Créer un compte" sub="Espace candidat — Kapi Consult">
      <form onSubmit={submit} className="form-grid">
        <div className="form-row">
          <Field label="Prénom" name="prenom" required error={errors.prenom}><input id="prenom" name="prenom" className="input" required autoComplete="given-name" /></Field>
          <Field label="Nom" name="name" required error={errors.name}><input id="name" name="name" className="input" required autoComplete="family-name" /></Field>
        </div>
        <Field label="Email" name="email" required error={errors.email}><input id="email" type="email" name="email" className={`input ${errors.email ? 'invalid' : ''}`} required autoComplete="email" /></Field>
        <Field label="Téléphone" name="telephone"><input id="telephone" name="telephone" className="input" placeholder="+228 XX XX XX XX" autoComplete="tel" /></Field>
        <Field label="Mot de passe" name="password" required error={errors.password} hint="8 caractères minimum"><PasswordInput name="password" invalid={!!errors.password} /></Field>
        <Field label="Confirmer le mot de passe" name="password_confirmation" required><PasswordInput name="password_confirmation" /></Field>
        <button type="submit" className="btn btn-lg btn-block" disabled={sending}>{sending ? 'Création…' : 'Créer mon compte'}</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14 }} className="muted">
        Déjà un compte ? <Link to="/login" className="link-underline" style={{ color: 'var(--brand)', fontWeight: 700 }}>Se connecter</Link>
      </p>
    </AuthShell>
  );
}

const STATUTS = { en_cours: ['En cours', 'badge-soft'], retenu: ['Retenu', 'badge-ok'], rejete: ['Rejeté', 'badge-ko'] };

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
    <main className="section bg-paper">
      <div className="container" style={{ maxWidth: 900 }}>
        <Reveal className="form-card" style={{ display: 'flex', gap: 22, alignItems: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
          <div className="avatar" style={{ width: 72, height: 72, fontSize: 26 }}>{user.prenom?.[0]}{user.nom?.[0]}</div>
          <div style={{ flex: 1 }}>
            <span className="eyebrow">Mon espace candidat</span>
            <h1 className="h3" style={{ marginTop: 6 }}>Bonjour {user.prenom} {user.nom}</h1>
            <p className="muted" style={{ fontSize: 14 }}>{user.email}{user.telephone ? ` · ${user.telephone}` : ''}</p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => { logout(); navigate('/'); }}>Se déconnecter</button>
        </Reveal>

        <Reveal className="form-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 22, flexWrap: 'wrap' }}>
            <h2 className="h3">Mes candidatures</h2>
            <Link to="/candidature-spontanee" className="btn btn-gold btn-sm">+ Nouvelle candidature</Link>
          </div>
          {!data && <div className="skeleton" style={{ height: 70 }} />}
          {data && !cands.length && (
            <div className="empty"><div className="ico">📂</div><b style={{ display: 'block', color: 'var(--ink)' }}>Aucune candidature pour le moment</b>Déposez une candidature spontanée pour la suivre ici.</div>
          )}
          <div style={{ display: 'grid', gap: 12 }}>
            {cands.map((c) => {
              const [lbl, cls] = STATUTS[c.statut] || [c.statut, 'badge-soft'];
              return (
                <div key={c.id} className="info-row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <b style={{ display: 'block', color: 'var(--ink)' }}>Candidature spontanée — {c.domaine}</b>
                    <span className="muted" style={{ fontSize: 13 }}>Envoyée le {dateFr(c.created_at)}</span>
                  </div>
                  <span className={`badge ${cls}`}>{lbl}</span>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </main>
  );
}
