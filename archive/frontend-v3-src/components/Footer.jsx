import { Link } from 'react-router-dom';
import { Logo } from './Header';
import { useAuth } from '../lib/auth';
import { CONTACT, FOOTER, tel } from '../content/site';

export default function Footer() {
  const { user } = useAuth();
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot__top">
          <div>
            <Logo />
            <p className="foot__slogan">{FOOTER.slogan}</p>
            <p style={{ maxWidth: 360 }}>{FOOTER.about}</p>
          </div>
          <div>
            <h4>Navigation</h4>
            <div className="foot__list">
              <Link to="/a-propos">À propos</Link>
              <Link to="/nos-activites">Nos Activités</Link>
              <Link to="/actualites">Actualités</Link>
              <Link to="/nos-produits">Nos Produits</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>
          <div>
            <h4>Recrutement</h4>
            <div className="foot__list">
              <Link to="/offres">Offres d'emploi</Link>
              <Link to="/candidature-spontanee">Candidature spontanée</Link>
              <Link to={user ? '/mon-compte' : '/login'}>Mon espace candidat</Link>
            </div>
          </div>
          <div>
            <h4>Contact</h4>
            <div className="foot__list">
              <span>{CONTACT.adresseCourte}</span>
              {CONTACT.telephones.map((t) => <a key={t} href={tel(t)}>{t}</a>)}
              <a href={`mailto:${CONTACT.emails[0]}`}>{CONTACT.emails[0]}</a>
            </div>
          </div>
        </div>
        <div className="foot__bottom">
          <span>© {new Date().getFullYear()} Kapi Consult. Tous droits réservés.</span>
          <span>Groupe OSEOR S.A. · Lomé, Togo</span>
        </div>
      </div>
    </footer>
  );
}
