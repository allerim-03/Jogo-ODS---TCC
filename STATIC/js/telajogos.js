document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".jogos-container");
    const cards = document.querySelectorAll(".jogo-wrapper");
    const btnPrev = document.getElementById("btn-prev");
    const btnNext = document.getElementById("btn-next");

    if (!track || !cards.length || !btnPrev || !btnNext) return;

    let currentIndex = 1; // Começa no Jogo 2

    function updateCarousel() {
        // 1. Alterna as classes ativas
        cards.forEach((card, index) => {
            if (index === currentIndex) {
                card.classList.add("active");
            } else {
                card.classList.remove("active");
            }
        });

        // 2. Calcula a centralização do elemento ativo
        setTimeout(() => {
            const activeCard = cards[currentIndex];
            const wrapper = track.parentElement;

            const wrapperWidth = wrapper.offsetWidth;
            const activeCardWidth = activeCard.offsetWidth;
            const activeCardLeft = activeCard.offsetLeft;

            // Posição para centralizar horizontal e verticalmente
            const moveX = (wrapperWidth / 2) - (activeCardLeft + activeCardWidth / 2);
            const moveY = -50; // Alinha verticalmente a trilha ao meio (-50%)

            track.style.transform = `translate(${moveX}px, ${moveY}%)`;
        }, 50);
    }

    btnPrev.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    btnNext.addEventListener("click", () => {
        if (currentIndex < cards.length - 1) {
            currentIndex++;
            updateCarousel();
        }
    });

    window.addEventListener("resize", updateCarousel);
    updateCarousel();
});