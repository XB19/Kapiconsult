import { Link } from 'react-router-dom';
import { Home, Mail, MapPinOff } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <main className="sec sec--bg">
      <div className="wrap" style={{ maxWidth: 640, textAlign: 'center', minHeight: '40vh' }}>
        <div className="dialog__ico" style={{ width: 84, height: 84 }}><MapPinOff size={38} /></div>
        <h1 className="title"><b>404</b> — La page demandée est introuvable.</h1>
        <p className="muted" style={{ margin: '12px 0 28px' }}>Elle a peut-être été déplacée ou n'existe plus.</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/" className="btn"><Home size={17} />Retour à l'accueil</Link>
          <Link to="/contact" className="btn btn--outline"><Mail size={17} />Nous contacter</Link>
        </div>
      </div>
    </main>
  );
}
