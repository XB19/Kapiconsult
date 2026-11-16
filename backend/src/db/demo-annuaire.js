// Données de DÉMONSTRATION pour l'annuaire des prestataires (profils fictifs).
//   Ajouter : npm run demo:annuaire
//   Retirer : npm run demo:annuaire -- --retirer
// Les profils sont marqués « demo » et les comptes clients utilisent le domaine @demo.kapiconsult.local.
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { pool } from './pool.js';

const DOMAINE = '@demo.kapiconsult.local';

// Quartiers et villes avec leurs coordonnées approximatives
const L = {
  agoe: ['Lomé', 'Agoè Assiyéyé', 6.2312, 1.2063], be: ['Lomé', 'Bè Kpota', 6.1395, 1.2378], tokoin: ['Lomé', 'Tokoin Hôpital', 6.1528, 1.2148],
  adido: ['Lomé', 'Adidogomé', 6.1801, 1.1512], hedz: ['Lomé', 'Hédzranawoé', 6.1622, 1.2441], nyek: ['Lomé', 'Nyékonakpoè', 6.1297, 1.2052],
  kegue: ['Lomé', 'Kégué', 6.1712, 1.2563], avedji: ['Lomé', 'Avédji', 6.1956, 1.1807], baguida: ['Lomé', 'Baguida', 6.1648, 1.3302],
  adakpame: ['Lomé', 'Adakpamé', 6.1702, 1.2905], djidjole: ['Lomé', 'Djidjolé', 6.1655, 1.1951], agbalepedo: ['Lomé', 'Agbalépédo', 6.2008, 1.2004],
  totsi: ['Lomé', 'Totsi', 6.1853, 1.2061], kodjo: ['Lomé', 'Kodjoviakopé', 6.1251, 1.1998], wuiti: ['Lomé', 'Wuiti', 6.2152, 1.1806],
  kara: ['Kara', 'Kara Centre', 9.5511, 1.1861], kara2: ['Kara', 'Tomdè', 9.5402, 1.1754], sokode: ['Sokodé', 'Komah', 8.9833, 1.1333],
  kpalime: ['Kpalimé', 'Nyivémé', 6.9001, 0.6301], atakpame: ['Atakpamé', 'Agbonou', 7.5333, 1.1251], tsevie: ['Tsévié', 'Gbédji', 6.4261, 1.2133],
  aneho: ['Aného', 'Zébé', 6.2281, 1.5921], dapaong: ['Dapaong', 'Nassablé', 10.8623, 0.2071],
};

// [nom affiché, métier, lieu, années, spécialités, description, disponibilités, tarif, statut, vérifié, se déplace, rayon]
const PROS = [
  ['Garage Atsu Mécanique', 'Mécanicien automobile', 'agoe', 14, 'Vidange, Diagnostic électronique, Freinage, Embrayage', 'Garage équipé d’une valise de diagnostic multimarque. Entretien courant, révision complète, réparation moteur et boîte de vitesses pour véhicules particuliers et utilitaires. Devis gratuit avant toute intervention.', 'Lun – Sam, 7h30 – 19h', 'Diagnostic à partir de 5 000 FCFA', 'valide', true, true, 15],
  ['Koffi Amouzou', 'Mécanicien automobile', 'adido', 9, 'Toyota, Climatisation auto, Suspension', 'Mécanicien spécialisé Toyota et Hyundai. Je me déplace pour les pannes sur place et le remorquage léger dans tout Lomé-Ouest.', 'Tous les jours, 7h – 20h', 'Main-d’œuvre à partir de 10 000 FCFA', 'valide', false, true, 20],
  ['Auto Service Kégué', 'Mécanicien automobile', 'kegue', 18, 'Moteurs diesel, Injection, Électricité auto', 'Atelier de référence pour les moteurs diesel et l’injection. Pièces d’origine ou adaptables selon votre budget, garantie de 3 mois sur la main-d’œuvre.', 'Lun – Sam, 8h – 18h', 'Sur devis', 'valide', true, false, 10],
  ['Moto Plus Bè', 'Mécanicien moto', 'be', 7, 'Zémidjan, Carburateur, Pneumatiques', 'Réparation et entretien de motos et zémidjans de toutes marques. Changement de pièces rapide, vente de pièces détachées.', 'Lun – Dim, 6h30 – 20h', 'Vidange moto 2 500 FCFA', 'valide', false, false, 5],
  ['Edem Électricité Générale', 'Électricien', 'tokoin', 11, 'Installation bâtiment, Dépannage, Tableaux électriques', 'Électricien agréé : installation neuve, mise aux normes, recherche de panne, pose de tableaux et de disjoncteurs. Interventions chez les particuliers et les entreprises.', 'Lun – Sam, 7h – 18h · urgences 7j/7', 'Déplacement 3 000 FCFA', 'valide', true, true, 25],
  ['Yao Solaire & Électricité', 'Électricien', 'avedji', 8, 'Panneaux solaires, Onduleurs, Groupes électrogènes', 'Installation de kits solaires, batteries et onduleurs pour maisons et boutiques. Étude de vos besoins et conseil sur le dimensionnement.', 'Lun – Sam, 8h – 18h', 'Étude gratuite', 'valide', false, true, 50],
  ['Kossi Électricien', 'Électricien', 'kara', 6, 'Câblage, Prises et éclairage, Compteurs', 'Électricien bâtiment à Kara et environs. Travail propre, respect des délais.', 'Lun – Sam, 7h – 17h', 'Sur devis', 'valide', false, true, 30],
  ['Plomberie Sena', 'Plombier', 'hedz', 12, 'Fuites, Chauffe-eau, Sanitaires, Forages', 'Recherche et réparation de fuites, installation de sanitaires, chauffe-eau et pompes. Raccordement au réseau et entretien des forages.', 'Lun – Sam, 7h – 19h', 'Déplacement 2 000 FCFA', 'valide', true, true, 20],
  ['Afi Plomberie Service', 'Plombier', 'adakpame', 5, 'Débouchage, Robinetterie, Réservoirs', 'Interventions rapides pour débouchage, remplacement de robinets et installation de réservoirs d’eau.', 'Tous les jours, 7h – 21h', 'À partir de 5 000 FCFA', 'valide', false, true, 15],
  ['BTP Agbéko Construction', 'Maçon', 'wuiti', 20, 'Gros œuvre, Fondations, Clôtures, Dallage', 'Équipe de maçons expérimentés pour la construction de maisons, clôtures, fondations et dalles. Suivi de chantier et respect des plans.', 'Lun – Sam, 6h30 – 17h30', 'Sur devis après visite', 'valide', true, true, 50],
  ['Komlan Maçonnerie', 'Maçon', 'tsevie', 10, 'Crépissage, Rénovation, Pavés', 'Maçonnerie générale, crépissage, rénovation de façades et pose de pavés à Tsévié et Lomé nord.', 'Lun – Sam, 7h – 17h', 'Sur devis', 'valide', false, true, 40],
  ['Carrelage Prestige', 'Carreleur', 'totsi', 9, 'Carrelage sol et mur, Faïence, Escaliers', 'Pose de carrelage, faïence et marbre avec des finitions soignées. Conseils dans le choix des matériaux.', 'Lun – Sam, 7h – 18h', 'Pose à partir de 2 500 FCFA/m²', 'valide', false, true, 30],
  ['Menuiserie Dzidzo', 'Menuisier', 'djidjole', 16, 'Meubles sur mesure, Portes, Placards, Bois massif', 'Fabrication de meubles sur mesure, portes, fenêtres, placards et cuisines en bois massif ou contreplaqué. Livraison et pose comprises.', 'Lun – Sam, 7h30 – 18h', 'Sur devis', 'valide', true, false, 15],
  ['Atelier Bois Kpalimé', 'Menuisier', 'kpalime', 13, 'Mobilier, Sculpture, Lits et armoires', 'Menuiserie et ébénisterie artisanale : lits, armoires, salons et objets sculptés en bois local.', 'Lun – Sam, 8h – 17h', 'Sur devis', 'valide', false, false, 20],
  ['Couleurs & Finitions', 'Peintre en bâtiment', 'agbalepedo', 8, 'Peinture intérieure, Façades, Enduits décoratifs', 'Peinture intérieure et extérieure, enduits décoratifs et ravalement de façades. Protection des sols et nettoyage en fin de chantier.', 'Lun – Sam, 7h – 18h', 'À partir de 1 500 FCFA/m²', 'valide', false, true, 25],
  ['Soudure Métal Akakpo', 'Soudeur / Métallier', 'baguida', 15, 'Portails, Grilles de sécurité, Charpentes métalliques', 'Fabrication et pose de portails, grilles de protection, escaliers et charpentes métalliques. Travaux de soudure sur place.', 'Lun – Sam, 7h – 18h', 'Sur devis', 'valide', true, true, 30],
  ['Alu Vitrage Togo', 'Vitrier / Aluminium', 'nyek', 10, 'Fenêtres aluminium, Baies vitrées, Miroirs', 'Menuiserie aluminium : fenêtres, portes vitrées, baies coulissantes, cloisons de bureau et miroirs sur mesure.', 'Lun – Sam, 8h – 18h', 'Sur devis', 'valide', false, true, 20],
  ['Froid Express Lomé', 'Frigoriste / Climatisation', 'tokoin', 12, 'Climatiseurs split, Chambres froides, Recharge de gaz', 'Installation, entretien et dépannage de climatiseurs, réfrigérateurs et chambres froides. Contrat d’entretien pour entreprises.', 'Tous les jours, 7h – 20h', 'Entretien clim 10 000 FCFA', 'valide', true, true, 30],
  ['Clim Service Kara', 'Frigoriste / Climatisation', 'kara2', 6, 'Climatisation, Congélateurs, Ventilateurs', 'Dépannage et installation de climatiseurs et appareils de froid à Kara.', 'Lun – Sam, 8h – 18h', 'Déplacement 2 000 FCFA', 'valide', false, true, 20],
  ['Électro Répar Bè', 'Électronicien (TV, électroménager)', 'be', 11, 'Téléviseurs, Machines à laver, Micro-ondes', 'Réparation de téléviseurs, décodeurs, machines à laver, micro-ondes et petit électroménager. Diagnostic sur place.', 'Lun – Sam, 8h – 19h', 'Diagnostic 2 000 FCFA', 'valide', false, false, 10],
  ['Phone Clinic Déckon', 'Réparateur de téléphones', 'nyek', 5, 'Écrans, Batteries, Déblocage, iPhone et Android', 'Remplacement d’écrans et de batteries, réparation de connecteurs de charge, récupération de données. Réparation en moins d’une heure pour la plupart des pannes.', 'Lun – Sam, 8h – 20h', 'Écran à partir de 8 000 FCFA', 'valide', true, false, 5],
  ['Dodji Informatique', 'Informaticien / Dépannage', 'hedz', 7, 'Dépannage PC, Réseaux, Caméras de surveillance', 'Dépannage d’ordinateurs, installation de réseaux Wi-Fi, caméras de surveillance et maintenance informatique pour PME.', 'Lun – Ven, 8h – 18h · samedi sur RDV', 'Intervention 7 500 FCFA', 'valide', false, true, 25],
  ['Serrurerie Rapide', 'Serrurier', 'tokoin', 9, 'Ouverture de porte, Changement de serrure, Coffres', 'Ouverture de portes claquées, remplacement de serrures et cylindres, installation de verrous de sécurité.', '7j/7, 6h – 22h', 'Ouverture à partir de 7 000 FCFA', 'valide', false, true, 20],
  ['Couture Élégance Ama', 'Couturier / Tailleur', 'adakpame', 12, 'Tenues en pagne, Robes de cérémonie, Uniformes', 'Création de tenues sur mesure en pagne, robes de cérémonie, costumes et uniformes scolaires ou d’entreprise.', 'Lun – Sam, 8h – 19h', 'Tenue à partir de 6 000 FCFA', 'valide', true, false, 10],
  ['Tailleur Kodjo Style', 'Couturier / Tailleur', 'sokode', 15, 'Boubous, Costumes, Retouches', 'Tailleur pour hommes : boubous brodés, costumes et retouches rapides.', 'Lun – Sam, 8h – 18h', 'Sur devis', 'valide', false, false, 10],
  ['Salon Beauté Akossiwa', 'Coiffeur / Coiffeuse', 'agoe', 8, 'Tresses, Tissage, Soins capillaires', 'Salon de coiffure femme : tresses, tissages, défrisage et soins. Coiffure à domicile pour les mariages et événements.', 'Mar – Dim, 8h – 20h', 'Tresses à partir de 5 000 FCFA', 'valide', false, true, 15],
  ['Net & Clean Services', 'Agent d’entretien / Ménage', 'avedji', 6, 'Ménage, Nettoyage de bureaux, Fin de chantier', 'Entretien régulier de domiciles et bureaux, nettoyage de fin de chantier et de vitres. Personnel formé et équipé.', 'Lun – Sam, 7h – 18h', 'À partir de 10 000 FCFA la séance', 'valide', true, true, 20],
  ['Jardins du Golfe', 'Jardinier / Paysagiste', 'baguida', 10, 'Entretien de jardins, Pelouse, Arrosage automatique', 'Création et entretien d’espaces verts, taille de haies, pose de gazon et systèmes d’arrosage.', 'Lun – Sam, 6h30 – 16h', 'Sur devis', 'valide', false, true, 30],
  ['Délices de Mawuli', 'Traiteur / Cuisinier', 'kodjo', 9, 'Cuisine togolaise, Buffets, Événements', 'Service traiteur pour mariages, baptêmes et événements d’entreprise : cuisine togolaise et internationale, service à table.', 'Sur réservation', 'Menu à partir de 3 500 FCFA/pers.', 'valide', true, true, 50],
  ['Studio Lumière Kara', 'Photographe / Vidéaste', 'kara', 6, 'Mariages, Portraits, Drone', 'Photos et vidéos de mariages, portraits professionnels et prises de vues aériennes par drone.', 'Sur rendez-vous', 'Séance à partir de 25 000 FCFA', 'valide', false, true, 100],
  ['Transport Déménagement Express', 'Déménageur / Transport', 'adido', 11, 'Déménagement, Transport de marchandises, Camions', 'Déménagements de maisons et bureaux, transport de marchandises dans tout le Togo avec camions et équipe de manutention.', '7j/7 sur réservation', 'Sur devis', 'valide', false, true, 500],
  ['Atakpamé Électro Froid', 'Frigoriste / Climatisation', 'atakpame', 7, 'Réfrigérateurs, Climatisation', 'Réparation de réfrigérateurs et installation de climatiseurs à Atakpamé.', 'Lun – Sam, 8h – 18h', 'Sur devis', 'valide', false, true, 30],
  ['Aného Plomberie', 'Plombier', 'aneho', 4, 'Sanitaires, Fuites, Pompes', 'Plombier à Aného et environs : installation et dépannage.', 'Lun – Sam, 7h – 18h', 'Sur devis', 'valide', false, true, 25],
  ['Mécanique Savanes', 'Mécanicien automobile', 'dapaong', 10, 'Véhicules 4x4, Tracteurs, Freinage', 'Entretien et réparation de 4x4, pick-up et tracteurs agricoles dans la région des Savanes.', 'Lun – Sam, 7h – 18h', 'Sur devis', 'valide', false, true, 60],
  // Profils en attente : pour montrer la validation dans l'administration
  ['Kafui Électricité', 'Électricien', 'totsi', 3, 'Câblage, Éclairage LED', 'Jeune électricien formé au CFP de Lomé, disponible pour petits et moyens travaux d’installation.', 'Lun – Sam, 8h – 18h', 'Sur devis', 'en_attente', false, true, 15],
  ['Bella Esthétique', 'Esthéticienne', 'hedz', 4, 'Manucure, Soins du visage, Maquillage', 'Soins esthétiques à domicile : manucure, pédicure, soins du visage et maquillage de mariée.', 'Mar – Dim, 9h – 19h', 'Manucure 4 000 FCFA', 'en_attente', false, true, 20],
  ['Chauffeur Pro Mensah', 'Chauffeur', 'kegue', 12, 'Chauffeur privé, Transferts aéroport, Longue distance', 'Chauffeur expérimenté avec permis B, C et D. Transferts aéroport, déplacements professionnels et voyages.', '7j/7', 'Journée à partir de 15 000 FCFA', 'en_attente', false, true, 300],
];

const CLIENTS = [['Mawuena', 'Adjo'], ['Kokou', 'Agbenou'], ['Esi', 'Lawson'], ['Yawo', 'Kponton'], ['Abla', 'Djossou'], ['Sélom', 'Amegah'],
  ['Kafui', 'Dogbe'], ['Akouvi', 'Mensah'], ['Komi', 'Attiogbe'], ['Délali', 'Gbeasor'], ['Fafa', 'Ahadji'], ['Elom', 'Tchalla'], ['Ayélé', 'Bodjona'], ['Edem', 'Folly']];

const AVIS = {
  5: ['Travail impeccable et très professionnel. Je recommande sans hésiter.', 'Ponctuel, efficace et prix honnête. Je ferai de nouveau appel à ses services.',
    'Excellent accueil, explications claires avant l’intervention et résultat parfait.', 'Très satisfait ! Problème réglé en une seule visite.',
    'Sérieux et soigneux, le chantier a été laissé propre. Bravo.', 'Rapide et compétent, il est venu le jour même. Merci beaucoup.'],
  4: ['Bon travail, juste un léger retard au rendez-vous mais résultat conforme.', 'Prestation de qualité, prix un peu élevé mais justifié.',
    'Compétent et aimable. Je recommande.', 'Travail bien fait, communication à améliorer mais je suis satisfait.'],
  3: ['Correct dans l’ensemble, mais il a fallu revenir une deuxième fois.', 'Résultat acceptable, délais un peu longs.'],
};

// Générateur pseudo-aléatoire stable (mêmes données à chaque exécution)
let seed = 42;
const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
const pick = (a) => a[Math.floor(rnd() * a.length)];
const tel = (i) => `+228 9${(i % 9) + 1} 00 ${String(10 + i).padStart(2, '0')} ${String(20 + ((i * 7) % 70)).padStart(2, '0')}`;

async function retirer(db) {
  const p = await db.query('DELETE FROM prestataires WHERE demo RETURNING id');
  const u = await db.query('DELETE FROM users WHERE email LIKE $1 RETURNING id', [`%${DOMAINE}`]);
  console.log(`Démonstration retirée : ${p.rowCount} prestataires, ${u.rowCount} comptes clients (et leurs avis).`);
}

async function main() {
  const db = await pool.connect();
  try {
    await db.query('ALTER TABLE prestataires ADD COLUMN IF NOT EXISTS demo BOOLEAN NOT NULL DEFAULT false');
    await db.query('BEGIN');
    await retirer(db);
    if (process.argv.includes('--retirer')) { await db.query('COMMIT'); return; }

    // Comptes clients de démonstration (mot de passe aléatoire : ils ne servent qu'à porter les avis)
    const hash = await bcrypt.hash(crypto.randomBytes(18).toString('base64'), 10);
    const clients = [];
    for (const [prenom, nom] of CLIENTS) {
      const { rows } = await db.query('INSERT INTO users (prenom, nom, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING id',
        [prenom, nom, `${prenom}.${nom}${DOMAINE}`.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''), hash]);
      clients.push(rows[0].id);
    }

    let nAvis = 0;
    for (const [i, x] of PROS.entries()) {
      const [nom, metier, lk, exp, spec, desc, dispo, tarif, statut, verifie, deplacement, rayon] = x;
      const [ville, quartier, lat, lng] = L[lk];
      // Légère dispersion autour du quartier pour des distances réalistes
      const jitter = () => (rnd() - 0.5) * 0.008;
      const created = new Date(Date.now() - Math.floor(rnd() * 200 + 5) * 86400000);
      const { rows } = await db.query(
        `INSERT INTO prestataires (nom_affiche, metier, specialites, description, experience, telephone, whatsapp, email, pays, ville, quartier,
          latitude, longitude, rayon_km, deplacement, disponibilite, tarif, statut, verifie, vues, demo, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'Togo',$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,true,$20) RETURNING id`,
        [nom, metier, spec.split(',').map((s) => s.trim()), desc, exp, tel(i), rnd() > 0.25 ? tel(i) : null,
          rnd() > 0.5 ? `contact${i + 1}${DOMAINE}` : null, ville, quartier, lat + jitter(), lng + jitter(), rayon, deplacement, dispo, tarif,
          statut, verifie, Math.floor(rnd() * 400) + 15, created],
      );
      if (statut !== 'valide') continue;
      // 0 à 7 avis par prestataire, majoritairement positifs
      const n = Math.floor(rnd() * 8);
      const shuffled = [...clients].sort(() => rnd() - 0.5).slice(0, n);
      for (const uid of shuffled) {
        const r = rnd(); const note = r < 0.55 ? 5 : r < 0.88 ? 4 : 3;
        const when = new Date(created.getTime() + Math.floor(rnd() * (Date.now() - created.getTime())));
        await db.query('INSERT INTO avis (prestataire_id, user_id, note, commentaire, created_at) VALUES ($1, $2, $3, $4, $5)',
          [rows[0].id, uid, note, pick(AVIS[note]), when]);
        nAvis += 1;
      }
    }
    await db.query('COMMIT');
    const valides = PROS.filter((x) => x[8] === 'valide').length;
    console.log(`Démonstration ajoutée : ${PROS.length} prestataires (${valides} en ligne, ${PROS.length - valides} en attente), ${clients.length} clients, ${nAvis} avis.`);
  } catch (e) {
    await db.query('ROLLBACK');
    throw e;
  } finally {
    db.release();
    await pool.end();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
