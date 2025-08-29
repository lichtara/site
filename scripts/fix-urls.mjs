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

function textFromTag(html, tag) {
  const m = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i').exec(html);
  return m ? m[1].trim().replace(/\s+/g, ' ') : '';
}

function metaContent(html, name) {
  const m = new RegExp(`<meta[^>]+name=[\"']${name}[\"'][^>]+content=[\"']([^\"']*)[\"'][^>]*>`, 'i').exec(html);
  return m ? m[1].trim() : '';
}

function firstParagraph(html) {
  const m = /<p[^>]*>([\s\S]*?)<\/p>/i.exec(html);
  if (!m) return '';
  return m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function patchPage(base, fileRel, canonicalPath) {
  const file = path.join(dist, fileRel);
  if (!fs.existsSync(file)) return false;
  let html = fs.readFileSync(file, 'utf8');
  const canonical = canonicalPath.startsWith('/') ? `${base}${canonicalPath}` : `${base}/${canonicalPath}`;
  const image = `${base}/assets/insignia.png`;

  // Derivar título e descrição
  const h1 = textFromTag(html, 'h1');
  const titleTag = textFromTag(html, 'title');
  const descTag = metaContent(html, 'description');
  const title = (h1 || titleTag || 'Lichtara').slice(0, 140);
  const desc = (descTag || firstParagraph(html) || 'Lichtara — Portal vivo.').slice(0, 300);

  const items = [
    { pattern: /<link rel="canonical"[^>]*>/i, tag: `<link rel="canonical" href="${canonical}">` },
    { pattern: /<meta property="og:site_name"[^>]*>/i, tag: `<meta property="og:site_name" content="Lichtara">` },
    { pattern: /<meta property="og:type"[^>]*>/i, tag: `<meta property="og:type" content="website">` },
    { pattern: /<meta property="og:url"[^>]*>/i, tag: `<meta property="og:url" content="${canonical}">` },
    { pattern: /<meta property="og:title"[^>]*>/i, tag: `<meta property="og:title" content="${title}">` },
    { pattern: /<meta property="og:description"[^>]*>/i, tag: `<meta property="og:description" content="${desc}">` },
    { pattern: /<meta property="og:image"[^>]*>/i, tag: `<meta property="og:image" content="${image}">` },
    { pattern: /<meta name="twitter:card"[^>]*>/i, tag: `<meta name="twitter:card" content="summary_large_image">` },
    { pattern: /<meta name="twitter:title"[^>]*>/i, tag: `<meta name="twitter:title" content="${title}">` },
    { pattern: /<meta name="twitter:description"[^>]*>/i, tag: `<meta name="twitter:description" content="${desc}">` },
    { pattern: /<meta name="twitter:image"[^>]*>/i, tag: `<meta name="twitter:image" content="${image}">` }
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

  // Cobrir docs/: gerar canonicals/OG para todos .html
  const docsDir = path.join(dist, 'docs');
  if (fs.existsSync(docsDir)) {
    const stack = [''];
    while (stack.length) {
      const rel = stack.pop();
      const dir = path.join(docsDir, rel);
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.name.startsWith('.')) continue;
        const nextRel = path.join(rel, entry.name);
        if (entry.isDirectory()) stack.push(nextRel);
        else if (entry.isFile() && entry.name.endsWith('.html')) {
          const canon = '/docs/' + nextRel.replace(/\\/g, '/');
          patchPage(base, path.join('docs', nextRel), canon);
        }
      }
    }
  }
}

main();
