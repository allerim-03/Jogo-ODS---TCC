import { 
    canvas, estadoJogo, setEstadoJogo, 
    botaoStart, botaoTutorial, botaoConfig, botaoVoltar, botoesFases, 
    botaoPausaHUD, botaoRetomar, botaoVoltarFases, botaoVoltarMenu,
    btnMusicaMenos, btnMusicaMais, btnEfeitosMenos, btnEfeitosMais,
    volumeMusica, volumeEfeitos, setVolumeMusica, setVolumeEfeitos,
    fasesDesbloqueadas, listaLixos, jogoScale, posicoesLinhas, tutorialEstado, setTutorialEstado,
    lixeirasAtivas, setLixoSelecionado, setArrastando, lixoSelecionado, arrastando, setBotaoHover,
    setMousePressionado
} from './config.js';

function pegarPosicao(e) {
    const r = canvas.getBoundingClientRect();
    let cx = e.clientX, cy = e.clientY;
    if (e.touches?.length > 0) { cx = e.touches[0].clientX; cy = e.touches[0].clientY; }
    else if (e.changedTouches?.length > 0) { cx = e.changedTouches[0].clientX; cy = e.changedTouches[0].clientY; }
    return { x: (cx - r.left) * (canvas.width / r.width), y: (cy - r.top) * (canvas.height / r.height) };
}

const clicou = (pos, b) => pos.x >= b.x && pos.x <= b.x + b.largura && pos.y >= b.y && pos.y <= b.y + b.altura;

function aoIniciarToque(e) {
    setMousePressionado(true);
    if (e.cancelable) e.preventDefault();
    const pos = pegarPosicao(e);

    if (estadoJogo === "MENU") {
        if (clicou(pos, botaoStart)) setEstadoJogo("SELECAO_FASES");
        else if (clicou(pos, botaoTutorial)) window.dispatchEvent(new CustomEvent("iniciarTutorial")); 
        else if (clicou(pos, botaoConfig)) setEstadoJogo("CONFIG");
        return;
    }

    if (estadoJogo === "SELECAO_FASES") {
        if (clicou(pos, botaoVoltar)) { setEstadoJogo("MENU"); return; }
        for (let b of botoesFases) {
            if (clicou(pos, b) && fasesDesbloqueadas[b.fase]) {
                window.dispatchEvent(new CustomEvent("trocarFase", { detail: b.fase })); break;
            }
        } return;
    }

    if (estadoJogo === "CONFIG") {
        if (clicou(pos, btnMusicaMenos)) setVolumeMusica(volumeMusica - 10);
        else if (clicou(pos, btnMusicaMais)) setVolumeMusica(volumeMusica + 10);
        else if (clicou(pos, btnEfeitosMenos)) setVolumeEfeitos(volumeEfeitos - 10);
        else if (clicou(pos, btnEfeitosMais)) setVolumeEfeitos(volumeEfeitos + 10);
        else if (clicou(pos, botaoVoltar)) setEstadoJogo("MENU");
        return;
    }

    // NOVA REGRA: Avança o texto do tutorial ao clicar na tela (Passos 1 a 3)
    if (estadoJogo === "TUTORIAL" && tutorialEstado >= 1 && tutorialEstado <= 3) {
        setTutorialEstado(tutorialEstado + 1);
        return;
    }

    // REGRA DE ARRASTAR: Agora liberada APENAS no passo 4!
    if (estadoJogo === "JOGANDO" || (estadoJogo === "TUTORIAL" && tutorialEstado === 4)) {
        if (estadoJogo === "JOGANDO" && clicou(pos, botaoPausaHUD)) { setEstadoJogo("PAUSA"); return; }
        
        for (let i = listaLixos.length - 1; i >= 0; i--) {
            let l = listaLixos[i];
            if (pos.x >= l.x - 15 && pos.x <= l.x + (16 * jogoScale) + 15 && pos.y >= l.y - 15 && pos.y <= l.y + (16 * jogoScale) + 15) {
                setLixoSelecionado(l); setArrastando(true); break;
            }
        }
    }
    
    if (estadoJogo === "PAUSA") {
        if (clicou(pos, botaoRetomar)) setEstadoJogo("JOGANDO");
        else if (clicou(pos, botaoVoltarFases)) setEstadoJogo("SELECAO_FASES");
        else if (clicou(pos, botaoVoltarMenu)) setEstadoJogo("MENU");
        return;
    }
    if (estadoJogo === "GAMEOVER" || estadoJogo === "VITORIA") setEstadoJogo("SELECAO_FASES");
}

function aoMover(e) {
    const pos = pegarPosicao(e);
    let hov = true;
    const c = (b) => { if (clicou(pos, b)) { setBotaoHover(b.id); hov = false; } };

    if (estadoJogo === "MENU") [botaoStart, botaoTutorial, botaoConfig].forEach(c);
    else if (estadoJogo === "SELECAO_FASES") { botoesFases.forEach(c); c(botaoVoltar); }
    else if (estadoJogo === "PAUSA") [botaoRetomar, botaoVoltarFases, botaoVoltarMenu].forEach(c);
    else if (estadoJogo === "CONFIG") [btnMusicaMenos, btnMusicaMais, btnEfeitosMenos, btnEfeitosMais, botaoVoltar].forEach(c);
    if (hov) setBotaoHover(null); 

    if ((estadoJogo === "JOGANDO" || estadoJogo === "TUTORIAL") && arrastando && lixoSelecionado) {
        if (e.cancelable) e.preventDefault();
        lixoSelecionado.x = pos.x - (8 * jogoScale); lixoSelecionado.y = pos.y - (8 * jogoScale);
    }
}

function aoSoltar() {
    setMousePressionado(false); 
    if ((estadoJogo !== "JOGANDO" && estadoJogo !== "TUTORIAL") || !lixoSelecionado) return;
    
    let lAlvo = null, l = lixoSelecionado; 
    for (let lix of lixeirasAtivas) {
        if (l.x + (8 * jogoScale) > lix.x && l.x + (8 * jogoScale) < lix.x + lix.largura && l.y + (8 * jogoScale) > lix.y && l.y + (8 * jogoScale) < lix.y + lix.altura) {
            lAlvo = lix; break;
        }
    }
    setLixoSelecionado(null); setArrastando(false);

    if (lAlvo) window.dispatchEvent(new CustomEvent("lixoSoltoNaLixeira", { detail: { lixo: l, lixeira: lAlvo } }));
    else {
        let lM = posicoesLinhas[0], mD = Infinity;
        for (let Y of posicoesLinhas) { let d = Math.abs(l.y - Y); if (d < mD) { mD = d; lM = Y; } }
        l.y = lM;
    }
}

canvas.addEventListener("mousedown", aoIniciarToque); window.addEventListener("mousemove", aoMover, { passive: false });
window.addEventListener("mouseup", aoSoltar); window.addEventListener("mouseleave", aoSoltar); 
canvas.addEventListener("touchstart", aoIniciarToque, { passive: false }); canvas.addEventListener("touchmove", aoMover, { passive: false });
window.addEventListener("touchend", aoSoltar); window.addEventListener("touchcancel", aoSoltar);