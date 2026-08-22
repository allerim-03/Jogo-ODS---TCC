const interativosJogo1 = {
    itens: [],
    contadorConcluidos: 0,
    totalObjetivo: 10,
    tempoUltimoItem: 0,
    distanciaInteracao: 70,

    atualizar: function(jogador) {
        // Gera um novo item no caminho a cada distância percorrida
        if (jogador.x - this.tempoUltimoItem > 400) {
            this.itens.push({
                x: jogador.x + 500,
                y: 300,
                largura: 40,
                altura: 40,
                interagido: false,
                cor: "#e67e22" // Laranja
            });
            this.tempoUltimoItem = jogador.x;
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
                        item.cor = "#2ecc71"; // Fica verde ao interagir
                        this.contadorConcluidos++;
                        
                        controlesJogo1.enter = false; // Trava o Enter para não contar duas vezes
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
                // Desenha o bloco
                ctx.fillStyle = item.cor;
                ctx.fillRect(posX, item.y, item.largura, item.altura);

                ctx.strokeStyle = "#ffffff";
                ctx.lineWidth = 2;
                ctx.strokeRect(posX, item.y, item.largura, item.altura);

                // Dica [ENTER]
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
        // Caixa do contador (canto superior direito)
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(larguraCanvas - 150, 15, 130, 40);

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.strokeRect(larguraCanvas - 150, 15, 130, 40);

        // Texto 0/10
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