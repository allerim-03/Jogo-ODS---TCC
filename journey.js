document.addEventListener("DOMContentLoaded", function () {
    const steps = document.querySelectorAll('.journey-step');
    const tuga = document.getElementById('journey-tuga');
    const container = document.querySelector('.journey-map');

    const infoTitle = document.getElementById('journey-title');
    const infoDescription = document.getElementById('journey-description');
    const infoBtn = document.getElementById('journey-btn');

    // Configuração dos dados de cada etapa da jornada
    const stepData = {
        "0": {
            title: "Comece sua Aventura",
            description: "Crie sua conta na plataforma para registrar suas conquistas e salvar seu progresso no jogo.",
            showButton: true,
            btnText: "Criar Conta / Perfil",
            btnLink: "perfil.html"
        },
        "1": {
            title: "Explore os Jogos",
            description: "Resolva desafios ambientais interativos com a temática de sustentabilidade.",
            showButton: true,
            btnText: "Jogar Agora",
            btnLink: "jogos.html"
        },
        "2": {
            title: "Faça sua Planta Crescer",
            description: "Ganhe XP completando missões para evoluir sua planta e subir de nível.",
            showButton: true,
            btnText: "Ver Meu Nível",
            btnLink: "perfil.html"
        },
        "3": {
            title: "Conheça as ODS",
            description: "Responda a quizzes e descubra os Objetivos de Desenvolvimento Sustentável.",
            showButton: true,
            btnText: "Responder Quiz",
            btnLink: "quiz.html"
        },
        "4": {
            title: "Torne-se um Guardião",
            description: "Dispute o Ranking Geral com outros alunos e conquiste a posição de Guardião Sustentável!",
            showButton: true,
            btnText: "Ver Ranking Geral",
            btnLink: "ranking.html"
        }
    };

    function atualizarEtapa(stepElement) {
        if (!stepElement || !tuga || !container) return;

        // 1. Destaque visual da bolinha selecionada
        steps.forEach(s => s.classList.remove('active'));
        stepElement.classList.add('active');

        // 2. Cálculo dinâmico para posicionar o Tuga centralizado na bolinha
        const containerRect = container.getBoundingClientRect();
        const stepRect = stepElement.getBoundingClientRect();
        const tugaWidth = tuga.offsetWidth || 80;

        const stepCenterX = (stepRect.left - containerRect.left) + (stepRect.width / 2);
        const posicaoFinalX = stepCenterX - (tugaWidth / 2);

        tuga.style.left = `${posicaoFinalX}px`;

        // 3. Atualização do Card de informações
        const stepIndex = stepElement.getAttribute('data-step');
        const data = stepData[stepIndex];

        if (data) {
            if (infoTitle) infoTitle.innerText = data.title;
            if (infoDescription) infoDescription.innerText = data.description;

            if (infoBtn) {
                if (data.showButton) {
                    infoBtn.innerText = data.btnText;
                    infoBtn.setAttribute('href', data.btnLink);
                    infoBtn.style.display = "inline-block";
                } else {
                    infoBtn.style.display = "none";
                }
            }
        }
    }

    // Evento de clique em cada ícone da jornada
    steps.forEach(step => {
        step.addEventListener('click', function () {
            atualizarEtapa(this);
        });
    });

    // Função para inicializar na primeira etapa
    function initJourney() {
        const firstStep = document.querySelector('.journey-step[data-step="0"]');
        if (firstStep) {
            atualizarEtapa(firstStep);
        }
    }

    // Garante que o alinhamento é feito após imagens carregarem
    window.addEventListener('load', initJourney);

    // Ajusta o alinhamento caso a janela seja redimensionada
    window.addEventListener('resize', () => {
        const activeStep = document.querySelector('.journey-step.active');
        if (activeStep) {
            atualizarEtapa(activeStep);
        }
    });

    // Chamada imediata inicial para evitar atrasos visuais
    initJourney();
});