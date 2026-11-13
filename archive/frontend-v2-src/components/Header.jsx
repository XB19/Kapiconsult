import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { NAV } from '../content/site';

export const BrandMark = () => (
  <div className="brand-mark" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <span key={i} />)}</div>
);

export function Brand({ sub = true }) {
  return (
    <Link to="/" className="brand" aria-label="Kapi Consult — Accueil">
      <BrandMark />
      <span className="brand-name">Kapi Consult{sub && <small>Depuis 2004</small>}</span>
    </Link>
  );
}

export default function Header() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => { setOpen(false); setExpanded(null); }, [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const groupActive = (item) => item.children?.some((c) => c.to === pathname);
  const account = user ? '/mon-compte' : '/login';

  return (
    <>
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container header-inner">
          <Brand />
          <nav className="nav" aria-label="Navigation principale">
            {NAV.map((item) =>
              item.children ? (
                <div className="nav-item" key={item.label}>
                  <button className={`nav-link ${groupActive(item) ? 'active' : ''}`} aria-haspopup="true">
                    {item.label} <span className="chev">▾</span>
                  </button>
                  <div className="dropdown" role="menu">
                    {item.children.map((c) =>
                      c.to ? (
                        <Link key={c.label} to={c.to} className={`dropdown-link ${pathname === c.to ? 'active' : ''}`} role="menuitem">
                          <b>{c.label} <span aria-hidden="true">→</span></b>
                          <span>{c.desc}</span>
                        </Link>
                      ) : (
                        <div key={c.label} className="dropdown-link disabled">
                          <b>{c.label} <em className="soon">Bientôt</em></b>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              ) : (
                <NavLink key={item.label} to={item.to} end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  {item.label}
                </NavLink>
              ),
            )}
          </nav>
          <div className="header-actions">
            <Link to={account} className="btn btn-gold btn-sm">Mon Compte</Link>
            <button className={`burger ${open ? 'open' : ''}`} onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}>
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      <div className={`drawer ${open ? 'open' : ''}`} aria-hidden={!open}>
        {NAV.map((item) => (
          <div className="drawer-group" key={item.label}>
            {item.children ? (
              <>
                <button className={`drawer-link ${groupActive(item) ? 'active' : ''}`} onClick={() => setExpanded((e) => (e === item.label ? null : item.label))}>
                  {item.label} <span style={{ fontSize: 18, transform: expanded === item.label ? 'rotate(45deg)' : 'none', transition: 'transform .3s' }}>+</span>
                </button>
                {expanded === item.label && (
                  <div className="drawer-sub">
                    {item.children.map((c) => (c.to
                      ? <Link key={c.label} to={c.to} className={pathname === c.to ? 'active' : ''}>{c.label}</Link>
                      : <span key={c.label}>{c.label} <em className="soon">Bientôt</em></span>))}
                  </div>
                )}
              </>
            ) : (
              <Link to={item.to} className={`drawer-link ${pathname === item.to ? 'active' : ''}`}>{item.label} <span>→</span></Link>
            )}
          </div>
        ))}
        <div className="drawer-foot">
          <Link to={account} className="btn btn-gold btn-block">Mon Compte</Link>
          <Link to="/contact" className="btn btn-outline btn-block">Nous contacter</Link>
        </div>
      </div>
    </>
  );
}
