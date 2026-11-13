import CrudPage from './CrudPage';
import { fmtDate } from './kit';

const today = () => new Date().toISOString().slice(0, 10);
const TYPES = [['actualite', 'Actualité'], ['blog', 'Blog'], ['bon_plan', 'Bon Plan']];
const typeLabel = Object.fromEntries(TYPES);
const Thumb = ({ src }) => (src ? <img className="thumb" src={src} alt="" /> : <span className="thumb" style={{ display: 'inline-block' }} />);
const Status = ({ on, yes = 'Publié', no = 'Brouillon' }) => <span className={`pill ${on ? 'pill--ok' : 'pill--soft'}`}>{on ? yes : no}</span>;

export function ArticlesAdmin() {
  return (
    <CrudPage
      endpoint="articles" noun="Article"
      intro="Actualités, articles de blog et bons plans affichés sur le site."
      searchKeys={['title', 'author', 'content']}
      filter={{ name: 'type', label: 'Tous les types', options: TYPES }}
      publicUrl={(r) => (r.published ? `/articles/${r.slug}` : null)}
      defaults={{ type: 'actualite', published: true, published_at: today(), author: '' }}
      columns={[
        { key: 'img', label: '', render: (r) => <Thumb src={r.image || r.card_image} /> },
        { key: 'title', label: 'Titre', render: (r) => <><div className="cell-title">{r.title}</div><div className="sub">{r.author || '—'}</div></> },
        { key: 'type', label: 'Type', render: (r) => <span className="pill pill--gold">{typeLabel[r.type]}</span> },
        { key: 'published_at', label: 'Date', render: (r) => fmtDate(r.published_at) },
        { key: 'published', label: 'Statut', render: (r) => <Status on={r.published} /> },
      ]}
      fields={[
        { name: 'title', label: 'Titre', required: true },
        { name: 'type', label: 'Rubrique', type: 'select', options: TYPES, required: true, half: true },
        { name: 'published_at', label: 'Date de publication', type: 'date', half: true },
        { name: 'author', label: 'Auteur', half: true },
        { name: 'category', label: 'Catégorie (ex. zencard pour les affiches)', half: true },
        { name: 'content', label: 'Contenu', type: 'textarea', rows: 12, required: true, hint: 'Les retours à la ligne sont conservés à l’affichage.' },
        { name: 'image', label: "Image de l'article", type: 'image', hint: "Affichée en haut de la page de l'article." },
        { name: 'card_image', label: 'Image de la vignette (listes)', type: 'image', hint: "Si vide, l'image de l'article est utilisée." },
        { name: 'published', label: 'Publication', type: 'switch', switchLabel: 'Publié sur le site' },
      ]}
      toForm={(r) => ({ ...r, card_image: r.card_image === r.image ? '' : r.card_image })}
    />
  );
}

export function ProduitsAdmin() {
  return (
    <CrudPage
      endpoint="produits" noun="Produit"
      intro="Catalogue des formations, prestations de conseil et de recrutement."
      searchKeys={['nom', 'categorie', 'description']}
      filter={{ name: 'categorie', label: 'Toutes les catégories', options: [['Formation', 'Formation'], ['Conseil', 'Conseil'], ['Recrutement', 'Recrutement']] }}
      publicUrl={(r) => (r.actif ? `/nos-produits/${r.slug}` : null)}
      defaults={{ actif: true, categorie: 'Formation', position: 0 }}
      columns={[
        { key: 'img', label: '', render: (r) => <Thumb src={r.image} /> },
        { key: 'nom', label: 'Produit', render: (r) => <div className="cell-title">{r.nom}</div> },
        { key: 'categorie', label: 'Catégorie', render: (r) => <span className="pill pill--gold">{r.categorie}</span> },
        { key: 'prix', label: 'Prix', render: (r) => (r.prix ? `${Number(r.prix).toLocaleString('fr-FR')} FCFA` : '—') },
        { key: 'position', label: 'Ordre' },
        { key: 'actif', label: 'Statut', render: (r) => <Status on={r.actif} yes="En ligne" no="Masqué" /> },
      ]}
      fields={[
        { name: 'nom', label: 'Nom du produit', required: true },
        { name: 'categorie', label: 'Catégorie', required: true, half: true, suggestions: ['Formation', 'Conseil', 'Recrutement'] },
        { name: 'prix', label: 'Prix (FCFA)', type: 'number', half: true },
        { name: 'description', label: 'Description', type: 'textarea', rows: 7, required: true },
        { name: 'image', label: 'Image', type: 'image' },
        { name: 'contact_tel', label: 'Téléphone de contact', half: true },
        { name: 'contact_email', label: 'Email de contact', type: 'email', half: true },
        { name: 'position', label: "Ordre d'affichage", type: 'number', half: true, hint: 'Les plus petits nombres apparaissent en premier.' },
        { name: 'actif', label: 'Visibilité', type: 'switch', switchLabel: 'Affiché sur le site', half: true },
      ]}
    />
  );
}

const CONTRATS = [['CDI', 'CDI'], ['CDD', 'CDD'], ['Stage', 'Stage'], ['Freelance', 'Freelance']];
export function OffresAdmin() {
  const t = today();
  return (
    <CrudPage
      endpoint="offres" noun="Offre"
      intro="Offres d'emploi affichées dans la rubrique Carrière. Une offre expire automatiquement à sa date limite."
      searchKeys={['titre', 'lieu', 'type_contrat']}
      filter={{ name: 'type_contrat', label: 'Tous les contrats', options: CONTRATS }}
      defaults={{ type_contrat: 'CDI', published_at: today() }}
      columns={[
        { key: 'titre', label: 'Poste', render: (r) => <><div className="cell-title">{r.titre}</div><div className="sub">{r.lieu}</div></> },
        { key: 'type_contrat', label: 'Contrat', render: (r) => <span className="pill pill--soft">{r.type_contrat}</span> },
        { key: 'published_at', label: 'Publiée le', render: (r) => fmtDate(r.published_at) },
        { key: 'date_limite', label: 'Date limite', render: (r) => fmtDate(r.date_limite) },
        { key: 'statut', label: 'Statut', render: (r) => <Status on={!r.date_limite || String(r.date_limite).slice(0, 10) >= t} yes="Active" no="Expirée" /> },
      ]}
      fields={[
        { name: 'titre', label: 'Intitulé du poste', required: true },
        { name: 'type_contrat', label: 'Type de contrat', type: 'select', options: CONTRATS, required: true, half: true },
        { name: 'lieu', label: 'Lieu', required: true, half: true },
        { name: 'experience', label: 'Expérience demandée', hint: 'Ex. : 3 ans minimum' },
        { name: 'published_at', label: 'Date de publication', type: 'date', half: true },
        { name: 'date_limite', label: 'Date limite de candidature', type: 'date', half: true },
        { name: 'description', label: 'Description du poste', type: 'textarea', rows: 8 },
      ]}
    />
  );
}

export function FaqAdmin() {
  return (
    <CrudPage
      endpoint="faqs" noun="Question"
      intro="Questions fréquentes affichées dans la page FAQ, regroupées par rubrique."
      searchKeys={['question', 'reponse', 'categorie']}
      filter={{ name: 'categorie', label: 'Toutes les rubriques', options: [['Candidature', 'Candidature'], ['Recrutement', 'Recrutement'], ['Contrats', 'Contrats']] }}
      defaults={{ categorie: 'Candidature', position: 0 }}
      columns={[
        { key: 'question', label: 'Question', render: (r) => <div className="cell-title">{r.question}</div> },
        { key: 'categorie', label: 'Rubrique', render: (r) => <span className="pill pill--gold">{r.categorie}</span> },
        { key: 'position', label: 'Ordre' },
      ]}
      fields={[
        { name: 'question', label: 'Question', required: true },
        { name: 'categorie', label: 'Rubrique', required: true, half: true, suggestions: ['Candidature', 'Recrutement', 'Contrats'] },
        { name: 'position', label: "Ordre d'affichage", type: 'number', half: true },
        { name: 'reponse', label: 'Réponse', type: 'textarea', rows: 7, required: true },
      ]}
    />
  );
}
