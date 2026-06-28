//lista dos quizzes e criação dos cards
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

            <div class="quiz-meta">

                <span class="badge badge-info">

                    ${difficultyLabel(quiz.difficulty)}

                </span>

                <span class="quiz-xp">

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

    const quizzes = await getQuizzes();

    const container =
        document.getElementById("quiz-list");

    container.innerHTML =
        quizzes.map(createQuizCard).join("");

}

window.onload = loadQuizList;

document.addEventListener("DOMContentLoaded", async ()=>{

    const quizzes = await getQuizzes();

    const container = document.getElementById("quiz-list");

    quizzes.forEach(quiz=>{

        container.innerHTML += createQuizCard(quiz);

    });

});