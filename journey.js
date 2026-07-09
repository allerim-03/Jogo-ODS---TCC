document.addEventListener("DOMContentLoaded", function () {
    const steps = document.querySelectorAll('.journey-step');
    const tuga = document.getElementById('journey-tuga');
    
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
        steps.forEach(s => s.classList.remove('active'));
        stepElement.classList.add('active');

        const stepX = stepElement.offsetLeft; 
        const stepWidth = stepElement.offsetWidth;
        const tugaWidth = tuga.offsetWidth || 80;

        const posicaoFinalX = stepX + (stepWidth / 2) - (tugaWidth / 2);
        tuga.style.left = `${posicaoFinalX}px`;

        const stepIndex = stepElement.getAttribute('data-step');
        const data = stepData[stepIndex];

        if (data) {
            infoTitle.innerText = data.title;
            infoDescription.innerText = data.description;

            if (data.showButton) {
                infoBtn.innerText = data.btnText;
                infoBtn.href = data.btnLink;
                infoBtn.style.display = "inline-block";
            } else {
                infoBtn.style.display = "none";
            }
        }
    }

    steps.forEach(step => {
        step.addEventListener('click', function () {
            atualizarEtapa(this);
        });
    });

    setTimeout(() => {
        const firstStep = document.querySelector('.journey-step[data-step="0"]');
        if (firstStep) {
            atualizarEtapa(firstStep);
        }
    }, 200);
});