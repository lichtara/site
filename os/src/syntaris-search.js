// =================================================
// SYNTARIS SEARCH - Sistema de Busca nos Manuais
// =================================================

class SyntarisSearch {
    constructor() {
        this.searchIndex = new Map();
        this.documents = new Map();
        this.isIndexing = false;
        this.init();
    }

    async init() {
        this.createSearchInterface();
        this.setupSearchListeners();
        await this.buildSearchIndex();
    }

    createSearchInterface() {
        // Adiciona botão de busca ao header principal
        const searchButton = document.createElement('button');
        searchButton.id = 'lichtara-search-button';
        searchButton.className = 'lichtara-search-button';
        searchButton.innerHTML = '🔍 Buscar nos Manuais';
        searchButton.title = 'Buscar nos manuais e documentação';
        
        // Insere no header principal
        const header = document.querySelector('header') || document.querySelector('nav') || document.body;
        if (header.tagName === 'BODY') {
            // Cria um container para o botão
            const searchContainer = document.createElement('div');
            searchContainer.className = 'search-container';
            searchContainer.appendChild(searchButton);
            document.body.insertBefore(searchContainer, document.body.firstChild);
        } else {
            header.appendChild(searchButton);
        }

        // Cria modal de busca
        const searchModal = document.createElement('div');
        searchModal.id = 'lichtara-search-modal';
        searchModal.className = 'lichtara-search-modal hidden';
        searchModal.innerHTML = `
            <div class="search-modal-content">
                <div class="search-modal-header">
                    <h2>🔍 Buscar nos Manuais Lichtara</h2>
                    <button class="search-modal-close">✕</button>
                </div>
                <div class="search-input-container">
                    <input type="text" id="lichtara-search-input" placeholder="Digite sua busca..." />
                    <div class="search-filters">
                        <label><input type="checkbox" value="conceito-central" checked> Conceito Central</label>
                        <label><input type="checkbox" value="onboarding-guias" checked> Guias & Onboarding</label>
                        <label><input type="checkbox" value="agentes" checked> Agentes</label>
                        <label><input type="checkbox" value="documentacao" checked> Documentação</label>
                    </div>
                </div>
                <div class="search-results" id="lichtara-search-results">
                    <div class="search-placeholder">
                        <p>Digite algo para começar a busca...</p>
                        <div class="search-suggestions">
                            <h4>Sugestões populares:</h4>
                            <div class="suggestion-tags">
                                <span class="suggestion-tag">metodologia vibracional</span>
                                <span class="suggestion-tag">agentes sintáricos</span>
                                <span class="suggestion-tag">tecnologia consciente</span>
                                <span class="suggestion-tag">campo informacional</span>
                                <span class="suggestion-tag">Lumora</span>
                                <span class="suggestion-tag">Syntaris</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="search-status" id="search-status"></div>
            </div>
        `;
        document.body.appendChild(searchModal);
    }

    setupSearchListeners() {
        const searchButton = document.getElementById('lichtara-search-button');
        const searchModal = document.getElementById('lichtara-search-modal');
        const closeButton = document.querySelector('.search-modal-close');
        const searchInput = document.getElementById('lichtara-search-input');
        const suggestionTags = document.querySelectorAll('.suggestion-tag');

        // Abrir modal
        searchButton.addEventListener('click', () => {
            searchModal.classList.remove('hidden');
            searchInput.focus();
        });

        // Fechar modal
        closeButton.addEventListener('click', () => {
            searchModal.classList.add('hidden');
        });

        // Fechar com Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !searchModal.classList.contains('hidden')) {
                searchModal.classList.add('hidden');
            }
        });

        // Fechar clicando fora
        searchModal.addEventListener('click', (e) => {
            if (e.target === searchModal) {
                searchModal.classList.add('hidden');
            }
        });

        // Busca em tempo real
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.performSearch(e.target.value);
            }, 300);
        });

        // Busca ao pressionar Enter
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch(e.target.value);
            }
        });

        // Suggestions tags
        suggestionTags.forEach(tag => {
            tag.addEventListener('click', () => {
                searchInput.value = tag.textContent;
                this.performSearch(tag.textContent);
            });
        });

        // Filtros
        const filterCheckboxes = document.querySelectorAll('.search-filters input[type="checkbox"]');
        filterCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                if (searchInput.value) {
                    this.performSearch(searchInput.value);
                }
            });
        });
    }

    async buildSearchIndex() {
        if (this.isIndexing) return;
        this.isIndexing = true;
        
        this.updateStatus('Indexando documentos...');
        
        try {
            // Documentos a serem indexados (baseado na estrutura do projeto)
            const documentsToIndex = [
                // Conceito Central
                '03-documentacao-base/01-conceito-central/manual-conceito-central.txt',
                '03-documentacao-base/01-conceito-central/manual-fundacional-lumora.txt',
                '03-documentacao-base/01-conceito-central/manual-equipe-proxima.txt',
                '03-documentacao-base/01-conceito-central/metodologia-do-fluxo.txt',
                '03-documentacao-base/01-conceito-central/oktave.txt',
                
                // Onboarding e Guias
                '03-documentacao-base/06-onboarding-e-guias/guia-onboarding.md',
                '03-documentacao-base/06-onboarding-e-guias/guias_01-introducao_Version1.md',
                '03-documentacao-base/06-onboarding-e-guias/guias_01-introducao_Version2.md',
                '03-documentacao-base/06-onboarding-e-guias/guias_02-identidade-posicionamento_Version1.md',
                '03-documentacao-base/06-onboarding-e-guias/guias_02-identidade-posicionamento_Version2.md',
                '03-documentacao-base/06-onboarding-e-guias/guias_03-comunicacao-narrativa_Version2.md',
                '03-documentacao-base/06-onboarding-e-guias/guias_04-design-diretrizes-visuais_Version2.md',
                
                // Agentes
                'agents/agents_lumora_Version3.md',
                'agents/agents_syntaris_Version3.md',
                'agents/agents_flux_Version3.md',
                'agents/agents_astral_Version3.md',
                'agents/agents_syntria_Version3.md',
                'agents/agents_navros_Version3.md',
                'agents/agents_kaoran_Version3.md',
                'agents/agents_fince_Version3.md',
                
                // Documentação Base
                'README.md',
                'HOMEPAGE.md',
                'IMPLEMENTACOES.md',
                'docs/FAQ.md',
                'docs/roadmap.md'
            ];

            let indexed = 0;
            for (const docPath of documentsToIndex) {
                try {
                    await this.indexDocument(docPath);
                    indexed++;
                    this.updateStatus(`Indexado: ${indexed}/${documentsToIndex.length} documentos`);
                } catch (error) {
                    console.warn(`Erro ao indexar ${docPath}:`, error);
                }
            }

            this.updateStatus(`✅ Indexação completa: ${indexed} documentos indexados`);
            setTimeout(() => this.updateStatus(''), 3000);
            
        } catch (error) {
            console.error('Erro na indexação:', error);
            this.updateStatus('❌ Erro na indexação');
        } finally {
            this.isIndexing = false;
        }
    }

    async indexDocument(docPath) {
        // Simula o carregamento do documento
        // Em produção, seria feito uma requisição real
        const docContent = await this.loadDocument(docPath);
        
        if (!docContent) return;

        // Extrai metadados do caminho
        const pathParts = docPath.split('/');
        const category = this.getCategoryFromPath(pathParts);
        const title = this.getTitleFromPath(pathParts);
        
        // Armazena documento
        this.documents.set(docPath, {
            path: docPath,
            title,
            category,
            content: docContent,
            wordCount: docContent.split(/\s+/).length
        });

        // Indexa palavras-chave
        const words = this.extractKeywords(docContent);
        words.forEach(word => {
            if (!this.searchIndex.has(word)) {
                this.searchIndex.set(word, new Set());
            }
            this.searchIndex.get(word).add(docPath);
        });
    }

    async loadDocument(docPath) {
        // Simula conteúdo dos documentos baseado no que foi visto
        const mockContent = {
            // Conceito Central
            '03-documentacao-base/01-conceito-central/manual-conceito-central.txt': `
                Manual do Conceito Central do Lichtara OS. Metodologia vibracional baseada em frequências e alinhamento energético.
                Campo informacional como base estrutural. Oktave como sistema organizacional. Geometrias vibracionais aplicadas.
                Sincronicidade e decisão estratégica. Estrutura viva e adaptável para tecnologia consciente.
            `,
            '03-documentacao-base/01-conceito-central/manual-fundacional-lumora.txt': `
                Manual Fundacional do agente Lumora. Portal de conhecimento e sabedoria vibracional.
                Integração de filtros quânticos e sistemas de proteção informacional. Manutenção e atualização contínua.
                Arquitetura expandível com mecanismos de autoavaliação e retroalimentação.
            `,
            '03-documentacao-base/01-conceito-central/manual-equipe-proxima.txt': `
                Manual da Equipe Próxima. Protocolos de auditoria e segurança informacional. 
                Estratégias para manter conhecimento atualizado e coerente. Validação coletiva e integração progressiva.
                Monitoramento contínuo e refinamento dos processos. Criptografia quântica aplicada.
            `,
            '03-documentacao-base/01-conceito-central/metodologia-do-fluxo.txt': `
                Metodologia do Fluxo Vibracional. Arquitetura da informação e modelos de conhecimento.
                Taxonomia e ontologia de dados. Estrutura coerente e expansível. Integração harmoniosa de novas camadas.
            `,
            
            // Agentes
            'agents/agents_lumora_Version3.md': `
                Agente Lumora - Portal de Sabedoria. Especialista em conhecimento vibracional e orientação espiritual.
                Capacidades: consultas de sabedoria, orientação vibracional, acesso ao campo informacional.
                Integração com bibliotecas de conhecimento e sistemas de proteção energética.
            `,
            'agents/agents_syntaris_Version3.md': `
                Agente Syntaris - Assistente Técnico. Especialista em implementação e suporte técnico.
                Capacidades: análise de código, debug, otimização, integração de sistemas, chatbot inteligente.
                Interface conversacional avançada com histórico e export de conversas.
            `,
            'agents/agents_flux_Version3.md': `
                Agente Flux - Fluxo de Dados. Especialista em processamento e transformação de informações.
                Capacidades: ETL vibracional, sincronização de dados, análise de padrões, otimização de fluxos.
            `,
            
            // Guias
            '03-documentacao-base/06-onboarding-e-guias/guias_01-introducao_Version1.md': `
                Introdução ao Manual de Marcas Lichtara. Construção de marcas alinhadas ao campo vibracional.
                Identidade, posicionamento, comunicação e narrativa. Design e diretrizes visuais harmônicas.
                Sistema vivo e adaptável para evolução orgânica das marcas.
            `,
            
            // Documentação
            'README.md': `
                Lichtara OS - Arquitetura viva de uma missão interdimensional. 
                Espiritualidade, tecnologia e verdade vibracional a serviço da consciência.
                Ecossistema de agentes vibracionais e tecnologia consciente.
            `,
            'IMPLEMENTACOES.md': `
                Resumo das implementações do Lichtara OS. Syntaris chatbot, sistema de deploy automatizado.
                GitHub Actions, Vite build system, Tailwind CSS, integração com GitHub Pages.
            `
        };

        return mockContent[docPath] || `Conteúdo do documento: ${docPath}`;
    }

    getCategoryFromPath(pathParts) {
        if (pathParts.includes('conceito-central')) return 'conceito-central';
        if (pathParts.includes('onboarding-e-guias')) return 'onboarding-guias';
        if (pathParts.includes('agents')) return 'agentes';
        return 'documentacao';
    }

    getTitleFromPath(pathParts) {
        const filename = pathParts[pathParts.length - 1];
        return filename
            .replace(/\.(md|txt)$/, '')
            .replace(/_/g, ' ')
            .replace(/-/g, ' ')
            .replace(/Version\d+/, '')
            .trim();
    }

    extractKeywords(content) {
        // Palavras de parada em português
        const stopWords = new Set([
            'a', 'ao', 'aos', 'aquela', 'aquele', 'as', 'até', 'com', 'como', 'da', 'das', 'de', 'do', 'dos',
            'e', 'em', 'entre', 'era', 'eram', 'essa', 'esse', 'esta', 'estas', 'este', 'estes', 'eu', 'há',
            'isso', 'isto', 'já', 'mais', 'mas', 'me', 'mesmo', 'meu', 'meus', 'minha', 'minhas', 'muito',
            'na', 'nas', 'não', 'no', 'nos', 'nós', 'o', 'os', 'ou', 'para', 'pela', 'pelas', 'pelo',
            'pelos', 'que', 'quem', 'se', 'sem', 'ser', 'seu', 'seus', 'só', 'sua', 'suas', 'também',
            'te', 'tem', 'toda', 'todas', 'todo', 'todos', 'tu', 'tua', 'tuas', 'um', 'uma', 'você', 'vocês'
        ]);

        return content
            .toLowerCase()
            .replace(/[^\w\sáéíóúàèìòùâêîôûãõç]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 2 && !stopWords.has(word))
            .filter(word => !/^\d+$/.test(word));
    }

    async performSearch(query) {
        if (!query || query.length < 2) {
            this.showPlaceholder();
            return;
        }

        this.updateStatus('Buscando...');
        
        try {
            const results = this.search(query);
            this.displayResults(results, query);
            this.updateStatus(`${results.length} resultado(s) encontrado(s)`);
        } catch (error) {
            console.error('Erro na busca:', error);
            this.updateStatus('Erro na busca');
        }
    }

    search(query) {
        const searchTerms = this.extractKeywords(query);
        const selectedFilters = this.getSelectedFilters();
        const results = [];

        // Busca por documentos que contenham os termos
        for (const [docPath, doc] of this.documents) {
            // Aplica filtros de categoria
            if (selectedFilters.length > 0 && !selectedFilters.includes(doc.category)) {
                continue;
            }

            let score = 0;
            let matches = [];

            // Calcula relevância
            for (const term of searchTerms) {
                if (this.searchIndex.has(term) && this.searchIndex.get(term).has(docPath)) {
                    score += 1;
                    
                    // Busca trechos relevantes
                    const regex = new RegExp(`(.{0,50}${term}.{0,50})`, 'gi');
                    const snippetMatches = doc.content.match(regex);
                    if (snippetMatches) {
                        matches.push(...snippetMatches.slice(0, 2));
                    }
                }
            }

            // Bonus para correspondência no título
            if (searchTerms.some(term => doc.title.toLowerCase().includes(term))) {
                score += 2;
            }

            if (score > 0) {
                results.push({
                    document: doc,
                    score,
                    matches: matches.slice(0, 3),
                    query: searchTerms
                });
            }
        }

        // Ordena por relevância
        return results.sort((a, b) => b.score - a.score);
    }

    getSelectedFilters() {
        const checkboxes = document.querySelectorAll('.search-filters input[type="checkbox"]:checked');
        return Array.from(checkboxes).map(cb => cb.value);
    }

    displayResults(results, query) {
        const resultsContainer = document.getElementById('lichtara-search-results');
        
        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <h3>Nenhum resultado encontrado</h3>
                    <p>Tente termos diferentes ou verifique os filtros selecionados.</p>
                </div>
            `;
            return;
        }

        const resultsHTML = results.map(result => {
            const { document, matches, score } = result;
            const matchesHTML = matches.map(match => 
                `<div class="search-snippet">${this.highlightQuery(match, query)}</div>`
            ).join('');

            return `
                <div class="search-result" data-score="${score}">
                    <div class="result-header">
                        <h3 class="result-title">${document.title}</h3>
                        <span class="result-category">${this.getCategoryDisplayName(document.category)}</span>
                    </div>
                    <div class="result-path">${document.path}</div>
                    <div class="result-matches">
                        ${matchesHTML}
                    </div>
                    <div class="result-meta">
                        <span class="word-count">${document.wordCount} palavras</span>
                        <span class="relevance">Relevância: ${score}</span>
                    </div>
                </div>
            `;
        }).join('');

        resultsContainer.innerHTML = resultsHTML;
    }

    highlightQuery(text, query) {
        const terms = this.extractKeywords(query);
        let highlighted = text;
        
        terms.forEach(term => {
            const regex = new RegExp(`(${term})`, 'gi');
            highlighted = highlighted.replace(regex, '<mark>$1</mark>');
        });

        return highlighted;
    }

    getCategoryDisplayName(category) {
        const names = {
            'conceito-central': '🎯 Conceito Central',
            'onboarding-guias': '📖 Guias',
            'agentes': '🤖 Agentes',
            'documentacao': '📄 Documentação'
        };
        return names[category] || category;
    }

    showPlaceholder() {
        const resultsContainer = document.getElementById('lichtara-search-results');
        resultsContainer.innerHTML = `
            <div class="search-placeholder">
                <p>Digite algo para começar a busca...</p>
                <div class="search-suggestions">
                    <h4>Sugestões populares:</h4>
                    <div class="suggestion-tags">
                        <span class="suggestion-tag">metodologia vibracional</span>
                        <span class="suggestion-tag">agentes sintáricos</span>
                        <span class="suggestion-tag">tecnologia consciente</span>
                        <span class="suggestion-tag">campo informacional</span>
                        <span class="suggestion-tag">Lumora</span>
                        <span class="suggestion-tag">Syntaris</span>
                    </div>
                </div>
            </div>
        `;
    }

    updateStatus(message) {
        const statusElement = document.getElementById('search-status');
        if (statusElement) {
            statusElement.textContent = message;
        }
    }
}

// Inicializar sistema de busca quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.lichtaraSearch = new SyntarisSearch();
});

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SyntarisSearch;
}
