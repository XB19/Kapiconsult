-- Schéma PostgreSQL — Kapi Consult

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  prenom        VARCHAR(120) NOT NULL,
  nom           VARCHAR(120) NOT NULL,
  email         VARCHAR(190) NOT NULL UNIQUE,
  telephone     VARCHAR(40),
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(20)  NOT NULL DEFAULT 'candidat',
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS articles (
  id           SERIAL PRIMARY KEY,
  slug         VARCHAR(255) NOT NULL UNIQUE,
  type         VARCHAR(20)  NOT NULL CHECK (type IN ('actualite','blog','bon_plan')),
  badge        VARCHAR(60)  NOT NULL,
  category     VARCHAR(60)  NOT NULL DEFAULT '',
  title        VARCHAR(255) NOT NULL,
  content      TEXT         NOT NULL DEFAULT '',
  image        VARCHAR(255),
  card_image   VARCHAR(255),
  author       VARCHAR(120),
  position     INTEGER,
  published    BOOLEAN      NOT NULL DEFAULT true,
  published_at DATE,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS produits (
  id            SERIAL PRIMARY KEY,
  slug          VARCHAR(255) NOT NULL UNIQUE,
  categorie     VARCHAR(60)  NOT NULL,
  nom           VARCHAR(255) NOT NULL,
  description   TEXT         NOT NULL DEFAULT '',
  image         VARCHAR(255),
  prix          NUMERIC(14,2),
  contact_tel   VARCHAR(60),
  contact_email VARCHAR(190),
  position      INTEGER      NOT NULL DEFAULT 0,
  actif         BOOLEAN      NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS offres (
  id           SERIAL PRIMARY KEY,
  titre        VARCHAR(255) NOT NULL,
  type_contrat VARCHAR(30)  NOT NULL,
  lieu         VARCHAR(160) NOT NULL,
  experience   VARCHAR(160),
  description  TEXT,
  published_at DATE         NOT NULL DEFAULT CURRENT_DATE,
  date_limite  DATE,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS faqs (
  id        SERIAL PRIMARY KEY,
  categorie VARCHAR(120) NOT NULL,
  question  TEXT         NOT NULL,
  reponse   TEXT         NOT NULL,
  position  INTEGER      NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS contacts (
  id         SERIAL PRIMARY KEY,
  prenom     VARCHAR(120) NOT NULL,
  nom        VARCHAR(120) NOT NULL,
  email      VARCHAR(190) NOT NULL,
  telephone  VARCHAR(40),
  sujet      VARCHAR(60)  NOT NULL,
  message    TEXT         NOT NULL,
  lu         BOOLEAN      NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS candidatures (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER REFERENCES users(id) ON DELETE SET NULL,
  offre_id   INTEGER REFERENCES offres(id) ON DELETE SET NULL,
  prenom     VARCHAR(120) NOT NULL,
  nom        VARCHAR(120) NOT NULL,
  email      VARCHAR(190) NOT NULL,
  telephone  VARCHAR(40)  NOT NULL,
  domaine    VARCHAR(120) NOT NULL,
  experience VARCHAR(20)  NOT NULL,
  message    TEXT         NOT NULL,
  cv_path    VARCHAR(255) NOT NULL,
  lettre_path VARCHAR(255),
  statut     VARCHAR(20)  NOT NULL DEFAULT 'en_cours',
  created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Annuaire des prestataires (artisans, techniciens, professionnels)
CREATE TABLE IF NOT EXISTS prestataires (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  nom_affiche  VARCHAR(160) NOT NULL,
  metier       VARCHAR(80)  NOT NULL,
  specialites  TEXT[]       NOT NULL DEFAULT '{}',
  description  TEXT         NOT NULL,
  experience   INTEGER      NOT NULL DEFAULT 0,
  telephone    VARCHAR(40)  NOT NULL,
  whatsapp     VARCHAR(40),
  email        VARCHAR(190),
  pays         VARCHAR(60)  NOT NULL DEFAULT 'Togo',
  ville        VARCHAR(80)  NOT NULL,
  quartier     VARCHAR(120),
  latitude     DOUBLE PRECISION,
  longitude    DOUBLE PRECISION,
  rayon_km     INTEGER      NOT NULL DEFAULT 10,
  deplacement  BOOLEAN      NOT NULL DEFAULT true,
  disponibilite VARCHAR(160),
  tarif        VARCHAR(160),
  photo        VARCHAR(255),
  statut       VARCHAR(20)  NOT NULL DEFAULT 'en_attente' CHECK (statut IN ('en_attente','valide','refuse','suspendu')),
  verifie      BOOLEAN      NOT NULL DEFAULT false,
  vues         INTEGER      NOT NULL DEFAULT 0,
  demo         BOOLEAN      NOT NULL DEFAULT false, -- profil de démonstration (npm run demo:annuaire)
  -- Pièce d'identité (fichiers privés, jamais publiés) et vérification par l'administrateur
  cni_numero   VARCHAR(60),
  cni_recto    VARCHAR(255),
  cni_verso    VARCHAR(255),
  cni_transmise_le     TIMESTAMPTZ,
  identite_verifiee_le TIMESTAMPTZ,
  verifie_par  INTEGER REFERENCES users(id) ON DELETE SET NULL,
  motif_refus  TEXT,
  conditions_acceptees_le TIMESTAMPTZ,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS prestataires_recherche ON prestataires (statut, metier, ville);

CREATE TABLE IF NOT EXISTS avis (
  id             SERIAL PRIMARY KEY,
  prestataire_id INTEGER NOT NULL REFERENCES prestataires(id) ON DELETE CASCADE,
  user_id        INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  note           SMALLINT NOT NULL CHECK (note BETWEEN 1 AND 5),
  commentaire    TEXT,
  visible        BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (prestataire_id, user_id)
);

-- Quotidien : acceptation des conditions d'utilisation par chaque membre
ALTER TABLE users ADD COLUMN IF NOT EXISTS quotidien_conditions_version VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS quotidien_accepte_le TIMESTAMPTZ;
