import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Check, ChevronRight, Clock, Link2, Linkedin, MessageCircle, User } from 'lucide-react';
import { useApi } from '../lib/api';
import { dateFr, dateShort } from '../lib/format';
import { Reveal, Title, readingTime } from '../components/ui';
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
      <span>Partager</span>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`} target="_blank" rel="noreferrer" aria-label="Partager sur LinkedIn"><Linkedin size={16} /></a>
      <a href={`https://wa.me/?text=${enc(`${title} ${url}`)}`} target="_blank" rel="noreferrer" aria-label="Partager sur WhatsApp"><MessageCircle size={16} /></a>
      <button onClick={copy} aria-label="Copier le lien">{copied ? <Check size={16} /> : <Link2 size={16} />}</button>
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
    return <main className="sec"><div className="wrap wrap--narrow"><div className="skeleton" style={{ height: 14, width: 220, marginBottom: 26 }} /><div className="skeleton" style={{ height: 44, marginBottom: 12 }} /><div className="skeleton" style={{ height: 300 }} /></div></main>;
  }
  const { article: a, similaires } = data;
  const [listUrl, listName] = LIST[a.type];

  return (
    <main>
      <ReadingProgress />
      <article className="sec article" style={{ paddingTop: 48 }}>
        <div className="wrap wrap--narrow">
          <nav className="crumbs crumbs--dark" aria-label="Fil d'Ariane">
            <Link to="/">Accueil</Link><ChevronRight size={14} /><Link to={listUrl}>{listName}</Link><ChevronRight size={14} /><span>{a.title}</span>
          </nav>
          <span className="pill">{a.badge}</span>
          <h1>{a.title}</h1>
          <div className="article__meta">
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {a.author && <span><User size={15} />Par <b style={{ color: 'var(--ink)' }}>{a.author}</b></span>}
              {a.published_at && <span><Calendar size={15} />{dateShort(a.published_at)}</span>}
              <span><Clock size={15} />{readingTime(a.content)} min de lecture</span>
            </div>
            <Share title={a.title} />
          </div>
          {a.image ? <figure className="article__img"><img src={a.image} alt={a.title} /></figure> : <div style={{ height: 32 }} />}
          <div className="prose">{a.content}</div>
          <div style={{ marginTop: 48, paddingTop: 20, borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <button className="btn btn--outline btn--sm" onClick={() => navigate(-1)}><ArrowLeft size={16} />Retour</button>
            <span className="small muted">Publié le {dateFr(a.published_at)}</span>
          </div>
        </div>
      </article>

      {similaires.length > 0 && (
        <section className="sec sec--bg">
          <div className="wrap">
            <Reveal className="sec-title"><Title text="Articles similaires" hl="Articles" /></Reveal>
            <div className="grid g-3">{similaires.map((s, i) => <Reveal key={s.id} delay={i * 80}><ArticleCard a={s} image={s.image} excerpt={0} /></Reveal>)}</div>
          </div>
        </section>
      )}
    </main>
  );
}
