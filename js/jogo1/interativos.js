const interativosJogo1 = {
    itens: [],
    contadorConcluidos: 0,
    totalObjetivo: 10,
    tempoUltimoItem: 0,
    distanciaInteracao: 70,
    
    // Distância inicial mínima até o primeiro objeto aparecer
    proximaDistancia: 800, 

    atualizar: function(jogador) {
        // Verifica se o jogador andou a distância aleatória sorteada
        if (jogador.x - this.tempoUltimoItem > this.proximaDistancia) {
            this.itens.push({
                x: jogador.x + 600, // Surge um pouco fora da tela à direita
                y: 300,
                largura: 40,
                altura: 40,
                interagido: false,
                cor: "#e67e22"
            });
            
            this.tempoUltimoItem = jogador.x;

            // Sorteia uma nova distância bem mais espaçada (entre 700px e 1400px)
            this.proximaDistancia = Math.floor(Math.random() * (1400 - 700 + 1)) + 700;
        }

        // Interação com ENTER
        if (controlesJogo1.enter) {
            for (let item of this.itens) {
                if (!item.interagido) {
                    const centroJogadorX = jogador.x + jogador.largura / 2;
                    const centroItemX = item.x + item.largura / 2;
                    const distancia = Math.abs(centroJogadorX - centroItemX);

                    if (distancia <= this.distanciaInteracao) {
                        item.interagido = true;
                        item.cor = "#2ecc71";
                        this.contadorConcluidos++;
                        
                        controlesJogo1.enter = false;
                        break;
                    }
                }
            }
        }
    },

    desenhar: function(ctx, cameraX, jogador) {
        ctx.imageSmoothingEnabled = false;

        for (let item of this.itens) {
            const posX = item.x - cameraX;

            if (posX > -60 && posX < 850) {
                ctx.fillStyle = item.cor;
                ctx.fillRect(posX, item.y, item.largura, item.altura);

                ctx.strokeStyle = "#ffffff";
                ctx.lineWidth = 2;
                ctx.strokeRect(posX, item.y, item.largura, item.altura);

                if (!item.interagido) {
                    const centroJogadorX = jogador.x + jogador.largura / 2;
                    const centroItemX = item.x + item.largura / 2;
                    const distancia = Math.abs(centroJogadorX - centroItemX);

                    if (distancia <= this.distanciaInteracao) {
                        ctx.fillStyle = "#ffffff";
                        ctx.font = "bold 14px Arial";
                        ctx.textAlign = "center";
                        ctx.fillText("[ENTER]", posX + item.largura / 2, item.y - 12);
                    }
                }
            }
        }
    },

    desenharHUD: function(ctx, larguraCanvas) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(larguraCanvas - 150, 15, 130, 40);

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.strokeRect(larguraCanvas - 150, 15, 130, 40);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 20px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
            `${this.contadorConcluidos}/${this.totalObjetivo}`,
            larguraCanvas - 85,
            42
        );
    }
};