import { Link, useSearchParams } from 'react-router-dom';
import { useApi } from '../lib/api';
import { limit } from '../lib/format';
import { SectionHero, hover } from '../components/Heroes';
import '../styles/produits.css';

const pill = (active) => ({
  padding: '8px 20px', borderRadius: '30px', fontSize: '14px', fontWeight: 500, textDecoration: 'none',
  background: active ? 'var(--blue-mid)' : 'var(--white)', color: active ? 'var(--white)' : 'var(--blue-deep)',
  border: `1px solid ${active ? 'var(--blue-mid)' : '#E8EAF0'}`,
});

export default function ProduitsPage() {
  const [params] = useSearchParams();
  const categorie = params.get('categorie') || '';
  const { data } = useApi(`/produits${categorie ? `?categorie=${encodeURIComponent(categorie)}` : ''}`);
  const produits = data?.produits || [];
  const categories = data?.categories || [];

  return (
    <main>
      <SectionHero image="/storage/kapi/banner_produits.jpg" title="Nos Produits" sub="Des solutions et outils conçus pour optimiser votre gestion." />
      <section style={{ padding: '70px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '40px' }}>
            <Link to="/nos-produits" style={pill(!categorie)}>Tous</Link>
            {categories.map((c) => (
              <Link key={c} to={`/nos-produits?categorie=${encodeURIComponent(c)}`} style={pill(c === categorie)}>{c}</Link>
            ))}
          </div>

          <div className="produits-grid">
            {produits.map((p) => (
              <Link key={p.id} to={`/nos-produits/${p.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'var(--white)', border: '1px solid #E8EAF0', borderRadius: '16px', overflow: 'hidden', transition: 'box-shadow 0.3s', height: '100%' }}
                  {...hover({ boxShadow: '0 8px 32px rgba(0,51,102,0.12)' }, { boxShadow: 'none' })}>
                  {p.image && <div style={{ height: '200px', overflow: 'hidden' }}><img src={p.image} alt={p.nom} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
                  <div style={{ padding: '20px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{p.categorie}</div>
                    <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--blue-deep)', marginBottom: '8px', lineHeight: 1.4 }}>{p.nom}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--gray)', lineHeight: 1.6, marginBottom: '14px' }}>{limit(p.description, 90)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ marginTop: '40px' }} />
        </div>
      </section>
    </main>
  );
}
