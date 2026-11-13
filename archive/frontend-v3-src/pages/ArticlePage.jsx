import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApi } from '../lib/api';
import { dateFr, dateShort } from '../lib/format';
import { Reveal, readingTime } from '../components/ui';
import { ArticleEntry } from '../components/cards';
import NotFoundPage from './NotFoundPage';

const LIST = { actualite: ['/actualites', 'Actualités'], blog: ['/blog', 'Blog'], bon_plan: ['/bons-plans', 'Bons Plans'] };

function ReadingProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? Math.min(1, window.scrollY / h) : 0);
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return <div className="progress" style={{ transform: `scaleX(${p})` }} aria-hidden="true" />;
}

function Share({ title }) {
  const [copied, setCopied] = useState(false);
  const url = window.location.href;
  const enc = encodeURIComponent;
  const copy = async () => {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* indisponible */ }
  };
  return (
    <div className="share">
      <span className="muted">Partager :</span>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`} target="_blank" rel="noreferrer">LinkedIn</a>
      <a href={`https://wa.me/?text=${enc(`${title} ${url}`)}`} target="_blank" rel="noreferrer">WhatsApp</a>
      <button onClick={copy}>{copied ? 'Lien copié' : 'Copier le lien'}</button>
    </div>
  );
}

export default function ArticlePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data, error, loading } = useApi(`/articles/${slug}`);
  useEffect(() => { if (data?.article) document.title = `${data.article.title} — Kapi Consult`; }, [data]);

  if (error) return <NotFoundPage />;
  if (loading || !data) {
    return (
      <main className="sec"><div className="wrap wrap--narrow">
        <div className="skeleton" style={{ height: 14, width: 220, marginBottom: 30 }} />
        <div className="skeleton" style={{ height: 48, width: '90%', marginBottom: 12 }} />
        <div className="skeleton" style={{ height: 48, width: '55%', marginBottom: 40 }} />
        <div className="skeleton" style={{ height: 320 }} />
      </div></main>
    );
  }
  const { article: a, similaires } = data;
  const [listUrl, listName] = LIST[a.type];

  return (
    <main>
      <ReadingProgress />
      <article className="sec article" style={{ paddingTop: 56 }}>
        <div className="wrap wrap--narrow">
          <nav className="crumbs crumbs--dark" aria-label="Fil d'Ariane">
            <Link to="/">Accueil</Link><span aria-hidden="true">/</span>
            <Link to={listUrl}>{listName}</Link><span aria-hidden="true">/</span>
            <span>{a.title}</span>
          </nav>
          <span className="kicker">{a.badge}</span>
          <h1 className="t-1">{a.title}</h1>
          <div className="article__meta">
            <span>
              {a.author && <>Par <b>{a.author}</b> · </>}
              {a.published_at && <>{dateShort(a.published_at)} · </>}
              {readingTime(a.content)} min de lecture
            </span>
            <Share title={a.title} />
          </div>
          {a.image ? <figure className="article__img"><img src={a.image} alt={a.title} /></figure> : <div style={{ height: 40 }} />}
          <div className="prose">{a.content}</div>
          <div style={{ marginTop: 56, paddingTop: 22, borderTop: '1px solid var(--rule)', display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <button className="more" onClick={() => navigate(-1)}>← Retour</button>
            <span className="small muted">Publié le {dateFr(a.published_at)}</span>
          </div>
        </div>
      </article>

      {similaires.length > 0 && (
        <section className="sec sec--stone">
          <div className="wrap">
            <h2 className="t-3" style={{ marginBottom: 32, paddingTop: 12, borderTop: '2px solid var(--gold)', display: 'inline-block' }}>Articles similaires</h2>
            <div className="entries">
              {similaires.map((s, i) => <Reveal key={s.id} delay={i * 60}><ArticleEntry a={s} image={s.image} excerpt={0} /></Reveal>)}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
