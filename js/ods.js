// DADOS DAS 17 ODS PARA O MODAL
const dadosODS = {
    1: { titulo: "Erradicação da Pobreza", desc: "Acabar com a pobreza em todas as suas formas, em todos os lugares.", img: "img/ods1.png" },
    2: { titulo: "Fome Zero e Agricultura Sustentável", desc: "Acabar com a fome, alcançar a segurança alimentar e promover a agricultura sustentável.", img: "img/ods2.png" },
    3: { titulo: "Saúde e Bem-Estar", desc: "Garantir uma vida saudável e promover o bem-estar para todas e todos, em todas as idades.", img: "img/ods3.png" },
    4: { titulo: "Educação de Qualidade", desc: "Garantir a educação inclusiva, equitativa e de qualidade, e promover oportunidades de aprendizagem ao longo da vida.", img: "img/ods4.png" },
    5: { titulo: "Igualdade de Gênero", desc: "Alcançar a igualdade de gênero e empoderar todas as mulheres e meninas.", img: "img/ods5.png" },
    6: { titulo: "Água Potável e Saneamento", desc: "Garantir a disponibilidade e a gestão sustentável da água e saneamento para todas e todos.", img: "img/ods6.png" },
    7: { titulo: "Energia Limpa e Acessível", desc: "Garantir o acesso a uma energia acessível, confiável, sustentável e moderna para todos.", img: "img/ods7.png" },
    8: { titulo: "Trabalho Decente e Crescimento Econômico", desc: "Promover o crescimento econômico sustentado, emprego pleno e trabalho decente para todos.", img: "img/ods8.png" },
    9: { titulo: "Indústria, Inovação e Infraestrutura", desc: "Construir infraestruturas resilientes, promover a industrialização inclusiva e fomentar a inovação.", img: "img/ods9.png" },
    10: { titulo: "Redução das Desigualdades", desc: "Reduzir as desigualdades dentro dos países e entre eles.", img: "img/ods10.png" },
    11: { titulo: "Cidades e Comunidades Sustentáveis", desc: "Tornar as cidades e os assentamentos humanos inclusivos, seguros, resilientes e sustentáveis.", img: "img/ods11.png" },
    12: { titulo: "Consumo e Produção Responsáveis", desc: "Garantir padrões de consumo e de produção sustentáveis.", img: "img/ods12.png" },
    13: { titulo: "Ação Contra a Mudança Global do Clima", desc: "Tomar medidas urgentes para combater a mudança do clima e seus impactos.", img: "img/ods13.png" },
    14: { titulo: "Vida na Água", desc: "Conservar e usar de forma sustentável os oceanos, mares e recursos marinhos.", img: "img/ods14.png" },
    15: { titulo: "Vida Terrestre", desc: "Proteger, recuperar e promover o uso sustentável dos ecossistemas terrestres e deter a perda de biodiversidade.", img: "img/ods15.png" },
    16: { titulo: "Paz, Justiça e Instituições Eficazes", desc: "Promover sociedades de paz e inclusivas, proporcionar o acesso à justiça e construir instituições eficazes.", img: "img/ods16.png" },
    17: { titulo: "Parcerias e Meios de Implementação", desc: "Fortalecer os meios de implementação e revitalizar a parceria global para o desenvolvimento sustentável.", img: "img/ods17.png" }
};

// LÓGICA DO CARROSSEL INFINITO
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("odsContainer");
    const grid = container ? container.querySelector(".ods-grid") : null;
    const prevBtn = document.getElementById("odsPrev");
    const nextBtn = document.getElementById("odsNext");

    if (!container || !grid) return;

    // Duplica os itens da lista para criar a ilusão de esteira infinita
    const originalCards = Array.from(grid.children);
    originalCards.forEach(card => {
        const clone = card.cloneNode(true);
        grid.appendChild(clone);
    });

    let isDown = false;
    let startX;
    let scrollLeft;
    let autoScrollSpeed = 0.8; // Velocidade do movimento continuo
    let isHovered = false;

    // Animação Contínua em Loop
    function autoScroll() {
        if (!isDown && !isHovered) {
            container.scrollLeft += autoScrollSpeed;
            
            // Quando a rolagem atinge metade do conteúdo (fim do bloco original), reseta imperceptivelmente
            const halfWidth = grid.scrollWidth / 2;
            if (container.scrollLeft >= halfWidth) {
                container.scrollLeft -= halfWidth;
            } else if (container.scrollLeft <= 0) {
                container.scrollLeft += halfWidth;
            }
        }
        requestAnimationFrame(autoScroll);
    }
    requestAnimationFrame(autoScroll);

    // Pausa a animação ao passar o mouse por cima
    container.addEventListener("mouseenter", () => isHovered = true);
    container.addEventListener("mouseleave", () => {
        isHovered = false;
        isDown = false;
    });

    // Clique nas Setas (com navegação fluida)
    nextBtn.addEventListener("click", () => {
        container.scrollBy({ left: 260, behavior: "smooth" });
    });

    prevBtn.addEventListener("click", () => {
        // Se estiver no início ao voltar, salta para o meio antes de rolar
        if (container.scrollLeft <= 10) {
            container.scrollLeft += grid.scrollWidth / 2;
        }
        container.scrollBy({ left: -260, behavior: "smooth" });
    });

    // Arrastar com Rato ou Touch
    container.addEventListener("mousedown", (e) => {
        isDown = true;
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
    });

    container.addEventListener("mouseup", () => isDown = false);

    container.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 1.5;
        container.scrollLeft = scrollLeft - walk;

        // Trata o loop durante o arrasto manual
        const halfWidth = grid.scrollWidth / 2;
        if (container.scrollLeft >= halfWidth) {
            container.scrollLeft -= halfWidth;
            scrollLeft -= halfWidth;
        } else if (container.scrollLeft <= 0) {
            container.scrollLeft += halfWidth;
            scrollLeft += halfWidth;
        }
    });
});

// FUNÇÕES DO MODAL DE INFORMAÇÕES
function abrirModalODS(numero) {
    const ods = dadosODS[numero];
    if (!ods) return;

    document.getElementById("modalTag").innerText = `ODS ${numero}`;
    document.getElementById("modalTitle").innerText = ods.titulo;
    document.getElementById("modalDesc").innerText = ods.desc;
    document.getElementById("modalImg").src = ods.img;

    document.getElementById("modalODS").classList.add("ativo");
}

function fecharModalODS() {
    document.getElementById("modalODS").classList.remove("ativo");
}

// Fechar modal ao clicar fora dele
window.addEventListener("click", (e) => {
    const modal = document.getElementById("modalODS");
    if (e.target === modal) {
        fecharModalODS();
    }
});