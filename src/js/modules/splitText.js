import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger.js';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

export const initSplitText = () => {
    const isMobile = window.innerWidth <= 768;
    
    // Split text into spans
    const splitText = (element) => {
        // For mobile, only split into words instead of characters for better performance
        if (isMobile) {
            const text = element.textContent;
            const words = text.split(' ');
            element.textContent = '';
            words.forEach(word => {
                const span = document.createElement('span');
                span.textContent = word + ' ';
                element.appendChild(span);
            });
            return;
        }

        // Desktop version - split into characters
        const text = element.textContent;
        const chars = text.split('');
        element.textContent = '';
        chars.forEach(char => {
            const span = document.createElement('span');
            span.textContent = char;
            element.appendChild(span);
        });
    };

    // Get all elements with split-text class
    const elements = document.querySelectorAll('.split-text');
    elements.forEach(element => {
        splitText(element);
        
        // Create animation with optimized settings for mobile
        gsap.from(element.querySelectorAll('span'), {
            yPercent: isMobile ? 50 : 100,
            opacity: 0,
            duration: isMobile ? 0.6 : 1,
            ease: isMobile ? 'power2.out' : 'power3.out',
            stagger: isMobile ? 0.03 : 0.02, // Slightly faster stagger for words on mobile
            scrollTrigger: {
                trigger: element,
                start: 'top 85%',
                toggleActions: 'play none none reset'
            }
        });
    });
};

