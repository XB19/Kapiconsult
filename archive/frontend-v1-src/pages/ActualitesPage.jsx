import { Link } from 'react-router-dom';
import { useApi } from '../lib/api';
import { dateShort, limit } from '../lib/format';
import { SectionHero, hover } from '../components/Heroes';

export default function ActualitesPage() {
  const { data } = useApi('/articles?type=actualite');
  return (
    <main>
      <SectionHero image="/storage/kapi/banner_articles.jpg" title="Actualités" sub="Restez informé de nos dernières nouvelles et événements." />
      <section style={{ padding: '70px 0' }}>
        <div className="container">
          <div className="g-mob-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px' }}>
            {(data || []).map((a) => (
              <article key={a.id}
                style={{ background: 'var(--white)', border: '1px solid #E8EAF0', borderRadius: '18px', overflow: 'hidden', transition: 'all .3s', display: 'flex', flexDirection: 'column' }}
                {...hover({ transform: 'translateY(-5px)', boxShadow: '0 12px 40px rgba(0,51,102,0.13)' }, { transform: 'none', boxShadow: 'none' })}>
                <div style={{ height: '190px', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                  {a.card_image && (
                    <img src={a.card_image} alt={a.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s ease' }}
                      {...hover({ transform: 'scale(1.06)' }, { transform: 'scale(1)' })} />
                  )}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,transparent 50%,rgba(8,10,45,.45) 100%)' }} />
                  <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'var(--gold)', color: 'var(--white)', fontSize: '10px', fontWeight: 800, padding: '3px 10px', borderRadius: '20px', letterSpacing: '.08em', textTransform: 'uppercase' }}>{a.badge}</div>
                </div>
                <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '8px' }}>{dateShort(a.published_at)}</div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--blue-deep)', marginBottom: '10px', lineHeight: 1.4, flex: 1 }}>{a.title}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--gray)', lineHeight: 1.6, marginBottom: '16px' }}>{limit(a.content, 90)}</p>
                  <Link to={`/articles/${a.slug}`} style={{ fontSize: '13px', color: 'var(--blue-mid)', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    Lire la suite <span>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <div style={{ marginTop: '44px', display: 'flex', justifyContent: 'center' }} />
        </div>
      </section>
    </main>
  );
}
