import { useEffect, useState } from 'react';
import { ANNIV } from '../content/site';

const store = {
  get: (k) => { try { return sessionStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { sessionStorage.setItem(k, v); } catch { /* indisponible */ } },
};

// Bandeau fin et refermable
export function AnnivBanner() {
  const [hidden, setHidden] = useState(() => store.get('kapi_topbar') === '0');
  if (hidden) return null;
  return (
    <div className="topbar" role="note">
      <div className="topbar-inner">
        <span className="hide-sm" aria-hidden="true">⭐</span>
        <span className="badge">{ANNIV.badge}</span>
        <span>{ANNIV.banner[0]}<strong>{ANNIV.banner[1]}</strong><span className="hide-sm">{ANNIV.banner[2]}</span></span>
        <span className="hide-sm" aria-hidden="true">⭐</span>
      </div>
      <button className="topbar-close" aria-label="Masquer le bandeau" onClick={() => { store.set('kapi_topbar', '0'); setHidden(true); }}>×</button>
    </div>
  );
}

// Popup « 20 ans » : une seule fois par visite, fermeture automatique
export function AnnivPopup() {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(6);

  useEffect(() => {
    if (store.get('kapi_anniv') === '1') return undefined;
    const t = setTimeout(() => setOpen(true), 900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    store.set('kapi_anniv', '1');
    const iv = setInterval(() => setCount((c) => c - 1), 1000);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => { clearInterval(iv); window.removeEventListener('keydown', onKey); };
  }, [open]);

  useEffect(() => { if (count <= 0) setOpen(false); }, [count]);

  if (!open) return null;
  return (
    <div className="modal-bg" onClick={(e) => e.target === e.currentTarget && setOpen(false)} role="dialog" aria-modal="true" aria-label="20 ans d'excellence">
      <div className="modal anniv-card">
        <button className="modal-close" style={{ background: 'rgba(255,255,255,.12)', color: '#fff' }} onClick={() => setOpen(false)} aria-label="Fermer">×</button>
        <span className="badge">{ANNIV.popupTag}</span>
        <div className="anniv-ring" style={{ marginTop: 28 }}><b>20</b></div>
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '.28em', color: 'var(--gold-2)', marginBottom: 10 }}>{ANNIV.popupKicker}</div>
        <h2 className="h3" style={{ color: '#fff' }}>{ANNIV.popupTitle[0]}<br />{ANNIV.popupTitle[1]}</h2>
        <p style={{ color: 'rgba(255,255,255,.65)', fontSize: 14.5, marginTop: 12 }}>{ANNIV.popupText}</p>
        <div className="anniv-bar"><i /></div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)' }}>
          Fermeture automatique dans {count}s ·{' '}
          <button onClick={() => setOpen(false)} style={{ color: 'rgba(255,255,255,.75)', textDecoration: 'underline', fontSize: 12 }}>fermer maintenant</button>
        </div>
      </div>
    </div>
  );
}
