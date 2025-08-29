import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');

function repoBase() {
  const cnamePath = path.resolve('CNAME');
  if (fs.existsSync(cnamePath)) {
    const domain = fs.readFileSync(cnamePath, 'utf8').trim();
    if (domain) return `https://${domain}`;
  }
  const repo = process.env.GITHUB_REPOSITORY || '';
  const [owner, name] = repo.split('/');
  if (owner && name) return `https://${owner}.github.io/${name}`;
  return '';
}

function insertTagFlex(html, tag) {
  if (/<head>/i.test(html)) return html.replace(/<head>/i, `<head>\n  ${tag}`);
  if (/{% head %}/i.test(html)) return html.replace(/{% head %}/i, `{% head %}\n  ${tag}`);
  if (/<\/title>/i.test(html)) return html.replace(/<\/title>/i, `</title>\n  ${tag}`);
  if (/<meta [^>]*charset/i.test(html)) return html.replace(/<meta [^>]*charset[^>]*>/i, (m) => `${m}\n  ${tag}`);
  return `${tag}\n${html}`;
}

function patchPage(base, fileRel, canonicalPath) {
  const file = path.join(dist, fileRel);
  if (!fs.existsSync(file)) return false;
  let html = fs.readFileSync(file, 'utf8');
  const canonical = canonicalPath.startsWith('/') ? `${base}${canonicalPath}` : `${base}/${canonicalPath}`;
  const image = `${base}/assets/insignia.png`;

  const items = [
    { pattern: /<link rel="canonical"[^>]*>/i, tag: `<link rel="canonical" href="${canonical}">` },
    { pattern: /<meta property="og:url"[^>]*>/i, tag: `<meta property="og:url" content="${canonical}">` },
    { pattern: /<meta property="og:image"[^>]*>/i, tag: `<meta property="og:image" content="${image}">` },
    { pattern: /<meta name="twitter:image"[^>]*>/i, tag: `<meta name="twitter:image" content="${image}">` },
    { pattern: /<meta name="twitter:card"[^>]*>/i, tag: `<meta name="twitter:card" content="summary_large_image">` }
  ];
  for (const { pattern, tag } of items) {
    if (pattern.test(html)) html = html.replace(pattern, tag);
    else html = insertTagFlex(html, tag);
  }
  fs.writeFileSync(file, html);
  console.log(`🔗 URLs fixadas → ${fileRel} → ${canonical}`);
  return true;
}

function main() {
  const base = repoBase();
  if (!base) {
    console.warn('Base URL não determinada (build local). Pulando fix-urls.');
    return;
  }
  const pages = [
    { file: 'contrato-do-sim.html', path: '/contrato-do-sim.html' },
    { file: 'index.html', path: '/index.html' },
    { file: 'governanca.html', path: '/governanca.html' },
    { file: 'formacao.html', path: '/formacao.html' },
    { file: 'organizacao.html', path: '/organizacao.html' }
  ];
  for (const p of pages) patchPage(base, p.file, p.path);
}

main();
