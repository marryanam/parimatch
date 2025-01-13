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

        // Встановлюємо початкові класи
        slides[0].classList.add('active');
        slides[1].classList.add('next');
        slides[2].classList.add('prev');

        // Встановлюємо початкові стилі
        gsap.set('.slide.active', { opacity: 1, rotate: 0, y: '0%' });
        gsap.set('.slide.next', { opacity: 0.6, rotate: 9, y: '20%' });
        gsap.set('.slide.prev', { opacity: 0.8, rotate: 15, y: '-20%' });

        let isAnimating = false;
        let currentIndex = 0;

        const moveSlides = (direction) => {
            if (isAnimating) return;
            
            // Перевіряємо чи можемо рухатись далі
            if (direction > 0 && currentIndex >= slides.length - 1) {
                isSliderActive = false;
                scroll.start();
                return;
            }
            
            if (direction < 0 && currentIndex <= 0) {
                return;
            }

            isAnimating = true;

            const current = slides[currentIndex];
            const next = slides[currentIndex + 1];
            const prev = slides[currentIndex - 1];

            // Анімація переходу
            const tl = gsap.timeline({
                onComplete: () => {
                    isAnimating = false;
                }
            });

            if (direction > 0 && next) {
                // Наступний слайд
                currentIndex++;
                
                tl.to([current, next, prev], { opacity: 0, duration: 0.3 })
                  .set(current, { className: 'slide prev' })
                  .set(next, { className: 'slide active' })
                  .set(prev, { className: 'slide' })
                  .to('.slide.active', { opacity: 1, rotate: 0, y: '0%', duration: 0.5 })
                  .to('.slide.prev', { opacity: 0.8, rotate: 15, y: '-20%', duration: 0.5 }, '<');

                if (slides[currentIndex + 1]) {
                    slides[currentIndex + 1].classList.add('next');
                    tl.to('.slide.next', { opacity: 0.6, rotate: 9, y: '20%', duration: 0.5 }, '<');
                }
            } else if (direction < 0 && prev) {
                // Попередній слайд
                currentIndex--;
                
                tl.to([current, next, prev], { opacity: 0, duration: 0.3 })
                  .set(current, { className: 'slide next' })
                  .set(prev, { className: 'slide active' })
                  .set(next, { className: 'slide' })
                  .to('.slide.active', { opacity: 1, rotate: 0, y: '0%', duration: 0.5 })
                  .to('.slide.next', { opacity: 0.6, rotate: 9, y: '20%', duration: 0.5 }, '<');

                if (slides[currentIndex - 1]) {
                    slides[currentIndex - 1].classList.add('prev');
                    tl.to('.slide.prev', { opacity: 0.8, rotate: 15, y: '-20%', duration: 0.5 }, '<');
                }
            }
        };

        // Обробка подій скролу
        const sliderSection = document.querySelector('.slider-section');
        let isSliderActive = false;

        ScrollTrigger.create({
            trigger: sliderSection,
            scroller: '[data-scroll-container]',
            start: 'top center',
            end: 'bottom center',
            onEnter: () => { isSliderActive = true; scroll.stop(); },
            onEnterBack: () => { isSliderActive = true; scroll.stop(); },
            onLeave: () => { isSliderActive = false; scroll.start(); },
            onLeaveBack: () => { isSliderActive = false; scroll.start(); }
        });

        let lastScrollTime = 0;
        const scrollThreshold = 500; // мс

        // Обробка колеса миші
        window.addEventListener('wheel', (e) => {
            if (!isSliderActive) return;
            e.preventDefault();

            const now = Date.now();
            if (now - lastScrollTime < scrollThreshold) return;
            lastScrollTime = now;

            moveSlides(e.deltaY > 0 ? 1 : -1);
        }, { passive: false });

        // Обробка тач-подій
        let touchStartY = 0;
        window.addEventListener('touchstart', (e) => {
            if (!isSliderActive) return;
            touchStartY = e.touches[0].clientY;
        });

        window.addEventListener('touchmove', (e) => {
            if (!isSliderActive) return;
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