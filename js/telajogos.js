// Controle do Carrossel de Jogos
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".jogo-wrapper");
    const btnPrev = document.getElementById("btn-prev");
    const btnNext = document.getElementById("btn-next");

    // Valida se os elementos existem na página atual
    if (!cards.length || !btnPrev || !btnNext) return;

    let currentIndex = 1; // Inicia no card do meio (Jogo 2)

    function updateCarousel() {
        cards.forEach((card, index) => {
            if (index === currentIndex) {
                card.classList.add("active");
            } else {
                card.classList.remove("active");
            }
        });
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
});