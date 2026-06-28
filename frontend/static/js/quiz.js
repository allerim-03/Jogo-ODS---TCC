//controle dos quizzes

document.addEventListener("DOMContentLoaded", async () => {

    const quiz = await getQuiz(quizId);

    renderQuestions(quiz.questions);

});
const result = await submitQuiz(id, payload);

showResult(result);