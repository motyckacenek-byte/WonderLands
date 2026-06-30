const title = document.querySelector('.main-title');
const carousel = document.querySelector('.carousel-container');

window.addEventListener('scroll', () => {
    let scrollPos = window.scrollY;

    // 1. PARALLAX EFEKT: Nadpis jede dolů rychleji než stránka
    let maxDrop = carousel.offsetHeight - 80; 
    let dropDistance = Math.min(scrollPos * 1.8, maxDrop);
    title.style.transform = `translateY(${dropDistance}px)`;

    // 2. MARVEL / GLASSMORPHISM EFEKT: Ztmavování a rozmazávání pozadí
    if (scrollPos > 30) {
        let darkness = Math.min(scrollPos / 300, 0.85);
        title.style.backgroundColor = `rgba(5, 5, 5, ${darkness})`;
        title.style.backdropFilter = `blur(4px)`;
        title.style.webkitBackdropFilter = `blur(4px)`; 
        title.style.boxShadow = `0 15px 30px rgba(0,0,0, ${darkness})`;
        title.style.padding = "2vh 0";
    } else {
        // Návrat do původního stavu úplně nahoře
        title.style.backgroundColor = 'transparent';
        title.style.backdropFilter = 'none';
        title.style.webkitBackdropFilter = 'none';
        title.style.boxShadow = 'none';
        title.style.padding = "6vh 0 2vh 0";
    }
});