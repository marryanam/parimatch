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
        if (slides.length < 3) return;

        let isAnimating = false;
        let currentIndex = 0;
        let isSliderInView = false;
        const sliderSection = document.querySelector('.slider-section');
        let accumulatedDelta = 0;
        let isScrollBlocked = false;

        const updateSlides = (delta) => {
            const direction = delta > 0 ? 1 : -1;
            const progress = Math.min(Math.abs(accumulatedDelta) / 1000, 1);

            slides.forEach((slide, index) => {
                if (index === currentIndex) {
                    gsap.to(slide, {
                        opacity: 1,
                        rotate: direction * progress * 90,
                        y: direction * progress * -100 + '%',
                        duration: 0.1,
                        zIndex: 3
                    });
                } 
                
                if (direction > 0) {
                    if (index === currentIndex + 1) {
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
                    if (index === currentIndex - 1) {
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

                    slides.forEach((slide, index) => {
                        slide.className = 'slide';
                        if (index === currentIndex) {
                            slide.classList.add('active');
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

        const shouldUnblockScroll = (direction) => {
            return (direction > 0 && currentIndex >= slides.length - 1) || 
                   (direction < 0 && currentIndex === 0);
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
            isScrollBlocked = true;
            centerSlider();
            setTimeout(() => {
                scroll.stop();
            }, 800);
        };

        const unblockScroll = () => {
            isScrollBlocked = false;
            scroll.start();
        };

        window.addEventListener('wheel', (e) => {
            if (!isSliderInView) return;

            const direction = e.deltaY > 0 ? 1 : -1;
            
            if (shouldUnblockScroll(direction)) {
                setTimeout(() => {
                    unblockScroll();
                }, 1000);
            } else {
                if (isSliderInView) {
                    e.preventDefault();
                    accumulatedDelta += e.deltaY * 0.8;
                    updateSlides(e.deltaY);
                }
            }
        }, { passive: false });

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

            if (shouldUnblockScroll(direction)) {
                setTimeout(() => {
                    unblockScroll();
                }, 1000);
            } else {
                if (isSliderInView) {
                    e.preventDefault();
                    accumulatedDelta += deltaY * 0.8;
                    updateSlides(deltaY);
                }
            }
        }, { passive: false });

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

        ScrollTrigger.create({
            trigger: sliderSection,
            scroller: '[data-scroll-container]',
            start: 'top 60%',
            end: 'bottom 40%',
            onEnter: () => {
                isSliderInView = true;
                blockScroll();
            },
            onEnterBack: () => {
                isSliderInView = true;
                blockScroll();
            },
            onLeave: () => {
                isSliderInView = false;
                setTimeout(() => {
                    unblockScroll();
                }, 1000);
            },
            onLeaveBack: () => {
                isSliderInView = false;
                setTimeout(() => {
                    unblockScroll();
                }, 1000);
            }
        });

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

    initializeSlider();
    ScrollTrigger.refresh();

    window.addEventListener('resize', () => {
        scroll.update();
        ScrollTrigger.refresh();
    });

    return scroll;
}; 