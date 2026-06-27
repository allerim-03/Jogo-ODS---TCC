
console.log("Journey carregado");
const etapas = [

{

titulo:"Comece sua aventura",

texto:"Crie sua conta e conheça o Tuga.",

},

{

titulo:"Explore os Jogos",

texto:"Resolva desafios ambientais e divirta-se aprendendo.",

},

{

titulo:"Faça sua Planta Crescer",

texto:"Ganhe XP e acompanhe a evolução da sua planta amazônica.",

},

{

titulo:"Conheça as ODS",

texto:"Cada missão ensina um Objetivo de Desenvolvimento Sustentável.",

},

{

titulo:"Torne-se um Guardião",

texto:"Conquiste medalhas e ajude a construir um futuro sustentável."

}

];
const tuga = document.getElementById("journey-tuga");

const journeyTitulo = document.getElementById("journey-title");

const journeyDescricao = document.getElementById("journey-description");

const passos = document.querySelectorAll(".journey-step");
const botao = document.getElementById("journey-btn");
function selecionarEtapa(indice){

    passos.forEach(p=>p.classList.remove("active"));

    const etapa = passos[indice];

    etapa.classList.add("active");

    journeyTitulo.textContent = etapas[indice].titulo;

    journeyDescricao.textContent = etapas[indice].texto;

    moverTuga(etapa);


    if(indice === 1){

        botao.style.display = "inline-flex";

        botao.href = "/about-games";

    }

    else{

        botao.style.display = "none";

    }

}


function moverTuga(etapa){

    const mapa = document.querySelector(".journey-map");

    const x = etapa.offsetLeft
            + etapa.offsetWidth/2
            - tuga.offsetWidth/2;

    tuga.style.left = x + "px";

}


passos.forEach((passo,indice)=>{

    passo.addEventListener("click",()=>{

        selecionarEtapa(indice);

    });

});

window.addEventListener("load",()=>{

    selecionarEtapa(0);

});