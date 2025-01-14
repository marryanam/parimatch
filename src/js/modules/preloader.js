import gsap from 'gsap';

export default class Preloader {
    constructor() {
        this.preloader = document.querySelector('.preloader');
        this.logo = document.querySelector('.preloader__logo');
        this.mainLogo = document.querySelector('.main-logo');
        this.isLoaded = false;
        this.init();
    }

    init() {
        if (this.mainLogo) {
            gsap.set(this.mainLogo, { opacity: 0 });
        }

        window.addEventListener('load', () => {
            setTimeout(() => {
                this.hidePreloader();
            }, 1000);
        });
    }

    hidePreloader() {
        if (!this.preloader) return;

        this.preloader.style.opacity = '0';
        setTimeout(() => {
            this.preloader.style.display = 'none';
            this.showMainContent();
        }, 500);
    }

    showMainContent() {
        this.isLoaded = true;

        if (this.mainLogo) {
            gsap.to(this.mainLogo, {
                opacity: 1,
                duration: 0.5
            });
        }
    }
}