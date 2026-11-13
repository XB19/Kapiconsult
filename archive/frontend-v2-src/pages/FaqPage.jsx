import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../lib/api';
import { Arrow, CtaBand, Empty, PageHead, Reveal, SearchIcon } from '../components/ui';
import { norm } from './ActualitesPage';

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
      <PageHead image="/storage/kapi/banner_formations.jpg" tag="Centre d'aide" title="Questions Fréquentes"
        sub="Trouvez rapidement les réponses à vos questions." crumbs={[{ label: 'Publications' }, { label: 'FAQ' }]}>
        <label className="search" style={{ maxWidth: 520, marginTop: 30, display: 'block' }}>
          <span className="sr-only">Rechercher dans la FAQ</span>
          <SearchIcon />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher une question…" style={{ color: 'var(--text)' }} />
        </label>
      </PageHead>

      <section className="section">
        <div className="container domains">
          <aside className="domains-nav">
            <a href="#" className={!cat ? 'active' : ''} onClick={(e) => { e.preventDefault(); setCat(''); }}><i>✦</i>Toutes les questions</a>
            {cats.map((c, i) => (
              <a key={c} href="#" className={cat === c ? 'active' : ''} onClick={(e) => { e.preventDefault(); setCat(c); }}>
                <i>{String(i + 1).padStart(2, '0')}</i>{c}
              </a>
            ))}
          </aside>
          <div style={{ minWidth: 0 }}>
            {loading && [0, 1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: 70, marginBottom: 12 }} />)}
            {groups.map((g) => (
              <div key={g.c} style={{ marginBottom: 44 }}>
                <Reveal><h2 className="h3" style={{ marginBottom: 20 }}>{g.c}</h2></Reveal>
                {g.items.map((f) => {
                  const isOpen = open === f.id;
                  return (
                    <Reveal key={f.id} className={`acc ${isOpen ? 'open' : ''}`}>
                      <button className="acc-btn" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : f.id)}>
                        <span>{f.question}</span><span className="acc-ico">+</span>
                      </button>
                      <div className="acc-panel"><div><p>{f.reponse}</p></div></div>
                    </Reveal>
                  );
                })}
              </div>
            ))}
            {!loading && !groups.length && <Empty title="Aucune question trouvée">Essayez un autre mot-clé ou contactez-nous directement.</Empty>}
          </div>
        </div>
      </section>

      <CtaBand title="Vous n'avez pas trouvé votre réponse ?" text="Notre équipe est disponible pour répondre à toutes vos questions spécifiques.">
        <Link to="/contact" className="btn btn-gold btn-lg">Nous contacter <Arrow /></Link>
      </CtaBand>
    </main>
  );
}
