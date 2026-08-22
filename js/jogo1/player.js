// Carregamento dos sprites de Andando (32x32)
const spritesWalk = [];
for (let i = 1; i <= 4; i++) {
    const img = new Image();
    img.src = `img/gota-walk-${i}.png`;
    spritesWalk.push(img);
}

const jogadorJogo1 = {
    x: 100,
    y: 100,
    largura: 80,
    altura: 80,
    velocidadeX: 5,
    velocidadeY: 0,
    forcaPulo: -13,
    gravidade: 0.6,
    noChao: false,
    
    // Animação e Estados
    frameAtual: 0,
    contadorTempo: 0,
    velocidadeAnimacao: 8,
    olhandoDireita: true,
    estaMorto: false,

    resetar: function() {
        this.x = 100;
        this.y = 100;
        this.velocidadeY = 0;
        this.estaMorto = false;
        this.frameAtual = 0;
    },

    atualizar: function(alturaChao) {
        if (this.estaMorto) return; // Paraisa a física ao morrer

        let movendo = false;

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

        if ((controlesJogo1.cima || controlesJogo1.espaco) && this.noChao) {
            this.velocidadeY = this.forcaPulo;
            this.noChao = false;
        }

        this.velocidadeY += this.gravidade;
        this.y += this.velocidadeY;

        const alturaAjustadaChao = alturaChao - 10;

        if (this.y + this.altura >= alturaAjustadaChao) {
            this.y = alturaAjustadaChao - this.altura;
            this.velocidadeY = 0;
            this.noChao = true;
        }

        if (this.x < 0) this.x = 0;

        if (movendo) {
            this.contadorTempo++;
            if (this.contadorTempo >= this.velocidadeAnimacao) {
                this.contadorTempo = 0;
                this.frameAtual = (this.frameAtual + 1) % 4;
            }
        } else {
            this.frameAtual = 0;
            this.contadorTempo = 0;
        }
    },

    desenhar: function(ctx, cameraX) {
        ctx.imageSmoothingEnabled = false;

        // Visual de Morte (Placeholder até colocarmos a animação)
        if (this.estaMorto) {
            ctx.save();
            ctx.fillStyle = "rgba(231, 76, 60, 0.6)";
            ctx.fillRect(this.x - cameraX, this.y, this.largura, this.altura);
            ctx.restore();
            return;
        }

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