// Gerenciador de Cenário e Câmera
const cenarioJogo1 = {
    larguraMapa: 2000, // Comprimento total da fase
    alturaChao: 360,   // Altura em Y onde o solo começa
    cameraX: 0,        // Posição atual da câmera no eixo X

    // Atualiza a câmera para seguir o jogador centralizado na tela
    atualizarCamera: function(jogadorX, larguraCanvas) {
        // Trava a câmera no meio da tela do jogador
        this.cameraX = jogadorX - larguraCanvas / 3;

        // Limite da câmera no início do mapa
        if (this.cameraX < 0) {
            this.cameraX = 0;
        }

        // Limite da câmera no fim do mapa
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
        // Fundo (Céu)
        ctx.fillStyle = "#74b9ff";
        ctx.fillRect(0, 0, larguraCanvas, alturaCanvas);

        // Chão contínuo que se move com a câmera
        ctx.fillStyle = "#2ed573";
        ctx.fillRect(-this.cameraX, this.alturaChao, this.larguraMapa, alturaCanvas - this.alturaChao);

        // Nuvens decorativas acompanhando a câmera
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.beginPath();
        ctx.arc(300 - this.cameraX * 0.5, 80, 40, 0, Math.PI * 2);
        ctx.arc(700 - this.cameraX * 0.5, 100, 50, 0, Math.PI * 2);
        ctx.arc(1200 - this.cameraX * 0.5, 70, 45, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
};