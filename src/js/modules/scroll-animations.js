import LocomotiveScroll from 'locomotive-scroll';

export default class ScrollAnimations {
    constructor() {
        this.scroll = new LocomotiveScroll({
            el: document.querySelector('[data-scroll-container]'),
            smooth: true,
            multiplier: 1,
            lerp: 0.1
        });

        this.init();
    }

    init() {
        this.scroll.on('scroll', (obj) => {
            // Анімація для секції 3
            const section3 = document.querySelector('.section-3');
            if (section3) {
                const info = section3.querySelector('.section-3__info');
                
                if (obj.currentElements['section-3']) {
                    const progress = obj.currentElements['section-3'].progress;
                    
                    if (progress > 0.2) {
                        info.classList.add('is-inview');
                    } else {
                        info.classList.remove('is-inview');
                    }
                }
            }
        });
    }
} 