import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';
import { dateFr } from '../lib/format';
import { FieldError } from '../components/FormBits';

const Shell = ({ maxWidth, children }) => (
  <main>
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,var(--blue-deep),#131680)', padding: '40px 16px' }}>
      <div style={{ background: 'var(--white)', borderRadius: '20px', padding: '44px 40px', width: '100%', maxWidth, boxShadow: '0 20px 60px rgba(30,34,153,.2)' }}>
        {children}
      </div>
    </div>
  </main>
);

const cell = { borderRadius: '1px', background: 'linear-gradient(135deg,var(--blue-light),var(--blue-deep))', display: 'block' };

function useSubmit(path, onDone) {
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setSending(true); setErrors({});
    try {
      onDone(await api(path, { method: 'POST', body: Object.fromEntries(new FormData(e.currentTarget)) }));
    } catch (err) {
      setErrors(Object.keys(err.errors || {}).length ? err.errors : { email: 'Une erreur est survenue, merci de réessayer.' });
    } finally { setSending(false); }
  };
  return { errors, sending, submit };
}

export function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const { errors, sending, submit } = useSubmit('/auth/login', (data) => { login(data); navigate('/mon-compte'); });
  if (user) return <Navigate to="/mon-compte" replace />;

  return (
    <Shell maxWidth="440px">
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '14px' }}>
          <div style={{ width: '36px', height: '36px', border: '2px solid var(--gold)', borderRadius: '4px', padding: '3px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2px' }}>
            {Array.from({ length: 9 }, (_, i) => <span key={i} style={cell} />)}
          </div>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '20px', fontWeight: 700, color: 'var(--black)' }}>Kapi Consult</span>
        </div>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '26px', fontWeight: 700, color: 'var(--black)' }}>Connexion</h1>
        <p style={{ fontSize: '14px', color: 'var(--gray)', marginTop: '6px' }}>Accédez à votre espace personnel</p>
      </div>
      <form onSubmit={submit}>
        <div className="form-group">
          <label className="form-label">Adresse email</label>
          <input type="email" name="email" className="form-control" placeholder="votre@email.com" required />
          <FieldError errors={errors} name="email" />
        </div>
        <div className="form-group">
          <label className="form-label">Mot de passe</label>
          <input type="password" name="password" className="form-control" placeholder="••••••••" required />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
            <input type="checkbox" name="remember" /> Se souvenir de moi
          </label>
        </div>
        <button type="submit" className="btn-apply" disabled={sending} style={{ width: '100%', textAlign: 'center', display: 'block', padding: '13px' }}>Se connecter</button>
      </form>
      <div style={{ textAlign: 'center', marginTop: '22px', fontSize: '14px', color: 'var(--gray)' }}>
        Pas encore de compte ? <Link to="/inscription" style={{ color: 'var(--blue-mid)', fontWeight: 600 }}>S'inscrire</Link>
      </div>
      <div style={{ textAlign: 'center', marginTop: '12px' }}>
        <Link to="/" style={{ fontSize: '13px', color: 'var(--gray)' }}>← Retour au site</Link>
      </div>
    </Shell>
  );
}

export function InscriptionPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const { errors, sending, submit } = useSubmit('/auth/register', (data) => { login(data); navigate('/mon-compte'); });
  if (user) return <Navigate to="/mon-compte" replace />;

  return (
    <Shell maxWidth="500px">
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '26px', fontWeight: 700, color: 'var(--black)' }}>Créer un compte</h1>
        <p style={{ fontSize: '14px', color: 'var(--gray)', marginTop: '6px' }}>Espace candidat — Kapi Consult</p>
      </div>
      <form onSubmit={submit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Prénom *</label>
            <input type="text" name="prenom" className="form-control" required />
            <FieldError errors={errors} name="prenom" />
          </div>
          <div className="form-group">
            <label className="form-label">Nom *</label>
            <input type="text" name="name" className="form-control" required />
            <FieldError errors={errors} name="name" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Email *</label>
          <input type="email" name="email" className="form-control" required />
          <FieldError errors={errors} name="email" />
        </div>
        <div className="form-group">
          <label className="form-label">Téléphone</label>
          <input type="text" name="telephone" className="form-control" placeholder="+228 XX XX XX XX" />
        </div>
        <div className="form-group">
          <label className="form-label">Mot de passe *</label>
          <input type="password" name="password" className="form-control" required />
          <FieldError errors={errors} name="password" />
        </div>
        <div className="form-group">
          <label className="form-label">Confirmer le mot de passe *</label>
          <input type="password" name="password_confirmation" className="form-control" required />
        </div>
        <button type="submit" className="btn-apply" disabled={sending} style={{ width: '100%', textAlign: 'center', display: 'block', padding: '13px', marginTop: '8px' }}>Créer mon compte</button>
      </form>
      <div style={{ textAlign: 'center', marginTop: '22px', fontSize: '14px', color: 'var(--gray)' }}>
        Déjà un compte ? <Link to="/login" style={{ color: 'var(--blue-mid)', fontWeight: 600 }}>Se connecter</Link>
      </div>
    </Shell>
  );
}

const STATUTS = { en_cours: ['En cours', 'tag-blue'], retenu: ['Retenu', 'tag-green'], rejete: ['Rejeté', 'tag-red'] };

function AccountContent({ token }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [state, setState] = useState(null);
  useApiWithToken(token, setState, logout);
  const cands = state?.candidatures || [];
  return (
    <Shell maxWidth="640px">
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '26px', fontWeight: 700, color: 'var(--black)' }}>Mon espace candidat</h1>
        <p style={{ fontSize: '14px', color: 'var(--gray)', marginTop: '6px' }}>Bonjour {user.prenom} {user.nom} — {user.email}</p>
      </div>
      <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--blue-deep)', marginBottom: '14px' }}>Mes candidatures</h2>
      {cands.length === 0 ? (
        <p style={{ fontSize: '14px', color: 'var(--gray)', marginBottom: '24px' }}>
          Aucune candidature pour le moment. <Link to="/candidature-spontanee" style={{ color: 'var(--blue-mid)', fontWeight: 600 }}>Déposer une candidature spontanée</Link>
        </p>
      ) : (
        <div style={{ marginBottom: '24px' }}>
          {cands.map((c) => {
            const [lbl, cls] = STATUTS[c.statut] || [c.statut, 'tag-blue'];
            return (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', border: '1px solid #E8EAF0', borderRadius: '12px', marginBottom: '10px' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--blue-deep)', fontSize: '14px' }}>Candidature spontanée — {c.domaine}</div>
                  <div style={{ fontSize: '12px', color: 'var(--gray)' }}>Envoyée le {dateFr(c.created_at)}</div>
                </div>
                <span className={`tag ${cls}`}>{lbl}</span>
              </div>
            );
          })}
        </div>
      )}
      <button className="btn-apply" style={{ width: '100%', padding: '13px' }} onClick={() => { logout(); navigate('/'); }}>Se déconnecter</button>
    </Shell>
  );
}

function useApiWithToken(token, setState, logout) {
  useEffect(() => {
    let alive = true;
    api('/auth/me', { token })
      .then((d) => alive && setState(d))
      .catch((e) => { if (alive && e.status === 401) logout(); });
    return () => { alive = false; };
  }, [token, setState, logout]);
}

export function MonComptePage() {
  const { user, token } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <AccountContent token={token} />;
}
