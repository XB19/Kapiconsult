import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApi } from '../lib/api';
import { Arrow, Reveal } from '../components/ui';
import { ProductCard } from '../components/cards';
import NotFoundPage from './NotFoundPage';

export default function ProduitPage() {
  const { slug } = useParams();
  const { data, error, loading } = useApi(`/produits/${slug}`);
  useEffect(() => { if (data?.produit) document.title = `${data.produit.nom} — Kapi Consult`; }, [data]);

  if (error) return <NotFoundPage />;
  if (loading || !data) {
    return <main className="section"><div className="container product-layout"><div className="skeleton" style={{ aspectRatio: '4 / 3' }} /><div><div className="skeleton" style={{ height: 40, marginBottom: 16 }} /><div className="skeleton" style={{ height: 160 }} /></div></div></main>;
  }
  const { produit: p, similaires } = data;

  return (
    <main>
      <section className="section" style={{ paddingTop: 56 }}>
        <div className="container">
          <nav className="crumbs dark" aria-label="Fil d'Ariane">
            <Link to="/">Accueil</Link><span className="sep">/</span>
            <Link to="/nos-produits">Produits</Link><span className="sep">/</span>
            <span>{p.nom}</span>
          </nav>
          <div className="product-layout">
            <Reveal variant="from-left" className="product-img">
              {p.image ? <img src={p.image} alt={p.nom} style={{ width: '100%' }} /> : <div className="media-fallback" style={{ aspectRatio: '4 / 3' }}>📦</div>}
            </Reveal>
            <div className="product-panel">
              <Reveal><Link to={`/nos-produits?categorie=${encodeURIComponent(p.categorie)}`} className="badge">{p.categorie}</Link></Reveal>
              <Reveal delay={80}><h1 className="h2" style={{ margin: '18px 0 20px' }}>{p.nom}</h1></Reveal>
              <Reveal delay={140}><p className="lead">{p.description}</p></Reveal>
              {(p.contact_tel || p.contact_email) && (
                <Reveal delay={200} className="contact-box">
                  <b>Pour commander ou en savoir plus :</b>
                  {p.contact_tel && <div>📞 {p.contact_tel}</div>}
                  {p.contact_email && <div>✉️ {p.contact_email}</div>}
                </Reveal>
              )}
              <Reveal delay={260}><Link to="/contact" className="btn btn-gold btn-lg btn-block">Demander un devis <Arrow /></Link></Reveal>
            </div>
          </div>
        </div>
      </section>

      {similaires.length > 0 && (
        <section className="section bg-paper">
          <div className="container">
            <Reveal><h2 className="h3" style={{ marginBottom: 32 }}>Produits similaires</h2></Reveal>
            <div className="grid grid-3">
              {similaires.map((s, i) => <Reveal key={s.id} delay={i * 100}><ProductCard p={s} excerpt={0} /></Reveal>)}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
