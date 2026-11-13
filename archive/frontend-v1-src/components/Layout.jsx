import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import AnnivBanner from './AnnivBanner';
import Footer from './Footer';
import meta from '../generated/meta.json';

// Associe un chemin à la clé du fichier d'origine pour reprendre <title> et description
const metaKey = (path) => (path === '/' ? 'index' : path.slice(1).replace(/[/?=&]/g, '_'));

export default function Layout() {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  // Titre + description identiques au site d'origine
  useEffect(() => {
    const m = meta[metaKey(pathname + search)] || meta[metaKey(pathname)];
    if (m?.title) document.title = m.title;
    const d = document.querySelector('meta[name="description"]');
    if (m?.desc && d) d.setAttribute('content', m.desc);
    window.scrollTo(0, 0);
  }, [pathname, search]);

  // Les liens internes du HTML d'origine (<a href="/...">) passent par le routeur React
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest('a[href]');
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      const href = a.getAttribute('href');
      if (!href.startsWith('/') || href.startsWith('//') || href.startsWith('/storage/') || href.startsWith('/api/')) return;
      e.preventDefault();
      navigate(href);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [navigate]);

  return (
    <>
      <Header />
      <AnnivBanner />
      <Outlet />
      <Footer />
    </>
  );
}
