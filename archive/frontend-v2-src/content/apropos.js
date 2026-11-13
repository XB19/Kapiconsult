// Page « À propos » — textes identiques au site d'origine

export const HERO = {
  image: '/storage/kapi/banner_apropos.jpg',
  tag: 'Qui sommes-nous',
  title: 'À propos de Kapi Consult',
  sub: "Bureau d'études et de conseil en management, nous accompagnons les organisations d'Afrique de l'Ouest vers l'excellence et la compétitivité.",
};

export const MISSION = {
  tag: 'Notre Mission',
  title: 'Un cabinet au service du développement organisationnel',
  paragraphs: [
    "KAPI CONSULT est un cabinet d'Études et de Conseils en management, organisation et compétitivité orienté Résultats dans les métiers de production et d'infrastructure.",
    "Nous contribuons au développement de nos clients en leur apportant des services d'optimisation stratégique, technologique, industrielle et financière pour favoriser leur pérennité et leur succès.",
    'Membre du groupe OSEOR S.A., notre équipe jeune et dynamique intervient au Togo, Bénin, Burkina Faso et Niger.',
  ],
};

export const STATS = [
  { value: '12', label: "Pays d'intervention" },
  { value: '20+', label: "Années d'expérience" },
  { value: '8', label: "Domaines d'expertise" },
  { value: '>300Mds', label: 'FCFA mobilisés' },
];

export const ZONES = ['Togo', 'Bénin', 'Burkina Faso', 'Niger', "Côte d'Ivoire", 'Ghana', 'Mali', 'Sénégal', 'Nigeria', 'Guinée Bissau', 'Guinée', 'RDC'];

export const ATOUTS = {
  tag: 'Nos Atouts',
  title: 'Ce qui fait notre force',
  text: 'Une équipe jeune et dynamique alliant expertise, rigueur et passion pour accompagner nos clients vers le succès.',
  img: '/storage/kapi/atouts.png',
};

export const VALEURS = {
  tag: 'Nos Valeurs',
  title: 'Ce qui nous guide au quotidien',
  text: "Nos valeurs fondamentales définissent notre manière d'exercer notre métier et de nous engager auprès de nos clients et partenaires.",
  img: '/storage/kapi/valeurs.png',
  items: [
    { icon: '🏅', name: 'Intégrité', text: 'Nous faisons ce que nous avons dit. Nous tenons nos engagements.' },
    { icon: '🤝', name: 'Engagement & Partenariat', text: 'Nous sommes passionnés par votre succès. Nous serons donc toujours là pour vous accompagner vers le résultat.' },
    { icon: '⚡', name: 'Courage', text: 'Parce que nous acceptons d\'être jugés sur nos résultats, nous assumons nos démarches et nos recommandations.' },
    { icon: '💙', name: 'Compassion', text: 'Nous reconnaissons que souvent le changement peut être difficile pour certains. Et c\'est notre rôle d\'être à leurs côtés.' },
    { icon: '♻️', name: 'Responsabilité', text: 'Nous nous engageons sur ce que nous pouvons faire pour délivrer vos attentes.' },
  ],
};

export const APPROCHE = {
  tag: 'Notre Approche',
  title: 'Une démarche structurée et rigoureuse orientée RESULTATS',
  steps: [
    { n: '01', name: 'Diagnostic', text: 'Analyse approfondie du contexte, des besoins et des enjeux de votre organisation' },
    { n: '02', name: 'Conception', text: 'Élaboration d\'une solution sur mesure, co-construite avec vos équipes' },
    { n: '03', name: 'Validation', text: 'Validation de la solution proposée avec les parties prenantes' },
    { n: '04', name: 'Mise en œuvre', text: 'Déploiement rigoureux avec un accompagnement terrain et un suivi permanent' },
    { n: '05', name: 'Évaluation', text: 'Mesure des résultats, capitalisation et ajustements pour un impact durable' },
  ],
};

export const REALISATIONS = {
  tag: 'Nos Réalisations',
  title: 'Quelques références emblématiques',
  sub: "Des projets de grande envergure à travers l'Afrique de l'Ouest.",
  items: [
    { img: '/storage/kapi/real_zener.jpg', cat: 'Finances & Investissement', name: 'ZENER SA — Togo', text: 'Étude et mobilisation de 16 milliards FCFA pour le développement des activités de distribution de gaz.' },
    { img: '/storage/kapi/real_radisson.jpg', cat: 'Ingénierie Financière', name: 'Radisson Abidjan', text: "Étude et mobilisation de ressources financières pour la construction d'un hôtel 5 étoiles Radisson Blu." },
    { img: '/storage/kapi/real_sheraton.jpg', cat: 'Finances & Investissement', name: 'Sheraton Bamako', text: 'Étude et mobilisation de ressources pour le financement de la construction du SHERATON BAMAKO.' },
    { img: '/storage/kapi/real_aeroport.jpg', cat: 'Infrastructure', name: 'Aéroport Gnassingbé Eyadema', text: "Contrôle des travaux d'installation du système hydrant de l'Aéroport International." },
  ],
};

export const GROUPE = {
  tag: 'Notre Groupe',
  title: 'Groupe OSEOR S.A.',
  intro: "Kapi Consult est membre du Groupe OSEOR S.A., un groupe panafricain basé à Lomé (Togo), fédérant des entreprises spécialisées dans le conseil, l'ingénierie financière, le digital et les services aux entreprises en Afrique de l'Ouest.",
  multiTitle: 'Un groupe multi-sectoriel',
  multiText: 'OSEOR S.A. est un groupe diversifié qui accompagne les acteurs économiques en Afrique à travers des filiales couvrant des secteurs stratégiques : Energie, Industrie et Services.',
  villes: ['Lomé, Togo', 'Cotonou, Bénin', 'Ouagadougou, Burkina', 'Niamey, Niger'],
  filialesTitle: 'Les 15 filiales du groupe',
  filiales: [
    { icon: '📊', name: 'KAPI Consult', text: "Cabinet d'Études et de Conseils en management, organisation et compétitivité." },
    { icon: '🚗', name: 'DIWA International', text: 'Représentation commerciale GM, ISUZU et MG. Solutions de lubrification industrielle et équipements technologiques.' },
    { icon: '💼', name: 'OSEOR', text: 'Structure financière spécialisée dans l\'ingénierie financière et les prises de participation dans les PME à fort potentiel.' },
    { icon: '⚙️', name: 'DIWA Industries', text: "Production industrielle, fabrication de bouteilles de gaz, d'emballages métalliques et accessoires." },
    { icon: '⛽', name: 'ZENER SA', text: 'Stockage, emplissage et distribution de GPL. Leader du secteur au Togo avec plus de 65% de part de marché.' },
    { icon: '🏗️', name: 'JCEMGROUP TOGO', text: 'Production et vente de béton préfabriqué et de carreaux.' },
    { icon: '🍽️', name: 'DIWA Products', text: 'Agro-alimentaire et restauration, partenaire du groupe français BONICI.' },
    { icon: '💻', name: '@TOGO', text: 'Développement de projets numériques et digitaux.' },
    { icon: '🚚', name: 'TRFS', text: "Transport de marchandises sur l'hinterland et le plan national pour les industries et brasseries." },
    { icon: '📈', name: 'BOURSERIA', text: 'Établissement financier spécialisé dans les services en investissement et en placement boursier.' },
    { icon: '🌾', name: 'DABA', text: "Agro-business, production et transformation de produits d'élevage, abattoir moderne." },
    { icon: '🔋', name: 'BLUEN', text: "Développement et déploiement de solutions énergétiques à base d'énergies renouvelables." },
    { icon: '🟦', name: 'PLS', text: 'Solutions de stockage, reconditionnement et distribution du gaz butane.' },
    { icon: '🟧', name: 'PGS', text: 'Solutions de stockage, reconditionnement et distribution du gaz propane.' },
    { icon: '⛽', name: 'Zen Grupo', text: 'Stockage, emplissage et distribution de GPL.' },
  ],
  forceTitle: "La force d'un groupe",
  forceText: "En tant que membre d'OSEOR S.A., Kapi Consult bénéficie de synergies inter-filiales permettant d'offrir à ses clients des solutions intégrées couvrant l'ensemble de la chaîne de valeur : stratégie, finance, digital et opérations.",
  forceStats: [
    { value: '15', label: 'Filiales' }, { value: '4', label: 'Pays' }, { value: '20+', label: 'Années' }, { value: '300Mds+', label: 'FCFA mobilisés' },
  ],
};

export const CTA = {
  title: 'Travaillons ensemble',
  text: 'Contactez-nous pour discuter de vos projets et découvrir comment Kapi Consult peut vous accompagner.',
};
