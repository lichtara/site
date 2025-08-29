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
- Workflow: copia `assets` e páginas principais para `dist/`, inclui `CNAME` (se existir), gera `contrato-do-sim.pdf` e publica
- Em Settings → Pages, confirme “Build and deployment → GitHub Actions”

Rotas úteis
- Página: `/contrato-do-sim.html` → publicado como `https://<user>.github.io/<repo>/contrato-do-sim.html`
- Dica: adicione um `pages/index.html` (publicado como `/index.html`) se quiser uma home com links

Sitemap e Robots
- `sitemap.xml` é gerado por `scripts/make-sitemap.mjs` após o build (postbuild) e evita duplicar caminhos de `pages/` quando existe versão na raiz.
- `robots.txt` é gerado dinamicamente por `scripts/make-robots.mjs` com base em `CNAME` ou `GITHUB_REPOSITORY` (não manter um `robots.txt` estático no repositório).
- Canonical e OG/Twitter (inclui og:type, og:title/description e twitter:title/description) são ajustados para páginas raiz e docs por `scripts/fix-urls.mjs` no postbuild.

## Publicação & Releases

- Deploy (GitHub Pages): qualquer `push` na branch `main` dispara o workflow e publica o site em Pages.
- Release com PDF: criar uma tag no formato `v*` (ex.: `v1.0.0`) dispara a criação de uma Release e anexa automaticamente `dist/contrato-do-sim.pdf`.

### Exemplos

```bash
# publicar alterações no portal
git add -A
git commit -m "Atualiza Contrato do Sim e manifesto"
git push origin main

# criar uma release v1.0.0 com PDF anexo
git tag v1.0.0
git push origin v1.0.0
```

> Observações:
>
> - O workflow gera `dist/contrato-do-sim.pdf` e `dist/assets/insignia.png` (1080×1080) durante `npm run pdf`.
> - `sitemap.xml` e `robots.txt` são gerados dinamicamente no pós-build (CNAME ou subpath detectado automaticamente).
## Estrutura do Repositório

```

.
├── pages/                  # Páginas HTML do portal (contrato-do-sim.html, index.html, etc.)
├── assets/                 # Arquivos estáticos (insignia-do-sim.svg, imagens, ícones)
├── docs/                   # Documentos-fonte em Markdown (ex.: manifesto.md)
├── scripts/                # Scripts de build e automação (make-pdf, render-insignia, md-to-html, etc.)
├── dist/                   # Saída gerada pelo build (publicada em GitHub Pages)
├── .github/workflows/      # Workflows CI/CD (deploy Pages + Releases)
├── .vscode/                # Configurações para Visual Studio Code (tasks, format, etc.)
├── package.json            # Scripts npm + dependências de build
└── README.md               # Documentação principal

```

> Observações:
> - `dist/` não é versionado: é gerado a cada `npm run build` ou no CI.  
> - Os scripts em `scripts/` cuidam de: conversão de Markdown → HTML, geração de PDF/PNG, sitemap e robots dinâmicos.  
> - O fluxo de publicação lê `assets/`, páginas principais de `pages/` e `docs/` para compor o `dist/`.  

## Comandos Úteis

```bash
# Pré-visualizar o site localmente (http://localhost:4173)
npm run dev

# Build estático para dist/ (gera páginas, manifesto, sitemap, robots, etc.)
npm run build

# Gerar PDF cerimonial e PNG da insígnia (executa após build)
npm run pdf

# Converter manualmente Markdown → HTML (docs/ → dist/docs/)
npm run md
```

---

## Troubleshooting (GitHub Pages)

- 404 no domínio customizado (CNAME):
  Confirme em Settings → Pages que “Custom domain” está definido (ex.: `lichtara.com`) e que o DNS aponta corretamente.

- Sitemap/robots não refletem domínio certo:
  O build detecta automaticamente. Se mudar entre CNAME e subpath (`usuario.github.io/repo`), rode `npm run build` novamente.

- Página em branco após deploy:
  Verifique se os caminhos são relativos (`./`) e não absolutos (`/`). O workflow ajusta canonical/OG, mas links internos devem ser relativos.

- PDF não aparece na Release:
  Certifique-se de criar uma tag no formato `v*` (ex.: `v1.0.0`). Isso dispara o job que anexa `dist/contrato-do-sim.pdf`.
