// ===========================================
// QUIZ ADMIN UI
// Responsável apenas pela interface
// ===========================================


// -------------------------------------------
// Tabela
// -------------------------------------------

function renderQuizTable(quizzes){

    const tbody = document.getElementById("quiz-table-body");

    tbody.innerHTML = "";

    quizzes.forEach(quiz=>{

        tbody.innerHTML += `

        <tr>

            <td>${quiz.id}</td>

            <td>${quiz.title}</td>

            <td>${quiz.theme}</td>

            <td>

                ${renderDifficultyBadge(quiz.difficulty)}

            </td>

            <td>

                ${quiz.xp_reward} XP

            </td>

            <td>

                ${renderStatusBadge(quiz.is_active)}

            </td>

            <td>

                <div class="quiz-actions">

                    <button
                        class="btn btn-edit"
                        onclick="editQuiz(${quiz.id})">

                        ✏️ Editar

                    </button>

                    <button
                        class="btn btn-question"
                        onclick="manageQuestions(${quiz.id})">

                        ❓ Perguntas

                    </button>

                    <button
                        class="btn btn-delete"
                        onclick="removeQuiz(${quiz.id})">

                        🗑 Desativar

                    </button>

                </div>

            </td>

        </tr>

        `;

    });

}


// -------------------------------------------
// Status
// -------------------------------------------

function renderStatusBadge(active){

    if(active){

        return `
            <span class="badge badge-success">
                Ativo
            </span>
        `;

    }

    return `
        <span class="badge badge-danger">
            Inativo
        </span>
    `;

}


// -------------------------------------------
// Dificuldade
// -------------------------------------------

function renderDifficultyBadge(level){

    switch(level){

        case "Fácil":

            return `
                <span class="badge badge-success">
                    Fácil
                </span>
            `;

        case "Médio":

            return `
                <span class="badge badge-warning">
                    Médio
                </span>
            `;

        case "Difícil":

            return `
                <span class="badge badge-danger">
                    Difícil
                </span>
            `;

        default:

            return level;

    }

}


// -------------------------------------------
// Mostrar formulário
// -------------------------------------------

function showQuizForm(){

    document
        .getElementById("quiz-form-card")
        .classList.remove("hidden");

}


// -------------------------------------------
// Esconder formulário
// -------------------------------------------

function hideQuizForm(){

    document
        .getElementById("quiz-form-card")
        .classList.add("hidden");

}


// -------------------------------------------
// Limpar formulário
// -------------------------------------------

function clearQuizForm(){

    document.getElementById("quiz-title").value="";

    document.getElementById("quiz-theme").value="";

    document.getElementById("quiz-difficulty").value="Fácil";

    document.getElementById("quiz-xp").value=100;

}


// -------------------------------------------
// Preencher formulário
// -------------------------------------------

function fillQuizForm(quiz){

    document.getElementById("quiz-title").value =
        quiz.title;

    document.getElementById("quiz-theme").value =
        quiz.theme;

    document.getElementById("quiz-difficulty").value =
        quiz.difficulty;

    document.getElementById("quiz-xp").value =
        quiz.xp_reward;

}


// -------------------------------------------
// Alterar título
// -------------------------------------------

function setFormTitle(text){

    document.getElementById("form-title").textContent =
        text;

}


// -------------------------------------------
// Toast simples
// -------------------------------------------

function showSuccess(message){

    alert(message);

}


function showError(message){

    alert(message);

}

function updateDashboard(quizzes){

    document.getElementById("total-quizzes").textContent =
        quizzes.length;

    document.getElementById("active-quizzes").textContent =
        quizzes.filter(q => q.is_active).length;

    document.getElementById("inactive-quizzes").textContent =
        quizzes.filter(q => !q.is_active).length;

}