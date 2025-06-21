/**
 * Ativa o link de navegação certo no header quando a página da galeria é carregada.
 * @param {string} pageName - O nome do arquivo da página que deve ter o link ativo.
 */
function activateNavLink(pageName) {
    // Remove a classe ativa de todos os links do header
    document.querySelectorAll('header nav a').forEach(link => {
        link.classList.remove('nav-active');
    });

    // Adiciona a classe ativa ao link correspondente à página atual
    const linkToActivate = document.querySelector(`header nav a[href$="${pageName}"]`);
    if (linkToActivate) {
        linkToActivate.classList.add('nav-active');
    }
}

// --- PONTO DE ENTRADA PRINCIPAL DO SCRIPT DA GALERIA ---
document.addEventListener('DOMContentLoaded', () => {

    // Lógica para o menu mobile
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Esconde o header ao rolar para baixo e mostra ao rolar para cima
    let lastScrollY = 0;
    const mainHeader = document.querySelector('header');
    if (mainHeader) {
        window.addEventListener('scroll', () => {
            const shouldHide = window.scrollY > lastScrollY && window.scrollY > mainHeader.offsetHeight;
            mainHeader.classList.toggle('header-hidden', shouldHide);
            lastScrollY = window.scrollY;
        });
    }

    // Lógica do Carrossel e da Tela Cheia
    const carouselInner = document.getElementById('carousel-inner');
    const slides = document.querySelectorAll('.carousel-slide');
    const carouselImages = document.querySelectorAll('.carousel-slide img');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    
    // Elementos da tela cheia
    const fullscreenModal = document.getElementById('fullscreen-modal');
    const fullscreenImage = document.getElementById('fullscreen-image');
    const closeFullscreenButton = document.getElementById('close-fullscreen');
    const prevFullscreenButton = document.getElementById('prev-fullscreen');
    const nextFullscreenButton = document.getElementById('next-fullscreen');

    // Só inicializa a galeria se houver slides e o modal de tela cheia
    if (slides.length > 0 && fullscreenModal) {
        let currentIndex = 0;

        const updateCarousel = () => {
            if (carouselInner) {
                carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
            }
        };

        const updateFullscreenImage = () => {
            if (fullscreenImage && carouselImages[currentIndex]) {
                fullscreenImage.src = carouselImages[currentIndex].src;
            }
        };

        const showNext = () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
            if (fullscreenModal.classList.contains('flex')) {
                updateFullscreenImage();
            }
        };

        const showPrev = () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
            if (fullscreenModal.classList.contains('flex')) {
                updateFullscreenImage();
            }
        };
        
        const openFullscreen = (index) => {
            currentIndex = index;
            updateFullscreenImage();
            fullscreenModal.classList.remove('hidden');
            fullscreenModal.classList.add('flex');
            document.body.style.overflow = 'hidden';
        };

        const closeFullscreen = () => {
            fullscreenModal.classList.add('hidden');
            fullscreenModal.classList.remove('flex');
            document.body.style.overflow = '';
        };

        // Adiciona os ouvintes de eventos para os botões e imagens
        if (nextButton && prevButton) {
            nextButton.addEventListener('click', showNext);
            prevButton.addEventListener('click', showPrev);
        }
        
        carouselImages.forEach((img, index) => {
            img.addEventListener('click', () => openFullscreen(index));
        });

        if (closeFullscreenButton && nextFullscreenButton && prevFullscreenButton) {
            closeFullscreenButton.addEventListener('click', closeFullscreen);
            nextFullscreenButton.addEventListener('click', showNext);
            prevFullscreenButton.addEventListener('click', showPrev);
        }
        
        // Permite fechar a tela cheia com a tecla 'Escape'
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && fullscreenModal.classList.contains('flex')) {
                closeFullscreen();
            }
        });

        // Inicializa a posição do carrossel
        updateCarousel();
    }

    // Ativa o link de navegação correto no header com base na URL atual
    const currentPath = window.location.pathname.split('/').pop();
    if (currentPath === 'images.html' || currentPath === 'gallery-cmt-xv.html') {
        activateNavLink('images.html');
    }
});