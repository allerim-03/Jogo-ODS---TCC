// Carregamento das imagens do NPC
const imgNpcStand = new Image();
imgNpcStand.src = "img/stand-guri.png";

const imgNpcPoint1 = new Image();
imgNpcPoint1.src = "img/point-guri-1.png";

const imgNpcPoint2 = new Image();
imgNpcPoint2.src = "img/point-guri-2.png";

const npcGuri = {
    x: 220,               // Posição no mundo logo no início da fase
    y: 280,               // Ajustado para ficar apoiado no chão
    largura: 80,
    altura: 80,
    
    // Estado da conversa
    emConversa: false,
    
    // Controle da animação ao falar
    frameFala: 0,
    contadorTempo: 0,
    velocidadeAnimacao: 12, // Troca de frame a cada 12 ticks

    // Mensagem transmitida pelo NPC
    mensagem: "Cuidado! Precisamos fechar todas as torneiras para salvar a água!",

    desenhar: function(ctx, cameraX) {
        ctx.imageSmoothingEnabled = false;
        const posX = this.x - cameraX;

        // Só desenha se estiver visível na tela
        if (posX > -100 && posX < 850) {
            let imgAtual = imgNpcStand;

            if (this.emConversa) {
                // Alterna entre point-guri-1 e point-guri-2
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

            // Desenha o sprite do NPC
            if (imgAtual.complete && imgAtual.naturalWidth !== 0) {
                ctx.drawImage(imgAtual, posX, this.y, this.largura, this.altura);
            }

            // Dica flutuante sobre a cabeça quando parado
            if (!this.emConversa) {
                ctx.fillStyle = "#ffffff";
                ctx.font = "bold 12px Arial";
                ctx.textAlign = "center";
                ctx.fillText("[CLIQUE EM MIMF]", posX + this.largura / 2, this.y - 10);
            }
        }
    },

    desenharDialogo: function(ctx, larguraCanvas, alturaCanvas) {
        if (!this.emConversa) return;

        // Caixinha de Diálogo no rodapé da tela
        const caixaX = 30;
        const caixaY = alturaCanvas - 110;
        const caixaLargura = larguraCanvas - 60;
        const caixaAltura = 90;

        // Fundo escuro semitransparente
        ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
        ctx.fillRect(caixaX, caixaY, caixaLargura, caixaAltura);

        // Borda branca
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;
        ctx.strokeRect(caixaX, caixaY, caixaLargura, caixaAltura);

        // Nome do NPC
        ctx.fillStyle = "#f1c40f";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "left";
        ctx.fillText("Guri:", caixaX + 15, caixaY + 25);

        // Texto do Diálogo
        ctx.fillStyle = "#ffffff";
        ctx.font = "14px Arial";
        ctx.fillText(this.mensagem, caixaX + 15, caixaY + 50);

        // Instrução para fechar
        ctx.fillStyle = "#bdc3c7";
        ctx.font = "italic 11px Arial";
        ctx.fillText("Clique para fechar...", caixaX + caixaLargura - 120, caixaY + caixaAltura - 12);
    },

    // Verifica se o clique do mouse acertou o NPC ou a caixa de diálogo
    verificarClique: function(mouseX, mouseY, cameraX) {
        const posX = this.x - cameraX;

        // Se já está conversando, qualquer clique fecha a caixa
        if (this.emConversa) {
            this.emConversa = false;
            return true;
        }

        // Se clicou diretamente no NPC parado
        if (
            mouseX >= posX && mouseX <= posX + this.largura &&
            mouseY >= this.y && mouseY <= this.y + this.altura
        ) {
            this.emConversa = true;
            return true;
        }

        return false;
    }
};