// Controle do Carrossel de Jogos com Centralização Perfeita
document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".jogos-container");
    const cards = document.querySelectorAll(".jogo-wrapper");
    const btnPrev = document.getElementById("btn-prev");
    const btnNext = document.getElementById("btn-next");

    // Valida se os elementos existem na página atual
    if (!track || !cards.length || !btnPrev || !btnNext) return;

    let currentIndex = 1; // Inicia no card do meio (Jogo 2)

    function updateCarousel() {
        // 1. Atualiza a classe 'active'
        cards.forEach((card, index) => {
            if (index === currentIndex) {
                card.classList.add("active");
            } else {
                card.classList.remove("active");
            }
        });

        // 2. Aguarda o navegador aplicar as novas dimensões de largura do CSS
        requestAnimationFrame(() => {
            const activeCard = cards[currentIndex];
            const wrapper = track.parentElement;

            // Encontra o centro do container visível e o centro do card ativo
            const wrapperCenter = wrapper.offsetWidth / 2;
            const cardCenter = activeCard.offsetLeft + (activeCard.offsetWidth / 2);

            // Alinha o centro do card com o centro do container
            const moveX = wrapperCenter - cardCenter;
            track.style.transform = `translateX(${moveX}px)`;
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

    // Reajusta o alinhamento central em caso de mudança no tamanho da janela
    window.addEventListener("resize", updateCarousel);

    // Executa o alinhamento inicial
    updateCarousel();
});