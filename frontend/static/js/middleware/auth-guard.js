/*
código de proteção para evitar que o usuario acesse uma pasta sem estar devidamente logado

*/
// ==========================================================================
// AUTH GUARD
//
// Middleware do Frontend.
//
// Responsável por:
//
// • verificar autenticação;
// • impedir acesso às páginas protegidas;
// • redirecionar para login.
//
// Backend:
// Flask + JWT
// ==========================================================================


//contante
const PROTECTED_ROUTES = [

    "/dashboard",

    "/games",

    "/ranking",

    "/profile",

    "/classroom",

    "/quizzes"

];

//função auxiliar de proteção
function paginaProtegida() {

    const caminho = window.location.pathname;

    return PROTECTED_ROUTES.some(

        rota => caminho.startsWith(rota)

    );

}

//proteção
async function protegerPagina() {

    if (!paginaProtegida()) {

        return;

    }

    if (!API.getToken()) {

        window.location.href = "/login";

        return;

    }

    try {

        await API.get("/auth/me");

    }

    catch {

        localStorage.removeItem("token_usuario");

        localStorage.removeItem("usuario");

        window.location.href = "/login";

    }

}

//inicialização
document.addEventListener(

    "DOMContentLoaded",

    protegerPagina

);
/*
importar em :
 Dashboard do estudante
 Dashboard do gestor/professor
 Perfil
 Ranking
 Quiz
 Jogos
 Turmas (Classroom
*/