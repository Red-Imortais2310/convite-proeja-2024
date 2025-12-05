// Classe Carousel para gerenciar múltiplas instâncias
class Carousel {
    constructor(containerId, trackId, indicatorsId) {
        this.container = document.getElementById(containerId);
        this.track = document.getElementById(trackId);
        this.indicatorsContainer = document.getElementById(indicatorsId);

        if (!this.container || !this.track || !this.indicatorsContainer) return;

        this.currentSlide = 0;
        this.slidesPerView = this.getSlidesPerView();
        this.updateTotalSlides(); // Calcula total e max slides

        this.init();
    }

    updateTotalSlides() {
        this.totalSlides = this.track.children.length;
        this.maxSlide = Math.ceil(this.totalSlides / this.slidesPerView) - 1;
    }

    getSlidesPerView() {
        if (window.innerWidth <= 480) return 1;
        if (window.innerWidth <= 768) return 2;
        if (window.innerWidth <= 1024) return 3;
        return 4;
    }

    init() {
        this.createIndicators();
        this.updateCarousel();

        // Event Listeners para botões
        const prevBtn = this.container.querySelector('.prev');
        const nextBtn = this.container.querySelector('.next');

        if (prevBtn) {
            // Remove antigos listeners (se houver clone) ou apenas adiciona novo
            prevBtn.onclick = () => this.move(-1);
        }
        if (nextBtn) {
            nextBtn.onclick = () => this.move(1);
        }

        // Resize listener
        window.addEventListener('resize', () => {
            const newSlidesPerView = this.getSlidesPerView();
            if (newSlidesPerView !== this.slidesPerView) {
                this.slidesPerView = newSlidesPerView;
                this.updateTotalSlides();
                this.currentSlide = 0;
                this.createIndicators();
                this.updateCarousel();
            }
        });
    }

    move(direction) {
        this.currentSlide += direction;

        if (this.currentSlide > this.maxSlide) {
            this.currentSlide = 0;
        } else if (this.currentSlide < 0) {
            this.currentSlide = this.maxSlide;
        }

        this.updateCarousel();
        this.updateIndicators();
    }

    updateCarousel() {
        const slide = this.track.querySelector('.carousel-slide');
        if (!slide) return;

        // Calcula largura real + gap
        const style = window.getComputedStyle(this.track);
        const gap = parseFloat(style.gap) || 16;
        const slideWidth = slide.offsetWidth + gap;

        const offset = -this.currentSlide * slideWidth * this.slidesPerView;
        this.track.style.transform = `translateX(${offset}px)`;
    }

    createIndicators() {
        this.indicatorsContainer.innerHTML = '';

        for (let i = 0; i <= this.maxSlide; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            if (i === this.currentSlide) indicator.classList.add('active');

            indicator.addEventListener('click', () => {
                this.currentSlide = i;
                this.updateCarousel();
                this.updateIndicators();
            });

            this.indicatorsContainer.appendChild(indicator);
        }
    }

    updateIndicators() {
        const indicators = this.indicatorsContainer.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', function () {
    // Inicializa os carrosséis
    // const carouselAlunos = new Carousel('carousel-alunos', 'carouselTrack-alunos', 'carouselIndicators-alunos');
    const carouselEventos = new Carousel('carousel-eventos', 'carouselTrack-eventos', 'carouselIndicators-eventos');
    const carouselImagens2 = new Carousel('carousel-imagens2', 'carouselTrack-imagens2', 'carouselIndicators-imagens2');

    // Controle de pausa do auto-play
    let isPaused = false;

    // Auto-play com controle de pausa
    setInterval(() => {
        if (!isPaused) {
            // if (carouselAlunos) carouselAlunos.move(1);
            if (carouselEventos) carouselEventos.move(1);
            if (carouselImagens2) carouselImagens2.move(1);
        }
    }, 5000);

    // Pausar carrossel ao passar mouse sobre imagens
    const carouselImages = document.querySelectorAll('.carousel-slide img');
    carouselImages.forEach(img => {
        img.addEventListener('mouseenter', () => {
            isPaused = true;
        });

        img.addEventListener('mouseleave', () => {
            isPaused = false;
        });
    });

    // Animação de fade-in nos cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const cards = document.querySelectorAll('.evento-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
});

// Função para scroll suave
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    const headerHeight = document.querySelector('.header').offsetHeight;

    if (section) {
        window.scrollTo({
            top: section.offsetTop - headerHeight,
            behavior: 'smooth'
        });
    }
}

// Smooth scrolling para links de navegação
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        scrollToSection(targetId);
    });
});

// Parallax suave
window.addEventListener('scroll', function () {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');

    if (heroContent) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Funções do Popup de Professores
function openParticipantesPopup() {
    const popup = document.getElementById('participantesPopup');
    if (popup) {
        popup.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeParticipantesPopup() {
    const popup = document.getElementById('participantesPopup');
    if (popup) {
        popup.style.display = 'none';
        document.body.style.overflow = 'auto';

        // Remove todas as seleções
        const selectedCards = document.querySelectorAll('.professor-card.selected');
        selectedCards.forEach(card => card.classList.remove('selected'));
    }
}

// Função para selecionar professor com efeito
function selectProfessor(card) {
    // Toggle da seleção
    card.classList.toggle('selected');

    // Efeito de click
    card.style.transform = 'scale(0.95)';
    setTimeout(() => {
        card.style.transform = '';
    }, 150);

    // Opcional: log dos professores selecionados
    const selectedProfessors = document.querySelectorAll('.professor-card.selected h3');
    const selectedNames = Array.from(selectedProfessors).map(h3 => h3.textContent);
    console.log('Professores selecionados:', selectedNames);
}

// Fechar popup clicando fora
window.addEventListener('click', function (e) {
    const popup = document.getElementById('participantesPopup');
    if (e.target === popup) {
        closeParticipantesPopup();
    }
});

// Fechar com ESC
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeParticipantesPopup();
    }
});


// Fechar popup ao clicar fora
window.onclick = function (event) {
    const popup = document.getElementById('participantesPopup');
    if (event.target == popup) {
        closeParticipantesPopup();
    }
}
// Toggle menu mobile simples
function toggleMenu() {
    const nav = document.querySelector('.nav');
    const toggle = document.querySelector('.mobile-toggle');

    nav.classList.toggle('active');
    toggle.classList.toggle('active');
}

// Efeito scroll simples
window.addEventListener('scroll', function () {
    const header = document.querySelector('.header');

    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Navegação ativa simples
document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // Remove active de todos
            navLinks.forEach(l => l.classList.remove('active'));
            // Adiciona active no clicado
            this.classList.add('active');

            // Fecha menu mobile se estiver aberto
            document.querySelector('.nav').classList.remove('active');
            document.querySelector('.mobile-toggle').classList.remove('active');
        });
    });
});



// Hero Background Carousel Auto-Play
document.addEventListener('DOMContentLoaded', function () {
    const bgSlides = document.querySelectorAll('.bg-slide');
    if (bgSlides.length > 0) {
        let currentBgSlide = 0;

        function nextBackgroundSlide() {
            // Remove active da slide atual
            bgSlides[currentBgSlide].classList.remove('active');

            // Incrementa e faz loop
            currentBgSlide = (currentBgSlide + 1) % bgSlides.length;

            // Adiciona active na próxima slide
            bgSlides[currentBgSlide].classList.add('active');
        }

        // Troca a cada 5 segundos
        setInterval(nextBackgroundSlide, 5000);
    }
});
