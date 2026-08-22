const plataformasJogo1 = {
    listaPlataformas: [],
    listaPocas: [],
    tempoUltimoGerado: 0,
    intervaloGeracao: 600, // Espaçamento entre obstáculos

    atualizar: function(jogador, callbackMorte) {
        // Gera novas plataformas e poças à frente conforme o jogador anda
        if (jogador.x - this.tempoUltimoGerado > this.intervaloGeracao) {
            const xBase = jogador.x + 700;

            // Sorteia se gera uma poça no chão ou plataforma suspensa
            if (Math.random() > 0.3) {
                this.listaPocas.push({
                    x: xBase,
                    y: 345, // Alinhado ao nível da areia
                    largura: 90,
                    altura: 15
                });
            }

            // Gera plataforma flutuante (pode aparecer junto ou sozinha)
            this.listaPlataformas.push({
                x: xBase - 30,
                y: Math.floor(Math.random() * (260 - 180 + 1)) + 180, // Altura aleatória
                largura: 120,
                altura: 20
            });

            this.tempoUltimoGerado = jogador.x;
        }

        // --- COLISÃO COM PLATAFORMAS (Pousar em cima) ---
        for (let plat of this.listaPlataformas) {
            if (
                jogador.x + jogador.largura > plat.x &&
                jogador.x < plat.x + plat.largura &&
                jogador.y + jogador.altura >= plat.y &&
                jogador.y + jogador.altura <= plat.y + 15 &&
                jogador.velocidadeY >= 0
            ) {
                jogador.y = plat.y - jogador.altura;
                jogador.velocidadeY = 0;
                jogador.noChao = true;
            }
        }

        // --- COLISÃO COM POÇAS D'ÁGUA (Morte) ---
        for (let poca of this.listaPocas) {
            // Caixa de colisão reduzida para o impacto ser justo
            if (
                jogador.x + jogador.largura - 15 > poca.x &&
                jogador.x + 15 < poca.x + poca.largura &&
                jogador.y + jogador.altura >= poca.y + 5
            ) {
                callbackMorte(); // Dispara o Game Over
                break;
            }
        }
    },

    desenhar: function(ctx, cameraX) {
        ctx.imageSmoothingEnabled = false;

        // Desenha Poças D'água (Azul escuro)
        for (let poca of this.listaPocas) {
            const posX = poca.x - cameraX;
            if (posX > -100 && posX < 850) {
                ctx.fillStyle = "#2980b9";
                ctx.fillRect(posX, poca.y, poca.largura, poca.altura);
                ctx.strokeStyle = "#3498db";
                ctx.lineWidth = 2;
                ctx.strokeRect(posX, poca.y, poca.largura, poca.altura);
            }
        }

        // Desenha Plataformas (Sola/Madeira)
        for (let plat of this.listaPlataformas) {
            const posX = plat.x - cameraX;
            if (posX > -150 && posX < 850) {
                ctx.fillStyle = "#8e44ad"; // Placeholder roxo/madeira
                ctx.fillRect(posX, plat.y, plat.largura, plat.altura);
                ctx.strokeStyle = "#ffffff";
                ctx.lineWidth = 2;
                ctx.strokeRect(posX, plat.y, plat.largura, plat.altura);
            }
        }
    },

    resetar: function() {
        this.listaPlataformas = [];
        this.listaPocas = [];
        this.tempoUltimoGerado = 0;
    }
};