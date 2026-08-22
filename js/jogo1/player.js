// Objeto do Jogador com Física de Platformer
const jogadorJogo1 = {
    x: 100,
    y: 200,
    raio: 20,
    velocidadeX: 5,
    velocidadeY: 0,
    forcaPulo: -12,
    gravidade: 0.6,
    noChao: false,
    cor: "#3498db",

    atualizar: function(alturaChao) {
        // Movimentação Horizontal (A / D ou Setas)
        if (controlesJogo1.esquerda) {
            this.x -= this.velocidadeX;
        }
        if (controlesJogo1.direita) {
            this.x += this.velocidadeX;
        }

        // Pulo (Espaço, W ou Seta para Cima)
        if ((controlesJogo1.cima || controlesJogo1.espaco) && this.noChao) {
            this.velocidadeY = this.forcaPulo;
            this.noChao = false;
        }

        // Aplicação da Gravidade
        this.velocidadeY += this.gravidade;
        this.y += this.velocidadeY;

        // Colisão com o Chão
        if (this.y + this.raio >= alturaChao) {
            this.y = alturaChao - this.raio;
            this.velocidadeY = 0;
            this.noChao = true;
        }

        // Limite para não voltar além do início do mapa (borda esquerda)
        if (this.x - this.raio < 0) {
            this.x = this.raio;
        }
    },

    desenhar: function(ctx, cameraX) {
        // Desenha o jogador aplicando o deslocamento da câmera
        const posX = this.x - cameraX;

        // Corpo da Gota
        ctx.fillStyle = this.cor;
        ctx.beginPath();
        ctx.arc(posX, this.y, this.raio, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

        // Brilho/Reflexo
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(posX - 6, this.y - 6, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
};