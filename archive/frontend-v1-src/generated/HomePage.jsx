// Fichier généré automatiquement depuis kapiconsult.tg — ne pas éditer à la main (voir tools/generate.js)
import { inline, useLegacyScripts } from '../lib/legacy';
import HomeNews from '../components/HomeNews';
const SCRIPTS = [
  "\n(function(){\n  /* ── Particles canvas ── */\n  const canvas = document.getElementById('heroCanvas');\n  const ctx = canvas.getContext('2d');\n  let particles = [];\n  let W, H;\n\n  function resize(){\n    const s = document.getElementById('hero-section');\n    W = canvas.width = s.offsetWidth;\n    H = canvas.height = s.offsetHeight;\n  }\n  resize();\n  window.addEventListener('resize', resize);\n\n  function rand(a,b){ return Math.random()*(b-a)+a; }\n\n  for(let i=0;i<70;i++){\n    particles.push({\n      x:rand(0,1), y:rand(0,1),\n      r:rand(0.5,2.2),\n      vx:rand(-0.08,0.08), vy:rand(-0.12,-0.04),\n      alpha:rand(0.15,0.55),\n      gold: Math.random() > 0.6\n    });\n  }\n\n  function drawParticles(){\n    ctx.clearRect(0,0,W,H);\n    particles.forEach(p=>{\n      p.x += p.vx/W * 0.8;\n      p.y += p.vy/H * 0.8;\n      if(p.y < -0.01) p.y = 1;\n      if(p.x < 0) p.x = 1;\n      if(p.x > 1) p.x = 0;\n      ctx.beginPath();\n      ctx.arc(p.x*W, p.y*H, p.r, 0, Math.PI*2);\n      ctx.fillStyle = p.gold\n        ? `rgba(212,160,23,${p.alpha})`\n        : `rgba(200,210,255,${p.alpha})`;\n      ctx.fill();\n    });\n    requestAnimationFrame(drawParticles);\n  }\n  drawParticles();\n\n  /* ── Typewriter subtitle ── */\n    const text = \"Cabinet d\\'Études et de Conseils en management, organisation et compétitivité, orienté Résultats dans les métiers de production et d\\'infrastructure.\";\n  const el = document.getElementById('hero-subtitle');\n  let i = 0;\n  el.style.color = 'rgba(255,255,255,.62)';\n  setTimeout(function type(){\n    if(i <= text.length){\n      el.textContent = text.slice(0,i);\n      i++;\n      setTimeout(type, i < 30 ? 35 : 22);\n    }\n  }, 900);\n\n  /* ── Count-up KPIs ── */\n  function countUp(el, target, suffix, duration){\n    let start = 0, step = target / (duration/16);\n    const tick = ()=>{\n      start = Math.min(start + step, target);\n      el.textContent = Math.round(start) + suffix;\n      if(start < target) requestAnimationFrame(tick);\n    };\n    tick();\n  }\n  const observer = new IntersectionObserver(entries=>{\n    entries.forEach(e=>{\n      if(e.isIntersecting){\n        document.querySelectorAll('.kpi-count').forEach(el=>{\n          countUp(el, +el.dataset.target, el.dataset.suffix, 1800);\n        });\n        observer.disconnect();\n      }\n    });\n  },{threshold:.3});\n  const kpiBlock = document.querySelector('.kpi-count');\n  if(kpiBlock) observer.observe(kpiBlock.closest('div[style*=\"grid\"]'));\n\n})();\n",
  "\nfunction openTeamVideo(url, name) {\n  document.getElementById('videoModalTitle').textContent = name;\n  let src = url;\n  if (url.includes('youtube.com/watch')) {\n    const id = new URL(url).searchParams.get('v');\n    src = 'https://www.youtube.com/embed/' + id + '?autoplay=1';\n  } else if (url.includes('youtu.be/')) {\n    const id = url.split('youtu.be/')[1].split('?')[0];\n    src = 'https://www.youtube.com/embed/' + id + '?autoplay=1';\n  } else if (url.includes('vimeo.com/')) {\n    const id = url.split('vimeo.com/')[1].split('?')[0];\n    src = 'https://player.vimeo.com/video/' + id + '?autoplay=1';\n  }\n  document.getElementById('videoFrame').src = src;\n  const modal = document.getElementById('videoModal');\n  modal.style.display = 'flex';\n  document.body.style.overflow = 'hidden';\n}\nfunction closeTeamVideo() {\n  document.getElementById('videoModal').style.display = 'none';\n  document.getElementById('videoFrame').src = '';\n  document.body.style.overflow = '';\n}\n",
  "\n(function(){\n  var popup = document.getElementById('anniv-popup');\n  popup.style.display = 'flex';\n  var count = 5;\n  var timer = setInterval(function(){\n    count--;\n    var el = document.getElementById('anniv-countdown');\n    if(el) el.textContent = count;\n    if(count <= 0){ clearInterval(timer); closeAnnivPopup(); }\n  }, 1000);\n  window._annivTimer = timer;\n})();\nfunction closeAnnivPopup(){\n  if(window._annivTimer) clearInterval(window._annivTimer);\n  var popup = document.getElementById('anniv-popup');\n  popup.style.transition = 'opacity .3s';\n  popup.style.opacity = '0';\n  setTimeout(function(){ popup.style.display = 'none'; }, 300);\n}\n"
];

export default function HomePage() {
  useLegacyScripts(SCRIPTS);
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: "\n/* ── Keyframes ── */\n@keyframes fadeUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}\n@keyframes fadeIn{from{opacity:0}to{opacity:1}}\n@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}\n@keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}\n@keyframes partnerScroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}\n@keyframes lineGrow{from{width:0}to{width:60px}}\n@keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}\n@keyframes revealUp{from{clip-path:inset(100% 0 0 0);opacity:0;transform:translateY(20px)}to{clip-path:inset(0% 0 0 0);opacity:1;transform:translateY(0)}}\n@keyframes badgePulse{0%,100%{box-shadow:0 0 0 0 rgba(184,137,42,.4)}60%{box-shadow:0 0 0 10px rgba(184,137,42,0)}}\n@keyframes scrollBounce{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(8px)}}\n@keyframes orbDrift{0%{transform:translate(0,0) scale(1)}25%{transform:translate(30px,-20px) scale(1.1)}50%{transform:translate(-20px,30px) scale(.95)}75%{transform:translate(20px,10px) scale(1.05)}100%{transform:translate(0,0) scale(1)}}\n@keyframes lineDraw{from{stroke-dashoffset:1000}to{stroke-dashoffset:0}}\n@keyframes kpiReveal{from{opacity:0;transform:translateY(16px) scale(.95)}to{opacity:1;transform:translateY(0) scale(1)}}\n@keyframes ctaGlow{0%,100%{box-shadow:0 4px 20px rgba(184,137,42,.4)}50%{box-shadow:0 4px 40px rgba(184,137,42,.7),0 0 60px rgba(184,137,42,.2)}}\n\n.ha-badge{animation:fadeIn .5s ease both}\n.ha-eyebrow{animation:fadeUp .6s ease .05s both}\n.ha-title{animation:fadeUp .7s ease .18s both}\n.ha-line{animation:lineGrow .6s ease .5s both}\n.ha-sub{animation:fadeUp .7s ease .35s both}\n.ha-actions{animation:fadeUp .7s ease .5s both}\n.ha-stats{animation:fadeUp .7s ease .65s both}\n.ha-cards{animation:fadeIn .9s ease .25s both}\n\n.hcard{animation:float 7s ease-in-out infinite}\n.hcard.c1{animation-delay:0s}\n.hcard.c2{animation-delay:2s}\n.hcard.c3{animation-delay:4s}\n\n/* Animated orbs */\n.h-orb{position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none;animation:orb 18s ease-in-out infinite}\n.h-orb-1{width:500px;height:500px;background:rgba(184,137,42,.07);top:-100px;right:5%;animation-duration:20s}\n.h-orb-2{width:380px;height:380px;background:rgba(107,127,232,.09);bottom:10%;left:2%;animation-duration:25s;animation-delay:-8s}\n.h-orb-3{width:280px;height:280px;background:rgba(184,137,42,.06);bottom:20%;right:20%;animation-duration:16s;animation-delay:-5s}\n\n/* Fine grid */\n.h-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px);background-size:72px 72px}\n\n/* Gold shimmer text */\n.gold-shimmer{background:linear-gradient(120deg,var(--gold-light) 0%,#F5D78E 40%,var(--gold-light) 80%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 4s linear infinite 1s}\n\n/* Eyebrow line */\n.hero-eyebrow{display:flex;align-items:center;gap:14px;margin-bottom:20px}\n.eyebrow-line{height:1px;width:32px;background:var(--gold-light);opacity:.6}\n.eyebrow-text{font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--gold-light)}\n\n/* Accent line under title */\n.title-accent{height:2px;width:0;background:linear-gradient(90deg,var(--gold),transparent);border-radius:2px;margin:22px 0 28px}\n\n/* Ticker belt — redesigned */\n.hero-ticker{position:relative;overflow:hidden;background:rgba(0,0,0,.25);border-top:1px solid rgba(255,255,255,.06);backdrop-filter:blur(4px);padding:13px 0}\n.ticker-label{position:absolute;left:0;top:0;bottom:0;display:flex;align-items:center;padding:0 20px;background:var(--gold);font-size:10px;font-weight:800;letter-spacing:.15em;text-transform:uppercase;color:var(--white);z-index:2;white-space:nowrap}\n.ticker-mask-left{position:absolute;left:0;top:0;bottom:0;width:180px;background:linear-gradient(90deg,rgba(13,14,26,1) 0%,transparent 100%);z-index:1;pointer-events:none}\n.ticker-mask-right{position:absolute;right:0;top:0;bottom:0;width:120px;background:linear-gradient(270deg,rgba(13,14,26,.8) 0%,transparent 100%);z-index:1;pointer-events:none}\n.ticker-inner{display:flex;white-space:nowrap;animation:ticker 36s linear infinite;padding-left:180px}\n.ticker-item{padding:0 36px;font-size:12px;font-weight:500;color:rgba(255,255,255,.55);display:inline-flex;align-items:center;gap:10px;flex-shrink:0;letter-spacing:.04em}\n.ticker-dot{width:3px;height:3px;border-radius:50%;background:var(--gold-light);opacity:.7;flex-shrink:0}\n\n/* Partners */\n.partners-track-wrap{overflow:hidden;position:relative;padding:10px 0}\n.partners-track-wrap::before,.partners-track-wrap::after{content:'';position:absolute;top:0;bottom:0;width:80px;z-index:2;pointer-events:none}\n.partners-track-wrap::before{left:0;background:linear-gradient(90deg,var(--white),transparent)}\n.partners-track-wrap::after{right:0;background:linear-gradient(270deg,var(--white),transparent)}\n.partners-track{display:flex;gap:40px;animation:partnerScroll 28s linear infinite;width:max-content}\n.partners-track:hover{animation-play-state:paused}\n.partner-logo{height:60px;width:140px;display:flex;align-items:center;justify-content:center;filter:grayscale(0);opacity:.85;transition:all .3s;flex-shrink:0}\n.partner-logo:hover{filter:grayscale(0);opacity:1;transform:scale(1.08)}\n.partner-logo img{max-height:60px;max-width:140px;object-fit:contain}\n.partner-logo-text{font-family:'Playfair Display',serif;font-size:15px;font-weight:700;color:var(--black);letter-spacing:.02em;white-space:nowrap}\n\n/* Team cards */\n.team-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:22px}\n@media(max-width:900px){.team-grid{grid-template-columns:repeat(2,1fr)}}\n.team-card{background:var(--white);border-radius:18px;overflow:hidden;border:1px solid #E8EAF0;transition:all .3s}\n.team-card:hover{transform:translateY(-5px);box-shadow:var(--shadow-lg)}\n.team-photo{height:200px;background:linear-gradient(135deg,var(--blue-pale),#D0D8F8);display:flex;align-items:center;justify-content:center;font-size:48px;position:relative;overflow:hidden}\n.team-photo img{width:100%;height:100%;object-fit:cover}\n.team-video-btn{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(30,34,153,.45);opacity:0;transition:opacity .3s;cursor:pointer}\n.team-card:hover .team-video-btn{opacity:1}\n.team-video-icon{width:52px;height:52px;background:var(--gold);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;padding-left:4px}\n.team-body{padding:18px}\n.team-name{font-family:'Playfair Display',serif;font-size:16px;font-weight:700;color:var(--black);margin-bottom:4px}\n.team-poste{font-size:12px;color:var(--gold);font-weight:600;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px}\n.team-bio{font-size:13px;color:var(--gray);line-height:1.6}\n\n/* DG Section */\n.dg-section{display:grid;grid-template-columns:1fr 1.6fr;gap:60px;align-items:center}\n@media(max-width:900px){.dg-section{grid-template-columns:1fr}}\n.dg-photo-wrap{position:relative}\n.dg-photo{width:100%;border-radius:20px;overflow:hidden;aspect-ratio:3/4;background:linear-gradient(135deg,var(--blue-pale),#D0D8F8);display:flex;align-items:center;justify-content:center;font-size:72px}\n.dg-photo img{width:100%;height:100%;object-fit:cover}\n.dg-badge{position:absolute;bottom:20px;left:20px;right:20px;background:rgba(30,34,153,.9);backdrop-filter:blur(8px);border-radius:12px;padding:16px 18px;border:1px solid rgba(255,255,255,.12)}\n.dg-badge-name{font-family:'Playfair Display',serif;font-size:17px;font-weight:700;color:var(--white)}\n.dg-badge-poste{font-size:12px;color:var(--gold-light);font-weight:600;letter-spacing:.06em;text-transform:uppercase;margin-top:3px}\n.dg-content .section-title{margin-bottom:8px}\n.dg-quote{font-size:16px;line-height:1.9;color:var(--gray);position:relative;padding-left:24px;border-left:3px solid var(--gold);margin:20px 0 28px}\n\n/* Stats redesigned */\n.hero-kpi{display:flex;gap:24px;flex-wrap:wrap;margin-top:32px}\n.kpi-item{display:flex;align-items:center;gap:10px}\n.kpi-sep{width:1px;height:28px;background:rgba(255,255,255,.12)}\n.kpi-val{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:var(--white)}\n.kpi-label{font-size:11px;color:rgba(255,255,255,.45);line-height:1.4;letter-spacing:.04em}\n@media(max-width:900px){\n.hero-kpi-grid{grid-template-columns:repeat(2,1fr)!important}\n.real-cards-grid{grid-template-columns:repeat(2,1fr)!important}\n.real-logos-grid{grid-template-columns:repeat(2,1fr)!important}\n.qsn-grid{grid-template-columns:1fr!important;gap:36px!important}\n.real-inner{padding:0 20px!important}\n.qsn-outer{padding:52px 20px!important}\n.team-grid{grid-template-columns:repeat(2,1fr)}\n}\n@media(max-width:600px){\n.hero-content-inner{padding:80px 16px 40px!important}\n.hero-kpi-grid{grid-template-columns:repeat(2,1fr)!important}\n.real-outer{padding:48px 0!important}\n.real-inner{padding:0 16px!important}\n.real-cards-grid{grid-template-columns:1fr!important;gap:14px!important}\n.real-logos-grid{grid-template-columns:repeat(2,1fr)!important;gap:10px!important}\n.qsn-grid{grid-template-columns:1fr!important;gap:24px!important}\n.qsn-badge{display:none!important}\n.qsn-outer{padding:40px 16px!important}\n.team-grid{grid-template-columns:1fr!important}\n.dg-section{gap:28px!important}\n}\n\n\n@keyframes cardIn{from{opacity:0;transform:scale(.7) translateY(30px)}to{opacity:1;transform:scale(1) translateY(0)}}\n@keyframes ringSpinFast{to{transform:rotate(360deg)}}\n@keyframes ringSpinSlow{to{transform:rotate(360deg)}}\n@keyframes floatStar{0%,100%{transform:translateY(0) rotate(0deg);opacity:.7}50%{transform:translateY(-10px) rotate(15deg);opacity:1}}\n@keyframes pulse20{0%,100%{text-shadow:0 0 20px rgba(255,255,255,.2)}50%{text-shadow:0 0 40px rgba(184,137,42,.6),0 0 60px rgba(184,137,42,.3)}}\n@keyframes barShrink{from{width:100%}to{width:0%}}\n@keyframes popupFadeIn{from{opacity:0}to{opacity:1}}\n#anniv-popup{animation:popupFadeIn .3s ease both}\n@media(max-width:480px){\n  #anniv-card{padding:44px 24px 32px}\n}\n"}} />
      <main>
      <section id={"hero-section"} style={{"position": "relative", "overflow": "hidden", "minHeight": "92vh", "display": "flex", "flexDirection": "column", "backgroundImage": "linear-gradient(to bottom,rgba(8,10,45,0.85) 0%,rgba(18,22,90,0.72) 55%,rgba(8,10,45,0.92) 100%),url('/storage/kapi/hero_bg.png')", "backgroundSize": "cover", "backgroundPosition": "center top", "backgroundRepeat": "no-repeat"}}>
        {" "}
        <canvas id={"heroCanvas"} style={{"position": "absolute", "inset": "0", "width": "100%", "height": "100%", "pointerEvents": "none", "zIndex": "0"}} />
        {" "}
        <div style={{"position": "absolute", "inset": "0", "backgroundImage": "linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px)", "backgroundSize": "72px 72px", "pointerEvents": "none", "zIndex": "1"}} />
        {" "}
        <div className={"hero-orb orb-gold"} style={{"position": "absolute", "width": "700px", "height": "700px", "borderRadius": "50%", "background": "radial-gradient(circle,rgba(184,137,42,.13) 0%,transparent 65%)", "top": "-150px", "right": "0%", "pointerEvents": "none", "zIndex": "1", "animation": "orbDrift 22s ease-in-out infinite"}} />
        {" "}
        <div className={"hero-orb orb-blue"} style={{"position": "absolute", "width": "500px", "height": "500px", "borderRadius": "50%", "background": "radial-gradient(circle,rgba(80,100,240,.11) 0%,transparent 65%)", "bottom": "5%", "left": "-5%", "pointerEvents": "none", "zIndex": "1", "animation": "orbDrift 28s ease-in-out infinite reverse"}} />
        {" "}
        <div className={"hero-orb orb-sm"} style={{"position": "absolute", "width": "300px", "height": "300px", "borderRadius": "50%", "background": "radial-gradient(circle,rgba(184,137,42,.08) 0%,transparent 65%)", "bottom": "25%", "right": "15%", "pointerEvents": "none", "zIndex": "1", "animation": "orbDrift 18s ease-in-out infinite 4s"}} />
        {" "}
        <div className={"hero-content-inner"} style={{"flex": "1", "display": "flex", "flexDirection": "column", "alignItems": "center", "justifyContent": "center", "textAlign": "center", "padding": "130px 24px 56px", "maxWidth": "920px", "margin": "0 auto", "width": "100%", "position": "relative", "zIndex": "2"}}>
          {" "}
          <div style={{"display": "inline-flex", "alignItems": "center", "gap": "10px", "background": "rgba(184,137,42,.12)", "border": "1px solid rgba(184,137,42,.35)", "borderRadius": "30px", "padding": "8px 22px", "marginBottom": "36px", "animation": "fadeIn .6s ease both, badgePulse 3s ease-in-out 1s infinite"}}>
            {" "}
            <span style={{"width": "7px", "height": "7px", "borderRadius": "50%", "background": "var(--gold-light)", "display": "inline-block", "animation": "float 2.5s ease-in-out infinite"}} />
            {" "}
            <span style={{"fontSize": "11px", "fontWeight": "700", "letterSpacing": ".18em", "textTransform": "uppercase", "color": "var(--gold-light)"}}>
              {"Bureau d'Études & Conseil — Lomé, Togo"}
            </span>
            {" "}
            <span style={{"width": "7px", "height": "7px", "borderRadius": "50%", "background": "var(--gold-light)", "display": "inline-block", "animation": "float 2.5s ease-in-out infinite .8s"}} />
            {" "}
          </div>
          {" "}
          <div style={{"overflow": "hidden", "marginBottom": "4px"}}>
            {" "}
            <div style={{"fontFamily": "'Playfair Display',serif", "fontSize": "clamp(40px,6.5vw,70px)", "fontWeight": "700", "lineHeight": "1.1", "letterSpacing": "-.03em", "color": "var(--white)", "animation": "revealUp .8s cubic-bezier(.22,1,.36,1) .1s both"}}>
              {" Votre partenaire "}
            </div>
            {" "}
          </div>
          {" "}
          <div style={{"overflow": "hidden", "marginBottom": "4px"}}>
            {" "}
            <div style={{"fontFamily": "'Playfair Display',serif", "fontSize": "clamp(40px,6.5vw,70px)", "fontWeight": "700", "lineHeight": "1.1", "letterSpacing": "-.03em", "background": "linear-gradient(120deg,#F5D78E 0%,#D4A017 35%,#FFF0B0 55%,#D4A017 75%,#F5D78E 100%)", "backgroundSize": "250% auto", "WebkitBackgroundClip": "text", "WebkitTextFillColor": "transparent", "backgroundClip": "text", "animation": "revealUp .8s cubic-bezier(.22,1,.36,1) .25s both, shimmer 5s linear infinite 1s"}}>
              {" stratégique "}
            </div>
            {" "}
          </div>
          {" "}
          <div style={{"overflow": "hidden", "marginBottom": "0"}}>
            {" "}
            <div style={{"fontFamily": "'Playfair Display',serif", "fontSize": "clamp(40px,6.5vw,70px)", "fontWeight": "700", "lineHeight": "1.1", "letterSpacing": "-.03em", "color": "var(--white)", "animation": "revealUp .8s cubic-bezier(.22,1,.36,1) .4s both"}}>
              {" de confiance "}
            </div>
            {" "}
          </div>
          {" "}
          <div style={{"display": "flex", "alignItems": "center", "justifyContent": "center", "gap": "12px", "margin": "28px auto 28px", "animation": "fadeIn .6s ease .7s both"}}>
            {" "}
            <div style={{"height": "1px", "width": "50px", "background": "linear-gradient(90deg,transparent,rgba(184,137,42,.5))"}} />
            {" "}
            <div style={{"width": "8px", "height": "8px", "borderRadius": "50%", "background": "var(--gold)", "animation": "float 3s ease-in-out infinite"}} />
            {" "}
            <div style={{"height": "2px", "width": "70px", "background": "var(--gold)", "borderRadius": "2px", "animation": "lineGrow .8s ease .7s both"}} />
            {" "}
            <div style={{"width": "8px", "height": "8px", "borderRadius": "50%", "background": "var(--gold)", "animation": "float 3s ease-in-out infinite .5s"}} />
            {" "}
            <div style={{"height": "1px", "width": "50px", "background": "linear-gradient(90deg,rgba(184,137,42,.5),transparent)"}} />
            {" "}
          </div>
          {" "}
          <p id={"hero-subtitle"} style={{"fontSize": "clamp(15px,1.8vw,18px)", "lineHeight": "1.85", "color": "rgba(255,255,255,.0)", "maxWidth": "600px", "margin": "0 auto 44px", "letterSpacing": ".01em", "minHeight": "56px", "transition": "color .1s"}} />
          {" "}
          <div style={{"display": "flex", "gap": "18px", "justifyContent": "center", "flexWrap": "wrap", "marginBottom": "72px", "animation": "fadeUp .7s ease 1.1s both"}}>
            {" "}
            <a href={"/nos-activites"} style={{"display": "inline-block", "padding": "16px 40px", "background": "var(--gold)", "color": "var(--white)", "fontWeight": "700", "fontSize": "14px", "letterSpacing": ".08em", "textTransform": "uppercase", "borderRadius": "8px", "textDecoration": "none", "transition": "all .3s", "animation": "ctaGlow 3s ease-in-out 2s infinite"}} onMouseOver={inline("this.style.transform='translateY(-3px) scale(1.02)';this.style.background='#c9990f'")} onMouseOut={inline("this.style.transform='none';this.style.background='var(--gold)'")}>
              {" Découvrir nos services "}
            </a>
            {" "}
            <a href={"/offres"} style={{"display": "inline-block", "padding": "16px 36px", "border": "2px solid rgba(255,255,255,.3)", "color": "var(--white)", "fontWeight": "600", "fontSize": "14px", "borderRadius": "8px", "textDecoration": "none", "transition": "all .3s", "backdropFilter": "blur(6px)", "background": "rgba(255,255,255,.04)"}} onMouseOver={inline("this.style.borderColor='var(--gold-light)';this.style.background='rgba(255,255,255,.1)';this.style.transform='translateY(-3px)'")} onMouseOut={inline("this.style.borderColor='rgba(255,255,255,.3)';this.style.background='rgba(255,255,255,.04)';this.style.transform='none'")}>
              {" Offres d'emploi → "}
            </a>
            {" "}
          </div>
          {" "}
          <div className={"hero-kpi-grid"} style={{"display": "grid", "gridTemplateColumns": "repeat(4,1fr)", "gap": "1px", "background": "rgba(255,255,255,.08)", "borderRadius": "18px", "overflow": "hidden", "width": "100%", "maxWidth": "740px"}}>
            {" "}
            <div style={{"background": "rgba(255,255,255,.05)", "backdropFilter": "blur(10px)", "padding": "24px 10px", "textAlign": "center", "transition": "all .3s", "cursor": "default", "animation": "kpiReveal .6s cubic-bezier(.22,1,.36,1) 1.3s both", "borderTop": "2px solid transparent"}} onMouseOver={inline("this.style.background='rgba(255,255,255,.12)';this.style.borderTopColor='var(--gold)'")} onMouseOut={inline("this.style.background='rgba(255,255,255,.05)';this.style.borderTopColor='transparent'")}>
              {" "}
              <div style={{"fontSize": "20px", "marginBottom": "8px"}}>
                {"🏆"}
              </div>
              {" "}
              <div className={"kpi-count"} data-target={"20"} data-suffix={"+"} style={{"fontFamily": "'Playfair Display',serif", "fontSize": "clamp(20px,2.5vw,28px)", "fontWeight": "700", "color": "var(--white)", "lineHeight": "1"}}>
                {"0+"}
              </div>
              {" "}
              <div style={{"fontSize": "11px", "color": "rgba(255,255,255,.42)", "marginTop": "6px", "lineHeight": "1.4", "letterSpacing": ".04em"}}>
                {"Années d'expérience"}
              </div>
              {" "}
            </div>
            {" "}
            <div style={{"background": "rgba(255,255,255,.05)", "backdropFilter": "blur(10px)", "padding": "24px 10px", "textAlign": "center", "transition": "all .3s", "cursor": "default", "animation": "kpiReveal .6s cubic-bezier(.22,1,.36,1) 1.45s both", "borderTop": "2px solid transparent"}} onMouseOver={inline("this.style.background='rgba(255,255,255,.12)';this.style.borderTopColor='var(--gold)'")} onMouseOut={inline("this.style.background='rgba(255,255,255,.05)';this.style.borderTopColor='transparent'")}>
              {" "}
              <div style={{"fontSize": "20px", "marginBottom": "8px"}}>
                {"🌍"}
              </div>
              {" "}
              <div className={"kpi-count"} data-target={"12"} data-suffix={""} style={{"fontFamily": "'Playfair Display',serif", "fontSize": "clamp(20px,2.5vw,28px)", "fontWeight": "700", "color": "var(--white)", "lineHeight": "1"}}>
                {"0"}
              </div>
              {" "}
              <div style={{"fontSize": "11px", "color": "rgba(255,255,255,.42)", "marginTop": "6px", "lineHeight": "1.4", "letterSpacing": ".04em"}}>
                {"Pays d'intervention"}
              </div>
              {" "}
            </div>
            {" "}
            <div style={{"background": "rgba(255,255,255,.05)", "backdropFilter": "blur(10px)", "padding": "24px 10px", "textAlign": "center", "transition": "all .3s", "cursor": "default", "animation": "kpiReveal .6s cubic-bezier(.22,1,.36,1) 1.6s both", "borderTop": "2px solid transparent"}} onMouseOver={inline("this.style.background='rgba(255,255,255,.12)';this.style.borderTopColor='var(--gold)'")} onMouseOut={inline("this.style.background='rgba(255,255,255,.05)';this.style.borderTopColor='transparent'")}>
              {" "}
              <div style={{"fontSize": "20px", "marginBottom": "8px"}}>
                {"💼"}
              </div>
              {" "}
              <div className={"kpi-count"} data-target={"0"} data-suffix={""} style={{"fontFamily": "'Playfair Display',serif", "fontSize": "clamp(20px,2.5vw,28px)", "fontWeight": "700", "color": "var(--white)", "lineHeight": "1"}}>
                {"0"}
              </div>
              {" "}
              <div style={{"fontSize": "11px", "color": "rgba(255,255,255,.42)", "marginTop": "6px", "lineHeight": "1.4", "letterSpacing": ".04em"}}>
                {"Offres actives"}
              </div>
              {" "}
            </div>
            {" "}
            <div style={{"background": "rgba(255,255,255,.05)", "backdropFilter": "blur(10px)", "padding": "24px 10px", "textAlign": "center", "transition": "all .3s", "cursor": "default", "animation": "kpiReveal .6s cubic-bezier(.22,1,.36,1) 1.75s both", "borderTop": "2px solid transparent"}} onMouseOver={inline("this.style.background='rgba(255,255,255,.12)';this.style.borderTopColor='var(--gold)'")} onMouseOut={inline("this.style.background='rgba(255,255,255,.05)';this.style.borderTopColor='transparent'")}>
              {" "}
              <div style={{"fontSize": "20px", "marginBottom": "8px"}}>
                {"📈"}
              </div>
              {" "}
              <div className={"kpi-count"} data-target={"300"} data-suffix={"Mds"} style={{"fontFamily": "'Playfair Display',serif", "fontSize": "clamp(20px,2.5vw,28px)", "fontWeight": "700", "color": "var(--white)", "lineHeight": "1"}}>
                {"0Mds"}
              </div>
              {" "}
              <div style={{"fontSize": "11px", "color": "rgba(255,255,255,.42)", "marginTop": "6px", "lineHeight": "1.4", "letterSpacing": ".04em"}}>
                {"FCFA mobilisés"}
              </div>
              {" "}
            </div>
            {" "}
          </div>
          {" "}
          <div style={{"position": "absolute", "bottom": "72px", "left": "50%", "animation": "scrollBounce 2s ease-in-out infinite 2s", "opacity": ".5"}}>
            {" "}
            <svg width={"24"} height={"36"} viewBox={"0 0 24 36"} fill={"none"} xmlns={"http://www.w3.org/2000/svg"}>
              <rect x={"1"} y={"1"} width={"22"} height={"34"} rx={"11"} stroke={"white"} strokeWidth={"1.5"} />
              <rect x={"10"} y={"7"} width={"4"} height={"8"} rx={"2"} fill={"white"} style={{"animation": "scrollBounce 2s ease-in-out infinite 2s"}} />
            </svg>
            {" "}
          </div>
          {" "}
        </div>
        {" "}
        <div style={{"position": "relative", "overflow": "hidden", "background": "rgba(0,0,0,.35)", "borderTop": "1px solid rgba(255,255,255,.07)", "backdropFilter": "blur(6px)", "padding": "14px 0", "zIndex": "2"}}>
          {" "}
          <div style={{"position": "absolute", "left": "0", "top": "0", "bottom": "0", "display": "flex", "alignItems": "center", "padding": "0 24px", "background": "linear-gradient(90deg,var(--gold) 80%,transparent)", "fontSize": "10px", "fontWeight": "800", "letterSpacing": ".15em", "textTransform": "uppercase", "color": "var(--white)", "zIndex": "3", "whiteSpace": "nowrap", "minWidth": "160px"}}>
            {"NOS EXPERTISES"}
          </div>
          {" "}
          <div style={{"position": "absolute", "left": "0", "top": "0", "bottom": "0", "width": "200px", "background": "linear-gradient(90deg,rgba(8,10,45,1) 0%,transparent 100%)", "zIndex": "2", "pointerEvents": "none"}} />
          {" "}
          <div style={{"position": "absolute", "right": "0", "top": "0", "bottom": "0", "width": "100px", "background": "linear-gradient(270deg,rgba(8,10,45,.9) 0%,transparent 100%)", "zIndex": "2", "pointerEvents": "none"}} />
          {" "}
          <div style={{"display": "flex", "whiteSpace": "nowrap", "animation": "ticker 38s linear infinite", "paddingLeft": "190px"}}>
            {" "}
            <span style={{"padding": "0 32px", "fontSize": "12px", "fontWeight": "500", "color": "rgba(255,255,255,.52)", "display": "inline-flex", "alignItems": "center", "gap": "10px", "flexShrink": "0", "letterSpacing": ".05em"}}>
              {" "}
              <span style={{"width": "3px", "height": "3px", "borderRadius": "50%", "background": "var(--gold-light)", "opacity": ".8", "display": "inline-block"}} />
              {" Compétitivité "}
            </span>
            {" "}
            <span style={{"padding": "0 32px", "fontSize": "12px", "fontWeight": "500", "color": "rgba(255,255,255,.52)", "display": "inline-flex", "alignItems": "center", "gap": "10px", "flexShrink": "0", "letterSpacing": ".05em"}}>
              {" "}
              <span style={{"width": "3px", "height": "3px", "borderRadius": "50%", "background": "var(--gold-light)", "opacity": ".8", "display": "inline-block"}} />
              {" Microfinance "}
            </span>
            {" "}
            <span style={{"padding": "0 32px", "fontSize": "12px", "fontWeight": "500", "color": "rgba(255,255,255,.52)", "display": "inline-flex", "alignItems": "center", "gap": "10px", "flexShrink": "0", "letterSpacing": ".05em"}}>
              {" "}
              <span style={{"width": "3px", "height": "3px", "borderRadius": "50%", "background": "var(--gold-light)", "opacity": ".8", "display": "inline-block"}} />
              {" Formation "}
            </span>
            {" "}
            <span style={{"padding": "0 32px", "fontSize": "12px", "fontWeight": "500", "color": "rgba(255,255,255,.52)", "display": "inline-flex", "alignItems": "center", "gap": "10px", "flexShrink": "0", "letterSpacing": ".05em"}}>
              {" "}
              <span style={{"width": "3px", "height": "3px", "borderRadius": "50%", "background": "var(--gold-light)", "opacity": ".8", "display": "inline-block"}} />
              {" Audit et Gouvernance "}
            </span>
            {" "}
            <span style={{"padding": "0 32px", "fontSize": "12px", "fontWeight": "500", "color": "rgba(255,255,255,.52)", "display": "inline-flex", "alignItems": "center", "gap": "10px", "flexShrink": "0", "letterSpacing": ".05em"}}>
              {" "}
              <span style={{"width": "3px", "height": "3px", "borderRadius": "50%", "background": "var(--gold-light)", "opacity": ".8", "display": "inline-block"}} />
              {" Management et Organisation "}
            </span>
            {" "}
            <span style={{"padding": "0 32px", "fontSize": "12px", "fontWeight": "500", "color": "rgba(255,255,255,.52)", "display": "inline-flex", "alignItems": "center", "gap": "10px", "flexShrink": "0", "letterSpacing": ".05em"}}>
              {" "}
              <span style={{"width": "3px", "height": "3px", "borderRadius": "50%", "background": "var(--gold-light)", "opacity": ".8", "display": "inline-block"}} />
              {" Etudes et Publications "}
            </span>
            {" "}
            <span style={{"padding": "0 32px", "fontSize": "12px", "fontWeight": "500", "color": "rgba(255,255,255,.52)", "display": "inline-flex", "alignItems": "center", "gap": "10px", "flexShrink": "0", "letterSpacing": ".05em"}}>
              {" "}
              <span style={{"width": "3px", "height": "3px", "borderRadius": "50%", "background": "var(--gold-light)", "opacity": ".8", "display": "inline-block"}} />
              {" Industries et Energie "}
            </span>
            {" "}
            <span style={{"padding": "0 32px", "fontSize": "12px", "fontWeight": "500", "color": "rgba(255,255,255,.52)", "display": "inline-flex", "alignItems": "center", "gap": "10px", "flexShrink": "0", "letterSpacing": ".05em"}}>
              {" "}
              <span style={{"width": "3px", "height": "3px", "borderRadius": "50%", "background": "var(--gold-light)", "opacity": ".8", "display": "inline-block"}} />
              {" Finances et Investissement "}
            </span>
            {" "}
            <span style={{"padding": "0 32px", "fontSize": "12px", "fontWeight": "500", "color": "rgba(255,255,255,.52)", "display": "inline-flex", "alignItems": "center", "gap": "10px", "flexShrink": "0", "letterSpacing": ".05em"}}>
              {" "}
              <span style={{"width": "3px", "height": "3px", "borderRadius": "50%", "background": "var(--gold-light)", "opacity": ".8", "display": "inline-block"}} />
              {" Partenariats Public-Privé "}
            </span>
            {" "}
            <span style={{"padding": "0 32px", "fontSize": "12px", "fontWeight": "500", "color": "rgba(255,255,255,.52)", "display": "inline-flex", "alignItems": "center", "gap": "10px", "flexShrink": "0", "letterSpacing": ".05em"}}>
              {" "}
              <span style={{"width": "3px", "height": "3px", "borderRadius": "50%", "background": "var(--gold-light)", "opacity": ".8", "display": "inline-block"}} />
              {" Recrutement "}
            </span>
            {" "}
            <span style={{"padding": "0 32px", "fontSize": "12px", "fontWeight": "500", "color": "rgba(255,255,255,.52)", "display": "inline-flex", "alignItems": "center", "gap": "10px", "flexShrink": "0", "letterSpacing": ".05em"}}>
              {" "}
              <span style={{"width": "3px", "height": "3px", "borderRadius": "50%", "background": "var(--gold-light)", "opacity": ".8", "display": "inline-block"}} />
              {" Outsourcing "}
            </span>
            {" "}
            <span style={{"padding": "0 32px", "fontSize": "12px", "fontWeight": "500", "color": "rgba(255,255,255,.52)", "display": "inline-flex", "alignItems": "center", "gap": "10px", "flexShrink": "0", "letterSpacing": ".05em"}}>
              {" "}
              <span style={{"width": "3px", "height": "3px", "borderRadius": "50%", "background": "var(--gold-light)", "opacity": ".8", "display": "inline-block"}} />
              {" Fintech "}
            </span>
            {" "}
            <span style={{"padding": "0 32px", "fontSize": "12px", "fontWeight": "500", "color": "rgba(255,255,255,.52)", "display": "inline-flex", "alignItems": "center", "gap": "10px", "flexShrink": "0", "letterSpacing": ".05em"}}>
              {" "}
              <span style={{"width": "3px", "height": "3px", "borderRadius": "50%", "background": "var(--gold-light)", "opacity": ".8", "display": "inline-block"}} />
              {" Compétitivité "}
            </span>
            {" "}
            <span style={{"padding": "0 32px", "fontSize": "12px", "fontWeight": "500", "color": "rgba(255,255,255,.52)", "display": "inline-flex", "alignItems": "center", "gap": "10px", "flexShrink": "0", "letterSpacing": ".05em"}}>
              {" "}
              <span style={{"width": "3px", "height": "3px", "borderRadius": "50%", "background": "var(--gold-light)", "opacity": ".8", "display": "inline-block"}} />
              {" Microfinance "}
            </span>
            {" "}
            <span style={{"padding": "0 32px", "fontSize": "12px", "fontWeight": "500", "color": "rgba(255,255,255,.52)", "display": "inline-flex", "alignItems": "center", "gap": "10px", "flexShrink": "0", "letterSpacing": ".05em"}}>
              {" "}
              <span style={{"width": "3px", "height": "3px", "borderRadius": "50%", "background": "var(--gold-light)", "opacity": ".8", "display": "inline-block"}} />
              {" Formation "}
            </span>
            {" "}
            <span style={{"padding": "0 32px", "fontSize": "12px", "fontWeight": "500", "color": "rgba(255,255,255,.52)", "display": "inline-flex", "alignItems": "center", "gap": "10px", "flexShrink": "0", "letterSpacing": ".05em"}}>
              {" "}
              <span style={{"width": "3px", "height": "3px", "borderRadius": "50%", "background": "var(--gold-light)", "opacity": ".8", "display": "inline-block"}} />
              {" Audit et Gouvernance "}
            </span>
            {" "}
            <span style={{"padding": "0 32px", "fontSize": "12px", "fontWeight": "500", "color": "rgba(255,255,255,.52)", "display": "inline-flex", "alignItems": "center", "gap": "10px", "flexShrink": "0", "letterSpacing": ".05em"}}>
              {" "}
              <span style={{"width": "3px", "height": "3px", "borderRadius": "50%", "background": "var(--gold-light)", "opacity": ".8", "display": "inline-block"}} />
              {" Management et Organisation "}
            </span>
            {" "}
            <span style={{"padding": "0 32px", "fontSize": "12px", "fontWeight": "500", "color": "rgba(255,255,255,.52)", "display": "inline-flex", "alignItems": "center", "gap": "10px", "flexShrink": "0", "letterSpacing": ".05em"}}>
              {" "}
              <span style={{"width": "3px", "height": "3px", "borderRadius": "50%", "background": "var(--gold-light)", "opacity": ".8", "display": "inline-block"}} />
              {" Etudes et Publications "}
            </span>
            {" "}
            <span style={{"padding": "0 32px", "fontSize": "12px", "fontWeight": "500", "color": "rgba(255,255,255,.52)", "display": "inline-flex", "alignItems": "center", "gap": "10px", "flexShrink": "0", "letterSpacing": ".05em"}}>
              {" "}
              <span style={{"width": "3px", "height": "3px", "borderRadius": "50%", "background": "var(--gold-light)", "opacity": ".8", "display": "inline-block"}} />
              {" Industries et Energie "}
            </span>
            {" "}
            <span style={{"padding": "0 32px", "fontSize": "12px", "fontWeight": "500", "color": "rgba(255,255,255,.52)", "display": "inline-flex", "alignItems": "center", "gap": "10px", "flexShrink": "0", "letterSpacing": ".05em"}}>
              {" "}
              <span style={{"width": "3px", "height": "3px", "borderRadius": "50%", "background": "var(--gold-light)", "opacity": ".8", "display": "inline-block"}} />
              {" Finances et Investissement "}
            </span>
            {" "}
            <span style={{"padding": "0 32px", "fontSize": "12px", "fontWeight": "500", "color": "rgba(255,255,255,.52)", "display": "inline-flex", "alignItems": "center", "gap": "10px", "flexShrink": "0", "letterSpacing": ".05em"}}>
              {" "}
              <span style={{"width": "3px", "height": "3px", "borderRadius": "50%", "background": "var(--gold-light)", "opacity": ".8", "display": "inline-block"}} />
              {" Partenariats Public-Privé "}
            </span>
            {" "}
            <span style={{"padding": "0 32px", "fontSize": "12px", "fontWeight": "500", "color": "rgba(255,255,255,.52)", "display": "inline-flex", "alignItems": "center", "gap": "10px", "flexShrink": "0", "letterSpacing": ".05em"}}>
              {" "}
              <span style={{"width": "3px", "height": "3px", "borderRadius": "50%", "background": "var(--gold-light)", "opacity": ".8", "display": "inline-block"}} />
              {" Recrutement "}
            </span>
            {" "}
            <span style={{"padding": "0 32px", "fontSize": "12px", "fontWeight": "500", "color": "rgba(255,255,255,.52)", "display": "inline-flex", "alignItems": "center", "gap": "10px", "flexShrink": "0", "letterSpacing": ".05em"}}>
              {" "}
              <span style={{"width": "3px", "height": "3px", "borderRadius": "50%", "background": "var(--gold-light)", "opacity": ".8", "display": "inline-block"}} />
              {" Outsourcing "}
            </span>
            {" "}
            <span style={{"padding": "0 32px", "fontSize": "12px", "fontWeight": "500", "color": "rgba(255,255,255,.52)", "display": "inline-flex", "alignItems": "center", "gap": "10px", "flexShrink": "0", "letterSpacing": ".05em"}}>
              {" "}
              <span style={{"width": "3px", "height": "3px", "borderRadius": "50%", "background": "var(--gold-light)", "opacity": ".8", "display": "inline-block"}} />
              {" Fintech "}
            </span>
            {" "}
          </div>
          {" "}
        </div>
        {" "}
      </section>
      <div className={"section-bg"}>
        {" "}
        <div className={"section"}>
          {" "}
          <div className={"section-tag"}>
            {"Nos Activités"}
          </div>
          {" "}
          <h2 className={"section-title"}>
            {"Ce que nous faisons"}
          </h2>
          {" "}
          <p className={"section-sub"}>
            {"Des expertises complémentaires au service du développement des organisations."}
          </p>
          {" "}
          <div className={"services-grid"}>
            {" "}
            <div className={"svc-card"} style={{"padding": "0", "overflow": "hidden"}}>
              {" "}
              <div style={{"height": "170px", "overflow": "hidden", "position": "relative"}}>
                {" "}
                <img src={"/storage/kapi/domaine_etudes2.jpg"} alt={"Conseil & Audit"} style={{"width": "100%", "height": "100%", "objectFit": "cover", "transition": "transform .5s ease"}} />
                {" "}
                <div style={{"position": "absolute", "inset": "0", "background": "linear-gradient(to bottom,transparent 40%,rgba(8,10,45,.5) 100%)"}} />
                {" "}
              </div>
              {" "}
              <div style={{"padding": "22px 24px"}}>
                {" "}
                <div className={"svc-name"}>
                  {"Conseil & Audit"}
                </div>
                {" "}
                <div className={"svc-desc"}>
                  {"Audit organisationnel, gouvernance et conseil stratégique pour améliorer la performance de votre organisation."}
                </div>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
            <div className={"svc-card"} style={{"padding": "0", "overflow": "hidden"}}>
              {" "}
              <div style={{"height": "170px", "overflow": "hidden", "position": "relative"}}>
                {" "}
                <img src={"/storage/kapi/prod_formation_mgmt.jpg"} alt={"Formation Professionnelle"} style={{"width": "100%", "height": "100%", "objectFit": "cover", "transition": "transform .5s ease"}} />
                {" "}
                <div style={{"position": "absolute", "inset": "0", "background": "linear-gradient(to bottom,transparent 40%,rgba(8,10,45,.5) 100%)"}} />
                {" "}
              </div>
              {" "}
              <div style={{"padding": "22px 24px"}}>
                {" "}
                <div className={"svc-name"}>
                  {"Formation Professionnelle"}
                </div>
                {" "}
                <div className={"svc-desc"}>
                  {"Programmes sur mesure pour renforcer les compétences individuelles et collectives de vos équipes."}
                </div>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
            <div className={"svc-card"} style={{"padding": "0", "overflow": "hidden"}}>
              {" "}
              <div style={{"height": "170px", "overflow": "hidden", "position": "relative"}}>
                {" "}
                <img src={"/storage/kapi/domaine_industrie.jpg"} alt={"Infrastructure & PPP"} style={{"width": "100%", "height": "100%", "objectFit": "cover", "transition": "transform .5s ease"}} />
                {" "}
                <div style={{"position": "absolute", "inset": "0", "background": "linear-gradient(to bottom,transparent 40%,rgba(8,10,45,.5) 100%)"}} />
                {" "}
              </div>
              {" "}
              <div style={{"padding": "22px 24px"}}>
                {" "}
                <div className={"svc-name"}>
                  {"Infrastructure & PPP"}
                </div>
                {" "}
                <div className={"svc-desc"}>
                  {"Montage et structuration de projets d'infrastructure en partenariats public-privé et ingénierie financière."}
                </div>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </div>
          {" "}
          <div style={{"textAlign": "center", "marginTop": "32px"}}>
            {" "}
            <a href={"/nos-activites"} className={"btn btn-blue"}>
              {"Voir toutes nos activités →"}
            </a>
            {" "}
          </div>
          {" "}
        </div>
        {" "}
      </div>
      <div className={"qsn-outer"} style={{"maxWidth": "1280px", "margin": "0 auto", "padding": "80px 36px"}}>
        {" "}
        <div className={"qsn-grid"} style={{"display": "grid", "gridTemplateColumns": "1fr 1fr", "gap": "72px", "alignItems": "center"}}>
          {" "}
          <div style={{"position": "relative"}}>
            {" "}
            <img src={"/storage/kapi/equipe.png"} alt={"Équipe Kapi Consult"} style={{"width": "100%", "borderRadius": "20px", "display": "block", "boxShadow": "0 20px 60px rgba(30,34,153,0.15)"}} />
            {" "}
            <div className={"qsn-badge"} style={{"position": "absolute", "bottom": "-20px", "right": "-20px", "background": "var(--gold)", "color": "var(--white)", "borderRadius": "16px", "padding": "20px 28px", "boxShadow": "0 8px 32px rgba(184,137,42,0.35)"}}>
              {" "}
              <div style={{"fontFamily": "'Playfair Display',serif", "fontSize": "32px", "fontWeight": "700", "lineHeight": "1"}}>
                {"300"}
                <span style={{"fontSize": "18px"}}>
                  {"Mds+"}
                </span>
              </div>
              {" "}
              <div style={{"fontSize": "12px", "fontWeight": "600", "marginTop": "4px", "opacity": ".9"}}>
                {"FCFA mobilisés"}
              </div>
              {" "}
            </div>
            {" "}
          </div>
          {" "}
          <div>
            {" "}
            <span className={"section-tag"}>
              {"Qui sommes-nous"}
            </span>
            {" "}
            <h2 className={"section-title"}>
              {"Cabinet d'Études et de Conseils en management"}
            </h2>
            {" "}
            <p style={{"fontSize": "15px", "color": "var(--gray)", "lineHeight": "1.85", "marginBottom": "16px"}}>
              {" KAPI CONSULT est un cabinet d'Études et de Conseils en management, organisation et compétitivité orienté Résultats dans les métiers de production et d'infrastructure. "}
            </p>
            {" "}
            <p style={{"fontSize": "15px", "color": "var(--gray)", "lineHeight": "1.85", "marginBottom": "28px"}}>
              {" Nous contribuons au développement de nos clients en leur apportant des services d'optimisation stratégique, technologique, industrielle et financière pour favoriser leur pérennité et leur succès. "}
            </p>
            {" "}
            <div style={{"display": "grid", "gridTemplateColumns": "1fr 1fr", "gap": "14px", "marginBottom": "28px"}}>
              {" "}
              <div style={{"background": "var(--light)", "borderRadius": "12px", "padding": "16px 20px", "borderLeft": "3px solid var(--blue-mid)"}}>
                {" "}
                <div style={{"fontFamily": "'Playfair Display',serif", "fontSize": "26px", "fontWeight": "700", "color": "var(--blue-deep)"}}>
                  {"20+"}
                </div>
                {" "}
                <div style={{"fontSize": "12px", "color": "var(--gray)", "marginTop": "2px"}}>
                  {"Années d'expérience"}
                </div>
                {" "}
              </div>
              {" "}
              <div style={{"background": "var(--light)", "borderRadius": "12px", "padding": "16px 20px", "borderLeft": "3px solid var(--blue-mid)"}}>
                {" "}
                <div style={{"fontFamily": "'Playfair Display',serif", "fontSize": "26px", "fontWeight": "700", "color": "var(--blue-deep)"}}>
                  {"4"}
                </div>
                {" "}
                <div style={{"fontSize": "12px", "color": "var(--gray)", "marginTop": "2px"}}>
                  {"Pays d'intervention"}
                </div>
                {" "}
              </div>
              {" "}
              <div style={{"background": "var(--light)", "borderRadius": "12px", "padding": "16px 20px", "borderLeft": "3px solid var(--blue-mid)"}}>
                {" "}
                <div style={{"fontFamily": "'Playfair Display',serif", "fontSize": "26px", "fontWeight": "700", "color": "var(--blue-deep)"}}>
                  {"8"}
                </div>
                {" "}
                <div style={{"fontSize": "12px", "color": "var(--gray)", "marginTop": "2px"}}>
                  {"Domaines d'expertise"}
                </div>
                {" "}
              </div>
              {" "}
              <div style={{"background": "var(--light)", "borderRadius": "12px", "padding": "16px 20px", "borderLeft": "3px solid var(--blue-mid)"}}>
                {" "}
                <div style={{"fontFamily": "'Playfair Display',serif", "fontSize": "26px", "fontWeight": "700", "color": "var(--blue-deep)"}}>
                  {"100s"}
                </div>
                {" "}
                <div style={{"fontSize": "12px", "color": "var(--gray)", "marginTop": "2px"}}>
                  {"Profils recrutés"}
                </div>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
            <a href={"/a-propos"} className={"btn btn-blue"}>
              {"En savoir plus →"}
            </a>
            {" "}
          </div>
          {" "}
        </div>
        {" "}
      </div>
      <HomeNews />
      <div className={"real-outer"} style={{"background": "var(--blue-deep)", "padding": "80px 0"}}>
        {" "}
        <div className={"real-inner"} style={{"maxWidth": "1280px", "margin": "0 auto", "padding": "0 36px"}}>
          {" "}
          <div style={{"textAlign": "center", "marginBottom": "52px"}}>
            {" "}
            <span style={{"display": "inline-block", "background": "rgba(184,137,42,.2)", "color": "var(--gold-light)", "fontSize": "11px", "fontWeight": "700", "letterSpacing": ".15em", "textTransform": "uppercase", "padding": "6px 18px", "borderRadius": "20px", "marginBottom": "14px"}}>
              {"Nos Réalisations"}
            </span>
            {" "}
            <h2 style={{"fontFamily": "'Playfair Display',serif", "fontSize": "36px", "fontWeight": "700", "color": "var(--white)", "marginBottom": "10px"}}>
              {"Des projets à fort impact"}
            </h2>
            {" "}
            <p style={{"fontSize": "15px", "color": "rgba(255,255,255,.55)", "maxWidth": "560px", "margin": "0 auto"}}>
              {"Des centaines d'études réalisées, des centaines de projets évalués — Plus de 300 milliards FCFA mobilisés."}
            </p>
            {" "}
          </div>
          {" "}
          <div className={"real-cards-grid"} style={{"display": "grid", "gridTemplateColumns": "repeat(4,1fr)", "gap": "20px", "marginBottom": "20px"}}>
            {" "}
            <div style={{"borderRadius": "16px", "overflow": "hidden", "background": "rgba(255,255,255,.06)", "border": "1px solid rgba(255,255,255,.08)", "transition": "all .3s"}} onMouseOver={inline("this.style.transform='translateY(-6px)';this.style.background='rgba(255,255,255,.1)'")} onMouseOut={inline("this.style.transform='none';this.style.background='rgba(255,255,255,.06)'")}>
              {" "}
              <div style={{"height": "180px", "overflow": "hidden"}}>
                {" "}
                <img src={"/storage/kapi/real_zener.jpg"} alt={"ZENER SA"} style={{"width": "100%", "height": "100%", "objectFit": "cover", "transition": "transform .4s"}} onMouseOver={inline("this.style.transform='scale(1.05)'")} onMouseOut={inline("this.style.transform='scale(1)'")} />
                {" "}
              </div>
              {" "}
              <div style={{"padding": "20px"}}>
                {" "}
                <div style={{"fontSize": "15px", "fontWeight": "700", "color": "var(--white)", "marginBottom": "8px"}}>
                  {"ZENER SA"}
                </div>
                {" "}
                <p style={{"fontSize": "13px", "color": "rgba(255,255,255,.55)", "lineHeight": "1.6", "margin": "0"}}>
                  {"Mobilisation de 16 milliards FCFA pour le développement des activités de distribution de gaz."}
                </p>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
            <div style={{"borderRadius": "16px", "overflow": "hidden", "background": "rgba(255,255,255,.06)", "border": "1px solid rgba(255,255,255,.08)", "transition": "all .3s"}} onMouseOver={inline("this.style.transform='translateY(-6px)';this.style.background='rgba(255,255,255,.1)'")} onMouseOut={inline("this.style.transform='none';this.style.background='rgba(255,255,255,.06)'")}>
              {" "}
              <div style={{"height": "180px", "overflow": "hidden"}}>
                {" "}
                <img src={"/storage/kapi/real_radisson.jpg"} alt={"Radisson Abidjan"} style={{"width": "100%", "height": "100%", "objectFit": "cover", "transition": "transform .4s"}} onMouseOver={inline("this.style.transform='scale(1.05)'")} onMouseOut={inline("this.style.transform='scale(1)'")} />
                {" "}
              </div>
              {" "}
              <div style={{"padding": "20px"}}>
                {" "}
                <div style={{"fontSize": "15px", "fontWeight": "700", "color": "var(--white)", "marginBottom": "8px"}}>
                  {"Radisson Abidjan"}
                </div>
                {" "}
                <p style={{"fontSize": "13px", "color": "rgba(255,255,255,.55)", "lineHeight": "1.6", "margin": "0"}}>
                  {"Étude et mobilisation de ressources pour la construction d'un hôtel 5 étoiles Radisson Blu."}
                </p>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
            <div style={{"borderRadius": "16px", "overflow": "hidden", "background": "rgba(255,255,255,.06)", "border": "1px solid rgba(255,255,255,.08)", "transition": "all .3s"}} onMouseOver={inline("this.style.transform='translateY(-6px)';this.style.background='rgba(255,255,255,.1)'")} onMouseOut={inline("this.style.transform='none';this.style.background='rgba(255,255,255,.06)'")}>
              {" "}
              <div style={{"height": "180px", "overflow": "hidden"}}>
                {" "}
                <img src={"/storage/kapi/real_sheraton.jpg"} alt={"Sheraton Bamako"} style={{"width": "100%", "height": "100%", "objectFit": "cover", "transition": "transform .4s"}} onMouseOver={inline("this.style.transform='scale(1.05)'")} onMouseOut={inline("this.style.transform='scale(1)'")} />
                {" "}
              </div>
              {" "}
              <div style={{"padding": "20px"}}>
                {" "}
                <div style={{"fontSize": "15px", "fontWeight": "700", "color": "var(--white)", "marginBottom": "8px"}}>
                  {"Sheraton Bamako"}
                </div>
                {" "}
                <p style={{"fontSize": "13px", "color": "rgba(255,255,255,.55)", "lineHeight": "1.6", "margin": "0"}}>
                  {"Étude et mobilisation de ressources pour le financement de SHERATON BAMAKO."}
                </p>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
            <div style={{"borderRadius": "16px", "overflow": "hidden", "background": "rgba(255,255,255,.06)", "border": "1px solid rgba(255,255,255,.08)", "transition": "all .3s"}} onMouseOver={inline("this.style.transform='translateY(-6px)';this.style.background='rgba(255,255,255,.1)'")} onMouseOut={inline("this.style.transform='none';this.style.background='rgba(255,255,255,.06)'")}>
              {" "}
              <div style={{"height": "180px", "overflow": "hidden"}}>
                {" "}
                <img src={"/storage/kapi/real_aeroport.jpg"} alt={"Aéroport Gnassingbé"} style={{"width": "100%", "height": "100%", "objectFit": "cover", "transition": "transform .4s"}} onMouseOver={inline("this.style.transform='scale(1.05)'")} onMouseOut={inline("this.style.transform='scale(1)'")} />
                {" "}
              </div>
              {" "}
              <div style={{"padding": "20px"}}>
                {" "}
                <div style={{"fontSize": "15px", "fontWeight": "700", "color": "var(--white)", "marginBottom": "8px"}}>
                  {"Aéroport Gnassingbé"}
                </div>
                {" "}
                <p style={{"fontSize": "13px", "color": "rgba(255,255,255,.55)", "lineHeight": "1.6", "margin": "0"}}>
                  {"Contrôle des travaux du système hydrant de l'Aéroport International Gnassingbé Eyadema."}
                </p>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </div>
          {" "}
          <div className={"real-logos-grid"} style={{"display": "grid", "gridTemplateColumns": "repeat(4,1fr)", "gap": "16px"}}>
            {" "}
            <div style={{"background": "var(--white)", "borderRadius": "12px", "padding": "18px", "display": "flex", "flexDirection": "column", "alignItems": "center", "justifyContent": "center", "gap": "10px", "minHeight": "90px"}}>
              {" "}
              <img src={"/storage/kapi/real_aprodat.jpg"} alt={"APRODAT"} style={{"maxHeight": "45px", "maxWidth": "140px", "objectFit": "contain"}} />
              {" "}
              <span style={{"fontSize": "11px", "color": "var(--gray)", "fontWeight": "600", "textAlign": "center"}}>
                {"APRODAT"}
              </span>
              {" "}
            </div>
            {" "}
            <div style={{"background": "var(--white)", "borderRadius": "12px", "padding": "18px", "display": "flex", "flexDirection": "column", "alignItems": "center", "justifyContent": "center", "gap": "10px", "minHeight": "90px"}}>
              {" "}
              <img src={"/storage/kapi/real_buyrek.png"} alt={"BuyRek Africa"} style={{"maxHeight": "45px", "maxWidth": "140px", "objectFit": "contain"}} />
              {" "}
              <span style={{"fontSize": "11px", "color": "var(--gray)", "fontWeight": "600", "textAlign": "center"}}>
                {"BuyRek Africa"}
              </span>
              {" "}
            </div>
            {" "}
            <div style={{"background": "var(--white)", "borderRadius": "12px", "padding": "18px", "display": "flex", "flexDirection": "column", "alignItems": "center", "justifyContent": "center", "gap": "10px", "minHeight": "90px"}}>
              {" "}
              <img src={"/storage/kapi/real_afrik_creances.png"} alt={"Afrik Créances"} style={{"maxHeight": "45px", "maxWidth": "140px", "objectFit": "contain"}} />
              {" "}
              <span style={{"fontSize": "11px", "color": "var(--gray)", "fontWeight": "600", "textAlign": "center"}}>
                {"Afrik Créances"}
              </span>
              {" "}
            </div>
            {" "}
            <div style={{"background": "var(--white)", "borderRadius": "12px", "padding": "18px", "display": "flex", "flexDirection": "column", "alignItems": "center", "justifyContent": "center", "gap": "10px", "minHeight": "90px"}}>
              {" "}
              <img src={"/storage/kapi/real_ibbank.jpg"} alt={"IB Bank (ex BTCI)"} style={{"maxHeight": "45px", "maxWidth": "140px", "objectFit": "contain"}} />
              {" "}
              <span style={{"fontSize": "11px", "color": "var(--gray)", "fontWeight": "600", "textAlign": "center"}}>
                {"IB Bank (ex BTCI)"}
              </span>
              {" "}
            </div>
            {" "}
          </div>
          {" "}
        </div>
        {" "}
      </div>
      <div className={"section-bg"}>
        {" "}
        <div className={"section"} style={{"paddingBottom": "52px"}}>
          {" "}
          <div className={"section-tag"}>
            {"Nos Partenaires"}
          </div>
          {" "}
          <h2 className={"section-title"}>
            {"Ils nous font confiance"}
          </h2>
          {" "}
          <p className={"section-sub"}>
            {"Ensemble, nous construisons des solutions durables pour l'Afrique de l'Ouest."}
          </p>
          {" "}
          <div className={"partners-track-wrap"}>
            {" "}
            <div className={"partners-track"}>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <img src={"/storage/partenaires/1V8bLOV04r83bkZaogPJ1qpN66aBFfSY56iVqdzY.png"} alt={"OSEOR"} />
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <img src={"/storage/partenaires/AFnFwentvgwBWbOACCNaXOFnMI9q2eQAWJhwulRV.png"} alt={"DiWA Industries"} />
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <img src={"/storage/partenaires/V0fr5oYMCn8u36Md0We6fYhjwTUUGOVdU804bBeM.png"} alt={"DiWA Products"} />
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <img src={"/storage/partenaires/2ZAmpFBOuXdgHW70yQlxZHVnWTa5dbT9t4yQHsmc.png"} alt={"DiWA International"} />
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <img src={"/storage/partenaires/uzlCJlGThVPqUE0uEV3v5BlhrobjejMGwrZgTFlt.png"} alt={"ZENER SA"} />
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <img src={"/storage/partenaires/waLk6t88n6PeGXnavC4Yn0f0SMYXnsJD5SoTaL6z.png"} alt={"BLUEN Clean Energy"} />
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <img src={"/storage/partenaires/4OLfg9gc10ydHBZAkOVJISYjm5thJRj9rTMbM8Eb.png"} alt={"JCEMGROUP Togo"} />
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <span className={"partner-logo-text"}>
                  {"PGS"}
                </span>
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <span className={"partner-logo-text"}>
                  {"PLS"}
                </span>
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <span className={"partner-logo-text"}>
                  {"Bourseria"}
                </span>
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <img src={"/storage/partenaires/dODsSFXk1X5UwheQigggUCYuNZ1A8cMWWIMH1bxh.bmp"} alt={"TRFS"} />
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <span className={"partner-logo-text"}>
                  {"BIDC (EBID)"}
                </span>
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <span className={"partner-logo-text"}>
                  {"BOAD"}
                </span>
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <span className={"partner-logo-text"}>
                  {"AFREXIM BANK"}
                </span>
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <span className={"partner-logo-text"}>
                  {"CORIS Capital"}
                </span>
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <span className={"partner-logo-text"}>
                  {"BMCE Capital"}
                </span>
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <span className={"partner-logo-text"}>
                  {"ONUD (UNIDO)"}
                </span>
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <span className={"partner-logo-text"}>
                  {"CITAC"}
                </span>
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <span className={"partner-logo-text"}>
                  {"IMC"}
                </span>
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <span className={"partner-logo-text"}>
                  {"Profiles International"}
                </span>
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <span className={"partner-logo-text"}>
                  {"GIDB"}
                </span>
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <span className={"partner-logo-text"}>
                  {"Ingénieurs sans frontières"}
                </span>
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <span className={"partner-logo-text"}>
                  {"RITES"}
                </span>
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <span className={"partner-logo-text"}>
                  {"Cabinet Gainsbury & Consorts"}
                </span>
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <span className={"partner-logo-text"}>
                  {"Partners in Performance"}
                </span>
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <span className={"partner-logo-text"}>
                  {"Conseil de l'Entente"}
                </span>
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <img src={"/storage/kapi/part_atogo.jpg"} alt={"@TOGO"} />
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <span className={"partner-logo-text"}>
                  {"citygroup"}
                </span>
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <img src={"/storage/partenaires/1V8bLOV04r83bkZaogPJ1qpN66aBFfSY56iVqdzY.png"} alt={"OSEOR"} />
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <img src={"/storage/partenaires/AFnFwentvgwBWbOACCNaXOFnMI9q2eQAWJhwulRV.png"} alt={"DiWA Industries"} />
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <img src={"/storage/partenaires/V0fr5oYMCn8u36Md0We6fYhjwTUUGOVdU804bBeM.png"} alt={"DiWA Products"} />
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <img src={"/storage/partenaires/2ZAmpFBOuXdgHW70yQlxZHVnWTa5dbT9t4yQHsmc.png"} alt={"DiWA International"} />
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <img src={"/storage/partenaires/uzlCJlGThVPqUE0uEV3v5BlhrobjejMGwrZgTFlt.png"} alt={"ZENER SA"} />
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <img src={"/storage/partenaires/waLk6t88n6PeGXnavC4Yn0f0SMYXnsJD5SoTaL6z.png"} alt={"BLUEN Clean Energy"} />
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <img src={"/storage/partenaires/4OLfg9gc10ydHBZAkOVJISYjm5thJRj9rTMbM8Eb.png"} alt={"JCEMGROUP Togo"} />
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <span className={"partner-logo-text"}>
                  {"PGS"}
                </span>
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <span className={"partner-logo-text"}>
                  {"PLS"}
                </span>
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <span className={"partner-logo-text"}>
                  {"Bourseria"}
                </span>
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <img src={"/storage/partenaires/dODsSFXk1X5UwheQigggUCYuNZ1A8cMWWIMH1bxh.bmp"} alt={"TRFS"} />
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <span className={"partner-logo-text"}>
                  {"BIDC (EBID)"}
                </span>
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <span className={"partner-logo-text"}>
                  {"BOAD"}
                </span>
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <span className={"partner-logo-text"}>
                  {"AFREXIM BANK"}
                </span>
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <span className={"partner-logo-text"}>
                  {"CORIS Capital"}
                </span>
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <span className={"partner-logo-text"}>
                  {"BMCE Capital"}
                </span>
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <span className={"partner-logo-text"}>
                  {"ONUD (UNIDO)"}
                </span>
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <span className={"partner-logo-text"}>
                  {"CITAC"}
                </span>
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <span className={"partner-logo-text"}>
                  {"IMC"}
                </span>
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <span className={"partner-logo-text"}>
                  {"Profiles International"}
                </span>
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <span className={"partner-logo-text"}>
                  {"GIDB"}
                </span>
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <span className={"partner-logo-text"}>
                  {"Ingénieurs sans frontières"}
                </span>
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <span className={"partner-logo-text"}>
                  {"RITES"}
                </span>
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <span className={"partner-logo-text"}>
                  {"Cabinet Gainsbury & Consorts"}
                </span>
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <span className={"partner-logo-text"}>
                  {"Partners in Performance"}
                </span>
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <span className={"partner-logo-text"}>
                  {"Conseil de l'Entente"}
                </span>
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <img src={"/storage/kapi/part_atogo.jpg"} alt={"@TOGO"} />
                {" "}
              </div>
              {" "}
              <div className={"partner-logo"}>
                {" "}
                <span className={"partner-logo-text"}>
                  {"citygroup"}
                </span>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </div>
          {" "}
        </div>
        {" "}
      </div>
      <div className={"section-bg"}>
        {" "}
        <div className={"section"}>
          {" "}
          <div className={"section-tag"}>
            {"Nos Produits"}
          </div>
          {" "}
          <h2 className={"section-title"}>
            {"Notre catalogue"}
          </h2>
          {" "}
          <div className={"products-grid"}>
            {" "}
            <a href={"/nos-produits/formation-management-dequipe-69b2408f956b3"} className={"product-card"} style={{"textDecoration": "none", "color": "inherit"}}>
              {" "}
              <div className={"product-img"}>
                {" "}
                <img src={"/storage/kapi/prod_formation_mgmt.jpg"} alt={"Formation Management d'équipe"} />
                {" "}
              </div>
              {" "}
              <div className={"product-body"}>
                {" "}
                <div className={"product-name"}>
                  {"Formation Management d'équipe"}
                </div>
                {" "}
                <div className={"product-desc"}>
                  {"Formation intensive de 3 jours pour développer vos compétenc..."}
                </div>
                {" "}
              </div>
              {" "}
            </a>
            {" "}
            <a href={"/nos-produits/audit-rh-complet-69b2408f9655f"} className={"product-card"} style={{"textDecoration": "none", "color": "inherit"}}>
              {" "}
              <div className={"product-img"}>
                {" "}
                <img src={"/storage/kapi/prod_audit_rh.jpg"} alt={"Audit RH Complet"} />
                {" "}
              </div>
              {" "}
              <div className={"product-body"}>
                {" "}
                <div className={"product-name"}>
                  {"Audit RH Complet"}
                </div>
                {" "}
                <div className={"product-desc"}>
                  {"Audit complet de votre dispositif RH : structure organisatio..."}
                </div>
                {" "}
              </div>
              {" "}
            </a>
            {" "}
            <a href={"/nos-produits/pack-recrutement-express-69b2408f9717f"} className={"product-card"} style={{"textDecoration": "none", "color": "inherit"}}>
              {" "}
              <div className={"product-img"}>
                {" "}
                <img src={"/storage/kapi/prod_recrutement.jpg"} alt={"Pack Recrutement Express"} />
                {" "}
              </div>
              {" "}
              <div className={"product-body"}>
                {" "}
                <div className={"product-name"}>
                  {"Pack Recrutement Express"}
                </div>
                {" "}
                <div className={"product-desc"}>
                  {"Solution clé en main pour vos recrutements urgents. Publicat..."}
                </div>
                {" "}
              </div>
              {" "}
            </a>
            {" "}
            <a href={"/nos-produits/formation-excel-rh-avance-69b2408f97e30"} className={"product-card"} style={{"textDecoration": "none", "color": "inherit"}}>
              {" "}
              <div className={"product-img"}>
                {" "}
                <img src={"/storage/kapi/prod_formation_excel.jpg"} alt={"Formation Excel RH Avancé"} />
                {" "}
              </div>
              {" "}
              <div className={"product-body"}>
                {" "}
                <div className={"product-name"}>
                  {"Formation Excel RH Avancé"}
                </div>
                {" "}
                <div className={"product-desc"}>
                  {"Formation pratique sur l'utilisation d'Excel pour les profes..."}
                </div>
                {" "}
              </div>
              {" "}
            </a>
            {" "}
          </div>
          {" "}
          <div style={{"textAlign": "center", "marginTop": "28px"}}>
            {" "}
            <a href={"/nos-produits"} className={"btn btn-blue"}>
              {"Voir tout le catalogue →"}
            </a>
            {" "}
          </div>
          {" "}
        </div>
        {" "}
      </div>
      <div id={"videoModal"} style={{"display": "none", "position": "fixed", "inset": "0", "background": "rgba(0,0,0,.85)", "zIndex": "9999", "alignItems": "center", "justifyContent": "center"}} onClick={inline("closeTeamVideo()")}>
        {" "}
        <div style={{"background": "var(--black)", "borderRadius": "16px", "overflow": "hidden", "maxWidth": "800px", "width": "90%", "position": "relative"}} onClick={inline("event.stopPropagation()")}>
          {" "}
          <div style={{"display": "flex", "alignItems": "center", "justifyContent": "space-between", "padding": "14px 18px", "borderBottom": "1px solid rgba(255,255,255,.1)"}}>
            {" "}
            <span id={"videoModalTitle"} style={{"fontFamily": "'Playfair Display',serif", "fontSize": "16px", "color": "var(--white)"}} />
            {" "}
            <button onClick={inline("closeTeamVideo()")} style={{"background": "none", "border": "none", "color": "rgba(255,255,255,.6)", "fontSize": "22px", "cursor": "pointer", "lineHeight": "1"}}>
              {"×"}
            </button>
            {" "}
          </div>
          {" "}
          <div style={{"padding": "0", "aspectRatio": "16/9"}}>
            {" "}
            <iframe id={"videoFrame"} style={{"width": "100%", "height": "100%", "border": "none"}} allow={"accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"} allowFullScreen={true} />
            {" "}
          </div>
          {" "}
        </div>
        {" "}
      </div>
      </main>
      <div id={"anniv-popup"} style={{"display": "none", "position": "fixed", "inset": "0", "zIndex": "9999", "background": "rgba(8,10,45,0.82)", "backdropFilter": "blur(6px)", "alignItems": "center", "justifyContent": "center", "padding": "16px"}}>
        {" "}
        <div id={"anniv-card"} style={{"position": "relative", "background": "linear-gradient(145deg,#0D1260 0%,#1E2299 45%,#131680 100%)", "borderRadius": "28px", "padding": "52px 44px 40px", "maxWidth": "480px", "width": "100%", "textAlign": "center", "boxShadow": "0 32px 80px rgba(0,0,0,.6),0 0 0 1px rgba(184,137,42,.3)", "overflow": "hidden", "animation": "cardIn .55s cubic-bezier(.34,1.56,.64,1) both"}}>
          {" "}
          {" "}
          <div style={{"position": "absolute", "inset": "0", "pointerEvents": "none", "overflow": "hidden"}}>
            {" "}
            <span style={{"position": "absolute", "fontSize": "16px", "top": "12%", "left": "8%", "animation": "floatStar 3.2s ease-in-out infinite"}}>
              {"⭐"}
            </span>
            {" "}
            <span style={{"position": "absolute", "fontSize": "12px", "top": "18%", "right": "10%", "animation": "floatStar 2.8s ease-in-out infinite .4s"}}>
              {"✨"}
            </span>
            {" "}
            <span style={{"position": "absolute", "fontSize": "14px", "bottom": "22%", "left": "6%", "animation": "floatStar 3.6s ease-in-out infinite .8s"}}>
              {"🎊"}
            </span>
            {" "}
            <span style={{"position": "absolute", "fontSize": "11px", "bottom": "18%", "right": "8%", "animation": "floatStar 2.5s ease-in-out infinite .2s"}}>
              {"⭐"}
            </span>
            {" "}
            <span style={{"position": "absolute", "fontSize": "10px", "top": "40%", "left": "3%", "animation": "floatStar 4s ease-in-out infinite 1s"}}>
              {"✨"}
            </span>
            {" "}
            <span style={{"position": "absolute", "fontSize": "10px", "top": "35%", "right": "3%", "animation": "floatStar 3s ease-in-out infinite .6s"}}>
              {"🎉"}
            </span>
            {" "}
          </div>
          {" "}
          {" "}
          <button onClick={inline("closeAnnivPopup()")} style={{"position": "absolute", "top": "16px", "right": "16px", "background": "rgba(255,255,255,.1)", "border": "1px solid rgba(255,255,255,.2)", "color": "rgba(255,255,255,.7)", "width": "34px", "height": "34px", "borderRadius": "50%", "fontSize": "18px", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center", "transition": "all .2s", "lineHeight": "1"}} onMouseOver={inline("this.style.background='rgba(255,255,255,.2)';this.style.color='#fff'")} onMouseOut={inline("this.style.background='rgba(255,255,255,.1)';this.style.color='rgba(255,255,255,.7)'")}>
            {"×"}
          </button>
          {" "}
          {" "}
          <div style={{"display": "inline-block", "background": "linear-gradient(135deg,var(--gold),var(--gold-light))", "color": "var(--white)", "borderRadius": "20px", "padding": "4px 16px", "fontSize": "10px", "fontWeight": "800", "letterSpacing": ".18em", "textTransform": "uppercase", "marginBottom": "28px", "boxShadow": "0 4px 16px rgba(184,137,42,.5)"}}>
            {"Kapi Consult"}
          </div>
          {" "}
          {" "}
          <div style={{"position": "relative", "width": "160px", "height": "160px", "margin": "0 auto 24px"}}>
            {" "}
            <div style={{"position": "absolute", "inset": "0", "borderRadius": "50%", "border": "3px solid rgba(184,137,42,.2)"}} />
            {" "}
            <div style={{"position": "absolute", "inset": "-6px", "borderRadius": "50%", "border": "3px solid transparent", "borderTopColor": "var(--gold)", "borderRightColor": "var(--gold-light)", "animation": "ringSpinFast 1.5s linear infinite"}} />
            {" "}
            <div style={{"position": "absolute", "inset": "6px", "borderRadius": "50%", "border": "2px solid transparent", "borderBottomColor": "rgba(184,137,42,.5)", "borderLeftColor": "rgba(184,137,42,.3)", "animation": "ringSpinSlow 3s linear infinite reverse"}} />
            {" "}
            <div style={{"position": "absolute", "inset": "0", "display": "flex", "alignItems": "center", "justifyContent": "center", "flexDirection": "column"}}>
              {" "}
              <div style={{"fontFamily": "'Playfair Display',serif", "fontSize": "72px", "fontWeight": "700", "color": "var(--white)", "lineHeight": "1", "letterSpacing": "-.04em", "animation": "pulse20 2s ease-in-out infinite"}}>
                {"20"}
              </div>
              {" "}
            </div>
            {" "}
          </div>
          {" "}
          {" "}
          <div style={{"fontSize": "13px", "fontWeight": "800", "letterSpacing": ".28em", "textTransform": "uppercase", "color": "var(--gold-light)", "marginBottom": "8px"}}>
            {"ANS D'EXCELLENCE"}
          </div>
          {" "}
          <h2 style={{"fontFamily": "'Playfair Display',serif", "fontSize": "22px", "fontWeight": "700", "color": "var(--white)", "lineHeight": "1.35", "marginBottom": "12px"}}>
            {"Au service des organisations"}
            <br />
            {"d'Afrique de l'Ouest"}
          </h2>
          {" "}
          <p style={{"fontSize": "13px", "color": "rgba(255,255,255,.55)", "lineHeight": "1.6", "marginBottom": "32px"}}>
            {"Depuis 2004, Kapi Consult accompagne les acteurs économiques vers l'excellence et la compétitivité."}
          </p>
          {" "}
          {" "}
          <div style={{"background": "rgba(255,255,255,.1)", "borderRadius": "4px", "height": "4px", "overflow": "hidden", "marginBottom": "18px"}}>
            {" "}
            <div id={"anniv-bar"} style={{"height": "100%", "background": "linear-gradient(90deg,var(--gold),var(--gold-light))", "borderRadius": "4px", "width": "100%", "animation": "barShrink 5s linear forwards"}} />
            {" "}
          </div>
          {" "}
          <div style={{"fontSize": "11px", "color": "rgba(255,255,255,.35)", "letterSpacing": ".06em"}}>
            {"Fermeture automatique dans "}
            <span id={"anniv-countdown"}>
              {"5"}
            </span>
            {"s · "}
            <button onClick={inline("closeAnnivPopup()")} style={{"background": "none", "border": "none", "color": "rgba(255,255,255,.5)", "fontSize": "11px", "cursor": "pointer", "textDecoration": "underline", "fontFamily": "'DM Sans',sans-serif"}}>
              {"fermer maintenant"}
            </button>
          </div>
          {" "}
        </div>
        {" "}
      </div>
    </>
  );
}
