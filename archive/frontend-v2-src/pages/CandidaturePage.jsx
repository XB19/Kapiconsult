import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';
import { PageHead, Reveal } from '../components/ui';
import { Dropzone, Field, Flash, useFormSubmit } from '../components/forms';

const DOMAINES = ['Ressources Humaines', 'Finance & Comptabilité', 'Informatique & Technologie', 'Marketing & Communication',
  'Commerce & Vente', 'Juridique', 'Logistique & Supply Chain', 'Ingénierie & Technique', 'Administration', 'Autre'];

const Step = ({ n, title }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0 4px' }}>
    <span className="step-num" style={{ width: 34, height: 34, fontSize: 14, margin: 0, borderWidth: 1.5 }}>{n}</span>
    <b style={{ fontSize: 15, color: 'var(--ink)' }}>{title}</b>
  </div>
);

export default function CandidaturePage() {
  const { user, token } = useAuth();
  const { errors, flash, sending, onSubmit, formKey } = useFormSubmit(async (form) => {
    const res = await api('/candidatures', { method: 'POST', body: new FormData(form), token });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return res;
  });
  const inv = (k) => `input ${errors[k] ? 'invalid' : ''}`;

  return (
    <main>
      <PageHead image="/storage/kapi/banner_offres.jpg" tag="Carrière" title="Candidature Spontanée"
        sub="Rejoignez nos équipes même sans offre publiée. Nous gardons votre dossier en vue." crumbs={[{ label: 'Carrière' }, { label: 'Candidature spontanée' }]} />

      <section className="section bg-paper">
        <div className="container" style={{ maxWidth: 820 }}>
          <Flash {...flash} />
          {!user && (
            <Reveal className="alert alert-info">
              <span>ℹ️</span>
              <span>
                <b style={{ display: 'block' }}>Connexion recommandée</b>
                <span style={{ fontWeight: 500 }}>
                  <Link to="/login" className="link-underline" style={{ fontWeight: 700 }}>Connectez-vous</Link> ou{' '}
                  <Link to="/inscription" className="link-underline" style={{ fontWeight: 700 }}>créez un compte</Link> pour suivre le traitement de votre dossier.
                </span>
              </span>
            </Reveal>
          )}

          <Reveal className="form-card">
            <form key={formKey} onSubmit={onSubmit} className="form-grid" encType="multipart/form-data">
              <Step n="1" title="Vos coordonnées" />
              <div className="form-row">
                <Field label="Prénom" name="prenom" required error={errors.prenom}><input id="prenom" name="prenom" defaultValue={user?.prenom || ''} className={inv('prenom')} required /></Field>
                <Field label="Nom" name="nom" required error={errors.nom}><input id="nom" name="nom" defaultValue={user?.nom || ''} className={inv('nom')} required /></Field>
              </div>
              <div className="form-row">
                <Field label="Email" name="email" required error={errors.email}><input id="email" type="email" name="email" defaultValue={user?.email || ''} className={inv('email')} required /></Field>
                <Field label="Téléphone" name="telephone" required error={errors.telephone}><input id="telephone" name="telephone" defaultValue={user?.telephone || ''} className={inv('telephone')} required placeholder="+225 07 00 00 00 00" /></Field>
              </div>

              <Step n="2" title="Votre profil" />
              <div className="form-row">
                <Field label="Domaine de compétence" name="domaine" required error={errors.domaine}>
                  <select id="domaine" name="domaine" className={inv('domaine')} required defaultValue="">
                    <option value="">Choisir un domaine...</option>
                    {DOMAINES.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </Field>
                <Field label="Niveau d'expérience" name="experience" required error={errors.experience}>
                  <select id="experience" name="experience" className={inv('experience')} required defaultValue="">
                    <option value="">Choisir...</option>
                    <option value="junior">Junior (0 – 2 ans)</option>
                    <option value="confirme">Confirmé (2 – 5 ans)</option>
                    <option value="senior">Senior (5 – 10 ans)</option>
                    <option value="expert">Expert (10 ans+)</option>
                  </select>
                </Field>
              </div>
              <Field label="Message de motivation" name="message" required error={errors.message}>
                <textarea id="message" name="message" className={inv('message')} rows={5} required placeholder="Présentez-vous et expliquez pourquoi vous souhaitez rejoindre Kapi Consult..." />
              </Field>

              <Step n="3" title="Vos documents" />
              <div className="form-row">
                <Dropzone name="cv" label="CV (PDF, max 5 Mo)" accept=".pdf,.doc,.docx" required error={errors.cv} />
                <Dropzone name="lettre" label="Lettre de motivation (optionnel)" accept=".pdf,.doc,.docx" />
              </div>

              <button type="submit" className="btn btn-lg btn-block" disabled={sending} style={{ marginTop: 8 }}>
                {sending ? 'Envoi en cours…' : 'Envoyer ma candidature'} {!sending && <span className="arrow">→</span>}
              </button>
            </form>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
