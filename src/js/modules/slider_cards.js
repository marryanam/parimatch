import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger.js';
import LocomotiveScroll from 'locomotive-scroll';

gsap.registerPlugin(ScrollTrigger);

export const initSliderCards = () => {
    const scroll = new LocomotiveScroll({
        el: document.querySelector('[data-scroll-container]'),
        smooth: true,
        multiplier: 1,
        lerp: 0.05,
        getDirection: true,
        getSpeed: true,
        class: 'is-revealed',
        reloadOnContextChange: true,
        touchMultiplier: 1.5,
        smoothMobile: true,
        resetNativeScroll: true
    });

    scroll.on('scroll', ScrollTrigger.update);

    ScrollTrigger.scrollerProxy('[data-scroll-container]', {
        scrollTop(value) {
            return arguments.length ? scroll.scrollTo(value) : scroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
        }
    });

    const slides = gsap.utils.toArray('.slide');
    if (!slides || slides.length < 2) return;

    let isAnimating = false;
    let currentIndex = 0;
    let isSliderInView = false;
    let isScrollBlocked = false;
    const sliderSection = document.querySelector('.slider-section');
    if (!sliderSection) return;

    // Initial setup of slides
    slides.forEach((slide, index) => {
        slide.className = 'slide';
        const paths = slide.querySelectorAll('svg *');
        
        if (index === currentIndex) {
            slide.classList.add('active');
            gsap.set(slide, {
                opacity: 1,
                rotateZ: 0,
                y: '0%',
                x: '0%',
                left: '0',
                top: '15%',
                scale: 1,
                filter: 'brightness(1.2)',
                zIndex: 3
            });
            gsap.set(paths, {
                opacity: 0,
                y: 30,
                duration: 0
            });
            gsap.to(paths, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.03,
                ease: 'power2.out',
                delay: 0.2
            });
        } else if (index === currentIndex + 1) {
            slide.classList.add('next');
            gsap.set(slide, {
                opacity: 0.8,
                rotateZ: 12,
                y: '15%',
                x: '-3%',
                left: '0',
                top: '-5%',
                scale: 0.98,
                filter: 'brightness(1.1)',
                zIndex: 2
            });
            gsap.set(paths, {
                opacity: 0,
                y: 30
            });
        } else if (index === currentIndex - 1) {
            slide.classList.add('prev');
            gsap.set(slide, {
                opacity: 0.8,
                rotateZ: 17,
                y: '-15%',
                x: '3%',
                left: '0',
                top: '20%',
                scale: 0.98,
                filter: 'brightness(1.1)',
                zIndex: 1
            });
            gsap.set(paths, {
                opacity: 0,
                y: 30
            });
        } else {
            gsap.set(slide, {
                opacity: 0.7,
                scale: 0.95,
                filter: 'brightness(1)',
                zIndex: 0
            });
            gsap.set(paths, {
                opacity: 0,
                y: 30
            });
        }
    });

    const nextSlide = () => {
        if (isAnimating || currentIndex >= slides.length - 1) return false;
        
        isAnimating = true;
        currentIndex++;
        
        updateSlides(1);
        return true;
    };

    const prevSlide = () => {
        if (isAnimating || currentIndex <= 0) return false;
        
        isAnimating = true;
        currentIndex--;
        
        updateSlides(-1);
        return true;
    };

    const updateSlides = (direction) => {
        slides.forEach((slide, index) => {
            slide.className = 'slide';
            const paths = slide.querySelectorAll('svg *');
            
            if (index === currentIndex) {
                slide.classList.add('active');
                gsap.to(slide, {
                    opacity: 1,
                    rotateZ: 0,
                    y: '0%',
                    x: '0%',
                    left: '0',
                    top: '15%',
                    scale: 1,
                    filter: 'brightness(1.2)',
                    duration: 0.5,
                    ease: 'power2.out',
                    zIndex: 3
                });
                gsap.to(paths, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.03,
                    ease: 'power2.out',
                    delay: 0.2
                });
            } else if (index === currentIndex + 1) {
                slide.classList.add('next');
                gsap.to(slide, {
                    opacity: 0.8,
                    rotateZ: 12,
                    y: '15%',
                    x: '-3%',
                    left: '0',
                    top: '-5%',
                    scale: 0.98,
                    filter: 'brightness(1.1)',
                    duration: 0.5,
                    ease: 'power2.out',
                    zIndex: 2
                });
                gsap.to(paths, {
                    opacity: 0,
                    y: 30,
                    duration: 0.4,
                    ease: 'power2.in'
                });
            } else if (index === currentIndex - 1) {
                slide.classList.add('prev');
                gsap.to(slide, {
                    opacity: 0.8,
                    rotateZ: 17,
                    y: '-15%',
                    x: '3%',
                    left: '0',
                    top: '20%',
                    scale: 0.98,
                    filter: 'brightness(1.1)',
                    duration: 0.5,
                    ease: 'power2.out',
                    zIndex: 1
                });
                gsap.to(paths, {
                    opacity: 0,
                    y: 30,
                    duration: 0.4,
                    ease: 'power2.in'
                });
            } else {
                gsap.to(slide, {
                    opacity: 0.7,
                    scale: 0.95,
                    filter: 'brightness(1)',
                    zIndex: 0
                });
                gsap.to(paths, {
                    opacity: 0,
                    y: 30,
                    duration: 0.4,
                    ease: 'power2.in'
                });
            }
        });

        setTimeout(() => {
            isAnimating = false;
            
            // If we're at the last slide and scrolling down, or at the first slide and scrolling up
            if ((currentIndex === slides.length - 1 && direction > 0) || 
                (currentIndex === 0 && direction < 0)) {
                setTimeout(() => {
                    unblockScroll();
                }, 800);
            }
        }, 1000);
    };

    const handleWheel = (e) => {
        if (!isSliderInView || !isScrollBlocked || isAnimating) return;
        e.preventDefault();

        const direction = Math.sign(e.deltaY);
        
        if (direction > 0) {
            if (!nextSlide() && currentIndex === slides.length - 1) {
                setTimeout(() => {
                    unblockScroll();
                }, 300);
            }
        } else {
            if (!prevSlide() && currentIndex === 0) {
                setTimeout(() => {
                    unblockScroll();
                }, 300);
            }
        }
    };

    const centerSlider = () => {
        const sliderRect = sliderSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const targetPosition = (viewportHeight - sliderRect.height) / 2;
        
        scroll.scrollTo(sliderSection, {
            offset: -targetPosition,
            duration: 800,
            disableLerp: false
        });
    };

    const blockScroll = () => {
        if (!isScrollBlocked) {
            isScrollBlocked = true;
            scroll.stop();
            centerSlider();
        }
    };

    const unblockScroll = () => {
        if (isScrollBlocked) {
            isScrollBlocked = false;
            scroll.start();
            isSliderInView = false;
        }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    let touchStartY = 0;
    let isTouching = false;

    window.addEventListener('touchstart', (e) => {
        if (!isSliderInView || !isScrollBlocked) return;
        e.preventDefault();
        touchStartY = e.touches[0].clientY;
        isTouching = true;
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
        if (!isSliderInView || !isScrollBlocked || !isTouching || isAnimating) return;
        e.preventDefault();
        
        const touchEndY = e.touches[0].clientY;
        const deltaY = touchStartY - touchEndY;
        touchStartY = touchEndY;

        handleWheel({ deltaY, preventDefault: () => {} });
    }, { passive: false });

    window.addEventListener('touchend', (e) => {
        if (!isSliderInView || !isScrollBlocked) return;
        e.preventDefault();
        isTouching = false;
    }, { passive: false });

    ScrollTrigger.create({
        trigger: sliderSection,
        scroller: '[data-scroll-container]',
        start: 'top 45%',
        end: 'bottom 55%',
        onEnter: () => {
            isSliderInView = true;
            blockScroll();
        },
        onEnterBack: () => {
            isSliderInView = true;
            blockScroll();
        },
        onLeave: unblockScroll,
        onLeaveBack: unblockScroll
    });

    const style = document.createElement('style');
    style.textContent = `
        html {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        html::-webkit-scrollbar {
            display: none;
        }
        body {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        body::-webkit-scrollbar {
            display: none;
        }
    `;
    document.head.appendChild(style);

    const initializeSlider = () => {
        const isMobile = window.innerWidth <= 768;
        const animationDuration = isMobile ? 0.3 : 0.5;
        const animationEase = isMobile ? 'power1.out' : 'power2.inOut';

        const updateMousePosition = (e, slide) => {
            const rect = slide.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            slide.style.setProperty('--mouse-x', `${x}%`);
            slide.style.setProperty('--mouse-y', `${y}%`);
        };

        slides.forEach(slide => {
            slide.addEventListener('mousemove', (e) => {
                updateMousePosition(e, slide);
            });

            slide.addEventListener('mouseleave', () => {
                slide.style.setProperty('--mouse-x', '50%');
                slide.style.setProperty('--mouse-y', '50%');
            });
        });

        const animateText = (slide) => {
            const slideInner = slide.querySelector('.slide-inner');
            if (!slideInner) return;
            
            // Don't clear the content, just animate the paths
            const paths = slideInner.querySelectorAll('path');
            paths.forEach((path, index) => {
                gsap.set(path, {
                    opacity: 0,
                    y: 30
                });
                gsap.to(path, {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    ease: 'power2.out',
                    delay: index * 0.03
                });
            });
        };

        slides.forEach((slide, index) => {
            if (index === currentIndex) {
                const slideInner = slide.querySelector('.slide-inner');
                if (slideInner) {
                    animateText(slide);
                }
            }
        });
    };

    initializeSlider();
    ScrollTrigger.refresh();

    window.addEventListener('resize', () => {
        scroll.update();
        ScrollTrigger.refresh();
    });

    return scroll;
};