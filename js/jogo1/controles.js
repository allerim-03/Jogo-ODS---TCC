// Estado global dos controles do Jogo 1
const controlesJogo1 = {
    cima: false,
    baixo: false,
    esquerda: false,
    direita: false,
    espaco: false
};

// Teclas que têm o scroll da página bloqueado
const teclasBloqueadasJogo1 = [
    "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "Spacebar"
];

// Captura quando a tecla é pressionada
document.addEventListener("keydown", (e) => {
    if (teclasBloqueadasJogo1.includes(e.key)) {
        e.preventDefault();
    }

    const tecla = e.key.toLowerCase();

    if (tecla === "arrowup" || tecla === "w") controlesJogo1.cima = true;
    if (tecla === "arrowdown" || tecla === "s") controlesJogo1.baixo = true;
    if (tecla === "arrowleft" || tecla === "a") controlesJogo1.esquerda = true;
    if (tecla === "arrowright" || tecla === "d") controlesJogo1.direita = true;
    if (e.key === " " || e.key === "Spacebar") controlesJogo1.espaco = true;
});

// Captura quando a tecla é solta
document.addEventListener("keyup", (e) => {
    const tecla = e.key.toLowerCase();

    if (tecla === "arrowup" || tecla === "w") controlesJogo1.cima = false;
    if (tecla === "arrowdown" || tecla === "s") controlesJogo1.baixo = false;
    if (tecla === "arrowleft" || tecla === "a") controlesJogo1.esquerda = false;
    if (tecla === "arrowright" || tecla === "d") controlesJogo1.direita = false;
    if (e.key === " " || e.key === "Spacebar") controlesJogo1.espaco = false;
});