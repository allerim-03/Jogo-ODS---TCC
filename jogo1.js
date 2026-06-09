const canvas = document.getElementById("canvas-jogo-1");
const ctx = canvas.getContext("2d");

let x = 100;
let y = 100;

function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "blue";
    ctx.fillRect(x, y, 50, 50);

    requestAnimationFrame(desenhar);
}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") x += 10;
    if (e.key === "ArrowLeft") x -= 10;
    if (e.key === "ArrowUp") y -= 10;
    if (e.key === "ArrowDown") y += 10;
});

desenhar();