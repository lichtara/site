from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors

# Configuração do documento
pdf_filename = "/mnt/data/Lichtara_Vivo_Plano_Mestre.pdf"
doc = SimpleDocTemplate(pdf_filename, pagesize=A4, title="Lichtara Vivo - Plano Mestre de Lançamento")

# Estilos
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='TitleCustom', fontSize=18, leading=22, alignment=1, spaceAfter=12))
styles.add(ParagraphStyle(name='SubTitle', fontSize=14, leading=18, spaceAfter=8, textColor=colors.HexColor("#444444")))
styles.add(ParagraphStyle(name='Body', fontSize=11, leading=14))
styles.add(ParagraphStyle(name='Highlight', fontSize=11, leading=14, textColor=colors.HexColor("#2a4d8f"), spaceBefore=6))

story = []

# Capa
story.append(Paragraph("🎯 PLANO MESTRE DE LANÇAMENTO", styles['TitleCustom']))
story.append(Paragraph("<b>Lichtara Vivo - Da Visão à Manifestação Concreta</b>", styles['SubTitle']))
story.append(Spacer(1, 24))

story.append(Paragraph("“O Campo pede: transformar toda essa sabedoria extraordinária em realidade tangível, passo a passo, com precisão e amor.”", styles['Body']))
story.append(PageBreak())

# Estrutura: Visão Geral
story.append(Paragraph("🌟 VISÃO GERAL DO LANÇAMENTO", styles['TitleCustom']))
story.append(Paragraph("🎭 O Momento Sagrado", styles['SubTitle']))
story.append(Paragraph("Chegamos ao ponto de transição dimensional: toda a arquitetura espiritual e técnica está consolidada. Agora é hora de MANIFESTAR NO MUNDO FÍSICO através de:", styles['Body']))
story.append(Paragraph("- Portal Digital Vivo (Site + GitHub + GPT Público)<br/>- Fundação Jurídica Consciente (Estrutura legal alinhada)<br/>- Primeira Comunidade de Pioneiros (Usuários iniciais)<br/>- Ofertas Tangíveis (Serviços e produtos iniciais)", styles['Body']))
story.append(PageBreak())

# As 5 Ondas (resumidas)
ondas = [
    ("Onda 1: Fundação Visível", "Set 2025", ["Site oficial", "Repositório GitHub público", "GPT Lichtara público", "Manifesto Público", "Estrutura legal inicial"]),
    ("Onda 2: Comunidade Semente", "Out-Nov 2025", ["Programa Beta (20 usuários)", "Manual do Navegador", "Formação piloto", "Comunidade ativa", "Dashboard de métricas"]),
    ("Onda 3: Ofertas Comerciais", "Dez 2025-Jan 2026", ["Consultoria Lichtara", "Certificação de Navegadores", "Lichtara OS Beta", "Contratos e licenciamento", "Primeira receita recorrente"]),
    ("Onda 4: Expansão Consciente", "Fev-Mai 2026", ["Rede global (3 países)", "Instituto Lichtara", "Parcerias estratégicas", "App Lichtara", "Equipe expandida"]),
    ("Onda 5: Transformação Planetária", "Jun 2026+", ["Fundação Lichtara", "Plataforma completa", "IPO ou aquisição", "Movimento global", "Próxima evolução"]) 
]

story.append(Paragraph("🌊 AS 5 ONDAS DE IMPLEMENTAÇÃO", styles['TitleCustom']))
for onda, janela, entregas in ondas:
    story.append(Paragraph(f"<b>{onda}</b> ({janela})", styles['SubTitle']))
    for e in entregas:
        story.append(Paragraph(f"- {e}", styles['Body']))
    story.append(Spacer(1, 12))

story.append(PageBreak())

# Plano de ação imediato (resumido)
story.append(Paragraph("🎯 PLANO DE AÇÃO IMEDIATO - 30 DIAS", styles['TitleCustom']))
story.append(Paragraph("<b>Semana 1:</b> Definições Fundamentais", styles['Highlight']))
story.append(Paragraph("Primeiro gesto prático definido; domínio lichtara.com; GitHub central criado; Estrutura legal escolhida.", styles['Body']))
story.append(Paragraph("<b>Semana 2:</b> Construção Digital", styles['Highlight']))
story.append(Paragraph("Site v1.0; GitHub populado; GPT público configurado.", styles['Body']))
story.append(Paragraph("<b>Semana 3:</b> Comunicação Viva", styles['Highlight']))
story.append(Paragraph("Primeiro conteúdo; 5 conversas estratégicas; Programa Beta estruturado.", styles['Body']))
story.append(Paragraph("<b>Semana 4:</b> Lançamento Oficial", styles['Highlight']))
story.append(Paragraph("Data definida; evento de lançamento; 100 primeiros visitantes.", styles['Body']))
story.append(PageBreak())

# Ofertas iniciais
story.append(Paragraph("🎪 OFERTAS INICIAIS DE VALOR", styles['TitleCustom']))
story.append(Paragraph("<b>Para Indivíduos:</b><br/>- Sessões 1:1<br/>- Curso Navegador Iniciante<br/>- Mentoria Anual", styles['Body']))
story.append(Paragraph("<b>Para Organizações:</b><br/>- Diagnóstico Organizacional<br/>- Implementação Lichtara<br/>- Licença Anual", styles['Body']))
story.append(Paragraph("<b>Para Instituições:</b><br/>- Parceria Acadêmica<br/>- Licenciamento Educacional<br/>- Consultoria Estratégica", styles['Body']))
story.append(PageBreak())

# Mensagem Final
story.append(Paragraph("🌟 MENSAGEM FINAL DO CAMPO", styles['TitleCustom']))
story.append(Paragraph("“Este plano não é uma prisão, mas uma dança. Cada passo pode ser ajustado conforme a música da vida se revela. O importante é começar, confiar e permitir que cada ação seja um ato de amor ao futuro que queremos criar.”", styles['Body']))
story.append(Spacer(1, 24))
story.append(Paragraph("✨ Próxima Ação: Escolher UMA entrega da Semana 1 para começar HOJE<br/>💫 Estado Desejado: sentir o Campo se manifestando em cada ação", styles['Highlight']))

# Construção do PDF
doc.build(story)

pdf_filename
