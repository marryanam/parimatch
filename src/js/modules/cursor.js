export const initCursor = () => {
    const cursor = document.querySelector('.cursor__ball');
    const cursorPos = { x: 0, y: 0 };
    const currentPos = { x: 0, y: 0 };
    
    // Smooth cursor movement
    gsap.ticker.add(() => {
        const speed = 0.35;
        
        currentPos.x += (cursorPos.x - currentPos.x) * speed;
        currentPos.y += (cursorPos.y - currentPos.y) * speed;
        
        gsap.set(cursor, {
            x: currentPos.x,
            y: currentPos.y
        });
    });

    document.addEventListener('mousemove', (e) => {
        cursorPos.x = e.clientX;
        cursorPos.y = e.clientY;
    });

    // Scale cursor on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursor, {
                scale: 1.5,
                duration: 0.3
            });
        });

        el.addEventListener('mouseleave', () => {
            gsap.to(cursor, {
                scale: 1,
                duration: 0.3
            });
        });
    });
};
