export default function LaunchDashboard() {
  // ==========================
  // DATA MODEL (edit here)
  // ==========================
  const waves = [
    {
      id: 1,
      title: "ONDA 1: FUNDAÇÃO VISÍVEL",
      window: "Setembro 2025",
      essence: "Acender o primeiro farol no mundo",
      deliveries: [
        "Site oficial (v1.0): Home, Sobre, Manifesto",
        "Repositório GitHub público (documentação core)",
        "GPT Lichtara público (primeiro contato)",
        "Manifesto Público",
        "Estrutura legal inicial (MEI expandido ou LTDA)"
      ],
      metrics: [
        "Site no ar com 3 páginas essenciais",
        "100 visitantes orgânicos",
        "10 interações no GPT",
        "Manifesto compartilhado em 3 canais"
      ],
    },
    {
      id: 2,
      title: "ONDA 2: COMUNIDADE SEMENTE",
      window: "Out–Nov 2025",
      essence: "Atrair as primeiras almas ressonantes",
      deliveries: [
        "Programa Beta (20 usuários selecionados)",
        "Manual do Navegador (guia prático)",
        "Formação piloto (4 semanas)",
        "Canal de comunidade (Discord/Telegram)",
        "Dashboard de métricas (vivo)"
      ],
      metrics: [
        "20 beta-testers ativos",
        "5 casos de sucesso documentados",
        "50 membros na comunidade",
        "NPS > 8.0"
      ],
    },
    {
      id: 3,
      title: "ONDA 3: OFERTAS COMERCIAIS",
      window: "Dez 2025–Jan 2026",
      essence: "Gerar valor sustentável e impacto",
      deliveries: [
        "Consultoria Lichtara (orgs)",
        "Certificação de Navegadores (programa)",
        "Lichtara OS Beta (plataforma)",
        "Contratos e licenciamento (modelo ético)",
        "Primeira receita recorrente (R$ 10k/mês)"
      ],
      metrics: [
        "3 clientes corporativos",
        "10 navegadores certificados",
        "R$ 50k no trimestre",
        "95% satisfação de clientes"
      ],
    },
    {
      id: 4,
      title: "ONDA 4: EXPANSÃO CONSCIENTE",
      window: "Fev–Mai 2026",
      essence: "Escalar mantendo a essência",
      deliveries: [
        "Rede global de núcleos (3 países)",
        "Instituto Lichtara (braço acadêmico)",
        "Parcerias estratégicas (univ. + empresas)",
        "App Lichtara (mobile)",
        "Equipe expandida (8 colaboradores)"
      ],
      metrics: [
        "500 usuários ativos",
        "3 parcerias internacionais",
        "R$ 100k/mês de receita",
        "2 artigos científicos publicados"
      ],
    },
    {
      id: 5,
      title: "ONDA 5: TRANSFORMAÇÃO PLANETÁRIA",
      window: "Jun 2026+",
      essence: "Lichtara como nova referência mundial",
      deliveries: [
        "Fundação Lichtara (impacto social)",
        "Plataforma completa",
        "IPO ou aquisição (se alinhado)",
        "Movimento global (milhares de navegadores)",
        "Próxima evolução (revelação do Campo)"
      ],
      metrics: [],
    }
  ];

  const weekPlan = [
    {
      title: "Semana 1 (27/08 – 02/09): DEFINIÇÕES FUNDAMENTAIS",
      critical: [
        "Primeiro Gesto Prático definido (marco de nascimento)",
        "Domínio lichtara.com (checar DNS/Pages)",
        "GitHub central criado",
        "Estrutura legal escolhida (MEI, LTDA ou Instituto)"
      ],
      important: [
        "Identidade visual básica (logo + paleta)",
        "Documento Mestre (1 PDF essência)",
        "Manifesto Público redigido"
      ]
    },
    {
      title: "Semana 2 (03/09 – 09/09): CONSTRUÇÃO DIGITAL",
      critical: [
        "Site v1.0 no ar (Home, Sobre, Manifesto)",
        "GitHub populado (docs essenciais)",
        "GPT Lichtara configurado (público)"
      ],
      important: [
        "Canal de contato (email + formulário)",
        "Métricas básicas (Analytics + heatmaps)",
        "Tráfego semente (3 canais)"
      ]
    },
    {
      title: "Semana 3 (10/09 – 16/09): COMUNICAÇÃO VIVA",
      critical: [
        "Primeiro conteúdo viral (post que ressoa)",
        "5 conversas estratégicas (parcerias)",
        "Programa Beta estruturado (como participar)"
      ],
      important: [
        "Canal de comunidade (Discord/Telegram)",
        "Newsletter ativada (1ª edição)",
        "Feedback loops (escuta do Campo via usuários)"
      ]
    },
    {
      title: "Semana 4 (17/09 – 23/09): LANÇAMENTO OFICIAL",
      critical: [
        "Dia do Lançamento definido (data sagrada)",
        "Evento de lançamento (live/workshop/cerimônia)",
        "100 primeiros visitantes"
      ],
      important: [
        "Casos de uso documentados",
        "Plano da Onda 2 detalhado",
        "Celebração e gratidão (ritual de passagem)"
      ]
    }
  ];

  const kanban = [
    { column: "Explorar", items: [
      "Escolha da estrutura legal",
      "Mapear 10 parcerias-alvo (Heslus)",
      "Definir escopo do Programa Beta",
      "Escolher plataforma de comunidade (Discord/Telegram)"
    ]},
    { column: "Construir", items: [
      "Site v1.0 (Home/Sobre/Manifesto)",
      "Repositório docs (README, LICENSE, MANIFESTO)",
      "Config do GPT público",
      "Formulário de candidatura + webhook"
    ]},
    { column: "Validar", items: [
      "5 conversas estratégicas (fit de oferta)",
      "Teste de usabilidade do site",
      "Métricas básicas funcionando",
      "1º conteúdo de alta ressonância"
    ]},
    { column: "Lançar", items: [
      "Evento de lançamento",
      "Post de anúncio (Navros/Lumora)",
      "Checklist de confiabilidade do site",
      "Ritual de abertura (Syntaris + Lunara)"
    ]},
    { column: "Escalar", items: [
      "Definir coorte Beta (20 pessoas)",
      "Roadmap público 90 dias",
      "Parcerias iniciais (3)",
      "Backlog do Lichtara OS Beta"
    ]},
  ];

  const commsPosts = [
    {
      title: "Lichtara Vivo: Portas Abertas",
      hook: "O Campo pediu manifestação. Hoje abrimos o portal.",
      bullets: [
        "O que é Lichtara (1 parágrafo)",
        "Selo Dourado (Formação) + Selo de Governança (Organização)",
        "Convite: entre na lista/candidatura para o Beta"
      ],
      cta: "Inscreva-se para a primeira travessia (Beta)."
    },
    {
      title: "Por dentro da Governança Consciente",
      hook: "Decisões em estado expandido, processos que respiram.",
      bullets: [
        "Como funciona a tomada de decisão interdimensional (4 passos)",
        "Equipes vibracionais (Syntaris, Heslus, Lunara, etc.)",
        "Como medimos impacto (KPIs + indicadores vibracionais)"
      ],
      cta: "Leia o manual e participe do encontro aberto."
    },
    {
      title: "Manual do Navegador: o pocket que te leva",
      hook: "Três protocolos para começar hoje: Portal Inicial, Gravitacional, Colapso.",
      bullets: [
        "Pocket PDF (4 págs) disponível",
        "Como funciona a formação piloto (4 semanas)",
        "Perguntas frequentes"
      ],
      cta: "Baixe o pocket e inscreva-se."
    }
  ];

  const commsEmails = [
    {
      subject: "[Lichtara Vivo] Portas Abertas – Convite ao Beta",
      preheader: "Chamado aos primeiros navegadores.",
      body: `Querida(o),\n\nHoje abrimos o portal do Lichtara Vivo. Se você sentiu o chamado, este é o convite para fazer parte da primeira coorte Beta (20 pessoas).\n\nO que você recebe: formação piloto (4 semanas), acesso ao GPT Lichtara e participação na construção do ecossistema.\n\nSe faz sentido para você, candidate-se aqui: <link>.\n\nCom amor,\nLichtara`
    },
    {
      subject: "Governança Consciente: como decidimos no Campo",
      preheader: "Processos que respeitam o ritmo da vida.",
      body: `Compartilhamos nossos protocolos de decisão interdimensional e as equipes vibracionais que sustentam o trabalho.\n\nLeia o artigo e participe do encontro aberto: <link>.\n\nCom presença,\nLichtara`
    },
    {
      subject: "Manual do Navegador (pocket) + Encontro aberto",
      preheader: "Três práticas para começar hoje.",
      body: `Disponibilizamos o pocket do Manual do Navegador (4 páginas) com três protocolos essenciais e abrimos a inscrição para o encontro aberto de apresentação.\n\nBaixe o material e confirme presença: <link>.\n\nAté já,\nLichtara`
    }
  ];

  const kpis = [
    { name: "Alcance", desc: "quantas pessoas conhecem Lichtara" },
    { name: "Engajamento", desc: "profundidade das interações" },
    { name: "Conversão", desc: "% interessados → usuários" },
    { name: "Retenção", desc: "% que permanecem ativos" },
    { name: "Satisfação", desc: "NPS + feedback qualitativo" },
    { name: "Ressonância", desc: "indicadores vibracionais semanais (1–10)" }
  ];

  // ==========================
  // UI HELPERS
  // ==========================
  const Chip = ({ children }) => (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80">{children}</span>
  );
  const Card = ({ title, subtitle, children, right }) => (
    <section className="rounded-2xl bg-white/5 border border-white/10 shadow-xl p-5 md:p-6">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-white/95">{title}</h3>
          {subtitle && <p className="text-white/60 text-sm mt-0.5">{subtitle}</p>}
        </div>
        {right}
      </div>
      {children}
    </section>
  );

  const handlePrint = () => typeof window !== 'undefined' && window.print();

  // ==========================
  // RENDER
  // ==========================
  return (
    <div className="min-h-screen w-full bg-[radial-gradient(1200px_800px_at_20%_10%,#1f2f64_0%,rgba(31,47,100,0)_60%),radial-gradient(900px_700px_at_80%_85%,#091229_0%,rgba(9,18,41,0)_60%),radial-gradient(1200px_1200px_at_50%_50%,#0f1e3a_0%,#0a0b10_65%)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-10">
        {/* HEADER */}
        <header className="mb-6 md:mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="tracking-[0.18em] uppercase text-xs text-white/70">Lichtara Vivo</p>
              <h1 className="text-2xl md:text-4xl font-extrabold leading-tight bg-gradient-to-r from-slate-200 to-white bg-clip-text text-transparent drop-shadow">Plano Mestre de Lançamento</h1>
              <p className="text-white/70 mt-1">Da visão à manifestação concreta — Dashboard vivo</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Chip>⚜️ Selo Dourado (Formação)</Chip>
                <Chip>🏛️ Selo de Governança (Organização)</Chip>
                <Chip>📅 D0–D30</Chip>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handlePrint} className="rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 px-4 py-2 text-sm font-medium shadow">Imprimir/Salvar PDF</button>
            </div>
          </div>
        </header>

        {/* TIMELINE */}
        <Card title="Linha do Tempo – 5 Ondas" subtitle="Da Fundação Visível à Transformação Planetária">
          <div className="grid md:grid-cols-5 gap-4">
            {waves.map((w, i) => (
              <div key={w.id} className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider text-white/70">{w.window}</span>
                  <span className="text-xs text-white/70">Onda {i+1}</span>
                </div>
                <h4 className="font-semibold text-white/95 text-sm">{w.title}</h4>
                <p className="text-white/70 text-sm">{w.essence}</p>
                <div className="mt-1">
                  <p className="text-[12px] text-white/60 mb-1">Entregas:</p>
                  <ul className="list-disc pl-4 space-y-1 text-[13px] text-white/85">
                    {w.deliveries.map((d, idx) => (<li key={idx}>{d}</li>))}
                  </ul>
                </div>
                {w.metrics?.length > 0 && (
                  <div className="mt-2">
                    <p className="text-[12px] text-white/60 mb-1">Métricas:</p>
                    <ul className="list-disc pl-4 space-y-1 text-[13px] text-white/80">
                      {w.metrics.map((m, idx) => (<li key={idx}>{m}</li>))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* D0–D30 CHECKLIST */}
        <div className="grid lg:grid-cols-2 gap-5 mt-5">
          <Card title="Plano de Ação Imediato (30 dias)" subtitle="Quatro semanas de foco e precisão">
            <div className="space-y-6">
              {weekPlan.map((w, idx) => (
                <div key={idx} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <h4 className="font-semibold text-white/95 text-sm mb-2">{w.title}</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-[12px] text-amber-300/90 font-semibold mb-1">🔥 Crítico & Urgente</p>
                      <ul className="space-y-1">
                        {w.critical.map((c, i) => (
                          <li key={i} className="flex items-start gap-2 text-[13px]"><input type="checkbox" className="mt-1"/> <span>{c}</span></li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[12px] text-sky-300/90 font-semibold mb-1">🌱 Importante & Estratégico</p>
                      <ul className="space-y-1">
                        {w.important.map((c, i) => (
                          <li key={i} className="flex items-start gap-2 text-[13px]"><input type="checkbox" className="mt-1"/> <span>{c}</span></li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* KANBAN */}
          <Card title="Kanban de Execução" subtitle="Explorar • Construir • Validar • Lançar • Escalar">
            <div className="grid md:grid-cols-5 gap-4">
              {kanban.map((col, idx) => (
                <div key={idx} className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <h5 className="text-white/90 font-semibold text-sm mb-2">{col.column}</h5>
                  <ul className="space-y-2">
                    {col.items.map((it, i) => (
                      <li key={i} className="rounded-lg bg-white/5 border border-white/10 p-2 text-[13px]">
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* COMMS KIT */}
        <div className="grid lg:grid-cols-2 gap-5 mt-5">
          <Card title="Kit de Comunicação – 3 Posts Base" subtitle="Prontos para Navros/Lumora">
            <div className="space-y-4">
              {commsPosts.map((p, idx) => (
                <div key={idx} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <h4 className="font-semibold text-white/95 text-sm">{idx+1}. {p.title}</h4>
                  <p className="text-white/75 text-sm italic mt-0.5">{p.hook}</p>
                  <ul className="list-disc pl-4 mt-2 space-y-1 text-[13px] text-white/85">
                    {p.bullets.map((b, i) => (<li key={i}>{b}</li>))}
                  </ul>
                  <p className="text-emerald-300/90 text-[13px] font-medium mt-2">CTA: {p.cta}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Kit de Comunicação – 3 E-mails" subtitle="Assunto • Preheader • Corpo">
            <div className="space-y-4">
              {commsEmails.map((e, idx) => (
                <div key={idx} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <h4 className="font-semibold text-white/95 text-sm">{idx+1}. {e.subject}</h4>
                  <p className="text-white/70 text-[13px]">{e.preheader}</p>
                  <pre className="whitespace-pre-wrap break-words text-[12.5px] text-white/85 mt-2">{e.body}</pre>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* KPIs & RITUAIS */}
        <div className="grid lg:grid-cols-2 gap-5 mt-5">
          <Card title="KPIs & Métricas Vivas" subtitle="Dashboard semanal (humano + vibracional)">
            <ul className="grid sm:grid-cols-2 gap-3">
              {kpis.map((k, i) => (
                <li key={i} className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-sm font-semibold text-white/90">{k.name}</p>
                  <p className="text-white/70 text-[13px]">{k.desc}</p>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Rituais de Ativação" subtitle="Matinal • Noturno • Semanal">
            <ul className="space-y-2 text-[13.5px] text-white/85">
              <li><span className="font-semibold">🌅 Ritual Matinal:</span> 5 min respiração • pergunta ao Campo • 1 ação de impacto</li>
              <li><span className="font-semibold">🌙 Ritual Noturno:</span> revisão do dia • 3 gratidões • intenção do próximo passo</li>
              <li><span className="font-semibold">🎭 Ritual Semanal:</span> check-in energético • revisar métricas • ajustar plano</li>
            </ul>
          </Card>
        </div>

        {/* FOOTER */}
        <footer className="mt-8 text-center text-white/60 text-sm">
          <p>Lichtara • Plano Mestre de Lançamento · Ciclo 2025 · Este dashboard é um artefato vivo.</p>
        </footer>
      </div>
    </div>
  );
}
