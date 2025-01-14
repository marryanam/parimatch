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
        const slides = gsap.utils.toArray('.slide');
        if (!slides || slides.length < 2) return;

        let isAnimating = false;
        let currentIndex = 0;
        let isSliderInView = false;
        const sliderSection = document.querySelector('.slider-section');
        if (!sliderSection) return;

        let accumulatedDelta = 0;
        let isScrollBlocked = false;

        slides.forEach((slide, index) => {
            slide.className = 'slide';
            if (index === currentIndex) {
                slide.classList.add('active');
                gsap.set(slide, {
                    opacity: 1,
                    rotateZ: 0,
                    y: '0%',
                    x: '0%',
                    left: '15%',
                    top: '15%',
                    scale: 1,
                    filter: 'brightness(1.2)',
                    zIndex: 3,
                    backgroundColor: 'rgba(0, 0, 0, 1)'
                });
            } else if (index === currentIndex + 1) {
                slide.classList.add('next');
                gsap.set(slide, {
                    opacity: 0.8,
                    rotateZ: 12,
                    y: '15%',
                    x: '-3%',
                    left: '13%',
                    top: '-5%',
                    scale: 0.98,
                    filter: 'brightness(1.1)',
                    zIndex: 2
                });
            } else if (index === currentIndex - 1) {
                slide.classList.add('prev');
                gsap.set(slide, {
                    opacity: 0.8,
                    rotateZ: 17,
                    y: '-15%',
                    x: '3%',
                    left: '12%',
                    top: '20%',
                    scale: 0.98,
                    filter: 'brightness(1.1)',
                    zIndex: 1
                });
            } else {
                gsap.set(slide, {
                    opacity: 0.7,
                    scale: 0.95,
                    filter: 'brightness(1)',
                    zIndex: 0
                });
            }
        });

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
            const text = slideInner.textContent.trim();
            slideInner.textContent = '';
            
            // Спеціальна обробка для першого слайду
            if (text.includes('A 30-YEAR')) {
                const lines = [
                    ['A', '30-YEAR'],
                    ['HISTORY', 'OF'],
                    ['SUCCESS']
                ];
                let totalChars = 0;
                
                lines.forEach((line, lineIndex) => {
                    const lineContainer = document.createElement('div');
                    lineContainer.className = 'line';
                    
                    line.forEach((word, wordIndex) => {
                        const wordContainer = document.createElement('span');
                        wordContainer.className = 'word';
                        
                        [...word].forEach((char) => {
                            const span = document.createElement('span');
                            span.textContent = char;
                            span.style.setProperty('--char-index', totalChars);
                            wordContainer.appendChild(span);
                            totalChars++;
                        });
                        
                        lineContainer.appendChild(wordContainer);
                        
                        if (wordIndex < line.length - 1) {
                            const space = document.createElement('span');
                            space.textContent = ' ';
                            space.className = 'space';
                            lineContainer.appendChild(space);
                        }
                    });
                    
                    slideInner.appendChild(lineContainer);
                    
                });
            } else {
                // Для інших слайдів
                const words = text.split(' ');
                let totalChars = 0;
                
                const lineContainer = document.createElement('div');
                lineContainer.className = 'line';
                
                words.forEach((word, wordIndex) => {
                    const wordContainer = document.createElement('span');
                    wordContainer.className = 'word';
                    
                    [...word].forEach((char) => {
                        const span = document.createElement('span');
                        span.textContent = char;
                        span.style.setProperty('--char-index', totalChars);
                        wordContainer.appendChild(span);
                        totalChars++;
                    });
                    
                    lineContainer.appendChild(wordContainer);
                    
                    if (wordIndex < words.length - 1) {
                        const space = document.createElement('span');
                        space.textContent = ' ';
                        space.className = 'space';
                        lineContainer.appendChild(space);
                    }
                });
                
                slideInner.appendChild(lineContainer);
            }

            // Запускаємо анімацію з невеликою затримкою
            setTimeout(() => {
                const spans = slideInner.querySelectorAll('span:not(.space):not(.word)');
                spans.forEach(span => span.classList.add('animate'));
            }, 100);
        };

        const updateSlides = (delta) => {
            if (isAnimating || slides.length < 2) return;
            
            const direction = delta > 0 ? 1 : -1;
            const nextIndex = currentIndex + direction;
            
            if (nextIndex < 0 || nextIndex >= slides.length) return;

            const progress = Math.min(Math.abs(accumulatedDelta) / 1500, 1);

            slides.forEach((slide, index) => {
                if (index === currentIndex) {
                    const slideInner = slide.querySelector('.slide-inner');
                    slideInner.style.animation = 'none';
                    slideInner.offsetHeight;
                    slideInner.style.animation = null;
                    
                    gsap.to(slide, {
                        opacity: 1,
                        rotateZ: direction * progress * 12,
                        y: direction * progress * -40 + '%',
                        scale: 1,
                        filter: 'brightness(1.2)',
                        duration: 0.3,
                        ease: 'power2.out',
                        zIndex: 3
                    });
                } 
                
                if (direction > 0 && index === currentIndex + 1) {
                    gsap.to(slide, {
                        opacity: 0.95,
                        rotateZ: 12,
                        y: '15%',
                        x: '-3%',
                        scale: 0.98,
                        filter: 'brightness(1.1)',
                        left: '13%',
                        top: '-5%',
                        duration: 0.3,
                        ease: 'power2.out',
                        zIndex: 2
                    });
                }
                
                if (direction < 0 && index === currentIndex - 1) {
                    gsap.to(slide, {
                        opacity: 0.95,
                        rotateZ: 17,
                        y: '-15%',
                        x: '3%',
                        scale: 0.98,
                        filter: 'brightness(1.1)',
                        left: '12%',
                        top: '20%',
                        duration: 0.3,
                        ease: 'power2.out',
                        zIndex: 1
                    });
                }
            });

            if (Math.abs(accumulatedDelta) > 600 && !isAnimating) {
                const nextIndex = currentIndex + (direction > 0 ? 1 : -1);
                if (nextIndex >= 0 && nextIndex < slides.length) {
                    isAnimating = true;
                    currentIndex = nextIndex;
                    accumulatedDelta = 0;

                    slides.forEach((slide, index) => {
                        slide.className = 'slide';
                        if (index === currentIndex) {
                            slide.classList.add('active');
                            gsap.to(slide, {
                                opacity: 1,
                                rotateZ: 0,
                                y: '0%',
                                x: '0%',
                                left: '15%',
                                top: '15%',
                                scale: 1,
                                filter: 'brightness(1.2)',
                                duration: 0.5,
                                ease: 'power2.inOut',
                                zIndex: 3,
                                onComplete: () => {
                                    animateText(slide);
                                }
                            });
                        } else if (index === currentIndex + 1) {
                            slide.classList.add('next');
                            gsap.to(slide, {
                                opacity: 0.95,
                                rotateZ: 12,
                                y: '15%',
                                x: '-3%',
                                left: '13%',
                                top: '-5%',
                                scale: 0.98,
                                filter: 'brightness(1.1)',
                                duration: 0.5,
                                ease: 'power2.inOut',
                                zIndex: 2
                            });
                        } else if (index === currentIndex - 1) {
                            slide.classList.add('prev');
                            gsap.to(slide, {
                                opacity: 0.95,
                                rotateZ: 17,
                                y: '-15%',
                                x: '3%',
                                left: '12%',
                                top: '20%',
                                scale: 0.98,
                                filter: 'brightness(1.1)',
                                duration: 0.5,
                                ease: 'power2.inOut',
                                zIndex: 1
                            });
                        } else {
                            gsap.to(slide, {
                                opacity: 0.9,
                                scale: 0.95,
                                filter: 'brightness(1)',
                                duration: 0.5,
                                ease: 'power2.inOut',
                                zIndex: 0
                            });
                        }
                    });

                    setTimeout(() => {
                        isAnimating = false;
                    }, 600);
                }
            }
        };

        const shouldUnblockScroll = () => {
            const direction = Math.sign(accumulatedDelta);
            const isLastSlide = currentIndex === slides.length - 1;
            const isFirstSlide = currentIndex === 0;

            // Для скролу вниз
            if (direction > 0 && isLastSlide) {
                setTimeout(() => {
                    unblockScroll();
                }, 300);
                return true;
            }
            
            // Для скролу вгору
            if (direction < 0 && isFirstSlide) {
                setTimeout(() => {
                    unblockScroll();
                }, 300);
                return true;
            }
            
            return false;
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
                centerSlider();
                scroll.stop();
            }
        };

        const unblockScroll = () => {
            if (isScrollBlocked) {
                isScrollBlocked = false;
                scroll.start();
                isSliderInView = false;
            }
        };

        const handleWheel = (e) => {
            if (!isSliderInView || !isScrollBlocked || isAnimating) return;
            e.preventDefault();

            accumulatedDelta += e.deltaY;

            if (shouldUnblockScroll()) {
                accumulatedDelta = 0;
                return;
            }

            updateSlides(accumulatedDelta);
        };

        window.addEventListener('wheel', handleWheel, { passive: false });

        let touchStartY = 0;
        let isTouching = false;

        window.addEventListener('touchstart', (e) => {
            if (!isSliderInView) return;
            e.preventDefault();
            touchStartY = e.touches[0].clientY;
            isTouching = true;
            accumulatedDelta = 0;
        }, { passive: false });

        window.addEventListener('touchmove', (e) => {
            if (!isSliderInView || !isTouching || !isScrollBlocked || isAnimating) return;
            e.preventDefault();
            
            const touchEndY = e.touches[0].clientY;
            const deltaY = touchStartY - touchEndY;
            touchStartY = touchEndY;

            accumulatedDelta += deltaY * 2; // Збільшуємо чутливість для мобільних
            
            if (shouldUnblockScroll()) {
                accumulatedDelta = 0;
                return;
            }
            
            updateSlides(accumulatedDelta);
        }, { passive: false });

        window.addEventListener('touchend', (e) => {
            if (isTouching && isSliderInView) {
                e.preventDefault();
                if (Math.abs(accumulatedDelta) < 400) {
                    slides.forEach((slide, index) => {
                        if (index === currentIndex) {
                            gsap.to(slide, {
                                opacity: 1,
                                rotateZ: 0,
                                y: '0%',
                                x: '0%',
                                scale: 1,
                                filter: 'brightness(1.2)',
                                duration: 0.3,
                                ease: 'power2.out'
                            });
                        }
                    });
                }
                accumulatedDelta = 0;
            }
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
                slides.forEach((slide, index) => {
                    if (index === currentIndex) {
                        animateText(slide);
                    }
                });
            },
            onEnterBack: () => {
                isSliderInView = true;
                blockScroll();
            },
            onLeave: () => {
                unblockScroll();
            },
            onLeaveBack: () => {
                unblockScroll();
            }
        });

        slides.forEach((slide, index) => {
            if (index === currentIndex) {
                const slideInner = slide.querySelector('.slide-inner');
                const text = slideInner.textContent;
                slideInner.textContent = '';
                
                [...text].forEach((char) => {
                    const span = document.createElement('span');
                    span.textContent = char;
                    slideInner.appendChild(span);
                });
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