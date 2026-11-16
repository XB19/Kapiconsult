// Administration de l'annuaire : validation des prestataires et modération des avis
import { useMemo, useState } from 'react';
import { BadgeCheck, Check, ExternalLink, Eye, EyeOff, Inbox, Mail, MapPin, MessageCircle, Phone, Trash2, X } from 'lucide-react';
import { SearchField, norm } from '../components/ui';
import { ProAvatar, Stars, lieu } from '../components/annuaire';
import { Confirm, Drawer, fmtDate, useAdminApi, useAdminList, useToast } from './kit';

const STATUTS = [['en_attente', 'En attente'], ['valide', 'Validé'], ['refuse', 'Refusé'], ['suspendu', 'Suspendu']];
const LABEL = Object.fromEntries(STATUTS);

function Empty({ text }) { return <div className="adm-empty"><Inbox size={34} strokeWidth={1.5} /><div>{text}</div></div>; }

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

  const patch = async (p, body, msg) => {
    try {
      const r = await call(`/prestataires/${p.id}`, { method: 'PATCH', body });
      setData((l) => l.map((x) => (x.id === p.id ? { ...x, ...r } : x)));
      setView((v) => (v?.id === p.id ? { ...v, ...r } : v));
      if (msg) toast(msg);
    } catch { toast('Mise à jour impossible', 'err'); }
  };
  const remove = async () => {
    try { await call(`/prestataires/${del.id}`, { method: 'DELETE' }); toast('Prestataire supprimé'); setDel(null); setView(null); reload(); } catch { toast('Suppression impossible', 'err'); }
  };

  return (
    <>
      <div className="adm-page-head"><p>Profils créés par les professionnels. Un profil n’apparaît dans l’annuaire public qu’une fois <b>validé</b>.</p></div>
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
              <thead><tr><th>Prestataire</th><th>Métier</th><th>Localisation</th><th>Note</th><th>Inscrit le</th><th>Statut</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
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
                    <td>{p.nb_avis ? <span style={{ whiteSpace: 'nowrap' }}><Stars value={p.note} size={12} /> <span className="sub">({p.nb_avis})</span></span> : <span className="sub">—</span>}</td>
                    <td className="sub">{fmtDate(p.created_at)}</td>
                    <td>
                      <select className={`input status-select s-${p.statut}`} value={p.statut} onChange={(e) => patch(p, { statut: e.target.value }, `Statut : ${LABEL[e.target.value]}`)} aria-label="Statut">
                        {STATUTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </td>
                    <td>
                      <div className="adm-actions">
                        {p.statut === 'en_attente' && <button className="icon-btn icon-btn--ok" title="Valider" onClick={() => patch(p, { statut: 'valide' }, 'Profil validé et publié')}><Check size={16} /></button>}
                        <button className="icon-btn" title="Voir le profil" onClick={() => setView(p)}><Eye size={16} /></button>
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
        <Drawer title="Profil prestataire" onClose={() => setView(null)} footer={(
          <>
            {view.statut !== 'valide' && <button className="btn btn--gold btn--sm" onClick={() => patch(view, { statut: 'valide' }, 'Profil validé et publié')}><Check size={15} />Valider</button>}
            {view.statut === 'en_attente' && <button className="btn btn--outline btn--sm" onClick={() => patch(view, { statut: 'refuse' }, 'Profil refusé')}><X size={15} />Refuser</button>}
            {view.statut === 'valide' && <button className="btn btn--outline btn--sm" onClick={() => patch(view, { statut: 'suspendu' }, 'Profil suspendu')}><EyeOff size={15} />Suspendre</button>}
            <button className="btn btn--outline btn--sm" onClick={() => patch(view, { verifie: !view.verifie }, view.verifie ? 'Badge retiré' : 'Badge « vérifié » attribué')}>
              <BadgeCheck size={15} />{view.verifie ? 'Retirer le badge' : 'Marquer vérifié'}
            </button>
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
          <p style={{ whiteSpace: 'pre-line', marginBottom: 16 }}>{view.description}</p>
          {view.specialites?.length > 0 && <div className="pro-tags" style={{ marginBottom: 18 }}>{view.specialites.map((s) => <span key={s}>{s}</span>)}</div>}
          <dl className="adm-dl">
            <dt><MapPin size={14} />Localisation</dt><dd>{lieu(view)} — {view.pays}{view.latitude != null && <> · <a className="u-link" href={`https://www.google.com/maps?q=${view.latitude},${view.longitude}`} target="_blank" rel="noopener noreferrer">voir sur la carte</a></>}</dd>
            <dt>Zone</dt><dd>{view.deplacement ? `Se déplace jusqu’à ${view.rayon_km} km` : 'Reçoit sur place'}</dd>
            <dt><Phone size={14} />Téléphone</dt><dd><a href={`tel:${view.telephone}`}>{view.telephone}</a></dd>
            {view.whatsapp && <><dt><MessageCircle size={14} />WhatsApp</dt><dd>{view.whatsapp}</dd></>}
            {view.email && <><dt><Mail size={14} />E-mail</dt><dd>{view.email}</dd></>}
            {view.disponibilite && <><dt>Disponibilités</dt><dd>{view.disponibilite}</dd></>}
            {view.tarif && <><dt>Tarifs</dt><dd>{view.tarif}</dd></>}
            <dt>Compte</dt><dd>{view.compte_prenom} {view.compte_nom} — {view.compte_email}</dd>
            <dt>Statistiques</dt><dd>{view.vues} vue(s) · {view.nb_avis} avis</dd>
          </dl>
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
