// Carregamento dos sprites de Andando (32x32)
const spritesWalk = [];
for (let i = 1; i <= 4; i++) {
    const img = new Image();
    img.src = `/assets/img/gota-walk-${i}.png`;
    spritesWalk.push(img);
}

const jogadorJogo1 = {
    x: 100,
    y: 100,
    largura: 80,
    altura: 80,
    velocidadeX: 5,
    velocidadeMax: 6.8,   // Velocidade máxima um pouco mais rápida
    aceleracao: 0.65,     // Quão rápido ele pega embalo
    atrito: 0.86,         // Deslizada leve ao soltar as teclas
    vx: 0,                // Velocidade horizontal atual
    velocidadeY: 0,
    forcaPulo: -10.8,     // Pulo inicial mais contido
    forcaPuloDuplo: -9.5, // Segundo pulo (mortal) sem sair do topo da tela
    gravidade: 0.6,
    noChao: false,

    // Controle de pulo duplo, mortal e pausa da dica no 1º pulo
    maxPulos: 2,
    pulosDisponiveis: 2,
    puloSegurado: false,
    fazendoMortal: false,
    anguloMortal: 0,
    velocidadeMortal: 0.30, // Velocidade do giro em radianos por frame
    mostrouDicaPuloDuplo: false,
    pausadoPorDica: false,
    aguardandoNovoAperto: false,
    
    // Animação e Estados
    frameAtual: 0,
    contadorTempo: 0,
    velocidadeAnimacao: 7,
    olhandoDireita: true,
    estaMorto: false,

    resetar: function() {
        this.x = 100;
        this.y = 100;
        this.vx = 0;
        this.velocidadeY = 0;
        this.noChao = false;
        this.pulosDisponiveis = this.maxPulos;
        this.puloSegurado = false;
        this.fazendoMortal = false;
        this.anguloMortal = 0;
        this.mostrouDicaPuloDuplo = false;
        this.pausadoPorDica = false;
        this.aguardandoNovoAperto = false;
        this.estaMorto = false;
        this.frameAtual = 0;
    },

    atualizar: function(alturaChao) {
        if (this.estaMorto) return; // Congela a movimentação/física em caso de morte

        const querPular = Boolean(controlesJogo1.cima || controlesJogo1.espaco);

        // Congela o jogo no 1º pulo até o jogador soltar e apertar o pulo novamente
        if (this.pausadoPorDica) {
            if (!querPular) {
                this.aguardandoNovoAperto = true;
            } else if (this.aguardandoNovoAperto) {
                this.pausadoPorDica = false;
                this.aguardandoNovoAperto = false;
                this.puloSegurado = false; // Permite acionar o pulo duplo em seguida
            }
            return;
        }

        let segurandoDirecao = false;

        // Suporte total a WASD e Setinhas com aceleração e deslize
        if (controlesJogo1.esquerda) {
            this.vx -= this.aceleracao;
            if (this.vx < -this.velocidadeMax) {
                this.vx = -this.velocidadeMax;
            }
            this.olhandoDireita = false;
            segurandoDirecao = true;
        }
        if (controlesJogo1.direita) {
            this.vx += this.aceleracao;
            if (this.vx > this.velocidadeMax) {
                this.vx = this.velocidadeMax;
            }
            this.olhandoDireita = true;
            segurandoDirecao = true;
        }

        // Quando solta as teclas, aplica o atrito para gerar a deslizada leve
        if (!segurandoDirecao) {
            this.vx *= this.atrito;
            if (Math.abs(this.vx) < 0.08) {
                this.vx = 0;
            }
        }

        // Aplica o deslocamento horizontal
        this.x += this.vx;

        // Lógica de Pulo e Pulo Duplo (exige soltar e apertar de novo para o 2º pulo)
        if (querPular && !this.puloSegurado && this.pulosDisponiveis > 0) {
            const ehSegundoPulo = this.pulosDisponiveis < this.maxPulos;

            this.velocidadeY = ehSegundoPulo ? this.forcaPuloDuplo : this.forcaPulo;
            this.pulosDisponiveis--;
            this.noChao = false;
            this.puloSegurado = true;

            // No primeiro pulo da partida, congela a tela com a dica de pulo duplo
            if (!ehSegundoPulo && !this.mostrouDicaPuloDuplo) {
                this.mostrouDicaPuloDuplo = true;
                this.pausadoPorDica = true;
                this.aguardandoNovoAperto = false;
            }

            // Ao dar o segundo pulo, inicia o mortal
            if (ehSegundoPulo) {
                this.fazendoMortal = true;
                this.anguloMortal = 0;
            }
        } else if (!querPular) {
            this.puloSegurado = false;
        }

        // Atualiza o giro do mortal no ar
        if (this.fazendoMortal) {
            const direcaoGiro = this.olhandoDireita ? 1 : -1;
            this.anguloMortal += this.velocidadeMortal * direcaoGiro;

            if (Math.abs(this.anguloMortal) >= Math.PI * 2) {
                this.anguloMortal = 0;
                this.fazendoMortal = false;
            }
        }

        // Aplicação da gravidade
        this.velocidadeY += this.gravidade;
        this.y += this.velocidadeY;

        // Ajuste da linha do chão (Areia)
        const alturaAjustadaChao = alturaChao - 10;

        if (this.y + this.altura >= alturaAjustadaChao) {
            this.y = alturaAjustadaChao - this.altura;
            this.velocidadeY = 0;
            this.noChao = true;
            this.pulosDisponiveis = this.maxPulos;
            this.fazendoMortal = false;
            this.anguloMortal = 0;
        }

        // Trava apenas o início do mapa à esquerda e zera o embalo se bater na borda
        if (this.x < 0) {
            this.x = 0;
            if (this.vx < 0) this.vx = 0;
        }

        // Lógica dos frames de animação (anima enquanto anda ou desliza com embalo)
        const estaEmMovimento = segurandoDirecao || Math.abs(this.vx) > 0.4;
        if (estaEmMovimento) {
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

    desenharDicaPuloDuplo: function(ctx, larguraCanvas, alturaCanvas) {
        if (!this.pausadoPorDica) return;

        ctx.save();
        // Fundo escuro translúcido no mesmo estilo da tela de morte
        ctx.fillStyle = "rgba(0, 0, 0, 0.72)";
        ctx.fillRect(0, 0, larguraCanvas, alturaCanvas);

        ctx.textAlign = "center";

        // Duas setinhas em destaque
        ctx.fillStyle = "#f1c40f";
        ctx.font = "bold 38px Arial";
        ctx.fillText("↑↑", larguraCanvas / 2, 120);

        // Texto explicando o pulo duplo
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 20px Arial";
        ctx.fillText("Você pode pular duas vezes!", larguraCanvas / 2, 160);

        ctx.fillStyle = "#bdc3c7";
        ctx.font = "14px Arial";
        ctx.fillText("Aperte [ESPAÇO] ou [↑] novamente para continuar", larguraCanvas / 2, 192);
        ctx.restore();
    },

    desenhar: function(ctx, cameraX) {
        ctx.imageSmoothingEnabled = false;

        const imgAtual = spritesWalk[0]; // Usa o sprite base quando deitado na morte, ou o frame atual
        const spriteParaDesenhar = this.estaMorto ? imgAtual : spritesWalk[this.frameAtual];
        const posX = this.x - cameraX;
        const centroX = posX + this.largura / 2;
        // Encosta um pouco mais embaixo quando deitado para não ficar flutuando
        const centroY = this.estaMorto ? (this.y + this.altura - 24) : (this.y + this.altura / 2);

        ctx.save();
        ctx.translate(centroX, centroY);

        if (this.estaMorto) {
            // Deita o Gota de lado (90 graus)
            ctx.rotate(this.olhandoDireita ? Math.PI / 2 : -Math.PI / 2);
        } else if (this.fazendoMortal) {
            ctx.rotate(this.anguloMortal);
        }

        if (!this.olhandoDireita && !this.estaMorto) {
            ctx.scale(-1, 1);
        }

        if (spriteParaDesenhar && spriteParaDesenhar.complete && spriteParaDesenhar.naturalWidth !== 0) {
            ctx.drawImage(spriteParaDesenhar, -this.largura / 2, -this.altura / 2, this.largura, this.altura);
        }
        ctx.restore();
    }
};