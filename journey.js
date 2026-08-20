document.addEventListener("DOMContentLoaded", function () {
    const steps = document.querySelectorAll('.journey-step');
    const tuga = document.getElementById('journey-tuga');
    const container = document.querySelector('.journey-map');
    
    const infoTitle = document.getElementById('journey-title');
    const infoDescription = document.getElementById('journey-description');
    const infoBtn = document.getElementById('journey-btn');

    const stepData = {
        "0": {
            title: "Comece sua aventura",
            description: "Crie sua conta e conheça o Tuga.",
            showButton: false
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
            description: "Ganhe XP e acompanhe a evolução da sua planta amazônica.",
            showButton: false
        },
        "3": {
            title: "Conheça as ODS",
            description: "Cada missão ensina um Objetivo de Desenvolvimento Sustentável.",
            showButton: false
        },
        "4": {
            title: "Torne-se um Guardião",
            description: "Conquiste medalhas e ajude a construir um futuro sustentável.",
            showButton: false
        }
    };

    function atualizarEtapa(stepElement) {
        if (!stepElement || !tuga || !container) return;

        // 1. Atualiza a classe ativa visualmente
        steps.forEach(s => s.classList.remove('active'));
        stepElement.classList.add('active');

        // 2. Calcula a posição exata
        const containerRect = container.getBoundingClientRect();
        const stepRect = stepElement.getBoundingClientRect();
        const tugaWidth = tuga.offsetWidth || 80;

        let posicaoFinalX = 0;

        if (containerRect.width > 0) {
            const stepCenterX = (stepRect.left - containerRect.left) + (stepRect.width / 2);
            posicaoFinalX = stepCenterX - (tugaWidth / 2);
        } else {
            // Fallback para carregamento assíncrono
            posicaoFinalX = stepElement.offsetLeft + (stepElement.offsetWidth / 2) - (tugaWidth / 2);
        }

        // Move a tartaruga
        tuga.style.left = `${posicaoFinalX}px`;

        // 3. Atualiza os dados do card explicativo
        const stepIndex = stepElement.getAttribute('data-step');
        const data = stepData[stepIndex];

        if (data) {
            if (infoTitle) infoTitle.innerText = data.title;
            if (infoDescription) infoDescription.innerText = data.description;

            if (infoBtn) {
                if (data.showButton) {
                    infoBtn.innerText = data.btnText;
                    infoBtn.href = data.btnLink;
                    infoBtn.style.display = "inline-block";
                } else {
                    infoBtn.style.display = "none";
                }
            }
        }
    }

    // Eventos de clique nas etapas
    steps.forEach(step => {
        step.addEventListener('click', function (e) {
            atualizarEtapa(e.currentTarget);
        });
    });

    // Função de inicialização do primeiro passo
    function inicializar() {
        const firstStep = document.querySelector('.journey-step[data-step="0"]');
        if (firstStep) {
            atualizarEtapa(firstStep);
        }
    }

    // Executa assim que o layout e imagens carregarem
    if (document.readyState === 'complete') {
        inicializar();
    } else {
        window.addEventListener('load', inicializar);
    }

    // Recalcula a posição ao redimensionar a tela
    window.addEventListener('resize', () => {
        const activeStep = document.querySelector('.journey-step.active');
        if (activeStep) {
            atualizarEtapa(activeStep);
        }
    });
});