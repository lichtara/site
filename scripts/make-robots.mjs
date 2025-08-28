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

function main() {
  if (!fs.existsSync(dist)) fs.mkdirSync(dist, { recursive: true });
  const base = repoBase() || '/';
  const sitemapUrl = (base.endsWith('/') ? base.slice(0, -1) : base) + '/sitemap.xml';
  const content = `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`;
  fs.writeFileSync(path.join(dist, 'robots.txt'), content);
  console.log('✅ robots.txt gerado →', sitemapUrl);
}

main();

