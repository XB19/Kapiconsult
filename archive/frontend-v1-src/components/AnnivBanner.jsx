const CONFETTI = [
  ['5%', '18s', '0s', '🎊'], ['15%', '22s', '-4s', '✨'], ['28%', '16s', '-8s', '🎉'], ['42%', '20s', '-2s', '⭐'],
  ['58%', '24s', '-10s', '🎊'], ['72%', '17s', '-6s', '✨'], ['85%', '21s', '-3s', '🎉'],
];

const Stars = () => (
  <div className="anniv-stars">
    <span className="anniv-star">⭐</span>
    <span className="anniv-star">⭐</span>
    <span className="anniv-star">⭐</span>
  </div>
);

export default function AnnivBanner() {
  return (
    <div className="anniv-banner">
      <div className="anniv-confetti">
        {CONFETTI.map(([left, d, delay, c], i) => (
          <span key={i} style={{ left, animationDuration: d, animationDelay: delay }}>{c}</span>
        ))}
      </div>
      <div className="anniv-inner">
        <Stars />
        <div className="anniv-badge">20 ANS</div>
        <div className="anniv-text">
          Kapi Consult célèbre ses <strong>20 ans d'excellence</strong> au service des organisations d'Afrique de l'Ouest
        </div>
        <Stars />
      </div>
    </div>
  );
}
