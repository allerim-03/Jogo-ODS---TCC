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
// Perguntas
// =======================================

function manageQuestions(id){
    window.location.href = `/admin/quizzes/${id}/questions`;
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