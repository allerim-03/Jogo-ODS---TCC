

    // =====================================
    // CARREGA DADOS DO JOGADOR
    // =====================================

    async function loadPlayer() {

        try {

            const response =
                await fetch(
                    "http://127.0.0.1:5000/user/1/progress"
                );

            const player =
                await response.json();

            document.getElementById(
                "player-name"
            ).innerText =
                "Olá, " + player.name + "! 👋";

            document.getElementById(
                "player-level"
            ).innerText =
                "Nível " + player.level;

            document.getElementById(
                "player-xp"
            ).innerText =
                player.xp + " XP";

        }

        catch(error) {

            console.error(
                "Erro ao carregar jogador:",
                error
            );

        }

    }

    // =====================================
    // CARREGA RANKING
    // =====================================

    async function loadRanking() {

        try {

            const response =
                await fetch(
                    "http://127.0.0.1:5000/ranking"
                );

            const ranking =
                await response.json();

            let html = "";

            ranking.slice(0, 5).forEach(
                (player, index) => {

                html += `
                    <p>
                        ${index + 1}º -
                        ${player.name}
                        (${player.xp} XP)
                    </p>
                `;

            });

            document.getElementById(
                "ranking-dashboard"
            ).innerHTML = html;

        }

        catch(error) {

            console.error(
                "Erro ao carregar ranking:",
                error
            );

        }

    }
// =====================================
// CARREGA BADGES
// =====================================

async function loadBadges() {

    try {

        const response =
            await fetch(
                "http://127.0.0.1:5000/user/1/badges"
            );

        const badges =
            await response.json();

        let html = "";

        badges.forEach(badge => {

            html += `
                <div class="medalha-item">

                    <span class="medalha-emoji">
                        ${badge.icon}
                    </span>

                    <p>
                        ${badge.name}
                    </p>

                </div>
            `;
        });

        document.getElementById(
            "badges-container"
        ).innerHTML = html;

    }

    catch(error) {

        console.error(
            "Erro ao carregar badges:",
            error
        );

    }

}
    // =====================================
    // INICIALIZA DASHBOARD
    // =====================================

    loadPlayer();
    loadRanking();
    loadBadges();

 