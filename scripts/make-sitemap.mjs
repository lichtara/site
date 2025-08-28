import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const now = new Date().toISOString();

function repoInfo() {
  const cnamePath = path.resolve('CNAME');
  if (fs.existsSync(cnamePath)) {
    const domain = fs.readFileSync(cnamePath, 'utf8').trim();
    return { base: `https://${domain}` };
  }
  const repo = process.env.GITHUB_REPOSITORY || '';
  const [owner, name] = repo.split('/');
  if (owner && name) return { base: `https://${owner}.github.io/${name}` };
  return { base: '' }; // local build fallback
}

function urlFor(p) {
  const { base } = repoInfo();
  if (!base) return p; // local path
  if (p.startsWith('/')) return base + p;
  return base + (p.startsWith('pages/') || p.startsWith('docs/') ? '/' + p : '/' + p);
}

function exists(p) {
  return fs.existsSync(path.join(dist, p.replace(/^\//, '')));
}

function main() {
  if (!fs.existsSync(dist)) fs.mkdirSync(dist, { recursive: true });

  const candidates = [
    '/index.html',
    '/contrato-do-sim.html',
    '/pages/contrato-do-sim.html',
    '/governanca.html',
    '/docs/manifesto.md',
    '/docs/manifesto.html'
  ];

  const urls = candidates.filter(exists).map((p) => ({ loc: urlFor(p), lastmod: now }));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map(u => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n  </url>`).join('\n') +
    (urls.length ? '\n' : '') +
    `</urlset>\n`;

  fs.writeFileSync(path.join(dist, 'sitemap.xml'), xml);
  console.log('✅ sitemap.xml gerado com', urls.length, 'entradas');
}

main();

