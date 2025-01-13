import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger.js';
import LocomotiveScroll from 'locomotive-scroll';

gsap.registerPlugin(ScrollTrigger);

export const initSliderCards = () => {
    // Ініціалізація Locomotive Scroll
    const scroll = new LocomotiveScroll({
        el: document.querySelector('[data-scroll-container]'),
        smooth: true,
        multiplier: 1,
        lerp: 0.05,
        getDirection: true,
        getSpeed: true,
        class: 'is-revealed',
        reloadOnContextChange: false,
        touchMultiplier: 1.5,
        smoothMobile: false,
        resetNativeScroll: true
    });

    // Синхронізація ScrollTrigger
    scroll.on('scroll', ScrollTrigger.update);

    ScrollTrigger.scrollerProxy('[data-scroll-container]', {
        scrollTop(value) {
            return arguments.length ? scroll.scrollTo(value) : scroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
        }
    });

    // Ініціалізація слайдера
    const initializeSlider = () => {
        const slides = gsap.utils.toArray('.slide');
        if (slides.length < 3) return;

        let isAnimating = false;
        let currentIndex = 0;
        let isSliderActive = false;
        let isTransitioning = false;

        // Встановлюємо початкові класи та стилі
        const updateSlideClasses = () => {
            slides.forEach((slide, index) => {
                slide.className = 'slide';
                if (index === currentIndex) {
                    slide.classList.add('active');
                    gsap.to(slide, { opacity: 1, rotate: 0, y: '0%', duration: 0.5 });
                } else if (index === currentIndex + 1) {
                    slide.classList.add('next');
                    gsap.to(slide, { opacity: 0.6, rotate: 9, y: '20%', duration: 0.5 });
                } else if (index === currentIndex - 1) {
                    slide.classList.add('prev');
                    gsap.to(slide, { opacity: 0.8, rotate: 15, y: '-20%', duration: 0.5 });
                } else {
                    gsap.to(slide, { opacity: 0, duration: 0.5 });
                }
            });
        };

        updateSlideClasses();

        const moveSlides = (direction) => {
            if (isAnimating || isTransitioning) return;
            
            if (direction > 0 && currentIndex >= slides.length - 1) {
                isSliderActive = false;
                isTransitioning = true;
                gsap.delayedCall(0.5, () => {
                    scroll.start();
                    isTransitioning = false;
                });
                return;
            }
            
            if (direction < 0 && currentIndex <= 0) {
                return;
            }

            isAnimating = true;
            currentIndex += direction;
            
            gsap.timeline({
                onComplete: () => {
                    isAnimating = false;
                    updateSlideClasses();
                }
            });
        };

        // Обробка подій скролу
        const sliderSection = document.querySelector('.slider-section');
        
        ScrollTrigger.create({
            trigger: sliderSection,
            scroller: '[data-scroll-container]',
            start: 'top center',
            end: 'bottom center',
            onEnter: () => {
                if (!isTransitioning) {
                    isSliderActive = true;
                    scroll.stop();
                }
            },
            onEnterBack: () => {
                if (!isTransitioning) {
                    isSliderActive = true;
                    scroll.stop();
                    currentIndex = slides.length - 1;
                    updateSlideClasses();
                }
            },
            onLeave: () => {
                isSliderActive = false;
                scroll.start();
            },
            onLeaveBack: () => {
                isSliderActive = false;
                scroll.start();
            }
        });

        let lastScrollTime = 0;
        const scrollThreshold = 800; // Збільшено поріг

        // Обробка колеса миші
        window.addEventListener('wheel', (e) => {
            if (!isSliderActive || isTransitioning) return;
            e.preventDefault();

            const now = Date.now();
            if (now - lastScrollTime < scrollThreshold) return;
            lastScrollTime = now;

            moveSlides(e.deltaY > 0 ? 1 : -1);
        }, { passive: false });

        // Обробка тач-подій
        let touchStartY = 0;
        let isTouching = false;

        window.addEventListener('touchstart', (e) => {
            if (!isSliderActive || isTransitioning) return;
            touchStartY = e.touches[0].clientY;
            isTouching = true;
        });

        window.addEventListener('touchmove', (e) => {
            if (!isSliderActive || !isTouching || isTransitioning) return;
            
            const now = Date.now();
            if (now - lastScrollTime < scrollThreshold) return;

            const touchEndY = e.touches[0].clientY;
            const deltaY = touchStartY - touchEndY;

            if (Math.abs(deltaY) > 50) {
                lastScrollTime = now;
                moveSlides(deltaY > 0 ? 1 : -1);
                touchStartY = touchEndY;
            }
        });

        window.addEventListener('touchend', () => {
            isTouching = false;
        });
    };

    // Ініціалізуємо слайдер
    initializeSlider();
    ScrollTrigger.refresh();

    // Оновлення при зміні розміру вікна
    window.addEventListener('resize', () => {
        scroll.update();
        ScrollTrigger.refresh();
    });

    return scroll;
}; 