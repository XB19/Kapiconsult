import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApi } from '../lib/api';
import { dateFr, dateShort } from '../lib/format';
import { Reveal, readingTime } from '../components/ui';
import { ArticleCard } from '../components/cards';
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
  return <div className="progress-bar" style={{ width: '100%', transform: `scaleX(${p})` }} />;
}

function Share({ title }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const copy = async () => {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* non disponible */ }
  };
  const enc = encodeURIComponent;
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <span className="muted" style={{ fontSize: 13, fontWeight: 700, marginRight: 4 }}>Partager</span>
      <a className="chip" href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`} target="_blank" rel="noreferrer">LinkedIn</a>
      <a className="chip" href={`https://wa.me/?text=${enc(`${title} ${url}`)}`} target="_blank" rel="noreferrer">WhatsApp</a>
      <button className="chip" onClick={copy}>{copied ? '✓ Lien copié' : 'Copier le lien'}</button>
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
      <main className="section"><div className="container container-sm">
        <div className="skeleton" style={{ height: 14, width: 200, marginBottom: 24 }} />
        <div className="skeleton" style={{ height: 52, width: '90%', marginBottom: 14 }} />
        <div className="skeleton" style={{ height: 52, width: '60%', marginBottom: 40 }} />
        <div className="skeleton" style={{ height: 360 }} />
      </div></main>
    );
  }
  const { article: a, similaires } = data;
  const [listUrl, listName] = LIST[a.type];

  return (
    <main>
      <ReadingProgress />
      <article className="section" style={{ paddingTop: 64 }}>
        <div className="container container-sm">
          <nav className="crumbs dark" aria-label="Fil d'Ariane">
            <Link to="/">Accueil</Link><span className="sep">/</span>
            <Link to={listUrl}>{listName}</Link><span className="sep">/</span>
            <span>{a.title}</span>
          </nav>
          <Reveal style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="badge badge-soft">{a.badge}</span>
            {a.published_at && <span className="muted" style={{ fontSize: 14, fontWeight: 600 }}>{dateShort(a.published_at)} · {readingTime(a.content)} min de lecture</span>}
          </Reveal>
          <Reveal delay={80}><h1 className="h2" style={{ margin: '20px 0 26px', fontSize: 'clamp(34px, 4.6vw, 56px)' }}>{a.title}</h1></Reveal>
          <Reveal delay={140} style={{ display: 'flex', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', alignItems: 'center', paddingBottom: 26, borderBottom: '1px solid var(--line)' }}>
            {a.author && (
              <div className="author">
                <div className="avatar">{a.author[0]}</div>
                <div><span className="muted" style={{ fontSize: 13 }}>Par</span><b style={{ display: 'block', fontSize: 15 }}>{a.author}</b></div>
              </div>
            )}
            <Share title={a.title} />
          </Reveal>

          {a.image
            ? <Reveal variant="zoom" className="article-hero-img"><img src={a.image} alt={a.title} /></Reveal>
            : <div style={{ height: 44 }} />}

          <Reveal className="prose">{a.content}</Reveal>

          <div style={{ marginTop: 56, paddingTop: 28, borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <button className="btn btn-outline btn-sm" onClick={() => navigate(-1)}>← Retour</button>
            <span className="muted" style={{ fontSize: 14 }}>Publié le {dateFr(a.published_at)}</span>
          </div>
        </div>
      </article>

      {similaires.length > 0 && (
        <section className="section bg-paper">
          <div className="container">
            <Reveal><h2 className="h3" style={{ marginBottom: 32 }}>Articles similaires</h2></Reveal>
            <div className="grid grid-3">
              {similaires.map((s, i) => <Reveal key={s.id} delay={i * 100}><ArticleCard a={{ ...s, card_image: s.image }} excerpt={0} /></Reveal>)}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
