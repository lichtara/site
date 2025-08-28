Lichtara — Site estático (GitHub Pages)
======================================

Estrutura mínima para servir páginas estáticas via GitHub Pages, com tarefa local de preview, build simples, PDF cerimonial e workflow de deploy.

Estrutura
- `pages/contrato-do-sim.html`: página do Contrato do Sim (com SVG inline)
- `assets/insignia-do-sim.svg`: cópia do SVG (opcional)
- `.vscode/*`: formatação e tasks
- `scripts/make-pdf.mjs`: gera PDF a partir do HTML buildado
- `.github/workflows/pages.yml`: deploy automático para Pages

Uso local
- Pré-visualizar: `npm run dev` (porta 4173)
- Build estático: `npm run build` → saída em `dist/`
- Gerar PDF: `npm run build && npm run pdf` → `dist/contrato-do-sim.pdf`

Deploy (GitHub Pages)
- Push na `main` dispara o workflow
- Workflow: copia `pages` e `assets` para `dist/`, inclui `CNAME` (se existir), gera `contrato-do-sim.pdf` e publica
- Em Settings → Pages, confirme “Build and deployment → GitHub Actions”

Rotas úteis
- Página: `/pages/contrato-do-sim.html` → publicado como `https://<user>.github.io/<repo>/pages/contrato-do-sim.html`
- Dica: adicione um `pages/index.html` se quiser uma home com links
# site
