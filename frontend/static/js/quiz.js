//controle dos quizzes
//lógica do quiz (respostas, próxima pergunta, submit)

document.addEventListener("DOMContentLoaded", async () => {

    
const quiz = await getQuiz(QUIZ_ID);
    renderQuestions(quiz.questions);

});
const result = await submitQuiz(id, payload);

showResult(result);

document.addEventListener("DOMContentLoaded", async ()=>{

    const quizzes = await getQuizzes();

    const container = document.getElementById("quiz-list");

    quizzes.forEach(quiz=>{

        container.innerHTML += createQuizCard(quiz);

    });

});

let quiz;

let currentQuestion = 0;

let answers = {};

window.onload = async ()=>{

    quiz = await loadQuiz(QUIZ_ID);

    renderQuestion();

}