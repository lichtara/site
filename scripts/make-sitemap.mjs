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
  if (!p.startsWith('/')) p = '/' + p;
  return base + p;
}

function collectHtmlFiles(dir, root = dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...collectHtmlFiles(full, root));
    else if (entry.isFile() && entry.name.endsWith('.html')) out.push(path.relative(root, full));
  }
  return out;
}

function main() {
  if (!fs.existsSync(dist)) fs.mkdirSync(dist, { recursive: true });
  let files = [];
  try { files = collectHtmlFiles(dist); } catch {}

  // Excluir 404.html e quaisquer arquivos ocultos
  files = files.filter(f => f !== '404.html' && !f.startsWith('.'));

  // Garantir entradas principais mesmo se não houve varredura
  const baseline = ['index.html', 'contrato-do-sim.html', 'pages/contrato-do-sim.html'];
  for (const b of baseline) if (!files.includes(b) && fs.existsSync(path.join(dist, b))) files.push(b);

  const urls = files.map((p) => ({ loc: urlFor(p), lastmod: now }));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map(u => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n  </url>`).join('\n') +
    (urls.length ? '\n' : '') +
    `</urlset>\n`;

  fs.writeFileSync(path.join(dist, 'sitemap.xml'), xml);
  console.log('✅ sitemap.xml gerado com', urls.length, 'entradas');
}

main();
