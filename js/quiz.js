// BANCO DE DADOS DOS QUIZZES POR TEMA
const quizDatabase = {
    terrestres: {
        title: "ODS 15 - Ecossistemas Terrestres",
        questions: [
            {
                q: "Qual é uma das principais causas do desmatamento no mundo?",
                options: ["Expansão agrícola desordenada", "Energia eólica", "Turismo ecológico", "Pesquisa científica"],
                answer: 0
            },
            {
                q: "Qual das opções abaixo é considerada um recurso natural renovável?",
                options: ["Petróleo", "Energia Solar", "Carvão Mineral", "Gás Natural"],
                answer: 1
            },
            {
                q: "O que é reflorestamento?",
                options: ["Corte contínuo de árvores", "Plantio de árvores em áreas degradadas", "Asfaltamento de florestas", "Queimada controlada de pastos"],
                answer: 1
            }
        ]
    },
    reciclagem: {
        title: "ODS 12 - Reciclagem e Resíduos",
        questions: [
            {
                q: "Em qual lixeira da coleta seletiva devemos descartar garrafas plásticas?",
                options: ["Lixeira Azul", "Lixeira Vermelha", "Lixeira Amarela", "Lixeira Verde"],
                answer: 1
            },
            {
                q: "Qual das opções representa um material orgânico que pode ser compostado?",
                options: ["Cascas de frutas e legumes", "Sacolas plásticas", "Lâmpadas fluorescentes", "Latas de alumínio"],
                answer: 0
            },
            {
                q: "Qual é a ordem correta dos 3 R's clássicos da sustentabilidade?",
                options: ["Reciclar, Reutilizar, Recomprar", "Reduzir, Reutilizar, Reciclar", "Reter, Reformar, Recolher", "Remover, Reparar, Reler"],
                answer: 1
            }
        ]
    },
    agua: {
        title: "ODS 6 - Uso Consciente da Água",
        questions: [
            {
                q: "Aproximadamente qual porcentagem da água da Terra é doce e acessível para uso?",
                options: ["Cerca de 50%", "Cerca de 25%", "Menos de 1%", "Cerca de 10%"],
                answer: 2
            },
            {
                q: "Qual destas atitudes ajuda a economizar água no dia a dia?",
                options: ["Lavar a calçada com mangueira", "Fechar a torneira ao escovar os dentes", "Tomar banhos demorados", "Deixar vazamentos sem conserto"],
                answer: 1
            },
            {
                q: "O que é o tratamento de esgoto?",
                options: ["Descarte direto de efluentes no mar", "Processo de purificação da água usada antes de retornar à natureza", "Armazenamento de água da chuva", "Evaporação da água salgada"],
                answer: 1
            }
        ]
    }
};

// VARIÁVEIS DE CONTROLE DE ESTADO
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

// INICIAR UM QUIZ SELECIONADO
function startQuiz(themeKey) {
    const selectedData = quizDatabase[themeKey];
    
    if (!selectedData) return;

    currentQuestions = selectedData.questions;
    currentQuestionIndex = 0;
    score = 0;

    // Atualiza o distintivo com o título do tema
    document.getElementById("topic-badge").innerText = selectedData.title;

    // Oculta telas iniciais/finais e exibe a tela do jogo
    document.getElementById("selection-screen").style.display = "none";
    document.getElementById("result-screen").style.display = "none";
    document.getElementById("game").style.display = "block";

    loadQuestion();
}

// CARREGAR A PERGUNTA ATUAL
function loadQuestion() {
    const qData = currentQuestions[currentQuestionIndex];
    
    document.getElementById("question-text").innerText = qData.q;
    document.getElementById("progress-text").innerText = `Pergunta ${currentQuestionIndex + 1} de ${currentQuestions.length}`;
    
    // Atualiza o progresso visual da barra
    const progressPercent = (currentQuestionIndex / currentQuestions.length) * 100;
    document.getElementById("quiz-progress").style.width = `${progressPercent}%`;

    // Carrega as alternativas nos botões
    const buttons = document.querySelectorAll(".btn-option");
    buttons.forEach((btn, index) => {
        btn.innerText = qData.options[index];
        btn.className = "btn-option";
        btn.disabled = false;
    });
}

// LÓGICA DE RESPOSTA SELECIONADA
function selectOption(index) {
    const qData = currentQuestions[currentQuestionIndex];
    const buttons = document.querySelectorAll(".btn-option");

    // Desabilita botões para evitar cliques duplos
    buttons.forEach(btn => btn.disabled = true);

    if (index === qData.answer) {
        buttons[index].classList.add("correct");
        score += 100; // Soma 100 XP por acerto
    } else {
        buttons[index].classList.add("wrong");
        buttons[qData.answer].classList.add("correct");
    }

    // Avança para a próxima pergunta após 1.5s
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < currentQuestions.length) {
            loadQuestion();
        } else {
            showResults();
        }
    }, 1500);
}

// MOSTRAR TELA FINAL DE RESULTADOS
function showResults() {
    document.getElementById("game").style.display = "none";
    document.getElementById("result-screen").style.display = "block";
    document.getElementById("final-score").innerText = score;
    document.getElementById("quiz-progress").style.width = "100%";
}

// VOLTAR À TELA DE SELEÇÃO DE DESAFIOS
function resetQuiz() {
    document.getElementById("result-screen").style.display = "none";
    document.getElementById("game").style.display = "none";
    document.getElementById("selection-screen").style.display = "block";
}