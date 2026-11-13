import { Clock, Mail, MapPin, Phone, Send, Globe } from 'lucide-react';
import { api } from '../lib/api';
import { PageBanner, Reveal, Title } from '../components/ui';
import { Field, Flash, cls, useFormSubmit } from '../components/forms';
import { CONTACT, tel } from '../content/site';

const SUJETS = [['recrutement', 'Recrutement'], ['formation', 'Formation'], ['conseil & audit', 'Conseil & Audit'],
  ['partenariat', 'Partenariat'], ['ppp / infrastructure', 'PPP / Infrastructure'], ['autre', 'Autre']];

export default function ContactPage() {
  const { errors, flash, sending, onSubmit, formKey } = useFormSubmit((form) => api('/contact', { method: 'POST', body: Object.fromEntries(new FormData(form)) }));
  const c = (k) => cls(errors, k);

  return (
    <main>
      <PageBanner image="/storage/kapi/banner_contact.png" label="Nous contacter" title="Contactez-nous"
        sub="Notre équipe est à votre disposition pour répondre à toutes vos questions et vous accompagner dans vos projets." crumbs={[{ label: 'Contact' }]} />
      <section className="sec sec--bg">
        <div className="wrap split split--5-7 split--top">
          <Reveal>
            <Title text="Où nous trouver ?" hl="Où nous" className="t-lg" />
            <p className="over" style={{ margin: '6px 0 22px' }}>Nos coordonnées</p>
            <div className="contact-cards">
              <div className="contact-card"><span className="contact-card__ico"><MapPin size={21} /></span><div><h4>Adresse</h4>{CONTACT.adresse.map((l) => <div key={l}>{l}</div>)}</div></div>
              <div className="contact-card"><span className="contact-card__ico"><Phone size={21} /></span><div><h4>Téléphone</h4>{CONTACT.telephones.map((t) => <a key={t} href={tel(t)}>{t}</a>)}</div></div>
              <div className="contact-card"><span className="contact-card__ico"><Mail size={21} /></span><div><h4>Email</h4>{CONTACT.emails.map((m) => <a key={m} href={`mailto:${m}`}>{m}</a>)}</div></div>
              <div className="contact-card"><span className="contact-card__ico"><Clock size={21} /></span><div><h4>Horaires</h4>{CONTACT.horaires.map((h) => <div key={h}>{h}</div>)}</div></div>
              <div className="contact-card">
                <span className="contact-card__ico"><Globe size={21} /></span>
                <div>
                  <h4>Zones d'intervention</h4>
                  <div className="chips" style={{ marginTop: 8 }}>{CONTACT.zones.map((z) => <span key={z} className="chip">{z}</span>)}</div>
                  <p className="small muted" style={{ marginTop: 10 }}>Groupe OSEOR S.A. · Lomé, Togo</p>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={100} className="box">
            <Title text="Envoyez un message" hl="message" className="t-lg" />
            <p className="over" style={{ margin: '6px 0 24px' }}>Écrivez-nous</p>
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
              <div><button type="submit" className="btn btn--gold" disabled={sending}><Send size={17} />{sending ? 'Envoi en cours…' : 'Envoyer le message'}</button></div>
            </form>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
