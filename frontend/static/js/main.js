// frontend/js/main.js

document.addEventListener("DOMContentLoaded", () => {
    renderizarLayoutGlobal();
});

/* ==========================================================================
   LAYOUT GLOBAL (Navbar/Header)
   ========================================================================== */

function renderizarLayoutGlobal() {
    const usuarioLogado = localStorage.getItem("token_usuario") !== null;

    const naSubpasta =
        window.location.pathname.includes("/auth/") ||
        window.location.pathname.includes("/dashboard/") ||
        window.location.pathname.includes("/quizzes/") ||
        window.location.pathname.includes("/classroom/") ||
        window.location.pathname.includes("/games/");

    const prefixo = naSubpasta ? "../" : "";

    // Descobre automaticamente qual painel mostrar
    let paginaPainel = "profile-student.html";

    try {
        const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
        const papel = usuario.role || usuario.perfil || usuario.tipo || "estudante";

        if (papel === "professor" || papel === "gestor") {
            paginaPainel = "dashboard-manager.html";
        }
    } catch (erro) {
        console.warn("Não foi possível identificar o perfil do usuário.");
    }

    const header = document.querySelector("header.topbar");

    if (!header) return;

    header.innerHTML = `
        <div class="left">
            ${
                usuarioLogado
                    ? `
                <label for="menu-check" class="hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                </label>
            `
                    : ""
            }

            <div class="info-container">
                <div class="logo-banner"
                     onclick="window.location.href='${prefixo}home.html'">

                    <span class="banner-icon">🌱</span>

                    <div class="brand-text">
                        <h1>PLATAFORMA EDUCA</h1>
                        <p>CULTIVANDO O SABER</p>
                    </div>
                </div>
            </div>
        </div>

        <nav class="menu">
            ${
                !usuarioLogado
                    ? `
                <a href="#" onclick="alternarAbaPublica('inicio')">INÍCIO</a>
                <a href="#" onclick="alternarAbaPublica('ods')">SOBRE NÓS</a>
                <a href="#" onclick="alternarAbaPublica('jogos')">NOSSOS JOGOS</a>

                <button
                    class="btn-login-top"
                    onclick="window.location.href='${prefixo}auth/login.html'">
                    Entrar ➔
                </button>
            `
                    : `
                <a href="${prefixo}dashboard/${paginaPainel}">
                    PAINEL
                </a>

                <a href="#">
                    MEU PERFIL
                </a>

                <button
                    onclick="fazerLogout()"
                    style="
                        background:#e63946;
                        color:white;
                        border:none;
                        padding:8px 15px;
                        border-radius:8px;
                        cursor:pointer;">
                    Sair
                </button>
            `
            }
        </nav>
    `;
}

/* ==========================================================================
   NAVEGAÇÃO PÚBLICA
   ========================================================================== */

function alternarAbaPublica(aba) {

    if (window.location.pathname.includes("/auth/")) {
        window.location.href = "../home.html";
        return;
    }

    const secInicio = document.getElementById("secao-inicio");
    const secOds = document.getElementById("secao-ods");
    const secJogos = document.getElementById("secao-jogos");

    if (!secInicio || !secOds || !secJogos) return;

    secInicio.classList.add("oculto");
    secOds.classList.add("oculto");
    secJogos.classList.add("oculto");

    switch (aba) {
        case "inicio":
            secInicio.classList.remove("oculto");
            break;

        case "ods":
            secOds.classList.remove("oculto");
            break;

        case "jogos":
            secJogos.classList.remove("oculto");
            break;
    }
}

/* ==========================================================================
   LOGOUT
   ========================================================================== */

function fazerLogout() {

    localStorage.removeItem("token_usuario");
    localStorage.removeItem("usuario");

    window.location.href = "../home.html";
}


/*function renderizarLayoutGlobal() {
    const usuarioLogado = localStorage.getItem("token_usuario") !== null;
    const naSubpasta = window.location.pathname.includes("/auth/") || 
                       window.location.pathname.includes("/dashboard/") || 
                       window.location.pathname.includes("/quizzes/") || 
                       window.location.pathname.includes("/classroom/") ||
                       window.location.pathname.includes("/games/");
                       
    const prefixo = naSubpasta ? "../" : "";

    const header = document.querySelector("header.topbar");
    if (header) {
        header.innerHTML = `
          <div class="left">
            ${usuarioLogado ? `
              <label for="menu-check" class="hamburger">
                <span></span><span></span><span></span>
              </label>
            ` : ''}
            
            <div class="info-container">
              <div class="logo-banner" onclick="window.location.href='${prefixo}home.html'">
                <span class="banner-icon">🌱</span>
                <div class="brand-text">
                  <h1>PLATAFORMA EDUCA</h1>
                  <p>CULTIVANDO O SABER</p>
                </div>
              </div>
            </div>
          </div>

          <nav class="menu">
            ${!usuarioLogado ? `
              <a href="#" onclick="alternarAbaPublica('inicio')">INÍCIO</a>
              <a href="#" onclick="alternarAbaPublica('ods')">SOBRE NÓS</a>
              <a href="#" onclick="alternarAbaPublica('jogos')">NOSSOS JOGOS</a>
              <button onclick="window.location.href='${prefixo}auth/login.html'" class="btn-login-top">Entrar ➔</button>
            ` : `
              <a href="${prefixo}dashboard/dashboard.html">PAINEL</a>
              <a href="#">MEU PERFIL</a>
              <button onclick="fazerLogout()" style="background-color: #e63946; padding: 8px 15px; border-radius: 8px; color: white; border: none; cursor: pointer;">Sair</button>
            `}
          </nav>
        `;
    }
}
    
document.addEventListener("DOMContentLoaded", () => {
    renderizarLayoutGlobal();
});


function renderizarLayoutGlobal() {
    const usuarioLogado = localStorage.getItem("token_usuario") !== null;

    const naSubpasta =
        window.location.pathname.includes("/auth/") ||
        window.location.pathname.includes("/dashboard/") ||
        window.location.pathname.includes("/quizzes/") ||
        window.location.pathname.includes("/classroom/") ||
        window.location.pathname.includes("/games/");

    const prefixo = naSubpasta ? "../" : "";

    let paginaPainel = "profile-student.html";

    try {
        const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

        const papel =
            usuario.role ||
            usuario.perfil ||
            usuario.tipo ||
            "estudante";

        if (papel === "professor" || papel === "gestor") {
            paginaPainel = "dashboard-manager.html";
        }

    } catch (e) {}

    // resto exatamente igual ao seu...
}
function alternarAbaPublica(aba) {
    if (window.location.pathname.includes("/auth/")) {
        window.location.href = "../home.html";
        return;
    }

    const secInicio = document.getElementById('secao-inicio');
    const secOds = document.getElementById('secao-ods');
    const secJogos = document.getElementById('secao-jogos');

    if (!secInicio || !secOds || !secJogos) return;

    secInicio.classList.add('oculto');
    secOds.classList.add('oculto');
    secJogos.classList.add('oculto');

    if (aba === 'inicio') secInicio.classList.remove('oculto');
    if (aba === 'ods') secOds.classList.remove('oculto');
    if (aba === 'jogos') secJogos.classList.remove('oculto');
}

function fazerLogout() {
    localStorage.removeItem("token_usuario");
    localStorage.removeItem("usuario");
    window.location.href = "../home.html";
}
*/

