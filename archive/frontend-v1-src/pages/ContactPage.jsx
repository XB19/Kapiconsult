import { useState } from 'react';
import { api } from '../lib/api';
import { PageHero } from '../components/Heroes';
import { FieldError, Flash } from '../components/FormBits';

const INFOS = [
  ['📍', 'Adresse', ['Boulevard Faure GNASSINGBE', 'Immeuble D&D, Agoè BKS', 'Lomé, Togo', '08 B.P. 85 35 Lomé-Togo']],
  ['📞', 'Téléphone', ['+228 22 51 89 69', '+228 93 17 01 01']],
  ['✉️', 'Email', ['info@kapiconsult.tg', 'infokapi@kapiconsult.tg', 'info@kapiconsult.com', 'infokapi@kapiconsult.com']],
  ['⏰', 'Horaires', ['Lundi – Vendredi : 8h – 17h30', 'Samedi : 8h – 12h']],
];
const ZONES = ['Togo', 'Bénin', 'Burkina Faso', 'Niger', "Côte d'Ivoire", 'Guinée Bissau', 'Tchad', 'RDC'];
const SUJETS = [['recrutement', 'Recrutement'], ['formation', 'Formation'], ['conseil & audit', 'Conseil & Audit'],
  ['partenariat', 'Partenariat'], ['ppp / infrastructure', 'PPP / Infrastructure'], ['autre', 'Autre']];

export default function ContactPage() {
  const [errors, setErrors] = useState({});
  const [flash, setFlash] = useState({});
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    setSending(true); setErrors({}); setFlash({});
    try {
      const res = await api('/contact', { method: 'POST', body: Object.fromEntries(new FormData(formEl)) });
      setFlash({ success: res.message });
      formEl.reset();
    } catch (err) {
      setErrors(err.errors || {});
      setFlash({ error: err.status === 422 ? 'Veuillez corriger les erreurs du formulaire.' : "Une erreur est survenue, merci de réessayer." });
    } finally { setSending(false); }
  };

  return (
    <main>
      <PageHero image="/storage/kapi/banner_contact.png" tag="Nous contacter" title="Contactez-nous"
        sub="Notre équipe est à votre disposition pour répondre à toutes vos questions et vous accompagner dans vos projets." />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '64px 36px' }}>
        <div className="g-mob" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '56px' }}>
          <div>
            <span className="section-tag">Nos coordonnées</span>
            <h2 className="section-title" style={{ marginBottom: '28px' }}>Où nous trouver ?</h2>
            {INFOS.map(([icon, label, lines]) => (
              <div key={label} style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                <div style={{ width: '46px', height: '46px', background: 'var(--blue-pale)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>{icon}</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--blue-deep)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '.06em' }}>{label}</div>
                  {lines.map((l) => <div key={l} style={{ fontSize: '14px', color: 'var(--gray)', lineHeight: 1.6 }}>{l}</div>)}
                </div>
              </div>
            ))}
            <div style={{ background: 'var(--blue-pale)', borderRadius: '16px', padding: '22px', marginTop: '28px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--blue-deep)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '12px' }}>Zones d'intervention</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {ZONES.map((z) => <span key={z} style={{ padding: '4px 12px', background: 'var(--white)', borderRadius: '20px', fontSize: '13px', fontWeight: 600, color: 'var(--blue-deep)' }}>{z}</span>)}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--gray)', marginTop: '10px' }}>Groupe OSEOR S.A. · Lomé, Togo</div>
            </div>
          </div>

          <div>
            <span className="section-tag">Écrivez-nous</span>
            <h2 className="section-title" style={{ marginBottom: '28px' }}>Envoyez un message</h2>
            <Flash {...flash} />
            <form onSubmit={submit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Prénom *</label>
                  <input type="text" name="prenom" className="form-control" required />
                  <FieldError errors={errors} name="prenom" />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Nom *</label>
                  <input type="text" name="nom" className="form-control" required />
                  <FieldError errors={errors} name="nom" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input type="email" name="email" className="form-control" required />
                <FieldError errors={errors} name="email" />
              </div>
              <div className="form-group">
                <label className="form-label">Téléphone</label>
                <input type="text" name="telephone" className="form-control" placeholder="+228 XX XX XX XX" />
              </div>
              <div className="form-group">
                <label className="form-label">Sujet *</label>
                <select name="sujet" className="form-control" required defaultValue="">
                  <option value="">Choisir un sujet...</option>
                  {SUJETS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
                <FieldError errors={errors} name="sujet" />
              </div>
              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea name="message" className="form-control" rows={5} required placeholder="Décrivez votre demande..." />
                <FieldError errors={errors} name="message" />
              </div>
              <button type="submit" className="btn btn-gold" disabled={sending} style={{ width: '100%', padding: '15px', fontSize: '15px' }}>
                {sending ? 'Envoi en cours…' : 'Envoyer le message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
