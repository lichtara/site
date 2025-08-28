import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const distDir = path.resolve(__dirname, '..', 'dist');
  const htmlPath = path.join(distDir, 'pages', 'contrato-do-sim.html');
  const pdfPath = path.join(distDir, 'contrato-do-sim.pdf');
  const pngDir = path.join(distDir, 'assets');
  const pngPath = path.join(pngDir, 'insignia.png');

  if (!fs.existsSync(htmlPath)) {
    console.error(`❌ HTML não encontrado em: ${htmlPath}. Rode 'npm run build' antes.`);
    process.exit(1);
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.emulateMediaType('print');

  const fileUrl = 'file://' + htmlPath;
  await page.goto(fileUrl, { waitUntil: 'load' });

  // Generate PDF
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: '14mm', right: '14mm', bottom: '14mm', left: '14mm' }
  });

  // Generate PNG of the insignia (1080x1080)
  await page.setViewport({ width: 1200, height: 1400, deviceScaleFactor: 1 });
  await page.waitForSelector('svg.seal', { timeout: 5000 });
  const el = await page.$('svg.seal');
  // Force the SVG to 1080x1080 for a precise export
  await page.evaluate(() => {
    const s = document.querySelector('svg.seal');
    if (s) {
      s.style.width = '1080px';
      s.style.height = '1080px';
    }
    window.scrollTo(0, 0);
  });
  if (!fs.existsSync(pngDir)) fs.mkdirSync(pngDir, { recursive: true });
  await el.screenshot({ path: pngPath, type: 'png' });

  await browser.close();
  console.log(`✅ PDF gerado em: ${pdfPath}`);
  console.log(`✅ PNG gerado em: ${pngPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
