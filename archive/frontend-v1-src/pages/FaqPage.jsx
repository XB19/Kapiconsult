import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../lib/api';
import { SectionHero } from '../components/Heroes';

export default function FaqPage() {
  const { data } = useApi('/faqs');
  const [open, setOpen] = useState({});
  const groups = [];
  for (const f of data || []) {
    let g = groups.find((x) => x.categorie === f.categorie);
    if (!g) groups.push((g = { categorie: f.categorie, items: [] }));
    g.items.push(f);
  }

  return (
    <main>
      <SectionHero image="/storage/kapi/banner_formations.jpg" tag="Centre d'aide" title="Questions Fréquentes" sub="Trouvez rapidement les réponses à vos questions." />
      <section style={{ padding: '80px 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          {groups.map((g, gi) => (
            <Fragment key={g.categorie}>
              {gi > 0 && <div style={{ margin: '36px 0' }} />}
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '22px', fontWeight: 700, color: 'var(--blue-deep)', marginBottom: '20px', paddingBottom: '10px', borderBottom: '2px solid var(--gold)' }}>{g.categorie}</h2>
              {g.items.map((f) => (
                <div key={f.id} style={{ background: 'var(--white)', border: '1px solid #E8EAF0', borderRadius: '14px', marginBottom: '12px', overflow: 'hidden' }}>
                  <button onClick={() => setOpen((o) => ({ ...o, [f.id]: !o[f.id] }))}
                    style={{ width: '100%', textAlign: 'left', padding: '20px 24px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--blue-deep)', lineHeight: 1.4 }}>{f.question}</span>
                    <span style={{ fontSize: '18px', color: 'var(--gold)', flexShrink: 0, transition: 'transform 0.3s' }}>{open[f.id] ? '−' : '+'}</span>
                  </button>
                  <div style={{ display: open[f.id] ? 'block' : 'none', padding: '0 24px 20px' }}>
                    <div style={{ fontSize: '14px', color: 'var(--gray)', lineHeight: 1.8, paddingTop: '4px', borderTop: '1px solid #F0F2F8' }}>{f.reponse}</div>
                  </div>
                </div>
              ))}
            </Fragment>
          ))}
        </div>
      </section>

      <section style={{ background: 'var(--light)', padding: '60px 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '26px', fontWeight: 700, color: 'var(--blue-deep)', marginBottom: '12px' }}>Vous n'avez pas trouvé votre réponse ?</h2>
          <p style={{ fontSize: '15px', color: 'var(--gray)', marginBottom: '24px' }}>Notre équipe est disponible pour répondre à toutes vos questions spécifiques.</p>
          <Link to="/contact" className="btn-primary">Nous contacter</Link>
        </div>
      </section>
    </main>
  );
}
