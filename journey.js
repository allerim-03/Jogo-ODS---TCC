document.addEventListener("DOMContentLoaded", function () {
    const steps = document.querySelectorAll('.journey-step');
    const tuga = document.getElementById('journey-tuga');
    const container = document.querySelector('.journey-map');
    
    const infoTitle = document.getElementById('journey-title');
    const infoDescription = document.getElementById('journey-description');
    const infoBtn = document.getElementById('journey-btn');

    // Estrutura completa de dados com rotas de navegação
    const stepData = {
        "0": {
            title: "Comece sua aventura",
            description: "Crie sua conta e conheça o Tuga.",
            showButton: true,
            btnText: "Cadastrar / Perfil",
            btnLink: "perfil.html"
        },
        "1": {
            title: "Explore os Jogos",
            description: "Resolva desafios ambientais e divirta-se aprendendo.",
            showButton: true,
            btnText: "Conheça nossos jogos",
            btnLink: "jogos.html"
        },
        "2": {
            title: "Faça sua Planta Crescer",
            description: "Ganhe XP e acompanhe a evolução da sua planta.",
            showButton: true,
            btnText: "Ver evolução",
            btnLink: "perfil.html"
        },
        "3": {
            title: "Conheça as ODS",
            description: "Cada missão ensina um Objetivo de Desenvolvimento Sustentável.",
            showButton: true,
            btnText: "Ver ODS",
            btnLink: "ods.html"
        },
        "4": {
            title: "Torne-se um Guardião",
            description: "Conquiste medalhas e ajude a construir um futuro sustentável.",
            showButton: true,
            btnText: "Ver Ranking",
            btnLink: "ranking.html"
        }
    };

    function atualizarEtapa(stepElement) {
        if (!stepElement || !container || !tuga) return;

        steps.forEach(s => s.classList.remove('active'));
        stepElement.classList.add('active');

        // Cálculo de posição responsiva do mascote Tuga
        const containerRect = container.getBoundingClientRect();
        const stepRect = stepElement.getBoundingClientRect();
        const tugaWidth = tuga.offsetWidth || 80;

        const stepCenterX = (stepRect.left - containerRect.left) + (stepRect.width / 2);
        const posicaoFinalX = stepCenterX - (tugaWidth / 2);

        tuga.style.left = `${posicaoFinalX}px`;

        // Atualização dos textos do Card
        const stepIndex = stepElement.getAttribute('data-step');
        const data = stepData[stepIndex];

        if (data) {
            infoTitle.innerText = data.title;
            infoDescription.innerText = data.description;

            if (data.showButton && infoBtn) {
                infoBtn.innerText = data.btnText;
                infoBtn.href = data.btnLink;
                infoBtn.style.display = "inline-block";
            } else if (infoBtn) {
                infoBtn.style.display = "none";
            }
        }
    }

    // Clique nos ícones da jornada
    steps.forEach(step => {
        step.addEventListener('click', function () {
            atualizarEtapa(this);
        });
    });

    // Inicialização e recálculo em mudanças na janela
    const initJourney = () => {
        const firstStep = document.querySelector('.journey-step[data-step="0"]');
        if (firstStep) {
            atualizarEtapa(firstStep);
        }
    };

    // Executa ao carregar e recalcula se a tela for redimensionada
    initJourney();
    window.addEventListener('resize', () => {
        const activeStep = document.querySelector('.journey-step.active');
        if (activeStep) {
            atualizarEtapa(activeStep);
        }
    });
});