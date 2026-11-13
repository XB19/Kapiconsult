import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';
import { FieldError, Flash } from '../components/FormBits';

const DOMAINES = ['Ressources Humaines', 'Finance & Comptabilité', 'Informatique & Technologie', 'Marketing & Communication',
  'Commerce & Vente', 'Juridique', 'Logistique & Supply Chain', 'Ingénierie & Technique', 'Administration', 'Autre'];
const label = { display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--black)', marginBottom: '6px' };

export default function CandidaturePage() {
  const { user, token } = useAuth();
  const [errors, setErrors] = useState({});
  const [flash, setFlash] = useState({});
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    setSending(true); setErrors({}); setFlash({});
    try {
      const res = await api('/candidatures', { method: 'POST', body: new FormData(formEl), token });
      setFlash({ success: res.message });
      formEl.reset();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setErrors(err.errors || {});
      setFlash({ error: err.status === 422 ? 'Veuillez corriger les erreurs du formulaire.' : 'Une erreur est survenue, merci de réessayer.' });
    } finally { setSending(false); }
  };

  return (
    <main>
      <section style={{ background: 'linear-gradient(135deg,var(--blue-deep) 0%,var(--blue-mid) 100%)', padding: '70px 0', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '42px', fontWeight: 700, color: 'var(--white)', marginBottom: '16px' }}>Candidature Spontanée</h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)' }}>Rejoignez nos équipes même sans offre publiée. Nous gardons votre dossier en vue.</p>
        </div>
      </section>

      <section style={{ padding: '70px 0' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <Flash {...flash} />
          {!user && (
            <div style={{ background: 'var(--blue-pale)', borderRadius: '14px', padding: '20px 24px', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontSize: '24px' }}>ℹ️</div>
              <div>
                <div style={{ fontSize: '14px', color: 'var(--blue-deep)', fontWeight: 600, marginBottom: '4px' }}>Connexion recommandée</div>
                <div style={{ fontSize: '13px', color: 'var(--gray)' }}>
                  <Link to="/login" style={{ color: 'var(--blue-mid)', fontWeight: 600 }}>Connectez-vous</Link> ou{' '}
                  <Link to="/inscription" style={{ color: 'var(--blue-mid)', fontWeight: 600 }}>créez un compte</Link> pour suivre le traitement de votre dossier.
                </div>
              </div>
            </div>
          )}

          <div style={{ background: 'var(--white)', border: '1px solid #E8EAF0', borderRadius: '20px', padding: '36px' }}>
            <form onSubmit={submit} encType="multipart/form-data">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={label}>Prénom *</label>
                  <input type="text" name="prenom" defaultValue={user?.prenom || ''} className="form-control" required />
                  <FieldError errors={errors} name="prenom" />
                </div>
                <div>
                  <label style={label}>Nom *</label>
                  <input type="text" name="nom" defaultValue={user?.nom || ''} className="form-control" required />
                  <FieldError errors={errors} name="nom" />
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={label}>Email *</label>
                <input type="email" name="email" defaultValue={user?.email || ''} className="form-control" required />
                <FieldError errors={errors} name="email" />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={label}>Téléphone *</label>
                <input type="text" name="telephone" defaultValue={user?.telephone || ''} className="form-control" required placeholder="+225 07 00 00 00 00" />
                <FieldError errors={errors} name="telephone" />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={label}>Domaine de compétence *</label>
                <select name="domaine" className="form-control" required defaultValue="">
                  <option value="">Choisir un domaine...</option>
                  {DOMAINES.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <FieldError errors={errors} name="domaine" />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={label}>Niveau d'expérience *</label>
                <select name="experience" className="form-control" required defaultValue="">
                  <option value="">Choisir...</option>
                  <option value="junior">Junior (0 – 2 ans)</option>
                  <option value="confirme">Confirmé (2 – 5 ans)</option>
                  <option value="senior">Senior (5 – 10 ans)</option>
                  <option value="expert">Expert (10 ans+)</option>
                </select>
                <FieldError errors={errors} name="experience" />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={label}>Message de motivation *</label>
                <textarea name="message" className="form-control" rows={5} required placeholder="Présentez-vous et expliquez pourquoi vous souhaitez rejoindre Kapi Consult..." />
                <FieldError errors={errors} name="message" />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={label}>CV (PDF, max 5 Mo) *</label>
                <input type="file" name="cv" className="form-control" accept=".pdf,.doc,.docx" required />
                <FieldError errors={errors} name="cv" />
              </div>
              <div style={{ marginBottom: '28px' }}>
                <label style={label}>Lettre de motivation (optionnel)</label>
                <input type="file" name="lettre" className="form-control" accept=".pdf,.doc,.docx" />
              </div>
              <button type="submit" className="btn-primary" disabled={sending} style={{ width: '100%', padding: '16px', fontSize: '15px' }}>
                {sending ? 'Envoi en cours…' : 'Envoyer ma candidature'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
