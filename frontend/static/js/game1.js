const canvas = document.getElementById("canvas-jogo-1");
const ctx = canvas.getContext("2d");

let estado = "menu";

let x = 100;
let y = 100;

// Botão Play
const botaoPlay = {
    x: 220,
    y: 180,
    largura: 160,
    altura: 60
};

function desenharMenu() {
    // Fundo
    ctx.fillStyle = "#1e3a5f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Título
    ctx.fillStyle = "white";
    ctx.font = "36px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Ciclo da Água", canvas.width / 2, 100);

    // Botão
    ctx.fillStyle = "#2ecc71";
    ctx.fillRect(
        botaoPlay.x,
        botaoPlay.y,
        botaoPlay.largura,
        botaoPlay.altura
    );

    ctx.fillStyle = "white";
    ctx.font = "28px Arial";
    ctx.fillText(
        "PLAY",
        canvas.width / 2,
        botaoPlay.y + 40
    );
}

function desenharJogo() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "skyblue";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Jogador
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
}

function loop() {

    if (estado === "menu") {
        desenharMenu();
    }

    if (estado === "jogando") {
        desenharJogo();
    }

    requestAnimationFrame(loop);
}

// Clique no botão Play
canvas.addEventListener("click", (e) => {

    if (estado !== "menu") return;

    const rect = canvas.getBoundingClientRect();

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (
        mouseX >= botaoPlay.x &&
        mouseX <= botaoPlay.x + botaoPlay.largura &&
        mouseY >= botaoPlay.y &&
        mouseY <= botaoPlay.y + botaoPlay.altura
    ) {
        estado = "jogando";
    }
});

// Movimento
document.addEventListener("keydown", (e) => {

    if (estado !== "jogando") return;

    if (e.key === "ArrowRight") x += 10;
    if (e.key === "ArrowLeft") x -= 10;
    if (e.key === "ArrowUp") y -= 10;
    if (e.key === "ArrowDown") y += 10;
});

loop();