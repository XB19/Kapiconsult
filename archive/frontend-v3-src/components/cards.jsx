import { Link } from 'react-router-dom';
import { dateShort, limit } from '../lib/format';

export function ArticleEntry({ a, excerpt = 110, image = a.card_image }) {
  return (
    <Link to={`/articles/${a.slug}`} className="entry">
      <div className={`entry__img ${image ? '' : 'entry__img--placeholder'}`}>
        {image ? <img src={image} alt={a.title} loading="lazy" /> : <span>Kapi Consult</span>}
      </div>
      <div className="entry__meta"><span className="cat">{a.badge}</span><span>{dateShort(a.published_at)}</span></div>
      <h3 className="entry__title">{a.title}</h3>
      {excerpt > 0 && <p className="entry__text">{limit(a.content, excerpt)}</p>}
    </Link>
  );
}

export function ProductEntry({ p, excerpt = 90 }) {
  return (
    <Link to={`/nos-produits/${p.slug}`} className="entry">
      <div className={`entry__img ${p.image ? '' : 'entry__img--placeholder'}`}>
        {p.image ? <img src={p.image} alt={p.nom} loading="lazy" /> : <span>Kapi Consult</span>}
      </div>
      <div className="entry__meta"><span className="cat">{p.categorie}</span></div>
      <h3 className="entry__title">{p.nom}</h3>
      {excerpt > 0 && <p className="entry__text">{limit(p.description, excerpt)}</p>}
    </Link>
  );
}
