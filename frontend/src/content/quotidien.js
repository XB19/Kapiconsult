// Quotidien : conditions d'utilisation et avertissement de mise en relation
// Toute modification de fond doit s'accompagner d'un changement de CONDITIONS_VERSION (backend/src/prestataires.js)
// pour que chaque membre accepte de nouveau les conditions.

export const CONDITIONS_MAJ = '16 novembre 2026';

// Résumé affiché avant l'accès et sur les pages de l'annuaire
export const POINTS_CLES = [
  'Kapi Consult met seulement en relation des clients et des prestataires indépendants : nous ne sommes partie à aucun accord conclu entre eux.',
  'Les prestations, les prix, les délais, les paiements et la qualité du travail relèvent exclusivement du client et du prestataire.',
  'Kapi Consult n’est pas responsable de ce qui se passe en dehors de la plateforme : rencontres, travaux, paiements, dommages, pertes, vols ou litiges.',
  'La vérification d’identité d’un prestataire confirme sa pièce d’identité, pas ses compétences, ses qualifications ni son honnêteté.',
  'Chacun reste prudent : demandez un devis écrit, ne payez jamais tout à l’avance et signalez tout comportement suspect.',
];

export const CONDITIONS = [
  {
    titre: 'Objet du service',
    texte: [
      '« Quotidien » est un annuaire en ligne édité par Kapi Consult (Groupe OSEOR S.A., Lomé, Togo). Il permet à des personnes à la recherche d’un professionnel (les « Clients ») de trouver et de contacter des artisans, techniciens et professionnels indépendants (les « Prestataires »).',
      'L’accès à Quotidien est réservé aux personnes disposant d’un compte Kapi Consult et ayant accepté les présentes conditions.',
    ],
  },
  {
    titre: 'Un simple service de mise en relation',
    texte: [
      'Kapi Consult agit uniquement comme intermédiaire technique de mise en relation. Kapi Consult n’est ni l’employeur, ni le mandataire, ni l’associé, ni le représentant des Prestataires, et n’intervient à aucun moment dans la négociation, la conclusion ou l’exécution des accords entre Clients et Prestataires.',
      'Tout contrat de prestation est conclu directement et exclusivement entre le Client et le Prestataire, qui en assument seuls les droits et obligations.',
    ],
  },
  {
    titre: 'Limitation de responsabilité',
    texte: [
      'Dans les limites permises par la loi applicable, Kapi Consult ne peut être tenue responsable :',
    ],
    liste: [
      'de la qualité, de la conformité, de la sécurité, des délais ou du prix des prestations réalisées ;',
      'des paiements, avances, acomptes ou sommes échangés entre Clients et Prestataires, ni de leur remboursement ;',
      'des dommages matériels ou corporels, pertes, vols, accidents, escroqueries ou préjudices de toute nature survenus à l’occasion d’une prestation ou d’une rencontre ;',
      'des comportements, propos ou actes des Clients et des Prestataires, sur la plateforme comme en dehors ;',
      'des litiges entre Clients et Prestataires, qui doivent être réglés directement entre eux ou devant les autorités compétentes ;',
      'de l’exactitude des informations publiées par les Prestataires sur leur profil.',
    ],
    apres: 'Tout ce qui se passe en dehors de la plateforme (échanges téléphoniques, rendez-vous, travaux, paiements) relève de la seule responsabilité des personnes concernées.',
  },
  {
    titre: 'Vérification des prestataires et ses limites',
    texte: [
      'Pour être publié, chaque Prestataire doit transmettre le recto et le verso de sa carte nationale d’identité (CNI). Un administrateur de Kapi Consult contrôle la cohérence de cette pièce avec le profil avant toute mise en ligne.',
      'Ce contrôle porte uniquement sur l’identité déclarée. Il ne constitue ni une garantie, ni une certification des compétences, des diplômes, des autorisations professionnelles, de la solvabilité ou de l’honnêteté du Prestataire. Le badge « Identité vérifiée » ne peut être interprété autrement.',
      'Kapi Consult peut à tout moment refuser, suspendre ou supprimer un profil, notamment en cas de document douteux, de signalement ou de non-respect des présentes conditions.',
    ],
  },
  {
    titre: 'Engagements du Prestataire',
    liste: [
      'fournir des informations exactes, à jour et une pièce d’identité authentique qui lui appartient ;',
      'exercer son activité dans le respect des lois et règlements en vigueur (déclarations, autorisations, fiscalité, assurances le cas échéant) ;',
      'convenir du prix avec le Client avant toute intervention, de préférence par un devis écrit, et respecter ses engagements ;',
      'ne pas usurper l’identité d’un tiers ni publier de contenu trompeur, offensant ou illicite.',
    ],
    apres: 'Le Prestataire est seul responsable des prestations qu’il réalise, de leurs conséquences et des sommes qu’il perçoit.',
  },
  {
    titre: 'Engagements du Client',
    liste: [
      'vérifier par lui-même que le Prestataire convient à son besoin (expérience, références, devis) ;',
      'demander un devis écrit avant le début des travaux et ne jamais payer l’intégralité à l’avance ;',
      'prendre les précautions d’usage lors des rendez-vous et ne communiquer ni mot de passe ni code bancaire ;',
      'publier des avis sincères, fondés sur une expérience réelle, sans propos injurieux ni diffamatoires.',
    ],
  },
  {
    titre: 'Avis clients',
    texte: [
      'Les avis expriment l’opinion personnelle de leurs auteurs et n’engagent pas Kapi Consult. Kapi Consult peut masquer ou supprimer tout avis inapproprié, mensonger ou contraire aux présentes conditions.',
    ],
  },
  {
    titre: 'Données personnelles et pièce d’identité',
    texte: [
      'Les copies de pièces d’identité sont utilisées uniquement pour vérifier l’identité des Prestataires. Elles ne sont jamais publiées, sont conservées dans un espace non accessible au public et ne sont consultables que par les administrateurs de Kapi Consult.',
      'Elles sont supprimées en même temps que le profil du Prestataire. Chaque membre peut demander l’accès, la rectification ou la suppression de ses données en écrivant à info@kapiconsult.tg.',
      'Les coordonnées professionnelles affichées sur un profil (téléphone, WhatsApp, e-mail) sont publiées à la demande du Prestataire afin d’être contacté.',
    ],
  },
  {
    titre: 'Signalement',
    texte: [
      'Tout comportement suspect, profil frauduleux ou abus peut être signalé à Kapi Consult via la page Contact ou à l’adresse info@kapiconsult.tg. Kapi Consult examinera le signalement et pourra suspendre le profil concerné, sans pour autant devenir partie au litige.',
    ],
  },
  {
    titre: 'Modification des conditions et droit applicable',
    texte: [
      'Kapi Consult peut faire évoluer les présentes conditions. En cas de modification importante, chaque membre devra les accepter de nouveau pour continuer à utiliser Quotidien.',
      'Les présentes conditions sont régies par le droit togolais.',
    ],
  },
];
