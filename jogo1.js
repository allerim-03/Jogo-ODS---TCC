const canvas = document.getElementById("canvas-jogo-1");
const ctx = canvas.getContext("2d");

let estado = "menu"; // "menu", "jogando", "gameover"

// Botões da interface
const botaoPlay = { x: 220, y: 180, largura: 160, altura: 60 };
const botaoReplay = { x: 220, y: 220, largura: 160, altura: 50 };

// Disparado quando o jogador colide com a água
function dispararMorte() {
    estado = "gameover";
    jogadorJogo1.estaMorto = true;
}

// Reinicia todas as variáveis para uma nova tentativa
function reiniciarJogo() {
    jogadorJogo1.resetar();
    plataformasJogo1.resetar();
    interativosJogo1.itens = [];
    interativosJogo1.contadorConcluidos = 0;
    interativosJogo1.tempoUltimoItem = 0;
    estado = "jogando";
}

// Loop principal de renderização e física
function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (estado === "menu") {
        cenarioJogo1.desenharMenu(ctx, canvas.width, canvas.height, botaoPlay);
    } 

    if (estado === "jogando") {
        // 1. Lógica e Física
        jogadorJogo1.atualizar(cenarioJogo1.alturaChao);
        cenarioJogo1.atualizarCamera(jogadorJogo1.x, canvas.width);
        plataformasJogo1.atualizar(jogadorJogo1, dispararMorte);
        interativosJogo1.atualizar(jogadorJogo1);

        // 2. Renderização
        cenarioJogo1.desenharJogo(ctx, canvas.width, canvas.height);
        plataformasJogo1.desenhar(ctx, cenarioJogo1.cameraX);
        interativosJogo1.desenhar(ctx, cenarioJogo1.cameraX, jogadorJogo1);
        jogadorJogo1.desenhar(ctx, cenarioJogo1.cameraX);
        
        // 3. HUD
        interativosJogo1.desenharHUD(ctx, canvas.width);
    }

    // Tela de Game Over (Congela o estado atual do jogo no fundo)
    if (estado === "gameover") {
        cenarioJogo1.desenharJogo(ctx, canvas.width, canvas.height);
        plataformasJogo1.desenhar(ctx, cenarioJogo1.cameraX);
        interativosJogo1.desenhar(ctx, cenarioJogo1.cameraX, jogadorJogo1);
        jogadorJogo1.desenhar(ctx, cenarioJogo1.cameraX);

        // Overlay escuro
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Mensagem de alerta
        ctx.fillStyle = "#e74c3c";
        ctx.font = "bold 38px Arial";
        ctx.textAlign = "center";
        ctx.fillText("OH NÃO!", canvas.width / 2, 140);

        ctx.fillStyle = "#ffffff";
        ctx.font = "18px Arial";
        ctx.fillText("Você caiu na poça d'água!", canvas.width / 2, 180);

        // Botão REPLAY
        ctx.fillStyle = "#e67e22";
        ctx.fillRect(botaoReplay.x, botaoReplay.y, botaoReplay.largura, botaoReplay.altura);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.strokeRect(botaoReplay.x, botaoReplay.y, botaoReplay.largura, botaoReplay.altura);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 22px Arial";
        ctx.fillText("REPLAY", canvas.width / 2, botaoReplay.y + 33);
    }

    requestAnimationFrame(loop);
}

// Escuta cliques do mouse para os botões da UI
canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    if (estado === "menu") {
        if (
            mouseX >= botaoPlay.x && mouseX <= botaoPlay.x + botaoPlay.largura &&
            mouseY >= botaoPlay.y && mouseY <= botaoPlay.y + botaoPlay.altura
        ) {
            estado = "jogando";
        }
    }

    if (estado === "gameover") {
        if (
            mouseX >= botaoReplay.x && mouseX <= botaoReplay.x + botaoReplay.largura &&
            mouseY >= botaoReplay.y && mouseY <= botaoReplay.y + botaoReplay.altura
        ) {
            reiniciarJogo();
        }
    }
});

// Inicialização
loop();