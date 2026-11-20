let jogo1RunId = crypto.randomUUID();
const canvas = document.getElementById("canvas-jogo-1");
const ctx = canvas.getContext("2d");

let estado = "menu"; // "menu", "jogando", "gameover", "vitoria"

// Botões da interface
const botaoPlay = { x: 225, y: 230, largura: 160, altura: 60 };
const botaoReplay = { x: (canvas.width - 160) / 2, y: 215, largura: 160, altura: 50 };
const botaoJogarNovamente = { x: (canvas.width - 230) / 2, y: 200, largura: 230, altura: 50 };

// Disparado quando o jogador colide com a água
function dispararMorte() {
    estado = "gameover";
    jogadorJogo1.estaMorto = true;
}

// Disparado quando o jogador encontra o Guri no final da fase
function dispararVitoria() {
    estado = "vitoria";
}

// Reseta todas as variáveis e gera um novo RunId
function resetarTudo() {
    jogo1RunId = crypto.randomUUID();
    jogadorJogo1.resetar();
    plataformasJogo1.resetar();
    
    // Reseta o estado do gerenciador de interativos
    interativosJogo1.itens = [];
    interativosJogo1.contadorConcluidos = 0;
    interativosJogo1.tempoUltimoItem = 0;
    interativosJogo1.proximaDistancia = 800;

    // Reseta o estado e a posição do NPC
    if (typeof npcGuri !== "undefined") {
        npcGuri.resetar();
    }
}

// Reinicia para uma nova tentativa imediata (Botão REPLAY)
function reiniciarJogo() {
    resetarTudo();
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

        // Só avança o restante do mundo quando não estiver congelado pela dica do 1º pulo
        if (!jogadorJogo1.pausadoPorDica) {
            cenarioJogo1.atualizarCamera(jogadorJogo1.x, canvas.width);

            // Atualiza itens interativos primeiro (para posicionar o Guri ao fechar a 10ª torneira)
            interativosJogo1.atualizar(
                jogadorJogo1,
                plataformasJogo1.listaPocas,
                plataformasJogo1.listaPlataformas
            );

            // Atualiza plataformas e poças após o interativo definir o limite final
            plataformasJogo1.atualizar(jogadorJogo1, dispararMorte);
            
            // Atualiza a lógica do NPC (início e encontro final)
            if (typeof npcGuri !== "undefined") {
                npcGuri.atualizar(jogadorJogo1, dispararVitoria);
            }
        }

        // 2. Renderização
        cenarioJogo1.desenharJogo(ctx, canvas.width, canvas.height);
        plataformasJogo1.desenhar(ctx, cenarioJogo1.cameraX);
        
        // Desenha o NPC no cenário
        if (typeof npcGuri !== "undefined") {
            npcGuri.desenhar(ctx, cenarioJogo1.cameraX);
        }

        interativosJogo1.desenhar(ctx, cenarioJogo1.cameraX, jogadorJogo1);
        jogadorJogo1.desenhar(ctx, cenarioJogo1.cameraX);

        // Overlay escuro com a dica do pulo duplo (↑↑) congelando a tela no 1º pulo
        if (typeof jogadorJogo1.desenharDicaPuloDuplo === "function") {
            jogadorJogo1.desenharDicaPuloDuplo(ctx, canvas.width, canvas.height);
        }
        
        // 3. HUD e Diálogos
        interativosJogo1.desenharHUD(ctx, canvas.width);

        // Desenha a caixa de diálogo por cima da tela
        if (typeof npcGuri !== "undefined") {
            npcGuri.desenharDialogo(ctx, canvas.width, canvas.height);
        }
    }

    // Tela de Vitória (Mantém o Guri animado e o diálogo de agradecimento visível)
    if (estado === "vitoria") {
        cenarioJogo1.desenharJogo(ctx, canvas.width, canvas.height);
        plataformasJogo1.desenhar(ctx, cenarioJogo1.cameraX);
        
        if (typeof npcGuri !== "undefined") {
            npcGuri.desenhar(ctx, cenarioJogo1.cameraX);
        }

        interativosJogo1.desenhar(ctx, cenarioJogo1.cameraX, jogadorJogo1);
        jogadorJogo1.desenhar(ctx, cenarioJogo1.cameraX);
        interativosJogo1.desenharHUD(ctx, canvas.width);

        if (typeof npcGuri !== "undefined") {
            npcGuri.desenharDialogo(ctx, canvas.width, canvas.height);
        }

        // Botão JOGAR NOVAMENTE logo abaixo da caixa de diálogo
        ctx.fillStyle = "#2ecc71";
        ctx.fillRect(botaoJogarNovamente.x, botaoJogarNovamente.y, botaoJogarNovamente.largura, botaoJogarNovamente.altura);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.strokeRect(botaoJogarNovamente.x, botaoJogarNovamente.y, botaoJogarNovamente.largura, botaoJogarNovamente.altura);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 18px Arial";
        ctx.textAlign = "center";
        ctx.fillText("JOGAR NOVAMENTE", canvas.width / 2, botaoJogarNovamente.y + 31);
    }

    // Tela de Game Over (Congela o estado atual do jogo no fundo)
    if (estado === "gameover") {
        cenarioJogo1.desenharJogo(ctx, canvas.width, canvas.height);
        plataformasJogo1.desenhar(ctx, cenarioJogo1.cameraX);
        
        if (typeof npcGuri !== "undefined") {
            npcGuri.desenhar(ctx, cenarioJogo1.cameraX);
        }

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

        // Botão REPLAY centralizado
        ctx.fillStyle = "#e67e22";
        ctx.fillRect(botaoReplay.x, botaoReplay.y, botaoReplay.largura, botaoReplay.altura);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.strokeRect(botaoReplay.x, botaoReplay.y, botaoReplay.largura, botaoReplay.altura);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 22px Arial";
        ctx.textAlign = "center";
        ctx.fillText("REPLAY", botaoReplay.x + botaoReplay.largura / 2, botaoReplay.y + 33);
    }

    requestAnimationFrame(loop);
}

// Escuta cliques do mouse para os botões da interface
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

    if (estado === "vitoria") {
        if (
            mouseX >= botaoJogarNovamente.x && mouseX <= botaoJogarNovamente.x + botaoJogarNovamente.largura &&
            mouseY >= botaoJogarNovamente.y && mouseY <= botaoJogarNovamente.y + botaoJogarNovamente.altura
        ) {
            resetarTudo();
            estado = "menu"; // Volta para a tela inicial
        }
    }
});

// Inicialização
loop();