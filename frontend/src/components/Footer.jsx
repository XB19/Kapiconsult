import { Link } from 'react-router-dom';
import { CheckCircle2, Mail, MapPin, Phone, Clock } from 'lucide-react';
import { Logo } from './Header';
import { useAuth } from '../lib/auth';
import { CONTACT, FOOTER, tel } from '../content/site';
import { MISSION, VALEURS, APPROCHE } from '../content/apropos';

export default function Footer() {
  const { user } = useAuth();
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__values">
          <div>
            <h4>Notre <b>mission</b></h4>
            <p>{MISSION.paragraphs[1]}</p>
          </div>
          <div>
            <h4>Nos <b>valeurs</b></h4>
            <ul className="checks checks--light">
              {VALEURS.items.map((v) => <li key={v.name}><CheckCircle2 size={17} />{v.name}</li>)}
            </ul>
          </div>
          <div>
            <h4>Notre <b>approche</b></h4>
            <ul className="checks checks--light">
              {APPROCHE.steps.map((s) => <li key={s.n}><CheckCircle2 size={17} />{s.name}</li>)}
            </ul>
          </div>
        </div>

        <div className="footer__main">
          <div>
            <Logo light />
            <p style={{ marginTop: 16, maxWidth: 320 }}>{FOOTER.about}</p>
          </div>
          <div>
            <h4>Navigation</h4>
            <div className="footer__links">
              <Link to="/a-propos">À propos</Link>
              <Link to="/nos-activites">Nos Activités</Link>
              <Link to="/actualites">Actualités</Link>
              <Link to="/nos-produits">Nos Produits</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/quotidien/conditions">Conditions Quotidien</Link>
            </div>
          </div>
          <div>
            <h4>Recrutement</h4>
            <div className="footer__links">
              <Link to="/offres">Offres d'emploi</Link>
              <Link to="/candidature-spontanee">Candidature spontanée</Link>
              <Link to={user ? '/mon-compte' : '/login'}>Mon espace candidat</Link>
            </div>
          </div>
          <div>
            <h4>Contactez-nous</h4>
            <div className="footer__contact">
              <div><MapPin size={17} /><span>{CONTACT.adresseCourte}</span></div>
              {CONTACT.telephones.map((t) => <a key={t} href={tel(t)}><Phone size={17} />{t}</a>)}
              <a href={`mailto:${CONTACT.emails[0]}`}><Mail size={17} />{CONTACT.emails[0]}</a>
              <div><Clock size={17} /><span>{CONTACT.horaires[0]}</span></div>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} Kapi Consult. Tous droits réservés.</span>
          <span>Groupe OSEOR S.A. · Lomé, Togo</span>
        </div>
      </div>
    </footer>
  );
}
