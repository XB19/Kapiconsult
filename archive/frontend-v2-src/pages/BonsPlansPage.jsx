import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../lib/api';
import { limit } from '../lib/format';
import { Arrow, CardSkeleton, PageHead, Reveal, SectionHead } from '../components/ui';

function ZencardModal({ onClose }) {
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = ''; };
  }, [onClose]);
  return (
    <div className="modal-bg" onClick={(e) => e.target === e.currentTarget && onClose()} role="dialog" aria-modal="true" aria-label="Recharge ZenCard">
      <div className="modal">
        <button className="modal-close" onClick={onClose} aria-label="Fermer">✕</button>
        <div className="value-ico" style={{ margin: '0 auto 20px', width: 72, height: 72, fontSize: 32 }}>💳</div>
        <h2 className="h3">Recharge ZenCard</h2>
        <p className="muted" style={{ margin: '8px 0 22px' }}>Rechargez votre carte avantages en quelques clics.</p>
        <div className="alert alert-info" style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'var(--gold-soft)', color: '#8B6914', borderColor: '#f0d896' }}>
          <span style={{ fontSize: 26 }}>🚧</span>
          <b>Service bientôt disponible</b>
          <span style={{ fontWeight: 500 }}>La recharge en ligne est en cours de déploiement. Contactez-nous pour toute urgence.</span>
        </div>
        <div className="cta-actions" style={{ justifyContent: 'center' }}>
          <Link to="/contact" className="btn">📞 Nous contacter</Link>
          <button className="btn btn-outline" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
}

function Lightbox({ items, index, onClose, onMove }) {
  useEffect(() => {
    const k = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onMove(1);
      if (e.key === 'ArrowLeft') onMove(-1);
    };
    window.addEventListener('keydown', k);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = ''; };
  }, [onClose, onMove]);
  const a = items[index];
  return (
    <div className="modal-bg" style={{ background: 'rgba(5,7,25,.9)' }} onClick={(e) => e.target === e.currentTarget && onClose()} role="dialog" aria-modal="true" aria-label={a.title}>
      <button className="lb-close" onClick={onClose} aria-label="Fermer">✕</button>
      {items.length > 1 && <button className="lb-nav prev" onClick={() => onMove(-1)} aria-label="Précédent">‹</button>}
      <div className="lightbox" key={a.id}>
        <img src={a.card_image} alt={a.title} />
        <div className="lightbox-cap">{a.title}<small>{index + 1} / {items.length} · ← → pour naviguer</small></div>
      </div>
      {items.length > 1 && <button className="lb-nav next" onClick={() => onMove(1)} aria-label="Suivant">›</button>}
    </div>
  );
}

export default function BonsPlansPage() {
  const { data, loading } = useApi('/articles?type=bon_plan');
  const items = data || [];
  const affiches = items.filter((a) => a.card_image);
  const [zencard, setZencard] = useState(false);
  const [lb, setLb] = useState(null);
  const cats = [...new Set(items.map((a) => a.category).filter(Boolean))];
  const [cat, setCat] = useState('all');

  const closeZ = useCallback(() => setZencard(false), []);
  const closeLb = useCallback(() => setLb(null), []);
  const move = useCallback((d) => setLb((i) => (i + d + affiches.length) % affiches.length), [affiches.length]);

  return (
    <main>
      <PageHead image="/storage/kapi/banner_articles.jpg" tag="Kapi Consult" title={<>Bons Plans <span className="italic-accent">&amp;</span> ZenCard</>}
        sub="Offres spéciales, promotions et avantages exclusifs sélectionnés pour vous." crumbs={[{ label: 'Publications' }, { label: 'Bons Plans' }]}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap', marginTop: 30 }}>
          <button className="btn btn-gold btn-lg" onClick={() => setZencard(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="3" /><path d="M2 10h20" /></svg>
            Recharger ma ZenCard
          </button>
          <div style={{ display: 'flex', gap: 28 }}>
            <div><b className="display" style={{ fontSize: 30 }}>{items.length}</b><div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.55)' }}>Offres actives</div></div>
            <div><b className="display" style={{ fontSize: 30, color: 'var(--gold-2)' }}>ZenCard</b><div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.55)' }}>Votre carte avantages</div></div>
          </div>
        </div>
      </PageHead>

      <section className="section bg-paper">
        <div className="container">
          <SectionHead center tag="Offres & Promotions" title="Nos bons plans du moment" />
          {cats.length > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}>
              <div className="tabs">
                <button className={`tab ${cat === 'all' ? 'active' : ''}`} onClick={() => setCat('all')}>Tous</button>
                {cats.map((c) => <button key={c} className={`tab ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>)}
              </div>
            </div>
          )}
          <div className="bp-grid">
            {loading ? <CardSkeleton n={4} ratio="3 / 4" /> : items.filter((a) => cat === 'all' || a.category === cat).map((a, i) => (
              <Reveal key={a.id} delay={(i % 4) * 80}>
                {a.card_image ? (
                  <button className="bp-card" onClick={() => setLb(affiches.indexOf(a))} aria-label={`Agrandir : ${a.title}`}>
                    <span className="badge">{a.category === 'zencard' ? 'ZenCard' : a.badge}</span>
                    <div className="img"><img src={a.card_image} alt={a.title} loading="lazy" /></div>
                    <div className="foot"><span>{a.title}</span><span style={{ color: 'var(--brand)' }}>→</span></div>
                  </button>
                ) : (
                  <div className="value-card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="value-ico">💡</div>
                    <span className="badge" style={{ alignSelf: 'flex-start', marginBottom: 12 }}>{a.badge}</span>
                    <h3>{a.title}</h3>
                    <p style={{ marginBottom: 18 }}>{limit(a.content, 120)}</p>
                    <Link to={`/articles/${a.slug}`} className="link-arrow" style={{ marginTop: 'auto' }}>Voir le détail <span>→</span></Link>
                  </div>
                )}
              </Reveal>
            ))}
          </div>
          <Reveal style={{ textAlign: 'center', marginTop: 48 }}>
            <Link to="/contact" className="btn btn-outline">Une question sur une offre ? Contactez-nous <Arrow /></Link>
          </Reveal>
        </div>
      </section>

      {zencard && <ZencardModal onClose={closeZ} />}
      {lb != null && affiches[lb] && <Lightbox items={affiches} index={lb} onClose={closeLb} onMove={move} />}
    </main>
  );
}
