import { Link } from 'react-router-dom';
import { Brand } from './Header';
import { Arrow, Reveal } from './ui';
import { useAuth } from '../lib/auth';
import { CONTACT, FOOTER, tel } from '../content/site';

export default function Footer() {
  const { user } = useAuth();
  return (
    <footer className="footer">
      <div className="container">
        <Reveal className="footer-cta">
          <h2 className="h2">Travaillons ensemble</h2>
          <div className="cta-actions">
            <Link to="/contact" className="btn btn-gold btn-lg">Nous contacter <Arrow /></Link>
            <Link to="/offres" className="btn btn-ghost-light btn-lg">Offres d'emploi</Link>
          </div>
        </Reveal>

        <div className="footer-grid">
          <div>
            <Brand sub={false} />
            <p className="footer-slogan">{FOOTER.slogan}</p>
            <p style={{ maxWidth: 340, fontSize: 15 }}>{FOOTER.about}</p>
          </div>
          <div>
            <h4>Navigation</h4>
            <div className="footer-links">
              <Link to="/a-propos">À propos</Link>
              <Link to="/nos-activites">Nos Activités</Link>
              <Link to="/actualites">Actualités</Link>
              <Link to="/nos-produits">Nos Produits</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>
          <div>
            <h4>Recrutement</h4>
            <div className="footer-links">
              <Link to="/offres">Offres d'emploi</Link>
              <Link to="/candidature-spontanee">Candidature spontanée</Link>
              <Link to={user ? '/mon-compte' : '/login'}>Mon espace candidat</Link>
            </div>
          </div>
          <div>
            <h4>Contact</h4>
            <div className="footer-links">
              <span>📍 {CONTACT.adresseCourte}</span>
              {CONTACT.telephones.map((t) => <a key={t} href={tel(t)}>📞 {t}</a>)}
              <a href={`mailto:${CONTACT.emails[0]}`}>✉️ {CONTACT.emails[0]}</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Kapi Consult. Tous droits réservés.</span>
          <span>Membre du Groupe OSEOR S.A. · Lomé, Togo</span>
        </div>
      </div>
    </footer>
  );
}
