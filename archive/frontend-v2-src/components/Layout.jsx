import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { AnnivBanner } from './AnnivBanner';
import meta from '../content/meta.json';

const metaKey = (path) => (path === '/' ? 'index' : path.slice(1).replace(/[/?=&]/g, '_'));

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <button className={`to-top ${show ? 'show' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Revenir en haut">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
    </button>
  );
}

export default function Layout() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    const m = meta[metaKey(pathname + search)] || meta[metaKey(pathname)];
    if (m?.title) document.title = m.title;
    const d = document.querySelector('meta[name="description"]');
    if (m?.desc && d) d.setAttribute('content', m.desc);
  }, [pathname, search]);

  // Remonte en haut à chaque changement de page (pas lors d'un simple filtre)
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);

  return (
    <>
      <AnnivBanner />
      <Header />
      <Outlet />
      <Footer />
      <BackToTop />
    </>
  );
}
