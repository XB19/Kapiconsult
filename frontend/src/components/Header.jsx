import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  ChevronDown, Menu, X, UserCircle, Wrench, Newspaper, PenLine, Tag, HelpCircle, Briefcase, Send, LayoutGrid, Database,
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { NAV } from '../content/site';

const SUB_ICONS = {
  'Kapi board select': LayoutGrid, 'Kapi data': Database, 'Actualités': Newspaper, Blog: PenLine, 'Offres & promotions': Tag, Quotidien: Wrench,
  FAQ: HelpCircle, "Offres d'emploi": Briefcase, 'Candidature spontanée': Send,
};

// Logo officiel Kapi Consult (fichier fourni), recadré sur la zone utile de l'image
export const LogoMark = ({ height = 52 }) => (
  <span className="logo__img" role="img" aria-label="Kapi Consult" style={{ height, width: Math.round(height * 3.08) }} />
);

export function Logo({ light = false }) {
  return (
    <Link to="/" className={light ? 'logo logo--light' : 'logo'} aria-label="Kapi Consult — Accueil">
      <LogoMark />
    </Link>
  );
}

// En-tête fixe : reste toujours visible en haut de l'écran
export default function Header() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const account = !user ? '/login' : user.role === 'admin' ? '/admin' : '/mon-compte';

  useEffect(() => { setOpen(false); setExpanded(null); }, [pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 10);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const isOn = (to) => to && (pathname === to || pathname.startsWith(to + '/'));
  const groupActive = (item) => item.children?.some((c) => isOn(c.to));
  const sub = (c, cls) => {
    const Icon = SUB_ICONS[c.label] || ChevronDown;
    return c.to
      ? <Link key={c.label} to={c.to} className={isOn(c.to) ? 'is-active' : ''}><Icon size={16} />{c.label}</Link>
      : <span key={c.label} className={cls}><Icon size={16} />{c.label}<em>Bientôt</em></span>;
  };

  return (
    <>
      <header className={`header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="wrap">
          <Logo />
          <nav className="nav" aria-label="Navigation principale">
            {NAV.map((item) => (
              <div className="nav__item" key={item.label}>
                {item.children ? (
                  <>
                    <button className={`nav__link ${groupActive(item) ? 'is-active' : ''}`} aria-haspopup="true">{item.label}<ChevronDown size={15} /></button>
                    <div className="nav__panel">{item.children.map((c) => sub(c))}</div>
                  </>
                ) : (
                  <NavLink to={item.to} end className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}>{item.label}</NavLink>
                )}
              </div>
            ))}
          </nav>
          <Link to={account} className="btn btn--gold btn--sm header__account"><UserCircle size={17} />Mon Compte</Link>
          <button className="burger" onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}>{open ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </header>

      <nav className={`mnav ${open ? 'is-open' : ''}`} aria-label="Navigation mobile" aria-hidden={!open}>
        {NAV.map((item) => (
          <div className="mnav__item" key={item.label}>
            {item.children ? (
              <>
                <button onClick={() => setExpanded((e) => (e === item.label ? null : item.label))} aria-expanded={expanded === item.label}>
                  {item.label}<ChevronDown size={18} style={{ transform: expanded === item.label ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
                </button>
                {expanded === item.label && <div className="mnav__sub">{item.children.map((c) => sub(c))}</div>}
              </>
            ) : (
              <Link to={item.to} className={pathname === item.to ? 'is-active' : ''}>{item.label}</Link>
            )}
          </div>
        ))}
        <Link to={account} className="btn btn--gold btn--block" style={{ marginTop: 24 }}><UserCircle size={18} />Mon Compte</Link>
      </nav>
    </>
  );
}
