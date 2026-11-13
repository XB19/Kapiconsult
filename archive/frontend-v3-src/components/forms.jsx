import { useState } from 'react';

export function Field({ label, name, required, error, hint, children }) {
  return (
    <div className="field">
      {label && <label htmlFor={name}>{label}{required && <span className="req"> *</span>}</label>}
      {children}
      {hint && !error && <span className="field__hint">{hint}</span>}
      {error && <span className="field__error" role="alert">{error}</span>}
    </div>
  );
}

// Sélecteur de fichier sobre, avec glisser-déposer
export function FileField({ name, label, accept, required, error }) {
  const [file, setFile] = useState(null);
  const [drag, setDrag] = useState(false);
  return (
    <Field label={label} name={name} required={required} error={error}>
      <div className={`file ${drag ? 'is-drag' : ''} ${file ? 'has-file' : ''}`} onDragOver={() => setDrag(true)} onDragLeave={() => setDrag(false)} onDrop={() => setDrag(false)}>
        <input id={name} type="file" name={name} accept={accept} required={required} onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <span className="file__btn">{file ? 'Remplacer' : 'Choisir un fichier'}</span>
        <span className="file__name">{file ? `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} Mo)` : 'ou glissez-le ici — PDF, DOC, DOCX'}</span>
      </div>
    </Field>
  );
}

export const Flash = ({ success, error }) => (
  <>
    {success && <div className="notice notice--ok" role="status">{success}</div>}
    {error && <div className="notice notice--err" role="alert">{error}</div>}
  </>
);

export function useFormSubmit(send) {
  const [errors, setErrors] = useState({});
  const [flash, setFlash] = useState({});
  const [sending, setSending] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setSending(true); setErrors({}); setFlash({});
    try {
      const res = await send(form);
      setFlash({ success: res?.message });
      setFormKey((k) => k + 1);
    } catch (err) {
      setErrors(err.errors || {});
      setFlash({ error: err.status === 422 ? 'Veuillez corriger les erreurs du formulaire.' : 'Une erreur est survenue, merci de réessayer.' });
    } finally { setSending(false); }
  };
  return { errors, flash, sending, onSubmit, formKey };
}

export const cls = (errors, k) => `input ${errors[k] ? 'is-invalid' : ''}`;
