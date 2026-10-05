// Carregamento dos sprites de animação da Torneira Aberta (to-1 até to-6)
const spritesTorneira = [];
for (let i = 1; i <= 6; i++) {
    const img = new Image();
    img.src = `img/to-${i}.png`;
    spritesTorneira.push(img);
}

// Sprite da Torneira Fechada (to-7)
const imgTorneiraFechada = new Image();
imgTorneiraFechada.src = "img/to-7.png";

const interativosJogo1 = {
    itens: [],
    contadorConcluidos: 0,
    totalObjetivo: 10,
    tempoUltimoItem: 0,
    distanciaInteracao: 70,
    proximaDistancia: 800, 
    
    // Controle da animação das torneiras e da exclamação
    anguloFlutuacao: 0,
    contadorTempoAnimacao: 0,
    velocidadeAnimacao: 6, // Velocidade de troca dos frames
    frameTorneiraAtual: 0,

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

    gerarItem: function(xBase, listaPocas, listaPlataformas) {
        const largura = 45;
        const altura = 45;

        const tentarPlataforma = Math.random() > 0.5;

        if (tentarPlataforma && listaPlataformas && listaPlataformas.length > 0) {
            const platSorteada = listaPlataformas[listaPlataformas.length - 1];
            const xPlat = platSorteada.x + (platSorteada.largura / 2) - (largura / 2);

            this.itens.push({
                x: xPlat,
                y: platSorteada.y - altura,
                largura: largura,
                altura: altura,
                interagido: false
            });
            return;
        }

        let xChao = xBase + 600;
        let tentativas = 0;

        while (this.caixaEstaSobrePoca(xChao, largura, listaPocas) && tentativas < 10) {
            xChao += 120;
            tentativas++;
        }

        this.itens.push({
            x: xChao,
            y: 315, // Ajustado para o chão (360 - 45)
            largura: largura,
            altura: altura,
            interagido: false
        });
    },

    atualizar: function(jogador, listaPocas, listaPlataformas) {
        this.anguloFlutuacao += 0.08;

        // Atualiza o frame da animação das torneiras abertas (0 a 5 -> to-1 a to-6)
        this.contadorTempoAnimacao++;
        if (this.contadorTempoAnimacao >= this.velocidadeAnimacao) {
            this.contadorTempoAnimacao = 0;
            this.frameTorneiraAtual = (this.frameTorneiraAtual + 1) % 6;
        }

        if (jogador.x - this.tempoUltimoItem > this.proximaDistancia) {
            this.gerarItem(jogador.x, listaPocas, listaPlataformas);
            this.tempoUltimoItem = jogador.x;
            this.proximaDistancia = Math.floor(Math.random() * (1400 - 700 + 1)) + 700;
        }

        // Interação para fechar a torneira
        if (controlesJogo1.enter || controlesJogo1.espaco) {
            for (let item of this.itens) {
                if (!item.interagido) {
                    const centroJogadorX = jogador.x + jogador.largura / 2;
                    const centroItemX = item.x + item.largura / 2;
                    const distancia = Math.abs(centroJogadorX - centroItemX);

                    if (distancia <= this.distanciaInteracao) {
                        item.interagido = true; // Marca como fechada (passa a ser to-7)
                        this.contadorConcluidos++;
                        
                        controlesJogo1.enter = false;
                        controlesJogo1.espaco = false;
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
                let imgTorneira;

                if (item.interagido) {
                    // Torneira Fechada (to-7.png)
                    imgTorneira = imgTorneiraFechada;
                } else {
                    // Torneira Aberta (Animando entre to-1.png e to-6.png)
                    imgTorneira = spritesTorneira[this.frameTorneiraAtual];
                }

                // Desenha a imagem da torneira
                if (imgTorneira && imgTorneira.complete && imgTorneira.naturalWidth !== 0) {
                    ctx.drawImage(imgTorneira, posX, item.y, item.largura, item.altura);
                }

                // Desenha a exclamação flutuante (32x32) apenas se a torneira ainda estiver aberta
                if (!item.interagido && typeof imgExclamacao !== "undefined" && imgExclamacao.complete && imgExclamacao.naturalWidth !== 0) {
                    const offsetOffsetY = Math.sin(this.anguloFlutuacao) * 5;
                    const exclamacaoLargura = 32;
                    const exclamacaoAltura = 32;
                    const exclamacaoX = posX + (item.largura / 2) - (exclamacaoLargura / 2);
                    const exclamacaoY = item.y - exclamacaoAltura - 8 + offsetOffsetY;

                    ctx.drawImage(
                        imgExclamacao,
                        exclamacaoX,
                        exclamacaoY,
                        exclamacaoLargura,
                        exclamacaoAltura
                    );
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