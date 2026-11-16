// Administration de l'annuaire : validation des prestataires et modération des avis
import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle, BadgeCheck, Check, ExternalLink, Eye, EyeOff, FileText, IdCard, Inbox, Loader2, Mail, MapPin, MessageCircle, Phone, ShieldCheck, Trash2, X,
} from 'lucide-react';
import { SearchField, norm } from '../components/ui';
import { BASE } from '../lib/api';
import { useAuth } from '../lib/auth';
import { ProAvatar, Stars, lieu } from '../components/annuaire';
import { Confirm, Drawer, fmtDate, useAdminApi, useAdminList, useToast } from './kit';

const STATUTS = [['en_attente', 'En attente'], ['valide', 'Validé'], ['refuse', 'Refusé'], ['suspendu', 'Suspendu']];
const LABEL = Object.fromEntries(STATUTS);

function Empty({ text }) { return <div className="adm-empty"><Inbox size={34} strokeWidth={1.5} /><div>{text}</div></div>; }

// État de la vérification d'identité d'un profil
const cniComplete = (p) => !!(p.cni_recto && p.cni_verso);
function IdentitePill({ p }) {
  if (p.identite_verifiee_le || (p.verifie && p.statut === 'valide')) return <span className="pill pill--ok"><ShieldCheck size={13} />Vérifiée</span>;
  if (cniComplete(p)) return <span className="pill pill--soft"><IdCard size={13} />À vérifier</span>;
  return <span className="pill pill--ko"><AlertTriangle size={13} />CNI manquante</span>;
}

// Image (ou PDF) de la pièce d'identité, chargée avec le jeton administrateur : jamais exposée publiquement
function CniView({ id, face, present }) {
  const { token } = useAuth();
  const [doc, setDoc] = useState({ loading: present });
  useEffect(() => {
    if (!present) return undefined;
    let url; let alive = true;
    fetch(`${BASE}/api/admin/prestataires/${id}/cni/${face}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => { if (!res.ok) throw new Error(); return res.blob(); })
      .then((blob) => { url = URL.createObjectURL(blob); if (alive) setDoc({ url, pdf: blob.type === 'application/pdf' }); })
      .catch(() => alive && setDoc({ error: true }));
    return () => { alive = false; if (url) URL.revokeObjectURL(url); };
  }, [id, face, present, token]);
  return (
    <figure className="cni-view">
      <div className="cni-view__frame">
        {!present && <span className="cni-view__empty"><AlertTriangle size={22} />Non transmis</span>}
        {doc.loading && <Loader2 size={22} className="spin" />}
        {doc.error && <span className="cni-view__empty"><AlertTriangle size={22} />Fichier introuvable</span>}
        {doc.url && !doc.pdf && <a href={doc.url} target="_blank" rel="noopener noreferrer" title="Agrandir"><img src={doc.url} alt={`CNI ${face}`} /></a>}
        {doc.url && doc.pdf && <a href={doc.url} target="_blank" rel="noopener noreferrer" className="cni-view__empty"><FileText size={26} />Ouvrir le PDF</a>}
      </div>
      <figcaption>{face === 'recto' ? 'Recto' : 'Verso'}{doc.url && !doc.pdf && ' · cliquer pour agrandir'}</figcaption>
    </figure>
  );
}

export function PrestatairesAdmin() {
  const call = useAdminApi();
  const toast = useToast();
  const { data, loading, reload, setData } = useAdminList('/prestataires');
  const [q, setQ] = useState('');
  const [statut, setStatut] = useState('');
  const [view, setView] = useState(null);
  const [del, setDel] = useState(null);

  const rows = useMemo(() => (data || []).filter((p) => (!statut || p.statut === statut)
    && norm(`${p.nom_affiche} ${p.metier} ${p.ville} ${p.quartier} ${p.telephone} ${p.compte_email}`).includes(norm(q))), [data, q, statut]);

  const [checked, setChecked] = useState(false);
  const [motif, setMotif] = useState('');
  const [busy, setBusy] = useState(false);
  const open = (p) => { setView(p); setChecked(false); setMotif(p.motif_refus || ''); };
  const patch = async (p, body, msg) => {
    setBusy(true);
    try {
      const r = await call(`/prestataires/${p.id}`, { method: 'PATCH', body });
      setData((l) => l.map((x) => (x.id === p.id ? { ...x, ...r } : x)));
      setView((v) => (v?.id === p.id ? { ...v, ...r } : v));
      if (msg) toast(msg);
      return true;
    } catch (e) { toast(e.message && e.message !== 'Erreur' ? e.message : 'Mise à jour impossible', 'err'); return false; } finally { setBusy(false); }
  };
  const remove = async () => {
    try { await call(`/prestataires/${del.id}`, { method: 'DELETE' }); toast('Prestataire supprimé'); setDel(null); setView(null); reload(); } catch { toast('Suppression impossible', 'err'); }
  };

  return (
    <>
      <div className="adm-page-head"><p>Profils créés par les professionnels. Un profil n’apparaît dans Quotidien qu’après <b>contrôle de la pièce d’identité</b> et validation par un administrateur.</p></div>
      <section className="adm-card">
        <div className="adm-toolbar">
          <SearchField value={q} onChange={setQ} placeholder="Nom, métier, ville, téléphone…" />
          <select className="input" value={statut} onChange={(e) => setStatut(e.target.value)} aria-label="Statut">
            <option value="">Tous les statuts</option>
            {STATUTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <span className="count">{loading ? 'Chargement…' : `${rows.length} prestataire(s)`}</span>
        </div>
        {!loading && !rows.length ? <Empty text="Aucun prestataire pour le moment." /> : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead><tr><th>Prestataire</th><th>Métier</th><th>Localisation</th><th>Identité</th><th>Inscrit le</th><th>Statut</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={p.id} className={p.statut === 'en_attente' ? 'is-unread' : ''}>
                    <td>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <ProAvatar p={p} size={42} />
                        <div><div className="cell-title">{p.nom_affiche}{p.verifie && <BadgeCheck size={15} className="pro-verified" />}</div><div className="sub">{p.telephone}</div></div>
                      </div>
                    </td>
                    <td>{p.metier}</td>
                    <td className="sub">{lieu(p)}</td>
                    <td><IdentitePill p={p} /></td>
                    <td className="sub">{fmtDate(p.created_at)}</td>
                    <td><span className={`status-select s-${p.statut}`} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>{LABEL[p.statut]}</span></td>
                    <td>
                      <div className="adm-actions">
                        {p.statut === 'en_attente'
                          ? <button className="btn btn--gold btn--sm" onClick={() => open(p)}><IdCard size={14} />Vérifier</button>
                          : <button className="icon-btn" title="Voir le profil" onClick={() => open(p)}><Eye size={16} /></button>}
                        <button className="icon-btn icon-btn--danger" title="Supprimer" onClick={() => setDel(p)}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {view && (
        <Drawer title="Vérification du prestataire" onClose={() => setView(null)} footer={(
          <>
            {view.statut !== 'valide' && (
              <button className="btn btn--gold btn--sm" disabled={busy || !checked || (!view.demo && !cniComplete(view))}
                title={!checked ? 'Cochez d’abord le contrôle de la pièce d’identité' : undefined}
                onClick={() => patch(view, { statut: 'valide' }, 'Identité vérifiée : profil validé et publié')}><Check size={15} />Valider et publier</button>
            )}
            {view.statut !== 'refuse' && view.statut !== 'valide' && (
              <button className="btn btn--outline btn--sm" disabled={busy} onClick={() => (motif.trim() ? patch(view, { statut: 'refuse', motif }, 'Profil refusé') : toast('Indiquez le motif du refus', 'err'))}><X size={15} />Refuser</button>
            )}
            {view.statut === 'valide' && (
              <button className="btn btn--outline btn--sm" disabled={busy} onClick={() => patch(view, { statut: 'suspendu', motif }, 'Profil suspendu')}><EyeOff size={15} />Suspendre</button>
            )}
          </>
        )}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 18 }}>
            <ProAvatar p={view} size={72} />
            <div>
              <h3 style={{ fontSize: 19 }}>{view.nom_affiche}{view.verifie && <BadgeCheck size={17} className="pro-verified" />}</h3>
              <div className="sub">{view.metier} · {view.experience} an(s) d’expérience</div>
              <span className={`pill ${view.statut === 'valide' ? 'pill--ok' : view.statut === 'en_attente' ? 'pill--soft' : 'pill--ko'}`} style={{ marginTop: 8 }}>{LABEL[view.statut]}</span>
            </div>
          </div>
          <section className="verif">
            <h4><IdCard size={17} />Pièce d’identité</h4>
            <div className="verif__docs">
              <CniView id={view.id} face="recto" present={!!view.cni_recto} />
              <CniView id={view.id} face="verso" present={!!view.cni_verso} />
            </div>
            <dl className="adm-dl">
              <dt>N° de CNI</dt><dd>{view.cni_numero || '—'}</dd>
              <dt>Titulaire du compte</dt><dd>{view.compte_prenom} {view.compte_nom}{view.compte_email ? ` — ${view.compte_email}` : ''}</dd>
              <dt>Transmise le</dt><dd>{view.cni_transmise_le ? fmtDate(view.cni_transmise_le) : '—'}</dd>
              <dt>Conditions</dt><dd>{view.conditions_acceptees_le ? `Acceptées le ${fmtDate(view.conditions_acceptees_le)}` : 'Non acceptées'}</dd>
              {view.identite_verifiee_le && <><dt>Vérification</dt><dd>Identité vérifiée le {fmtDate(view.identite_verifiee_le)}{view.verifie_par_nom ? ` par ${view.verifie_par_nom}` : ''}</dd></>}
            </dl>
            {view.demo && <p className="sub" style={{ marginTop: 8 }}>Profil de démonstration : pièces « spécimen » fictives.</p>}
            {view.statut !== 'valide' && (
              <>
                <ul className="verif__list">
                  <li>Le nom sur la CNI correspond au titulaire du compte et au nom affiché.</li>
                  <li>Le numéro saisi est identique à celui de la carte.</li>
                  <li>Le document est lisible, complet (recto et verso) et en cours de validité.</li>
                  <li>Aucun signe de retouche ou de falsification.</li>
                </ul>
                <label className="check verif__ok">
                  <input type="checkbox" checked={checked} disabled={!view.demo && !cniComplete(view)} onChange={(e) => setChecked(e.target.checked)} />
                  <span>J’ai contrôlé la pièce d’identité et elle est conforme.</span>
                </label>
              </>
            )}
            <label className="verif__motif">
              <span>{view.statut === 'valide' ? 'Motif de suspension (communiqué au prestataire)' : 'Motif en cas de refus (communiqué au prestataire)'}</span>
              <textarea className="input" rows={2} value={motif} onChange={(e) => setMotif(e.target.value)} placeholder="Ex. CNI illisible, nom différent du profil…" />
            </label>
          </section>
          <h4 style={{ margin: '22px 0 10px' }}>Profil</h4>
          <p style={{ whiteSpace: 'pre-line', marginBottom: 16 }}>{view.description}</p>
          {view.specialites?.length > 0 && <div className="pro-tags" style={{ marginBottom: 18 }}>{view.specialites.map((s) => <span key={s}>{s}</span>)}</div>}
          <dl className="adm-dl">
            <dt><MapPin size={14} />Localisation</dt><dd>{lieu(view)} — {view.pays}{view.latitude != null && <> · <a className="u-link" href={`https://www.google.com/maps?q=${view.latitude},${view.longitude}`} target="_blank" rel="noopener noreferrer">voir sur la carte</a></>}</dd>
            <dt>Zone</dt><dd>{view.deplacement ? `Se déplace jusqu’à ${view.rayon_km} km` : 'Reçoit sur place'}</dd>
            <dt><Phone size={14} />Téléphone</dt><dd><a href={`tel:${view.telephone}`}>{view.telephone}</a></dd>
            {view.whatsapp && <><dt><MessageCircle size={14} />WhatsApp</dt><dd>{view.whatsapp}</dd></>}
            {view.email && <><dt><Mail size={14} />E-mail</dt><dd>{view.email}</dd></>}
            {view.disponibilite && <><dt>Disponibilités</dt><dd>{view.disponibilite}</dd></>}
            <dt>Statistiques</dt><dd>{view.vues} vue(s) · {view.nb_avis} avis</dd>
          </dl>
          {view.motif_refus && view.statut !== 'valide' && <p className="sub" style={{ marginTop: 14 }}><b>Motif communiqué :</b> {view.motif_refus}</p>}
          {view.statut === 'valide' && <a className="link" style={{ marginTop: 18 }} href={`/prestataires/${view.id}`} target="_blank" rel="noopener noreferrer">Voir la fiche publique <ExternalLink size={14} /></a>}
        </Drawer>
      )}
      {del && <Confirm title="Supprimer ce prestataire ?" text={`Le profil de « ${del.nom_affiche} » et ses avis seront définitivement supprimés.`} onConfirm={remove} onCancel={() => setDel(null)} />}
    </>
  );
}

export function AvisAdmin() {
  const call = useAdminApi();
  const toast = useToast();
  const { data, loading, reload, setData } = useAdminList('/avis');
  const [q, setQ] = useState('');
  const [del, setDel] = useState(null);
  const rows = useMemo(() => (data || []).filter((a) => norm(`${a.nom_affiche} ${a.prenom} ${a.nom} ${a.commentaire}`).includes(norm(q))), [data, q]);

  const toggle = async (a) => {
    try {
      const r = await call(`/avis/${a.id}`, { method: 'PATCH', body: { visible: !a.visible } });
      setData((l) => l.map((x) => (x.id === a.id ? { ...x, ...r } : x)));
      toast(r.visible ? 'Avis publié' : 'Avis masqué');
    } catch { toast('Mise à jour impossible', 'err'); }
  };
  const remove = async () => {
    try { await call(`/avis/${del.id}`, { method: 'DELETE' }); toast('Avis supprimé'); setDel(null); reload(); } catch { toast('Suppression impossible', 'err'); }
  };

  return (
    <>
      <div className="adm-page-head"><p>Avis laissés par les clients. Masquez un avis inapproprié : il n’est plus pris en compte dans la note.</p></div>
      <section className="adm-card">
        <div className="adm-toolbar">
          <SearchField value={q} onChange={setQ} placeholder="Rechercher un avis…" />
          <span className="count">{loading ? 'Chargement…' : `${rows.length} avis`}</span>
        </div>
        {!loading && !rows.length ? <Empty text="Aucun avis pour le moment." /> : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead><tr><th>Client</th><th>Prestataire</th><th>Note</th><th>Commentaire</th><th>Date</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
              <tbody>
                {rows.map((a) => (
                  <tr key={a.id} style={a.visible ? undefined : { opacity: 0.55 }}>
                    <td><div className="cell-title">{a.prenom} {a.nom}</div><div className="sub">{a.email}</div></td>
                    <td><div>{a.nom_affiche}</div><div className="sub">{a.metier}</div></td>
                    <td style={{ whiteSpace: 'nowrap' }}><Stars value={a.note} size={13} /></td>
                    <td style={{ maxWidth: 320 }}><div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={a.commentaire}>{a.commentaire}</div></td>
                    <td className="sub">{fmtDate(a.created_at)}</td>
                    <td>
                      <div className="adm-actions">
                        <button className="icon-btn" title={a.visible ? 'Masquer' : 'Publier'} onClick={() => toggle(a)}>{a.visible ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                        <button className="icon-btn icon-btn--danger" title="Supprimer" onClick={() => setDel(a)}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      {del && <Confirm title="Supprimer cet avis ?" text="Cet avis sera définitivement supprimé." onConfirm={remove} onCancel={() => setDel(null)} />}
    </>
  );
}
