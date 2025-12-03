---
title: Lichtara Institute
layout: null
permalink: /
---

<!doctype html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Lichtara Institute</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #060812;
      --panel: #0b1020;
      --card: rgba(255, 255, 255, 0.04);
      --accent: #f2c14f;
      --accent-2: #2ad4ff;
      --text: #e7ecf9;
      --muted: #9aa3b5;
      --border: rgba(255, 255, 255, 0.08);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Space Grotesk', 'Helvetica Neue', Arial, sans-serif;
      background: radial-gradient(circle at 15% 20%, rgba(42, 212, 255, 0.12), transparent 35%),
                  radial-gradient(circle at 85% 10%, rgba(242, 193, 79, 0.12), transparent 35%),
                  linear-gradient(135deg, var(--bg), #050610 55%, #070b16 100%);
      color: var(--text);
      min-height: 100vh;
      line-height: 1.6;
      overflow-x: hidden;
    }

    .page {
      max-width: 1080px;
      margin: 0 auto;
      padding: 56px 24px 96px;
      position: relative;
      z-index: 1;
    }

    .hero {
      display: grid;
      gap: 20px;
      padding: 32px;
      background: linear-gradient(120deg, rgba(42, 212, 255, 0.08), rgba(242, 193, 79, 0.08));
      border: 1px solid var(--border);
      border-radius: 24px;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
      animation: floatIn 800ms ease;
    }

    .eyebrow {
      letter-spacing: 0.14em;
      text-transform: uppercase;
      font-size: 12px;
      color: var(--muted);
    }

    h1 {
      font-size: clamp(32px, 6vw, 52px);
      line-height: 1.1;
      font-weight: 600;
    }

    .lede {
      font-size: 18px;
      color: #c8d1e6;
      max-width: 720px;
    }

    .actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 8px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 12px 18px;
      border-radius: 999px;
      font-weight: 600;
      letter-spacing: 0.01em;
      text-decoration: none;
      transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease, color 180ms ease;
      border: 1px solid transparent;
    }

    .btn.primary {
      background: linear-gradient(120deg, var(--accent), #ff9f3c);
      color: #0a0a0a;
      box-shadow: 0 16px 40px rgba(242, 193, 79, 0.35);
    }

    .btn.ghost {
      background: transparent;
      color: var(--text);
      border-color: var(--border);
    }

    .btn:hover {
      transform: translateY(-1px) scale(1.01);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
    }

    .pillars {
      margin-top: 40px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
    }

    .card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 20px;
      position: relative;
      overflow: hidden;
    }

    .card::before {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(145deg, rgba(42, 212, 255, 0.08), rgba(242, 193, 79, 0.08));
      opacity: 0;
      transition: opacity 200ms ease;
      pointer-events: none;
    }

    .card:hover::before {
      opacity: 1;
    }

    .card h3 {
      font-size: 18px;
      margin-bottom: 10px;
    }

    .card p {
      color: var(--muted);
      font-size: 15px;
    }

    .programs {
      margin-top: 48px;
      padding: 32px;
      background: var(--panel);
      border-radius: 24px;
      border: 1px solid var(--border);
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.02);
    }

    .section-title {
      font-size: 22px;
      margin-bottom: 8px;
    }

    .section-subtitle {
      color: var(--muted);
      margin-bottom: 24px;
    }

    .program-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 16px;
    }

    .pill {
      display: inline-block;
      padding: 6px 10px;
      border-radius: 999px;
      background: rgba(42, 212, 255, 0.12);
      color: #b4ecff;
      font-size: 12px;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      margin-bottom: 10px;
    }

    .contact {
      margin-top: 48px;
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: 24px;
      align-items: center;
      padding: 28px;
      border: 1px solid var(--border);
      border-radius: 20px;
      background: linear-gradient(120deg, rgba(242, 193, 79, 0.1), rgba(42, 212, 255, 0.05));
    }

    .contact-details {
      color: var(--muted);
    }

    .contact a {
      color: var(--text);
    }

    .note {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid var(--border);
      color: var(--muted);
      font-size: 14px;
    }

    footer {
      margin-top: 32px;
      color: var(--muted);
      font-size: 13px;
      text-align: center;
    }

    @keyframes floatIn {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 720px) {
      .page { padding: 32px 20px 72px; }
      .hero { padding: 24px; }
      .contact { grid-template-columns: 1fr; padding: 22px; }
    }
  </style>
</head>
<body>
  <main class="page">
    <header class="hero">
      <p class="eyebrow">Lichtara Institute</p>
      <h1>Uma casa para luz, arte e ciencia em equilibrio.</h1>
      <p class="lede">Criamos experiencias que juntam pesquisa, criatividade e tecnologia para reacender curiosidade, bem-estar e conexao humana.</p>
      <div class="actions">
        <a class="btn primary" href="mailto:hello@lichtara.com">Fale com a gente</a>
        <a class="btn ghost" href="#programas">Explorar programas</a>
      </div>
    </header>

    <section class="pillars" aria-label="Pilares da Lichtara">
      <div class="card">
        <div class="pill">Pesquisa</div>
        <h3>Laboratorios vivos</h3>
        <p>Prototipamos experiencias de luz, som e materia para testar o impacto em bem-estar e performance criativa.</p>
      </div>
      <div class="card">
        <div class="pill">Educacao</div>
        <h3>Aprendizado imersivo</h3>
        <p>Programas curtos que combinam ciencia, arte e pratica corporal para formar liderancas mais conscientes.</p>
      </div>
      <div class="card">
        <div class="pill">Comunidade</div>
        <h3>Encontros ao redor da fogueira</h3>
        <p>Eventos, residencias e conversas para conectar pessoas que buscam construir futuro com mais sentido.</p>
      </div>
    </section>

    <section class="programs" id="programas">
      <h2 class="section-title">O que estamos ativando agora</h2>
      <p class="section-subtitle">Primeiros formatos para experimentar com parceiros e amigos da casa.</p>
      <div class="program-list">
        <div class="card">
          <h3>Residencias de luz</h3>
          <p>Imersoes de 3 a 7 dias para coletivos criativos, com modulos de biofeedback, som e exploracao de materiais luminosos.</p>
        </div>
        <div class="card">
          <h3>Clinicas de bem-estar</h3>
          <p>Sessoes guiadas que combinam protocolos de ciencia do sono, respiracao e luz para times que querem recarregar energia.</p>
        </div>
        <div class="card">
          <h3>Instalacoes itinerantes</h3>
          <p>Pequenas obras sensoriais que podem viajar para festivais, centros culturais ou empresas como experiencias pop-up.</p>
        </div>
      </div>
    </section>

    <section class="contact" id="contato">
      <div>
        <h2 class="section-title">Vamos construir juntos</h2>
        <p class="contact-details">Convites, ideias ou curiosidade: adoramos trocas honestas. Envie um email ou marque um cafe.</p>
        <div class="actions" style="margin-top: 14px;">
          <a class="btn primary" href="mailto:hello@lichtara.com">hello@lichtara.com</a>
          <a class="btn ghost" href="https://cal.com/" target="_blank" rel="noopener">Marcar conversa</a>
        </div>
      </div>
      <div class="note">
        <span>Base em Porto, viagens frequentes.</span>
      </div>
    </section>

    <footer>
      <span>&copy; Lichtara Institute — prototipos e experimentos em curso.</span>
    </footer>
  </main>
</body>
</html>
