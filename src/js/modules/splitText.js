export const initSplitText = () => {
    // Split text into spans
    const splitText = (element) => {
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
        
        // Create animation
        gsap.from(element.querySelectorAll('span'), {
            yPercent: 100,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            stagger: 0.02,
            scrollTrigger: {
                trigger: element,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });
    });
};
