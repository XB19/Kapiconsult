// Annuaire des prestataires : métiers, pays et villes proposés
import {
  AppWindow, Bike, BrickWall, Briefcase, Camera, Car, ChefHat, Droplets, Fan, Flame, Grid3x3, Hammer, HardHat, KeyRound,
  Laptop, PaintRoller, Scissors, Shirt, Smartphone, Snowflake, Sparkles, SprayCan, Sprout, Truck, Tv, Wrench, Zap,
} from 'lucide-react';

export const METIERS = [
  { label: 'Mécanicien automobile', icon: Wrench },
  { label: 'Mécanicien moto', icon: Bike },
  { label: 'Électricien', icon: Zap },
  { label: 'Plombier', icon: Droplets },
  { label: 'Maçon', icon: BrickWall },
  { label: 'Carreleur', icon: Grid3x3 },
  { label: 'Menuisier', icon: Hammer },
  { label: 'Peintre en bâtiment', icon: PaintRoller },
  { label: 'Soudeur / Métallier', icon: Flame },
  { label: 'Vitrier / Aluminium', icon: AppWindow },
  { label: 'Frigoriste / Climatisation', icon: Snowflake },
  { label: 'Électronicien (TV, électroménager)', icon: Tv },
  { label: 'Réparateur de téléphones', icon: Smartphone },
  { label: 'Informaticien / Dépannage', icon: Laptop },
  { label: 'Serrurier', icon: KeyRound },
  { label: 'Couturier / Tailleur', icon: Shirt },
  { label: 'Coiffeur / Coiffeuse', icon: Scissors },
  { label: 'Esthéticienne', icon: Sparkles },
  { label: 'Agent d’entretien / Ménage', icon: SprayCan },
  { label: 'Jardinier / Paysagiste', icon: Sprout },
  { label: 'Chauffeur', icon: Car },
  { label: 'Déménageur / Transport', icon: Truck },
  { label: 'Traiteur / Cuisinier', icon: ChefHat },
  { label: 'Photographe / Vidéaste', icon: Camera },
  { label: 'Technicien en ventilation', icon: Fan },
  { label: 'Chef de chantier / BTP', icon: HardHat },
  { label: 'Autre métier', icon: Briefcase },
];

export const metierIcon = (m) => METIERS.find((x) => x.label === m)?.icon || Briefcase;

// Métiers mis en avant sur la page de recherche
export const METIERS_POPULAIRES = ['Mécanicien automobile', 'Électricien', 'Plombier', 'Menuisier', 'Maçon', 'Frigoriste / Climatisation',
  'Couturier / Tailleur', 'Informaticien / Dépannage'];

export const PAYS = ['Togo', 'Bénin', 'Burkina Faso', 'Niger', "Côte d'Ivoire", 'Ghana', 'Mali', 'Sénégal'];

export const VILLES = ['Lomé', 'Kara', 'Sokodé', 'Kpalimé', 'Atakpamé', 'Tsévié', 'Aného', 'Dapaong', 'Bassar', 'Mango', 'Notsé',
  'Tabligbo', 'Vogan', 'Badou', 'Sotouboua', 'Blitta', 'Cotonou', 'Porto-Novo', 'Ouagadougou', 'Niamey', 'Abidjan', 'Accra'];

export const RAYONS = [5, 10, 20, 50];

export const ANNUAIRE = {
  label: 'Annuaire des professionnels',
  title: 'Trouvez un prestataire de confiance',
  sub: 'Mécaniciens, électriciens, plombiers, artisans… Comparez les profils, les avis et trouvez un professionnel près de chez vous.',
  ctaTitle: 'Vous êtes un professionnel ?',
  ctaText: 'Inscrivez-vous gratuitement dans l’annuaire Kapi Consult et faites-vous connaître des clients de votre zone.',
};

// Justificatif de qualification demandé aux prestataires (diplôme, attestation…)
export const QUALIF_TYPES = [
  ['diplome', 'Diplôme (CAP, BT, BEP, BTS, licence…)'],
  ['attestation', 'Attestation de formation ou de fin d’apprentissage'],
  ['certificat', 'Certificat ou agrément professionnel'],
];
export const QUALIF_LABEL = { diplome: 'Diplôme', attestation: 'Attestation de formation', certificat: 'Certificat professionnel' };
