//controle dos quizzes
//lógica do quiz (respostas, próxima pergunta, submit)
// ======================================
// quiz.js
// Lógica do quiz
// - carregar o quiz
//-guardar resposta
//-mudar de pergunta
//-mostrar o resultado
// ======================================

let quiz;

let currentQuestion = 0;

let answers = {};

//inicialização
document.addEventListener("DOMContentLoaded", async () => {

    try{

        quiz = await getQuiz(QUIZ_ID);

        renderCurrentQuestion();

    }catch(error){

        console.error(error);

        showError("Não foi possível carregar o quiz.");

    }

});
//mostrar pergunta atual
function renderCurrentQuestion(){

    renderQuestion(

        quiz.questions[currentQuestion],

        currentQuestion,

        quiz.questions.length

    );

    updateProgress(

        currentQuestion,

        quiz.questions.length

    );

}
//selecionar alternativa
function selectOption(option){

    const question = quiz.questions[currentQuestion];

    answers[question.id] = option;

    currentQuestion++;

    if(currentQuestion < quiz.questions.length){

        renderCurrentQuestion();

    }else{

        finishQuiz();

    }

}
//finalizar
async function finishQuiz(){

    try{

        const result = await submitQuiz(

            QUIZ_ID,

            USER_ID,

            answers

        );

        showResult(result);

    }catch(error){

        console.error(error);

        showError("Erro ao enviar o quiz.");

    }

}