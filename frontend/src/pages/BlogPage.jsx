import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, User } from 'lucide-react';
import { useApi } from '../lib/api';
import { dateShort, limit } from '../lib/format';
import { CardSkeleton, Empty, PageBanner, Reveal, SearchField, norm, readingTime } from '../components/ui';
import { ArticleCard } from '../components/cards';

export default function BlogPage() {
  const { data, loading } = useApi('/articles?type=blog');
  const [q, setQ] = useState('');
  const list = (data || []).filter((a) => norm(a.title + a.content).includes(norm(q)));
  const [une, ...autres] = list;

  return (
    <main>
      <PageBanner image="/storage/kapi/banner_articles.jpg" label="Kapi Consult" title="Blog"
        sub="Conseils, tendances RH et articles de fond par nos experts." crumbs={[{ label: 'Publications' }, { label: 'Blog' }]} />
      <section className="sec sec--bg">
        <div className="wrap">
          <div className="toolbar">
            <SearchField value={q} onChange={setQ} placeholder="Rechercher un article" />
            {!loading && <span className="small muted">{list.length} article{list.length > 1 ? 's' : ''}</span>}
          </div>
          {loading && <div className="grid g-3"><CardSkeleton n={3} /></div>}
          {une && (
            <Reveal className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', marginBottom: 36 }}>
              <div className="card__img" style={{ aspectRatio: 'auto', minHeight: 320 }}>
                {une.card_image && <img src={une.card_image} alt={une.title} />}
                <span className="pill pill--gold card__tag">À la une</span>
              </div>
              <div className="card__body" style={{ padding: 'clamp(26px, 4vw, 44px)', justifyContent: 'center', gap: 14 }}>
                <h2 className="t-lg">{une.title}</h2>
                <p className="muted">{limit(une.content, 180)}</p>
                <div className="card__meta" style={{ gap: 16, flexWrap: 'wrap' }}>
                  <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}><Calendar size={14} />{dateShort(une.published_at)}</span>
                  <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}><User size={14} />par {une.author}</span>
                  <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}><Clock size={14} />{readingTime(une.content)} min de lecture</span>
                </div>
                <Link to={`/articles/${une.slug}`} className="btn" style={{ alignSelf: 'flex-start', marginTop: 6 }}>Lire l'article <ArrowRight size={16} /></Link>
              </div>
            </Reveal>
          )}
          {autres.length > 0 && <div className="grid g-3">{autres.map((a, i) => <Reveal key={a.id} delay={(i % 3) * 80}><ArticleCard a={a} excerpt={0} /></Reveal>)}</div>}
          {!loading && !list.length && <Empty title="Aucun article trouvé">Essayez un autre mot-clé.</Empty>}
        </div>
      </section>
    </main>
  );
}
