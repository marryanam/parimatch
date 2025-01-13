import gsap from 'gsap';

export const initCursor = () => {
    const cursor = {
        dot: document.querySelector('.cursor__dot'),
        circle: document.querySelector('.cursor__circle')
    };

    if (!cursor.dot || !cursor.circle) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let circleX = 0;
    let circleY = 0;

    // Налаштування плавності руху
    const dotSmooth = 1; // Миттєве слідування
    const circleSmooth = 0.15; // Плавне слідування

    // Анімація курсора
    const animate = () => {
        // Оновлення позиції точки (миттєве слідування)
        currentX = mouseX;
        currentY = mouseY;
        
        // Оновлення позиції кола (плавне слідування)
        const deltaX = mouseX - circleX;
        const deltaY = mouseY - circleY;
        
        circleX += deltaX * circleSmooth;
        circleY += deltaY * circleSmooth;

        // Застосування трансформацій
        gsap.set(cursor.dot, {
            x: currentX,
            y: currentY
        });

        gsap.set(cursor.circle, {
            x: circleX,
            y: circleY
        });

        requestAnimationFrame(animate);
    };

    // Запуск анімації
    animate();

    // Оновлення позиції миші
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Анімації при наведенні
    const handleMouseEnter = () => {
        gsap.to(cursor.circle, {
            width: 80,
            height: 80,
            duration: 0.4,
            ease: "power2.out"
        });
    };

    const handleMouseLeave = () => {
        gsap.to(cursor.circle, {
            width: 40,
            height: 40,
            duration: 0.4,
            ease: "power2.out"
        });
    };

    // Додаємо обробники подій для інтерактивних елементів
    const interactiveElements = document.querySelectorAll('a, button, .slide');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', handleMouseEnter);
        element.addEventListener('mouseleave', handleMouseLeave);
    });

    // Приховуємо курсор при виході за межі вікна
    document.addEventListener('mouseleave', () => {
        gsap.to([cursor.dot, cursor.circle], {
            opacity: 0,
            duration: 0.3
        });
    });

    document.addEventListener('mouseenter', () => {
        gsap.to([cursor.dot, cursor.circle], {
            opacity: 1,
            duration: 0.3
        });
    });
};
