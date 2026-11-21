// Carregamento dos tiles de textura para repetição horizontal
const imgPlatTile = new Image();
imgPlatTile.src = "/assets/img/plataforma-tile.png"; 

const imgPocaTile = new Image();
imgPocaTile.src = "/assets/img/poca-tile.png";       

const plataformasJogo1 = {
    listaPlataformas: [],
    listaPocas: [],
    tempoUltimoGerado: 0,
    distanciaModulo: 1450, // Maior espaçamento entre blocos gerados
    limiteFinalX: null, // Ponto limite a partir do qual nada mais aparece no final
    ultimoModuloIndex: -1, // Evita repetir o mesmo módulo duas vezes seguidas

    // Biblioteca de Padrões (Level Design) mais espaçados
    modulos: [
        // Módulo 1: Poça pequena + Escada subindo espaçada
        function(xBase) {
            return {
                pocas: [
                    { x: xBase + 240, y: 325, largura: 95, altura: 30 }
                ],
                plataformas: [
                    { x: xBase + 110, y: 250, largura: 120, altura: 32 },
                    { x: xBase + 410, y: 220, largura: 105, altura: 32 },
                    { x: xBase + 630, y: 175, largura: 105, altura: 32 },
                    { x: xBase + 860, y: 140, largura: 120, altura: 32 }
                ]
            };
        },

        // Módulo 2: Poça no chão + Plataforma longa de travessia espaçada
        function(xBase) {
            return {
                pocas: [
                    { x: xBase + 380, y: 325, largura: 280, altura: 30 }
                ],
                plataformas: [
                    { x: xBase + 160, y: 245, largura: 115, altura: 32 },
                    { x: xBase + 420, y: 205, largura: 220, altura: 32 },
                    { x: xBase + 810, y: 240, largura: 120, altura: 32 }
                ]
            };
        },

        // Módulo 3: Alternância de pulos bem espaçada (Chão -> Plataforma -> Chão)
        function(xBase) {
            return {
                pocas: [
                    { x: xBase + 180, y: 325, largura: 85, altura: 30 },
                    { x: xBase + 660, y: 325, largura: 105, altura: 30 }
                ],
                plataformas: [
                    { x: xBase + 360, y: 230, largura: 140, altura: 32 },
                    { x: xBase + 840, y: 195, largura: 135, altura: 32 }
                ]
            };
        },

        // Módulo 4: Zigue-zague de alturas com pulo duplo e respiro horizontal
        function(xBase) {
            return {
                pocas: [
                    { x: xBase + 260, y: 325, largura: 115, altura: 30 },
                    { x: xBase + 740, y: 325, largura: 120, altura: 30 }
                ],
                plataformas: [
                    { x: xBase + 120, y: 255, largura: 110, altura: 32 },
                    { x: xBase + 420, y: 170, largura: 120, altura: 32 },
                    { x: xBase + 670, y: 245, largura: 110, altura: 32 },
                    { x: xBase + 910, y: 160, largura: 125, altura: 32 }
                ]
            };
        },

        // Módulo 5: Travessia elevada sobre poças bem separadas
        function(xBase) {
            return {
                pocas: [
                    { x: xBase + 210, y: 325, largura: 110, altura: 30 },
                    { x: xBase + 640, y: 325, largura: 140, altura: 30 }
                ],
                plataformas: [
                    { x: xBase + 260, y: 215, largura: 125, altura: 32 },
                    { x: xBase + 580, y: 165, largura: 210, altura: 32 }
                ]
            };
        },

        // Módulo 6: Ritmo fluido com poças curtas e espaços amplos
        function(xBase) {
            return {
                pocas: [
                    { x: xBase + 160, y: 325, largura: 80, altura: 30 },
                    { x: xBase + 520, y: 325, largura: 90, altura: 30 },
                    { x: xBase + 880, y: 325, largura: 95, altura: 30 }
                ],
                plataformas: [
                    { x: xBase + 330, y: 250, largura: 115, altura: 32 },
                    { x: xBase + 690, y: 230, largura: 120, altura: 32 }
                ]
            };
        },

        // Módulo 7: Degraus altos + patamar lateral espaçado
        function(xBase) {
            return {
                pocas: [
                    { x: xBase + 340, y: 325, largura: 170, altura: 30 }
                ],
                plataformas: [
                    { x: xBase + 140, y: 260, largura: 115, altura: 32 },
                    { x: xBase + 380, y: 185, largura: 130, altura: 32 },
                    { x: xBase + 620, y: 185, largura: 130, altura: 32 },
                    { x: xBase + 870, y: 245, largura: 125, altura: 32 }
                ]
            };
        }
    ],

    sortearModuloIndex: function() {
        if (this.modulos.length <= 1) return 0;

        let novoIndice = Math.floor(Math.random() * this.modulos.length);
        while (novoIndice === this.ultimoModuloIndex) {
            novoIndice = Math.floor(Math.random() * this.modulos.length);
        }
        this.ultimoModuloIndex = novoIndice;
        return novoIndice;
    },

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
                const xBase = jogador.x === 100 ? 400 : jogador.x + 650;

                const indiceSorteado = this.sortearModuloIndex();
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
        this.ultimoModuloIndex = -1;
    }
};