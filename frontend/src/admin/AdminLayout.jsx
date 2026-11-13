import { useEffect, useState } from 'react';
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Newspaper, Package, Briefcase, HelpCircle, Mail, FileUser, Users, ExternalLink, LogOut, Menu, ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { LogoMark } from '../components/Header';
import { ToastProvider, useAdminApi } from './kit';
import '../styles/admin.css';

export const ADMIN_NAV = [
  { to: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
  { group: 'Contenus' },
  { to: '/admin/articles', label: 'Articles & actualités', icon: Newspaper },
  { to: '/admin/produits', label: 'Produits', icon: Package },
  { to: '/admin/offres', label: "Offres d'emploi", icon: Briefcase },
  { to: '/admin/faq', label: 'FAQ', icon: HelpCircle },
  { group: 'Demandes' },
  { to: '/admin/messages', label: 'Messages', icon: Mail, badge: 'messages_non_lus' },
  { to: '/admin/candidatures', label: 'Candidatures', icon: FileUser, badge: 'candidatures_en_cours' },
  { group: 'Accès' },
  { to: '/admin/utilisateurs', label: 'Utilisateurs', icon: Users },
];

function Shell() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const call = useAdminApi();
  const [open, setOpen] = useState(false);
  const [counts, setCounts] = useState({});

  useEffect(() => { setOpen(false); }, [pathname]);
  // Compteurs (messages non lus, candidatures en cours) rafraîchis à chaque changement de page
  useEffect(() => { call('/stats').then((s) => setCounts(s.counts)).catch(() => {}); }, [call, pathname]);
  useEffect(() => {
    document.body.classList.add('is-admin');
    return () => document.body.classList.remove('is-admin');
  }, []);

  const current = ADMIN_NAV.find((n) => n.to && (n.end ? pathname === n.to : pathname.startsWith(n.to)));
  useEffect(() => { document.title = `${current?.label || 'Administration'} — Kapi Consult Admin`; }, [current]);

  return (
    <div className="adm">
      <aside className={`adm-side ${open ? 'is-open' : ''}`}>
        <div className="adm-side__brand">
          <Link to="/admin"><LogoMark height={40} /></Link>
          <small>Administration du site</small>
        </div>
        <nav className="adm-nav" aria-label="Administration">
          {ADMIN_NAV.map((n) => (n.group
            ? <div key={n.group} className="adm-nav__label">{n.group}</div>
            : (
              <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => (isActive ? 'active' : '')}>
                <n.icon size={18} />{n.label}
                {n.badge && counts[n.badge] > 0 && <span className="count">{counts[n.badge]}</span>}
              </NavLink>
            )))}
        </nav>
        <div className="adm-side__foot adm-nav">
          <a href="/" target="_blank" rel="noreferrer"><ExternalLink size={18} />Voir le site</a>
          <button onClick={() => { logout(); navigate('/login'); }}><LogOut size={18} />Déconnexion</button>
        </div>
      </aside>

      <div className="adm-main">
        <header className="adm-top">
          <button className="adm-burger" onClick={() => setOpen((o) => !o)} aria-label="Menu"><Menu size={20} /></button>
          <h1>{current?.label || 'Administration'}</h1>
          <div className="adm-top__user">
            <span>{user.prenom} {user.nom}</span>
            <div className="adm-avatar">{user.prenom?.[0]}{user.nom?.[0]}</div>
          </div>
        </header>
        <div className="adm-content"><Outlet context={{ counts }} /></div>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  if (!user) return <Navigate to="/login?next=/admin" replace />;
  if (user.role !== 'admin') {
    return (
      <div className="adm-denied">
        <div className="dialog confirm">
          <div className="dialog__ico"><ShieldAlert size={30} /></div>
          <h2 style={{ fontSize: 21, marginBottom: 8 }}>Accès réservé</h2>
          <p className="muted" style={{ marginBottom: 22 }}>Cet espace est réservé aux administrateurs de Kapi Consult.</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <Link to="/" className="btn btn--outline">Retour au site</Link>
            <button className="btn" onClick={logout}>Changer de compte</button>
          </div>
        </div>
      </div>
    );
  }
  return <ToastProvider><Shell /></ToastProvider>;
}
