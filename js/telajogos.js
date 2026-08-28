// Controle do Carrossel de Jogos com Deslizamento Centralizado
document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".jogos-container");
    const cards = document.querySelectorAll(".jogo-wrapper");
    const btnPrev = document.getElementById("btn-prev");
    const btnNext = document.getElementById("btn-next");

    // Valida se os elementos existem na página atual
    if (!track || !cards.length || !btnPrev || !btnNext) return;

    let currentIndex = 1; // Inicia no card do meio (Jogo 2)

    function updateCarousel() {
        // Atualiza a classe ativa dos cards
        cards.forEach((card, index) => {
            if (index === currentIndex) {
                card.classList.add("active");
            } else {
                card.classList.remove("active");
            }
        });

        // Calcula a posição exata para centralizar o card selecionado
        const activeCard = cards[currentIndex];
        const containerWidth = track.parentElement.offsetWidth;
        const cardOffsetLeft = activeCard.offsetLeft;
        const cardWidth = activeCard.offsetWidth;

        const moveX = (containerWidth / 2) - (cardOffsetLeft + cardWidth / 2);

        // Aplica o movimento horizontal no container
        track.style.transform = `translateX(${moveX}px)`;
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

    // Reajusta o alinhamento central caso a janela seja redimensionada
    window.addEventListener("resize", updateCarousel);

    // Executa o alinhamento inicial ao carregar
    updateCarousel();
});