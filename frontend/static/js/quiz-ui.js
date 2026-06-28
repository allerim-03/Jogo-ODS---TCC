// =====================================
// Renderização da interface do Quiz
// Manipulação do DOM
// =====================================

function showLoading() {

    document.getElementById("question-text").textContent =
        "Carregando...";

}

function showError(message) {

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