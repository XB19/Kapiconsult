import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { ANNIV, CONTACT, NAV, tel } from '../content/site';

export const LogoMark = () => (
  <span className="logo__mark" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <span key={i} />)}</span>
);

export function Logo({ sub = true }) {
  return (
    <Link to="/" className="logo" aria-label="Kapi Consult — Accueil">
      <LogoMark />
      <span className="logo__name">Kapi Consult{sub && <small>Bureau d'études &amp; conseil</small>}</span>
    </Link>
  );
}

// En-tête épinglé : barre d'information + barre de navigation, toujours visible au défilement
export default function Header() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const account = user ? '/mon-compte' : '/login';

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const groupActive = (item) => item.children?.some((c) => c.to === pathname);

  return (
    <header className={`site-head ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="util">
        <div className="wrap">
          <span className="util__text">{ANNIV.banner[0]}<strong>{ANNIV.banner[1]}</strong>{ANNIV.banner[2]}</span>
          <div className="util__links">
            <a href={tel(CONTACT.telephones[0])} className="hide-md">{CONTACT.telephones[0]}</a>
            <span className="sep hide-md" />
            <a href={`mailto:${CONTACT.emails[0]}`} className="hide-md">{CONTACT.emails[0]}</a>
            <span className="sep hide-md" />
            <Link to={account}>Mon Compte</Link>
          </div>
        </div>
      </div>

      <div className="mast">
        <div className="wrap">
          <Logo />
          <nav className="nav" aria-label="Navigation principale">
            {NAV.map((item) =>
              item.children ? (
                <div className="nav__item" key={item.label}>
                  <button className={`nav__link ${groupActive(item) ? 'is-active' : ''}`} aria-haspopup="true">
                    {item.label}<span className="nav__caret" />
                  </button>
                  <div className="nav__panel">
                    {item.children.map((c) => (c.to
                      ? <Link key={c.label} to={c.to} className={pathname === c.to ? 'is-active' : ''}>{c.label}</Link>
                      : <span key={c.label}>{c.label}<em>Bientôt</em></span>))}
                  </div>
                </div>
              ) : (
                <div className="nav__item" key={item.label}>
                  <NavLink to={item.to} end className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}>{item.label}</NavLink>
                </div>
              ),
            )}
          </nav>
          <button className={`burger ${open ? 'is-open' : ''}`} onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}>
            <span /><span /><span />
          </button>
        </div>
      </div>

      <nav className={`mobile-nav ${open ? 'is-open' : ''}`} aria-label="Navigation mobile">
        {NAV.map((item) => (
          <div className="mobile-nav__group" key={item.label}>
            {item.children ? (
              <>
                <span className="mobile-nav__title">{item.label}</span>
                <div className="mobile-nav__sub">
                  {item.children.map((c) => (c.to
                    ? <Link key={c.label} to={c.to} className={pathname === c.to ? 'is-active' : ''}>{c.label}</Link>
                    : <span key={c.label}>{c.label} — Bientôt</span>))}
                </div>
              </>
            ) : (
              <Link to={item.to} className={pathname === item.to ? 'is-active' : ''}>{item.label}</Link>
            )}
          </div>
        ))}
        <div style={{ display: 'grid', gap: 10, marginTop: 24 }}>
          <Link to="/contact" className="btn btn--block">Nous contacter</Link>
          <Link to={account} className="btn btn--line btn--block">Mon Compte</Link>
        </div>
      </nav>
    </header>
  );
}
