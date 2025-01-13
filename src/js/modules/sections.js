import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

export const initSections = () => {
    // Анімація заголовків
    const titles = document.querySelectorAll('.section-title');
    titles.forEach(title => {
        const split = new SplitType(title, { 
            types: 'chars,words',
            tagName: 'span'
        });
        
        gsap.from(split.chars, {
            scrollTrigger: {
                trigger: title,
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            y: 100,
            rotateX: -90,
            stagger: 0.02,
            duration: 1,
            ease: "back.out(1.7)"
        });
    });

    // Паралакс для фонових зображень
    const parallaxSections = document.querySelectorAll('.parallax-section');
    parallaxSections.forEach(section => {
        const bg = section.querySelector('.parallax-bg');
        
        gsap.to(bg, {
            scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            },
            y: '30%',
            ease: "none"
        });
    });
}; 