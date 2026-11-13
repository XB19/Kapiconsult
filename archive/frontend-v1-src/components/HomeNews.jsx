import { Link } from 'react-router-dom';
import { useApi } from '../lib/api';
import { dateShort, limit } from '../lib/format';
import { hover } from './Heroes';

// Section « Dernières publications » de l'accueil (2 dernières actualités)
export default function HomeNews() {
  const { data } = useApi('/articles?type=actualite&limit=2');
  return (
    <div className="section">
      <div className="section-tag">Nos Actualités</div>
      <h2 className="section-title">Dernières publications</h2>
      <p className="section-sub">Actualités, articles de fond et ressources utiles de Kapi Consult.</p>
      <div className="news-grid">
        {(data || []).map((a) => (
          <Link key={a.id} to={`/articles/${a.slug}`} className="news-card" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
            <div className="news-img">
              {a.card_image && (
                <img src={a.card_image} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s' }} alt={a.title}
                  {...hover({ transform: 'scale(1.06)' }, { transform: 'scale(1)' })} />
              )}
              <span className="news-cat">{a.badge}</span>
            </div>
            <div className="news-body">
              <div className="news-date">{dateShort(a.published_at)}</div>
              <div className="news-title">{a.title}</div>
              <div className="news-excerpt">{limit(a.content, 100)}</div>
            </div>
          </Link>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: '28px' }}>
        <Link to="/actualites" className="btn btn-outline-blue">Toutes les actualités &rarr;</Link>
      </div>
    </div>
  );
}
