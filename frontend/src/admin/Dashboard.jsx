import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Newspaper, Package, Briefcase, Mail, FileUser, Users, HelpCircle, PenSquare, Plus, ArrowRight, BarChart3, Inbox,
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useAdminApi, fmtDate } from './kit';

const STATUT = { en_cours: ['En cours', 'pill--soft'], retenu: ['Retenu', 'pill--ok'], rejete: ['Rejeté', 'pill--ko'] };
const MOIS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

function Stat({ icon: Icon, value, label, sub, tone = '', to }) {
  return (
    <Link to={to} className={`adm-stat ${tone ? `adm-stat--${tone}` : ''}`}>
      <div className="adm-stat__ico"><Icon size={24} /></div>
      <div><b>{value ?? '—'}</b><span>{label}</span>{sub && <small>{sub}</small>}</div>
    </Link>
  );
}

export default function Dashboard() {
  const call = useAdminApi();
  const { user } = useAuth();
  const [s, setS] = useState(null);
  useEffect(() => { call('/stats').then(setS).catch(() => setS({ counts: {}, messages: [], candidatures: [], parMois: [] })); }, [call]);
  const c = s?.counts || {};

  // Candidatures des 6 derniers mois (mois vides inclus)
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - (5 - i));
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    return { key, label: MOIS[d.getMonth()], n: s?.parMois.find((m) => m.mois === key)?.n || 0 };
  });
  const max = Math.max(1, ...months.map((m) => m.n));

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h2 className="title" style={{ fontSize: 26 }}>Bonjour <b>{user.prenom}</b></h2>
          <p>Voici l'activité du site Kapi Consult.</p>
        </div>
        <a href="/" target="_blank" rel="noreferrer" className="btn btn--outline btn--sm">Voir le site <ArrowRight size={15} /></a>
      </div>

      <div className="adm-stats">
        <Stat to="/admin/messages" icon={Mail} value={c.messages} label="Messages reçus" sub={c.messages_non_lus ? `${c.messages_non_lus} non lu(s)` : 'Tout est lu'} tone={c.messages_non_lus ? 'red' : ''} />
        <Stat to="/admin/candidatures" icon={FileUser} value={c.candidatures} label="Candidatures" sub={`${c.candidatures_en_cours ?? 0} en cours de traitement`} tone="gold" />
        <Stat to="/admin/articles" icon={Newspaper} value={c.articles} label="Articles publiés ou brouillons" sub={c.brouillons ? `${c.brouillons} brouillon(s)` : undefined} />
        <Stat to="/admin/offres" icon={Briefcase} value={c.offres} label="Offres d'emploi" sub={`${c.offres_actives ?? 0} active(s)`} tone="green" />
        <Stat to="/admin/produits" icon={Package} value={c.produits} label="Produits au catalogue" />
        <Stat to="/admin/faq" icon={HelpCircle} value={c.faqs} label="Questions FAQ" />
        <Stat to="/admin/utilisateurs" icon={Users} value={c.utilisateurs} label="Comptes utilisateurs" />
        <Stat to="/admin/articles?new=1" icon={PenSquare} value="+" label="Rédiger un article" tone="gold" />
      </div>

      <div className="adm-grid-2" style={{ marginBottom: 20 }}>
        <section className="adm-card">
          <div className="adm-card__head"><h2><Inbox size={18} />Derniers messages</h2><Link to="/admin/messages" className="link" style={{ fontSize: 13.5 }}>Tout voir <ArrowRight size={14} /></Link></div>
          <div className="adm-list">
            {s && !s.messages.length && <div className="muted">Aucun message pour le moment.</div>}
            {s?.messages.map((m) => (
              <Link key={m.id} to={`/admin/messages?id=${m.id}`}>
                <span className={`adm-dot ${m.lu ? 'adm-dot--off' : ''}`} />
                <span><b>{m.prenom} {m.nom}</b><br /><span className="small muted">{m.sujet}</span></span>
                <span className="meta">{fmtDate(m.created_at)}</span>
              </Link>
            ))}
          </div>
        </section>
        <section className="adm-card">
          <div className="adm-card__head"><h2><FileUser size={18} />Dernières candidatures</h2><Link to="/admin/candidatures" className="link" style={{ fontSize: 13.5 }}>Tout voir <ArrowRight size={14} /></Link></div>
          <div className="adm-list">
            {s && !s.candidatures.length && <div className="muted">Aucune candidature pour le moment.</div>}
            {s?.candidatures.map((k) => {
              const [lbl, cl] = STATUT[k.statut] || [k.statut, 'pill--soft'];
              return (
                <Link key={k.id} to={`/admin/candidatures?id=${k.id}`}>
                  <span><b>{k.prenom} {k.nom}</b><br /><span className="small muted">{k.domaine}</span></span>
                  <span className="meta"><span className={`pill ${cl}`} style={{ marginRight: 10 }}>{lbl}</span>{fmtDate(k.created_at)}</span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      <div className="adm-grid-2">
        <section className="adm-card">
          <div className="adm-card__head"><h2><BarChart3 size={18} />Candidatures reçues (6 derniers mois)</h2></div>
          <div className="adm-card__body">
            <div className="adm-bars">
              {months.map((m) => (
                <div key={m.key}><b>{m.n}</b><i style={{ height: `${(m.n / max) * 100}%` }} /><span>{m.label}</span></div>
              ))}
            </div>
          </div>
        </section>
        <section className="adm-card">
          <div className="adm-card__head"><h2><Plus size={18} />Actions rapides</h2></div>
          <div className="adm-card__body adm-shortcuts">
            <Link to="/admin/articles?new=1"><Newspaper size={18} />Publier une actualité</Link>
            <Link to="/admin/offres?new=1"><Briefcase size={18} />Publier une offre d'emploi</Link>
            <Link to="/admin/produits?new=1"><Package size={18} />Ajouter un produit</Link>
            <Link to="/admin/faq?new=1"><HelpCircle size={18} />Ajouter une question FAQ</Link>
          </div>
        </section>
      </div>
    </>
  );
}
