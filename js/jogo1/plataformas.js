const plataformasJogo1 = {
    listaPlataformas: [],
    listaPocas: [],
    tempoUltimoGerado: 0,
    intervaloGeracao: 550, // Distância de caminhada para surgir novos obstáculos

    atualizar: function(jogador, callbackMorte) {
        // Gera novos caminhos à frente do jogador
        if (jogador.x - this.tempoUltimoGerado > this.intervaloGeracao) {
            const xBase = jogador.x + 650; // Surge fora da tela visível

            // 1. Gera poça d'água no chão (Morte)
            if (Math.random() > 0.3) {
                this.listaPocas.push({
                    x: xBase,
                    y: 345, // Nível do chão
                    largura: 100,
                    altura: 15
                });
            }

            // 2. Gera plataforma flutuante (Segurança)
            this.listaPlataformas.push({
                x: xBase - 20,
                y: Math.floor(Math.random() * (250 - 180 + 1)) + 180, // Altura aleatória
                largura: 130,
                altura: 20
            });

            this.tempoUltimoGerado = jogador.x;
        }

        // --- COLISÃO COM PLATAFORMAS (Pouso) ---
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
            if (
                jogador.x + jogador.largura - 15 > poca.x &&
                jogador.x + 15 < poca.x + poca.largura &&
                jogador.y + jogador.altura >= poca.y + 5
            ) {
                callbackMorte(); // Ativa a tela de Game Over
                break;
            }
        }
    },

    desenhar: function(ctx, cameraX) {
        ctx.imageSmoothingEnabled = false;

        // Desenha Poças D'água (Obstáculo fatal)
        for (let poca of this.listaPocas) {
            const posX = poca.x - cameraX;
            if (posX > -120 && posX < 850) {
                ctx.fillStyle = "#2980b9";
                ctx.fillRect(posX, poca.y, poca.largura, poca.altura);
                ctx.strokeStyle = "#3498db";
                ctx.lineWidth = 2;
                ctx.strokeRect(posX, poca.y, poca.largura, poca.altura);
            }
        }

        // Desenha Plataformas (Placa roxa/madeira)
        for (let plat of this.listaPlataformas) {
            const posX = plat.x - cameraX;
            if (posX > -150 && posX < 850) {
                ctx.fillStyle = "#8e44ad";
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