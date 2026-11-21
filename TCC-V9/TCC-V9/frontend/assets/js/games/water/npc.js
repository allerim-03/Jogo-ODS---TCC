// Carregamento das imagens do NPC
const imgNpcStand = new Image();
imgNpcStand.src = "/assets/img/stand-guri.png";

const imgNpcPoint1 = new Image();
imgNpcPoint1.src = "/assets/img/point-guri-1.png";

const imgNpcPoint2 = new Image();
imgNpcPoint2.src = "/assets/img/point-guri-2.png";

// Carregamento do ícone de exclamação
const imgExclamacao = new Image();
imgExclamacao.src = "/assets/img/exclamacao.png";

const npcGuri = {
    x: 220,
    y: 230,
    largura: 65,
    altura: 108,
    distanciaInteracao: 110,
    
    // Estado da conversa, páginas e final da fase
    emConversa: false,
    jaConversou: false,
    modoFinal: false,
    finalConcluido: false,
    indiceFala: 0,
    
    // Animação de fala e exclamação
    frameFala: 0,
    contadorTempo: 0,
    velocidadeAnimacao: 12,
    anguloFlutuacao: 0,

    // Diálogos do início da fase
    falas: [
        "Gota!!! A nossa cidade está precisando muito da sua ajuda!",
        "As torneiras estão vazando e despediçando água...",
        "Ande com as SETAS (↑ ↓ → ←) e aperte ENTER ( ↲ ) para fechar todas!"
    ],

    // Diálogo de agradecimento no final da fase
    mensagemFinal: "Parabéns, Gota! Você fechou todas as torneiras e ajudou a salvar a água da nossa cidade! Muito obrigado!",

    // Prepara o NPC mais à frente quando o jogador completa as 10 torneiras
    prepararFinal: function(novoX) {
        this.x = novoX;
        this.modoFinal = true;
        this.finalConcluido = false;
        this.emConversa = false;
        this.jaConversou = true; // Mantém o ícone de exclamação oculto no final
    },

    // Reseta o NPC para a posição e estado inicial
    resetar: function() {
        this.x = 220;
        this.emConversa = false;
        this.jaConversou = false;
        this.modoFinal = false;
        this.finalConcluido = false;
        this.indiceFala = 0;
    },

    atualizar: function(jogador, callbackVitoria) {
        // Atualiza a oscilação dos elementos flutuantes (exclamação e seta)
        this.anguloFlutuacao += 0.08;

        const centroJogadorX = jogador.x + jogador.largura / 2;
        const centroNpcX = this.x + this.largura / 2;
        const distancia = Math.abs(centroJogadorX - centroNpcX);

        // --- LÓGICA DO ENCONTRO FINAL ---
        if (this.modoFinal) {
            if (distancia <= this.distanciaInteracao && !this.finalConcluido) {
                this.finalConcluido = true;
                this.emConversa = true;
                if (callbackVitoria) callbackVitoria();
            }
            return;
        }

        // --- LÓGICA NORMAL (INÍCIO DA FASE) ---
        if (controlesJogo1.espaco || controlesJogo1.enter) {
            if (distancia <= this.distanciaInteracao) {
                if (!this.emConversa) {
                    this.emConversa = true;
                    this.indiceFala = 0;
                    this.jaConversou = true; // Faz a exclamação sumir após iniciar a 1ª interação
                } else {
                    this.indiceFala++;
                    if (this.indiceFala >= this.falas.length) {
                        this.emConversa = false;
                        this.indiceFala = 0;
                    }
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

        if (posX > -150 && posX < 900) {
            let imgAtual = imgNpcStand;

            // Roda a animação se estiver conversando OU esperando o jogador no final da fase
            if (this.emConversa || this.modoFinal) {
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
                const exclamacaoLargura = 40;
                const exclamacaoAltura = 40;
                const exclamacaoX = posX + (this.largura / 2) - (exclamacaoLargura / 2);
                const exclamacaoY = this.y - exclamacaoAltura - 10 + offsetOffsetY;

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

        // Caixa centralizada e compacta no topo/meio da tela
        const caixaLargura = 460;
        const caixaAltura = 120;
        const caixaX = (larguraCanvas - caixaLargura) / 2;
        const caixaY = 65;

        ctx.fillStyle = "rgba(0, 0, 0, 0.88)";
        ctx.fillRect(caixaX, caixaY, caixaLargura, caixaAltura);

        ctx.strokeStyle = this.modoFinal ? "#2ecc71" : "#ffffff";
        ctx.lineWidth = 3;
        ctx.strokeRect(caixaX, caixaY, caixaLargura, caixaAltura);

        ctx.fillStyle = "#f1c40f";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "left";
        ctx.fillText("Guri:", caixaX + 15, caixaY + 25);

        ctx.fillStyle = "#ffffff";
        ctx.font = "14px Arial";
        const textoAtual = this.modoFinal ? this.mensagemFinal : this.falas[this.indiceFala];
        this.desenharTextoComQuebra(ctx, textoAtual, caixaX + 15, caixaY + 48, caixaLargura - 30, 18);

        // Mostra dicas de navegação apenas durante o diálogo inicial
        if (!this.modoFinal) {
            ctx.fillStyle = "#bdc3c7";
            ctx.font = "italic 11px Arial";
            const textoBotao = (this.indiceFala < this.falas.length - 1) 
                ? "Aperte [ESPAÇO] ou [ENTER] para avançar..." 
                : "Aperte [ESPAÇO] ou [ENTER] para fechar...";
            ctx.textAlign = "right";
            ctx.fillText(textoBotao, caixaX + caixaLargura - 15, caixaY + caixaAltura - 10);

            // Seta animada apontando para o placar na 3ª página
            if (this.indiceFala === 2) {
                this.desenharSetaPlacar(ctx, larguraCanvas);
            }
        }
    },

    // Quebra automaticamente o texto em múltiplas linhas dentro da caixa
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

    // Desenha a seta vermelha dinâmica apontando para o placar HUD
    desenharSetaPlacar: function(ctx, larguraCanvas) {
        const deslocamentoX = Math.sin(this.anguloFlutuacao) * 8;
        const setaX = larguraCanvas - 185 + deslocamentoX;
        const setaY = 35;

        ctx.save();
        ctx.fillStyle = "#e74c3c";
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;

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