// Carregamento das imagens do NPC
const imgNpcStand = new Image();
imgNpcStand.src = "STATIC/img/stand-guri.png";

const imgNpcPoint1 = new Image();
imgNpcPoint1.src = "STATIC/img/point-guri-1.png";

const imgNpcPoint2 = new Image();
imgNpcPoint2.src = "STATIC/img/point-guri-2.png";

// Carregamento do ícone de exclamação
const imgExclamacao = new Image();
imgExclamacao.src = "STATIC/img/exclamacao.png";

const npcGuri = {
    x: 220,
    y: 280,
    largura: 50,
    altura: 70,
    distanciaInteracao: 90,
    
    // Estado da conversa e páginas
    emConversa: false,
    jaConversou: false,
    indiceFala: 0,

    // Animação de fala e exclamação
    frameFala: 0,
    contadorTempo: 0,
    velocidadeAnimacao: 12,
    anguloFlutuacao: 0,

    // Lista de mensagens por etapas
    falas: [
        "Gota! Nos ajude! Precisamos parar o desperdício de água na cidade!",
        "Feche apertando ENTER nas torneiras!",
        "Quando você fechar todas, você ganha pontos no ranking! Boa sorte!"
    ],

    atualizar: function(jogador) {
        // Atualiza a oscilação de elementos flutuantes (exclamação e seta)
        this.anguloFlutuacao += 0.08;

        // Se o jogador pressionar ESPAÇO ou ENTER perto do NPC
        if (controlesJogo1.espaco || controlesJogo1.enter) {
            const centroJogadorX = jogador.x + jogador.largura / 2;
            const centroNpcX = this.x + this.largura / 2;
            const distancia = Math.abs(centroJogadorX - centroNpcX);

            if (distancia <= this.distanciaInteracao) {
                if (!this.emConversa) {
                    this.emConversa = true;
                    this.indiceFala = 0;
                    this.jaConversou = true; // Faz a exclamação sumir para sempre após iniciar a 1ª conversa
                } else {
                    // Avança para a próxima fala ou encerra a conversa
                    this.indiceFala++;
                    if (this.indiceFala >= this.falas.length) {
                        this.emConversa = false;
                        this.indiceFala = 0;
                    }
                }

                // Consome a tecla para evitar cliques duplos rápidos
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
                const offsetOffsetY = Math.sin(this.anguloFlutuacao) * 5;
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

        // Dimensões compactas e centralizadas na parte superior/média
        const caixaLargura = 460;
        const caixaAltura = 120;
        const caixaX = (larguraCanvas - caixaLargura) / 2;
        const caixaY = 80;

        // Fundo semi-transparente e borda estilo retro
        ctx.fillStyle = "rgba(0, 0, 0, 0.88)";
        ctx.fillRect(caixaX, caixaY, caixaLargura, caixaAltura);

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;
        ctx.strokeRect(caixaX, caixaY, caixaLargura, caixaAltura);

        // Título/Nome do NPC
        ctx.fillStyle = "#f1c40f";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "left";
        ctx.fillText("Guri:", caixaX + 15, caixaY + 25);

        // Quebra automática de texto para não ultrapassar a caixa
        ctx.fillStyle = "#ffffff";
        ctx.font = "14px Arial";
        const textoAtual = this.falas[this.indiceFala];
        this.desenharTextoComQuebra(ctx, textoAtual, caixaX + 15, caixaY + 48, caixaLargura - 30, 18);

        // Indicador de navegação/avanço
        ctx.fillStyle = "#bdc3c7";
        ctx.font = "italic 11px Arial";
        const textoBotao = (this.indiceFala < this.falas.length - 1) 
            ? "Aperte [ESPAÇO] ou [ENTER] para avançar..." 
            : "Aperte [ESPAÇO] ou [ENTER] para fechar...";
        ctx.textAlign = "right";
        ctx.fillText(textoBotao, caixaX + caixaLargura - 15, caixaY + caixaAltura - 10);

        // Desenha a seta apontando para o placar HUD na página 3
        if (this.indiceFala === 2) {
            this.desenharSetaPlacar(ctx, larguraCanvas);
        }
    },

    // Função auxiliar para quebrar linhas longas dentro do balão de fala
    desenharTextoComQuebra: function(ctx, texto, x, y, larguraMaxima, alturaLinha) {
        const palavras = texto.split(" ");
        let linha = "";

        for (let n = 0; n < palavras.length; n++) {
            const linhaTeste = linha + palavras[n] + " ";
            const metricas = ctx.measureText(linhaTeste);
            const larguraTeste = metricas.width;

            if (larguraTeste > larguraMaxima && n > 0) {
                ctx.fillText(linha, x, y);
                linha = palavras[n] + " ";
                y += alturaLinha;
            } else {
                linha = linhaTeste;
            }
        }
        ctx.fillText(linha, x, y);
    },

    // Desenha uma seta animada no canto superior direito apontando para a pontuação HUD
    desenharSetaPlacar: function(ctx, larguraCanvas) {
        const deslocamentoX = Math.sin(this.anguloFlutuacao) * 8; // Animação de ida e volta na horizontal
        const setaX = larguraCanvas - 175 + deslocamentoX;
        const setaY = 35;

        ctx.save();
        ctx.fillStyle = "#e74c3c";
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;

        // Desenho do corpo e ponta da seta
        ctx.beginPath();
        ctx.moveTo(setaX, setaY - 8);
        ctx.lineTo(setaX + 15, setaY - 8);
        ctx.lineTo(setaX + 15, setaY - 14);
        ctx.lineTo(setaX + 28, setaY);
        ctx.lineTo(setaX + 15, setaY + 14);
        ctx.lineTo(setaX + 15, setaY + 8);
        ctx.lineTo(setaX, setaY + 8);
        ctx.closePath();

        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
};