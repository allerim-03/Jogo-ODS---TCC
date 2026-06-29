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
const text = document.getElementById("tuga-text");

switch(result.xp_reason){

    case "score_improved":

        text.textContent =
        "Parabéns! Você melhorou seu desempenho e ganhou XP!";

        break;

    case "score_not_improved":

        text.textContent =
        "Você concluiu o quiz, mas precisa superar sua melhor pontuação de hoje para ganhar XP.";

        break;

    case "daily_limit":

        text.textContent =
        "Você atingiu o limite diário de tentativas com recompensa de XP. Continue praticando!";

        break;

    default:

        text.textContent =
        "Quiz finalizado!";
}
//mostrar cada questão
const container =
document.getElementById("questions-review");

result.questions_result.forEach(question => {

    container.innerHTML += `

    <div class="card">

        <h3>${question.question}</h3>

        <p>

            Sua resposta:
            <strong>${question.user_answer ?? "-"}</strong>

        </p>

        <p>

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

});