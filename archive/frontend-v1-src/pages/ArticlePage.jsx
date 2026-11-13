import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useApi } from '../lib/api';
import { dateFr, dateShort } from '../lib/format';
import { hover, Loading } from '../components/Heroes';
import NotFoundPage from './NotFoundPage';

const LIST = { actualite: ['/actualites', 'Actualités'], blog: ['/blog', 'Blog'], bon_plan: ['/bons-plans', 'Bons Plans'] };

export default function ArticlePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data, error, loading } = useApi(`/articles/${slug}`);

  useEffect(() => {
    if (data?.article) document.title = `${data.article.title} — Kapi Consult`;
  }, [data]);

  if (loading) return <main><Loading /></main>;
  if (error || !data) return <NotFoundPage />;
  const { article: a, similaires } = data;
  const [listUrl, listName] = LIST[a.type];

  return (
    <main>
      <section style={{ padding: '60px 0' }}>
        <div className="container" style={{ maxWidth: '840px' }}>
          <div style={{ fontSize: '13px', color: 'var(--gray)', marginBottom: '28px' }}>
            <Link to="/" style={{ color: 'var(--blue-mid)' }}>Accueil</Link>
            {' / '}<Link to={listUrl} style={{ color: 'var(--blue-mid)' }}>{listName}</Link>
            {' / '}{a.title}
          </div>

          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ background: 'var(--blue-pale)', color: 'var(--blue-mid)', fontSize: '12px', fontWeight: 700, padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase' }}>{a.badge}</span>
              {a.published_at && <span style={{ fontSize: '13px', color: 'var(--gray)' }}>{dateShort(a.published_at)}</span>}
            </div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '36px', fontWeight: 700, color: 'var(--blue-deep)', lineHeight: 1.3, marginBottom: '16px' }}>{a.title}</h1>
            {a.author && (
              <div style={{ fontSize: '14px', color: 'var(--gray)' }}>Par <strong style={{ color: 'var(--black)' }}>{a.author}</strong></div>
            )}
          </div>

          {a.image && (
            <div style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '36px' }}>
              <img src={a.image} alt={a.title} style={{ width: '100%', maxHeight: '420px', objectFit: 'cover' }} />
            </div>
          )}

          {/* Contenu : texte brut avec retours à la ligne, comme nl2br(e()) */}
          <div style={{ fontSize: '16px', color: 'var(--black)', lineHeight: 1.9, marginBottom: '48px', whiteSpace: 'pre-line' }}>
            {a.content}
          </div>

          <div style={{ borderTop: '1px solid #E8EAF0', paddingTop: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate(-1); }} style={{ fontSize: '14px', color: 'var(--blue-mid)', fontWeight: 600 }}>← Retour</a>
            <div style={{ fontSize: '14px', color: 'var(--gray)' }}>Publié le {dateFr(a.published_at)}</div>
          </div>
        </div>
      </section>

      {similaires.length > 0 && (
        <section style={{ padding: '60px 0', background: 'var(--light)' }}>
          <div className="container">
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '26px', fontWeight: 700, color: 'var(--blue-deep)', marginBottom: '28px' }}>Articles similaires</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px' }}>
              {similaires.map((s) => (
                <Link key={s.id} to={`/articles/${s.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'var(--white)', border: '1px solid #E8EAF0', borderRadius: '14px', overflow: 'hidden', transition: 'box-shadow 0.3s' }}
                    {...hover({ boxShadow: '0 6px 24px rgba(0,51,102,0.1)' }, { boxShadow: 'none' })}>
                    {s.image ? (
                      <div style={{ height: '140px', overflow: 'hidden' }}><img src={s.image} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
                    ) : (
                      <div style={{ height: '140px', background: 'var(--blue-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px' }}>📰</div>
                    )}
                    <div style={{ padding: '16px' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--blue-deep)', lineHeight: 1.4 }}>{s.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
