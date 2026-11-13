// Page « Nos activités » — textes identiques au site d'origine

export const HERO = {
  image: '/storage/kapi/technology.png',
  tag: "Domaines d'expertise",
  title: 'Nos Activités',
  sub: "Des expertises complémentaires au service du développement des organisations et des territoires en Afrique de l'Ouest.",
};

export const DOMAINES_INTRO = {
  tag: 'Nos domaines',
  title: "8 domaines d'expertise clés",
  sub: 'Kapi Consult intervient sur des missions à fort impact dans les secteurs privé, public et para-public.',
};

export const DOMAINES = [
  { id: 'competitivite', img: '/storage/kapi/domaine_competitivite.jpg', name: 'Compétitivité',
    text: "Nous accompagnons les entreprises dans l'amélioration de leur compétitivité et de leur positionnement stratégique dans les métiers de production et d'infrastructure.",
    items: ['Valorisation des infrastructures et des équipements', 'Clusters et Diamond Model', 'Partenariat Privé-Public', 'Privatisation', 'Supply chain'] },
  { id: 'microfinance', img: '/storage/kapi/domaine_microfinance.jpg', name: 'Microfinance',
    text: 'Nous appuyons la création, le développement et le renforcement des institutions de microfinance et des réseaux de finance inclusive.',
    items: ["Création et développement d'institution ou de réseau", 'Evaluation, fonctionnement et transformation', 'Gouvernance et organisation institutionnelle', 'Surveillance et contrôle', "Système d'information", 'Fintech'] },
  { id: 'formation', img: '/storage/kapi/prod_formation_mgmt.jpg', name: 'Formation',
    text: 'Nous concevons et délivrons des programmes de formation sur mesure pour développer les compétences individuelles et organisationnelles.',
    items: ['Gouvernance et leadership', 'Communication, Leadership et Intelligence émotionnelle', 'Prise de parole en public avec impact', 'Gestion et pilotage de projet', 'Gestion des collectivités locales'] },
  { id: 'audit', img: '/storage/kapi/domaine_etudes2.jpg', name: 'Audit et Gouvernance',
    text: "Nous réalisons des missions d'audit organisationnel, de gouvernance et de conformité pour améliorer la performance et la transparence des organisations.",
    items: ['Politique et procédures', 'Audit opérationnel', 'Risques opérationnels', 'Environnement de travail', 'Audit technique', 'Responsabilité Sociétale des Entreprises (RSE)'] },
  { id: 'management', img: '/storage/kapi/domaine_management.jpg', name: 'Management et Organisation',
    text: "Nous intervenons sur la conception et l'amélioration des systèmes de management et des structures organisationnelles pour rendre les organisations plus performantes.",
    items: ['Développement Stratégie', 'Organisation & Competitivité', 'Re-engineering', 'Optimisation', 'Recrutement', 'Outsourcing'] },
  { id: 'etudes', img: '/storage/kapi/domaine_etudes.jpg', name: 'Etudes et Publications',
    text: 'Nous réalisons des études à fort impact pour éclairer les décisions stratégiques des organisations publiques et privées.',
    items: ['Etudes économiques et prospectives', 'Analyses sectorielles', 'Etudes statistiques et sondages', 'Etudes de marché', "Etudes d'impact environnemental et social"] },
  { id: 'industries', img: '/storage/kapi/domaine_industrie.jpg', name: 'Industries et Energie',
    text: 'Nous accompagnons les projets industriels et énergétiques dans leur structuration, leur développement et leur mise en œuvre.',
    items: ['Mini-usines', 'Energie et Hydrocarbures', 'Transfert de technologie', 'Sécurité et incendie', 'Mines'] },
  { id: 'finances', img: '/storage/kapi/domaine_finance.jpg', name: 'Finances et Investissement',
    text: "Nous apportons notre expertise en ingénierie financière pour structurer et financer les projets d'investissement de nos clients.",
    items: ['Business plan complet et évaluation de projet', 'Ingénierie financière et structuration', 'Recherche de financement / levée de fonds', 'Fusions et acquisitions'] },
];

export const SECTEURS = {
  tag: "Secteurs d'intervention",
  title: 'Nous intervenons dans tous les secteurs',
  items: ['Secteur Public', 'Institutions Financières', 'Industrie & Agro-industrie', 'Télécommunications', 'Énergie & Mines', 'Santé',
    'Éducation', 'BTP & Infrastructure', 'Commerce & Distribution', 'ONG & Associations', 'PME & Startups', 'Institutions Internationales'],
};

export const VISION = {
  img: '/storage/kapi/technology.png',
  tag: 'Notre Vision',
  title: "Innovation & Expertise au service de l'Afrique",
  text: 'Nous apportons des solutions d\'optimisation stratégique, technologique, industrielle et financière.',
};

export const ATOUTS = {
  tag: 'Nos Atouts',
  title: 'Démarche Orientée RESULTATS',
  text: 'Une équipe jeune et dynamique alliant expertise, rigueur et disponibilité, s\'appuyant sur un réseau de partenaires fiables et des collaborateurs engagés et passionnés.',
  items: ['Expertise', 'Rigueur et réactivité', 'Disponibilité', 'Réseau de partenaires fiables', 'Professionnalisme', 'Expérience', 'Optimisation',
    'Collaborateurs engagés et passionnés', 'Équipe jeune et dynamique'],
  img: '/storage/kapi/atouts.png',
};

export const COUVERTURE = {
  tag: 'Zone de couverture',
  title: 'Présence régionale et ambition internationale',
  text: 'Basés à Lomé, Togo, nous intervenons régulièrement au Bénin, Burkina Faso et Niger. Membre du groupe OSEOR S.A., nous accompagnons aussi bien les organisations privées que publiques dans toute la sous-région.',
  actuelleLabel: 'Présence actuelle',
  actuelle: ['🇹🇬 Togo'],
  projetLabel: 'Nous projetons d\'élargir notre présence',
  projet: ['🇧🇯 Bénin', '🇬🇼 Guinée-Bissau', "🇨🇮 Côte d'Ivoire", '🇧🇫 Burkina Faso', '🇳🇪 Niger'],
  secteursLabel: 'Secteurs',
  secteurs: ['Secteur privé', 'Secteur public', 'Para-public', 'Institutions financières', 'ONG'],
};

export const APPROCHE = {
  title: 'Notre approche en 5 étapes',
  steps: [
    { n: '01', name: 'Diagnostic', text: 'Analyse du contexte et des besoins spécifiques de chaque client' },
    { n: '02', name: 'Conception', text: 'Élaboration d\'une solution sur mesure co-construite avec le client' },
    { n: '03', name: 'Validation', text: 'Validation de la solution proposée avec les parties prenantes' },
    { n: '04', name: 'Mise en œuvre', text: 'Déploiement rigoureux avec accompagnement terrain' },
    { n: '05', name: 'Évaluation', text: 'Mesure des résultats et capitalisation des acquis' },
  ],
};

export const RECRUTEMENTS = {
  tag: 'Recrutements',
  title: 'Des centaines de profils recrutés',
  sub: "KAPI CONSULT accompagne les grandes institutions dans l'identification et le recrutement de leurs cadres dirigeants.",
  items: [
    { icon: '🏛️', name: "Banque d'Investissement et de Développement de la CEDEAO (BIDC)",
      missions: ["Assistance technique au Conseil d'Administration pour le recrutement du Président", 'Recrutement du Vice-Président Opération', 'Recrutement du Vice-Président Finances', 'Recrutement des Directeurs des départements'] },
    { icon: '🏦', name: 'Banque Ouest Africaine de Développement (BOAD)',
      missions: ['Recrutement du Directeur de la Stratégie et des Études', 'Recrutement du Responsable des suretés', 'Recrutement du Directeur juridique'] },
    { icon: '🏢', name: 'SGI Togo', missions: ['Recrutement du Directeur Général', 'Recrutement du Directeur Général Adjoint chargé du Secrétariat Général'] },
    { icon: '⚡', name: "Système d'Échange d'Énergie Électrique Ouest Africain (EEEOA-WAPP)", missions: ['Recrutement du Secrétariat général'] },
  ],
};

export const REALISATIONS = {
  tag: 'Nos Réalisations',
  title: 'Études & Mobilisation de ressources',
  sub: ["Des centaines d'études réalisées, des centaines de projets évalués — Plus de ", '300 milliards FCFA mobilisés', '.'],
  items: [
    { img: '/storage/kapi/real_zener.jpg', cat: 'Finances & Investissement', name: 'ZENER SA', text: 'Étude et mobilisation de 16 milliards FCFA auprès de Coris Capital, Ecobank, NSIA Bank, IB Bank, BIDC pour le développement des activités de distribution de gaz.' },
    { img: '/storage/kapi/real_radisson.jpg', cat: 'Ingénierie Financière', name: 'Radisson Blu — Abidjan', text: "Étude et mobilisation de ressources financières pour la construction et l'exploitation d'un hôtel 5 étoiles sous la marque Radisson Blu." },
    { img: '/storage/kapi/real_sheraton.jpg', cat: 'Ingénierie Financière', name: 'Sheraton Bamako', text: "Étude et mobilisation de ressources pour le financement de la construction et l'exploitation de SHERATON BAMAKO (KHI-SA)." },
    { img: '/storage/kapi/real_aeroport.jpg', cat: 'Infrastructure', name: 'Aéroport Gnassingbé Eyadema', text: "Contrôle des travaux d'installation du système hydrant sur la nouvelle et l'ancienne aérogare de l'Aéroport International." },
    { img: '/storage/kapi/real_aprodat.jpg', cat: 'Stratégie', name: 'APRODAT', text: 'Élaboration d\'une stratégie de mise en œuvre des Partenariats Publics Privés dans les Zones de Transformation Agro-alimentaire (ZTA).', logo: true },
    { img: '/storage/kapi/real_buyrek.png', cat: 'Stratégie', name: 'BuyRek Africa', text: "Élaboration de la stratégie quinquennale de mise en œuvre des services fintech à travers une plateforme d'achat de biens et services.", logo: true },
    { img: '/storage/kapi/real_afrik_creances.png', cat: 'Stratégie', name: 'Afrik Créances', text: 'Élaboration du plan stratégique quinquennal pour le développement des services bancaires et financiers inclusifs en Afrique.', logo: true },
    { img: '/storage/kapi/real_ibbank.jpg', cat: 'Stratégie', name: 'IB Bank (ex BTCI)', text: "Élaboration d'une stratégie de développement commercial de la monétique de la Banque Togolaise pour le Commerce et l'Industrie.", logo: true },
    { icon: '🏙️', cat: 'Études', name: 'Centre Commercial Niamey', text: "Étude de préfaisabilité du projet de construction d'un Centre commercial à Niamey (Niger)." },
    { icon: '⛽', cat: 'Études', name: 'CORIS Capital / Burkina-Faso', text: "Étude de faisabilité pour l'implantation d'une unité d'importation, stockage, emplissage et distribution du GPL au Burkina-Faso." },
    { icon: '🏗️', cat: 'Ingénierie Financière', name: 'KHI Conakry', text: 'Mobilisation de 23 millions FCFA sous forme de garantie auprès de AFREXIM BANK pour le projet KOIRA HOTEL INVESTMENT-SA Mali.' },
    { icon: '🏛️', cat: 'Ingénierie Financière', name: 'BIDC — EBID', text: "Étude et mobilisation de 26,25 milliards FCFA auprès de la BMCE pour soutenir les activités de la Banque d'Investissement et de Développement de la CEDEAO." },
    { icon: '🤝', cat: 'Études', name: 'Ministère du développement à la base', text: "Étude de faisabilité pour la mise en place d'un système d'identifiant unique pour les bénéficiaires des structures œuvrant à l'employabilité (PAIEJ-SP)." },
    { icon: '🛣️', cat: 'Études', name: 'Ministère des Infrastructures et des Transports', text: "Étude diagnostique des PME impliquées dans le sous-secteur de l'entretien routier au Togo." },
  ],
};

export const SEMINAIRES = {
  tag: 'Séminaires & Formations',
  title: 'Plusieurs séminaires et formations organisés',
  text: 'KAPI CONSULT conçoit et délivre des programmes de formation sur mesure dans des domaines clés pour le développement des organisations africaines.',
  items: ['Gouvernance', 'Finance', 'Partenariat Public-Privé', 'Gestion de projet', 'Supply chain', 'Gestion des collectivités locales'],
};

export const PUBLICATIONS = {
  tag: 'KAPI Business Review',
  title: 'Publication d\'articles de recherche',
  text: "Des publications de référence sur les enjeux économiques et financiers de l'Afrique de l'Ouest.",
  items: [
    'Moyens de paiements électroniques, pertinence pour les économies en développement',
    "Paradoxe du financement agricole en Afrique de l'ouest — Cas du Togo",
    "Accord de partenariat économique entre l'Afrique de l'ouest et l'Union Européenne : Pertinence pour l'économie togolaise",
    'Étude sur la satisfaction des usagers du service bancaire au Togo',
  ],
};

export const CTA = {
  title: "Besoin d'un accompagnement ?",
  text: 'Discutons de votre projet et trouvons ensemble la solution la mieux adaptée à vos besoins.',
};
