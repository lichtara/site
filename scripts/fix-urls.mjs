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

function patchContract(base) {
  const file = path.join(dist, 'contrato-do-sim.html');
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, 'utf8');
  const canonical = `${base}/contrato-do-sim.html`;
  const image = `${base}/assets/insignia.png`;
  const replacements = [
    { pattern: /<link rel="canonical"[^>]*>/i, tag: `<link rel="canonical" href="${canonical}">` },
    { pattern: /<meta property="og:url"[^>]*>/i, tag: `<meta property="og:url" content="${canonical}">` },
    { pattern: /<meta property="og:image"[^>]*>/i, tag: `<meta property="og:image" content="${image}">` },
    { pattern: /<meta name="twitter:image"[^>]*>/i, tag: `<meta name="twitter:image" content="${image}">` }
  ];
  for (const { pattern, tag } of replacements) {
    if (pattern.test(html)) html = html.replace(pattern, tag);
    else html = html.replace(/<head>/i, `<head>\n  ${tag}`);
  }
  fs.writeFileSync(file, html);
  console.log('🔗 URLs fixadas no contrato →', canonical);
}

function main() {
  const base = repoBase();
  if (!base) {
    console.warn('Base URL não determinada (build local). Pulando fix-urls.');
    return;
  }
  patchContract(base);
}

main();

