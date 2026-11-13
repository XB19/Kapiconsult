import { Link } from 'react-router-dom';
import { Arrow, Reveal } from '../components/ui';

export default function NotFoundPage() {
  return (
    <main className="section" style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', textAlign: 'center' }}>
      <Reveal className="container">
        <div className="display" style={{ fontSize: 'clamp(96px, 16vw, 180px)', color: 'var(--brand)', lineHeight: 1 }}>4<span className="italic-accent">0</span>4</div>
        <p className="lead" style={{ margin: '14px 0 30px' }}>La page demandée est introuvable.</p>
        <div className="cta-actions" style={{ justifyContent: 'center' }}>
          <Link to="/" className="btn">Retour à l'accueil <Arrow /></Link>
          <Link to="/contact" className="btn btn-outline">Nous contacter</Link>
        </div>
      </Reveal>
    </main>
  );
}
