#!/usr/bin/env node
// Verifica headers de segurança de uma URL
// Uso: node scripts/check-security.mjs [url]

const target = process.argv[2] || process.env.URL || 'http://localhost:8787/';

const WANT = [
  'content-security-policy',
  'referrer-policy',
  'permissions-policy',
  'cross-origin-opener-policy',
  'cross-origin-resource-policy',
  'x-frame-options',
];

async function main() {
  try {
    const res = await fetch(target, { method: 'HEAD' });
    const headers = Object.fromEntries([...res.headers.entries()]);
    console.log('URL:', target);
    console.log('Status:', res.status);
    let ok = true;
    for (const h of WANT) {
      const v = headers[h];
      if (!v) {
        ok = false;
        console.log(`✖ ${h}: ausente`);
      } else {
        console.log(`✔ ${h}: ${v}`);
      }
    }
    if (!ok) process.exitCode = 2;
  } catch (e) {
    console.error('Erro ao verificar:', e.message || e);
    process.exitCode = 1;
  }
}

main();

