// canva e contexto
const canvas = document.getElementById("canvas-jogo-1");
const ctx = canvas.getContext("2d");

// estados do jogo (menu ou play)
let estadoJogo = "MENU";

// configurações do jogador (gota)
const gota = {
    x: 100,
    y: 250,
    largura: 50,
    altura: 50,
    velocidade: 4,
    frameAtual: 0,
    contadorAnimação: 0,
    velocidadeAnimação: 8
};

// botão play do menu
const botaoPlay = {
    x: canvas.width / 2 - 100, // centralizado horizontalmente
    y: 240,
    largura: 200,
    altura: 50
};

// controle de teclas
const teclas = { w: false, a: false, s: false, d: false };

window.addEventListener("keydown", (e) => {
    const tecla = e.key.toLowerCase();
    if (tecla in teclas) teclas[tecla] = true;
});

window.addEventListener("keyup", (e) => {
    const tecla = e.key.toLowerCase();
    if (tecla in teclas) teclas[tecla] = false;
});

// carregando imagens e assets
const imgFundoMenu = new Image();
imgFundoMenu.src = "img/img-jogo1/fundo_menu.png"; // placeholder para o fundo do menu

const imgFundoFase1 = new Image();
imgFundoFase1.src = "img/img-jogo1/fundo_fase1.png"; // placeholder para fundo da primeira fase

const spritesGota = [];
const totalSprites = 5;
let imagensCarregadas = 0;

// função para contar carregamento e iniciar o loop
function checarCarregamento() {
    imagensCarregadas++;
    // 5 sprites + fundo menu + fundo fase = 7 imagens no total
    if (imagensCarregadas === totalSprites + 2) {
        loopPrincipal();
    }
}

imgFundoMenu.onload = checarCarregamento;
imgFundoFase1.onload = checarCarregamento;

for (let i = 1; i <= totalSprites; i++) {
    const img = new Image();
    img.src = `img/img-jogo1/spr_gota${i}.png`;
    img.onload = checarCarregamento;
    spritesGota.push(img);
}

// mouse interage com o menu
canvas.addEventListener("click", (e) => {
    if (estadoJogo === "MENU") {
        // pega a posição do clique dentro do canvas
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // verifica se o clique foi dentro das coordenadas do botão "Jogar"
        if (mouseX >= botaoPlay.x && mouseX <= botaoPlay.x + botaoPlay.width &&
            mouseY >= botaoPlay.y && mouseY <= botaoPlay.y + botaoPlay.height) {
            
            estadoJogo = "PLAY"; // muda o estado pra play e sai do menu
        }
    }
});

// logica da atualizacao
function atualizar() {
    if (estadoJogo === "PLAY") {
        let seMovendo = false;

        if (teclas.w && gota.y > 0) { gota.y -= gota.velocidade; seMovendo = true; }
        if (teclas.s && gota.y + gota.altura < canvas.height) { gota.y += gota.velocidade; seMovendo = true; }
        if (teclas.a && gota.x > 0) { gota.x -= gota.velocidade; seMovendo = true; }
        if (teclas.d && gota.x + gota.largura < canvas.width) { gota.x += gota.velocidade; seMovendo = true; }

        if (seMovendo) {
            gota.contadorAnimação++;
            if (gota.contadorAnimação >= gota.velocidadeAnimação) {
                gota.frameAtual = (gota.frameAtual + 1) % totalSprites;
                gota.contadorAnimação = 0;
            }
        } else {
            gota.frameAtual = 0;
        }
    }
}

// renderização / desenho
function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (estadoJogo === "MENU") {
        // fundo do menu
        ctx.drawImage(imgFundoMenu, 0, 0, canvas.width, canvas.height);

        // titulo do jogo
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 34px 'Courier New', sans-serif"; // fonte pixelada
        ctx.textAlign = "center";
        ctx.fillText("CICLO DA ÁGUA", canvas.width / 2, 120);
        
        ctx.font = "18px sans-serif";
        ctx.fillText("Ajude o a completar o Ciclo!", canvas.width / 2, 160);

        // botão jogar
        ctx.fillStyle = "#f39c12";
        ctx.strokeStyle = "#d35400";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(botaoPlay.x, botaoPlay.y, botaoPlay.largura, botaoPlay.height, 10); // borda arredondada
        ctx.fill();
        ctx.stroke();

        // texto do botão
        ctx.fillStyle = "#111";
        ctx.font = "bold 20px sans-serif";
        ctx.fillText("JOGAR", canvas.width / 2, botaoPlay.y + 32);

    } else if (estadoJogo === "PLAY") {
        // fundo da primeira fase
        ctx.drawImage(imgFundoFase1, 0, 0, canvas.width, canvas.height);

        // Gota andando
        const spriteAtual = spritesGota[gota.frameAtual];
        if (spriteAtual) {
            ctx.drawImage(spriteAtual, gota.x, gota.y, gota.largura, gota.altura);
        }
    }
}

// 9. Loop Principal
function loopPrincipal() {
    atualizar();
    desenhar();
    requestAnimationFrame(loopPrincipal);
}