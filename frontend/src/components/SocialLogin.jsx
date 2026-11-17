import { useEffect, useRef, useState } from 'react';
import { api } from '../lib/api';

// Boutons « Continuer avec Google » et « Continuer avec Apple » (compte iCloud).
// Les identifiants client viennent de l'API (/api/auth/providers) : un bouton n'apparaît
// que si son fournisseur est configuré côté serveur.

const scripts = {};
const loadScript = (src) => {
  scripts[src] ||= new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src; s.async = true;
    s.onload = resolve;
    s.onerror = () => { delete scripts[src]; reject(new Error(`Échec du chargement de ${src}`)); };
    document.head.appendChild(s);
  });
  return scripts[src];
};

let providersPromise;
const getProviders = () => {
  providersPromise ||= api('/auth/providers').catch(() => { providersPromise = null; return {}; });
  return providersPromise;
};

function GoogleButton({ clientId, mode, onCredential, onError }) {
  const ref = useRef(null);
  const cb = useRef(onCredential);
  cb.current = onCredential;
  useEffect(() => {
    let alive = true;
    loadScript('https://accounts.google.com/gsi/client').then(() => {
      if (!alive || !ref.current) return;
      const g = window.google.accounts.id;
      g.initialize({ client_id: clientId, callback: ({ credential }) => cb.current({ credential }), ux_mode: 'popup' });
      g.renderButton(ref.current, {
        theme: 'outline', size: 'large', shape: 'rectangular', logo_alignment: 'center', locale: 'fr',
        text: mode === 'register' ? 'signup_with' : 'continue_with',
        width: Math.min(400, Math.round(ref.current.offsetWidth) || 360),
      });
    }).catch(() => alive && onError('Google est momentanément inaccessible.'));
    return () => { alive = false; };
  }, [clientId, mode, onError]);
  return <div ref={ref} className="social__google" />;
}

const AppleLogo = () => (
  <svg width="17" height="17" viewBox="0 0 814 1000" aria-hidden="true" fill="currentColor">
    <path d="M788 341c-6 4-108 62-108 190 0 149 131 201 135 203-1 3-21 72-69 143-43 62-88 124-156 124s-86-40-164-40c-76 0-104 41-166 41s-106-57-156-127C46 793 0 667 0 547c0-193 125-295 249-295 66 0 121 43 162 43 39 0 101-46 176-46 29 0 131 3 201 92zM554 159c31-37 53-88 53-139 0-7-1-14-2-20-50 2-110 34-146 76-28 32-55 83-55 135 0 8 1 16 2 18 3 1 9 2 14 2 45 0 102-30 134-72z" />
  </svg>
);

function AppleButton({ config, mode, onCredential, onError, disabled }) {
  const ready = useRef(null);
  useEffect(() => {
    ready.current = loadScript('https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/fr_FR/appleid.auth.js')
      .then(() => window.AppleID.auth.init({ clientId: config.clientId, redirectURI: config.redirectURI, scope: 'name email', usePopup: true }));
    ready.current.catch(() => {});
  }, [config.clientId, config.redirectURI]);
  const click = async () => {
    try {
      await ready.current;
      const r = await window.AppleID.auth.signIn();
      onCredential({ credential: r.authorization.id_token, name: r.user?.name });
    } catch (e) {
      if (e?.error === 'popup_closed_by_user' || e?.error === 'user_cancelled_authorize') return;
      onError('La connexion avec Apple a échoué, merci de réessayer.');
    }
  };
  return (
    <button type="button" className="social__apple" onClick={click} disabled={disabled}>
      <AppleLogo />{mode === 'register' ? "S'inscrire avec Apple" : 'Continuer avec Apple'}
    </button>
  );
}

export function SocialLogin({ mode = 'login', onSuccess }) {
  const [providers, setProviders] = useState(null);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  useEffect(() => { let alive = true; getProviders().then((p) => alive && setProviders(p)); return () => { alive = false; }; }, []);

  const send = (provider) => async (body) => {
    setSending(true); setError('');
    try { onSuccess(await api(`/auth/${provider}`, { method: 'POST', body })); } catch (e) { setError(e.message); } finally { setSending(false); }
  };

  if (!providers || (!providers.google && !providers.apple)) return null;
  return (
    <div className="social">
      {error && <div className="alert alert--err" role="alert" style={{ marginBottom: 0 }}>{error}</div>}
      {providers.google && <GoogleButton clientId={providers.google} mode={mode} onCredential={send('google')} onError={setError} />}
      {providers.apple && <AppleButton config={providers.apple} mode={mode} onCredential={send('apple')} onError={setError} disabled={sending} />}
      <div className="social__sep"><span>ou avec votre adresse email</span></div>
    </div>
  );
}
