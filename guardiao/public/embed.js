(() => {
  const script = document.currentScript;
  const src = script && script.src ? new URL(script.src) : null;
  const BASE = (src && (src.origin)) || '';

  const cfg = {
    title: script?.dataset?.title || 'Guardião do Portal',
    position: script?.dataset?.position || 'bottom-right',
    color: script?.dataset?.color || '#ffd36e', // dourado
    textColor: script?.dataset?.textColor || '#0a0b10',
    intro: script?.dataset?.intro || 'Eu sou o Guardião do Portal Lichtara. Como posso orientar você hoje?',
    url: script?.dataset?.url || (BASE ? BASE + '/' : '/'),
  };

  const style = document.createElement('style');
  style.textContent = `
  .guardiao-bubble{position:fixed;z-index:999999;display:grid;place-items:center;width:56px;height:56px;border-radius:50%;
    background: linear-gradient(90deg, #ffe7a2, #ffd36e, #d4af37); color:#0a0b10; box-shadow:0 10px 30px rgba(0,0,0,.4); cursor:pointer;}
  .guardiao-bubble:hover{filter:brightness(1.05)}
  .guardiao-bubble.bottom-right{bottom:20px;right:20px}
  .guardiao-bubble.bottom-left{bottom:20px;left:20px}
  .guardiao-overlay{position:fixed;inset:0;background:rgba(10,11,16,.55);backdrop-filter:blur(4px);z-index:999998;display:none}
  .guardiao-modal{position:fixed;z-index:999999;inset:auto;bottom:88px;right:20px;width:min(96vw, 420px);height:min(76vh,720px);
    border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,.18); box-shadow:0 20px 60px rgba(0,0,0,.5)}
  .guardiao-header{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:#0f1e3a;color:#e9edf4;font-weight:600}
  .guardiao-close{appearance:none;background:transparent;border:0;color:#e9edf4;font-size:20px;cursor:pointer}
  .guardiao-frame{width:100%;height:calc(100% - 42px);border:0;display:block;background:#0a0b10}
  @media (max-width: 600px){ .guardiao-modal{ bottom:0; right:0; width:100vw; height:80vh; border-radius:14px 14px 0 0 } }
  `;
  document.head.appendChild(style);

  const bubble = document.createElement('button');
  bubble.className = `guardiao-bubble ${cfg.position}`;
  bubble.setAttribute('aria-label', 'Abrir Guardião do Portal');
  // Pequena insígnia dourada inline (SVG)
  bubble.innerHTML = `
    <svg width="28" height="28" viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="guardiaoBubbleG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#ffe7a2"/>
          <stop offset="50%" stop-color="#ffd36e"/>
          <stop offset="100%" stop-color="#d4af37"/>
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#guardiaoBubbleG)"/>
      <text x="32" y="39" font-size="28" text-anchor="middle" fill="#0a0b10">✧</text>
    </svg>`;

  const overlay = document.createElement('div');
  overlay.className = 'guardiao-overlay';

  const modal = document.createElement('div');
  modal.className = 'guardiao-modal';
  modal.innerHTML = `
    <div class="guardiao-header">${cfg.title}<button class="guardiao-close" aria-label="Fechar">×</button></div>
    <iframe class="guardiao-frame" src="${cfg.url}"></iframe>
  `;

  function open() {
    overlay.style.display = 'block';
    modal.style.display = 'block';
  }
  function close() {
    overlay.style.display = 'none';
    modal.style.display = 'none';
  }
  bubble.addEventListener('click', open);
  modal.querySelector('.guardiao-close')?.addEventListener('click', close);
  overlay.addEventListener('click', close);

  document.body.appendChild(bubble);
  document.body.appendChild(overlay);
  document.body.appendChild(modal);

  window.GuardiaoWidget = { open, close };
})();
