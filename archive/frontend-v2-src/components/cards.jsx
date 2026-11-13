import { Link } from 'react-router-dom';
import { dateShort, limit } from '../lib/format';

export function ArticleCard({ a, excerpt = 110, showBadge = true }) {
  return (
    <Link to={`/articles/${a.slug}`} className="card card-hover">
      <div className="card-media">
        {a.card_image ? <img src={a.card_image} alt={a.title} loading="lazy" /> : <div className="media-fallback">📰</div>}
        {showBadge && <span className="badge">{a.badge}</span>}
      </div>
      <div className="card-body">
        <span className="card-meta">{dateShort(a.published_at)}</span>
        <h3 className="card-title">{a.title}</h3>
        {excerpt > 0 && <p className="card-text">{limit(a.content, excerpt)}</p>}
        <span className="card-foot link-arrow">Lire la suite <span>→</span></span>
      </div>
    </Link>
  );
}

export function ProductCard({ p, excerpt = 90 }) {
  return (
    <Link to={`/nos-produits/${p.slug}`} className="card card-hover">
      <div className="card-media">
        {p.image ? <img src={p.image} alt={p.nom} loading="lazy" /> : <div className="media-fallback">📦</div>}
        <span className="badge badge-glass">{p.categorie}</span>
      </div>
      <div className="card-body">
        <h3 className="card-title">{p.nom}</h3>
        {excerpt > 0 && <p className="card-text">{limit(p.description, excerpt)}</p>}
        <span className="card-foot link-arrow">Découvrir <span>→</span></span>
      </div>
    </Link>
  );
}
