/* =========================================
   FAMÍLIA VALENTINE CASSEMIRO
   Retrospectiva Dezembro 2025
   JavaScript Premium
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    
    // ─────────────────────────────────────────
    // CURSOR PERSONALIZADO
    // ─────────────────────────────────────────
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline && window.innerWidth > 1024) {
        let mouseX = 0, mouseY = 0;
        let outlineX = 0, outlineY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });

        const animateCursor = () => {
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;
            cursorOutline.style.left = outlineX + 'px';
            cursorOutline.style.top = outlineY + 'px';
            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        // Efeito hover em elementos interativos
        const interactiveElements = document.querySelectorAll('a, button, .gallery-item, .moment-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorOutline.style.borderColor = 'rgba(196, 163, 90, 0.8)';
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorOutline.style.borderColor = 'rgba(196, 163, 90, 0.5)';
            });
        });
    }

    // ─────────────────────────────────────────
    // INTRO SCREEN & MUSIC
    // ─────────────────────────────────────────
    const introScreen = document.getElementById('introScreen');
    const enterBtn = document.getElementById('enterBtn');
    const mainContent = document.getElementById('mainContent');
    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    
    let isMusicPlaying = false;

    if (enterBtn) {
        enterBtn.addEventListener('click', () => {
            // Esconde intro
            introScreen.classList.add('hidden');
            
            // Mostra conteúdo principal
            setTimeout(() => {
                mainContent.classList.add('visible');
                document.body.style.overflow = 'auto';
            }, 500);

            // Tenta tocar música
            if (bgMusic) {
                bgMusic.volume = 0.4;
                bgMusic.play().then(() => {
                    isMusicPlaying = true;
                    musicToggle.classList.add('playing');
                }).catch(err => {
                    console.log('Autoplay bloqueado:', err);
                });
            }
        });
    }

    // Controle de música
    if (musicToggle && bgMusic) {
        musicToggle.addEventListener('click', () => {
            if (isMusicPlaying) {
                bgMusic.pause();
                isMusicPlaying = false;
                musicToggle.classList.remove('playing');
            } else {
                bgMusic.play().then(() => {
                    isMusicPlaying = true;
                    musicToggle.classList.add('playing');
                }).catch(err => console.log('Erro ao tocar:', err));
            }
        });
    }

    // Pausar música quando a aba não está visível
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && isMusicPlaying && bgMusic) {
            bgMusic.pause();
        } else if (!document.hidden && isMusicPlaying && bgMusic) {
            bgMusic.play();
        }
    });

    // ─────────────────────────────────────────
    // NAVEGAÇÃO
    // ─────────────────────────────────────────
    const mainNav = document.getElementById('mainNav');
    let lastScrollY = 0;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Adiciona classe quando rola
        if (currentScrollY > 100) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
    });

    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ─────────────────────────────────────────
    // REVEAL ON SCROLL
    // ─────────────────────────────────────────
    const revealElements = document.querySelectorAll(
        '.moment-card, .gallery-item, .family-member, .section-intro, .christmas-day, .christmas-eve'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        revealObserver.observe(el);
    });

    // ─────────────────────────────────────────
    // LIGHTBOX
    // ─────────────────────────────────────────
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-nav.prev');
    const lightboxNext = document.querySelector('.lightbox-nav.next');
    const lbTitle = document.querySelector('.lb-title');
    const lbDesc = document.querySelector('.lb-desc');

    const galleryItems = document.querySelectorAll('.gallery-item, .moment-card.mini, .moment-media');
    let currentIndex = 0;
    const images = [];

    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        if (img) {
            const caption = item.querySelector('figcaption, .mini-overlay');
            images.push({
                src: img.src,
                title: caption?.querySelector('.caption-title, .mini-title')?.textContent || '',
                desc: caption?.querySelector('.caption-desc')?.textContent || ''
            });

            item.addEventListener('click', () => {
                currentIndex = index;
                openLightbox();
            });
        }
    });

    function openLightbox() {
        if (images[currentIndex]) {
            lightboxImg.src = images[currentIndex].src;
            lbTitle.textContent = images[currentIndex].title;
            lbDesc.textContent = images[currentIndex].desc;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        openLightbox();
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % images.length;
        openLightbox();
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);
    if (lightboxNext) lightboxNext.addEventListener('click', showNext);

    lightbox?.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Teclado
    document.addEventListener('keydown', (e) => {
        if (!lightbox?.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });

    // Touch swipe
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox?.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    lightbox?.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) showNext();
            else showPrev();
        }
    });

    // ─────────────────────────────────────────
    // PARALLAX SUTIL
    // ─────────────────────────────────────────
    const heroImg = document.querySelector('.hero-img-bg');
    
    if (heroImg && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            heroImg.style.transform = `translateY(${scrolled * 0.3}px)`;
        });
    }

    // ─────────────────────────────────────────
    // IMAGE ERROR HANDLER
    // ─────────────────────────────────────────
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWExYTFhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzQ0NCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbSBhIHNlciBhZGljaW9uYWRhPC90ZXh0Pjwvc3ZnPg==';
            this.alt = 'Imagem a ser adicionada';
        });
    });

    // ─────────────────────────────────────────
    // CONSOLE MESSAGE
    // ─────────────────────────────────────────
    console.log(
        '%c🎄 Família Valentine Cassemiro 🎄\n%cRetrospectiva Dezembro 2025',
        'background: #0a0a0a; color: #c4a35a; font-size: 24px; font-weight: bold; padding: 20px;',
        'background: #0a0a0a; color: #888; font-size: 14px; padding: 10px;'
    );

    // ─────────────────────────────────────────
    // PRELOAD CRITICAL IMAGES
    // ─────────────────────────────────────────
    const preloadImages = [
        'images/galera-lavras.jpg',
        'images/chopeiros.jpg'
    ];

    preloadImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });

});
