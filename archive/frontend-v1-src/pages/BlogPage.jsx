import { Link } from 'react-router-dom';
import { useApi } from '../lib/api';
import { dateShort, limit } from '../lib/format';
import { SectionHero, hover } from '../components/Heroes';

export default function BlogPage() {
  const { data } = useApi('/articles?type=blog');
  const [une, ...autres] = data || [];
  return (
    <main>
      <SectionHero image="/storage/kapi/banner_articles.jpg" title="Blog" sub="Conseils, tendances RH et articles de fond par nos experts." />
      <section style={{ padding: '70px 0' }}>
        <div className="container">
          {une && (
            <div className="g-mob" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '60px', background: 'var(--white)', border: '1px solid #E8EAF0', borderRadius: '20px', overflow: 'hidden' }}>
              <div style={{ minHeight: '300px', overflow: 'hidden' }}>
                {une.card_image && (
                  <img src={une.card_image} alt={une.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s' }}
                    {...hover({ transform: 'scale(1.04)' }, { transform: 'scale(1)' })} />
                )}
              </div>
              <div style={{ padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>À la une</div>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '28px', fontWeight: 700, color: 'var(--blue-deep)', marginBottom: '14px', lineHeight: 1.3 }}>{une.title}</h2>
                <p style={{ fontSize: '15px', color: 'var(--gray)', lineHeight: 1.7, marginBottom: '20px' }}>{limit(une.content, 180)}</p>
                <div style={{ fontSize: '13px', color: 'var(--gray)', marginBottom: '20px' }}>{dateShort(une.published_at)} — par {une.author}</div>
                <Link to={`/articles/${une.slug}`} className="btn-primary" style={{ alignSelf: 'flex-start', padding: '12px 24px', fontSize: '14px' }}>Lire l'article</Link>
              </div>
            </div>
          )}

          {autres.length > 0 && (
            <div className="g-mob-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '28px' }}>
              {autres.map((a) => (
                <article key={a.id} style={{ background: 'var(--white)', border: '1px solid #E8EAF0', borderRadius: '18px', overflow: 'hidden', transition: 'all .3s' }}
                  {...hover({ transform: 'translateY(-5px)', boxShadow: '0 12px 36px rgba(0,51,102,0.12)' }, { transform: 'none', boxShadow: 'none' })}>
                  <div style={{ height: '180px', overflow: 'hidden' }}>
                    {a.card_image && (
                      <img src={a.card_image} alt={a.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s' }}
                        {...hover({ transform: 'scale(1.06)' }, { transform: 'scale(1)' })} />
                    )}
                  </div>
                  <div style={{ padding: '20px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--gold)', fontWeight: 700, marginBottom: '8px' }}>{dateShort(a.published_at)}</div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--blue-deep)', marginBottom: '10px', lineHeight: 1.4 }}>{a.title}</h3>
                    <Link to={`/articles/${a.slug}`} style={{ fontSize: '14px', color: 'var(--blue-mid)', fontWeight: 600 }}>Lire →</Link>
                  </div>
                </article>
              ))}
            </div>
          )}
          <div style={{ marginTop: '40px' }} />
        </div>
      </section>
    </main>
  );
}
