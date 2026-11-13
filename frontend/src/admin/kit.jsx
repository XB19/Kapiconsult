import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, ImagePlus, Loader2, Trash2, Upload, X, XCircle } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';

// ── Appels API authentifiés
export function useAdminApi() {
  const { token, logout } = useAuth();
  return useCallback(async (path, opts = {}) => {
    try {
      return await api(`/admin${path}`, { ...opts, token });
    } catch (e) {
      if (e.status === 401) logout();
      throw e;
    }
  }, [token, logout]);
}

// Chargement d'une liste avec rechargement
export function useAdminList(path) {
  const call = useAdminApi();
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const reload = useCallback(() => {
    setState((s) => ({ ...s, loading: true }));
    call(path).then((data) => setState({ data, loading: false, error: null })).catch((error) => setState({ data: null, loading: false, error }));
  }, [call, path]);
  useEffect(() => { reload(); }, [reload]);
  return { ...state, reload, setData: (fn) => setState((s) => ({ ...s, data: fn(s.data) })) };
}

// ── Notifications
const ToastCtx = createContext(() => {});
export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const push = useCallback((text, type = 'ok') => {
    const id = Math.random();
    setItems((l) => [...l, { id, text, type }]);
    setTimeout(() => setItems((l) => l.filter((t) => t.id !== id)), 3500);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className={`toast toast--${t.type}`}>{t.type === 'ok' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}{t.text}</div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
export const useToast = () => useContext(ToastCtx);

// ── Fenêtre de confirmation
export function Confirm({ title, text, confirmLabel = 'Supprimer', onConfirm, onCancel, busy }) {
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onCancel]);
  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onCancel()} role="alertdialog" aria-modal="true" aria-label={title}>
      <div className="dialog confirm">
        <div className="dialog__ico"><AlertTriangle size={30} /></div>
        <h2 style={{ fontSize: 20, marginBottom: 8 }}>{title}</h2>
        <p className="muted" style={{ marginBottom: 24 }}>{text}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button className="btn btn--outline" onClick={onCancel}>Annuler</button>
          <button className="btn" style={{ background: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={onConfirm} disabled={busy}>
            {busy ? <Loader2 size={16} className="spin" /> : <Trash2 size={16} />}{confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Panneau latéral (création / modification / lecture)
export function Drawer({ title, onClose, children, footer }) {
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = ''; };
  }, [onClose]);
  return (
    <div className="drawer-bg" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <aside className="drawer" role="dialog" aria-modal="true" aria-label={title}>
        <div className="drawer__head"><h2>{title}</h2><button className="icon-btn" onClick={onClose} aria-label="Fermer"><X size={18} /></button></div>
        <div className="drawer__body">{children}</div>
        {footer && <div className="drawer__foot">{footer}</div>}
      </aside>
    </div>
  );
}

// ── Champ image : envoi d'un fichier ou saisie d'un chemin existant
export function ImageField({ value, onChange }) {
  const call = useAdminApi();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('image', file);
    setBusy(true);
    try {
      const { url } = await call('/upload', { method: 'POST', body: fd });
      onChange(url);
      toast('Image envoyée');
    } catch (err) {
      toast(err.message || "Échec de l'envoi", 'err');
    } finally { setBusy(false); e.target.value = ''; }
  };
  return (
    <div className="img-field">
      <div className="img-field__preview">{value ? <img src={value} alt="" /> : <ImagePlus size={28} strokeWidth={1.5} />}</div>
      <div className="img-field__actions">
        <label className="btn btn--outline btn--sm upload-btn">
          {busy ? <Loader2 size={15} className="spin" /> : <Upload size={15} />}{busy ? 'Envoi…' : 'Choisir une image'}
          <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={upload} />
        </label>
        <input className="input" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="/storage/kapi/mon-image.jpg" aria-label="Chemin de l'image" />
        {value && <button type="button" className="link" style={{ color: 'var(--danger)', fontSize: 13 }} onClick={() => onChange('')}><X size={14} />Retirer l'image</button>}
      </div>
    </div>
  );
}

export const fmtDate = (v) => (v ? new Date(v).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—');
export const fmtDateTime = (v) => (v ? new Date(v).toLocaleString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—');
