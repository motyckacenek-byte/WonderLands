// ==========================================
// 1. KONTROLA NADPISU (PARALLAX + GLASSMORPHISM)
// ==========================================
const title = document.querySelector('.main-title');
const carouselContainer = document.querySelector('.carousel-container');

window.addEventListener('scroll', () => {
    let scrollPos = window.scrollY;

    // Parallax efekt: Nadpis jede dolů rychleji než stránka
    let maxDrop = carouselContainer.offsetHeight - 80; 
    let dropDistance = Math.min(scrollPos * 1.8, maxDrop);
    title.style.transform = `translateY(${dropDistance}px)`;

    // Marvel / Glassmorphism efekt: Ztmavování a rozmazávání pozadí
    if (scrollPos > 30) {
        let darkness = Math.min(scrollPos / 300, 0.85);
        title.style.backgroundColor = `rgba(5, 5, 5, ${darkness})`;
        title.style.backdropFilter = `blur(4px)`;
        title.style.webkitBackdropFilter = `blur(4px)`; 
        title.style.boxShadow = `0 15px 30px rgba(0,0,0, ${darkness})`;
        title.style.padding = "2vh 0";
    } else {
        // Návrat do původního stavu
        title.style.backgroundColor = 'transparent';
        title.style.backdropFilter = 'none';
        title.style.webkitBackdropFilter = 'none';
        title.style.boxShadow = 'none';
        title.style.padding = "6vh 0 2vh 0";
    }
});

// ==========================================
// 2. KONTROLA BĚŽÍCÍHO PÁSU (DRAG & DROP + AUTO-SCROLL)
// ==========================================
const track = document.querySelector('.carousel-track');
const slideGroup = document.querySelector('.slide-group');

let isDragging = false;
let isHovered = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let isDragged = false; // Rozlišuje, zda uživatel jen kliknul, nebo tahal

// Hlavní smyčka pro plynulý pohyb (nahrazuje CSS animaci)
function renderCarousel() {
    // Zjistíme šířku jedné skupiny portálů, abychom věděli, kdy to přeskočit zpět (dokonalá smyčka)
    const groupWidth = slideGroup.offsetWidth;

    // Pokud uživatel netahá myší a nemá na tom položený kurzor, pás se točí sám
    if (!isDragging && !isHovered) {
        currentTranslate -= 1; // Zde můžeš upravit rychlost pásu (čím vyšší číslo, tím rychlejší)
    }

    // Podmínky pro nekonečnou smyčku (při tažení doleva i doprava)
    if (currentTranslate <= -groupWidth) {
        currentTranslate += groupWidth;
        if (isDragging) prevTranslate += groupWidth; // Korekce pro tahání
    } else if (currentTranslate > 0) {
        currentTranslate -= groupWidth;
        if (isDragging) prevTranslate -= groupWidth; // Korekce pro tahání
    }

    // Aplikování pozice
    track.style.transform = `translateX(${currentTranslate}px)`;
    
    // Neustálé opakování smyčky
    requestAnimationFrame(renderCarousel);
}

// Spuštění smyčky
requestAnimationFrame(renderCarousel);

// Univerzální funkce pro start tažení (myš i dotyk)
function dragStart(x) {
    isDragging = true;
    isHovered = true; // Zastaví pás
    startPos = x;
    prevTranslate = currentTranslate;
    isDragged = false;
    track.style.cursor = 'grabbing'; // Pěst
}

// Univerzální funkce pro pohyb (myš i dotyk)
function dragMove(x) {
    if (!isDragging) return;
    const distance = x - startPos;
    
    // Pokud posuneme o více než 5px, bereme to jako tažení (ne klik)
    if (Math.abs(distance) > 5) {
        isDragged = true;
    }
    
    currentTranslate = prevTranslate + distance;
}

// Univerzální funkce pro konec tažení
function dragEnd() {
    isDragging = false;
    track.style.cursor = 'grab'; // Zpět na rozevřenou dlaň
}

// --- EVENT LISTENERY PRO MYŠ ---
track.addEventListener('mousedown', (e) => dragStart(e.pageX));
track.addEventListener('mousemove', (e) => dragMove(e.pageX));
track.addEventListener('mouseup', dragEnd);
track.addEventListener('mouseleave', () => {
    dragEnd();
    isHovered = false; // Rozjede pás, když myš vyjede ven
});
track.addEventListener('mouseenter', () => isHovered = true); // Zastaví pás při najetí

// --- EVENT LISTENERY PRO MOBIL / DOTYK ---
track.addEventListener('touchstart', (e) => dragStart(e.touches[0].clientX), {passive: true});
track.addEventListener('touchmove', (e) => dragMove(e.touches[0].clientX), {passive: true});
track.addEventListener('touchend', dragEnd);

// --- ZABRÁNĚNÍ NECHTĚNÝM PROKLIKŮM A "GHOST" TAHÁNÍ OBRÁZKŮ ---
const portals = track.querySelectorAll('.portal');
portals.forEach(portal => {
    portal.addEventListener('click', (e) => {
        // Pokud uživatel portál táhnul, zastavíme otevření odkazu
        if (isDragged) {
            e.preventDefault(); 
        }
    });
    // Zabijeme výchozí prohlížečové tahání elementů (které by rušilo náš skript)
    portal.addEventListener('dragstart', (e) => e.preventDefault());
});