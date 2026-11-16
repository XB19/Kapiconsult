// Contenu éditorial du site (textes identiques à kapiconsult.tg)

export const CONTACT = {
  adresse: ['Boulevard Faure GNASSINGBE', 'Immeuble D&D, Agoè BKS', 'Lomé, Togo', '08 B.P. 85 35 Lomé-Togo'],
  adresseCourte: 'Immeuble D&D, Agoè BKS, Lomé, Togo',
  telephones: ['+228 22 51 89 69', '+228 93 17 01 01'],
  emails: ['info@kapiconsult.tg', 'infokapi@kapiconsult.tg', 'info@kapiconsult.com', 'infokapi@kapiconsult.com'],
  horaires: ['Lundi – Vendredi : 8h – 17h30', 'Samedi : 8h – 12h'],
  zones: ['Togo', 'Bénin', 'Burkina Faso', 'Niger', "Côte d'Ivoire", 'Guinée Bissau', 'Tchad', 'RDC'],
};

export const tel = (t) => `tel:${t.replace(/\s/g, '')}`;

export const NAV = [
  { label: 'Accueil', to: '/' },
  { label: 'À propos', to: '/a-propos' },
  { label: 'Nos activités', to: '/nos-activites' },
  // Menu « Nos solutions » masqué (Kapi board select, Kapi data : bientôt disponibles)
  { label: 'Nos produits', to: '/nos-produits' },
  {
    label: 'Publications',
    children: [
      { label: 'Actualités', to: '/actualites', desc: 'Restez informé de nos dernières nouvelles et événements.' },
      { label: 'Blog', to: '/blog', desc: 'Conseils, tendances RH et articles de fond par nos experts.' },
      { label: 'FAQ', to: '/faq', desc: 'Trouvez rapidement les réponses à vos questions.' },
    ],
  },
  {
    label: 'Bons Plans',
    children: [
      { label: 'Offres & promotions', to: '/bons-plans', desc: 'Offres spéciales, promotions et avantages exclusifs sélectionnés pour vous.' },
      { label: 'Quotidien', to: '/prestataires', desc: 'Trouvez un professionnel de confiance près de chez vous.' },
    ],
  },
  {
    label: 'Carrière',
    children: [
      { label: "Offres d'emploi", to: '/offres', desc: 'Découvrez nos opportunités de carrière et rejoignez une équipe dynamique et engagée.' },
      { label: 'Candidature spontanée', to: '/candidature-spontanee', desc: 'Rejoignez nos équipes même sans offre publiée. Nous gardons votre dossier en vue.' },
    ],
  },
  { label: 'Contact', to: '/contact' },
];

export const EXPERTISES = ['Compétitivité', 'Microfinance', 'Formation', 'Audit et Gouvernance', 'Management et Organisation',
  'Etudes et Publications', 'Industries et Energie', 'Finances et Investissement', 'Partenariats Public-Privé', 'Recrutement',
  'Outsourcing', 'Fintech'];

export const HERO = {
  tag: "Bureau d'Études & Conseil — Lomé, Togo",
  title: ['Votre partenaire', 'stratégique', 'de confiance'],
  sub: "Cabinet d'Études et de Conseils en management, organisation et compétitivité, orienté Résultats dans les métiers de production et d'infrastructure.",
  kpis: [
    { icon: '🏆', value: 20, suffix: '+', label: "Années d'expérience" },
    { icon: '🌍', value: 12, suffix: '', label: "Pays d'intervention" },
    { icon: '💼', value: null, suffix: '', label: 'Offres actives' }, // calculé depuis la base
    { icon: '📈', value: 300, suffix: 'Mds', label: 'FCFA mobilisés' },
  ],
};

export const SERVICES = [
  { img: '/storage/kapi/domaine_etudes2.jpg', name: 'Conseil & Audit', desc: 'Audit organisationnel, gouvernance et conseil stratégique pour améliorer la performance de votre organisation.' },
  { img: '/storage/kapi/prod_formation_mgmt.jpg', name: 'Formation Professionnelle', desc: 'Programmes sur mesure pour renforcer les compétences individuelles et collectives de vos équipes.' },
  { img: '/storage/kapi/domaine_industrie.jpg', name: 'Infrastructure & PPP', desc: "Montage et structuration de projets d'infrastructure en partenariats public-privé et ingénierie financière." },
];

export const PRESENTATION = [
  "KAPI CONSULT est un cabinet d'Études et de Conseils en management, organisation et compétitivité orienté Résultats dans les métiers de production et d'infrastructure.",
  "Nous contribuons au développement de nos clients en leur apportant des services d'optimisation stratégique, technologique, industrielle et financière pour favoriser leur pérennité et leur succès.",
];

export const HOME_STATS = [
  { value: '20+', label: "Années d'expérience" },
  { value: '4', label: "Pays d'intervention" },
  { value: '8', label: "Domaines d'expertise" },
  { value: '100s', label: 'Profils recrutés' },
];

export const REALISATIONS_HOME = [
  { img: '/storage/kapi/real_zener.jpg', name: 'ZENER SA', desc: 'Mobilisation de 16 milliards FCFA pour le développement des activités de distribution de gaz.' },
  { img: '/storage/kapi/real_radisson.jpg', name: 'Radisson Abidjan', desc: "Étude et mobilisation de ressources pour la construction d'un hôtel 5 étoiles Radisson Blu." },
  { img: '/storage/kapi/real_sheraton.jpg', name: 'Sheraton Bamako', desc: 'Étude et mobilisation de ressources pour le financement de SHERATON BAMAKO.' },
  { img: '/storage/kapi/real_aeroport.jpg', name: 'Aéroport Gnassingbé', desc: "Contrôle des travaux du système hydrant de l'Aéroport International Gnassingbé Eyadema." },
];

export const LOGOS_REALISATIONS = [
  { img: '/storage/kapi/real_aprodat.jpg', name: 'APRODAT', sub: 'Stratégie PPP — Togo' },
  { img: '/storage/kapi/real_buyrek.png', name: 'BuyRek Africa', sub: 'Stratégie Fintech' },
  { img: '/storage/kapi/real_afrik_creances.png', name: 'Afrik Créances', sub: 'Plan stratégique quinquennal' },
  { img: '/storage/kapi/real_ibbank.jpg', name: 'IB Bank (ex BTCI)', sub: 'Stratégie commerciale' },
];

const P = '/storage/partenaires/';
export const PARTENAIRES = [
  { name: 'OSEOR', img: `${P}1V8bLOV04r83bkZaogPJ1qpN66aBFfSY56iVqdzY.png` },
  { name: 'DiWA Industries', img: `${P}AFnFwentvgwBWbOACCNaXOFnMI9q2eQAWJhwulRV.png` },
  { name: 'DiWA Products', img: `${P}V0fr5oYMCn8u36Md0We6fYhjwTUUGOVdU804bBeM.png` },
  { name: 'DiWA International', img: `${P}2ZAmpFBOuXdgHW70yQlxZHVnWTa5dbT9t4yQHsmc.png` },
  { name: 'ZENER SA', img: `${P}uzlCJlGThVPqUE0uEV3v5BlhrobjejMGwrZgTFlt.png` },
  { name: 'BLUEN Clean Energy', img: `${P}waLk6t88n6PeGXnavC4Yn0f0SMYXnsJD5SoTaL6z.png` },
  { name: 'JCEMGROUP Togo', img: `${P}4OLfg9gc10ydHBZAkOVJISYjm5thJRj9rTMbM8Eb.png` },
  { name: 'PGS' }, { name: 'PLS' }, { name: 'Bourseria' },
  { name: 'TRFS', img: `${P}trfs.png` },
  { name: 'BIDC (EBID)' }, { name: 'BOAD' }, { name: 'AFREXIM BANK' }, { name: 'CORIS Capital' }, { name: 'BMCE Capital' },
  { name: 'ONUD (UNIDO)' }, { name: 'CITAC' }, { name: 'IMC' }, { name: 'Profiles International' }, { name: 'GIDB' },
  { name: 'Ingénieurs sans frontières' }, { name: 'RITES' }, { name: 'Cabinet Gainsbury & Consorts' },
  { name: 'Partners in Performance' }, { name: "Conseil de l'Entente" },
  { name: '@TOGO', img: '/storage/kapi/part_atogo.jpg' }, { name: 'citygroup' },
];

export const ANNIV = {
  badge: '20 ANS',
  banner: ["Kapi Consult célèbre ses ", "20 ans d'excellence", " au service des organisations d'Afrique de l'Ouest"],
  popupTag: 'Kapi Consult',
  popupKicker: "ANS D'EXCELLENCE",
  popupTitle: ["Au service des organisations", "d'Afrique de l'Ouest"],
  popupText: "Depuis 2004, Kapi Consult accompagne les acteurs économiques vers l'excellence et la compétitivité.",
};

export const FOOTER = {
  slogan: 'Nous développons vos métiers',
  about: "Bureau d'études et de conseil en management. Votre partenaire stratégique au Togo, Bénin, Burkina Faso et Niger.",
};
