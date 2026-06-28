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

    return await response.json();

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




