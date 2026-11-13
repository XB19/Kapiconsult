import { useState } from 'react';

// Champ de formulaire avec libellé, aide et erreur
export function Field({ label, name, required, error, hint, children }) {
  return (
    <div className="field">
      {label && <label htmlFor={name}>{label}{required && <span className="req"> *</span>}</label>}
      {children}
      {hint && !error && <span className="field-hint">{hint}</span>}
      {error && <span className="field-error" role="alert">{error}</span>}
    </div>
  );
}

// Zone de dépôt de fichier (glisser-déposer ou clic)
export function Dropzone({ name, label, accept, required, error }) {
  const [file, setFile] = useState(null);
  const [drag, setDrag] = useState(false);
  return (
    <Field label={label} name={name} required={required} error={error}>
      <div className={`dropzone ${drag ? 'drag' : ''} ${file ? 'has-file' : ''}`}
        onDragOver={() => setDrag(true)} onDragLeave={() => setDrag(false)} onDrop={() => setDrag(false)}>
        <input id={name} type="file" name={name} accept={accept} required={required}
          onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <div className="dz-ico">{file ? '✅' : '📎'}</div>
        <b>{file ? file.name : 'Glissez votre fichier ici ou cliquez pour parcourir'}</b>
        <small>{file ? `${(file.size / 1024 / 1024).toFixed(2)} Mo` : 'PDF, DOC ou DOCX — max 5 Mo'}</small>
      </div>
    </Field>
  );
}

export const Flash = ({ success, error }) => (
  <>
    {success && <div className="alert alert-success" role="status"><span>✓</span><span>{success}</span></div>}
    {error && <div className="alert alert-error" role="alert"><span>!</span><span>{error}</span></div>}
  </>
);

// Gestion standard d'un envoi de formulaire vers l'API
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
      form.reset();
      setFormKey((k) => k + 1);
      return res;
    } catch (err) {
      setErrors(err.errors || {});
      setFlash({ error: err.status === 422 ? 'Veuillez corriger les erreurs du formulaire.' : 'Une erreur est survenue, merci de réessayer.' });
      return null;
    } finally { setSending(false); }
  };
  return { errors, flash, sending, onSubmit, setFlash, formKey };
}
