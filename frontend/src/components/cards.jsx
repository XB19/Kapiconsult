import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Newspaper, Package } from 'lucide-react';
import { dateShort, limit } from '../lib/format';

export function ArticleCard({ a, excerpt = 110, image = a.card_image }) {
  return (
    <Link to={`/articles/${a.slug}`} className="card">
      <div className={`card__img ${image ? '' : 'card__img--empty'}`}>
        {image ? <img src={image} alt={a.title} loading="lazy" /> : <Newspaper size={40} strokeWidth={1.4} />}
        <span className="pill card__tag">{a.badge}</span>
      </div>
      <div className="card__body">
        <span className="card__meta"><Calendar size={14} />{dateShort(a.published_at)}</span>
        <h3 className="card__title">{a.title}</h3>
        {excerpt > 0 && <p className="card__text">{limit(a.content, excerpt)}</p>}
        <span className="card__foot link">Lire la suite <ArrowRight size={15} /></span>
      </div>
    </Link>
  );
}

export function ProductCard({ p, excerpt = 90 }) {
  return (
    <Link to={`/nos-produits/${p.slug}`} className="card">
      <div className={`card__img ${p.image ? '' : 'card__img--empty'}`}>
        {p.image ? <img src={p.image} alt={p.nom} loading="lazy" /> : <Package size={40} strokeWidth={1.4} />}
        <span className="pill pill--gold card__tag">{p.categorie}</span>
      </div>
      <div className="card__body">
        <h3 className="card__title">{p.nom}</h3>
        {excerpt > 0 && <p className="card__text">{limit(p.description, excerpt)}</p>}
        <span className="card__foot link">Découvrir <ArrowRight size={15} /></span>
      </div>
    </Link>
  );
}
