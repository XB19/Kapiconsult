import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApi } from '../lib/api';
import { Reveal } from '../components/ui';
import { ProductEntry } from '../components/cards';
import NotFoundPage from './NotFoundPage';

export default function ProduitPage() {
  const { slug } = useParams();
  const { data, error, loading } = useApi(`/produits/${slug}`);
  useEffect(() => { if (data?.produit) document.title = `${data.produit.nom} — Kapi Consult`; }, [data]);

  if (error) return <NotFoundPage />;
  if (loading || !data) {
    return <main className="sec"><div className="wrap product"><div className="skeleton" style={{ aspectRatio: '4 / 3' }} /><div><div className="skeleton" style={{ height: 44, marginBottom: 16 }} /><div className="skeleton" style={{ height: 160 }} /></div></div></main>;
  }
  const { produit: p, similaires } = data;

  return (
    <main>
      <section className="sec" style={{ paddingTop: 56 }}>
        <div className="wrap">
          <nav className="crumbs crumbs--dark" aria-label="Fil d'Ariane">
            <Link to="/">Accueil</Link><span aria-hidden="true">/</span>
            <Link to="/nos-produits">Produits</Link><span aria-hidden="true">/</span>
            <span>{p.nom}</span>
          </nav>
          <div className="product">
            <Reveal className="product__img">{p.image && <img src={p.image} alt={p.nom} />}</Reveal>
            <div className="product__info">
              <Link to={`/nos-produits?categorie=${encodeURIComponent(p.categorie)}`} className="kicker">{p.categorie}</Link>
              <h1 className="t-1" style={{ margin: '14px 0 20px' }}>{p.nom}</h1>
              <p className="lead">{p.description}</p>
              {(p.contact_tel || p.contact_email) && (
                <div className="product__contact">
                  <b>Pour commander ou en savoir plus :</b>
                  {p.contact_tel && <div>{p.contact_tel}</div>}
                  {p.contact_email && <div>{p.contact_email}</div>}
                </div>
              )}
              <Link to="/contact" className="btn btn--block">Demander un devis</Link>
            </div>
          </div>
        </div>
      </section>

      {similaires.length > 0 && (
        <section className="sec sec--stone">
          <div className="wrap">
            <h2 className="t-3" style={{ marginBottom: 32, paddingTop: 12, borderTop: '2px solid var(--gold)', display: 'inline-block' }}>Produits similaires</h2>
            <div className="entries">
              {similaires.map((s, i) => <Reveal key={s.id} delay={i * 60}><ProductEntry p={s} excerpt={0} /></Reveal>)}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
