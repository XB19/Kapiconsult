// Génère les composants React des pages "vitrines" à partir des pages HTML récupérées
const fs = require('fs');
const path = require('path');
const he = require('he');
const { htmlToJsx, fixUrl } = require('./h2jsx');

const SITE = path.join(__dirname, '..', 'site', 'pages');
const OUT = 'C:/Users/HP/OneDrive/Bureau/Kapiconsult/frontend/src';
const read = (f) => fs.readFileSync(path.join(SITE, f), 'utf8');

const between = (s, a, b) => { const i = s.indexOf(a); const j = s.indexOf(b, i + a.length); return s.slice(i + a.length, j); };
const styles = (html) => [...html.matchAll(/<style>([\s\S]*?)<\/style>/g)].map((m) => m[1]);
const tailScripts = (html) => {
  const tail = html.slice(html.indexOf('</footer>'));
  return [...tail.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]).filter((c) => !c.includes('function toggleNav'));
};

// ---- CSS global (identique sur toutes les pages)
const idx = read('index.html');
fs.writeFileSync(path.join(OUT, 'styles', 'global.css'), fixUrl(styles(idx)[0]).trim() + '\n');

// ---- Titres / descriptions de chaque page
const meta = {};
for (const f of fs.readdirSync(SITE)) {
  const h = read(f);
  const title = he.decode((h.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '');
  const desc = he.decode((h.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '');
  meta[f.replace(/\.html$/, '')] = { title, desc };
}
fs.writeFileSync(path.join(OUT, 'generated', 'meta.json'), JSON.stringify(meta, null, 2));

function writePage(name, parts, extraImports = '', css = [], scripts = []) {
  const body = parts.map((p) => (typeof p === 'string' ? p : p.jsx)).join('\n      ');
  const cssJsx = css.length ? `<style dangerouslySetInnerHTML={{__html: ${JSON.stringify(fixUrl(css.join('\n')))}}} />` : '';
  const src = `// Fichier généré automatiquement depuis kapiconsult.tg — ne pas éditer à la main (voir tools/generate.js)
import { inline, useLegacyScripts } from '../lib/legacy';
${extraImports}
const SCRIPTS = ${JSON.stringify(scripts.map(fixUrl), null, 2)};

export default function ${name}() {
  useLegacyScripts(SCRIPTS);
  return (
    <>
      ${cssJsx}
      ${body}
    </>
  );
}
`;
  fs.writeFileSync(path.join(OUT, 'generated', `${name}.jsx`), src);
  console.log('ok', name, src.length);
}

// ---- Accueil : statique + section actualités dynamique (API)
{
  const main = between(idx, '<main>', '</main>');
  const a = main.slice(0, main.indexOf('<!-- ACTUALITÉS -->'));
  const b = main.slice(main.indexOf('<!-- PRODUITS -->'));
  const popup = idx.slice(idx.indexOf('<!-- POPUP 20 ANS -->'), idx.lastIndexOf('<style>'));
  const sc = [];
  const parts = [`<main>`, htmlToJsx(a, sc), `<HomeNews />`, htmlToJsx(b, sc), `</main>`, htmlToJsx(popup, sc)];
  const css = [styles(idx)[1], styles(idx)[2]];
  writePage('HomePage', parts, "import HomeNews from '../components/HomeNews';", css, [...sc, ...tailScripts(idx)]);
}

// ---- Pages entièrement statiques
for (const [file, comp] of [['a-propos.html', 'AProposPage'], ['nos-activites.html', 'NosActivitesPage']]) {
  const h = read(file);
  const sc = [];
  const jsx = htmlToJsx(between(h, '<main>', '</main>'), sc);
  writePage(comp, ['<main>', jsx, '</main>'], '', styles(h).slice(1), [...sc, ...tailScripts(h)]);
}
