import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import meta from '../content/meta.json';

const metaKey = (path) => (path === '/' ? 'index' : path.slice(1).replace(/[/?=&]/g, '_'));

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 800);
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <button className={`to-top ${show ? 'is-visible' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Revenir en haut de la page">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
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
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <BackToTop />
    </>
  );
}
