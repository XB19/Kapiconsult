import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../lib/api';
import { Cta, Empty, PageHead, SearchField, norm, pad2 } from '../components/ui';

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
      <PageHead image="/storage/kapi/banner_formations.jpg" label="Centre d'aide" title="Questions Fréquentes"
        sub="Trouvez rapidement les réponses à vos questions." crumbs={[{ label: 'Publications' }, { label: 'FAQ' }]} />
      <section className="sec">
        <div className="wrap side-layout">
          <nav className="side-nav" aria-label="Rubriques">
            <span className="side-nav__title">Rubriques</span>
            <button className={!cat ? 'is-active' : ''} onClick={() => setCat('')}><i>—</i>Toutes les questions</button>
            {cats.map((c, i) => <button key={c} className={cat === c ? 'is-active' : ''} onClick={() => setCat(c)}><i>{pad2(i)}</i>{c}</button>)}
          </nav>
          <div style={{ minWidth: 0 }}>
            <div style={{ marginBottom: 40, maxWidth: 520 }}><SearchField value={q} onChange={setQ} placeholder="Rechercher une question" /></div>
            {loading && [0, 1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: 60, marginBottom: 10 }} />)}
            {groups.map((g) => (
              <div key={g.c} style={{ marginBottom: 52 }}>
                <h2 className="t-3" style={{ marginBottom: 14 }}>{g.c}</h2>
                <div className="faq">
                  {g.items.map((f) => {
                    const isOpen = open === f.id;
                    return (
                      <div key={f.id} className={`faq__item ${isOpen ? 'is-open' : ''}`}>
                        <button className="faq__q" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : f.id)}>
                          <span>{f.question}</span><span className="faq__sign" aria-hidden="true" />
                        </button>
                        <p className="faq__a">{f.reponse}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            {!loading && !groups.length && <Empty title="Aucune question trouvée">Essayez un autre mot-clé ou contactez-nous directement.</Empty>}
          </div>
        </div>
      </section>
      <Cta title="Vous n'avez pas trouvé votre réponse ?" text="Notre équipe est disponible pour répondre à toutes vos questions spécifiques.">
        <Link to="/contact" className="btn">Nous contacter</Link>
      </Cta>
    </main>
  );
}
