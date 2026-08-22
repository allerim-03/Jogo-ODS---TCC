const interativosJogo1 = {
    itens: [],
    contadorConcluidos: 0,
    totalObjetivo: 10,
    tempoUltimoItem: 0,
    distanciaInteracao: 70,
    proximaDistancia: 800, 

    // Garante que a caixa não nasça flutuando sobre uma poça
    caixaEstaSobrePoca: function(caixaX, larguraCaixa, listaPocas) {
        if (!listaPocas) return false;

        for (let poca of listaPocas) {
            if (
                caixaX + larguraCaixa + 20 > poca.x &&
                caixaX - 20 < poca.x + poca.largura
            ) {
                return true;
            }
        }
        return false;
    },

    // Gera o item no chão (seco) ou em cima de uma plataforma
    gerarItem: function(xBase, listaPocas, listaPlataformas) {
        const largura = 40;
        const altura = 40;

        // 50% de chance de tentar spawnar em plataforma (se houver alguma)
        const tentarPlataforma = Math.random() > 0.5;

        if (tentarPlataforma && listaPlataformas && listaPlataformas.length > 0) {
            const platSorteada = listaPlataformas[listaPlataformas.length - 1];
            const xPlat = platSorteada.x + (platSorteada.largura / 2) - (largura / 2);

            this.itens.push({
                x: xPlat,
                y: platSorteada.y - altura, // Fica sobre a plataforma
                largura: largura,
                altura: altura,
                interagido: false,
                cor: "#e67e22"
            });
            return;
        }

        // Se for no chão, busca posição segura (fora da água)
        let xChao = xBase + 600;
        let tentativas = 0;

        while (this.caixaEstaSobrePoca(xChao, largura, listaPocas) && tentativas < 10) {
            xChao += 120;
            tentativas++;
        }

        this.itens.push({
            x: xChao,
            y: 320, // Altura exata do chão (360 - 40)
            largura: largura,
            altura: altura,
            interagido: false,
            cor: "#e67e22"
        });
    },

    atualizar: function(jogador, listaPocas, listaPlataformas) {
        // Verifica spawn com base na distância sorteada
        if (jogador.x - this.tempoUltimoItem > this.proximaDistancia) {
            this.gerarItem(jogador.x, listaPocas, listaPlataformas);
            this.tempoUltimoItem = jogador.x;
            this.proximaDistancia = Math.floor(Math.random() * (1400 - 700 + 1)) + 700;
        }

        // Interação com a tecla ENTER
        if (controlesJogo1.enter) {
            for (let item of this.itens) {
                if (!item.interagido) {
                    const centroJogadorX = jogador.x + jogador.largura / 2;
                    const centroItemX = item.x + item.largura / 2;
                    const distancia = Math.abs(centroJogadorX - centroItemX);

                    if (distancia <= this.distanciaInteracao) {
                        item.interagido = true;
                        item.cor = "#2ecc71"; // Fica verde ao coletar
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

                // Mostra a dica [ENTER] se o jogador estiver perto
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