// Carregamento da imagem do cenário (500x100 Pixel Art)
const imgFundo = new Image();
imgFundo.src = "img/cenario.png";

const cenarioJogo1 = {
    alturaChao: 360,
    cameraX: 0,

    atualizarCamera: function(jogadorX, larguraCanvas) {
        // Câmera segue o jogador continuamente
        this.cameraX = jogadorX - larguraCanvas / 3;

        if (this.cameraX < 0) {
            this.cameraX = 0;
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
        ctx.imageSmoothingEnabled = false;

        if (imgFundo.complete && imgFundo.naturalWidth !== 0) {
            // Mantém a proporção exata de 500x100 projetada para a altura do Canvas (400px)
            // 100px altura -> 400px canvas (escala de 4x)
            // 500px largura -> 2000px largura no canvas
            const larguraRedimensionada = (alturaCanvas / imgFundo.naturalHeight) * imgFundo.naturalWidth;

            // Calcula o deslocamento contínuo em loop
            const offsetX = -(this.cameraX % larguraRedimensionada);

            // Desenha a imagem principal e a próxima para emendar sem cortes
            ctx.drawImage(imgFundo, offsetX, 0, larguraRedimensionada, alturaCanvas);
            ctx.drawImage(imgFundo, offsetX + larguraRedimensionada, 0, larguraRedimensionada, alturaCanvas);
        } else {
            ctx.fillStyle = "#74b9ff";
            ctx.fillRect(0, 0, larguraCanvas, alturaCanvas);
        }
    }
};