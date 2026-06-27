const slides = [

{
    titulo: "Aprendendo de forma divertida",

    texto:
        "Aprender pode ser muito mais interessante quando você participa de desafios, jogos educativos, quizzes e missões sustentáveis. Cada atividade gera experiência, conquistas e ajuda sua planta a crescer.",

    fala:
        "Olá! Eu sou o Tuga 🐢. Vamos aprender brincando!",

    imagem: "/static/imagens/info/aprendizado.png"
},

{
    titulo: "Nossa Missão",

    texto:
        "Nossa missão é cultivar conhecimento através da tecnologia, despertando a consciência ambiental e tornando o aprendizado uma experiência divertida para todos.",

    fala:
        "Pequenas atitudes fazem uma grande diferença para o planeta!",

    imagem: "/static/imagens/info/missao.png"
},

{
    titulo: "Pronto para a aventura?",

    texto:
        "Jogue, complete desafios, descubra curiosidades sobre as ODS e acompanhe o crescimento da sua planta enquanto evolui de nível.",

    fala:
        "Estou esperando você! Vamos começar essa aventura!",

    imagem: "/static/imagens/info/aventura.png"
}

];

let atual = 0;

const sliderTitulo = document.getElementById("card-title");
const sliderTexto = document.getElementById("card-description");
const sliderFala = document.getElementById("speech-text");
const sliderImagem = document.getElementById("card-image");

const dots = document.querySelectorAll(".slider-dot");

function mostrarSlide(i){

    sliderTitulo.textContent = slides[i].titulo;

    sliderTexto.textContent = slides[i].texto;

    sliderFala.textContent = slides[i].fala;

    sliderImagem.src = slides[i].imagem;

    dots.forEach(dot => dot.classList.remove("active"));
    dots[i].classList.add("active");
const speech = document.querySelector(".speech-box");

speech.classList.remove("speech-box");

void speech.offsetWidth;

speech.classList.add("speech-box");
}

document.getElementById("next-slide").addEventListener("click", ()=>{

    atual++;

    if(atual >= slides.length){
        atual = 0;
    }

    mostrarSlide(atual);

});

document.getElementById("prev-slide").addEventListener("click", ()=>{

    atual--;

    if(atual < 0){
        atual = slides.length-1;
    }

    mostrarSlide(atual);

});

dots.forEach((dot,index)=>{

    dot.addEventListener("click",()=>{

        atual=index;

        mostrarSlide(atual);

    });

});

setInterval(()=>{

    atual++;

    if(atual >= slides.length){
        atual=0;
    }

    mostrarSlide(atual
        
    );

},7000);

mostrarSlide(0);