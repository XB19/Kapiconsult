import { api } from '../lib/api';
import { PageHead, Reveal } from '../components/ui';
import { Field, Flash, useFormSubmit } from '../components/forms';
import { CONTACT, tel } from '../content/site';

const SUJETS = [['recrutement', 'Recrutement'], ['formation', 'Formation'], ['conseil & audit', 'Conseil & Audit'],
  ['partenariat', 'Partenariat'], ['ppp / infrastructure', 'PPP / Infrastructure'], ['autre', 'Autre']];

export default function ContactPage() {
  const { errors, flash, sending, onSubmit, formKey } = useFormSubmit((form) => api('/contact', { method: 'POST', body: Object.fromEntries(new FormData(form)) }));
  const inv = (k) => `input ${errors[k] ? 'invalid' : ''}`;

  return (
    <main>
      <PageHead image="/storage/kapi/banner_contact.png" tag="Nous contacter" title="Contactez-nous"
        sub="Notre équipe est à votre disposition pour répondre à toutes vos questions et vous accompagner dans vos projets." crumbs={[{ label: 'Contact' }]} />

      <section className="section">
        <div className="container split split-60" style={{ alignItems: 'start', gridTemplateColumns: '.9fr 1.1fr' }}>
          <div>
            <Reveal><span className="eyebrow">Nos coordonnées</span><h2 className="h2" style={{ margin: '14px 0 32px' }}>Où nous trouver ?</h2></Reveal>
            <div style={{ display: 'grid', gap: 14 }}>
              <Reveal className="info-row"><div className="info-ico">📍</div><div><h4>Adresse</h4>{CONTACT.adresse.map((l) => <div key={l}>{l}</div>)}</div></Reveal>
              <Reveal delay={80} className="info-row"><div className="info-ico">📞</div><div><h4>Téléphone</h4>{CONTACT.telephones.map((t) => <a key={t} href={tel(t)}>{t}</a>)}</div></Reveal>
              <Reveal delay={160} className="info-row"><div className="info-ico">✉️</div><div><h4>Email</h4>{CONTACT.emails.map((m) => <a key={m} href={`mailto:${m}`}>{m}</a>)}</div></Reveal>
              <Reveal delay={240} className="info-row"><div className="info-ico">⏰</div><div><h4>Horaires</h4>{CONTACT.horaires.map((h) => <div key={h}>{h}</div>)}</div></Reveal>
            </div>
            <Reveal className="value-card" style={{ marginTop: 20, background: 'var(--brand-soft)', borderColor: 'transparent' }}>
              <span className="eyebrow">Zones d'intervention</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '16px 0 12px' }}>
                {CONTACT.zones.map((z) => <span key={z} className="chip">{z}</span>)}
              </div>
              <p style={{ fontSize: 13 }}>Groupe OSEOR S.A. · Lomé, Togo</p>
            </Reveal>
          </div>

          <Reveal variant="from-right" className="form-card" style={{ position: 'sticky', top: 'calc(var(--header-h) + 24px)' }}>
            <span className="eyebrow">Écrivez-nous</span>
            <h2 className="h3" style={{ margin: '12px 0 28px', fontSize: 34 }}>Envoyez un message</h2>
            <Flash {...flash} />
            <form key={formKey} onSubmit={onSubmit} className="form-grid" noValidate={false}>
              <div className="form-row">
                <Field label="Prénom" name="prenom" required error={errors.prenom}><input id="prenom" name="prenom" className={inv('prenom')} required autoComplete="given-name" /></Field>
                <Field label="Nom" name="nom" required error={errors.nom}><input id="nom" name="nom" className={inv('nom')} required autoComplete="family-name" /></Field>
              </div>
              <div className="form-row">
                <Field label="Email" name="email" required error={errors.email}><input id="email" type="email" name="email" className={inv('email')} required autoComplete="email" /></Field>
                <Field label="Téléphone" name="telephone"><input id="telephone" name="telephone" className="input" placeholder="+228 XX XX XX XX" autoComplete="tel" /></Field>
              </div>
              <Field label="Sujet" name="sujet" required error={errors.sujet}>
                <select id="sujet" name="sujet" className={inv('sujet')} required defaultValue="">
                  <option value="">Choisir un sujet...</option>
                  {SUJETS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </Field>
              <Field label="Message" name="message" required error={errors.message}>
                <textarea id="message" name="message" className={inv('message')} rows={5} required placeholder="Décrivez votre demande..." />
              </Field>
              <button type="submit" className="btn btn-gold btn-lg btn-block" disabled={sending}>
                {sending ? 'Envoi en cours…' : 'Envoyer le message'} {!sending && <span className="arrow">→</span>}
              </button>
            </form>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
