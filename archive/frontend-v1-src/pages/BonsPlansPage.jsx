import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../lib/api';
import { limit } from '../lib/format';
import '../styles/bons-plans.css';

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue-mid)" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
);

export default function BonsPlansPage() {
  const { data } = useApi('/articles?type=bon_plan');
  const items = data || [];
  const [zencard, setZencard] = useState(false);
  const [affiche, setAffiche] = useState(null);
  const [cat, setCat] = useState('all');

  const cats = [...new Set(items.map((a) => a.category).filter(Boolean))];

  useEffect(() => {
    document.body.style.overflow = zencard || affiche ? 'hidden' : '';
  }, [zencard, affiche]);
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') { setZencard(false); setAffiche(null); } };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, []);

  return (
    <main>
      <section style={{ backgroundImage: "linear-gradient(135deg,rgba(10,14,100,0.88) 0%,rgba(8,10,45,0.94) 100%),url('/storage/kapi/banner_articles.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', padding: '96px 0 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-80px', right: '5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(184,137,42,.12),transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '3%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(80,100,240,.1),transparent 65%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold-light)', marginBottom: '16px', animation: 'fadeUp .5s ease both' }}>Kapi Consult</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(32px,5vw,50px)', fontWeight: 700, color: 'var(--white)', marginBottom: '14px', animation: 'fadeUp .6s ease .1s both' }}>
            Bons Plans{' '}
            <span style={{ background: 'linear-gradient(120deg,#F5D78E,#D4A017,#FFF0B0,#D4A017,#F5D78E)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'shimmerGold 4s linear infinite' }}>&amp;</span>
            {' '}ZenCard
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,.7)', maxWidth: '480px', margin: '0 auto 40px', lineHeight: 1.7, animation: 'fadeUp .6s ease .2s both' }}>
            Offres spéciales, promotions et avantages exclusifs sélectionnés pour vous.
          </p>
          <div style={{ animation: 'fadeUp .6s ease .35s both' }}>
            <button onClick={() => setZencard(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '16px 38px', background: 'linear-gradient(135deg,var(--gold),#c9990f)', color: 'var(--white)', fontWeight: 700, fontSize: '15px', border: 'none', borderRadius: '50px', cursor: 'pointer', boxShadow: '0 4px 24px rgba(184,137,42,.5)', animation: 'pulseRing 3s ease-in-out 2s infinite', fontFamily: "'DM Sans',sans-serif", letterSpacing: '.04em', transition: 'all .3s' }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.04)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="3" /><path d="M2 10h20" /></svg>
              Recharger ma ZenCard
            </button>
          </div>
          <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', marginTop: '44px', flexWrap: 'wrap', animation: 'fadeUp .6s ease .5s both' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '28px', fontWeight: 700, color: 'var(--white)' }}>{items.length}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.45)', letterSpacing: '.08em', textTransform: 'uppercase', marginTop: '3px' }}>Offres actives</div>
            </div>
            <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,.12)', alignSelf: 'center' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '28px', fontWeight: 700, color: 'var(--gold-light)' }}>ZenCard</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.45)', letterSpacing: '.08em', textTransform: 'uppercase', marginTop: '3px' }}>Votre carte avantages</div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal ZenCard */}
      <div className="zc-modal-bg" style={{ display: zencard ? 'flex' : 'none' }} onClick={(e) => e.target === e.currentTarget && setZencard(false)}>
        <div className="zc-modal-box">
          <button onClick={() => setZencard(false)} style={{ position: 'absolute', top: '16px', right: '18px', background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: 'var(--gray)' }}>✕</button>
          <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg,var(--gold),#c9990f)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px', fontSize: '32px', boxShadow: '0 8px 24px rgba(184,137,42,.3)' }}>💳</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '24px', fontWeight: 700, color: 'var(--blue-deep)', marginBottom: '8px' }}>Recharge ZenCard</h2>
          <p style={{ fontSize: '14px', color: 'var(--gray)', marginBottom: '24px' }}>Rechargez votre carte avantages en quelques clics.</p>
          <div style={{ background: 'linear-gradient(135deg,#FFFBEA,#FFF3CC)', border: '1px solid #F0C040', borderRadius: '14px', padding: '20px 24px', marginBottom: '24px' }}>
            <div style={{ fontSize: '28px', marginBottom: '10px' }}>🚧</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#8B6914', marginBottom: '6px' }}>Service bientôt disponible</div>
            <div style={{ fontSize: '13px', color: '#A07820', lineHeight: 1.6 }}>La recharge en ligne est en cours de déploiement. Contactez-nous pour toute urgence.</div>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" style={{ padding: '12px 28px', background: 'var(--blue-deep)', color: 'var(--white)', borderRadius: '10px', fontWeight: 600, fontSize: '14px', textDecoration: 'none' }}>📞 Nous contacter</Link>
            <button onClick={() => setZencard(false)} style={{ padding: '12px 22px', background: '#F0F2F5', color: 'var(--gray)', border: 'none', borderRadius: '10px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Fermer</button>
          </div>
        </div>
      </div>

      <section style={{ padding: '72px 0', background: '#F7F8FC' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <span className="section-tag">Offres &amp; Promotions</span>
            <h2 className="section-title">Nos bons plans du moment</h2>
          </div>

          {cats.length > 1 && (
            <div className="cat-filters">
              <button className={`cat-btn${cat === 'all' ? ' active' : ''}`} onClick={() => setCat('all')}>Tous</button>
              {cats.map((c) => (
                <button key={c} className={`cat-btn${cat === c ? ' active' : ''}`} onClick={() => setCat(c)}>{c}</button>
              ))}
            </div>
          )}

          <div className="bp-grid" id="bp-grid">
            {items.map((a, i) => (
              <div key={a.id} className="bp-item" data-cat={a.category}
                style={{ animation: `fadeUp .5s ease ${i * 0.05}s both`, display: cat === 'all' || a.category === cat ? 'block' : 'none' }}>
                {a.card_image ? (
                  <div className="bp-card" onClick={() => setAffiche({ src: a.card_image, titre: a.title })}>
                    <span className="bp-badge">{a.category === 'zencard' ? 'ZenCard' : a.badge}</span>
                    <img className="bp-img" src={a.card_image} alt={a.title} />
                    <div className="bp-overlay"><span style={{ color: 'var(--white)', fontSize: '13px', fontWeight: 600 }}>🔍 Agrandir</span></div>
                    <div className="bp-footer"><span className="bp-name">{a.title}</span><Arrow /></div>
                  </div>
                ) : (
                  <div className="bp-text-card">
                    <div style={{ width: '44px', height: '44px', background: 'var(--gold-pale)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '14px' }}>💡</div>
                    <span style={{ display: 'inline-block', background: 'var(--gold)', color: 'var(--white)', fontSize: '10px', fontWeight: 800, padding: '3px 10px', borderRadius: '20px', marginBottom: '10px', letterSpacing: '.08em', textTransform: 'uppercase' }}>{a.badge}</span>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--blue-deep)', marginBottom: '8px', lineHeight: 1.4 }}>{a.title}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--gray)', lineHeight: 1.65, marginBottom: '16px' }}>{limit(a.content, 120)}</p>
                    <Link to={`/articles/${a.slug}`} style={{ fontSize: '13px', color: 'var(--blue-mid)', fontWeight: 700, textDecoration: 'none' }}>Voir le détail →</Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <div className="lb-bg" style={{ display: affiche ? 'flex' : 'none' }} onClick={(e) => e.target === e.currentTarget && setAffiche(null)}>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '640px', width: '94%' }}>
          <button onClick={() => setAffiche(null)} style={{ position: 'absolute', top: '-44px', right: 0, background: 'rgba(255,255,255,.18)', border: '1px solid rgba(255,255,255,.25)', color: 'var(--white)', fontSize: '18px', borderRadius: '50%', width: '38px', height: '38px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>✕</button>
          {affiche && <img src={affiche.src} alt={affiche.titre} className="lb-img" />}
          <div style={{ color: 'rgba(255,255,255,.8)', marginTop: '16px', fontSize: '14px', fontWeight: 600, textAlign: 'center', background: 'rgba(0,0,0,.35)', padding: '8px 20px', borderRadius: '20px', backdropFilter: 'blur(4px)' }}>{affiche?.titre}</div>
        </div>
      </div>
    </main>
  );
}
