import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initLogoAnimation() {
    const logo = document.querySelector('.main-logo');
    const section1 = document.querySelector('.section-1');
    const burgerMenu = document.querySelector('.burger-menu');
    
    if (!logo || !section1) return;

    // Force scroll to top on page load
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    // Create glass background element
    const glassBackground = document.createElement('div');
    glassBackground.className = 'logo-glass-bg';
    document.body.insertBefore(glassBackground, logo);

    // Hide burger and glass background initially
    gsap.set([burgerMenu, glassBackground], { opacity: 0 });

    // Animation values
    const getAnimationValues = () => ({
        logoTop: window.innerWidth < 768 ? '15px' : '20px',
        logoFontSize: window.innerWidth < 768 ? '24px' : '32px',
        initialFontSize: window.innerWidth < 768 ? '32px' : '48px'
    });

    // Set initial logo position
    const setInitialLogoPosition = () => {
        const { initialFontSize } = getAnimationValues();
        gsap.set(logo, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            xPercent: -50,
            yPercent: -50,
            fontSize: initialFontSize,
            opacity: 1
        });
    };

    // Fix mobile viewport height
    const setViewportHeight = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        section1.style.height = `calc(var(--vh, 1vh) * 100)`;
    };

    let isAnimating = false;
    let isLogoAtTop = false;
    let scrollTrigger;
    let glassScrollTrigger;

    // Function to animate logo to top
    const animateLogoToTop = () => {
        if (isAnimating || isLogoAtTop) return;
        isAnimating = true;

        const { logoTop, logoFontSize } = getAnimationValues();
        gsap.to(logo, {
            top: logoTop,
            yPercent: 0,
            fontSize: logoFontSize,
            duration: 0.5,
            ease: 'power2.out',
            onComplete: () => {
                gsap.to([burgerMenu, glassBackground], {
                    opacity: 1,
                    duration: 0.3,
                    ease: 'power2.out',
                    onComplete: () => {
                        isAnimating = false;
                        isLogoAtTop = true;
                    }
                });
            }
        });
    };

    // Function to animate logo to center
    const animateLogoToCenter = () => {
        if (isAnimating || !isLogoAtTop) return;
        isAnimating = true;

        gsap.to([burgerMenu, glassBackground], {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out',
            onComplete: () => {
                const { initialFontSize } = getAnimationValues();
                gsap.to(logo, {
                    top: '50%',
                    yPercent: -50,
                    fontSize: initialFontSize,
                    duration: 0.5,
                    ease: 'power2.out',
                    onComplete: () => {
                        isAnimating = false;
                        isLogoAtTop = false;
                    }
                });
            }
        });
    };

    // Initialize ScrollTrigger for desktop
    const initDesktopScrollTrigger = () => {
        if (scrollTrigger) scrollTrigger.kill();
        if (glassScrollTrigger) glassScrollTrigger.kill();

        scrollTrigger = ScrollTrigger.create({
            trigger: section1,
            start: 'top top',
            end: '+=1',
            onEnter: animateLogoToTop,
            onLeaveBack: animateLogoToCenter
        });

        glassScrollTrigger = ScrollTrigger.create({
            trigger: section1,
            start: 'top -50px',
            end: 'bottom top',
            toggleClass: { targets: glassBackground, className: 'scrolled' }
        });
    };

    // Handle mobile scroll
    const handleMobileScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollThreshold = 50;

        if (scrollTop > scrollThreshold && !isLogoAtTop) {
            animateLogoToTop();
            glassBackground.classList.add('scrolled');
        } else if (scrollTop <= scrollThreshold && isLogoAtTop) {
            animateLogoToCenter();
            glassBackground.classList.remove('scrolled');
        }
    };

    // Clean up scroll handlers
    const cleanupScrollHandlers = () => {
        if (scrollTrigger) scrollTrigger.kill();
        if (glassScrollTrigger) glassScrollTrigger.kill();
        window.removeEventListener('scroll', handleMobileScroll);
    };

    // Initialize based on device
    const initScrollHandlers = () => {
        cleanupScrollHandlers();
        
        if (window.innerWidth >= 768) {
            initDesktopScrollTrigger();
        } else {
            window.addEventListener('scroll', handleMobileScroll, { passive: true });
        }
    };

    // Handle resize with debounce
    let resizeTimeout;
    const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            setViewportHeight();
            initScrollHandlers();
            
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > 50) {
                const { logoTop, logoFontSize } = getAnimationValues();
                gsap.set(logo, {
                    top: logoTop,
                    yPercent: 0,
                    fontSize: logoFontSize
                });
                gsap.set([burgerMenu, glassBackground], { opacity: 1 });
            } else {
                setInitialLogoPosition();
                gsap.set([burgerMenu, glassBackground], { opacity: 0 });
            }
        }, 250);
    };

    // Initialize
    const init = () => {
        setViewportHeight();
        setInitialLogoPosition();
        initScrollHandlers();
    };

    // Event listeners
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', () => {
        setTimeout(handleResize, 100);
    });

    // Initialize
    init();
}
