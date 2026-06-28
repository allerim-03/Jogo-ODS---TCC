//controle dos quizzes
//lógica do quiz (respostas, próxima pergunta, submit)

document.addEventListener("DOMContentLoaded", async () => {

    
const quiz = await getQuiz(QUIZ_ID);
    renderQuestions(quiz.questions);

});
const result = await submitQuiz(id, payload);

showResult(result);



let quiz;

let currentQuestion = 0;

let answers = {};

window.onload = async ()=>{

    quiz = await loadQuiz(QUIZ_ID);

    renderQuestion();

}
//pergunta atual
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
//alternativa
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

    const result = await submitQuiz(

        QUIZ_ID,

        USER_ID,

        answers

    );

    showResult(result);

}