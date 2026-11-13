import { useState } from 'react';
import { useApi } from '../lib/api';
import { CardSkeleton, Empty, PageHead, Reveal, SearchIcon } from '../components/ui';
import { ArticleCard } from '../components/cards';

export const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export function SearchBar({ value, onChange, placeholder, count }) {
  return (
    <Reveal style={{ display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: 40 }}>
      <label className="search" style={{ flex: '1 1 320px', maxWidth: 480 }}>
        <span className="sr-only">{placeholder}</span>
        <SearchIcon />
        <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      </label>
      {count != null && <span className="muted" style={{ fontWeight: 600, fontSize: 14 }}>{count} résultat{count > 1 ? 's' : ''}</span>}
    </Reveal>
  );
}

export default function ActualitesPage() {
  const { data, loading } = useApi('/articles?type=actualite');
  const [q, setQ] = useState('');
  const list = (data || []).filter((a) => norm(a.title + a.content).includes(norm(q)));
  return (
    <main>
      <PageHead image="/storage/kapi/banner_articles.jpg" tag="Kapi Consult" title="Actualités"
        sub="Restez informé de nos dernières nouvelles et événements." crumbs={[{ label: 'Publications' }, { label: 'Actualités' }]} />
      <section className="section">
        <div className="container">
          <SearchBar value={q} onChange={setQ} placeholder="Rechercher une actualité…" count={loading ? null : list.length} />
          <div className="grid grid-3">
            {loading ? <CardSkeleton n={3} /> : list.map((a, i) => (
              <Reveal key={a.id} delay={(i % 3) * 100}><ArticleCard a={a} excerpt={90} /></Reveal>
            ))}
          </div>
          {!loading && !list.length && <Empty title="Aucune actualité trouvée">Essayez un autre mot-clé.</Empty>}
        </div>
      </section>
    </main>
  );
}
