import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { Ticker } from './AnnivBanner';
import meta from '../content/meta.json';

const metaKey = (path) => (path === '/' ? 'index' : path.slice(1).replace(/[/?=&]/g, '_'));

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 700);
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <button className={`to-top ${show ? 'is-visible' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Revenir en haut de la page">
      <ArrowUp size={20} />
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
      <Ticker />
      <Outlet />
      <Footer />
      <BackToTop />
    </>
  );
}
