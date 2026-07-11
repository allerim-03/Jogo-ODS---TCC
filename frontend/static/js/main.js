// ==========================================================================
// MAIN.JS
//
// Responsável por:
//
// • Layout Global
// • Navbar
// • Sessão do usuário
// • Navegação pública
// • Logout
//
// Backend:
// Flask + JWT
// ==========================================================================



// ==========================================================================
// CONFIGURAÇÕES
// ==========================================================================
//para evitar a repetição de strings
const STORAGE_TOKEN = "token_usuario";

const STORAGE_USER = "usuario";



// ==========================================================================
// HELPERS
// ==========================================================================

function $(seletor) {

    return document.querySelector(seletor);

}

function mostrar(elemento) {

    elemento?.classList.remove("oculto");

}

function esconder(elemento) {

    elemento?.classList.add("oculto");

}



// ==========================================================================
// SESSÃO
// ==========================================================================

function getToken() {

    return localStorage.getItem(STORAGE_TOKEN);

}

function getUsuario() {

    try {

        return JSON.parse(

            localStorage.getItem(STORAGE_USER)

        );

    }

    catch {

        return null;

    }

}

function usuarioEstaLogado() {

    return getToken() !== null;

}

function limparSessao() {

    localStorage.removeItem(STORAGE_TOKEN);

    localStorage.removeItem(STORAGE_USER);

}



// ==========================================================================
// DASHBOARD DO USUÁRIO
// ==========================================================================

function obterDashboard(usuario) {

    if (!usuario) {

        return "/dashboard";

    }

    switch (usuario.role) {

        case "teacher":

            return "/teacher/dashboard";

        case "admin":

            return "/admin/dashboard";

        default:

            return "/dashboard";

    }

}



// ==========================================================================
// INICIALIZAÇÃO
// ==========================================================================

document.addEventListener(

    "DOMContentLoaded",

    () => {

        renderizarLayoutGlobal();

        // --------------------------------------------------------------
        // TODO
        //
        // Verificar automaticamente se o JWT continua válido.
        //
        // GET /api/auth/me
        //
        // Caso esteja expirado:
        //
        // • limpar sessão
        // • voltar para login
        //
        // --------------------------------------------------------------

    }

);



// ==========================================================================
// LAYOUT GLOBAL
// ==========================================================================

function renderizarLayoutGlobal() {

    const header = $("header.topbar");

    if (!header) {

        return;

    }

    const usuario = getUsuario();

    if (usuarioEstaLogado()) {

        renderizarHeaderLogado(

            header,

            usuario

        );

    }

    else {

        renderizarHeaderPublico(

            header

        );

    }

}
// ==========================================================================
// HEADER PÚBLICO
// ==========================================================================

function renderizarHeaderPublico(header) {

    header.innerHTML = `

        <div class="left">

            <div class="info-container">

                <div
                    class="logo-banner"
                    onclick="window.location.href='/'">

                    <span class="banner-icon">
                        🌱
                    </span>

                    <div class="brand-text">

                        <h1>PLATAFORMA EDUCA</h1>

                        <p>CULTIVANDO O SABER</p>

                    </div>

                </div>

            </div>

        </div>

        <nav class="menu">

            <a
                href="#"
                onclick="alternarAbaPublica('inicio')">

                INÍCIO

            </a>

            <a
                href="#"
                onclick="alternarAbaPublica('ods')">

                SOBRE NÓS

            </a>

            <a
                href="#"
                onclick="alternarAbaPublica('jogos')">

                NOSSOS JOGOS

            </a>

            <button

                class="btn-login-top"

                onclick="window.location.href='/login'">

                Entrar ➜

            </button>

        </nav>

    `;

}



// ==========================================================================
// HEADER DO USUÁRIO LOGADO
// ==========================================================================

function renderizarHeaderLogado(

    header,

    usuario

) {

    const dashboard =

        obterDashboard(usuario);

    header.innerHTML = `

        <div class="left">

            <label

                for="menu-check"

                class="hamburger">

                <span></span>

                <span></span>

                <span></span>

            </label>

            <div class="info-container">

                <div

                    class="logo-banner"

                    onclick="window.location.href='/'">

                    <span class="banner-icon">

                        🌱

                    </span>

                    <div class="brand-text">

                        <h1>PLATAFORMA EDUCA</h1>

                        <p>CULTIVANDO O SABER</p>

                    </div>

                </div>

            </div>

        </div>

        <nav class="menu">

            <a href="${dashboard}">

                PAINEL

            </a>

            <a href="/profile">

                MEU PERFIL

            </a>

            <button

                class="btn-logout"

                onclick="fazerLogout()">

                Sair

            </button>

        </nav>

    `;

}



// ==========================================================================
// ALTERAÇÃO DAS ABAS PÚBLICAS
// ==========================================================================

function alternarAbaPublica(aba) {

    // --------------------------------------------------------------
    // Caso esteja em outra página,
    // retorna para Home.
    // --------------------------------------------------------------

    if (

        window.location.pathname !== "/" &&

        window.location.pathname !== "/home"

    ) {

        window.location.href = "/";

        return;

    }

    const secoes = {

        inicio: $("#secao-inicio"),

        ods: $("#secao-ods"),

        jogos: $("#secao-jogos")

    };

    Object.values(secoes)

        .forEach(secao => esconder(secao));

    mostrar(secoes[aba]);

}
/* ==========================================================================
   LOGOUT
   ========================================================================== */

/**
 * Efetua logout do usuário.
 *
 * Futuramente:
 * - invalidar token no backend;
 * - limpar cache;
 * - registrar log de logout.
 */
function fazerLogout() {

    limparSessao();

    window.location.href = obterPrefixo() + "home.html";

}


/* ==========================================================================
   SESSÃO
   ========================================================================== */

/**
 * Remove todos os dados da sessão.
 */
function limparSessao() {

    localStorage.removeItem("token_usuario");
    localStorage.removeItem("usuario");

}


/**
 * Verifica se existe usuário autenticado.
 */
function usuarioEstaLogado() {

    return localStorage.getItem("token_usuario") !== null;

}


/**
 * Obtém usuário salvo localmente.
 */
function obterUsuario() {

    try {

        return JSON.parse(
            localStorage.getItem("usuario") || "{}"
        );

    }

    catch (erro) {

        console.warn(
            "Erro ao recuperar usuário da sessão."
        );

        return {};

    }

}


/**
 * Obtém papel do usuário.
 */
function obterPapelUsuario() {

    const usuario = obterUsuario();

    return (
        usuario.role ||
        usuario.perfil ||
        usuario.tipo ||
        "student"
    );

}


/* ==========================================================================
   UTILIDADES
   ========================================================================== */

/**
 * Verifica se a página está dentro de uma subpasta.
 */
function estaEmSubpasta() {

    const caminho = window.location.pathname;

    return (

        caminho.includes("/auth/") ||

        caminho.includes("/dashboard/") ||

        caminho.includes("/games/") ||

        caminho.includes("/classroom/") ||

        caminho.includes("/quizzes/")

    );

}


/**
 * Retorna o prefixo correto para navegação.
 */
function obterPrefixo() {

    return estaEmSubpasta()
        ? "../"
        : "";

}


/**
 * Descobre automaticamente qual dashboard abrir.
 *
 * Futuramente:
 * - utilizar apenas role do JWT;
 * - remover dependência do localStorage.
 */
function obterPaginaPainel() {

    const role = obterPapelUsuario();

    switch (role) {

        case "teacher":
        case "admin":

            return "dashboard-manager.html";

        case "student":
        default:

            return "profile-student.html";

    }

}


/* ==========================================================================
   INICIALIZAÇÃO
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

    renderizarLayoutGlobal();

});