// =====================================
/// quiz-api.js 
// Comunicação com a API Flask
// Apenas requisições HTTP
// =====================================


// --------------------
// Utilitário
// --------------------

async function handleResponse(response){

    const data = await response.json();

    if(!response.ok){

        throw new Error(data.message || "Erro na API.");

    }

    return data;

}



// --------------------
// Aluno
// --------------------
// GET
// Lista todos os quizzes
async function getQuizzes(){

    const response = await fetch("/api/quizzes");

    return handleResponse(response);
 //return await response.json();
}

//quiz -- Obtém um quiz específico
async function getQuiz(quizId){

    const response = await fetch(`/api/quizzes/${quizId}`);

    return handleResponse(response);

}


//submit  -- POST

// Envia as respostas do aluno
async function submitQuiz(quizId, userId, answers) {

    const response = await fetch(`/api/quizzes/${quizId}/submit`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            user_id: userId,
            answers: answers
        })

    });

    return handleResponse(response);

}
// ==================================================
// PROFESSOR
// ==================================================

// Lista TODOS os quizzes (ativos e inativos)
async function getAdminQuizzes(){

    const response = await fetch("/api/quizzes/admin");

    return handleResponse(response);

}

// Cria quiz
async function createQuiz(data){

    const response = await fetch("/api/quizzes",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify(data)

    });

    return handleResponse(response);

}

// Atualiza quiz
async function updateQuiz(id,data){

    const response = await fetch(`/api/quizzes/${id}`,{

        method:"PUT",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify(data)

    });

    return handleResponse(response);

}
// Exclusão lógica
async function deleteQuiz(id){

    const response = await fetch(`/api/quizzes/${id}`,{

        method:"DELETE"

    });

    return handleResponse(response);

}

// ==================================================
// PERGUNTAS
// ==================================================
// ==================================================
// Utilitário
// ==================================================

async function handleResponse(response){

    const data = await response.json();

    if(!response.ok){

        throw new Error(data.message || "Erro na API.");

    }

    return data;

}

// ==================================================
// ALUNO
// ==================================================

// Lista quizzes ativos
async function getQuizzes(){

    const response = await fetch("/api/quizzes");

    return handleResponse(response);

}

// Busca um quiz específico
async function getQuiz(quizId){

    const response = await fetch(`/api/quizzes/${quizId}`);

    return handleResponse(response);

}

// Envia respostas do aluno
async function submitQuiz(quizId, userId, answers){

    const response = await fetch(`/api/quizzes/${quizId}/submit`,{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            user_id:userId,
            answers:answers

        })

    });

    return handleResponse(response);

}

// ==================================================
// PROFESSOR
// ==================================================

// Lista TODOS os quizzes (ativos e inativos)
async function getAdminQuizzes(){

    const response = await fetch("/api/quizzes/admin");

    return handleResponse(response);

}

// Cria quiz
async function createQuiz(data){

    const response = await fetch("/api/quizzes",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify(data)

    });

    return handleResponse(response);

}

// Atualiza quiz
async function updateQuiz(id,data){

    const response = await fetch(`/api/quizzes/${id}`,{

        method:"PUT",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify(data)

    });

    return handleResponse(response);

}

// Exclusão lógica
async function deleteQuiz(id){

    const response = await fetch(`/api/quizzes/${id}`,{

        method:"DELETE"

    });

    return handleResponse(response);

}

// ==================================================
// PERGUNTAS
// ==================================================

// Cria pergunta
async function createQuestion(data){

    const response = await fetch("/api/questions",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify(data)

    });

    return handleResponse(response);

}
// Atualiza pergunta
async function updateQuestion(id,data){

    const response = await fetch(`/api/questions/${id}`,{

        method:"PUT",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify(data)

    });

    return handleResponse(response);

}
// Exclui pergunta
async function deleteQuestion(id){

    const response = await fetch(`/api/questions/${id}`,{

        method:"DELETE"

    });

    return handleResponse(response);

}
// ==================================================
// RESULTADOS
// ==================================================

async function getQuizResults(){

    const response = await fetch("/api/quizzes/results");

    return handleResponse(response);

}
// --------------------
// Gestor (futuro)
// --------------------

// async function createQuiz(data){}

// async function updateQuiz(id, data){}

// async function deleteQuiz(id){}



// --------------------
// Resultados (futuro)
// --------------------

// async function getQuizResults(){}


// --------------------
// Perguntas (Gestor)
// --------------------

// Lista as perguntas de um quiz
async function getQuestions(quizId){

    const response = await fetch(`/api/quizzes/${quizId}`);

    const quiz = await handleResponse(response);

    return quiz.questions;

}


// Cria uma pergunta
async function createQuestion(data){

    const response = await fetch("/api/questions",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify(data)

    });

    return handleResponse(response);

}


// Atualiza uma pergunta
async function updateQuestion(questionId,data){

    const response = await fetch(`/api/questions/${questionId}`,{

        method:"PUT",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify(data)

    });

    return handleResponse(response);

}


// Exclui uma pergunta
async function deleteQuestion(questionId){

    const response = await fetch(`/api/questions/${questionId}`,{

        method:"DELETE"

    });

    return handleResponse(response);

}

