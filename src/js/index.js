// Import styles
import '../styles/main.scss';
import { initSmoothScroll } from './modules/smoothScroll';
import { initSections } from './modules/sections';
import { initSplitText } from './modules/splitText';
import { initCursor } from './modules/cursor';
import { initLoader } from './modules/loader';

// Initialize modules
document.addEventListener('DOMContentLoaded', () => {
    // Ініціалізація завантажувача
    initLoader();

    // Ініціалізація плавного скролу
    const scroller = initSmoothScroll();

    // Ініціалізація анімацій секцій
    initSections();

    // Ініціалізація анімацій тексту
    initSplitText();

    // Ініціалізація кастомного курсора
    initCursor();

    // Оновлення ScrollTrigger при зміні розміру вікна
    window.addEventListener('resize', () => {
        scroller.update();
    });
});
