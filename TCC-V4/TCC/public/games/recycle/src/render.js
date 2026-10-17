// ==========================================
// RENDERIZADORES DE TELAS E INTERFACE
// ==========================================

import { 
    canvas, ctx, estadoJogo, faseAtual, pontos, vidas, fasesDesbloqueadas,
    lixeirasAtivas, listaLixos, lixosColetados, metasColeta, totalLixosNecessarios,
    jogoScale, NUM_LINHAS, esteiraY, botoesFases, botaoPausaHUD, 
    botaoRetomar, botaoVoltarFases, botaoVoltarMenu, botaoHover, lixoSelecionado,
    botaoStart, botaoTutorial, botaoConfig, botaoVoltar, btnMusicaMenos, btnMusicaMais, 
    btnEfeitosMenos, btnEfeitosMais, volumeMusica, volumeEfeitos, tutorialEstado,
    imgCenario, imgEsteira, mousePressionado, imgModalGrande, imgModalPequeno, imgEstrela, imgMoeda, 
    imgSetaEsq, imgSetaDir, imgSetaCima, imgSetaBaixo, imgLixoMetal, imgLixoOrganico, imgLixoPapel, imgLixoPlastico1, imgLixoVidro1, imgLixoVidro2
} from './config.js';


function desenharFundoBase() {
    // Verifica se a arte carregou perfeitamente
    if (imgCenario && imgCenario.isReady) {
        // Estampa a imagem começando do ponto X:0, Y:0 até preencher a largura e altura total
        ctx.drawImage(imgCenario, 0, 0, canvas.width, canvas.height);
    } else {
        // Tela cinza de proteção que pisca apenas se a imagem demorar a carregar
        ctx.fillStyle = "#334155"; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

function desenharEsteiraHorizontal(timestamp) {
    if (imgEsteira && imgEsteira.isReady) {
        let larguraReal = imgEsteira.width;  
        let alturaReal = imgEsteira.height;

        let velocidade = 20; 
        let off = (timestamp / velocidade) % larguraReal;

        if (estadoJogo === "TUTORIAL" && tutorialEstado > 0) off = 0;

        // Repete o carimbo baseado na largura real da arte
        for (let x = -larguraReal; x < canvas.width; x += larguraReal) {
            ctx.drawImage(imgEsteira, x + off, esteiraY, larguraReal, alturaReal); 
        }
    } else {
        ctx.fillStyle = "#111827"; 
        ctx.fillRect(0, esteiraY, canvas.width, 250);
    }
}

export function desenharBotaoPixelArt(texto, b, corBase, corTexto = "#FFFFFF") {
    let hover = (botaoHover === b.id);
    let yDeslocamento = 0; // Controla se o botão vai afundar ao clicar

    // SE A ARTE EXISTIR: Desenha a imagem vazia do botão
    if (b.imgNormal && b.imgNormal.isReady) {
        if (hover && mousePressionado && b.imgHover && b.imgHover.isReady) {
            yDeslocamento = 4; // Botão pressionado afunda 4 pixels
            ctx.drawImage(b.imgHover, b.x, b.y + yDeslocamento, b.largura, b.altura);
        } else if (hover && b.imgHover && b.imgHover.isReady) {
            ctx.drawImage(b.imgHover, b.x, b.y, b.largura, b.altura); // Mouse por cima
        } else {
            ctx.drawImage(b.imgNormal, b.x, b.y, b.largura, b.altura); // Normal
        }
    } 
    // FALLBACK DE SEGURANÇA: Se não achar a imagem, desenha o quadrado antigo colorido
    else {
        ctx.fillStyle = hover ? "#FFFFFF" : corBase; ctx.fillRect(b.x, b.y, b.largura, b.altura);
        if (hover) { ctx.fillStyle = "rgba(255, 255, 255, 0.2)"; ctx.fillRect(b.x, b.y, b.largura, b.altura); }

        const esp = 4;
        ctx.fillStyle = "#151518"; ctx.fillRect(b.x, b.y, b.largura, esp); ctx.fillRect(b.x, b.y + b.altura - esp, b.largura, esp); 
        ctx.fillRect(b.x, b.y, esp, b.altura); ctx.fillRect(b.x + b.largura - esp, b.y, esp, b.altura); 

        ctx.fillStyle = "#FFFFFF"; ctx.fillRect(b.x + esp, b.y + esp, b.largura - (esp * 2), esp); ctx.fillRect(b.x + esp, b.y + esp, esp, b.altura - (esp * 2));
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)"; ctx.fillRect(b.x + esp, b.y + b.altura - (esp * 2), b.largura - (esp * 2), esp); ctx.fillRect(b.x + b.largura - (esp * 2), b.y + esp, esp, b.altura - (esp * 2));
        
        if (hover && mousePressionado) yDeslocamento = 2; // Efeito de apertar no modo fallback
    }

    // DESENHO DO TEXTO
    ctx.fillStyle = corTexto;
    ctx.font = b.largura > 100 ? "24px 'RiskOfRain'" : "18px 'RiskOfRain'"; 
    ctx.textAlign = "center"; 
    ctx.textBaseline = "middle";

    // Pega o ajuste individual do botão 
    let ajusteX = b.ajusteTextoX || 0;
    let ajusteY = b.ajusteTextoY || 0;

    ctx.fillText(texto, b.x + (b.largura / 2) + ajusteX, b.y + (b.altura / 2) + 2 + yDeslocamento + ajusteY);
}

export function desenharPartida(timestamp) {
    desenharFundoBase(); desenharEsteiraHorizontal(timestamp);

    for (let l of lixeirasAtivas) {
        if (l.spriteInfo.imagem && l.spriteInfo.imagem.isReady) ctx.drawImage(l.spriteInfo.imagem, l.x, l.y, l.largura, l.altura);
        else { ctx.fillStyle = l.spriteInfo.cor; ctx.fillRect(l.x, l.y, l.largura, l.altura); }
        ctx.fillStyle = "#E2E8F0"; ctx.font = "bold 14px 'RiskOfRain'"; ctx.textAlign = "center";
        ctx.fillText(l.nome, l.x + (l.largura / 2), l.y + l.altura + 20);
    }

    for (let l of listaLixos) {
        let tamFinal = (16 * jogoScale) + (l === lixoSelecionado ? 8 : 0);
        let dx = l.x - (l === lixoSelecionado ? 4 : 0), dy = l.y - (l === lixoSelecionado ? 4 : 0);
        if (l.imagemLixo && l.imagemLixo.isReady) ctx.drawImage(l.imagemLixo, dx, dy, tamFinal, tamFinal);
        else { ctx.fillStyle = l.sprite.cor; ctx.fillRect(dx, dy, tamFinal, tamFinal); }
    }

    // HUD Superior Corporativa
    ctx.fillStyle = "rgba(15, 23, 42, 0.95)"; ctx.fillRect(0, 0, canvas.width, 60);

    // 1. Desenhando as Estrelas (Avaliação)
    let sX = 20;
    for (let v = 0; v < 3; v++) { 
        let hX = sX + (v * 40); 
        let cheia = v < vidas; 
        
        if (imgEstrela && imgEstrela.isReady) {
            if (!cheia) ctx.globalAlpha = 0.3; // Truque: Se perdeu a vida, a estrela fica transparente
            ctx.drawImage(imgEstrela, hX, 16, 36, 33);
            ctx.globalAlpha = 1.0; // Restaura a cor normal
        } else {
            // Fallback (se a imagem não carregar)
            ctx.fillStyle = cheia ? '#FBBF24' : '#475569'; ctx.fillRect(hX, 15, 30, 30);
        }
    }

    // 2. Desenhando a Moeda e a Pontuação
    if (imgMoeda && imgMoeda.isReady) {
        ctx.drawImage(imgMoeda, canvas.width - 145, 16, 36, 30); // Desenha a moeda antes do número
    }
    
    ctx.fillStyle = "#eac226"; 
    ctx.font = "30px 'RiskOfRain'"; 
    ctx.textAlign = "right";
    ctx.fillText(String(pontos).padStart(4, '0'), canvas.width - 20, 34);

    // 3. Botão de Pausar
    if (estadoJogo === "JOGANDO") {
        botaoPausaHUD.x = (canvas.width / 2) - 16; 
        botaoPausaHUD.y = 15;                
        botaoPausaHUD.largura = 32;          
        botaoPausaHUD.altura = 32;
        
        desenharBotaoPixelArt("", botaoPausaHUD, "#334155"); 
    }

    // Progresso do Turno - Metas flutuantes centralizadas (Sem Modal)
    if (faseAtual < 5) {
        ctx.fillStyle = "#475569"; ctx.fillRect(0, 60, canvas.width, 8);
        let val = 0;
        for (let l of lixeirasAtivas) val += Math.min(lixosColetados[l.cor] || 0, metasColeta[l.cor]);
        ctx.fillStyle = "#388E3C"; ctx.fillRect(0, 60, canvas.width * Math.min(1, Math.max(0, val / totalLixosNecessarios)), 8);

        // Lógica para centralizar os itens abaixo do botão de pause
        let esp = 80; // Espaçamento horizontal entre os ícones
        let px = (canvas.width / 2) - ((lixeirasAtivas.length * esp) / 2) + (esp / 2);
        let py = 78; // Posição Y 
        
        for (let k = 0; k < lixeirasAtivas.length; k++) {
            let lix = lixeirasAtivas[k];
            let atual = lixosColetados[lix.cor] || 0;
            let meta = metasColeta[lix.cor];
            
            let itemX = px + (k * esp) - 24; 
            
            let imgMiniatura = null;
            let corLixeira = lix.cor.toUpperCase();
            
            if (corLixeira === "VERMELHO" || corLixeira === "#EF4444") imgMiniatura = imgLixoPlastico1; 
            else if (corLixeira === "AZUL" || corLixeira === "#3B82F6") imgMiniatura = imgLixoPapel;
            else if (corLixeira === "VERDE" || corLixeira === "#10B981") imgMiniatura = imgLixoVidro1;
            else if (corLixeira === "VERDE" || corLixeira === "#10B981") imgMiniatura = imgLixoVidro2;
            else if (corLixeira === "AMARELO" || corLixeira === "#F59E0B") imgMiniatura = imgLixoMetal;
            else if (corLixeira === "MARROM" || corLixeira === "#78350F") imgMiniatura = imgLixoOrganico;

            // Desenha a imagem do lixo (24x24)
            if (imgMiniatura && imgMiniatura.isReady) {
                ctx.drawImage(imgMiniatura, itemX, py, 24, 24);
            } else {
                ctx.fillStyle = lix.cor; ctx.fillRect(itemX, py + 2, 20, 20);
                ctx.strokeStyle = "#000"; ctx.strokeRect(itemX, py + 2, 20, 20);
            }

            ctx.fillStyle = "#000000"; ctx.font = "18px 'RiskOfRain'"; ctx.textAlign = "left"; 
            ctx.fillText(`${atual}/${meta}`, itemX + 28 + 2, py + 18 + 2);
            
            // Texto principal colorido por cima
            ctx.fillStyle = (atual >= meta) ? "#10B981" : "#FFFFFF"; 
            ctx.fillText(`${atual}/${meta}`, itemX + 28, py + 18);
        }
    } else {
        // Painel da Hora Extra (Flutuante com Sombra)
        ctx.font = "20px 'RiskOfRain'"; ctx.textAlign = "center";
        
        ctx.fillStyle = "#000000"; 
        ctx.fillText(" HORA EXTRA  ", (canvas.width / 2) + 2, 85 + 2); 
        
        ctx.fillStyle = "#A855F7"; 
        ctx.fillText(" HORA EXTRA  ", canvas.width / 2, 85);
    }
}

export function desenharTutorialInterativo(timestamp) {
    desenharPartida(timestamp); 
    
    // Véu escuro nos passos 1, 2 e 3 (O Passo 4 é o "Mão na Massa" e não tem véu)
    if (tutorialEstado >= 1 && tutorialEstado <= 3) {
        ctx.fillStyle = "rgba(15, 23, 42, 0.7)"; 
        ctx.fillRect(0, 0, canvas.width, canvas.height); 
    }

    let mx = canvas.width / 2;
    
    // Animações de "quicar"
    let oscY = Math.sin(timestamp / 150) * 8; 
    let oscX = Math.cos(timestamp / 150) * 8; 

    if (tutorialEstado === 1) {
        // --- PASSO 1: ESTRELAS ---
        ctx.font = "32px 'RiskOfRain'"; ctx.textAlign = "center";
        ctx.fillStyle = "#000000"; ctx.fillText("AVALIAÇÃO", mx + 2, 160 + 2);
        ctx.fillStyle = "#FBBF24"; ctx.fillText("AVALIAÇÃO", mx, 160);
        
        ctx.font = "18px 'RiskOfRain'";
        ctx.fillStyle = "#000000"; 
        ctx.fillText("Essas são suas estrelas de excelência. Você perde uma estrela", mx + 2, 200 + 2);
        ctx.fillText("se o lixo passar direto pela esteira ou errar a lixeira!", mx + 2, 225 + 2);
        ctx.fillStyle = "#FFFFFF"; 
        ctx.fillText("Essas são suas estrelas de excelência. Você perde uma estrela", mx, 200);
        ctx.fillText("se o lixo passar direto pela esteira ou errar a lixeira!", mx, 225);
        
        ctx.font = "14px 'RiskOfRain'"; 
        ctx.fillStyle = "#000000"; ctx.fillText("Clique em qualquer lugar para avançar", mx + 2, 270 + 2);
        ctx.fillStyle = "#64748B"; ctx.fillText("Clique em qualquer lugar para avançar", mx, 270);
        
        if (imgSetaEsq && imgSetaEsq.isReady) ctx.drawImage(imgSetaEsq, 150 + oscX, 16, 32, 32); 
    } 
    else if (tutorialEstado === 2) {
        // --- PASSO 2: MOEDAS ---
        ctx.font = "32px 'RiskOfRain'"; ctx.textAlign = "center";
        ctx.fillStyle = "#000000"; ctx.fillText("MOEDAS E PONTUAÇÃO", mx + 2, 160 + 2);
        ctx.fillStyle = "#FBBF24"; ctx.fillText("MOEDAS E PONTUAÇÃO", mx, 160);
        
        ctx.font = "18px 'RiskOfRain'";
        ctx.fillStyle = "#000000";
        ctx.fillText("A cada material reciclado corretamente,", mx + 2, 200 + 2);
        ctx.fillText("você ganha mais moedas!", mx + 2, 225 + 2);
        ctx.fillStyle = "#FFFFFF"; 
        ctx.fillText("A cada material reciclado corretamente,", mx, 200);
        ctx.fillText("você ganha mais moedas!", mx, 225);
        
        ctx.font = "14px 'RiskOfRain'"; 
        ctx.fillStyle = "#000000"; ctx.fillText("Clique em qualquer lugar para avançar", mx + 2, 270 + 2);
        ctx.fillStyle = "#64748B"; ctx.fillText("Clique em qualquer lugar para avançar", mx, 270);

        if (imgSetaDir && imgSetaDir.isReady) ctx.drawImage(imgSetaDir, canvas.width - 200 - oscX, 16, 32, 32); 
    }
    else if (tutorialEstado === 3) {
        // --- PASSO 3: METAS ---
        ctx.font = "32px 'RiskOfRain'"; ctx.textAlign = "center";
        ctx.fillStyle = "#000000"; ctx.fillText("METAS DO TURNO", mx + 2, 160 + 2);
        ctx.fillStyle = "#3B82F6"; ctx.fillText("METAS DO TURNO", mx, 160);
        
        ctx.font = "18px 'RiskOfRain'";
        ctx.fillStyle = "#000000";
        ctx.fillText("Complete a quantidade pedida de cada lixeira", mx + 2, 200 + 2);
        ctx.fillText("para bater a meta e encerrar o seu expediente.", mx + 2, 225 + 2);
        ctx.fillStyle = "#FFFFFF"; 
        ctx.fillText("Complete a quantidade pedida de cada lixeira", mx, 200);
        ctx.fillText("para bater a meta e encerrar o seu expediente.", mx, 225);
        
        ctx.font = "14px 'RiskOfRain'"; 
        ctx.fillStyle = "#000000"; ctx.fillText("Clique em qualquer lugar para avançar", mx + 2, 270 + 2);
        ctx.fillStyle = "#64748B"; ctx.fillText("Clique em qualquer lugar para avançar", mx, 270);
        
        // SETA APONTANDO PARA A META NO CENTRO DA TELA 
        if (imgSetaCima && imgSetaCima.isReady) ctx.drawImage(imgSetaCima, mx - 16, 110 + oscY, 32, 32); 
    }
    else if (tutorialEstado === 4) {
        // --- PASSO 4: MÃO NA MASSA ---
        ctx.font = "32px 'RiskOfRain'"; ctx.textAlign = "center";
        ctx.fillStyle = "#000000"; ctx.fillText("MÃO NA MASSA", mx + 2, 152 + 2); 
        ctx.fillStyle = "#FBBF24"; ctx.fillText("MÃO NA MASSA", mx, 150); 
        
        ctx.font = "18px 'RiskOfRain'";
        ctx.fillStyle = "#000000"; ctx.fillText("Segure o lixo plástico e arraste para a lixeira correta!", mx + 2, 182 + 2); 
        ctx.fillStyle = "#FFFFFF"; ctx.fillText("Segure o lixo plástico e arraste para a lixeira correta!", mx, 180); 


        // Lógica da seta apontando para a lixeira
        let primeiroLixo = listaLixos[0]; 
        let lixeiraCorreta = null;


        if (primeiroLixo) {
            for (let lix of lixeirasAtivas) {
                if (primeiroLixo.sprite.cor.toLowerCase() === lix.cor.toLowerCase()) {
                    lixeiraCorreta = lix;
                    break; 
                }
            }
        } else {
             lixeiraCorreta = lixeirasAtivas[0]; 
        }

        if (lixeiraCorreta && imgSetaBaixo && imgSetaBaixo.isReady) {
            ctx.drawImage(imgSetaBaixo, lixeiraCorreta.x + (lixeiraCorreta.largura / 2) - 16, lixeiraCorreta.y - 45 + oscY, 32, 32); 
        }


    }
    else if (tutorialEstado === 5) {
        // --- PASSO 5: VITÓRIA ---
        desenharModalCaixa(
            "CONTRATADO!", 
            "Excelente! Adoramos o seu trabalho.", 
            "O turno de verdade vai começar agora...", 
            "#10B981"
        );
    }
    
}

function desenharModalCaixa(titulo, subTitulo1 ,subTitulo2, corTitulo) {
    ctx.fillStyle = "rgba(15, 23, 42, 0.75)"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    let bw = 560, bh = 220; // Tamanho ideal do modal pequeno
    let bx = (canvas.width / 2) - (bw / 2);
    let by = (canvas.height / 2) - (bh / 2);
    
    // Desenha a arte do Modal Pequeno!
    if (imgModalPequeno && imgModalPequeno.isReady) {
        ctx.drawImage(imgModalPequeno, bx, by, bw, bh);
    } else {
        // Fallback escuro caso a imagem demore a carregar
        ctx.fillStyle = "#1E293B"; ctx.fillRect(bx, by, bw, bh);
    }

    // --- TÍTULO DO MODAL ---
    ctx.font = "32px 'RiskOfRain'"; ctx.textAlign = "center";
    // 1. Sombra preta 
    ctx.fillStyle = "#000000"; 
    ctx.fillText(titulo, (canvas.width / 2) + 2, by + 70 + 2);
    // 2. Título colorido por cima
    ctx.fillStyle = corTitulo; 
    ctx.fillText(titulo, canvas.width / 2, by + 70);

    // --- SUBTÍTULO 1 ---
    ctx.font = "18px 'RiskOfRain'"; 
    ctx.fillStyle = "#000000"; 
    ctx.fillText(subTitulo1, (canvas.width / 2) + 2, by + 100 + 2);
    ctx.fillStyle = "#ffffff"; 
    ctx.fillText(subTitulo1, canvas.width / 2, by + 100);
    
    // --- SUBTÍTULO 2 ---
    if (subTitulo2) { 
        ctx.fillStyle = "#000000"; 
        ctx.fillText(subTitulo2, (canvas.width / 2) + 2, by + 125 + 2); 
        ctx.fillStyle = "#ffffff"; 
        ctx.fillText(subTitulo2, canvas.width / 2, by + 125); 
    }
    
    // --- TEXTO DO RODAPÉ ("Clique para continuar") ---
    ctx.font = "16px 'RiskOfRain'"; 
    ctx.fillStyle = "#000000";
    ctx.fillText("Clique em qualquer lugar para continuar", (canvas.width / 2) + 2, by + 165 + 2);
    ctx.fillStyle = "#bfbfbf";
    ctx.fillText("Clique em qualquer lugar para continuar", canvas.width / 2, by + 165);
}

export function desenharMenu() {
    desenharFundoBase();
    
    // Véu escuro transparente para não misturar com o cenário do fundo
    ctx.fillStyle = "rgba(15, 23, 42, 0.6)"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Tamanho e centralização do Modal Grande
    let mw = 740, mh = 380;
    let mx = (canvas.width / 2) - (mw / 2);
    let my = (canvas.height / 2) - (mh / 2);

    if (imgModalGrande && imgModalGrande.isReady) ctx.drawImage(imgModalGrande, mx, my, mw, mh);
    else { ctx.fillStyle = "#1E293B"; ctx.fillRect(mx, my, mw, mh); } // Fallback de segurança

    // --- Textos do Menu com Sombra ---
    ctx.font = "48px 'RiskOfRain'"; ctx.textAlign = "center";
    // Título Sombra e Texto
    ctx.fillStyle = "#000000"; ctx.fillText("RECICLACOOP", (canvas.width / 2) + 3, 130 + 3); 
    ctx.fillStyle = "#10B981"; ctx.fillText("RECICLACOOP", canvas.width / 2, 130);
    
    ctx.font = "16px 'RiskOfRain'"; 
    // Subtítulo 1 Sombra e Texto
    ctx.fillStyle = "#000000"; ctx.fillText("Bem-vindo ao seu primeiro dia no Centro de Triagem RECICLACOOP!", (canvas.width / 2) + 2, 175 + 2);
    ctx.fillStyle = "#ffffff"; ctx.fillText("Bem-vindo ao seu primeiro dia no Centro de Triagem RECICLACOOP!", canvas.width / 2, 175);
    
    // Subtítulo 2 Sombra e Texto
    ctx.fillStyle = "#000000"; ctx.fillText("Bata o ponto para iniciar o expediente.", (canvas.width / 2) + 2, 195 + 2);
    ctx.fillStyle = "#ffffff"; ctx.fillText("Bata o ponto para iniciar o expediente.", canvas.width / 2, 195);
    
    desenharBotaoPixelArt("BATER PONTO", botaoStart, "#059669");
    desenharBotaoPixelArt("TUTORIAL", botaoTutorial, "#475569", "#ffffff");
    desenharBotaoPixelArt("CONFIG.", botaoConfig, "#475569", "#ffffff");
}

export function desenharSelecaoFases() {
    desenharFundoBase();
    
    ctx.fillStyle = "rgba(15, 23, 42, 0.6)"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    let mw = 740, mh = 380;
    let mx = (canvas.width / 2) - (mw / 2);
    let my = (canvas.height / 2) - (mh / 2);

    if (imgModalGrande && imgModalGrande.isReady) ctx.drawImage(imgModalGrande, mx, my, mw, mh);
    else { ctx.fillStyle = "#1E293B"; ctx.fillRect(mx, my, mw, mh); }

    // --- Textos da Seleção de Fases com Sombra ---
    ctx.font = "36px 'RiskOfRain'"; ctx.textAlign = "center";
    // Título Sombra e Texto
    ctx.fillStyle = "#000000"; ctx.fillText("Quadro de Escalas", (canvas.width / 2) + 2, 120 + 2);
    ctx.fillStyle = "#ffffff"; ctx.fillText("Quadro de Escalas", canvas.width / 2, 120);
    
    ctx.font = "16px 'RiskOfRain'";
    // Subtítulo Sombra e Texto
    ctx.fillStyle = "#000000"; ctx.fillText("Selecione o seu setor de trabalho", (canvas.width / 2) + 2, 150 + 2);
    ctx.fillStyle = "#bfbfbf"; ctx.fillText("Selecione o seu setor de trabalho", canvas.width / 2, 150);
    
    for (let b of botoesFases) {
        let liberada = fasesDesbloqueadas[b.fase];
        let hover = (botaoHover === b.id);
        
        // Verifica se a arte do botão já existe e está carregada
        if (b.imgNormal && b.imgNormal.isReady) {
            
            // SE A FASE ESTIVER BLOQUEADA
            if (!liberada) {
                if (b.imgBloqueado && b.imgBloqueado.isReady) {
                    // Desenha a arte cinza perfeita!
                    ctx.drawImage(b.imgBloqueado, b.x, b.y, b.largura, b.altura);
                } else {
                    // Fallback temporário caso ainda não tenha salvado a imagem bloqueada
                    ctx.drawImage(b.imgNormal, b.x, b.y, b.largura, b.altura); 
                    ctx.fillStyle = "rgba(15, 23, 42, 0.6)"; ctx.fillRect(b.x, b.y, b.largura, b.altura);
                    ctx.fillStyle = "#FFFFFF"; ctx.font = "20px RiskOfRain"; ctx.fillText("🔒", b.x + (b.largura / 2), b.y + b.altura + 25);
                }
            } 
            // SE A FASE ESTIVER LIBERADA (Animação normal)
            else {
                if (hover && mousePressionado && b.imgHover && b.imgHover.isReady) {
                    ctx.drawImage(b.imgHover, b.x, b.y + 4, b.largura, b.altura); 
                } 
                else if (hover && b.imgHover && b.imgHover.isReady) {
                    ctx.drawImage(b.imgHover, b.x, b.y, b.largura, b.altura); 
                } 
                else {
                    ctx.drawImage(b.imgNormal, b.x, b.y, b.largura, b.altura); 
                }
            }

        } else {
            // FALLBACK PARA RETÂNGULOS (Se a arte normal não existir)
            desenharBotaoPixelArt(b.fase === 5 ? "∞" : "S" + b.fase, b, liberada ? b.cor : "#475569");
            if (!liberada) { ctx.fillStyle = "#FFFFFF"; ctx.font = "20px RiskOfRain"; ctx.fillText("🔒", b.x + (b.largura / 2), b.y + b.altura + 25); }
        }
    }
    
    desenharBotaoPixelArt("VOLTAR", botaoVoltar, "#64748B");
}

export function desenharConfig(timestamp = 0) {
    // 1. Variável para centralizar
    let mx = canvas.width / 2; 

    // 2. Fundo do cenário estático (sem esteira e sem lixo)
    if (imgCenario && imgCenario.isReady) {
        ctx.drawImage(imgCenario, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = "#0F172A"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // 3. Película escura de fundo
    ctx.fillStyle = "rgba(15, 23, 42, 0.85)"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 4. Desenhando o seu Modal Grande
    let mw = 740, mh = 380;
    let mxModal = mx - (mw / 2); 
    let myModal = (canvas.height / 2) - (mh / 2);

    if (imgModalGrande && imgModalGrande.isReady) {
        ctx.drawImage(imgModalGrande, mxModal, myModal, mw, mh);
    } else { 
        ctx.fillStyle = "#1E293B"; ctx.fillRect(mxModal, myModal, mw, mh); 
    }

    // 5. Título Centralizado
    ctx.font = "36px 'RiskOfRain'"; ctx.textAlign = "center";
    ctx.fillStyle = "#000000"; ctx.fillText("CONFIGURAÇÕES", mx + 2, 110 + 2); 
    ctx.fillStyle = "#FFFFFF"; ctx.fillText("CONFIGURAÇÕES", mx, 110); 

    // --- MÚSICA com Sombra ---
    ctx.font = "24px 'RiskOfRain'"; 
    ctx.fillStyle = "#000000"; ctx.fillText("MÚSICA", mx + 2, 150 + 2); 
    ctx.fillStyle = "#FFFFFF"; ctx.fillText("MÚSICA", mx, 150);
    
    // Barra de volume da Música
    ctx.fillStyle = "#334155"; ctx.fillRect(mx - 50, 168, 100, 20); 
    ctx.fillStyle = "#10B981"; ctx.fillRect(mx - 50, 168, volumeMusica, 20); 
    ctx.strokeStyle = "#000000"; ctx.strokeRect(mx - 50, 168, 100, 20);
    
    // Botões de volume da Música
    desenharBotaoPixelArt("", btnMusicaMenos, "#334155");
    desenharBotaoPixelArt("", btnMusicaMais, "#334155");

    // --- EFEITOS (100% Centralizados) ---
    ctx.font = "24px 'RiskOfRain'"; 
    ctx.fillStyle = "#000000"; ctx.fillText("EFEITOS", mx + 2, 220 + 2); 
    ctx.fillStyle = "#FFFFFF"; ctx.fillText("EFEITOS", mx, 220); 
    
    // Barra de volume dos Efeitos
    ctx.fillStyle = "#334155"; ctx.fillRect(mx - 50, 238, 100, 20);
    ctx.fillStyle = "#10B981"; ctx.fillRect(mx - 50, 238, volumeEfeitos, 20);
    ctx.strokeStyle = "#000000"; ctx.strokeRect(mx - 50, 238, 100, 20);
    
    // Botões de volume dos Efeitos
    desenharBotaoPixelArt("", btnEfeitosMenos, "#334155");
    desenharBotaoPixelArt("", btnEfeitosMais, "#334155");

    // Botão Voltar 
    desenharBotaoPixelArt("VOLTAR", botaoVoltar, "#DC2626");
}

export function desenharVitoria(timestamp) {
    desenharPartida(timestamp); 
    
    let moedasBonus = 0;
    for (let lix of lixeirasAtivas) {
        let c = lix.cor.toLowerCase();
        let excedente = (lixosColetados[c] || 0) - metasColeta[c];
        if (excedente > 0) moedasBonus += excedente;
    }

    if (moedasBonus > 0) {
        desenharModalCaixa(
            "FIM DO EXPEDIENTE!", 
            "Meta batida com excelência!", 
            `Bônus de Produtividade: +${moedasBonus} moedas!`, 
            "#10B981"
        );
    } 
    else {
        desenharModalCaixa(
            "FIM DO EXPEDIENTE!", 
            "Meta batida.", 
            "Estamos orgulhosos do seu trabalho!", 
            "#10B981"
        );
    }
}

export function desenharGameOver(timestamp) {
    desenharPartida(timestamp);
    
    let linha1 = (faseAtual === 5) ? "Fim do Expediente." : "Estrelas esgotadas!";
    let linha2 = (faseAtual === 5) ? `Você acumulou ${pontos} moedas.` : `Você foi demitido com ${pontos} moedas.`;
    
    let titulo = (faseAtual === 5) ? "Turno Encerrado!" : "LENTO DEMAIS!";
    let cor = (faseAtual === 5) ? "#3B82F6" : "#EF4444";

    desenharModalCaixa(titulo, linha1, linha2, cor);
}

export function desenharMenuPausa(timestamp) {
    desenharPartida(timestamp); 
    ctx.fillStyle = "rgba(15, 23, 42, 0.85)"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    let mw = 740, mh = 380;
    let mx = (canvas.width / 2) - (mw / 2);
    let my = (canvas.height / 2) - (mh / 2);

    if (imgModalGrande && imgModalGrande.isReady) {
        ctx.drawImage(imgModalGrande, mx, my, mw, mh);
    } else { 
        ctx.fillStyle = "#1E293B"; ctx.fillRect(mx, my, mw, mh); 
    }

    ctx.fillStyle = "#FFFFFF"; ctx.font = "36px 'RiskOfRain'"; ctx.textAlign = "center";
    ctx.fillText("JOGO PAUSADO", canvas.width / 2, 125);
    
    desenharBotaoPixelArt("RETOMAR", botaoRetomar, "#059669");
    desenharBotaoPixelArt("TROCAR DE SETOR", botaoVoltarFases, "#2563EB");
    desenharBotaoPixelArt("VOLTAR AO MENU", botaoVoltarMenu, "#DC2626");
}