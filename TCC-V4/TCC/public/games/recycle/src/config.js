// ==========================================
// CONFIGURAÇÕES, BANCO DE DADOS E ESTADOS
// ==========================================

export const canvas = document.getElementById("telaJogo");
export const ctx = canvas.getContext("2d");

// Botões Centrais e Menus
export const botaoStart = { 
    id: "START", x: 280, y: 250, largura: 260, altura: 50,
    imgNormal: carregarImagem("assets/Botoes/botao-verde-normal.png"),
    imgHover: carregarImagem("assets/Botoes/botao-verde-hover.png"),

    ajusteTextoX: 3,   // Move o texto 5 pixels para a DIREITA
    ajusteTextoY: 0
}; 
export const botaoTutorial = { 
    id: "TUTORIAL", x: 180, y: 320, largura: 220, altura: 40,
    imgNormal: carregarImagem("assets/Botoes/botao-cinza-normal.png"),
    imgHover: carregarImagem("assets/Botoes/botao-cinza-hover.png")
}; 
export const botaoConfig = { 
    id: "CONFIG", x: 405, y: 320, largura: 220, altura: 40,
    imgNormal: carregarImagem("assets/Botoes/botao-cinza-normal.png"),
    imgHover: carregarImagem("assets/Botoes/botao-cinza-hover.png")
};

export const botaoRetomar = { 
    id: "RETOMAR", x: 280, y: 170, largura: 240, altura: 50,
    imgNormal: carregarImagem("assets/Botoes/botao-verde-normal.png"),
    imgHover: carregarImagem("assets/Botoes/botao-verde-hover.png")
};
export const botaoVoltarFases = { 
    id: "VOLTAR_FASES", x: 280, y: 240, largura: 240, altura: 50,
    imgNormal: carregarImagem("assets/Botoes/botao-laranja-normal.png"),
    imgHover: carregarImagem("assets/Botoes/botao-laranja-hover.png")
};
export const botaoVoltarMenu = { 
    id: "VOLTAR_MENU", x: 280, y: 310, largura: 240, altura: 50,
    imgNormal: carregarImagem("assets/Botoes/botao-vermelho-normal.png"),
    imgHover: carregarImagem("assets/Botoes/botao-vermelho-hover.png")
};
export const botaoVoltar = { 
    id: "VOLTAR_GERAL", x: 280, y: 320, largura: 240, altura: 45,
    imgNormal: carregarImagem("assets/Botoes/botao-cinza-normal.png"),
    imgHover: carregarImagem("assets/Botoes/botao-cinza-hover.png")
};

export const botaoPausaHUD = { 
    id: "PAUSA", 
    x: canvas.width - 50, // Posição X mais encostada à direita (ajustaremos no render também)
    y: 10,                // Posição Y no topo
    largura: 32,          // Tamanho na tela (16 * 2 para ficar bom no HUD)
    altura: 32, 
    imgNormal: carregarImagem("assets/Botoes/botao-pause-normal.png"),
    imgHover: carregarImagem("assets/Botoes/botao-pause-hover.png")
};

// Controles de Som
export const btnMusicaMenos = { 
    id: "MUS_MENOS", 
    x: (canvas.width / 2) - 100, // Centralizado à esquerda da barra
    y: 162, 
    largura: 32, altura: 32,
    imgNormal: carregarImagem("assets/Botoes/botao-volume-menos-normal.png"),
    imgHover: carregarImagem("assets/Botoes/botao-volume-menos-hover.png")
};
export const btnMusicaMais = { 
    id: "MUS_MAIS", 
    x: (canvas.width / 2) + 70,  // Centralizado à direita da barra
    y: 162, 
    largura: 32, altura: 32,
    imgNormal: carregarImagem("assets/Botoes/botao-volume-mais-normal.png"),
    imgHover: carregarImagem("assets/Botoes/botao-volume-mais-hover.png")
};
export const btnEfeitosMenos = { 
    id: "EFX_MENOS", 
    x: (canvas.width / 2) - 100, 
    y: 232, 
    largura: 32, altura: 32,
    imgNormal: carregarImagem("assets/Botoes/botao-volume-menos-normal.png"),
    imgHover: carregarImagem("assets/Botoes/botao-volume-menos-hover.png")
};
export const btnEfeitosMais = { 
    id: "EFX_MAIS", 
    x: (canvas.width / 2) + 70, 
    y: 232, 
    largura: 32, altura: 32,
    imgNormal: carregarImagem("assets/Botoes/botao-volume-mais-normal.png"),
    imgHover: carregarImagem("assets/Botoes/botao-volume-mais-hover.png")
};

export const botoesFases = [
    { 
      id: "FASE_1", fase: 1, x: 120, y: 180, largura: 80, altura: 80, cor: "#EF4444",
      imgNormal: carregarImagem("assets/Fases/fase-s1-normal.png"),
      imgHover: carregarImagem("assets/Fases/fase-s1-hover.png"),
      imgBloqueado: carregarImagem("assets/Fases/fase-s1-bloqueado.png")
    }, 
    { 
      id: "FASE_2", fase: 2, x: 240, y: 180, largura: 80, altura: 80, cor: "#3B82F6",
      imgNormal: carregarImagem("assets/Fases/fase-s2-normal.png"),
      imgHover: carregarImagem("assets/Fases/fase-s2-hover.png"),
      imgBloqueado: carregarImagem("assets/Fases/fase-s2-bloqueado.png")
    }, 
    { 
      id: "FASE_3", fase: 3, x: 360, y: 180, largura: 80, altura: 80, cor: "#F59E0B",
      imgNormal: carregarImagem("assets/Fases/fase-s3-normal.png"),
      imgHover: carregarImagem("assets/Fases/fase-s3-hover.png"),
      imgBloqueado: carregarImagem("assets/Fases/fase-s3-bloqueado.png")
    }, 
    { 
      id: "FASE_4", fase: 4, x: 480, y: 180, largura: 80, altura: 80, cor: "#10B981",
      imgNormal: carregarImagem("assets/Fases/fase-s4-normal.png"),
      imgHover: carregarImagem("assets/Fases/fase-s4-hover.png"),
      imgBloqueado: carregarImagem("assets/Fases/fase-s4-bloqueado.png")
    }, 
    { 
      id: "FASE_5", fase: 5, x: 600, y: 180, largura: 80, altura: 80, cor: "#A855F7",
      imgNormal: carregarImagem("assets/Fases/fase-infinita-normal.png"),
      imgHover: carregarImagem("assets/Fases/fase-infinita-hover.png"),
      imgBloqueado: carregarImagem("assets/Fases/fase-infinita-bloqueado.png")
    }
];

export let jogoScale = 4; 
export let NUM_LINHAS = 2;
export let esteiraY = 90;
export let posicoesLinhas = []; 

export let estadoJogo = "MENU"; 
export let faseAtual = 1;
export let pontos = 0; // Salário
export let vidas = 3; // Estrelas de Avaliação
export let fasesDesbloqueadas = Object.fromEntries([1,2,3,4,5].map(phase => [phase, phase <= (window.EcoGame?.maxPhase || 1)]));
export let tutorialEstado = 0; // 0 = rodando, 1 = parado p/ arrastar, 2 = sucesso

export let botaoHover = null; 
export let lixeirasAtivas = [];
export let listaLixos = [];
export let lixosColetados = {};
export let metasColeta = {};
export let totalLixosNecessarios = 0; 
export let totalLixosColetadosFase = 0;
export let lixoSelecionado = null;
export let arrastando = false;

export let volumeMusica = 50;
export let volumeEfeitos = 50;

function carregarImagem(caminho) {
    const img = new Image();
    img.isReady = false; 
    img.onload = () => { img.isReady = true; }; 
    img.onerror = () => { img.isReady = false; console.warn("Erro: " + caminho); };
    img.src = caminho; return img;
}

const imgPlastico = carregarImagem("assets/Lixeiras/lixeira_plastico.png");
const imgPapel = carregarImagem("assets/Lixeiras/lixeira_papel.png");
const imgVidro = carregarImagem("assets/Lixeiras/lixeira_vidro.png");
const imgMetal = carregarImagem("assets/Lixeiras/lixeira_metal.png");
const imgOrganico = carregarImagem("assets/Lixeiras/lixeira_organico.png");

export const imgLixoMetal = carregarImagem("assets/Lixos/lixo_metal.png");
export const imgLixoOrganico = carregarImagem("assets/Lixos/lixo_organico.png");
export const imgLixoPapel = carregarImagem("assets/Lixos/lixo_papel.png");
export const imgLixoPlastico1 = carregarImagem("assets/Lixos/lixo_plástico1.png");
export const imgLixoVidro1 = carregarImagem("assets/Lixos/lixo_vidro1.png");
export const imgLixoVidro2 = carregarImagem("assets/Lixos/lixo_vidro2.png");

export const imgCenario = carregarImagem("assets/Cenario/cenario-principal.png");
export const imgEsteira = carregarImagem("assets/Esteira/esteira.png");

export const imgModalGrande = carregarImagem("assets/Modals/modal-grande.png");
export const imgModalPequeno = carregarImagem("assets/Modals/modal-pequeno.png");
export const imgSetaEsq = carregarImagem("assets/HUD/seta-esquerda-tutorial.png");
export const imgSetaDir = carregarImagem("assets/HUD/seta-direita-tutorial.png");
export const imgSetaCima = carregarImagem("assets/HUD/seta-cima-tutorial.png");
export const imgSetaBaixo = carregarImagem("assets/HUD/seta-baixo-tutorial.png");

export const imgEstrela = carregarImagem("assets/HUD/estrela.png"); // Ajuste o nome da pasta se necessário!
export const imgMoeda = carregarImagem("assets/HUD/moeda.png");

export const bancoDadosJogo = [
    { nome: "Plástico", cor: "#EF4444", pontos: 50, dano: 1, imagem: imgPlastico, imagensLixo: [imgLixoPlastico1] },
    { nome: "Papel", cor: "#3B82F6", pontos: 20, dano: 1, imagem: imgPapel, imagensLixo: [imgLixoPapel] },
    { nome: "Vidro", cor: "#10B981", pontos: 50, dano: 1, imagem: imgVidro, imagensLixo: [imgLixoVidro1, imgLixoVidro2] },
    { nome: "Metal", cor: "#F59E0B", pontos: 30, dano: 1, imagem: imgMetal, imagensLixo: [imgLixoMetal] },
    { nome: "Orgânico", cor: "#78350F", pontos: 10, dano: 1, imagem: imgOrganico, imagensLixo: [imgLixoOrganico] }
];

export function setEstadoJogo(v) {
    if (v !== estadoJogo && (v === 'VITORIA' || v === 'GAMEOVER')) window.EcoGame?.finish(pontos, faseAtual, v === 'VITORIA');
    estadoJogo = v;
}
export function setFaseAtual(v) { faseAtual = v; }
export function setPontos(v) { pontos = v; }
export function setVidas(v) { vidas = v; }
export function setNumLinhas(v) { NUM_LINHAS = v; }
export function setEsteiraY(v) { esteiraY = v; }
export function setPosicoesLinhas(v) { posicoesLinhas = v; }
export function setLixeirasAtivas(v) { lixeirasAtivas = v; }
export function setListaLixos(v) { listaLixos = v; }
export function setTotalLixosNecessarios(v) { totalLixosNecessarios = v; }
export function setTotalLixosColetadosFase(v) { totalLixosColetadosFase = v; }
export function setLixoSelecionado(v) { lixoSelecionado = v; }
export function setArrastando(v) { arrastando = v; }
export function setBotaoHover(v) { botaoHover = v; }
export function setTutorialEstado(v) { tutorialEstado = v; }
export function setVolumeMusica(v) { volumeMusica = Math.max(0, Math.min(100, v)); }
export function setVolumeEfeitos(v) { volumeEfeitos = Math.max(0, Math.min(100, v)); }
export let mousePressionado = false;
export function setMousePressionado(v) { mousePressionado = v; }