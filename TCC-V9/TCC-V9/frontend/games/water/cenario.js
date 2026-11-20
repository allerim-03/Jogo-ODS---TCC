// Carregamento da imagem do cenário do jogo (500x100 Pixel Art)
const imgFundo = new Image();
imgFundo.src = "/assets/img/cenario.png";

// Carregamento das imagens do Menu (Capa e Botão)
const imgCapaMenu = new Image();
imgCapaMenu.src = "/assets/img/capa-menu.png"; // Ajuste o nome se necessário

const imgBotaoJogar = new Image();
imgBotaoJogar.src = "/assets/img/btn-jogar.png"; // Ajuste o nome se necessário

const cenarioJogo1 = {
    alturaChao: 360,
    cameraX: 0,

    atualizarCamera: function(jogadorX, larguraCanvas) {
        this.cameraX = jogadorX - larguraCanvas / 3;
        if (this.cameraX < 0) {
            this.cameraX = 0;
        }
    },

    desenharMenu: function(ctx, larguraCanvas, alturaCanvas, botaoPlay) {
        ctx.imageSmoothingEnabled = false;

        // 1. Pinta o fundo inteiro com a cor azul exata da capa para cobrir as bordas
        ctx.fillStyle = "#ffffff"; // Cor de fundo azul da sua imagem
        ctx.fillRect(0, 0, larguraCanvas, alturaCanvas);

        // 2. Desenha a imagem centralizada SEM esticar (mantendo proporção original)
        if (imgCapaMenu.complete && imgCapaMenu.naturalWidth !== 0) {
            const imgLargura = imgCapaMenu.naturalWidth;
            const imgAltura = imgCapaMenu.naturalHeight;

            // Calcula a escala para caber na altura ou largura do canvas mantendo a proporção
            const escala = Math.min(larguraCanvas / imgLargura, alturaCanvas / imgAltura);
            const larguraRender = imgLargura * escala;
            const alturaRender = imgAltura * escala;

            // Centraliza na tela
            const xCentralizado = (larguraCanvas - larguraRender) / 2;
            const yCentralizado = (alturaCanvas - alturaRender) / 2;

            ctx.drawImage(imgCapaMenu, xCentralizado, yCentralizado, larguraRender, alturaRender);
        }

        // 3. Desenha o botão de jogar perfeitamente centralizado no meio da tela
        if (imgBotaoJogar.complete && imgBotaoJogar.naturalWidth !== 0) {
            ctx.drawImage(imgBotaoJogar, botaoPlay.x, botaoPlay.y, botaoPlay.largura, botaoPlay.altura);
        } else {
            ctx.fillStyle = "#2ecc71";
            ctx.fillRect(botaoPlay.x, botaoPlay.y, botaoPlay.largura, botaoPlay.altura);
        }
    },

    desenharJogo: function(ctx, larguraCanvas, alturaCanvas) {
        ctx.imageSmoothingEnabled = false;

        if (imgFundo.complete && imgFundo.naturalWidth !== 0) {
            const larguraRedimensionada = (alturaCanvas / imgFundo.naturalHeight) * imgFundo.naturalWidth;
            const offsetX = -(this.cameraX % larguraRedimensionada);

            ctx.drawImage(imgFundo, offsetX, 0, larguraRedimensionada, alturaCanvas);
            ctx.drawImage(imgFundo, offsetX + larguraRedimensionada, 0, larguraRedimensionada, alturaCanvas);
        } else {
            ctx.fillStyle = "#74b9ff";
            ctx.fillRect(0, 0, larguraCanvas, alturaCanvas);
        }
    }
};