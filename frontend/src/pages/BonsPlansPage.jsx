import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Construction, CreditCard, Lightbulb, Phone, X, ZoomIn } from 'lucide-react';
import { useApi } from '../lib/api';
import { limit } from '../lib/format';
import { CardSkeleton, PageBanner, Reveal, SecTitle } from '../components/ui';

function useModalKeys(onClose, extra) {
  useEffect(() => {
    const k = (e) => { if (e.key === 'Escape') onClose(); extra?.(e); };
    window.addEventListener('keydown', k);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = ''; };
  }, [onClose, extra]);
}

function ZencardDialog({ onClose }) {
  useModalKeys(onClose);
  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()} role="dialog" aria-modal="true" aria-label="Recharge ZenCard">
      <div className="dialog">
        <button className="dialog__close" onClick={onClose} aria-label="Fermer"><X size={20} /></button>
        <div className="dialog__ico"><CreditCard size={32} /></div>
        <h2 style={{ fontSize: 23 }}>Recharge ZenCard</h2>
        <p className="muted" style={{ margin: '6px 0 20px' }}>Rechargez votre carte avantages en quelques clics.</p>
        <div className="alert" style={{ background: 'var(--gold-soft)', color: 'var(--gold-dark)', textAlign: 'left' }}>
          <Construction size={22} />
          <div><b style={{ display: 'block' }}>Service bientôt disponible</b>La recharge en ligne est en cours de déploiement. Contactez-nous pour toute urgence.</div>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/contact" className="btn"><Phone size={16} />Nous contacter</Link>
          <button className="btn btn--outline" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
}

function Viewer({ items, index, onClose, onMove }) {
  const keys = useCallback((e) => { if (e.key === 'ArrowRight') onMove(1); if (e.key === 'ArrowLeft') onMove(-1); }, [onMove]);
  useModalKeys(onClose, keys);
  const a = items[index];
  return (
    <div className="overlay" style={{ background: 'rgba(8,10,35,.92)' }} onClick={(e) => e.target === e.currentTarget && onClose()} role="dialog" aria-modal="true" aria-label={a.title}>
      <button className="viewer__close" onClick={onClose} aria-label="Fermer"><X size={22} /></button>
      {items.length > 1 && <button className="viewer__btn viewer__btn--prev" onClick={() => onMove(-1)} aria-label="Affiche précédente"><ChevronLeft size={26} /></button>}
      <div className="viewer">
        <img src={a.card_image} alt={a.title} />
        <div className="viewer__cap">{a.title}<small>{index + 1} / {items.length}</small></div>
      </div>
      {items.length > 1 && <button className="viewer__btn viewer__btn--next" onClick={() => onMove(1)} aria-label="Affiche suivante"><ChevronRight size={26} /></button>}
    </div>
  );
}

export default function BonsPlansPage() {
  const { data, loading } = useApi('/articles?type=bon_plan');
  const items = data || [];
  const affiches = items.filter((a) => a.card_image);
  const textes = items.filter((a) => !a.card_image);
  const [zencard, setZencard] = useState(false);
  const [view, setView] = useState(null);
  const closeZ = useCallback(() => setZencard(false), []);
  const closeV = useCallback(() => setView(null), []);
  const move = useCallback((d) => setView((i) => (i + d + affiches.length) % affiches.length), [affiches.length]);

  return (
    <main>
      <PageBanner image="/storage/kapi/banner_articles.jpg" label="Kapi Consult" title="Bons Plans & ZenCard"
        sub="Offres spéciales, promotions et avantages exclusifs sélectionnés pour vous." crumbs={[{ label: 'Bons Plans' }, { label: 'Offres & promotions' }]}>
        <div style={{ display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn--gold" onClick={() => setZencard(true)}><CreditCard size={18} />Recharger ma ZenCard</button>
          <div style={{ display: 'flex', gap: 28 }}>
            <div><b style={{ fontFamily: 'var(--head-font)', fontSize: 26, color: '#fff' }}>{items.length}</b><div className="small" style={{ textTransform: 'uppercase', letterSpacing: '.08em', opacity: .7 }}>Offres actives</div></div>
            <div><b style={{ fontFamily: 'var(--head-font)', fontSize: 26, color: 'var(--gold)' }}>ZenCard</b><div className="small" style={{ textTransform: 'uppercase', letterSpacing: '.08em', opacity: .7 }}>Votre carte avantages</div></div>
          </div>
        </div>
      </PageBanner>

      <section className="sec sec--bg">
        <div className="wrap">
          <SecTitle title="Nos bons plans du moment" hl="bons plans" sub="Offres & Promotions" center />
          <div className="posters">
            {loading ? <CardSkeleton n={4} ratio="3 / 4" /> : affiches.map((a, i) => (
              <Reveal key={a.id} delay={(i % 4) * 60}>
                <button className="poster" onClick={() => setView(i)} aria-label={`Agrandir : ${a.title}`}>
                  <div className="poster__img">
                    <img src={a.card_image} alt={a.title} loading="lazy" />
                    <span className="pill pill--gold card__tag">{a.category === 'zencard' ? 'ZenCard' : a.badge}</span>
                    <span className="poster__zoom"><ZoomIn size={18} /></span>
                  </div>
                  <div className="poster__body"><b>{a.title}</b><ArrowRight size={16} color="var(--brand)" /></div>
                </button>
              </Reveal>
            ))}
          </div>
          {textes.length > 0 && (
            <div className="grid g-2" style={{ marginTop: 32 }}>
              {textes.map((a) => (
                <Reveal key={a.id} className="feature feature--gold">
                  <div className="feature__ico"><Lightbulb size={26} /></div>
                  <span className="pill pill--gold" style={{ marginBottom: 10 }}>{a.badge}</span>
                  <h3>{a.title}</h3>
                  <p style={{ marginBottom: 14 }}>{limit(a.content, 120)}</p>
                  <Link to={`/articles/${a.slug}`} className="link">Voir le détail <ArrowRight size={15} /></Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {zencard && <ZencardDialog onClose={closeZ} />}
      {view != null && affiches[view] && <Viewer items={affiches} index={view} onClose={closeV} onMove={move} />}
    </main>
  );
}
