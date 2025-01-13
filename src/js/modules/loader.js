import gsap from 'gsap';

export const initLoader = () => {
    const loader = document.querySelector('.loader');
    
    if (!loader) return;

    gsap.to(loader, {
        opacity: 0,
        duration: 1,
        ease: 'power2.inOut',
        onComplete: () => {
            loader.style.display = 'none';
        }
    });
};
