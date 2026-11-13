import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main>
      <section style={{ padding: '120px 0', textAlign: 'center' }}>
        <div className="container">
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '72px', fontWeight: 700, color: 'var(--blue-deep)' }}>404</div>
          <p style={{ fontSize: '18px', color: 'var(--gray)', margin: '12px 0 28px' }}>La page demandée est introuvable.</p>
          <Link to="/" className="btn-primary">Retour à l'accueil</Link>
        </div>
      </section>
    </main>
  );
}
