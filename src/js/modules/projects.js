export const initProjects = () => {
    const projects = document.querySelectorAll('.project');

    projects.forEach(project => {
        const title = project.querySelector('.project__title');
        const image = project.querySelector('.project__image');
        const color = project.dataset.color;

        // Hover animation
        project.addEventListener('mouseenter', () => {
            gsap.to(document.body, {
                backgroundColor: color,
                duration: 0.6
            });
            gsap.to(title, {
                x: 20,
                duration: 0.3
            });
            gsap.to(image, {
                opacity: 1,
                scale: 1,
                duration: 0.6,
                ease: 'power3.out'
            });
        });

        project.addEventListener('mouseleave', () => {
            gsap.to(document.body, {
                backgroundColor: '#141414',
                duration: 0.6
            });
            gsap.to(title, {
                x: 0,
                duration: 0.3
            });
            gsap.to(image, {
                opacity: 0,
                scale: 0,
                duration: 0.6,
                ease: 'power3.out'
            });
        });

        // Mouse move parallax for image
        project.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { left, top, width, height } = project.getBoundingClientRect();
            const x = (clientX - left) / width - 0.5;
            const y = (clientY - top) / height - 0.5;

            gsap.to(image, {
                x: x * 30,
                y: y * 30,
                duration: 0.6,
                ease: 'power3.out'
            });
        });
    });
};
