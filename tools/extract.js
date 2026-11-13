// Extrait les contenus dynamiques des pages récupérées -> backend/src/db/seed-data.json
const fs = require('fs');
const path = require('path');
const he = require('he');
const { fixUrl } = require('./h2jsx');

const SITE = path.join(__dirname, '..', 'site', 'pages');
const read = (f) => fs.readFileSync(path.join(SITE, f), 'utf8');
const dec = (s) => he.decode((s || '').trim());
const M = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };
const isoFromShort = (s) => { const [d, m, y] = s.trim().split(/\s+/); return `${y}-${M[m]}-${d}`; };

// ---------- Articles
const articles = [];
const cardImages = {}; // images utilisées dans les listes (fallback quand pas d'image dans l'article)
for (const list of ['actualites.html', 'blog.html', 'index.html']) {
  const h = read(list);
  for (const m of h.matchAll(/<img src="([^"]+)"[^>]*alt="([^"]*)"/g)) cardImages[dec(m[2])] = fixUrl(m[1]);
}
for (const f of fs.readdirSync(SITE).filter((x) => x.startsWith('articles_'))) {
  const h = read(f);
  const slug = f.replace(/^articles_/, '').replace(/\.html$/, '');


  const badge = dec(h.match(/text-transform:uppercase">\s*([^<]+?)\s*<\/span>/)[1]);
  const type = { 'Actualité': 'actualite', Blog: 'blog', 'Bon Plan': 'bon_plan' }[badge];
  const title = dec(h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)[1]);
  const date = h.match(/<span style="font-size:13px;color:var\(--gray\)">([^<]+)<\/span>/);
  const author = h.match(/Par <strong[^>]*>([^<]+)<\/strong>/);
  const img = h.match(/<!-- Image -->\s*<div[^>]*>\s*<img src="([^"]+)"/);
  const content = h.match(/<!-- Contenu -->\s*<div[^>]*>([\s\S]*?)\n    <\/div>/)[1];
  articles.push({
    slug, type, badge, title,
    published_at: date ? isoFromShort(date[1]) : null,
    author: author ? dec(author[1]) : null,
    image: img ? fixUrl(img[1]) : null,
    card_image: img ? fixUrl(img[1]) : (cardImages[title] || null),
    content: dec(content.replace(/<br \/>/g, '')),
    category: '',
  });
}
// Bons plans : affiches ZenCard (certaines n'ont pas de page détail publique)
{
  const h = read('bons-plans.html');
  let order = 0;
  for (const m of h.matchAll(/data-cat="([^"]*)"[\s\S]*?openAffiche\('([^']+)','([^']+)'\)/g)) {
    const [, cat, img, rawTitle] = m; const title = dec(rawTitle); order++;
    let a = articles.find((x) => x.title === title);
    if (!a) {
      const base = path.basename(img).replace(/[._]/g, '-').toLowerCase();
      a = { slug: `zencard-kapi-${base}`, type: 'bon_plan', badge: 'Bon Plan', title, published_at: '2026-03-31', author: 'Super Admin', image: fixUrl(img), card_image: fixUrl(img), content: '<p>Consultez notre affiche ZenCard pour tous les détails de cette offre.</p>', category: '' };
      articles.push(a);
    }
    a.category = cat; a.position = order;
  }
  for (const a of articles) if (a.type === 'bon_plan' && a.position == null) a.position = ++order;
}

// ---------- Produits
const produits = [];
{
  const list = read('nos-produits.html');
  let pos = 0;
  for (const m of list.matchAll(/href="https:\/\/kapiconsult\.tg\/nos-produits\/([^"]+)"/g)) {
    const slug = m[1]; pos++;
    const h = read(`nos-produits_${slug}.html`);
    const ld = JSON.parse(h.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    const prod = ld['@graph'].find((g) => g['@type'] === 'Product');
    const contact = h.match(/Pour commander ou en savoir plus :<\/div>\s*<div[^>]*>📞 ([^<]+)<\/div>\s*<div[^>]*>✉️ ([^<]+)<\/div>/);
    produits.push({
      slug, position: pos,
      categorie: dec(h.match(/letter-spacing:1px;margin-bottom:10px">([^<]+)<\/div>/)[1]),
      nom: dec(h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)[1]),
      description: dec(h.match(/line-height:1\.8;margin-bottom:28px">([\s\S]*?)<\/div>/)[1]),
      image: fixUrl(prod.image),
      prix: prod.offers ? Number(prod.offers.price) : null,
      contact_tel: contact ? dec(contact[1]) : null,
      contact_email: contact ? dec(contact[2]) : null,
    });
  }
}

// ---------- Offres d'emploi
const offres = [];
{
  const h = read('offres.html');
  for (const m of h.matchAll(/<div class="offre-card[^"]*">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/g)) {
    const b = m[1];
    const metas = [...b.matchAll(/<span>([^<]+)<\/span>/g)].map((x) => dec(x[1]));
    const deadline = b.match(/(?:Expirée le|Date limite :?|jusqu'au) ([0-9]{2} \w{3} [0-9]{4})/);
    offres.push({
      titre: dec(b.match(/offre-title">([\s\S]*?)<\/div>/)[1]),
      type_contrat: dec(b.match(/tag tag-blue">([^<]+)</)[1]),
      lieu: metas.find((x) => x.startsWith('📍')).replace('📍 ', ''),
      experience: (metas.find((x) => x.startsWith('⏱')) || '').replace('⏱ ', '') || null,
      published_at: isoFromShort(metas.find((x) => x.startsWith('📅')).replace('📅 Publié le ', '')),
      date_limite: deadline ? isoFromShort(deadline[1]) : null,
    });
  }
}

// ---------- FAQ
const faqs = [];
{
  const h = read('faq.html');
  const main = h.slice(h.indexOf('<main>'), h.indexOf('</main>'));
  const re = /<h2[^>]*border-bottom:2px solid var\(--gold\)">([^<]+)<\/h2>|<span style="font-size:15px;font-weight:600;color:var\(--blue-deep\);line-height:1\.4">([\s\S]*?)<\/span>[\s\S]*?line-height:1\.8;padding-top:4px;border-top:1px solid #F0F2F8">([\s\S]*?)<\/div>/g;
  let cat = null; let pos = 0;
  for (const m of main.matchAll(re)) {
    if (m[1]) { cat = dec(m[1]); continue; }
    faqs.push({ categorie: cat, question: dec(m[2]), reponse: dec(m[3]), position: ++pos });
  }
}

const out = { articles, produits, offres, faqs };
fs.writeFileSync('C:/Users/HP/OneDrive/Bureau/Kapiconsult/backend/src/db/seed-data.json', JSON.stringify(out, null, 2));
console.log({ articles: articles.length, produits: produits.length, offres: offres.length, faqs: faqs.length });
console.log(articles.map((a) => [a.type, a.badge, a.category, a.published_at, a.title, !!a.image, a.card_image]));
