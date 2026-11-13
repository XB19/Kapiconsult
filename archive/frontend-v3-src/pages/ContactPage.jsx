import { api } from '../lib/api';
import { PageHead, Reveal } from '../components/ui';
import { Field, Flash, cls, useFormSubmit } from '../components/forms';
import { CONTACT, tel } from '../content/site';

const SUJETS = [['recrutement', 'Recrutement'], ['formation', 'Formation'], ['conseil & audit', 'Conseil & Audit'],
  ['partenariat', 'Partenariat'], ['ppp / infrastructure', 'PPP / Infrastructure'], ['autre', 'Autre']];

export default function ContactPage() {
  const { errors, flash, sending, onSubmit, formKey } = useFormSubmit((form) => api('/contact', { method: 'POST', body: Object.fromEntries(new FormData(form)) }));
  const c = (k) => cls(errors, k);

  return (
    <main>
      <PageHead image="/storage/kapi/banner_contact.png" label="Nous contacter" title="Contactez-nous"
        sub="Notre équipe est à votre disposition pour répondre à toutes vos questions et vous accompagner dans vos projets." crumbs={[{ label: 'Contact' }]} />

      <section className="sec">
        <div className="wrap cols cols-5-7 align-start">
          <Reveal>
            <span className="kicker" style={{ marginBottom: 14 }}>Nos coordonnées</span>
            <h2 className="t-2" style={{ marginBottom: 28 }}>Où nous trouver ?</h2>
            <div className="contact-list">
              <div className="contact-item"><h4>Adresse</h4><div>{CONTACT.adresse.map((l) => <div key={l}>{l}</div>)}</div></div>
              <div className="contact-item"><h4>Téléphone</h4><div>{CONTACT.telephones.map((t) => <div key={t}><a href={tel(t)}>{t}</a></div>)}</div></div>
              <div className="contact-item"><h4>Email</h4><div>{CONTACT.emails.map((m) => <div key={m}><a href={`mailto:${m}`}>{m}</a></div>)}</div></div>
              <div className="contact-item"><h4>Horaires</h4><div>{CONTACT.horaires.map((h) => <div key={h}>{h}</div>)}</div></div>
              <div className="contact-item">
                <h4>Zones d'intervention</h4>
                <div>
                  <div className="tags">{CONTACT.zones.map((z) => <span key={z} className="tag">{z}</span>)}</div>
                  <p className="small muted" style={{ marginTop: 10 }}>Groupe OSEOR S.A. · Lomé, Togo</p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal className="panel" delay={100} style={{ borderTop: '3px solid var(--navy)' }}>
            <span className="kicker" style={{ marginBottom: 12 }}>Écrivez-nous</span>
            <h2 className="t-2" style={{ marginBottom: 28 }}>Envoyez un message</h2>
            <Flash {...flash} />
            <form key={formKey} onSubmit={onSubmit} className="form">
              <div className="form__row">
                <Field label="Prénom" name="prenom" required error={errors.prenom}><input id="prenom" name="prenom" className={c('prenom')} required autoComplete="given-name" /></Field>
                <Field label="Nom" name="nom" required error={errors.nom}><input id="nom" name="nom" className={c('nom')} required autoComplete="family-name" /></Field>
              </div>
              <div className="form__row">
                <Field label="Email" name="email" required error={errors.email}><input id="email" type="email" name="email" className={c('email')} required autoComplete="email" /></Field>
                <Field label="Téléphone" name="telephone"><input id="telephone" name="telephone" className="input" placeholder="+228 XX XX XX XX" autoComplete="tel" /></Field>
              </div>
              <Field label="Sujet" name="sujet" required error={errors.sujet}>
                <select id="sujet" name="sujet" className={c('sujet')} required defaultValue="">
                  <option value="">Choisir un sujet...</option>
                  {SUJETS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </Field>
              <Field label="Message" name="message" required error={errors.message}>
                <textarea id="message" name="message" className={c('message')} rows={6} required placeholder="Décrivez votre demande..." />
              </Field>
              <div><button type="submit" className="btn" disabled={sending}>{sending ? 'Envoi en cours…' : 'Envoyer le message'}</button></div>
            </form>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
