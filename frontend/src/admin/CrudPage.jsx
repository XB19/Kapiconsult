import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Eye, Loader2, Pencil, Plus, Save, SearchX, Trash2 } from 'lucide-react';
import { SearchField, norm } from '../components/ui';
import { Field } from '../components/forms';
import { Confirm, Drawer, ImageField, useAdminApi, useAdminList, useToast } from './kit';

/**
 * Page de gestion générique.
 * columns : [{ key, label, render(row) }]
 * fields  : [{ name, label, type: text|textarea|select|date|number|switch|image|email, options, required, hint, half }]
 * filter  : { name, label, options: [[valeur, libellé]] } — filtre local facultatif
 */
export default function CrudPage({ endpoint, noun, columns, fields, defaults = {}, filter, searchKeys, publicUrl, intro, toForm = (r) => r }) {
  const call = useAdminApi();
  const toast = useToast();
  const { data, loading, reload } = useAdminList(`/${endpoint}`);
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState('');
  const [f, setF] = useState('');
  const [edit, setEdit] = useState(null); // null | {} (nouveau) | ligne
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const open = (row) => {
    setEdit(row || {});
    setForm(row ? toForm(row) : { ...defaults });
    setErrors({});
  };
  // ?new=1 ouvre directement le formulaire de création (raccourcis du tableau de bord)
  useEffect(() => {
    if (params.get('new')) { open(null); setParams({}, { replace: true }); }
  }, [params]); // eslint-disable-line react-hooks/exhaustive-deps

  const rows = useMemo(() => (data || []).filter((r) => (!f || String(r[filter?.name]) === f)
    && (!q || norm(searchKeys.map((k) => r[k]).join(' ')).includes(norm(q)))), [data, f, q, filter, searchKeys]);

  const set = (name, v) => setForm((s) => ({ ...s, [name]: v }));
  const save = async (e) => {
    e.preventDefault();
    setSaving(true); setErrors({});
    try {
      const body = {};
      fields.forEach((fd) => { body[fd.name] = form[fd.name] ?? (fd.type === 'switch' ? false : ''); });
      if (edit?.id) await call(`/${endpoint}/${edit.id}`, { method: 'PUT', body });
      else await call(`/${endpoint}`, { method: 'POST', body });
      toast(edit?.id ? `${noun} mis(e) à jour` : `${noun} créé(e)`);
      setEdit(null);
      reload();
    } catch (err) {
      setErrors(err.errors || {});
      toast(err.status === 422 ? 'Vérifiez les champs obligatoires' : err.message || 'Erreur', 'err');
    } finally { setSaving(false); }
  };
  const remove = async () => {
    setDeleting(true);
    try {
      await call(`/${endpoint}/${toDelete.id}`, { method: 'DELETE' });
      toast(`${noun} supprimé(e)`);
      setToDelete(null);
      reload();
    } catch (err) { toast(err.message || 'Suppression impossible', 'err'); } finally { setDeleting(false); }
  };

  const input = (fd) => {
    const v = form[fd.name] ?? '';
    const cls = `input ${errors[fd.name] ? 'is-invalid' : ''}`;
    switch (fd.type) {
      case 'textarea': return <textarea id={fd.name} className={cls} rows={fd.rows || 6} value={v} onChange={(e) => set(fd.name, e.target.value)} />;
      case 'select': return (
        <select id={fd.name} className={cls} value={v} onChange={(e) => set(fd.name, e.target.value)}>
          {!fd.required && <option value="">—</option>}
          {fd.options.map(([val, lbl]) => <option key={val} value={val}>{lbl}</option>)}
        </select>
      );
      case 'switch': return <label className="switch"><input type="checkbox" checked={!!form[fd.name]} onChange={(e) => set(fd.name, e.target.checked)} />{fd.switchLabel || 'Activé'}</label>;
      case 'image': return <ImageField value={v} onChange={(url) => set(fd.name, url)} />;
      case 'date': return <input id={fd.name} type="date" className={cls} value={v ? String(v).slice(0, 10) : ''} onChange={(e) => set(fd.name, e.target.value)} />;
      case 'number': return <input id={fd.name} type="number" className={cls} value={v ?? ''} onChange={(e) => set(fd.name, e.target.value)} />;
      default: return <input id={fd.name} type={fd.type || 'text'} className={cls} value={v} list={fd.suggestions ? `${fd.name}-list` : undefined} onChange={(e) => set(fd.name, e.target.value)} />;
    }
  };

  // Regroupe les champs « half » deux par deux
  const layout = [];
  fields.forEach((fd) => {
    const last = layout[layout.length - 1];
    if (fd.half && last && last.length === 1 && last[0].half) last.push(fd); else layout.push([fd]);
  });

  return (
    <>
      <div className="adm-page-head">
        <p>{intro}</p>
        <button className="btn btn--gold" onClick={() => open(null)}><Plus size={17} />Ajouter</button>
      </div>

      <section className="adm-card">
        <div className="adm-toolbar">
          <SearchField value={q} onChange={setQ} placeholder="Rechercher…" />
          {filter && (
            <select className="input" value={f} onChange={(e) => setF(e.target.value)} aria-label={filter.label}>
              <option value="">{filter.label}</option>
              {filter.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          )}
          <span className="count">{loading ? 'Chargement…' : `${rows.length} élément(s)`}</span>
        </div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr>{columns.map((c) => <th key={c.key}>{c.label}</th>)}<th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  {columns.map((c) => <td key={c.key}>{c.render ? c.render(r) : r[c.key]}</td>)}
                  <td>
                    <div className="adm-actions">
                      {publicUrl && publicUrl(r) && <a className="icon-btn" href={publicUrl(r)} target="_blank" rel="noreferrer" title="Voir sur le site" aria-label="Voir sur le site"><Eye size={16} /></a>}
                      <button className="icon-btn" onClick={() => open(r)} title="Modifier" aria-label="Modifier"><Pencil size={16} /></button>
                      <button className="icon-btn icon-btn--danger" onClick={() => setToDelete(r)} title="Supprimer" aria-label="Supprimer"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && !rows.length && <div className="adm-empty"><SearchX size={34} strokeWidth={1.5} /><div>Aucun élément à afficher.</div></div>}
        </div>
      </section>

      {edit && (
        <Drawer
          title={edit.id ? `Modifier — ${noun}` : `Nouveau — ${noun}`}
          onClose={() => setEdit(null)}
          footer={<>
            <button className="btn btn--outline" onClick={() => setEdit(null)}>Annuler</button>
            <button className="btn btn--gold" form="crud-form" disabled={saving}>{saving ? <Loader2 size={16} className="spin" /> : <Save size={16} />}Enregistrer</button>
          </>}
        >
          <form id="crud-form" className="form" onSubmit={save}>
            {layout.map((group) => (
              <div key={group.map((g) => g.name).join()} className={group.length > 1 ? 'form__row' : undefined}>
                {group.map((fd) => (
                  <Field key={fd.name} label={fd.type === 'switch' ? fd.label : fd.label} name={fd.name} required={fd.required} error={errors[fd.name]} hint={fd.hint}>
                    {input(fd)}
                    {fd.suggestions && <datalist id={`${fd.name}-list`}>{fd.suggestions.map((s) => <option key={s} value={s} />)}</datalist>}
                  </Field>
                ))}
              </div>
            ))}
          </form>
        </Drawer>
      )}

      {toDelete && (
        <Confirm title={`Supprimer ${noun.toLowerCase()} ?`} text="Cette action est définitive." busy={deleting} onCancel={() => setToDelete(null)} onConfirm={remove} />
      )}
    </>
  );
}
