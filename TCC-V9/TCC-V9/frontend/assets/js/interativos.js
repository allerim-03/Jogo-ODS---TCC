// Carregamento dos sprites de animação da Torneira Aberta (to-1 até to-6)
const spritesTorneira = [];
for (let i = 1; i <= 6; i++) {
    const img = new Image();
    img.src = `/assets/img/to-${i}.png`;
    spritesTorneira.push(img);
}

// Sprite da Torneira Fechada (to-7)
const imgTorneiraFechada = new Image();
imgTorneiraFechada.src = "/assets/img/to-7.png";

// Canvas auxiliar fora da tela para escurecer apenas os pixels opacos do sprite (sem quadrado)
const canvasSpriteEscuro = document.createElement("canvas");
const ctxSpriteEscuro = canvasSpriteEscuro.getContext("2d");

const interativosJogo1 = {
    itens: [],
    contadorConcluidos: 0,
    totalObjetivo: 10,
    tempoUltimoItem: 0,
    distanciaInteracao: 80,
    proximaDistancia: 800, 
    
    // Controle da animação das torneiras, brilho e exclamação
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
        const largura = 64;
        const altura = 64;

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
            y: 360 - altura, // Mantém a base encostada no chão
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

        // 1. Só gera novas torneiras se ainda não atingiu o objetivo (10)
        if (this.contadorConcluidos < this.totalObjetivo && (jogador.x - this.tempoUltimoItem > this.proximaDistancia)) {
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
                        
                        if (EcoAPI.current()?.role === 'aluno') {
                            EcoAPI.recordResult({
                                runId: jogo1RunId + ':' + this.contadorConcluidos,
                                game: 'jogo1',
                                points: 100,
                                completed: this.contadorConcluidos === this.totalObjetivo,
                                details: {
                                    mission: this.contadorConcluidos,
                                    assignmentId: new URLSearchParams(location.search).get('assignment')
                                }
                            }).catch(error => EcoAPI.showError(error));
                        }

                        // 2. Se acabou de fechar a 10ª torneira, posiciona o Guri mais à frente para o final
                        if (this.contadorConcluidos >= this.totalObjetivo && typeof npcGuri !== "undefined") {
                            npcGuri.prepararFinal(jogador.x + 1500);
                        }
                        
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

            if (posX > -item.largura - 20 && posX < 850) {
                let imgTorneira;

                if (item.interagido) {
                    // Torneira Fechada (to-7.png)
                    imgTorneira = imgTorneiraFechada;
                } else {
                    // Torneira Aberta (Animando entre to-1.png e to-6.png)
                    imgTorneira = spritesTorneira[this.frameTorneiraAtual];
                }

                // Desenha a imagem da torneira com brilho se aberta ou escurecendo só o sprite se fechada
                if (imgTorneira && imgTorneira.complete && imgTorneira.naturalWidth !== 0) {
                    ctx.save();

                    if (!item.interagido) {
                        // Brilho suave pulsante quando ainda não foi fechada
                        const pulsoBrilho = 10 + Math.sin(this.anguloFlutuacao * 1.4) * 5;
                        ctx.shadowColor = "rgba(255, 245, 157, 0.9)";
                        ctx.shadowBlur = pulsoBrilho;
                        ctx.drawImage(imgTorneira, posX, item.y, item.largura, item.altura);
                    } else {
                        // Escurece apenas os pixels opacos do sprite (sem deixar quadrado)
                        canvasSpriteEscuro.width = item.largura;
                        canvasSpriteEscuro.height = item.altura;
                        ctxSpriteEscuro.imageSmoothingEnabled = false;
                        ctxSpriteEscuro.clearRect(0, 0, item.largura, item.altura);

                        ctxSpriteEscuro.globalCompositeOperation = "source-over";
                        ctxSpriteEscuro.drawImage(imgTorneira, 0, 0, item.largura, item.altura);

                        ctxSpriteEscuro.globalCompositeOperation = "source-atop";
                        ctxSpriteEscuro.fillStyle = "rgba(0, 0, 0, 0.35)";
                        ctxSpriteEscuro.fillRect(0, 0, item.largura, item.altura);

                        ctx.drawImage(canvasSpriteEscuro, posX, item.y, item.largura, item.altura);
                    }

                    ctx.restore();
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