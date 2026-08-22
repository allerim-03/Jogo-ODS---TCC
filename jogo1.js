const canvas = document.getElementById("canvas-jogo-1");
const ctx = canvas.getContext("2d");

let estado = "menu";

// Dimensões e posição do botão PLAY no menu inicial
const botaoPlay = {
    x: 220,
    y: 180,
    largura: 160,
    altura: 60
};

// Loop principal de animação e atualização
function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (estado === "menu") {
        cenarioJogo1.desenharMenu(ctx, canvas.width, canvas.height, botaoPlay);
    } 

    if (estado === "jogando") {
        // 1. Atualiza a física do jogador, câmera e objetos interativos
        jogadorJogo1.atualizar(cenarioJogo1.alturaChao);
        cenarioJogo1.atualizarCamera(jogadorJogo1.x, canvas.width);
        interativosJogo1.atualizar(jogadorJogo1);

        // 2. Desenha o cenário, itens e jogador com a rolagem lateral
        cenarioJogo1.desenharJogo(ctx, canvas.width, canvas.height);
        interativosJogo1.desenhar(ctx, cenarioJogo1.cameraX, jogadorJogo1);
        jogadorJogo1.desenhar(ctx, cenarioJogo1.cameraX);

        // 3. Desenha a interface fixa (Contador 0/10) no topo da tela
        interativosJogo1.desenharHUD(ctx, canvas.width);
    }

    requestAnimationFrame(loop);
}

// Escuta o clique do mouse para iniciar o jogo a partir da tela de menu
canvas.addEventListener("click", (e) => {
    if (estado !== "menu") return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    if (
        mouseX >= botaoPlay.x &&
        mouseX <= botaoPlay.x + botaoPlay.largura &&
        mouseY >= botaoPlay.y &&
        mouseY <= botaoPlay.y + botaoPlay.altura
    ) {
        estado = "jogando";
    }
});

// Inicializa a execução
loop();