// =====================================
// Comunicação com a API Flask
// Apenas requisições HTTP
// =====================================

// Lista todos os quizzes
async function getQuizzes() {

    const response = await fetch("/api/quizzes");

    return await response.json();

}

// Obtém um quiz específico
async function getQuiz(quizId) {

    const response = await fetch(`/api/quizzes/${quizId}`);

    return await response.json();

}

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

// GET
getQuizzes()
getQuiz(id)

// POST
submitQuiz(id, userId, answers)

// ADMIN
createQuiz(data)
updateQuiz(id, data)
deleteQuiz(id)

// RESULTADOS
getQuizResults()