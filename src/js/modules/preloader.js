export default class Preloader {
    constructor() {
        this.preloader = document.querySelector('.preloader');
        this.logo = document.querySelector('.preloader__logo');
        this.mainLogo = document.querySelector('.section1__logo');
        this.section1 = document.querySelector('.section-1');
        this.burgerMenu = document.querySelector('.burger-menu');
        this.isLoaded = false;
        this.init();
    }

    init() {
        if (this.mainLogo) {
            this.mainLogo.style.opacity = '0';
        }

        window.addEventListener('load', () => {
            setTimeout(() => {
                this.hidePreloader();
            }, 2000);
        });

        window.addEventListener('scroll', () => {
            if (this.isLoaded) {
                requestAnimationFrame(() => this.handleScroll());
            }
        });

        window.addEventListener('resize', () => {
            if (this.isLoaded) {
                requestAnimationFrame(() => this.handleScroll());
            }
        });
    }

    hidePreloader() {
        this.preloader.classList.add('loaded');
        
        if (this.mainLogo) {
            this.mainLogo.style.opacity = '1';
            this.mainLogo.style.position = 'fixed';
            this.mainLogo.style.top = '50%';
            this.mainLogo.style.left = '50%';
            this.mainLogo.style.transform = 'translate(-50%, -50%)';
        }
        
        setTimeout(() => {
            this.isLoaded = true;
        }, 800);
    }

    handleScroll() {
        if (!this.mainLogo || !this.section1) return;

        const section1Rect = this.section1.getBoundingClientRect();
        const headerHeight = 80;
        const scrollTop = window.pageYOffset;
        const sectionHeight = this.section1.offsetHeight;
        const leftPadding = 120;

        // Перевіряємо, чи секція все ще в зоні видимості
        if (section1Rect.bottom > headerHeight) {
            // Розраховуємо прогрес скролу відносно висоти секції
            const scrollProgress = Math.min(scrollTop / (sectionHeight - headerHeight), 1);
            
            // Розраховуємо позицію та масштаб
            const startY = window.innerHeight / 2;
            const endY = headerHeight / 2;
            const currentY = startY - (scrollProgress * (startY - endY));
            
            // Розраховуємо горизонтальне зміщення (з центру вліво)
            const startX = window.innerWidth / 2;
            const endX = leftPadding;
            const currentX = startX - (scrollProgress * (startX - endX));
            
            const scale = 1 - (scrollProgress * 0.5);

            // Застосовуємо трансформацію
            this.mainLogo.style.position = 'fixed';
            this.mainLogo.style.top = `${currentY}px`;
            this.mainLogo.style.left = `${currentX}px`;
            this.mainLogo.style.transform = `translate(-50%, -50%) scale(${scale})`;
            
            // Показуємо/приховуємо бургер-меню
            // Починаємо показувати меню тільки після 70% прогресу скролу
            if (this.burgerMenu) {
                const menuProgress = Math.max((scrollProgress - 0.7) * 3.33, 0); // 3.33 = 1 / 0.3 для нормалізації від 0.7 до 1
                this.burgerMenu.style.opacity = menuProgress;
            }
        } else {
            // Фіксуємо у позиції хедера
            this.mainLogo.style.position = 'fixed';
            this.mainLogo.style.top = `${headerHeight/2}px`;
            this.mainLogo.style.left = `${leftPadding}px`;
            this.mainLogo.style.transform = 'translate(-50%, -50%) scale(0.5)';
            
            // Повністю показуємо бургер-меню
            if (this.burgerMenu) {
                this.burgerMenu.style.opacity = '1';
            }
        }
    }
} 