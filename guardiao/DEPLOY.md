Guardião do Portal — Deploy (portal.lichtara.com)
=================================================

Requisitos
- Domínio: `portal.lichtara.com` apontando para seu servidor (A/AAAA) ou PaaS (CNAME).
- Node.js LTS ≥ 18
- Certificado TLS (Let’s Encrypt, Caddy, Nginx + certbot)

1) Código e ambiente
```bash
git clone <repo>
cd guardiao
npm ci
cp .env.example .env
```

Edite `.env` (veja também .env.example):
```
$1REDACTED
ASSISTANT_ID=your-assistant-id-here
PORT=8787
CORS_ORIGIN=https://lichtara.com, https://portal.lichtara.com
LOG_LEVEL=info
FRAME_ANCESTORS=https://lichtara.com https://*.lichtara.com

# Rate limits (ajuste conforme demanda)
API_RATE=100
RUN_RATE=20
STREAM_RATE=30
MSG_RATE=60
API_WINDOW_MS=60000
RUN_WINDOW_MS=60000
STREAM_WINDOW_MS=60000
MSG_WINDOW_MS=60000
```

2) Processo (PM2)
```bash
pm2 start server.js --name guardiao --cwd $(pwd) --update-env
pm2 save
pm2 startup  # opcional, para boot automático
```

3) Nginx (reverse proxy + SSE)
Exemplo de server block `/etc/nginx/sites-available/portal.lichtara.com`:

```
server {
  listen 443 ssl http2;
  server_name portal.lichtara.com;

  # Certificados (ajuste caminhos)
  ssl_certificate     /etc/letsencrypt/live/portal.lichtara.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/portal.lichtara.com/privkey.pem;

  # Conteúdo estático e API do Guardião
  location / {
    proxy_pass http://127.0.0.1:8787;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    # SSE
    proxy_buffering off;
    proxy_set_header Connection '';
    add_header Cache-Control 'no-cache';
  }

  # Tuning opcional para gzip (evitar em SSE)
  gzip on;
  gzip_types text/plain text/css application/json application/javascript;
}

server {
  listen 80;
  server_name portal.lichtara.com;
  return 301 https://$host$request_uri;
}
```

Teste e aplique:
```bash
sudo nginx -t && sudo systemctl reload nginx
```

4) Verificação
- Abra `https://portal.lichtara.com/` → deve carregar a UI do chat.
- `https://portal.lichtara.com/embed.js` → retorna o script do widget.
- No site público (`lichtara.com`), o botão “Fale com o Guardião” abre o modal (ou nova aba de fallback).

Notas
- O backend define CORS de forma restrita via `CORS_ORIGIN`.
- CSP usa `frame-ancestors` para permitir incorporação a partir do Portal. Ajuste `FRAME_ANCESTORS` se necessário.
- Referrer-Policy é `strict-origin-when-cross-origin`; Permissions-Policy desabilita APIs não usadas.
- Se usar Caddy/Traefik, mantenha `proxy_buffering off` (ou equivalente) e HTTP/1.1 para SSE.

Se quiser reforçar via Nginx (além do app), acrescente no `server {}`:

```
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "accelerometer=(), autoplay=(), camera=(), clipboard-read=(), clipboard-write=(), encrypted-media=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), usb=(), screen-wake-lock=(), xr-spatial-tracking=(), browsing-topics=(), fullscreen=(self)" always;
```

### Rate limiting (opcional, recomendado)

No bloco `http {}` global do Nginx, adicione zonas:

```
limit_req_zone $binary_remote_addr zone=guardiao:10m rate=30r/m;
limit_req_zone $binary_remote_addr zone=guardiao_run:10m rate=20r/m;
```

E no `server {}` de `portal.lichtara.com`, limite `/api/` e `/api/run`:

```
location /api/ {
  proxy_pass http://127.0.0.1:8787;
  proxy_http_version 1.1;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
  limit_req zone=guardiao burst=15 nodelay;
}

location = /api/run {
  proxy_pass http://127.0.0.1:8787;
  proxy_http_version 1.1;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
  limit_req zone=guardiao_run burst=10 nodelay;
}
```

## Segurança (recomendado)

1) Nunca commitar segredos reais
- Use `guardiao/.env.example` como base e mantenha apenas placeholders.
- Gere `.env` a partir de cofres (1Password opcional) e garanta `.env` no `.gitignore` (já configurado).

2) 1Password (opcional)
- Preencha `guardiao/.env.op` baseando-se em `guardiao/.env.op.example` (formato `op://Vault/Item/Field`).
- Exporte `.env` automaticamente:
```
cd guardiao
./scripts/op-export.sh --from .env.op --out .env
```

3) Varredura de segredos (local)
- Instale o hook de pre-commit e rode o scanner manualmente quando quiser:
```
git config core.hooksPath .githooks
scripts/scan-secrets.sh
```
- O hook usa `gitleaks protect --staged` com configuração em `.gitleaks.toml`.

4) CI — proteção no repositório
- Já há workflow: `.github/workflows/secret-scan.yml` (Gitleaks) em `push` e `PR`.
- Em GitHub → Settings → Security, habilite (se disponível):
  - Secret scanning e Push Protection
  - Branch protection para `main` (exigir status checks + reviews)

5) Rotação de credenciais (se detectar vazamento)
- Revogar/imediatamente rotacionar: OpenAI, Stripe, Google, Notion, HF, GitHub PAT, NPM, Terraform, Sentry.
- Reescrever histórico com `git filter-repo`/`filter-branch`, forçar push e notificar a equipe para resetar locais (`git reset --hard`).
