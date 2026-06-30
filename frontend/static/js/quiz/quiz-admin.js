//crud do gestor-- controle para quiz-admin.html


console.log("quiz-admin carregado");
let quizzes = [];

let editingQuiz = null;

// =======================================
// Inicialização
// =======================================

document.addEventListener("DOMContentLoaded", async () => {

    document
        .getElementById("btn-new-quiz")
        .addEventListener("click", showQuizForm);

    document
        .getElementById("btn-save")
        .addEventListener("click", saveQuiz);

    await loadQuizzes();

});


// =======================================
// Carrega lista
// =======================================

async function loadQuizzes(){

    try{

        quizzes = await getAdminQuizzes();

        updateDashboard(quizzes);

        renderTable();

    }catch(error){

        console.error(error);

        alert(error.message);

    }

}


// =======================================
// Renderiza tabela
// =======================================

function renderTable(){

    const tbody = document.getElementById("quiz-table-body");

    tbody.innerHTML = "";

    quizzes.forEach(quiz =>{

        tbody.innerHTML += `

        <tr>

            <td>${quiz.id}</td>

            <td>${quiz.title}</td>

            <td>${quiz.theme}</td>

            <td>${quiz.difficulty}</td>

            <td>${quiz.xp_reward}</td>

            <td>

                ${
                    quiz.is_active
                    ? "🟢 Ativo"
                    : "🔴 Inativo"
                }

            </td>

            <td>

                <button onclick="editQuiz(${quiz.id})">

                    ✏️

                </button>

                <button onclick="manageQuestions(${quiz.id})">

                    📝

                </button>

                <button onclick="removeQuiz(${quiz.id})">

                    🗑️

                </button>

            </td>

        </tr>

        `;

    });

}


// =======================================
// Novo Quiz
// =======================================

//function newQuiz(){

  //  editingQuiz = null;

    //document.getElementById("form-title").textContent =
      //  "Novo Quiz";

    //clearForm();

    //document
      //  .getElementById("quiz-form-card")
        //.classList.remove("hidden");

//}
function showQuizForm(){

    document
        .getElementById("quiz-form-card")
        .classList.remove("hidden");

}

// =======================================
// Editar
// =======================================

function editQuiz(id){

    editingQuiz = quizzes.find(q => q.id === id);

    if(!editingQuiz) return;

    document.getElementById("form-title").textContent =
        "Editar Quiz";

    document.getElementById("quiz-title").value =
        editingQuiz.title;

    document.getElementById("quiz-theme").value =
        editingQuiz.theme;

    document.getElementById("quiz-difficulty").value =
        editingQuiz.difficulty;

    document.getElementById("quiz-xp").value =
        editingQuiz.xp_reward;

    document
        .getElementById("quiz-form-card")
        .classList.remove("hidden");

}


// =======================================
// Salvar
// =======================================

async function saveQuiz(){

    const data = {

        title:
            document.getElementById("quiz-title").value,

        theme:
            document.getElementById("quiz-theme").value,

        difficulty:
            document.getElementById("quiz-difficulty").value,

        xp_reward:
            Number(document.getElementById("quiz-xp").value)

    };

    try{

        if(editingQuiz){

            await updateQuiz(editingQuiz.id,data);

        }else{

            await createQuiz(data);

        }

        clearForm();

        document
            .getElementById("quiz-form-card")
            .classList.add("hidden");

        await loadQuizzes();

    }catch(error){

        console.error(error);

        alert(error.message);

    }

}


// =======================================
// Excluir
// =======================================

async function removeQuiz(id){

    const ok = confirm("Deseja excluir este quiz?");

    if(!ok) return;

    try{

        await deleteQuiz(id);

        await loadQuizzes();

    }catch(error){

        console.error(error);

        alert(error.message);

    }

}





// =======================================
// Utilitários
// =======================================

function clearForm(){

    document.getElementById("quiz-title").value = "";

    document.getElementById("quiz-theme").value = "";

    document.getElementById("quiz-difficulty").value = "Fácil";

    document.getElementById("quiz-xp").value = 100;

}
// =======================================
// PERGUNTAS
// =======================================

let questions = [];

let editingQuestion = null;

let currentQuizId = null;


// =======================================
// Inicialização da página de perguntas
// =======================================

async function initQuestionPage(quizId){

    currentQuizId = quizId;

    document
        .getElementById("btn-new-question")
        ?.addEventListener("click", showQuestionForm);

    document
        .getElementById("btn-save-question")
        ?.addEventListener("click", saveQuestion);

    await loadQuestions();

}


// =======================================
// Carrega perguntas
// =======================================

async function loadQuestions(){

    try{

        questions = await getQuestions(currentQuizId);

        renderQuestionTable();

    }catch(error){

        alert(error.message);

    }

}


// =======================================
// Renderiza tabela
// =======================================

function renderQuestionTable(){

    const tbody =
        document.getElementById("question-table-body");

    if(!tbody) return;

    tbody.innerHTML = "";

    questions.forEach(question=>{

        tbody.innerHTML += `

        <tr>

            <td>${question.question_order}</td>

            <td>${question.question_text}</td>

            <td>${question.correct_option}</td>

            <td>

                <button
                    class="btn btn-edit"
                    onclick="editQuestion(${question.id})">

                    Editar

                </button>

                <button
                    class="btn btn-delete"
                    onclick="removeQuestion(${question.id})">

                    Excluir

                </button>

            </td>

        </tr>

        `;

    });

}
// =======================================
// Perguntas
// =======================================

function manageQuestions(id){
    window.location.href = `/admin/quizzes/${id}/questions`;
}
function showQuestionForm(){

    editingQuestion = null;

    clearQuestionForm();

    document
        .getElementById("question-form-card")
        .classList.remove("hidden");

}
function editQuestion(id){

    editingQuestion =
        questions.find(q=>q.id===id);

    if(!editingQuestion) return;

    document.getElementById("question-text").value =
        editingQuestion.question_text;

    document.getElementById("option-a").value =
        editingQuestion.option_a;

    document.getElementById("option-b").value =
        editingQuestion.option_b;

    document.getElementById("option-c").value =
        editingQuestion.option_c;

    document.getElementById("option-d").value =
        editingQuestion.option_d;

    document.getElementById("correct-option").value =
        editingQuestion.correct_option;

    document.getElementById("question-order").value =
        editingQuestion.question_order;

    document
        .getElementById("question-form-card")
        .classList.remove("hidden");

}
async function saveQuestion(){

    const data={

        quiz_id:currentQuizId,

        question_text:
            document.getElementById("question-text").value,

        option_a:
            document.getElementById("option-a").value,

        option_b:
            document.getElementById("option-b").value,

        option_c:
            document.getElementById("option-c").value,

        option_d:
            document.getElementById("option-d").value,

        correct_option:
            document.getElementById("correct-option").value,

        question_order:
            Number(document.getElementById("question-order").value)

    };

    if(editingQuestion){

        await updateQuestion(editingQuestion.id,data);

    }else{

        await createQuestion(data);

    }

    clearQuestionForm();

    document
        .getElementById("question-form-card")
        .classList.add("hidden");

    await loadQuestions();

}
async function removeQuestion(id){

    if(!confirm("Excluir pergunta?")) return;

    await deleteQuestion(id);

    await loadQuestions();

}
function clearQuestionForm(){

    document.getElementById("question-text").value="";

    document.getElementById("option-a").value="";

    document.getElementById("option-b").value="";

    document.getElementById("option-c").value="";

    document.getElementById("option-d").value="";

    document.getElementById("correct-option").value="A";

    document.getElementById("question-order").value=1;

}