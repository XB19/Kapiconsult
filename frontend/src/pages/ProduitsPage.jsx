import { useSearchParams } from 'react-router-dom';
import { useApi } from '../lib/api';
import { CardSkeleton, PageBanner, Reveal } from '../components/ui';
import { ProductCard } from '../components/cards';

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
      <PageBanner image="/storage/kapi/banner_produits.jpg" label="Kapi Consult" title="Nos Produits"
        sub="Des solutions et outils conçus pour optimiser votre gestion." crumbs={[{ label: 'Nos produits' }]} />
      <section className="sec sec--bg">
        <div className="wrap">
          <div className="tabs tabs--center" role="tablist" aria-label="Catégories">
            <button role="tab" aria-selected={!categorie} className={`tab ${!categorie ? 'is-active' : ''}`} onClick={() => pick('')}>Tous<sup>{all.length}</sup></button>
            {categories.map((c) => (
              <button key={c} role="tab" aria-selected={categorie === c} className={`tab ${categorie === c ? 'is-active' : ''}`} onClick={() => pick(c)}>
                {c}<sup>{all.filter((p) => p.categorie === c).length}</sup>
              </button>
            ))}
          </div>
          <div className="grid g-3">
            {loading ? <CardSkeleton n={6} /> : list.map((p, i) => <Reveal key={p.id} delay={(i % 3) * 80}><ProductCard p={p} /></Reveal>)}
          </div>
        </div>
      </section>
    </main>
  );
}
