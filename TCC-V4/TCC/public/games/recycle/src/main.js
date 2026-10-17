// ==========================================
// MOTOR PRINCIPAL, REGRAS DO JOGO E LOOP
// ==========================================

import { 
    canvas, ctx, estadoJogo, setEstadoJogo, faseAtual, setFaseAtual, pontos, setPontos, 
    vidas, setVidas, jogoScale, setNumLinhas, esteiraY, setEsteiraY, 
    posicoesLinhas, setPosicoesLinhas, lixeirasAtivas, setLixeirasAtivas, 
    listaLixos, setListaLixos, lixosColetados, metasColeta, setTotalLixosNecessarios, 
    setTotalLixosColetadosFase, totalLixosColetadosFase, fasesDesbloqueadas, 
    bancoDadosJogo, lixoSelecionado, tutorialEstado, setTutorialEstado
} from './config.js';

import { 
    desenharMenu, desenharSelecaoFases, desenharPartida, 
    desenharMenuPausa, desenharGameOver, desenharVitoria,
    desenharTutorialInterativo, desenharConfig
} from './render.js';

import './controls.js';

export function carregarFase(fase) {
    window.EcoGame?.start();
    setFaseAtual(fase); setPontos(0); setListaLixos([]); setTotalLixosColetadosFase(0);
    setVidas((fase === 5) ? 1 : 3);
    for (let info of bancoDadosJogo) lixosColetados[info.cor.toLowerCase()] = 0;
    
    setNumLinhas(1); 

    setEsteiraY(250); // Define a altura da esteira na tela!
    
    // LÓGICA DE POSIÇÃO DOS LIXOS
    let novasLinhas = [esteiraY + 10]; 
    let novasLixeiras = [], novoTotalNecessario = 0;
    
    let lixeirasDaFaseIndices = (fase === 1) ? [0, 1] : (fase === 2) ? [0, 1, 2] : (fase === 3) ? [0, 1, 2, 3] : [0, 1, 2, 3, 4];
    let metaPorLixeira = fase === 1 ? 4 : (fase === 2 ? 6 : (fase === 3 ? 8 : 10));
    if (fase === 5) metaPorLixeira = 999;

    let espaco = canvas.width / lixeirasDaFaseIndices.length;
    for (let i = 0; i < lixeirasDaFaseIndices.length; i++) {
        let info = bancoDadosJogo[lixeirasDaFaseIndices[i]];
        novasLixeiras.push({
            nome: info.nome, cor: info.cor.toLowerCase(), spriteInfo: info,
            x: (i * espaco) + (espaco / 2) - (12 * jogoScale), y: canvas.height - (24 * jogoScale) - 10, 
            largura: 24 * jogoScale, altura: 24 * jogoScale
        });
        metasColeta[info.cor.toLowerCase()] = metaPorLixeira; 
        novoTotalNecessario += metaPorLixeira;
    }
    setPosicoesLinhas(novasLinhas); setLixeirasAtivas(novasLixeiras);
    setTotalLixosNecessarios(novoTotalNecessario); setEstadoJogo("JOGANDO");
}

window.addEventListener("iniciarTutorial", () => {
    setEstadoJogo("TUTORIAL"); setTutorialEstado(0); setPontos(0); setVidas(3); setListaLixos([]);
    setNumLinhas(1); 
    setEsteiraY(250);
    
    setTotalLixosColetadosFase(0);
    setTotalLixosNecessarios(2); 
    
    let novasLinhas = [esteiraY + 10];
    setPosicoesLinhas(novasLinhas);
    
    let espaco = canvas.width / 2;
    let lixeirasTut = [];
    
    // --- LÓGICA DINÂMICA ---
    for (let i = 0; i < 2; i++) {
        let info = bancoDadosJogo[i];
        let corExata = info.cor.toLowerCase(); 
        
        lixeirasTut.push({
            nome: info.nome, cor: corExata, spriteInfo: info,
            x: (i * espaco) + (espaco / 2) - (12 * jogoScale), y: canvas.height - (24 * jogoScale) - 10, 
            largura: 24 * jogoScale, altura: 24 * jogoScale
        });
        
        lixosColetados[corExata] = 0;
        metasColeta[corExata] = 1;
    }
    setLixeirasAtivas(lixeirasTut);
    
    listaLixos.push({ x: -50, y: novasLinhas[0], sprite: bancoDadosJogo[0], imagemLixo: bancoDadosJogo[0].imagensLixo[0], velocidade: 2 });
});

window.addEventListener("lixoSoltoNaLixeira", (evento) => {
    let { lixo, lixeira } = evento.detail;
    
    // --- LÓGICA DO TUTORIAL ---
    if (estadoJogo === "TUTORIAL") {
        if (lixo.sprite.cor.toLowerCase() === lixeira.cor.toLowerCase()) {
            setTutorialEstado(5); 
            let i = listaLixos.indexOf(lixo); if (i > -1) listaLixos.splice(i, 1);
            setTimeout(() => { carregarFase(1); }, 2500); 
        } else {
            lixo.x = (canvas.width / 2) - 20; 
            lixo.y = posicoesLinhas[0]; 
        }
        return;
    }

    // --- LÓGICA DO JOGO NORMAL ---
    if (lixo.sprite.cor.toLowerCase() === lixeira.cor.toLowerCase()) {
        
        let corLixo = lixo.sprite.cor.toLowerCase();
        let quantidadeAtual = lixosColetados[corLixo] || 0;
        let metaDessaLixeira = metasColeta[corLixo];
        
        // --- 1. LÓGICA DE SALÁRIO BASE vs BÔNUS EXTRA ---
        if (quantidadeAtual < metaDessaLixeira) {
            setPontos(pontos + lixo.sprite.pontos); 
        } 
        else {
            setPontos(pontos + 1); 
        }

        // 2. Atualiza os contadores
        lixosColetados[corLixo] = quantidadeAtual + 1;
        setTotalLixosColetadosFase(totalLixosColetadosFase + 1);
        
        // 3. Verifica se bateu a meta de TODAS as lixeiras
        let venceu = true;
        for (let lix of lixeirasAtivas) {
            let c = lix.cor.toLowerCase();
            if ((lixosColetados[c] || 0) < metasColeta[c]) venceu = false;
        }

        if (venceu && faseAtual < 5) { 
            fasesDesbloqueadas[faseAtual + 1] = true; 
            setEstadoJogo("VITORIA"); 
        }
        
    } else {
        setVidas(vidas - lixo.sprite.dano); 
        if (vidas <= 0) setEstadoJogo("GAMEOVER");
    }
    
    let index = listaLixos.indexOf(lixo); if (index > -1) listaLixos.splice(index, 1);
});

window.addEventListener("trocarFase", (evento) => { carregarFase(evento.detail); });

function criarLixo() {
    if (estadoJogo !== "JOGANDO" || vidas <= 0) return; 
    let lixS = lixeirasAtivas[Math.floor(Math.random() * lixeirasAtivas.length)];
    let vLixo = lixS.spriteInfo.imagensLixo;
    listaLixos.push({
        x: -50, y: posicoesLinhas[Math.floor(Math.random() * posicoesLinhas.length)], 
        sprite: lixS.spriteInfo, imagemLixo: vLixo[Math.floor(Math.random() * vLixo.length)], velocidade: 1.5 + (faseAtual * 0.4) 
    });
}
setInterval(criarLixo, 1800);

function atualizarJogo(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (estadoJogo === "JOGANDO" || estadoJogo === "TUTORIAL") {
        for (let i = 0; i < listaLixos.length; i++) {
            let l = listaLixos[i];
            
            if (estadoJogo === "TUTORIAL") {
                if (tutorialEstado === 0 && l !== lixoSelecionado) l.x += l.velocidade;
                if (tutorialEstado === 0 && l.x >= (canvas.width / 2) - 20) {
                    l.velocidade = 0; setTutorialEstado(1); // Para a esteira no meio
                }
            } else if (l !== lixoSelecionado) {
                l.x += l.velocidade; 
            }

            if (l.x >= canvas.width) {
                setVidas(vidas - l.sprite.dano); // Perdeu estrela de avaliação
                if (vidas <= 0) { setVidas(0); setEstadoJogo("GAMEOVER"); }
                listaLixos.splice(i, 1); i--;
            }
        }
    }

    if (estadoJogo === "MENU") desenharMenu();
    else if (estadoJogo === "SELECAO_FASES") desenharSelecaoFases();
    else if (estadoJogo === "JOGANDO") desenharPartida(timestamp);
    else if (estadoJogo === "TUTORIAL") desenharTutorialInterativo(timestamp);
    else if (estadoJogo === "PAUSA") desenharMenuPausa(timestamp);
    else if (estadoJogo === "GAMEOVER") desenharGameOver(timestamp);
    else if (estadoJogo === "VITORIA") desenharVitoria(timestamp);
    else if (estadoJogo === "CONFIG") desenharConfig();
    
    requestAnimationFrame(atualizarJogo);
}
document.fonts.ready.then(() => {
    atualizarJogo(0);
});