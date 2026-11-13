import { useSearchParams } from 'react-router-dom';
import { useApi } from '../lib/api';
import { EntrySkeleton, PageHead, Reveal } from '../components/ui';
import { ProductEntry } from '../components/cards';

export default function ProduitsPage() {
  const [params, setParams] = useSearchParams();
  const categorie = params.get('categorie') || '';
  const { data, loading } = useApi('/produits');
  const all = data?.produits || [];
  const categories = data?.categories || [];
  const list = categorie ? all.filter((p) => p.categorie === categorie) : all;
  const pick = (c) => setParams(c ? { categorie: c } : {}, { replace: true });

  return (
    <main>
      <PageHead image="/storage/kapi/banner_produits.jpg" label="Kapi Consult" title="Nos Produits"
        sub="Des solutions et outils conçus pour optimiser votre gestion." crumbs={[{ label: 'Nos produits' }]} />
      <section className="sec">
        <div className="wrap">
          <div className="filters-line" role="tablist" aria-label="Catégories">
            <button role="tab" aria-selected={!categorie} className={!categorie ? 'is-active' : ''} onClick={() => pick('')}>Tous<sup>{all.length}</sup></button>
            {categories.map((c) => (
              <button key={c} role="tab" aria-selected={categorie === c} className={categorie === c ? 'is-active' : ''} onClick={() => pick(c)}>
                {c}<sup>{all.filter((p) => p.categorie === c).length}</sup>
              </button>
            ))}
          </div>
          <div className="entries">
            {loading ? <EntrySkeleton n={6} /> : list.map((p, i) => <Reveal key={p.id} delay={(i % 3) * 60}><ProductEntry p={p} /></Reveal>)}
          </div>
        </div>
      </section>
    </main>
  );
}
