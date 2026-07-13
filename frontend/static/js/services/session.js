

/* ==========================================================================
   SESSION SERVICE

   Responsável apenas por controlar a sessão local.

   Este arquivo NÃO realiza chamadas HTTP.
   Apenas salva e recupera dados do LocalStorage.

   Responsabilidades:

   • Salvar usuário
   • Salvar JWT
   • Recuperar usuário
   • Recuperar token
   • Verificar login
   • Encerrar sessão
   ========================================================================== */
/*

session.js

localstorage/ jwt/usuário
sessão do usuario sm conectar com a interface
salvarSessao()

limparSessao()

getUsuario()

usuarioEstaLogado()

getToken()

logout()



*/
// ==========================================================================
// SESSÃO DO USUÁRIO
// ==========================================================================

function salvarSessao(usuario, token) {

    if (token) {

        API.saveToken(token);

    }

    localStorage.setItem(

        "usuario",

        JSON.stringify(usuario)

    );

}

function limparSessao() {

    localStorage.removeItem("usuario");

    API.removeToken();

}

function getUsuario() {

    try {

        const usuario = localStorage.getItem("usuario");

        return usuario

            ? JSON.parse(usuario)

            : null;

    }

    catch {

        return null;

    }

}
function usuarioEstaLogado() {

    return API.getToken() !== null;

}

function logout() {

    limparSessao();

    window.location.href = "/login";

}




// ==========================================================================
// Redireciona conforme o perfil
// ==========================================================================

function redirecionarUsuario(usuario) {

    switch (usuario.role) {

        // --------------------------------------------------------------
        // Aluno
        // --------------------------------------------------------------

        case "student":

            iniciarFluxoAluno(usuario);

            break;

        // --------------------------------------------------------------
        // Professor
        // --------------------------------------------------------------

        case "teacher":

            window.location.href =
                "/teacher/dashboard";

            break;

        // --------------------------------------------------------------
        // Administrador
        // --------------------------------------------------------------

        case "admin":

            // TODO
            // Criar painel administrativo.

            window.location.href =
                "/admin/dashboard";

            break;

        // --------------------------------------------------------------

        default:

            window.location.href =
                "/dashboard";

    }

}

window.Session = {

    salvarSessao,

    limparSessao,

    getUsuario,

    usuarioEstaLogado,

    logout

};