// Import styles
import '../styles/main.scss';

// Import GSAP
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger.js';

// Import modules
import { initSplitText } from './modules/splitText.js';
import { initCursor } from './modules/cursor.js';
import { initLoader } from './modules/loader.js';
import { initSliderCards } from './modules/slider_cards.js';
import Preloader from './modules/preloader';
import ScrollAnimations from './modules/scroll-animations';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Initialize modules
document.addEventListener('DOMContentLoaded', () => {
    // Ініціалізація завантажувача
    initLoader();

    // Ініціалізація анімацій тексту
    initSplitText();

    // Ініціалізація кастомного курсора
    initCursor();

    // Ініціалізація слайдера
    const scroll = initSliderCards();

    new Preloader();
    
    // Ініціалізація анімацій скролу
    new ScrollAnimations();

    // Оновлення ScrollTrigger при зміні розміру вікна
    window.addEventListener('resize', () => {
        ScrollTrigger.refresh();
    });
});
