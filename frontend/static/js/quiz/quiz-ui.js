// =====================================
// Renderização da interface do Quiz
// Manipulação do DOM
// =====================================
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

            <a href="/quiz/${quiz.id}"
               class="btn btn-primary">

                Iniciar Quiz

            </a>

        </div>

    `;

}
//mostrar pergunta
function renderQuestion(question, index, total){

    document.getElementById("question-text").innerText =
        question.question_text;

    document.getElementById("progress-text").innerText =
        `Pergunta ${index + 1} de ${total}`;

    const buttons = document.querySelectorAll(".btn-option");

    const options = [
        question.option_a,
        question.option_b,
        question.option_c,
        question.option_d
    ];

    buttons.forEach((button,i)=>{

        button.innerText = options[i];

    });

}
//barra de progresso
function updateProgress(index,total){

    const percent = ((index)/total)*100;

    document.getElementById("quiz-progress").style.width =
        `${percent}%`;

}
//resultado
function showResult(result){

    window.location.href =
        `/quiz/result?score=${result.score}`;
}
//carregamento
function showLoading() {

    document.getElementById("question-text").textContent =
        "Carregando...";

}
//erro
function showError(message){

    alert(message);

}
function showErrorMessage(message) {

    document.getElementById("question-text").textContent =
        message;

}

function updateProgress(current, total){

    document.getElementById("progress-text").textContent =
        `Pergunta ${current + 1} de ${total}`;

    document.getElementById("quiz-progress").style.width =
        `${((current + 1) / total) * 100}%`;

}

function disableButtons(){

    document
        .querySelectorAll(".btn-option")
        .forEach(button => button.disabled = true);

}

function enableButtons(){

    document
        .querySelectorAll(".btn-option")
        .forEach(button => button.disabled = false);

}

function renderQuestion(question){

    document.getElementById("question-text").textContent =
        question.question_text;

    const container =
        document.getElementById("options-container");

    container.innerHTML = "";

    ["A","B","C","D"].forEach(letter =>{

        const button = document.createElement("button");

        button.className = "btn-option";

        button.dataset.option = letter;

        button.textContent =
            question[`option_${letter.toLowerCase()}`];

        container.appendChild(button);

    });

}

function showResult(result){

    sessionStorage.setItem(
        "quizResult",
        JSON.stringify(result)
    );

    window.location = "/quiz/result";

}
function renderQuestion(question){...}

function updateProgress(current,total){...}

function disableButtons(){...}

function showLoading(){...}

function showError(message){...}