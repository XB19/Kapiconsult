import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, FileSignature, Mail, Phone } from 'lucide-react';
import { useApi } from '../lib/api';
import { Reveal, Title } from '../components/ui';
import { ProductCard } from '../components/cards';
import NotFoundPage from './NotFoundPage';

export default function ProduitPage() {
  const { slug } = useParams();
  const { data, error, loading } = useApi(`/produits/${slug}`);
  useEffect(() => { if (data?.produit) document.title = `${data.produit.nom} — Kapi Consult`; }, [data]);

  if (error) return <NotFoundPage />;
  if (loading || !data) {
    return <main className="sec"><div className="wrap product"><div className="skeleton" style={{ aspectRatio: '4 / 3' }} /><div><div className="skeleton" style={{ height: 40, marginBottom: 14 }} /><div className="skeleton" style={{ height: 150 }} /></div></div></main>;
  }
  const { produit: p, similaires } = data;

  return (
    <main>
      <section className="sec" style={{ paddingTop: 48 }}>
        <div className="wrap">
          <nav className="crumbs crumbs--dark" aria-label="Fil d'Ariane">
            <Link to="/">Accueil</Link><ChevronRight size={14} /><Link to="/nos-produits">Produits</Link><ChevronRight size={14} /><span>{p.nom}</span>
          </nav>
          <div className="product">
            <Reveal className="product__img">{p.image && <img src={p.image} alt={p.nom} />}</Reveal>
            <div className="product__info">
              <Link to={`/nos-produits?categorie=${encodeURIComponent(p.categorie)}`} className="pill pill--gold">{p.categorie}</Link>
              <h1 className="t-lg" style={{ margin: '14px 0 16px' }}>{p.nom}</h1>
              <p className="lead">{p.description}</p>
              {(p.contact_tel || p.contact_email) && (
                <div className="product__contact">
                  <b>Pour commander ou en savoir plus :</b>
                  {p.contact_tel && <div><Phone size={16} />{p.contact_tel}</div>}
                  {p.contact_email && <div><Mail size={16} />{p.contact_email}</div>}
                </div>
              )}
              <Link to="/contact" className="btn btn--gold btn--block"><FileSignature size={18} />Demander un devis</Link>
            </div>
          </div>
        </div>
      </section>
      {similaires.length > 0 && (
        <section className="sec sec--bg">
          <div className="wrap">
            <Reveal className="sec-title"><Title text="Produits similaires" hl="Produits" /></Reveal>
            <div className="grid g-3">{similaires.map((s, i) => <Reveal key={s.id} delay={i * 80}><ProductCard p={s} excerpt={0} /></Reveal>)}</div>
          </div>
        </section>
      )}
    </main>
  );
}
