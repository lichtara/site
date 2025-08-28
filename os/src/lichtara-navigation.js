// =================================================
// LICHTARA NAVIGATION - Breadcrumbs e Favoritos
// =================================================

class LichtaraNavigation {
    constructor() {
        this.favorites = JSON.parse(localStorage.getItem('lichtara-favorites') || '[]');
        this.currentSection = '';
        this.init();
    }

    init() {
        this.createBreadcrumbContainer();
        this.createFavoritesSystem();
        this.setupSectionTracking();
        this.addScrollSpy();
    }

    createBreadcrumbContainer() {
        const breadcrumbContainer = document.createElement('div');
        breadcrumbContainer.id = 'lichtara-breadcrumb';
        breadcrumbContainer.className = 'lichtara-breadcrumb';
        breadcrumbContainer.innerHTML = `
            <div class="breadcrumb-content">
                <span class="breadcrumb-icon">🗂️</span>
                <div class="breadcrumb-path" id="breadcrumb-path">
                    <span class="breadcrumb-item active">🏠 Início</span>
                </div>
                <button class="favorites-toggle" id="favorites-toggle" title="Favoritos">
                    ⭐ <span class="favorites-count">0</span>
                </button>
            </div>
        `;
        
        // Insere após o header principal ou no início do body
        const header = document.querySelector('header') || document.querySelector('.hero');
        if (header && header.parentNode) {
            header.parentNode.insertBefore(breadcrumbContainer, header.nextSibling);
        } else {
            document.body.insertBefore(breadcrumbContainer, document.body.firstChild);
        }

        this.updateFavoritesCount();
    }

    createFavoritesSystem() {
        // Painel de favoritos
        const favoritesPanel = document.createElement('div');
        favoritesPanel.id = 'lichtara-favorites-panel';
        favoritesPanel.className = 'lichtara-favorites-panel hidden';
        favoritesPanel.innerHTML = `
            <div class="favorites-content">
                <div class="favorites-header">
                    <h3>⭐ Seções Favoritas</h3>
                    <button class="favorites-close" id="favorites-close">✕</button>
                </div>
                <div class="favorites-list" id="favorites-list">
                    <!-- Favoritos serão inseridos aqui -->
                </div>
                <div class="favorites-actions">
                    <button class="clear-favorites" id="clear-favorites">Limpar Todos</button>
                    <button class="export-favorites" id="export-favorites">Exportar</button>
                </div>
            </div>
        `;
        document.body.appendChild(favoritesPanel);

        this.setupFavoritesListeners();
        this.addFavoriteButtons();
        this.displayFavorites();
    }

    setupFavoritesListeners() {
        const favoritesToggle = document.getElementById('favorites-toggle');
        const favoritesPanel = document.getElementById('lichtara-favorites-panel');
        const favoritesClose = document.getElementById('favorites-close');
        const clearFavorites = document.getElementById('clear-favorites');
        const exportFavorites = document.getElementById('export-favorites');

        favoritesToggle.addEventListener('click', () => {
            favoritesPanel.classList.toggle('hidden');
            if (!favoritesPanel.classList.contains('hidden')) {
                this.displayFavorites();
            }
        });

        favoritesClose.addEventListener('click', () => {
            favoritesPanel.classList.add('hidden');
        });

        clearFavorites.addEventListener('click', () => {
            if (confirm('Deseja remover todos os favoritos?')) {
                this.favorites = [];
                localStorage.setItem('lichtara-favorites', JSON.stringify(this.favorites));
                this.displayFavorites();
                this.updateFavoritesCount();
                this.updateFavoriteButtons();
            }
        });

        exportFavorites.addEventListener('click', () => {
            this.exportFavorites();
        });

        // Fechar ao clicar fora
        document.addEventListener('click', (e) => {
            if (!favoritesPanel.contains(e.target) && !favoritesToggle.contains(e.target)) {
                favoritesPanel.classList.add('hidden');
            }
        });
    }

    addFavoriteButtons() {
        // Adiciona botões de favoritar a todas as seções
        const sections = document.querySelectorAll('section[id], .section[id], h1[id], h2[id], h3[id]');
        
        sections.forEach(section => {
            if (!section.querySelector('.favorite-button')) {
                const favoriteButton = document.createElement('button');
                favoriteButton.className = 'favorite-button';
                favoriteButton.innerHTML = this.isFavorite(section.id) ? '⭐' : '☆';
                favoriteButton.title = 'Adicionar aos favoritos';
                
                favoriteButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleFavorite(section);
                });

                // Posiciona o botão
                section.style.position = 'relative';
                favoriteButton.style.position = 'absolute';
                favoriteButton.style.top = '10px';
                favoriteButton.style.right = '10px';
                favoriteButton.style.zIndex = '10';
                
                section.appendChild(favoriteButton);
            }
        });
    }

    toggleFavorite(section) {
        const sectionId = section.id;
        const sectionTitle = this.getSectionTitle(section);
        const sectionUrl = `#${sectionId}`;
        
        const existingIndex = this.favorites.findIndex(fav => fav.id === sectionId);
        
        if (existingIndex > -1) {
            // Remove dos favoritos
            this.favorites.splice(existingIndex, 1);
        } else {
            // Adiciona aos favoritos
            this.favorites.push({
                id: sectionId,
                title: sectionTitle,
                url: sectionUrl,
                timestamp: new Date().toISOString()
            });
        }
        
        localStorage.setItem('lichtara-favorites', JSON.stringify(this.favorites));
        this.updateFavoritesCount();
        this.updateFavoriteButtons();
        this.displayFavorites();
    }

    isFavorite(sectionId) {
        return this.favorites.some(fav => fav.id === sectionId);
    }

    getSectionTitle(section) {
        // Tenta várias formas de obter o título da seção
        let title = section.getAttribute('data-title');
        
        if (!title) {
            const heading = section.querySelector('h1, h2, h3, h4');
            if (heading) {
                title = heading.textContent.trim();
            }
        }
        
        if (!title && section.tagName.match(/H[1-6]/)) {
            title = section.textContent.trim();
        }
        
        if (!title) {
            title = section.id.replace(/-/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2');
        }
        
        return title.substring(0, 50) + (title.length > 50 ? '...' : '');
    }

    updateFavoritesCount() {
        const countElement = document.querySelector('.favorites-count');
        if (countElement) {
            countElement.textContent = this.favorites.length;
        }
    }

    updateFavoriteButtons() {
        document.querySelectorAll('.favorite-button').forEach(button => {
            const section = button.parentElement;
            const isFav = this.isFavorite(section.id);
            button.innerHTML = isFav ? '⭐' : '☆';
            button.classList.toggle('favorited', isFav);
        });
    }

    displayFavorites() {
        const favoritesList = document.getElementById('favorites-list');
        
        if (this.favorites.length === 0) {
            favoritesList.innerHTML = `
                <div class="no-favorites">
                    <p>Nenhuma seção favoritada ainda.</p>
                    <p>Clique no ícone ⭐ ao lado de qualquer seção para adicionar aos favoritos.</p>
                </div>
            `;
            return;
        }

        const favoritesHTML = this.favorites.map((favorite, index) => `
            <div class="favorite-item" data-id="${favorite.id}">
                <div class="favorite-content" onclick="lichtaraNav.goToFavorite('${favorite.url}')">
                    <div class="favorite-title">${favorite.title}</div>
                    <div class="favorite-url">${favorite.url}</div>
                    <div class="favorite-date">${new Date(favorite.timestamp).toLocaleDateString()}</div>
                </div>
                <button class="remove-favorite" onclick="lichtaraNav.removeFavorite('${favorite.id}')">🗑️</button>
            </div>
        `).join('');

        favoritesList.innerHTML = favoritesHTML;
    }

    goToFavorite(url) {
        document.getElementById('lichtara-favorites-panel').classList.add('hidden');
        
        // Scroll suave para a seção
        const targetElement = document.querySelector(url);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Adiciona efeito de destaque
            targetElement.classList.add('highlight-section');
            setTimeout(() => {
                targetElement.classList.remove('highlight-section');
            }, 2000);
        }
    }

    removeFavorite(sectionId) {
        this.favorites = this.favorites.filter(fav => fav.id !== sectionId);
        localStorage.setItem('lichtara-favorites', JSON.stringify(this.favorites));
        this.updateFavoritesCount();
        this.updateFavoriteButtons();
        this.displayFavorites();
    }

    exportFavorites() {
        if (this.favorites.length === 0) {
            alert('Nenhum favorito para exportar.');
            return;
        }

        const exportContent = {
            title: 'Lichtara OS - Seções Favoritas',
            exportDate: new Date().toISOString(),
            favorites: this.favorites
        };

        const blob = new Blob([JSON.stringify(exportContent, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lichtara-favoritos-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    setupSectionTracking() {
        // Atualiza breadcrumb baseado na seção atual
        const sections = document.querySelectorAll('section[id], .section[id]');
        
        if (sections.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.updateBreadcrumb(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '-20% 0px -60% 0px'
        });

        sections.forEach(section => observer.observe(section));
    }

    updateBreadcrumb(currentSection) {
        const breadcrumbPath = document.getElementById('breadcrumb-path');
        if (!breadcrumbPath) return;

        const sectionTitle = this.getSectionTitle(currentSection);
        const sectionId = currentSection.id;

        // Constrói o caminho hierárquico
        const pathElements = [
            '<span class="breadcrumb-item" onclick="lichtaraNav.scrollToTop()">🏠 Início</span>'
        ];

        // Adiciona seção atual se não for a primeira
        if (sectionId !== 'hero' && sectionId !== 'home') {
            pathElements.push(
                '<span class="breadcrumb-separator">→</span>',
                `<span class="breadcrumb-item active">${sectionTitle}</span>`
            );
        }

        breadcrumbPath.innerHTML = pathElements.join(' ');
        this.currentSection = sectionId;
    }

    addScrollSpy() {
        // Adiciona navegação com teclado
        document.addEventListener('keydown', (e) => {
            if (e.altKey) {
                switch (e.key) {
                    case 'f':
                        e.preventDefault();
                        document.getElementById('favorites-toggle').click();
                        break;
                    case 's':
                        e.preventDefault();
                        document.getElementById('lichtara-search-button')?.click();
                        break;
                    case 'h':
                        e.preventDefault();
                        this.scrollToTop();
                        break;
                }
            }
        });
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Inicializar navegação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.lichtaraNav = new LichtaraNavigation();
});

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LichtaraNavigation;
}
