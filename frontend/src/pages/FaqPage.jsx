import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, FileSignature, HelpCircle, ListChecks, Users } from 'lucide-react';
import { useApi } from '../lib/api';
import { Cta, Empty, PageBanner, SearchField, Title, norm } from '../components/ui';

const CAT_ICONS = { Candidature: Users, Recrutement: ListChecks, Contrats: FileSignature };

export default function FaqPage() {
  const { data, loading } = useApi('/faqs');
  const [open, setOpen] = useState(null);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const faqs = data || [];
  const cats = [...new Set(faqs.map((f) => f.categorie))];
  const list = faqs.filter((f) => (!cat || f.categorie === cat) && norm(f.question + f.reponse).includes(norm(q)));
  const groups = cats.map((c) => ({ c, items: list.filter((f) => f.categorie === c) })).filter((g) => g.items.length);

  return (
    <main>
      <PageBanner image="/storage/kapi/banner_formations.jpg" label="Centre d'aide" title="Questions Fréquentes"
        sub="Trouvez rapidement les réponses à vos questions." crumbs={[{ label: 'Publications' }, { label: 'FAQ' }]} />
      <section className="sec sec--bg">
        <div className="wrap side-layout">
          <nav className="side-nav" aria-label="Rubriques">
            <span className="side-nav__title">Rubriques</span>
            <button className={!cat ? 'is-active' : ''} onClick={() => setCat('')}><HelpCircle size={17} />Toutes les questions</button>
            {cats.map((c) => { const Icon = CAT_ICONS[c] || HelpCircle; return <button key={c} className={cat === c ? 'is-active' : ''} onClick={() => setCat(c)}><Icon size={17} />{c}</button>; })}
          </nav>
          <div style={{ minWidth: 0 }}>
            <div style={{ marginBottom: 32, maxWidth: 520 }}><SearchField value={q} onChange={setQ} placeholder="Rechercher une question" /></div>
            {loading && [0, 1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: 60, marginBottom: 12 }} />)}
            {groups.map((g) => (
              <div key={g.c} style={{ marginBottom: 40 }}>
                <Title text={g.c} hl={g.c} as="h2" className="t-md" />
                <div style={{ height: 14 }} />
                {g.items.map((f) => {
                  const isOpen = open === f.id;
                  return (
                    <div key={f.id} className={`acc ${isOpen ? 'is-open' : ''}`}>
                      <button className="acc__q" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : f.id)}>
                        <span>{f.question}</span><ChevronDown size={20} />
                      </button>
                      <p className="acc__a">{f.reponse}</p>
                    </div>
                  );
                })}
              </div>
            ))}
            {!loading && !groups.length && <Empty title="Aucune question trouvée">Essayez un autre mot-clé ou contactez-nous directement.</Empty>}
          </div>
        </div>
      </section>
      <Cta title="Vous n'avez pas trouvé votre réponse ?" text="Notre équipe est disponible pour répondre à toutes vos questions spécifiques.">
        <Link to="/contact" className="btn btn--white">Nous contacter <ArrowRight size={16} /></Link>
      </Cta>
    </main>
  );
}
