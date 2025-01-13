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
        let isSliderInView = false;
        const sliderSection = document.querySelector('.slider-section');
        let accumulatedDelta = 0;

        const updateSlides = (delta) => {
            const direction = delta > 0 ? 1 : -1;
            const progress = Math.min(Math.abs(accumulatedDelta) / 1000, 1);

            slides.forEach((slide, index) => {
                if (index === currentIndex) {
                    // Активна картка - значний рух
                    gsap.to(slide, {
                        opacity: 1,
                        rotate: direction * progress * 90,
                        y: direction * progress * -100 + '%',
                        duration: 0.1,
                        zIndex: 3
                    });
                } 
                
                if (direction > 0) {
                    // При скролі вниз
                    if (index === currentIndex + 1) {
                        // Наступна картка - мінімальний рух
                        gsap.to(slide, {
                            opacity: 1,
                            rotate: 15,
                            y: '20%',
                            left: '13%',
                            top: '-3%',
                            zIndex: 2,
                            duration: 0.1
                        });
                    } else if (index === currentIndex - 1) {
                        // Попередня картка - мінімальний рух
                        gsap.to(slide, {
                            opacity: 1,
                            rotate: 25,
                            y: '-20%',
                            left: '10%',
                            top: '17%',
                            zIndex: 1,
                            duration: 0.1
                        });
                    }
                } else {
                    // При скролі вверх
                    if (index === currentIndex - 1) {
                        // Попередня картка - мінімальний рух
                        gsap.to(slide, {
                            opacity: 1,
                            rotate: 25,
                            y: '-20%',
                            left: '10%',
                            top: '17%',
                            zIndex: 2,
                            duration: 0.1
                        });
                    } else if (index === currentIndex + 1) {
                        // Наступна картка - мінімальний рух
                        gsap.to(slide, {
                            opacity: 1,
                            rotate: 15,
                            y: '20%',
                            left: '13%',
                            top: '-3%',
                            zIndex: 1,
                            duration: 0.1
                        });
                    }
                }

                // Інші картки
                if (Math.abs(index - currentIndex) > 1) {
                    gsap.to(slide, {
                        opacity: 1,
                        duration: 0.1,
                        zIndex: 0
                    });
                }
            });

            if (Math.abs(accumulatedDelta) > 400 && !isAnimating) {
                const nextIndex = currentIndex + (direction > 0 ? 1 : -1);
                if (nextIndex >= 0 && nextIndex < slides.length) {
                    isAnimating = true;
                    currentIndex = nextIndex;
                    accumulatedDelta = 0;

                    // Спочатку оновлюємо класи
                    slides.forEach((slide, index) => {
                        slide.className = 'slide';
                        if (index === currentIndex) {
                            slide.classList.add('active');
                            // Повертаємо активний слайд в дефолтну позицію
                            gsap.to(slide, {
                                opacity: 1,
                                rotate: 0,
                                y: '0%',
                                left: '15%',
                                top: '15%',
                                zIndex: 3,
                                duration: 0.3
                            });
                        } else if (index === currentIndex + 1) {
                            slide.classList.add('next');
                            // Дефолтна позиція для next слайду
                            gsap.to(slide, {
                                opacity: 1,
                                rotate: 15,
                                y: '20%',
                                left: '13%',
                                top: '-3%',
                                zIndex: 2,
                                duration: 0.3
                            });
                        } else if (index === currentIndex - 1) {
                            slide.classList.add('prev');
                            // Дефолтна позиція для prev слайду
                            gsap.to(slide, {
                                opacity: 1,
                                rotate: 25,
                                y: '-20%',
                                left: '10%',
                                top: '17%',
                                zIndex: 1,
                                duration: 0.3
                            });
                        } else {
                            // Ховаємо інші слайди
                            gsap.to(slide, {
                                opacity: 1,
                                zIndex: 0,
                                duration: 0.3
                            });
                        }
                    });

                    setTimeout(() => {
                        isAnimating = false;
                    }, 300);
                }
            }
        };

        const canScroll = (direction) => {
            return (direction > 0 && currentIndex >= slides.length - 1) || 
                   (direction < 0 && currentIndex === 0);
        };

        // Обробка колеса миші
        window.addEventListener('wheel', (e) => {
            if (!isSliderInView) return;

            const direction = e.deltaY > 0 ? 1 : -1;
            
            if (!canScroll(direction)) {
                e.preventDefault();
                accumulatedDelta += e.deltaY * 0.8;
                updateSlides(e.deltaY);
            } else {
                scroll.start();
            }
        }, { passive: false });

        // Обробка тач-подій
        let touchStartY = 0;
        let isTouching = false;

        window.addEventListener('touchstart', (e) => {
            if (!isSliderInView) return;
            touchStartY = e.touches[0].clientY;
            isTouching = true;
            accumulatedDelta = 0;
        });

        window.addEventListener('touchmove', (e) => {
            if (!isSliderInView || !isTouching) return;
            
            const touchEndY = e.touches[0].clientY;
            const deltaY = touchStartY - touchEndY;
            const direction = deltaY > 0 ? 1 : -1;

            if (!canScroll(direction)) {
                e.preventDefault();
                accumulatedDelta += deltaY * 0.8;
                updateSlides(deltaY);
            } else {
                scroll.start();
            }
        });

        window.addEventListener('touchend', () => {
            if (isTouching && isSliderInView) {
                if (Math.abs(accumulatedDelta) < 400) {
                    slides.forEach((slide, index) => {
                        if (index === currentIndex) {
                            gsap.to(slide, {
                                opacity: 1,
                                rotate: 0,
                                y: '0%',
                                duration: 0.3
                            });
                        } else if (index === currentIndex + 1) {
                            gsap.to(slide, {
                                opacity: 1,
                                rotate: 9,
                                y: '20%',
                                duration: 0.3
                            });
                        } else if (index === currentIndex - 1) {
                            gsap.to(slide, {
                                opacity: 1,
                                rotate: 15,
                                y: '-20%',
                                duration: 0.3
                            });
                        }
                    });
                }
                accumulatedDelta = 0;
            }
            isTouching = false;
        });

        // Створюємо ScrollTrigger для контролю входу в секцію
        ScrollTrigger.create({
            trigger: sliderSection,
            scroller: '[data-scroll-container]',
            start: 'top center',
            end: 'bottom center',
            onEnter: () => {
                isSliderInView = true;
                scroll.stop();
            },
            onEnterBack: () => {
                isSliderInView = true;
                scroll.stop();
            },
            onLeave: () => {
                isSliderInView = false;
                scroll.start();
            },
            onLeaveBack: () => {
                isSliderInView = false;
                scroll.start();
            }
        });

        // Початкова ініціалізація класів
        slides.forEach((slide, index) => {
            slide.className = 'slide';
            if (index === currentIndex) {
                slide.classList.add('active');
            } else if (index === currentIndex + 1) {
                slide.classList.add('next');
            } else if (index === currentIndex - 1 || (currentIndex === 0 && index === slides.length - 1)) {
                slide.classList.add('prev');
            }
        });

        // Встановлюємо початкові стилі для prev слайду
        if (slides[slides.length - 1]) {
            gsap.set(slides[slides.length - 1], {
                opacity: 1,
                rotate: 15,
                y: '-20%',
                left: '10%',
                top: '17%',
                zIndex: 1
            });
        }
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