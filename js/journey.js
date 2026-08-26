document.addEventListener("DOMContentLoaded", function () {
    const steps = document.querySelectorAll('.journey-step');
    const tuga = document.getElementById('journey-tuga');
    const container = document.querySelector('.journey-map');

    const infoTitle = document.getElementById('journey-title');
    const infoDescription = document.getElementById('journey-description');
    const infoBtn = document.getElementById('journey-btn');

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
        if (!stepElement) return;

        // 1. Alterna classe ativa nas bolinhas
        steps.forEach(s => s.classList.remove('active'));
        stepElement.classList.add('active');

        // 2. Reposiciona o Tuga
        if (tuga && container) {
            const containerRect = container.getBoundingClientRect();
            const stepRect = stepElement.getBoundingClientRect();
            const tugaWidth = tuga.offsetWidth || 70;

            const stepCenterX = (stepRect.left - containerRect.left) + (stepRect.width / 2);
            const posicaoFinalX = stepCenterX - (tugaWidth / 2);

            tuga.style.left = `${posicaoFinalX}px`;
        }

        // 3. Atualiza textos do Card
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

    // Garante escuta nos elementos e em seus filhos (ícone/texto)
    steps.forEach(step => {
        step.style.cursor = "pointer"; // Garante cursor de clique
        step.addEventListener('click', function (e) {
            // Pega o contêiner .journey-step mesmo se clicar no span ou ícone interno
            const targetStep = e.currentTarget;
            atualizarEtapa(targetStep);
        });
    });

    // Posição inicial
    setTimeout(() => {
        const firstStep = document.querySelector('.journey-step[data-step="0"]');
        if (firstStep) atualizarEtapa(firstStep);
    }, 100);

    // Recalcula se a janela mudar de tamanho
    window.addEventListener('resize', () => {
        const activeStep = document.querySelector('.journey-step.active');
        if (activeStep) atualizarEtapa(activeStep);
    });
});