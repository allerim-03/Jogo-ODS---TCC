// comunicação com o flask
//Somente chamadas HTTP

async function getQuizzes() {
    const response = await fetch("/api/quizzes");
    return await response.json();
}

async function getQuiz(id) {
    const response = await fetch(`/api/quizzes/${id}`);
    return await response.json();
}

async function submitQuiz(id, payload) {
    const response = await fetch(`/api/quizzes/${id}/submit`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    return await response.json();
}