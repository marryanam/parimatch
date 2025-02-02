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
import { initLogoAnimation } from './modules/logo-animation';

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

    // Ініціалізація анімації логотипу
    initLogoAnimation();

    new Preloader();

    // Оновлення ScrollTrigger при зміні розміру вікна
    window.addEventListener('resize', () => {
        ScrollTrigger.refresh();
    });
});
