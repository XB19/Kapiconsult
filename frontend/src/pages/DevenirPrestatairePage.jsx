import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertTriangle, BadgeCheck, Clock3, Eye, FileText, IdCard, ImagePlus, Loader2, LocateFixed, Lock, MapPin, Save, ShieldCheck, Trash2, X,
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';
import { PageBanner } from '../components/ui';
import { Field, Flash, cls } from '../components/forms';
import { ANNUAIRE, METIERS, PAYS, RAYONS, VILLES } from '../content/prestataires';

const STATUTS = {
  en_attente: ['En attente de vérification', 'pill--soft', 'Notre équipe vérifie votre pièce d’identité et votre profil. Il apparaîtra dans l’annuaire dès sa validation.'],
  valide: ['Profil en ligne', 'pill--ok', 'Votre profil est visible par les clients dans l’annuaire.'],
  refuse: ['Profil non validé', 'pill--ko', 'Votre profil n’a pas été validé. Corrigez-le puis enregistrez-le pour le soumettre à nouveau.'],
  suspendu: ['Profil suspendu', 'pill--ko', 'Votre profil est temporairement masqué. Contactez Kapi Consult pour plus d’informations.'],
};
// Choix d'une face de la CNI, avec aperçu (image) ou nom du fichier (PDF)
function CniPicker({ name, label, sent, error, onPick }) {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState(null);
  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);
  const pick = (e) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setUrl(f && f.type.startsWith('image/') ? URL.createObjectURL(f) : null);
    onPick?.(!!f);
  };
  return (
    <div className={`cni-pick ${error ? 'is-invalid' : ''} ${file || sent ? 'has-file' : ''}`}>
      <span className="cni-pick__prev">
        {url ? <img src={url} alt="" /> : file ? <FileText size={30} /> : sent ? <ShieldCheck size={30} /> : <IdCard size={30} />}
      </span>
      <div className="cni-pick__body">
        <b>{label}<span className="req"> *</span></b>
        <small>{file ? file.name : sent ? 'Déjà transmis. Choisissez un fichier pour le remplacer.' : 'Photo nette et lisible : JPG, PNG, WEBP ou PDF, 6 Mo max.'}</small>
        <label className="btn btn--outline btn--sm" style={{ cursor: 'pointer' }}>
          <ImagePlus size={15} />{file || sent ? 'Changer' : 'Choisir un fichier'}
          <input type="file" name={name} accept="image/png,image/jpeg,image/webp,application/pdf" hidden onChange={pick} />
        </label>
      </div>
      {error && <span className="field__error" role="alert">{error}</span>}
    </div>
  );
}

export default function DevenirPrestatairePage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [state, setState] = useState({ loading: !!token, profil: null });
  const [errors, setErrors] = useState({});
  const [flash, setFlash] = useState({});
  const [sending, setSending] = useState(false);
  const [pos, setPos] = useState({ lat: '', lng: '', loading: false, error: '' });
  const [preview, setPreview] = useState(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [cniChange, setCniChange] = useState(false);

  useEffect(() => {
    if (!token) return undefined;
    let alive = true;
    api('/mon-profil-prestataire', { token }).then(({ profil }) => {
      if (!alive) return;
      setState({ loading: false, profil });
      if (profil?.latitude != null) setPos((s) => ({ ...s, lat: String(profil.latitude), lng: String(profil.longitude) }));
    }).catch(() => alive && setState({ loading: false, profil: null }));
    return () => { alive = false; };
  }, [token]);

  const locate = () => {
    if (!navigator.geolocation) { setPos((s) => ({ ...s, error: 'La localisation n’est pas disponible sur cet appareil.' })); return; }
    setPos((s) => ({ ...s, loading: true, error: '' }));
    navigator.geolocation.getCurrentPosition(
      (p) => setPos({ lat: p.coords.latitude.toFixed(5), lng: p.coords.longitude.toFixed(5), loading: false, error: '' }),
      () => setPos((s) => ({ ...s, loading: false, error: 'Position non obtenue. Autorisez la localisation dans votre navigateur.' })),
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set('latitude', pos.lat); fd.set('longitude', pos.lng);
    fd.set('deplacement', fd.get('deplacement') ? 'true' : 'false');
    if (removePhoto) fd.set('retirer_photo', '1');
    if (!fd.get('photo')?.size) fd.delete('photo');
    for (const k of ['cni_recto', 'cni_verso']) if (!fd.get(k)?.size) fd.delete(k);
    setSending(true); setErrors({}); setFlash({});
    try {
      const res = await api('/mon-profil-prestataire', { method: 'POST', body: fd, token });
      setState({ loading: false, profil: res.profil });
      setFlash({ success: res.message });
      setRemovePhoto(false);
      setCniChange(false);
    } catch (err) {
      setErrors(err.errors || {});
      setFlash({ error: err.status === 422 ? 'Veuillez corriger les champs indiqués.' : 'Une erreur est survenue, merci de réessayer.' });
    } finally {
      setSending(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const remove = async () => {
    try { await api('/mon-profil-prestataire', { method: 'DELETE', token }); navigate('/prestataires'); } catch { setFlash({ error: 'Suppression impossible, merci de réessayer.' }); }
  };

  const p = state.profil || {};
  const st = state.profil && STATUTS[p.statut];
  const c = (k) => cls(errors, k);
  const photo = preview || (!removePhoto && p.photo);

  return (
    <main>
      <PageBanner image="/storage/kapi/domaine_industrie.jpg" label="Espace professionnel" title={state.profil ? 'Mon profil prestataire' : 'Inscrire mon activité'}
        sub={ANNUAIRE.ctaText} crumbs={[{ label: 'Quotidien', to: '/prestataires' }, { label: state.profil ? 'Mon profil' : 'Inscription' }]} />
      <section className="sec sec--bg">
        <div className="wrap" style={{ maxWidth: 940 }}>
          {user && state.loading && <div className="skeleton" style={{ height: 400 }} />}
          {user && !state.loading && (
            <>
              <Flash {...flash} />
              {st && (
                <div className="box pro-status">
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <span className={`pill ${st[1]}`}>{st[0]}</span>
                    <p className="muted small" style={{ marginTop: 8 }}>{st[2]}</p>
                    {p.motif_refus && (p.statut === 'refuse' || p.statut === 'suspendu') && (
                      <p className="pro-status__motif"><AlertTriangle size={15} /><span><b>Motif :</b> {p.motif_refus}</span></p>
                    )}
                    <div className="pro-status__stats">
                      <span><Eye size={15} />{p.vues} vue{p.vues > 1 ? 's' : ''} du profil</span>
                      <span><BadgeCheck size={15} />{p.nb_avis} avis{p.note ? ` · ${Number(p.note).toFixed(1)}/5` : ''}</span>
                      <span><IdCard size={15} />{p.identite_verifiee_le ? 'Identité vérifiée' : p.cni_recto_ok && p.cni_verso_ok ? 'CNI transmise, vérification en cours' : 'CNI à transmettre'}</span>
                    </div>
                  </div>
                  <Link to={`/prestataires/${p.id}`} className="btn btn--outline btn--sm"><Eye size={15} />Voir ma fiche</Link>
                </div>
              )}

              <div className="box">
                <form className="form" onSubmit={submit} encType="multipart/form-data" key={p.id || 'nouveau'}>
                  <div className="form__step"><span>1</span>Votre activité</div>
                  <div className="form__row">
                    <Field label="Nom affiché" name="nom_affiche" required error={errors.nom_affiche} hint="Votre nom ou celui de votre atelier / entreprise">
                      <input id="nom_affiche" name="nom_affiche" className={c('nom_affiche')} required maxLength={160}
                        defaultValue={p.nom_affiche || `${user.prenom || ''} ${user.nom || ''}`.trim()} />
                    </Field>
                    <Field label="Métier principal" name="metier" required error={errors.metier}>
                      <select id="metier" name="metier" className={c('metier')} required defaultValue={p.metier || ''}>
                        <option value="">Choisir un métier…</option>
                        {METIERS.map((m) => <option key={m.label} value={m.label}>{m.label}</option>)}
                      </select>
                    </Field>
                  </div>
                  <div className="form__row">
                    <Field label="Spécialités" name="specialites" hint="Séparées par des virgules (ex. vidange, diagnostic électronique, freinage)">
                      <input id="specialites" name="specialites" className="input" maxLength={600} defaultValue={(p.specialites || []).join(', ')} />
                    </Field>
                    <Field label="Années d'expérience" name="experience">
                      <input id="experience" name="experience" type="number" min={0} max={60} className="input" defaultValue={p.experience ?? ''} placeholder="Ex. 8" />
                    </Field>
                  </div>
                  <Field label="Présentation de votre activité" name="description" required error={errors.description} hint="Décrivez vos services, votre savoir-faire et ce qui vous distingue.">
                    <textarea id="description" name="description" rows={6} className={c('description')} required maxLength={3000} defaultValue={p.description || ''}
                      placeholder="Ex. Mécanicien automobile depuis 10 ans, je m'occupe de l'entretien et de la réparation toutes marques…" />
                  </Field>

                  <div className="form__step"><span>2</span>Votre localisation</div>
                  <div className="form__row">
                    <Field label="Pays" name="pays" required>
                      <select id="pays" name="pays" className="input" defaultValue={p.pays || 'Togo'}>{PAYS.map((x) => <option key={x}>{x}</option>)}</select>
                    </Field>
                    <Field label="Ville" name="ville" required error={errors.ville}>
                      <input id="ville" name="ville" className={c('ville')} required list="villes-pro" maxLength={80} defaultValue={p.ville || ''} placeholder="Ex. Lomé" />
                      <datalist id="villes-pro">{VILLES.map((v) => <option key={v} value={v} />)}</datalist>
                    </Field>
                  </div>
                  <div className="form__row">
                    <Field label="Quartier" name="quartier" hint="Aide les clients proches à vous trouver">
                      <input id="quartier" name="quartier" className="input" maxLength={120} defaultValue={p.quartier || ''} placeholder="Ex. Agoè, Bè, Tokoin…" />
                    </Field>
                    <Field label="Position exacte (recommandée)" name="position" hint={pos.error || (pos.lat ? 'Utilisée pour calculer la distance avec les clients.' : 'Placez-vous à votre atelier puis cliquez.')}>
                      <div className="locate-field">
                        {pos.lat
                          ? <span className="locate-field__ok"><MapPin size={16} />Position enregistrée<button type="button" onClick={() => setPos({ lat: '', lng: '', loading: false, error: '' })} aria-label="Effacer la position"><X size={15} /></button></span>
                          : <button type="button" className="btn btn--outline btn--sm" onClick={locate} disabled={pos.loading}>{pos.loading ? <Loader2 size={15} className="spin" /> : <LocateFixed size={15} />}Utiliser ma position</button>}
                      </div>
                    </Field>
                  </div>
                  <div className="form__row">
                    <Field label="Zone d'intervention" name="rayon_km">
                      <select id="rayon_km" name="rayon_km" className="input" defaultValue={String(p.rayon_km || 10)}>
                        {[...RAYONS, 100].map((r) => <option key={r} value={r}>Jusqu’à {r} km</option>)}
                      </select>
                    </Field>
                    <Field label=" " name="deplacement">
                      <label className="check" style={{ paddingTop: 12 }}><input type="checkbox" name="deplacement" defaultChecked={p.deplacement ?? true} /> Je me déplace chez le client</label>
                    </Field>
                  </div>

                  <div className="form__step"><span>3</span>Vos coordonnées</div>
                  <div className="form__row">
                    <Field label="Téléphone" name="telephone" required error={errors.telephone}>
                      <input id="telephone" name="telephone" className={c('telephone')} required maxLength={40} defaultValue={p.telephone || user.telephone || ''} placeholder="+228 90 00 00 00" />
                    </Field>
                    <Field label="WhatsApp" name="whatsapp" hint="Laissez vide si identique ou si vous n’en avez pas">
                      <input id="whatsapp" name="whatsapp" className="input" maxLength={40} defaultValue={p.whatsapp || ''} placeholder="+228 90 00 00 00" />
                    </Field>
                  </div>
                  <Field label="E-mail professionnel" name="email" error={errors.email}>
                    <input id="email" name="email" type="email" className={c('email')} maxLength={190} defaultValue={p.email ?? user.email ?? ''} />
                  </Field>

                  <div className="form__step"><span>4</span>Informations pratiques</div>
                  <Field label="Disponibilités" name="disponibilite" hint="Les tarifs ne sont pas affichés : ils se négocient avec chaque client selon la prestation.">
                    <input id="disponibilite" name="disponibilite" className="input" maxLength={160} defaultValue={p.disponibilite || ''} placeholder="Ex. Lun – Sam, 7h – 19h · urgences le dimanche" />
                  </Field>
                  <Field label="Photo de profil ou de votre atelier" name="photo" hint="JPG, PNG ou WEBP — 4 Mo maximum">
                    <div className="photo-field">
                      <span className="photo-field__img">{photo ? <img src={photo} alt="" /> : <ImagePlus size={26} />}</span>
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                        <label className="btn btn--outline btn--sm" style={{ cursor: 'pointer' }}>
                          <ImagePlus size={15} />{photo ? 'Changer la photo' : 'Ajouter une photo'}
                          <input type="file" name="photo" accept="image/png,image/jpeg,image/webp" hidden
                            onChange={(e) => { const f = e.target.files?.[0]; setPreview(f ? URL.createObjectURL(f) : null); setRemovePhoto(false); }} />
                        </label>
                        {photo && !preview && <button type="button" className="link" onClick={() => setRemovePhoto(true)}><Trash2 size={14} />Retirer</button>}
                      </div>
                    </div>
                  </Field>

                  <div className="form__step"><span>5</span>Vérification d’identité</div>
                  <div className="alert alert--info cni-note">
                    <Lock size={20} />
                    <span>Votre carte nationale d’identité sert uniquement à vérifier votre identité. Elle n’est <b>jamais publiée</b> et seuls les administrateurs de Kapi Consult peuvent la consulter.</span>
                  </div>
                  <Field label="Numéro de la CNI" name="cni_numero" required error={errors.cni_numero}>
                    <input id="cni_numero" name="cni_numero" className={c('cni_numero')} required maxLength={60} defaultValue={p.cni_numero || ''} placeholder="Numéro inscrit sur votre carte" autoComplete="off" />
                  </Field>
                  <div className="form__row">
                    <CniPicker name="cni_recto" label="Recto de la CNI (face avec photo)" sent={p.cni_recto_ok} error={errors.cni_recto} onPick={(v) => v && setCniChange(true)} />
                    <CniPicker name="cni_verso" label="Verso de la CNI" sent={p.cni_verso_ok} error={errors.cni_verso} onPick={(v) => v && setCniChange(true)} />
                  </div>
                  {cniChange && state.profil?.statut === 'valide' && (
                    <p className="small" style={{ color: 'var(--danger)' }}><AlertTriangle size={14} style={{ verticalAlign: -2 }} /> Remplacer votre pièce d’identité masquera votre profil jusqu’à une nouvelle vérification.</p>
                  )}

                  <div className="form__step"><span>6</span>Engagements</div>
                  <div className="engage">
                    <label className="check">
                      <input type="checkbox" name="attestation" value="1" required defaultChecked={!!p.conditions_acceptees_le} />
                      <span>Je certifie sur l’honneur que les informations fournies sont exactes et que la pièce d’identité transmise est la mienne.</span>
                    </label>
                    {errors.attestation && <span className="field__error">{errors.attestation}</span>}
                    <label className="check">
                      <input type="checkbox" name="accepte_conditions" value="1" required defaultChecked={!!p.conditions_acceptees_le} />
                      <span>J’accepte les <Link to="/quotidien/conditions" target="_blank" className="u-link">conditions d’utilisation de Quotidien</Link>. Je comprends que Kapi Consult se limite à la mise en relation et que je suis seul responsable de mes prestations, de mes tarifs et des paiements reçus.</span>
                    </label>
                    {errors.accepte_conditions && <span className="field__error">{errors.accepte_conditions}</span>}
                  </div>

                  <p className="small muted"><Clock3 size={14} style={{ verticalAlign: -2 }} /> Votre profil est publié après vérification de votre identité par Kapi Consult. Vos coordonnées sont affichées sur votre fiche pour que les clients puissent vous contacter.</p>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button type="submit" className="btn btn--gold" disabled={sending}>{sending ? <Loader2 size={17} className="spin" /> : <Save size={17} />}{sending ? 'Enregistrement…' : state.profil ? 'Enregistrer les modifications' : 'Créer mon profil'}</button>
                    {state.profil && (confirmDel
                      ? <span className="small" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>Supprimer définitivement ?<button type="button" className="btn btn--sm" style={{ background: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={remove}>Oui, supprimer</button><button type="button" className="link" onClick={() => setConfirmDel(false)}>Annuler</button></span>
                      : <button type="button" className="link" style={{ color: 'var(--danger)' }} onClick={() => setConfirmDel(true)}><Trash2 size={15} />Supprimer mon profil</button>)}
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
