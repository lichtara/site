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

Edite `.env`:
```
$1REDACTED
ASSISTANT_ID=asst_gf4vd6gvNDXuX3u6qu1KWTJ5
PORT=8787
CORS_ORIGIN=https://lichtara.com, https://portal.lichtara.com
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
- Se usar Caddy/Traefik, mantenha `proxy_buffering off` (ou equivalente) e HTTP/1.1 para SSE.

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

