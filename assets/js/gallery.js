//funções do menu principal e da galeria

function activateNavLink(pageName) {
    // só pra garantir que o nome da página não tenha espaços extras
    const navLinks = document.querySelectorAll('header .hidden.md\\:flex a');

    // tira o efeito de seleção de todos os links do menu
    navLinks.forEach(link => {
        link.classList.remove('text-teal-700', 'font-semibold');
        link.classList.add('text-gray-600');
    });

    // coloca o efeito de seleção no que foi clicado
    const linkToActivate = document.querySelector(`header .hidden.md\\:flex a[href$="${pageName}"]`);
    if (linkToActivate) {
        linkToActivate.classList.remove('text-gray-600');
        linkToActivate.classList.add('text-teal-700', 'font-semibold');
    }
}

// script da galeria
document.addEventListener('DOMContentLoaded', () => {

    // Lógica para o menu mobile (exatamente igual à da página principal)
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // efeito de esconder a header
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

    // Só vamos rodar a lógica da galeria se ela de fato existir na página
    if (slides.length > 0 && fullscreenModal) {
        let currentIndex = 0; // Guarda qual imagem está sendo exibida

        // Atualiza a posição do carrossel movendo ele pra esquerda
        const updateCarousel = () => {
            if (carouselInner) {
                carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
            }
        };

        // Coloca a imagem certa na tela cheia
        const updateFullscreenImage = () => {
            if (fullscreenImage && carouselImages[currentIndex]) {
                fullscreenImage.src = carouselImages[currentIndex].src;
            }
        };

        // Passa para a próxima imagem
        const showNext = () => {
            //efeito de loop
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
            // se a tela cheia estiver aberta, atualiza a imagem lá também
            if (fullscreenModal.classList.contains('flex')) {
                updateFullscreenImage();
            }
        };

        // Volta para a imagem anterior
        const showPrev = () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
            if (fullscreenModal.classList.contains('flex')) {
                updateFullscreenImage();
            }
        };

        // Abre uma imagem em tela cheia
        const openFullscreen = (index) => {
            currentIndex = index;
            updateFullscreenImage();
            fullscreenModal.classList.remove('hidden');
            fullscreenModal.classList.add('flex');
            document.body.style.overflow = 'hidden';
        };

        // Fecha a tela cheia
        const closeFullscreen = () => {
            fullscreenModal.classList.add('hidden');
            fullscreenModal.classList.remove('flex');
            document.body.style.overflow = '';
        };

        // Configura os cliques nos botões e nas imagens
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

        // pra fechar com o esc
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && fullscreenModal.classList.contains('flex')) {
                closeFullscreen();
            }
        });

        // logica inicial do carrossel - faz voltar pro começo
        updateCarousel();
    }

    // link do header dnv
    const currentPath = window.location.pathname.split('/').pop();
    if (currentPath === 'images.html' || currentPath === 'gallery-cmt-xv.html') {
        activateNavLink('images.html');
    }
});