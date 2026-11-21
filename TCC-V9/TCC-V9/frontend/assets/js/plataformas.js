// Carregamento dos tiles de textura para repetição horizontal
const imgPlatTile = new Image();
imgPlatTile.src = "/assets/img/plataforma-tile.png"; 

const imgPocaTile = new Image();
imgPocaTile.src = "/assets/img/poca-tile.png";       

const plataformasJogo1 = {
    listaPlataformas: [],
    listaPocas: [],
    tempoUltimoGerado: 0,
    distanciaModulo: 1100, // Comprimento de cada bloco de fase
    limiteFinalX: null, // Ponto limite a partir do qual nada mais aparece no final

    // Biblioteca de Padrões (Level Design)
    modulos: [
        // Módulo 1: Poça pequena + Escada subindo
        function(xBase) {
            return {
                pocas: [
                    { x: xBase + 200, y: 325, largura: 100, altura: 30 }
                ],
                plataformas: [
                    { x: xBase + 100, y: 250, largura: 120, altura: 32 },
                    { x: xBase + 350, y: 220, largura: 100, altura: 32 },
                    { x: xBase + 500, y: 170, largura: 100, altura: 32 },
                    { x: xBase + 650, y: 120, largura: 120, altura: 32 }
                ]
            };
        },

        // Módulo 2: Poça grande no chão + Plataforma longa de travessia
        function(xBase) {
            return {
                pocas: [
                    { x: xBase + 300, y: 325, largura: 350, altura: 30 }
                ],
                plataformas: [
                    { x: xBase + 150, y: 240, largura: 110, altura: 32 },
                    { x: xBase + 350, y: 200, largura: 250, altura: 32 },
                    { x: xBase + 680, y: 240, largura: 110, altura: 32 }
                ]
            };
        },

        // Módulo 3: Alternância de pulos (Chão -> Plataforma -> Chão)
        function(xBase) {
            return {
                pocas: [
                    { x: xBase + 150, y: 325, largura: 90, altura: 30 },
                    { x: xBase + 500, y: 325, largura: 120, altura: 30 }
                ],
                plataformas: [
                    { x: xBase + 280, y: 230, largura: 140, altura: 32 },
                    { x: xBase + 650, y: 190, largura: 130, altura: 32 }
                ]
            };
        }
    ],

    atualizar: function(jogador, callbackMorte) {
        const atingiuMeta = typeof interativosJogo1 !== "undefined" && 
                            interativosJogo1.contadorConcluidos >= interativosJogo1.totalObjetivo;

        if (atingiuMeta) {
            // Define o limite uma única vez ao atingir 10/10 e remove apenas o que está à frente dele
            if (this.limiteFinalX === null) {
                this.limiteFinalX = (typeof npcGuri !== "undefined") ? npcGuri.x - 100 : jogador.x + 200;

                this.listaPlataformas = this.listaPlataformas.filter(plat => plat.x < this.limiteFinalX);
                this.listaPocas = this.listaPocas.filter(poca => poca.x < this.limiteFinalX);
            }
        } else {
            // Gera novos módulos enquanto não atingiu 10/10
            if (jogador.x - this.tempoUltimoGerado > this.distanciaModulo || this.tempoUltimoGerado === 0) {
                const xBase = jogador.x === 100 ? 400 : jogador.x + 600;

                const indiceSorteado = Math.floor(Math.random() * this.modulos.length);
                const moduloNovo = this.modulos[indiceSorteado](xBase);

                this.listaPocas.push(...moduloNovo.pocas);
                this.listaPlataformas.push(...moduloNovo.plataformas);

                this.tempoUltimoGerado = jogador.x === 100 ? 100 : jogador.x;
            }
        }

        // --- COLISÃO COM PLATAFORMAS ---
        for (let plat of this.listaPlataformas) {
            if (
                jogador.x + jogador.largura > plat.x &&
                jogador.x < plat.x + plat.largura &&
                jogador.y + jogador.altura >= plat.y &&
                jogador.y + jogador.altura <= plat.y + 25 &&
                jogador.velocidadeY >= 0
            ) {
                jogador.y = plat.y - jogador.altura;
                jogador.velocidadeY = 0;
                jogador.noChao = true;

                // Recarrega o pulo duplo e reseta o mortal ao pousar na plataforma
                if (typeof jogador.maxPulos !== "undefined") {
                    jogador.pulosDisponiveis = jogador.maxPulos;
                }
                jogador.fazendoMortal = false;
                jogador.anguloMortal = 0;
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

        // --- Desenha Poças D'água escalonadas e repetidas ---
        for (let poca of this.listaPocas) {
            const posX = poca.x - cameraX;
            if (posX > -150 && posX < 850) {
                if (imgPocaTile.complete && imgPocaTile.naturalWidth !== 0) {
                    const proporcao = imgPocaTile.naturalWidth / imgPocaTile.naturalHeight;
                    const larguraBloco = poca.altura * proporcao;

                    ctx.save();
                    ctx.beginPath();
                    ctx.rect(posX, poca.y, poca.largura, poca.altura);
                    ctx.clip();

                    for (let x = 0; x < poca.largura; x += larguraBloco) {
                        ctx.drawImage(imgPocaTile, posX + x, poca.y, larguraBloco, poca.altura);
                    }
                    ctx.restore();
                } else {
                    ctx.fillStyle = "#2980b9";
                    ctx.fillRect(posX, poca.y, poca.largura, poca.altura);
                }
            }
        }

        // --- Desenha Plataformas Flutuantes escalonadas e repetidas ---
        for (let plat of this.listaPlataformas) {
            const posX = plat.x - cameraX;
            if (posX > -200 && posX < 850) {
                if (imgPlatTile.complete && imgPlatTile.naturalWidth !== 0) {
                    const proporcao = imgPlatTile.naturalWidth / imgPlatTile.naturalHeight;
                    const larguraBloco = plat.altura * proporcao;

                    ctx.save();
                    ctx.beginPath();
                    ctx.rect(posX, plat.y, plat.largura, plat.altura);
                    ctx.clip();

                    for (let x = 0; x < plat.largura; x += larguraBloco) {
                        ctx.drawImage(imgPlatTile, posX + x, plat.y, larguraBloco, plat.altura);
                    }
                    ctx.restore();
                } else {
                    ctx.fillStyle = "#8e44ad";
                    ctx.fillRect(posX, plat.y, plat.largura, plat.altura);
                }
            }
        }
    },

    resetar: function() {
        this.listaPlataformas = [];
        this.listaPocas = [];
        this.tempoUltimoGerado = 0;
        this.limiteFinalX = null;
    }
};