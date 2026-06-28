
// =====================================
// quiz-ui.js
// Responsável apenas pela interface
//Renderização da interface do Quiz
//Manipulação do DOM
// =====================================

// ----------------------------
// Lista de quizzes
// ----------------------------

function difficultyLabel(level) {

    switch (level) {

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

function createQuizCard(quiz) {

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

            <a href="/quiz/${quiz.id}"
               class="btn btn-primary">

                Iniciar Quiz

            </a>

        </div>
    `;

}

// ----------------------------
// Tela do quiz
// ----------------------------


//mostrar pergunta
function renderQuestion(question) {

    document.getElementById("question-text").textContent =
        question.question_text;

    const container =
        document.getElementById("options-container");

    container.innerHTML = "";

    ["A", "B", "C", "D"].forEach(letter => {

        const button = document.createElement("button");

        button.className = "btn-option";

        button.textContent =
            question[`option_${letter.toLowerCase()}`];

        button.onclick = () => selectOption(letter);

        container.appendChild(button);

    });

}
//barra de progresso
function updateProgress(current, total) {

    document.getElementById("progress-text").textContent =
        `Pergunta ${current + 1} de ${total}`;

    document.getElementById("quiz-progress").style.width =
        `${((current + 1) / total) * 100}%`;

}

function disableButtons() {

    document
        .querySelectorAll(".btn-option")
        .forEach(button => button.disabled = true);

}

function enableButtons() {

    document
        .querySelectorAll(".btn-option")
        .forEach(button => button.disabled = false);

}

// ----------------------------
// Estados da tela
// ----------------------------

//carregamento
function showLoading() {

    document.getElementById("question-text").textContent =
        "Carregando quiz...";

}

//erro
function showError(message) {

    document.getElementById("question-text").textContent =
        message;

}

// ----------------------------
// Resultado
// ----------------------------

function showResult(result) {

    sessionStorage.setItem(
        "quizResult",
        JSON.stringify(result)
    );

    window.location.href = "/quiz/result";

}