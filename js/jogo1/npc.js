// Carregamento das imagens do NPC
const imgNpcStand = new Image();
imgNpcStand.src = "img/stand-guri.png";

const imgNpcPoint1 = new Image();
imgNpcPoint1.src = "img/point-guri-1.png";

const imgNpcPoint2 = new Image();
imgNpcPoint2.src = "img/point-guri-2.png";

// Carregamento do ícone de exclamação
const imgExclamacao = new Image();
imgExclamacao.src = "img/exclamacao.png";

const npcGuri = {
    x: 220,
    y: 280,
    largura: 50,
    altura: 70,
    distanciaInteracao: 90,
    
    // Estado da conversa e se já interagiu alguma vez
    emConversa: false,
    jaConversou: false,
    
    // Animação de fala
    frameFala: 0,
    contadorTempo: 0,
    velocidadeAnimacao: 12,

    // Animação da exclamação flutuante
    anguloFlutuacao: 0,

    mensagem: "Cuidado! Precisamos fechar todas as torneiras para salvar a água!",

    atualizar: function(jogador) {
        // Atualiza a oscilação da exclamação
        this.anguloFlutuacao += 0.08;

        // Se o jogador pressionar ESPAÇO ou ENTER perto do NPC
        if (controlesJogo1.espaco || controlesJogo1.enter) {
            const centroJogadorX = jogador.x + jogador.largura / 2;
            const centroNpcX = this.x + this.largura / 2;
            const distancia = Math.abs(centroJogadorX - centroNpcX);

            if (distancia <= this.distanciaInteracao) {
                if (!this.emConversa) {
                    this.emConversa = true;
                    this.jaConversou = true; // Faz a exclamação sumir para sempre após a 1ª interação
                } else {
                    this.emConversa = false;
                }

                // Consome a tecla para não disparar várias vezes seguidas
                controlesJogo1.espaco = false;
                controlesJogo1.enter = false;
            }
        }
    },

    desenhar: function(ctx, cameraX) {
        ctx.imageSmoothingEnabled = false;
        const posX = this.x - cameraX;

        if (posX > -100 && posX < 850) {
            let imgAtual = imgNpcStand;

            if (this.emConversa) {
                this.contadorTempo++;
                if (this.contadorTempo >= this.velocidadeAnimacao) {
                    this.contadorTempo = 0;
                    this.frameFala = this.frameFala === 0 ? 1 : 0;
                }
                imgAtual = this.frameFala === 0 ? imgNpcPoint1 : imgNpcPoint2;
            } else {
                this.frameFala = 0;
                this.contadorTempo = 0;
            }

            // Desenha o NPC
            if (imgAtual.complete && imgAtual.naturalWidth !== 0) {
                ctx.drawImage(imgAtual, posX, this.y, this.largura, this.altura);
            }

            // Desenha a exclamação animada (apenas se ainda NÃO conversou)
            if (!this.jaConversou && imgExclamacao.complete && imgExclamacao.naturalWidth !== 0) {
                const offsetOffsetY = Math.sin(this.anguloFlutuacao) * 5; // Faz subir e descer 5px
                const exclamacaoLargura = 24;
                const exclamacaoAltura = 24;
                const exclamacaoX = posX + (this.largura / 2) - (exclamacaoLargura / 2);
                const exclamacaoY = this.y - exclamacaoAltura - 8 + offsetOffsetY;

                ctx.drawImage(
                    imgExclamacao,
                    exclamacaoX,
                    exclamacaoY,
                    exclamacaoLargura,
                    exclamacaoAltura
                );
            }
        }
    },

    desenharDialogo: function(ctx, larguraCanvas, alturaCanvas) {
        if (!this.emConversa) return;

        const caixaX = 30;
        const caixaY = alturaCanvas - 110;
        const caixaLargura = larguraCanvas - 60;
        const caixaAltura = 90;

        ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
        ctx.fillRect(caixaX, caixaY, caixaLargura, caixaAltura);

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;
        ctx.strokeRect(caixaX, caixaY, caixaLargura, caixaAltura);

        ctx.fillStyle = "#f1c40f";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "left";
        ctx.fillText("Guri:", caixaX + 15, caixaY + 25);

        ctx.fillStyle = "#ffffff";
        ctx.font = "14px Arial";
        ctx.fillText(this.mensagem, caixaX + 15, caixaY + 50);

        ctx.fillStyle = "#bdc3c7";
        ctx.font = "italic 11px Arial";
        ctx.fillText("Aperte [ESPAÇO] ou [ENTER] para fechar...", caixaX + caixaLargura - 230, caixaY + caixaAltura - 12);
    }
};