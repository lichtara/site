// scripts/md-to-html.mjs
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SRC = path.resolve(__dirname, '..', 'docs', 'manifesto.md');
const OUT_DIR = path.resolve(__dirname, '..', 'dist', 'docs');
const OUT = path.join(OUT_DIR, 'manifesto.html');

// simples template coeso com a identidade da página
const wrap = (title, body) => `<!doctype html>
<html lang="pt-BR">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22><circle cx=%2232%22 cy=%2232%22 r=%2230%22 fill=%22%230f1e3a%22/><text x=%2232%22 y=%2239%22 font-size=%2230%22 text-anchor=%22middle%22 fill=%22%23ffd36e%22>✧</text></svg>">
<style>
  body{margin:0;background:
    radial-gradient(1200px 800px at 20% 10%,#1f2f64 0%,transparent 60%),
    radial-gradient(900px 700px at 80% 85%,#091229 0%,transparent 60%),
    radial-gradient(1200px 1200px at 50% 50%,#0f1e3a 0%,#0a0b10 65%);
    color:#e9edf4;font:16px/1.6 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif}
  .wrap{max-width:820px;margin:0 auto;padding:28px 20px 60px}
  .card{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.18);
        border-radius:20px;padding:clamp(18px,4vmin,40px);
        box-shadow:0 20px 60px rgba(0,0,0,.45), inset 0 0 0 1px rgba(255,255,255,.06)}
  h1,h2,h3{margin:12px 0}
  a{color:#b9ccff}
  @page{ size:A4; margin:14mm }
</style>
<div class="wrap">
  <article class="card">
    ${body}
  </article>
</div>
</html>`;

async function main() {
  try {
    const md = await fs.readFile(SRC, 'utf-8');
    const html = marked.parse(md);
    await fs.mkdir(OUT_DIR, { recursive: true });
    await fs.writeFile(OUT, wrap('Manifesto Lichtara', html), 'utf-8');
    console.log('Manifesto HTML →', OUT);
  } catch (e) {
    console.warn('Manifesto não encontrado (ok para stub).', e.message);
  }
}
main();

