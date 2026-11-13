import { Link } from 'react-router-dom';
import { LogoGrid } from './Header';
import { useAuth } from '../lib/auth';

export default function Footer() {
  const { user } = useAuth();
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="logo-area">
              <LogoGrid style={{ width: '34px', height: '34px' }} />
              <span className="logo-name" style={{ color: 'var(--white)', fontSize: '17px' }}>Kapi Consult</span>
            </Link>
            <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold-light)', letterSpacing: '.08em', textTransform: 'uppercase', marginTop: '10px', marginBottom: '6px' }}>
              Nous développons vos métiers
            </p>
            <p>Bureau d'études et de conseil en management. Votre partenaire stratégique au Togo, Bénin, Burkina Faso et Niger.</p>
          </div>
          <div className="footer-col">
            <h4>Navigation</h4>
            <Link to="/a-propos">À propos</Link>
            <Link to="/nos-activites">Nos Activités</Link>
            <Link to="/actualites">Actualités</Link>
            <Link to="/nos-produits">Nos Produits</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer-col">
            <h4>Recrutement</h4>
            <Link to="/offres">Offres d'emploi</Link>
            <Link to="/candidature-spontanee">Candidature spontanée</Link>
            <Link to={user ? '/mon-compte' : '/login'}>Mon espace candidat</Link>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <a>📍 Immeuble D&amp;D, Agoè BKS, Lomé, Togo</a>
            <a href="tel:+22822518969">📞 +228 22 51 89 69</a>
            <a href="tel:+22893170101">📞 +228 93 17 01 01</a>
            <a href="mailto:info@kapiconsult.tg">✉️ info@kapiconsult.tg</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">© {new Date().getFullYear()} Kapi Consult. Tous droits réservés.</span>
        </div>
      </div>
    </footer>
  );
}
