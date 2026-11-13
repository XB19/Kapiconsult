import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';

const NAV = [
  { label: 'Accueil', to: '/' },
  { label: 'À propos', to: '/a-propos' },
  { label: 'Nos activités', to: '/nos-activites' },
  { label: 'Nos solutions', children: [{ label: 'Kapi board select', to: '#' }, { label: 'Kapi data', to: '#' }] },
  { label: 'Nos produits', to: '/nos-produits' },
  {
    label: 'Publications',
    children: [
      { label: 'Actualités', to: '/actualites' },
      { label: 'Blog', to: '/blog' },
      { label: 'Bons Plans', to: '/bons-plans' },
      { label: 'FAQ', to: '/faq' },
    ],
  },
  {
    label: 'Carrière',
    children: [
      { label: "Offres d'emploi", to: '/offres' },
      { label: 'Candidature spontanée', to: '/candidature-spontanee' },
    ],
  },
  { label: 'Contact', to: '/contact' },
];

export const LogoGrid = ({ style }) => (
  <div className="logo-grid" style={style}>
    {Array.from({ length: 9 }, (_, i) => <span key={i} />)}
  </div>
);

export default function Header() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (to) => to !== '#' && to === pathname;
  const noop = (e) => e.preventDefault();

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="logo-area">
          <LogoGrid />
          <span className="logo-name">Kapi Consult</span>
        </Link>
        <nav className={`site-nav${open ? ' open' : ''}`}>
          {NAV.map((item) =>
            item.children ? (
              <div className="nav-drop-group" key={item.label}>
                <a href="#" onClick={noop} className={`nav-item ${item.children.some((c) => isActive(c.to)) ? 'active' : ''}`}>
                  {item.label} ▾
                </a>
                <div className="dropdown-menu">
                  {item.children.map((c) =>
                    c.to === '#' ? (
                      <a key={c.label} href="#" onClick={noop} className="dropdown-item ">{c.label}</a>
                    ) : (
                      <Link key={c.label} to={c.to} className={`dropdown-item ${isActive(c.to) ? 'active' : ''}`}>{c.label}</Link>
                    ),
                  )}
                </div>
              </div>
            ) : (
              <Link key={item.label} to={item.to} className={`nav-item ${isActive(item.to) ? 'active' : ''}`}>{item.label}</Link>
            ),
          )}
        </nav>
        <Link to={user ? '/mon-compte' : '/login'} className="header-cta">Mon Compte</Link>
        <button className="hamburger" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}
