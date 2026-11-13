// Icônes (bibliothèque Lucide) associées aux contenus — remplacent les émojis du site d'origine
import {
  Award, Globe, Briefcase, TrendingUp, ShieldCheck, Handshake, Zap, HeartHandshake, Recycle, BarChart3, Car, Cog, Fuel,
  Building2, UtensilsCrossed, Monitor, Truck, Wheat, BatteryCharging, Flame, Container, Landmark, Building, GraduationCap,
  ClipboardCheck, Network, BookOpen, Factory, PiggyBank, Gauge, Store, Route, Users, Hotel, Coins, HardHat, Stethoscope, School,
  Radio, Pickaxe, ShoppingCart, Rocket, Globe2,
} from 'lucide-react';

// Chiffres clés de l'accueil
export const KPI_ICONS = [Award, Globe, Briefcase, TrendingUp];

// Valeurs (À propos)
export const VALEUR_ICONS = { 'Intégrité': ShieldCheck, 'Engagement & Partenariat': Handshake, Courage: Zap, Compassion: HeartHandshake, 'Responsabilité': Recycle };

// Filiales du groupe OSEOR
export const FILIALE_ICONS = {
  'KAPI Consult': BarChart3, 'DIWA International': Car, OSEOR: Briefcase, 'DIWA Industries': Cog, 'ZENER SA': Fuel,
  'JCEMGROUP TOGO': Building2, 'DIWA Products': UtensilsCrossed, '@TOGO': Monitor, TRFS: Truck, BOURSERIA: TrendingUp,
  DABA: Wheat, BLUEN: BatteryCharging, PLS: Container, PGS: Flame, 'Zen Grupo': Fuel,
};

// Domaines d'expertise (Nos activités)
export const DOMAINE_ICONS = {
  competitivite: Gauge, microfinance: PiggyBank, formation: GraduationCap, audit: ClipboardCheck,
  management: Network, etudes: BookOpen, industries: Factory, finances: Landmark,
};

// Services de l'accueil
export const SERVICE_ICONS = [ClipboardCheck, GraduationCap, HardHat];

// Recrutements
export const RECRUT_ICONS = [Landmark, Building, Building2, Zap];

// Réalisations sans photo
export const REAL_ICONS = {
  'Centre Commercial Niamey': Store, 'CORIS Capital / Burkina-Faso': Fuel, 'KHI Conakry': Hotel,
  'BIDC — EBID': Landmark, 'Ministère du développement à la base': Users, 'Ministère des Infrastructures et des Transports': Route,
};

// Secteurs d'intervention
export const SECTEUR_ICONS = {
  'Secteur Public': Landmark, 'Institutions Financières': Coins, 'Industrie & Agro-industrie': Factory, 'Télécommunications': Radio,
  'Énergie & Mines': Pickaxe, 'Santé': Stethoscope, 'Éducation': School, 'BTP & Infrastructure': HardHat,
  'Commerce & Distribution': ShoppingCart, 'ONG & Associations': HeartHandshake, 'PME & Startups': Rocket, 'Institutions Internationales': Globe2,
};
