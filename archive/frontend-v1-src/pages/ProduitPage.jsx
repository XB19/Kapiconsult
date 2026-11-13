import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApi } from '../lib/api';
import { hover, Loading } from '../components/Heroes';
import NotFoundPage from './NotFoundPage';
import '../styles/produits.css';

export default function ProduitPage() {
  const { slug } = useParams();
  const { data, error, loading } = useApi(`/produits/${slug}`);

  useEffect(() => {
    if (data?.produit) document.title = `${data.produit.nom} — Kapi Consult`;
  }, [data]);

  if (loading) return <main><Loading /></main>;
  if (error || !data) return <NotFoundPage />;
  const { produit: p, similaires } = data;

  return (
    <main>
      <section style={{ padding: '60px 0' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ fontSize: '13px', color: 'var(--gray)', marginBottom: '28px' }}>
            <Link to="/" style={{ color: 'var(--blue-mid)' }}>Accueil</Link>
            {' / '}<Link to="/nos-produits" style={{ color: 'var(--blue-mid)' }}>Produits</Link>
            {' / '}{p.nom}
          </div>

          <div className="produit-detail-grid">
            <div>
              {p.image && (
                <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #E8EAF0' }}>
                  <img src={p.image} alt={p.nom} style={{ width: '100%', display: 'block' }} />
                </div>
              )}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>{p.categorie}</div>
              <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '30px', fontWeight: 700, color: 'var(--blue-deep)', marginBottom: '16px', lineHeight: 1.3 }}>{p.nom}</h1>
              <div style={{ fontSize: '15px', color: 'var(--gray)', lineHeight: 1.8, marginBottom: '28px' }}>{p.description}</div>
              {(p.contact_tel || p.contact_email) && (
                <div style={{ background: 'var(--blue-pale)', borderRadius: '12px', padding: '20px', marginBottom: '28px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--blue-deep)', marginBottom: '8px' }}>Pour commander ou en savoir plus :</div>
                  {p.contact_tel && <div style={{ fontSize: '14px', color: 'var(--gray)' }}>📞 {p.contact_tel}</div>}
                  {p.contact_email && <div style={{ fontSize: '14px', color: 'var(--gray)' }}>✉️ {p.contact_email}</div>}
                </div>
              )}
              <Link to="/contact" className="btn-primary" style={{ display: 'block', textAlign: 'center', padding: '16px' }}>Demander un devis</Link>
            </div>
          </div>
        </div>
      </section>

      {similaires.length > 0 && (
        <section style={{ padding: '60px 0', background: 'var(--light)' }}>
          <div className="container">
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '26px', fontWeight: 700, color: 'var(--blue-deep)', marginBottom: '28px' }}>Produits similaires</h2>
            <div className="similaires-grid">
              {similaires.map((s) => (
                <Link key={s.id} to={`/nos-produits/${s.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'var(--white)', border: '1px solid #E8EAF0', borderRadius: '14px', overflow: 'hidden', transition: 'box-shadow 0.3s' }}
                    {...hover({ boxShadow: '0 6px 24px rgba(0,51,102,0.1)' }, { boxShadow: 'none' })}>
                    {s.image && <div style={{ height: '150px', overflow: 'hidden' }}><img src={s.image} alt={s.nom} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
                    <div style={{ padding: '16px' }}>
                      <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--blue-deep)', marginBottom: '6px' }}>{s.nom}</div>
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
