// scripts/render-insignia.mjs
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '..', 'dist', 'assets');
const OUT = path.join(OUT_DIR, 'insignia.png');

// HTML minimalista para render fiel do SVG inline (fundo transparente)
const html = (svg) => `<!doctype html>
<meta charset="utf-8">
<style>
  html,body{margin:0;padding:0;background:transparent}
  .stage{width:1080px;height:1080px;display:grid;place-items:center;background:transparent}
  svg{width:90vmin;height:90vmin;max-width:920px;max-height:920px}
  /* opcional: reduzir/glow consistente pode requerer filtros alinhados ao SVG */
</style>
<div class="stage">${svg}</div>`;

// lê o SVG inline já presente na página do contrato (ou do arquivo original)
async function extractInlineSVG() {
  const pagePath = path.resolve(__dirname, '..', 'dist', 'contrato-do-sim.html');
  try {
    const htmlPage = await fs.readFile(pagePath, 'utf-8');
    const match = htmlPage.match(/<svg[\s\S]*?<\/svg>/i);
    if (match) return match[0];
  } catch {}
  // fallback: pegar do arquivo em assets
  const svgPath = path.resolve(__dirname, '..', 'dist', 'assets', 'insignia-do-sim.svg');
  return fs.readFile(svgPath, 'utf-8');
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const svg = await extractInlineSVG();
  const pageHTML = html(svg);

  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 1 });
  await page.setContent(pageHTML, { waitUntil: 'networkidle0' });

  // screenshot direto da página (1080x1080, fundo transparente)
  const buf = await page.screenshot({ type: 'png', omitBackground: true });
  await browser.close();

  await fs.writeFile(OUT, buf);
  console.log('Insígnia PNG 1080×1080 →', OUT);
}

main();

