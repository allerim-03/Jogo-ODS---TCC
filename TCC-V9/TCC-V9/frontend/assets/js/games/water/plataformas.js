const plataformasJogo1 = {
    listaPlataformas: [],
    listaPocas: [],
    tempoUltimoGerado: 0,
    distanciaModulo: 1100, // Comprimento de cada bloco de fase

    // Biblioteca de Padrões (Level Design)
    modulos: [
        // Módulo 1: Poça pequena + Escada subindo
        function(xBase) {
            return {
                pocas: [
                    { x: xBase + 200, y: 345, largura: 100, altura: 15 }
                ],
                plataformas: [
                    { x: xBase + 100, y: 250, largura: 120, altura: 16 },
                    { x: xBase + 350, y: 220, largura: 100, altura: 16 },
                    { x: xBase + 500, y: 170, largura: 100, altura: 16 },
                    { x: xBase + 650, y: 120, largura: 120, altura: 16 }
                ]
            };
        },

        // Módulo 2: Poça grande no chão + Plataforma longa de travessia
        function(xBase) {
            return {
                pocas: [
                    { x: xBase + 300, y: 345, largura: 350, altura: 15 }
                ],
                plataformas: [
                    { x: xBase + 150, y: 240, largura: 110, altura: 16 },
                    { x: xBase + 350, y: 200, largura: 250, altura: 16 },
                    { x: xBase + 680, y: 240, largura: 110, altura: 16 }
                ]
            };
        },

        // Módulo 3: Alternância de pulos (Chão -> Plataforma -> Chão)
        function(xBase) {
            return {
                pocas: [
                    { x: xBase + 150, y: 345, largura: 90, altura: 15 },
                    { x: xBase + 500, y: 345, largura: 120, altura: 15 }
                ],
                plataformas: [
                    { x: xBase + 280, y: 230, largura: 140, altura: 16 },
                    { x: xBase + 650, y: 190, largura: 130, altura: 16 }
                ]
            };
        }
    ],

    atualizar: function(jogador, callbackMorte) {
        // Sorteia um Módulo estruturado completo quando o jogador avança
        if (jogador.x - this.tempoUltimoGerado > this.distanciaModulo || this.tempoUltimoGerado === 0) {
            const xBase = jogador.x === 100 ? 400 : jogador.x + 600;

            // Escolhe um padrão da lista
            const indiceSorteado = Math.floor(Math.random() * this.modulos.length);
            const moduloNovo = this.modulos[indiceSorteado](xBase);

            // Adiciona as poças e plataformas do padrão sorteado
            this.listaPocas.push(...moduloNovo.pocas);
            this.listaPlataformas.push(...moduloNovo.plataformas);

            this.tempoUltimoGerado = jogador.x === 100 ? 100 : jogador.x;
        }

        // --- COLISÃO COM PLATAFORMAS ---
        for (let plat of this.listaPlataformas) {
            if (
                jogador.x + jogador.largura > plat.x &&
                jogador.x < plat.x + plat.largura &&
                jogador.y + jogador.altura >= plat.y &&
                jogador.y + jogador.altura <= plat.y + 15 &&
                jogador.velocidadeY >= 0
            ) {
                jogador.y = plat.y - jogador.altura;
                jogador.velocidadeY = 0;
                jogador.noChao = true;
            }
        }

        // --- COLISÃO COM POÇAS (Morte) ---
        for (let poca of this.listaPocas) {
            if (
                jogador.x + jogador.largura - 15 > poca.x &&
                jogador.x + 15 < poca.x + poca.largura &&
                jogador.y + jogador.altura >= poca.y + 5
            ) {
                callbackMorte();
                break;
            }
        }
    },

    desenhar: function(ctx, cameraX) {
        ctx.imageSmoothingEnabled = false;

        // Desenha Poças D'água (Azul escuro)
        for (let poca of this.listaPocas) {
            const posX = poca.x - cameraX;
            if (posX > -150 && posX < 850) {
                ctx.fillStyle = "#2980b9";
                ctx.fillRect(posX, poca.y, poca.largura, poca.altura);
                ctx.strokeStyle = "#3498db";
                ctx.lineWidth = 2;
                ctx.strokeRect(posX, poca.y, poca.largura, poca.altura);
            }
        }

        // Desenha Plataformas Flutuantes (Roxo/Madeira)
        for (let plat of this.listaPlataformas) {
            const posX = plat.x - cameraX;
            if (posX > -200 && posX < 850) {
                ctx.fillStyle = "#8e44ad";
                ctx.fillRect(posX, plat.y, plat.largura, plat.altura);
                ctx.strokeStyle = "#ffffff";
                ctx.lineWidth = 2;
                ctx.strokeRect(posX, plat.y, plat.largura, plat.altura);
            }
        }
    },

    resetar: function() {
        this.listaPlataformas = [];
        this.listaPocas = [];
        this.tempoUltimoGerado = 0;
    }
};