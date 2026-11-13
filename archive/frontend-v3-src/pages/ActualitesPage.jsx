import { useState } from 'react';
import { useApi } from '../lib/api';
import { Empty, EntrySkeleton, PageHead, Reveal, SearchField, norm } from '../components/ui';
import { ArticleEntry } from '../components/cards';

export default function ActualitesPage() {
  const { data, loading } = useApi('/articles?type=actualite');
  const [q, setQ] = useState('');
  const list = (data || []).filter((a) => norm(a.title + a.content).includes(norm(q)));
  return (
    <main>
      <PageHead image="/storage/kapi/banner_articles.jpg" label="Kapi Consult" title="Actualités"
        sub="Restez informé de nos dernières nouvelles et événements." crumbs={[{ label: 'Publications' }, { label: 'Actualités' }]} />
      <section className="sec">
        <div className="wrap">
          <div className="toolbar">
            <SearchField value={q} onChange={setQ} placeholder="Rechercher une actualité" />
            {!loading && <span className="small muted">{list.length} publication{list.length > 1 ? 's' : ''}</span>}
          </div>
          <div className="entries">
            {loading ? <EntrySkeleton n={3} /> : list.map((a, i) => <Reveal key={a.id} delay={(i % 3) * 60}><ArticleEntry a={a} excerpt={90} /></Reveal>)}
          </div>
          {!loading && !list.length && <Empty title="Aucune actualité trouvée">Essayez un autre mot-clé.</Empty>}
        </div>
      </section>
    </main>
  );
}
