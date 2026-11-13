import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Download, Eye, Inbox, Mail, MailOpen, Plus, Reply, Save, Shield, Trash2, Loader2 } from 'lucide-react';
import { SearchField, norm } from '../components/ui';
import { Field } from '../components/forms';
import { useAuth } from '../lib/auth';
import { Confirm, Drawer, fmtDate, fmtDateTime, useAdminApi, useAdminList, useToast } from './kit';

const SUJETS = { recrutement: 'Recrutement', formation: 'Formation', 'conseil & audit': 'Conseil & Audit', partenariat: 'Partenariat', 'ppp / infrastructure': 'PPP / Infrastructure', autre: 'Autre' };
const EXPERIENCE = { junior: 'Junior (0 – 2 ans)', confirme: 'Confirmé (2 – 5 ans)', senior: 'Senior (5 – 10 ans)', expert: 'Expert (10 ans+)' };
const STATUTS = [['en_cours', 'En cours'], ['retenu', 'Retenu'], ['rejete', 'Rejeté']];

function Empty({ text }) { return <div className="adm-empty"><Inbox size={34} strokeWidth={1.5} /><div>{text}</div></div>; }

// ───────── Messages de contact
export function MessagesAdmin() {
  const call = useAdminApi();
  const toast = useToast();
  const { data, loading, reload, setData } = useAdminList('/contacts');
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState('');
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [view, setView] = useState(null);
  const [del, setDel] = useState(null);

  const rows = useMemo(() => (data || []).filter((m) => (!onlyUnread || !m.lu) && norm(`${m.prenom} ${m.nom} ${m.email} ${m.sujet} ${m.message}`).includes(norm(q))), [data, q, onlyUnread]);

  const setLu = async (m, lu) => {
    try {
      await call(`/contacts/${m.id}`, { method: 'PATCH', body: { lu } });
      setData((l) => l.map((x) => (x.id === m.id ? { ...x, lu } : x)));
    } catch { toast('Mise à jour impossible', 'err'); }
  };
  const openMsg = (m) => { setView(m); if (!m.lu) setLu(m, true); };
  useEffect(() => {
    const id = Number(params.get('id'));
    if (id && data) { const m = data.find((x) => x.id === id); if (m) openMsg(m); setParams({}, { replace: true }); }
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const remove = async () => {
    try { await call(`/contacts/${del.id}`, { method: 'DELETE' }); toast('Message supprimé'); setDel(null); setView(null); reload(); } catch { toast('Suppression impossible', 'err'); }
  };

  return (
    <>
      <div className="adm-page-head"><p>Messages envoyés depuis le formulaire de contact du site.</p></div>
      <section className="adm-card">
        <div className="adm-toolbar">
          <SearchField value={q} onChange={setQ} placeholder="Rechercher un message…" />
          <label className="switch"><input type="checkbox" checked={onlyUnread} onChange={(e) => setOnlyUnread(e.target.checked)} />Non lus uniquement</label>
          <span className="count">{loading ? 'Chargement…' : `${rows.length} message(s)`}</span>
        </div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>Expéditeur</th><th>Sujet</th><th>Message</th><th>Reçu le</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
            <tbody>
              {rows.map((m) => (
                <tr key={m.id} className={m.lu ? '' : 'is-unread'}>
                  <td><div className="cell-title">{m.prenom} {m.nom}</div><div className="sub">{m.email}</div></td>
                  <td><span className="pill pill--gold">{SUJETS[m.sujet] || m.sujet}</span></td>
                  <td style={{ maxWidth: 320 }}><div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.message}</div></td>
                  <td className="sub">{fmtDateTime(m.created_at)}</td>
                  <td>
                    <div className="adm-actions">
                      <button className="icon-btn" onClick={() => openMsg(m)} title="Lire" aria-label="Lire"><Eye size={16} /></button>
                      <button className="icon-btn" onClick={() => setLu(m, !m.lu)} title={m.lu ? 'Marquer non lu' : 'Marquer lu'} aria-label={m.lu ? 'Marquer non lu' : 'Marquer lu'}>{m.lu ? <Mail size={16} /> : <MailOpen size={16} />}</button>
                      <button className="icon-btn icon-btn--danger" onClick={() => setDel(m)} title="Supprimer" aria-label="Supprimer"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && !rows.length && <Empty text="Aucun message." />}
        </div>
      </section>

      {view && (
        <Drawer title="Message reçu" onClose={() => setView(null)} footer={<>
          <button className="btn btn--outline" onClick={() => setDel(view)}><Trash2 size={16} />Supprimer</button>
          <a className="btn btn--gold" href={`mailto:${view.email}?subject=${encodeURIComponent(`Re : ${SUJETS[view.sujet] || view.sujet}`)}`}><Reply size={16} />Répondre par email</a>
        </>}>
          <dl className="msg-meta">
            <dt>Nom</dt><dd>{view.prenom} {view.nom}</dd>
            <dt>Email</dt><dd><a className="u-link" href={`mailto:${view.email}`}>{view.email}</a></dd>
            <dt>Téléphone</dt><dd>{view.telephone ? <a className="u-link" href={`tel:${view.telephone}`}>{view.telephone}</a> : '—'}</dd>
            <dt>Sujet</dt><dd>{SUJETS[view.sujet] || view.sujet}</dd>
            <dt>Reçu le</dt><dd>{fmtDateTime(view.created_at)}</dd>
          </dl>
          <div className="msg-body">{view.message}</div>
        </Drawer>
      )}
      {del && <Confirm title="Supprimer ce message ?" text="Cette action est définitive." onCancel={() => setDel(null)} onConfirm={remove} />}
    </>
  );
}

// ───────── Candidatures
export function CandidaturesAdmin() {
  const call = useAdminApi();
  const toast = useToast();
  const { token } = useAuth();
  const { data, loading, reload, setData } = useAdminList('/candidatures');
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState('');
  const [statut, setStatut] = useState('');
  const [view, setView] = useState(null);
  const [del, setDel] = useState(null);

  const rows = useMemo(() => (data || []).filter((c) => (!statut || c.statut === statut) && norm(`${c.prenom} ${c.nom} ${c.email} ${c.domaine}`).includes(norm(q))), [data, q, statut]);
  useEffect(() => {
    const id = Number(params.get('id'));
    if (id && data) { setView(data.find((x) => x.id === id) || null); setParams({}, { replace: true }); }
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const setStatus = async (c, s) => {
    try {
      await call(`/candidatures/${c.id}`, { method: 'PATCH', body: { statut: s } });
      setData((l) => l.map((x) => (x.id === c.id ? { ...x, statut: s } : x)));
      setView((v) => (v && v.id === c.id ? { ...v, statut: s } : v));
      toast('Statut mis à jour');
    } catch { toast('Mise à jour impossible', 'err'); }
  };
  // Téléchargement authentifié du CV / de la lettre
  const download = async (c, kind) => {
    try {
      const res = await fetch(`/api/admin/candidatures/${c.id}/fichier/${kind}`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const name = /filename="?([^"]+)"?/.exec(res.headers.get('Content-Disposition') || '')?.[1] || `${kind}-${c.nom}`;
      const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: name });
      a.click();
      URL.revokeObjectURL(a.href);
    } catch { toast('Fichier introuvable', 'err'); }
  };
  const remove = async () => {
    try { await call(`/candidatures/${del.id}`, { method: 'DELETE' }); toast('Candidature supprimée'); setDel(null); setView(null); reload(); } catch { toast('Suppression impossible', 'err'); }
  };
  const StatusSelect = ({ c }) => (
    <select className={`input status-select s-${c.statut}`} value={c.statut} onChange={(e) => setStatus(c, e.target.value)} aria-label="Statut">
      {STATUTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  );

  return (
    <>
      <div className="adm-page-head"><p>Candidatures spontanées déposées sur le site. Changez le statut : le candidat le voit dans son espace.</p></div>
      <section className="adm-card">
        <div className="adm-toolbar">
          <SearchField value={q} onChange={setQ} placeholder="Rechercher un candidat…" />
          <select className="input" value={statut} onChange={(e) => setStatut(e.target.value)} aria-label="Statut">
            <option value="">Tous les statuts</option>
            {STATUTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <span className="count">{loading ? 'Chargement…' : `${rows.length} candidature(s)`}</span>
        </div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>Candidat</th><th>Domaine</th><th>Expérience</th><th>Reçue le</th><th>Statut</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id}>
                  <td><div className="cell-title">{c.prenom} {c.nom}</div><div className="sub">{c.email} · {c.telephone}</div></td>
                  <td>{c.domaine}</td>
                  <td className="sub">{EXPERIENCE[c.experience] || c.experience}</td>
                  <td className="sub">{fmtDate(c.created_at)}</td>
                  <td><StatusSelect c={c} /></td>
                  <td>
                    <div className="adm-actions">
                      <button className="icon-btn" onClick={() => setView(c)} title="Voir le dossier" aria-label="Voir le dossier"><Eye size={16} /></button>
                      <button className="icon-btn" onClick={() => download(c, 'cv')} title="Télécharger le CV" aria-label="Télécharger le CV"><Download size={16} /></button>
                      <button className="icon-btn icon-btn--danger" onClick={() => setDel(c)} title="Supprimer" aria-label="Supprimer"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && !rows.length && <Empty text="Aucune candidature." />}
        </div>
      </section>

      {view && (
        <Drawer title={`Candidature — ${view.prenom} ${view.nom}`} onClose={() => setView(null)} footer={<>
          <button className="btn btn--outline" onClick={() => setDel(view)}><Trash2 size={16} />Supprimer</button>
          <a className="btn btn--gold" href={`mailto:${view.email}`}><Reply size={16} />Contacter</a>
        </>}>
          <dl className="msg-meta">
            <dt>Email</dt><dd><a className="u-link" href={`mailto:${view.email}`}>{view.email}</a></dd>
            <dt>Téléphone</dt><dd><a className="u-link" href={`tel:${view.telephone}`}>{view.telephone}</a></dd>
            <dt>Domaine</dt><dd>{view.domaine}</dd>
            <dt>Expérience</dt><dd>{EXPERIENCE[view.experience] || view.experience}</dd>
            <dt>Reçue le</dt><dd>{fmtDateTime(view.created_at)}</dd>
            <dt>Compte</dt><dd>{view.user_id ? 'Candidat inscrit' : 'Sans compte'}</dd>
            <dt>Statut</dt><dd><StatusSelect c={view} /></dd>
          </dl>
          <h3 style={{ fontSize: 15, marginBottom: 10 }}>Message de motivation</h3>
          <div className="msg-body" style={{ marginBottom: 20 }}>{view.message}</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn btn--sm" onClick={() => download(view, 'cv')}><Download size={15} />Télécharger le CV</button>
            {view.lettre_path && <button className="btn btn--outline btn--sm" onClick={() => download(view, 'lettre')}><Download size={15} />Lettre de motivation</button>}
          </div>
        </Drawer>
      )}
      {del && <Confirm title="Supprimer cette candidature ?" text="Le dossier et les fichiers joints seront supprimés définitivement." onCancel={() => setDel(null)} onConfirm={remove} />}
    </>
  );
}

// ───────── Utilisateurs
export function UsersAdmin() {
  const call = useAdminApi();
  const toast = useToast();
  const { user } = useAuth();
  const { data, loading, reload, setData } = useAdminList('/users');
  const [q, setQ] = useState('');
  const [del, setDel] = useState(null);
  const [create, setCreate] = useState(false);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const rows = useMemo(() => (data || []).filter((u) => norm(`${u.prenom} ${u.nom} ${u.email}`).includes(norm(q))), [data, q]);

  const setRole = async (u, role) => {
    try {
      await call(`/users/${u.id}`, { method: 'PATCH', body: { role } });
      setData((l) => l.map((x) => (x.id === u.id ? { ...x, role } : x)));
      toast('Rôle mis à jour');
    } catch (e) { toast(e.message || 'Mise à jour impossible', 'err'); }
  };
  const remove = async () => {
    try { await call(`/users/${del.id}`, { method: 'DELETE' }); toast('Compte supprimé'); setDel(null); reload(); } catch (e) { toast(e.message || 'Suppression impossible', 'err'); }
  };
  const submit = async (e) => {
    e.preventDefault();
    setSaving(true); setErrors({});
    try {
      await call('/users', { method: 'POST', body: Object.fromEntries(new FormData(e.currentTarget)) });
      toast('Compte créé'); setCreate(false); reload();
    } catch (err) { setErrors(err.errors || {}); toast('Vérifiez le formulaire', 'err'); } finally { setSaving(false); }
  };

  return (
    <>
      <div className="adm-page-head">
        <p>Comptes candidats et administrateurs. Un administrateur a accès à cet espace.</p>
        <button className="btn btn--gold" onClick={() => setCreate(true)}><Plus size={17} />Nouveau compte</button>
      </div>
      <section className="adm-card">
        <div className="adm-toolbar">
          <SearchField value={q} onChange={setQ} placeholder="Rechercher un utilisateur…" />
          <span className="count">{loading ? 'Chargement…' : `${rows.length} compte(s)`}</span>
        </div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>Utilisateur</th><th>Téléphone</th><th>Candidatures</th><th>Inscrit le</th><th>Rôle</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u.id}>
                  <td><div className="cell-title">{u.prenom} {u.nom} {u.id === user.id && <span className="sub">(vous)</span>}</div><div className="sub">{u.email}</div></td>
                  <td className="sub">{u.telephone || '—'}</td>
                  <td>{u.candidatures}</td>
                  <td className="sub">{fmtDate(u.created_at)}</td>
                  <td>
                    <select className="input status-select" value={u.role} disabled={u.id === user.id} onChange={(e) => setRole(u, e.target.value)} aria-label="Rôle">
                      <option value="candidat">Candidat</option>
                      <option value="admin">Administrateur</option>
                    </select>
                  </td>
                  <td>
                    <div className="adm-actions">
                      {u.role === 'admin' && <span className="icon-btn" title="Administrateur" style={{ color: 'var(--gold)' }}><Shield size={16} /></span>}
                      <button className="icon-btn icon-btn--danger" onClick={() => setDel(u)} disabled={u.id === user.id} title="Supprimer" aria-label="Supprimer"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && !rows.length && <Empty text="Aucun utilisateur." />}
        </div>
      </section>

      {create && (
        <Drawer title="Nouveau compte" onClose={() => setCreate(false)} footer={<>
          <button className="btn btn--outline" onClick={() => setCreate(false)}>Annuler</button>
          <button className="btn btn--gold" form="user-form" disabled={saving}>{saving ? <Loader2 size={16} className="spin" /> : <Save size={16} />}Créer le compte</button>
        </>}>
          <form id="user-form" className="form" onSubmit={submit}>
            <div className="form__row">
              <Field label="Prénom" name="prenom" required error={errors.prenom}><input id="prenom" name="prenom" className="input" required /></Field>
              <Field label="Nom" name="nom" required error={errors.nom}><input id="nom" name="nom" className="input" required /></Field>
            </div>
            <Field label="Email" name="email" required error={errors.email}><input id="email" name="email" type="email" className="input" required /></Field>
            <Field label="Téléphone" name="telephone"><input id="telephone" name="telephone" className="input" /></Field>
            <Field label="Mot de passe provisoire" name="password" required error={errors.password} hint="8 caractères minimum, à communiquer à la personne."><input id="password" name="password" type="text" className="input" required minLength={8} /></Field>
            <Field label="Rôle" name="role">
              <select id="role" name="role" className="input" defaultValue="candidat"><option value="candidat">Candidat</option><option value="admin">Administrateur</option></select>
            </Field>
          </form>
        </Drawer>
      )}
      {del && <Confirm title={`Supprimer le compte de ${del.prenom} ${del.nom} ?`} text="Ses candidatures sont conservées mais ne seront plus rattachées à un compte." onCancel={() => setDel(null)} onConfirm={remove} />}
    </>
  );
}
