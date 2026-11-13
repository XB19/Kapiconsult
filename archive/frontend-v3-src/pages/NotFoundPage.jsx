import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="sec">
      <div className="wrap" style={{ maxWidth: 720, minHeight: '42vh' }}>
        <span className="kicker">Erreur 404</span>
        <h1 className="t-1" style={{ margin: '14px 0 16px' }}>La page demandée est introuvable.</h1>
        <p className="lead muted" style={{ marginBottom: 30 }}>Elle a peut-être été déplacée ou n'existe plus.</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/" className="btn">Retour à l'accueil</Link>
          <Link to="/contact" className="btn btn--line">Nous contacter</Link>
        </div>
      </div>
    </main>
  );
}
