import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../lib/api';
import { limit } from '../lib/format';
import { EntrySkeleton, PageHead, Reveal, SecHead } from '../components/ui';

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
        <button className="dialog__close" onClick={onClose} aria-label="Fermer">×</button>
        <h2 className="t-3" style={{ fontSize: 26 }}>Recharge ZenCard</h2>
        <p className="muted" style={{ margin: '8px 0 24px' }}>Rechargez votre carte avantages en quelques clics.</p>
        <div className="notice" style={{ borderLeftColor: 'var(--gold)' }}>
          <b style={{ display: 'block', color: 'var(--ink)', marginBottom: 4 }}>Service bientôt disponible</b>
          La recharge en ligne est en cours de déploiement. Contactez-nous pour toute urgence.
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link to="/contact" className="btn">Nous contacter</Link>
          <button className="btn btn--line" onClick={onClose}>Fermer</button>
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
      <button className="viewer__close" onClick={onClose} aria-label="Fermer">×</button>
      {items.length > 1 && <button className="viewer__btn viewer__btn--prev" onClick={() => onMove(-1)} aria-label="Affiche précédente">‹</button>}
      <div className="viewer">
        <img src={a.card_image} alt={a.title} />
        <div className="viewer__cap">{a.title}<small>{index + 1} / {items.length}</small></div>
      </div>
      {items.length > 1 && <button className="viewer__btn viewer__btn--next" onClick={() => onMove(1)} aria-label="Affiche suivante">›</button>}
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
      <PageHead image="/storage/kapi/banner_articles.jpg" label="Kapi Consult" title="Bons Plans & ZenCard"
        sub="Offres spéciales, promotions et avantages exclusifs sélectionnés pour vous." crumbs={[{ label: 'Publications' }, { label: 'Bons Plans' }]}>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn--gold" onClick={() => setZencard(true)}>Recharger ma ZenCard</button>
          <span style={{ fontSize: 15 }}><b className="num" style={{ color: '#fff', fontSize: 22 }}>{items.length}</b> Offres actives · <b style={{ color: 'var(--gold-light)' }}>ZenCard</b> — Votre carte avantages</span>
        </div>
      </PageHead>

      <section className="sec">
        <div className="wrap">
          <SecHead label="Offres & Promotions" title="Nos bons plans du moment" />
          <div className="posters">
            {loading ? <EntrySkeleton n={4} ratio="3 / 4" /> : affiches.map((a, i) => (
              <Reveal key={a.id} delay={(i % 4) * 50}>
                <button className="poster" onClick={() => setView(i)} aria-label={`Agrandir : ${a.title}`}>
                  <div className="poster__img"><img src={a.card_image} alt={a.title} loading="lazy" /></div>
                  <span className="poster__title">{a.title}</span>
                  <span className="poster__meta">{a.category === 'zencard' ? 'ZenCard' : a.badge} · Agrandir</span>
                </button>
              </Reveal>
            ))}
          </div>

          {textes.length > 0 && (
            <div className="rows" style={{ marginTop: 72 }}>
              {textes.map((a, i) => (
                <Reveal key={a.id} className="row">
                  <span className="row__num">{String(affiches.length + i + 1).padStart(2, '0')}</span>
                  <div><span className="label label--gold" style={{ marginBottom: 10 }}>{a.badge}</span><h3 className="row__title">{a.title}</h3></div>
                  <div className="row__body">
                    <p style={{ marginBottom: 14 }}>{limit(a.content, 120)}</p>
                    <Link to={`/articles/${a.slug}`} className="more">Voir le détail →</Link>
                  </div>
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
