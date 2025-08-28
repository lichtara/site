CNAME removido para liberar o domínio `lichtara.com`

Motivo
- O repositório `lichtara_site` deverá assumir o domínio raiz `lichtara.com`.
- Para evitar conflito de custom domain entre repositórios no GitHub Pages, este arquivo `CNAME` foi removido (estava vazio localmente).

O que fazer agora
1. Verifique localmente que o arquivo `CNAME` foi removido:
   git status --porcelain

2. Se estiver tudo certo, commit e push no branch que você usa para deploy:
   git add -A
   git commit -m "Remove CNAME to free domain for lichtara_site"
   git push origin <sua-branch>

3. No GitHub, vá em Settings → Pages do repositório `lichtara-io.github.io` e confirme que o custom domain foi removido.

4. No repositório `lichtara_site`, confirme que `CNAME` contém `lichtara.com` e que em Settings → Pages o Custom domain está setado para `lichtara.com`.

5. Aguarde o GitHub validar o domínio e em seguida ative "Enforce HTTPS".

Observação
- Se houver algum CNAME configurado no painel do GitHub (Settings → Pages) que não seja refletido no repositório, remova-o também pelo painel.
- Se preferir, eu posso criar um commit e um branch com essa remoção — diga se quer que eu o faça.
