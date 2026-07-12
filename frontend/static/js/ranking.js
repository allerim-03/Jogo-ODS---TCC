


async function loadRanking() {

    try {

        const response =
            await fetch("http://127.0.0.1:5000/ranking");

        if (!response.ok) {
            throw new Error("Erro ao buscar ranking");
        }

        const ranking =
            await response.json();

        if (ranking.length === 0) {

            document.getElementById(
                "ranking-list"
            ).innerHTML =
                "<p>Nenhum jogador encontrado.</p>";

            return;
        }

        // ==========================
        // PODIUM
        // ==========================

        if (ranking[0]) {

            document.getElementById(
                "first-name"
            ).innerText =
                ranking[0].name;

            document.getElementById(
                "first-xp"
            ).innerText =
                ranking[0].xp + " XP";
        }

        if (ranking[1]) {

            document.getElementById(
                "second-name"
            ).innerText =
                ranking[1].name;

            document.getElementById(
                "second-xp"
            ).innerText =
                ranking[1].xp + " XP";
        }

        if (ranking[2]) {

            document.getElementById(
                "third-name"
            ).innerText =
                ranking[2].name;

            document.getElementById(
                "third-xp"
            ).innerText =
                ranking[2].xp + " XP";
        }

        // ==========================
        // LISTA
        // ==========================

        let html = "";

        for (let i = 3; i < ranking.length; i++) {

            html += `
                <div class="ranking-item">

                    <span class="position">
                        ${i + 1}º
                    </span>

                    <img
                        src="{{ url_for('static', filename='img/foto.png') }}"
                        class="item-avatar">

                    <span class="player-name">
                        ${ranking[i].name}
                    </span>

                    <span class="player-xp">
                        ${ranking[i].xp} XP
                    </span>

                </div>
            `;
        }

        document.getElementById(
            "ranking-list"
        ).innerHTML = html;

        // ==========================
        // USUÁRIO ATUAL
        // ==========================

        /*
            Exemplo futuro:

            const userResponse =
                await fetch("/user/current");

            const user =
                await userResponse.json();
        */

        const usuarioExemplo = {
            position: 12,
            name: "Você",
            xp: 450
        };

        document.getElementById(
            "current-user-container"
        ).innerHTML = `
            <div class="ranking-item current-user">

                <span class="position">
                    ${usuarioExemplo.position}º
                </span>

                <img
                    src="{{ url_for('static', filename='img/foto.png') }}"
                    class="item-avatar">

                <span class="player-name">
                    ${usuarioExemplo.name}
                </span>

                <span class="player-xp">
                    ${usuarioExemplo.xp} XP
                </span>

            </div>
        `;

    }

    catch(error) {

        console.error(error);

        document.getElementById(
            "ranking-list"
        ).innerHTML = `
            <div class="erro-ranking">
                Não foi possível carregar o ranking.
            </div>
        `;
    }
}

document.addEventListener(
    "DOMContentLoaded",
    loadRanking
);

