//mostra o resultado final
const result =
    JSON.parse(sessionStorage.getItem("quizResult"));

if (!result) {

    window.location = "/quizzes";

}

document.getElementById("score").textContent =
`${result.score} / ${result.total_questions} acertos`;

document.getElementById("xp").textContent =
`XP ganho: +${result.xp_gained}`;

document.getElementById("level").textContent =
`Nível ${result.level}`;
//mensagem Tuga
const tugaText = document.getElementById("tuga-text");


if(result.score === result.total_questions){

    tugaText.textContent =
    "Perfeito! Você dominou este conteúdo.Melhorou seu desempenho e ganhou XP!";

}
else if(result.score >= result.total_questions*0.7){

    tugaText.textContent =
    "🌟 Excelente! Continue assim.";

}
else if(result.score >= result.total_questions*0.5){

    tugaText.textContent =
    " Bom trabalho! Revise algumas questões para melhorar ainda mais.";

}
else{

    tugaText.textContent =
    " Não desanime! Revise o conteúdo e tente novamente.";

}


//mostrar cada questão
let optionsHTML = "";

Object.entries(question.options).forEach(([letter,text])=>{

    let css = "btn-option";

    if(letter === question.correct_answer){

        css += " correct";

    }
    else if(letter === question.user_answer){

        css += " wrong";

    }

    optionsHTML += `
        <button class="${css}">
            ${letter}) ${text}
        </button>
    `;

});
const container =
document.getElementById("questions-review");

result.questions_result.forEach(question => {
    container.innerHTML += `

<div class="card">

    <h3>${question.question}</h3>

    ${optionsHTML}

</div>

`;
    
'''

            Resposta correta:
            <strong>${question.correct_answer}</strong>

        </p>

        <span class="badge ${
            question.correct
                ? "badge-success"
                : "badge-danger"
        }">

            ${
                question.correct
                    ? "✔ Correta"
                    : "✘ Incorreta"
            }

        </span>

    </div>

    <br>

    `;
'''
});
//quantidade de tentativas
document.getElementById("correct-count").textContent =
    `${result.score} de ${result.total_questions}`;

document.getElementById("attempts-left").textContent =
    `${result.attempts_left}/3`;

  

const retry =
    document.getElementById("btn-retry");

if(retry){

    retry.addEventListener("click",()=>{

        window.location.href =
        `/quiz/${result.quiz_id}`;

    });

}