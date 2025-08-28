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

  await browser.close();
  console.log(`✅ PDF gerado em: ${pdfPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
