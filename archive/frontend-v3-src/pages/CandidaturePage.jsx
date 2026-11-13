import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';
import { PageHead } from '../components/ui';
import { Field, FileField, Flash, cls, useFormSubmit } from '../components/forms';

const DOMAINES = ['Ressources Humaines', 'Finance & Comptabilité', 'Informatique & Technologie', 'Marketing & Communication',
  'Commerce & Vente', 'Juridique', 'Logistique & Supply Chain', 'Ingénierie & Technique', 'Administration', 'Autre'];

export default function CandidaturePage() {
  const { user, token } = useAuth();
  const { errors, flash, sending, onSubmit, formKey } = useFormSubmit(async (form) => {
    const res = await api('/candidatures', { method: 'POST', body: new FormData(form), token });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return res;
  });
  const c = (k) => cls(errors, k);

  return (
    <main>
      <PageHead image="/storage/kapi/banner_offres.jpg" label="Carrière" title="Candidature Spontanée"
        sub="Rejoignez nos équipes même sans offre publiée. Nous gardons votre dossier en vue." crumbs={[{ label: 'Carrière' }, { label: 'Candidature spontanée' }]} />

      <section className="sec sec--stone">
        <div className="wrap" style={{ maxWidth: 860 }}>
          <Flash {...flash} />
          {!user && (
            <div className="notice">
              <b style={{ color: 'var(--ink)' }}>Connexion recommandée.</b>{' '}
              <Link to="/login" className="u-link">Connectez-vous</Link> ou <Link to="/inscription" className="u-link">créez un compte</Link> pour suivre le traitement de votre dossier.
            </div>
          )}
          <div className="panel">
            <form key={formKey} onSubmit={onSubmit} className="form" encType="multipart/form-data">
              <div className="form__section"><span>01</span>Vos coordonnées</div>
              <div className="form__row">
                <Field label="Prénom" name="prenom" required error={errors.prenom}><input id="prenom" name="prenom" defaultValue={user?.prenom || ''} className={c('prenom')} required /></Field>
                <Field label="Nom" name="nom" required error={errors.nom}><input id="nom" name="nom" defaultValue={user?.nom || ''} className={c('nom')} required /></Field>
              </div>
              <div className="form__row">
                <Field label="Email" name="email" required error={errors.email}><input id="email" type="email" name="email" defaultValue={user?.email || ''} className={c('email')} required /></Field>
                <Field label="Téléphone" name="telephone" required error={errors.telephone}><input id="telephone" name="telephone" defaultValue={user?.telephone || ''} className={c('telephone')} required placeholder="+225 07 00 00 00 00" /></Field>
              </div>

              <div className="form__section"><span>02</span>Votre profil</div>
              <div className="form__row">
                <Field label="Domaine de compétence" name="domaine" required error={errors.domaine}>
                  <select id="domaine" name="domaine" className={c('domaine')} required defaultValue="">
                    <option value="">Choisir un domaine...</option>
                    {DOMAINES.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </Field>
                <Field label="Niveau d'expérience" name="experience" required error={errors.experience}>
                  <select id="experience" name="experience" className={c('experience')} required defaultValue="">
                    <option value="">Choisir...</option>
                    <option value="junior">Junior (0 – 2 ans)</option>
                    <option value="confirme">Confirmé (2 – 5 ans)</option>
                    <option value="senior">Senior (5 – 10 ans)</option>
                    <option value="expert">Expert (10 ans+)</option>
                  </select>
                </Field>
              </div>
              <Field label="Message de motivation" name="message" required error={errors.message}>
                <textarea id="message" name="message" className={c('message')} rows={6} required placeholder="Présentez-vous et expliquez pourquoi vous souhaitez rejoindre Kapi Consult..." />
              </Field>

              <div className="form__section"><span>03</span>Vos documents</div>
              <FileField name="cv" label="CV (PDF, max 5 Mo)" accept=".pdf,.doc,.docx" required error={errors.cv} />
              <FileField name="lettre" label="Lettre de motivation (optionnel)" accept=".pdf,.doc,.docx" />

              <div style={{ paddingTop: 8 }}><button type="submit" className="btn" disabled={sending}>{sending ? 'Envoi en cours…' : 'Envoyer ma candidature'}</button></div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
