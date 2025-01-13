export const initLoader = () => {
    const loader = document.querySelector('.loader');
    const progress = document.querySelector('.loader__progress');

    // Initial loading animation
    const tl = gsap.timeline();

    tl.to(progress, {
        scaleX: 1,
        duration: 1.5,
        ease: 'power3.inOut'
    }).to(loader, {
        yPercent: -100,
        duration: 1,
        ease: 'power3.inOut'
    });
};
