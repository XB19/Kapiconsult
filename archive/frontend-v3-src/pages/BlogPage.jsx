import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../lib/api';
import { dateShort, limit } from '../lib/format';
import { Empty, EntrySkeleton, PageHead, Reveal, SearchField, norm, readingTime } from '../components/ui';
import { ArticleEntry } from '../components/cards';

export default function BlogPage() {
  const { data, loading } = useApi('/articles?type=blog');
  const [q, setQ] = useState('');
  const list = (data || []).filter((a) => norm(a.title + a.content).includes(norm(q)));
  const [une, ...autres] = list;

  return (
    <main>
      <PageHead image="/storage/kapi/banner_articles.jpg" label="Kapi Consult" title="Blog"
        sub="Conseils, tendances RH et articles de fond par nos experts." crumbs={[{ label: 'Publications' }, { label: 'Blog' }]} />
      <section className="sec">
        <div className="wrap">
          <div className="toolbar">
            <SearchField value={q} onChange={setQ} placeholder="Rechercher un article" />
            {!loading && <span className="small muted">{list.length} article{list.length > 1 ? 's' : ''}</span>}
          </div>
          {loading && <div className="entries"><EntrySkeleton n={3} /></div>}

          {une && (
            <Reveal className="feature">
              <Link to={`/articles/${une.slug}`} className="feature__img">{une.card_image && <img src={une.card_image} alt={une.title} />}</Link>
              <div>
                <span className="kicker" style={{ marginBottom: 14 }}>À la une</span>
                <h2 className="t-2" style={{ marginBottom: 16 }}><Link to={`/articles/${une.slug}`}>{une.title}</Link></h2>
                <p className="muted" style={{ marginBottom: 18 }}>{limit(une.content, 180)}</p>
                <p className="small muted" style={{ marginBottom: 24 }}>{dateShort(une.published_at)} — par {une.author} · {readingTime(une.content)} min de lecture</p>
                <Link to={`/articles/${une.slug}`} className="btn">Lire l'article</Link>
              </div>
            </Reveal>
          )}

          {autres.length > 0 && (
            <div className="entries">
              {autres.map((a, i) => <Reveal key={a.id} delay={(i % 3) * 60}><ArticleEntry a={a} excerpt={0} /></Reveal>)}
            </div>
          )}
          {!loading && !list.length && <Empty title="Aucun article trouvé">Essayez un autre mot-clé.</Empty>}
        </div>
      </section>
    </main>
  );
}
