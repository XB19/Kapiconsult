import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Mail } from 'lucide-react';
import { PageBanner } from '../components/ui';
import { CONDITIONS, CONDITIONS_MAJ, POINTS_CLES } from '../content/quotidien';

export default function ConditionsQuotidienPage() {
  return (
    <main>
      <PageBanner image="/storage/kapi/domaine_industrie.jpg" label="Quotidien" title="Conditions d’utilisation"
        sub="Règles du service de mise en relation entre clients et prestataires." crumbs={[{ label: 'Quotidien', to: '/prestataires' }, { label: 'Conditions d’utilisation' }]} />
      <section className="sec sec--bg">
        <div className="wrap" style={{ maxWidth: 900 }}>
          <div className="box legal">
            <p className="muted small">Dernière mise à jour : {CONDITIONS_MAJ}</p>
            <div className="legal__key">
              <AlertTriangle size={24} />
              <div>
                <h2>À retenir</h2>
                <ul>{POINTS_CLES.map((p) => <li key={p}>{p}</li>)}</ul>
              </div>
            </div>
            {CONDITIONS.map((s, i) => (
              <section key={s.titre} className="legal__sec">
                <h2><span>{i + 1}.</span>{s.titre}</h2>
                {s.texte?.map((t) => <p key={t}>{t}</p>)}
                {s.liste && <ul>{s.liste.map((t) => <li key={t}>{t}</li>)}</ul>}
                {s.apres && <p>{s.apres}</p>}
              </section>
            ))}
            <div className="legal__foot">
              <Link to="/contact" className="btn btn--outline btn--sm"><Mail size={15} />Une question ? Contactez-nous</Link>
              <Link to="/prestataires" className="btn btn--gold btn--sm">Accéder à Quotidien <ArrowRight size={15} /></Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
