// Carregamento da imagem do cenário (500x100 Pixel Art)
const imgFundo = new Image();
imgFundo.src = "img/cenario.png";

const cenarioJogo1 = {
    larguraMapa: 2000,
    alturaChao: 360,
    cameraX: 0,

    atualizarCamera: function(jogadorX, larguraCanvas) {
        this.cameraX = jogadorX - larguraCanvas / 3;

        if (this.cameraX < 0) {
            this.cameraX = 0;
        }
        if (this.cameraX > this.larguraMapa - larguraCanvas) {
            this.cameraX = this.larguraMapa - larguraCanvas;
        }
    },

    desenharMenu: function(ctx, larguraCanvas, alturaCanvas, botaoPlay) {
        ctx.fillStyle = "#1e3a5f";
        ctx.fillRect(0, 0, larguraCanvas, alturaCanvas);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 36px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Ciclo da Água", larguraCanvas / 2, 100);

        ctx.font = "18px Arial";
        ctx.fillText("Ajude o Gota em sua jornada!", larguraCanvas / 2, 135);

        ctx.fillStyle = "#2ecc71";
        ctx.fillRect(botaoPlay.x, botaoPlay.y, botaoPlay.largura, botaoPlay.altura);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 26px Arial";
        ctx.fillText("PLAY", larguraCanvas / 2, botaoPlay.y + 40);
    },

    desenharJogo: function(ctx, larguraCanvas, alturaCanvas) {
        // Desativa o suavizamento para manter o Pixel Art nítido
        ctx.imageSmoothingEnabled = false;

        if (imgFundo.complete && imgFundo.naturalWidth !== 0) {
            // Escala a imagem de 500x100px para preencher os 2000x400px com Scroll
            ctx.drawImage(
                imgFundo,
                -this.cameraX, 0,
                this.larguraMapa, alturaCanvas
            );
        } else {
            // Cor reserva de fundo caso a imagem demore para carregar
            ctx.fillStyle = "#74b9ff";
            ctx.fillRect(0, 0, larguraCanvas, alturaCanvas);
        }

        // Chão/Solo transparente/invisível para a física funcionar mantendo o visual da arte
        // (Se quiser um chão visível desenhado por código, desderive a cor verde abaixo)
        /*
        ctx.fillStyle = "#2ed573";
        ctx.fillRect(-this.cameraX, this.alturaChao, this.larguraMapa, alturaCanvas - this.alturaChao);
        */
    }
};