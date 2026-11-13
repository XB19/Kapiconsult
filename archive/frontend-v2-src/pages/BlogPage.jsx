import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../lib/api';
import { dateShort, limit } from '../lib/format';
import { Arrow, CardSkeleton, Empty, PageHead, Reveal, readingTime } from '../components/ui';
import { ArticleCard } from '../components/cards';
import { SearchBar, norm } from './ActualitesPage';

export default function BlogPage() {
  const { data, loading } = useApi('/articles?type=blog');
  const [q, setQ] = useState('');
  const list = (data || []).filter((a) => norm(a.title + a.content).includes(norm(q)));
  const [une, ...autres] = list;

  return (
    <main>
      <PageHead image="/storage/kapi/banner_articles.jpg" tag="Kapi Consult" title="Blog"
        sub="Conseils, tendances RH et articles de fond par nos experts." crumbs={[{ label: 'Publications' }, { label: 'Blog' }]} />
      <section className="section">
        <div className="container">
          <SearchBar value={q} onChange={setQ} placeholder="Rechercher un article…" count={loading ? null : list.length} />
          {loading && <div className="grid grid-3"><CardSkeleton n={3} /></div>}

          {une && (
            <Reveal className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', marginBottom: 48, borderRadius: 'var(--radius-lg)' }}>
              <div className="card-media" style={{ aspectRatio: 'auto', minHeight: 340 }}>
                {une.card_image && <img src={une.card_image} alt={une.title} />}
                <span className="badge">À la une</span>
              </div>
              <div className="card-body" style={{ padding: 'clamp(28px, 4vw, 52px)', justifyContent: 'center', gap: 16 }}>
                <span className="card-meta">{dateShort(une.published_at)} · {readingTime(une.content)} min de lecture</span>
                <h2 className="h3" style={{ fontSize: 'clamp(26px, 2.6vw, 36px)' }}>{une.title}</h2>
                <p className="lead" style={{ fontSize: 16 }}>{limit(une.content, 180)}</p>
                <div className="author" style={{ margin: '6px 0 12px' }}>
                  <div className="avatar">{(une.author || 'K')[0]}</div>
                  <div><b style={{ display: 'block', fontSize: 14 }}>{une.author}</b><span className="muted" style={{ fontSize: 13 }}>Kapi Consult</span></div>
                </div>
                <Link to={`/articles/${une.slug}`} className="btn" style={{ alignSelf: 'flex-start' }}>Lire l'article <Arrow /></Link>
              </div>
            </Reveal>
          )}

          {autres.length > 0 && (
            <div className="grid grid-3">
              {autres.map((a, i) => <Reveal key={a.id} delay={(i % 3) * 100}><ArticleCard a={a} excerpt={0} showBadge={false} /></Reveal>)}
            </div>
          )}
          {!loading && !list.length && <Empty title="Aucun article trouvé">Essayez un autre mot-clé.</Empty>}
        </div>
      </section>
    </main>
  );
}
