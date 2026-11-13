import { useSearchParams } from 'react-router-dom';
import { useApi } from '../lib/api';
import { CardSkeleton, PageHead, Reveal } from '../components/ui';
import { ProductCard } from '../components/cards';

export default function ProduitsPage() {
  const [params, setParams] = useSearchParams();
  const categorie = params.get('categorie') || '';
  // On charge tout une fois puis on filtre côté client : changement de catégorie instantané
  const { data, loading } = useApi('/produits');
  const all = data?.produits || [];
  const categories = data?.categories || [];
  const list = categorie ? all.filter((p) => p.categorie === categorie) : all;
  const pick = (c) => setParams(c ? { categorie: c } : {}, { replace: true });

  return (
    <main>
      <PageHead image="/storage/kapi/banner_produits.jpg" tag="Kapi Consult" title="Nos Produits"
        sub="Des solutions et outils conçus pour optimiser votre gestion." crumbs={[{ label: 'Nos produits' }]} />
      <section className="section">
        <div className="container">
          <Reveal style={{ display: 'flex', justifyContent: 'center', marginBottom: 44 }}>
            <div className="tabs" role="tablist" aria-label="Catégories">
              <button role="tab" aria-selected={!categorie} className={`tab ${!categorie ? 'active' : ''}`} onClick={() => pick('')}>
                Tous <span className="count">{all.length}</span>
              </button>
              {categories.map((c) => (
                <button key={c} role="tab" aria-selected={categorie === c} className={`tab ${categorie === c ? 'active' : ''}`} onClick={() => pick(c)}>
                  {c} <span className="count">{all.filter((p) => p.categorie === c).length}</span>
                </button>
              ))}
            </div>
          </Reveal>
          <div className="grid grid-3" key={categorie}>
            {loading ? <CardSkeleton n={6} /> : list.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 90}><ProductCard p={p} /></Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
