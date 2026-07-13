/* localstorage/ jwt/usuário
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

function obterUsuario() {

    const usuario = localStorage.getItem("usuario");

    return usuario
        ? JSON.parse(usuario)
        : null;

}


function limparSessao() {

    localStorage.removeItem("usuario");

    API.removeToken();

}