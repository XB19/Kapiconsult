import { useEffect, useState } from 'react';
import { Award, X } from 'lucide-react';
import { ANNIV } from '../content/site';

const session = {
  get: (k) => { try { return sessionStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { sessionStorage.setItem(k, v); } catch { /* indisponible */ } },
};

// Bandeau d'annonce sous l'en-tête (comme le fil d'actualité de Togo Invest)
export function Ticker() {
  return (
    <div className="ticker">
      <div className="wrap">
        <span className="ticker__badge"><Award size={14} />{ANNIV.badge}</span>
        <span className="ticker__text">{ANNIV.banner[0]}<strong>{ANNIV.banner[1]}</strong>{ANNIV.banner[2]}</span>
      </div>
    </div>
  );
}

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
      <div className="dialog dialog--brand">
        <button className="dialog__close" onClick={() => setOpen(false)} aria-label="Fermer"><X size={20} /></button>
        <span className="pill pill--gold">{ANNIV.popupTag}</span>
        <div className="anniv-num">20</div>
        <div className="over" style={{ letterSpacing: '.2em', marginBottom: 14 }}>{ANNIV.popupKicker}</div>
        <h2 style={{ fontSize: 22 }}>{ANNIV.popupTitle[0]}<br />{ANNIV.popupTitle[1]}</h2>
        <p style={{ marginTop: 10, fontSize: 14.5 }}>{ANNIV.popupText}</p>
        <div className="anniv-bar"><i /></div>
        <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,.6)' }}>
          Fermeture automatique dans {count}s ·{' '}
          <button className="u-link" style={{ fontSize: 12.5, color: 'rgba(255,255,255,.85)' }} onClick={() => setOpen(false)}>fermer maintenant</button>
        </div>
      </div>
    </div>
  );
}
