// Éléments partagés de l'annuaire des prestataires
import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, Clock3, MapPin, Navigation, Star } from 'lucide-react';
import { metierIcon } from '../content/prestataires';

// Étoiles de notation (lecture seule)
export function Stars({ value = 0, size = 15 }) {
  return (
    <span className="stars" aria-label={`${value || 0} sur 5`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, (value || 0) - (i - 1)));
        return (
          <span key={i} className="stars__one" style={{ width: size, height: size }}>
            <Star size={size} className="stars__bg" />
            <span className="stars__fill" style={{ width: `${fill * 100}%` }}><Star size={size} /></span>
          </span>
        );
      })}
    </span>
  );
}

export function Rating({ note, n, size }) {
  if (!n) return <span className="rating rating--none"><Star size={14} />Nouveau</span>;
  return <span className="rating"><Stars value={note} size={size} /><b>{Number(note).toFixed(1)}</b><span>({n} avis)</span></span>;
}

const initials = (s) => String(s || '').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

// Photo du prestataire, ou initiales sur fond de marque
export function ProAvatar({ p, size = 64 }) {
  const Icon = metierIcon(p.metier);
  return (
    <span className="pro-avatar" style={{ width: size, height: size }}>
      {p.photo ? <img src={p.photo} alt="" loading="lazy" /> : <span style={{ fontSize: size * 0.34 }}>{initials(p.nom_affiche)}</span>}
      <i title={p.metier}><Icon size={Math.max(12, size * 0.2)} /></i>
    </span>
  );
}

export const fmtKm = (d) => (d == null ? null : d < 1 ? `${Math.round(d * 1000)} m` : `${d < 10 ? d.toFixed(1) : Math.round(d)} km`);
export const lieu = (p) => [p.quartier, p.ville].filter(Boolean).join(', ');

export function ProCard({ p }) {
  return (
    <Link to={`/prestataires/${p.id}`} className="pro-card">
      <div className="pro-card__head">
        <ProAvatar p={p} />
        <div style={{ minWidth: 0 }}>
          <h3 className="pro-card__name">{p.nom_affiche}{p.verifie && <BadgeCheck size={17} className="pro-verified" aria-label="Identité vérifiée" />}</h3>
          <span className="pro-card__job">{p.metier}</span>
        </div>
      </div>
      <Rating note={p.note} n={p.nb_avis} />
      <div className="pro-card__meta">
        <span><MapPin size={15} />{lieu(p)}</span>
        {p.distance != null && <span className="pro-dist"><Navigation size={14} />à {fmtKm(p.distance)}</span>}
        {p.experience > 0 && <span><Clock3 size={15} />{p.experience} an{p.experience > 1 ? 's' : ''} d'expérience</span>}
      </div>
      {p.specialites?.length > 0 && (
        <div className="pro-tags">{p.specialites.slice(0, 3).map((s) => <span key={s}>{s}</span>)}{p.specialites.length > 3 && <span>+{p.specialites.length - 3}</span>}</div>
      )}
      <span className="pro-card__foot">Voir le profil <ArrowRight size={15} /></span>
    </Link>
  );
}
