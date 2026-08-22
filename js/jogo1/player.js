// Carregamento dos sprites de Andando (32x32)
const spritesWalk = [];
for (let i = 1; i <= 4; i++) {
    const img = new Image();
    img.src = `img/gota-walk-${i}.png`;
    spritesWalk.push(img);
}

const jogadorJogo1 = {
    x: 100,
    y: 200,
    largura: 32,
    altura: 32,
    velocidadeX: 5,
    velocidadeY: 0,
    forcaPulo: -12,
    gravidade: 0.6,
    noChao: false,
    
    // Controle de Animação
    frameAtual: 0,
    contadorTempo: 0,
    velocidadeAnimacao: 8,
    olhandoDireita: true,

    atualizar: function(alturaChao) {
        let movendo = false;

        // Movimentação
        if (controlesJogo1.esquerda) {
            this.x -= this.velocidadeX;
            this.olhandoDireita = false;
            movendo = true;
        }
        if (controlesJogo1.direita) {
            this.x += this.velocidadeX;
            this.olhandoDireita = true;
            movendo = true;
        }

        // Pulo
        if ((controlesJogo1.cima || controlesJogo1.espaco) && this.noChao) {
            this.velocidadeY = this.forcaPulo;
            this.noChao = false;
        }

        // Gravidade e Colisão com Chão
        this.velocidadeY += this.gravidade;
        this.y += this.velocidadeY;

        if (this.y + this.altura >= alturaChao) {
            this.y = alturaChao - this.altura;
            this.velocidadeY = 0;
            this.noChao = true;
        }

        if (this.x < 0) this.x = 0;

        // Animação roda quando está se movendo (ou trava no frame 0 ao parar)
        if (movendo) {
            this.contadorTempo++;
            if (this.contadorTempo >= this.velocidadeAnimacao) {
                this.contadorTempo = 0;
                this.frameAtual = (this.frameAtual + 1) % 4;
            }
        } else {
            this.frameAtual = 0; // Frame parado padrão
            this.contadorTempo = 0;
        }
    },

    desenhar: function(ctx, cameraX) {
        ctx.imageSmoothingEnabled = false;

        const imgAtual = spritesWalk[this.frameAtual];
        const posX = this.x - cameraX;

        ctx.save();

        if (!this.olhandoDireita) {
            ctx.translate(posX + this.largura, this.y);
            ctx.scale(-1, 1);
            if (imgAtual.complete && imgAtual.naturalWidth !== 0) {
                ctx.drawImage(imgAtual, 0, 0, this.largura, this.altura);
            }
        } else {
            if (imgAtual.complete && imgAtual.naturalWidth !== 0) {
                ctx.drawImage(imgAtual, posX, this.y, this.largura, this.altura);
            }
        }

        ctx.restore();
    }
};