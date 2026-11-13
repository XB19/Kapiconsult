import { useEffect, useState } from 'react';
import { ANNIV } from '../content/site';

const session = {
  get: (k) => { try { return sessionStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { sessionStorage.setItem(k, v); } catch { /* indisponible */ } },
};

// Fenêtre « 20 ans » : une seule fois par visite, fermeture automatique
export function AnnivPopup() {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(6);

  useEffect(() => {
    if (session.get('kapi_anniv') === '1') return undefined;
    const t = setTimeout(() => setOpen(true), 800);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (!open) return undefined;
    session.set('kapi_anniv', '1');
    const iv = setInterval(() => setCount((c) => c - 1), 1000);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => { clearInterval(iv); window.removeEventListener('keydown', onKey); };
  }, [open]);
  useEffect(() => { if (count <= 0) setOpen(false); }, [count]);

  if (!open) return null;
  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && setOpen(false)} role="dialog" aria-modal="true" aria-label="20 ans d'excellence">
      <div className="dialog dialog--navy">
        <button className="dialog__close" onClick={() => setOpen(false)} aria-label="Fermer">×</button>
        <span className="kicker kicker--light">{ANNIV.popupTag}</span>
        <div className="anniv-num">20</div>
        <div className="kicker kicker--light" style={{ letterSpacing: '.24em', marginBottom: 18 }}>{ANNIV.popupKicker}</div>
        <h2 className="t-3" style={{ fontSize: 24 }}>{ANNIV.popupTitle[0]}<br />{ANNIV.popupTitle[1]}</h2>
        <p style={{ marginTop: 12, fontSize: 15 }}>{ANNIV.popupText}</p>
        <div className="anniv-bar"><i /></div>
        <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,.55)' }}>
          Fermeture automatique dans {count}s ·{' '}
          <button onClick={() => setOpen(false)} className="u-link" style={{ fontSize: 12.5, color: 'rgba(255,255,255,.8)' }}>fermer maintenant</button>
        </div>
      </div>
    </div>
  );
}
