// ===============================
// quiz-list.js
// Responsável por carregar a lista
// de quizzes disponíveis.
// ===============================

function difficultyLabel(level){

    switch(level){

        case "easy":
            return "⭐ Fácil";

        case "medium":
            return "⭐⭐ Médio";

        case "hard":
            return "⭐⭐⭐ Difícil";

        default:
            return level;

    }

}

function createQuizCard(quiz){

    return `

        <div class="card quiz-card">

            <h3>${quiz.title}</h3>

            <p>${quiz.theme}</p>

            <div class="quiz-meta">

                <span class="badge badge-info">
                    ${difficultyLabel(quiz.difficulty)}
                </span>

                <span class="badge badge-level">
                    +${quiz.xp_reward} XP
                </span>

            </div>

            <a
                href="/quiz/${quiz.id}"
                class="btn btn-primary">

                Iniciar Quiz

            </a>

        </div>

    `;

}

async function loadQuizList(){

    try{

        const quizzes = await getQuizzes();

        const container =
            document.getElementById("quiz-list");

        container.innerHTML =
            quizzes.map(createQuizCard).join("");

    }catch(error){

        console.error(error);

    }

}

document.addEventListener(
    "DOMContentLoaded",
    loadQuizList
);