/*Tela de login

-fluxo de login
login()
validarFormularioLogin()
enviarLogin()
lembrarUsuario()

*/
// ==========================================================================
// 2. PROCESSAMENTO DO FORMULÁRIO DE LOGIN
// ==========================================================================

const formLogin = $("form-autenticacao");

if (formLogin) {

    formLogin.addEventListener("submit", realizarLogin);

}



// ==========================================================================
// Realiza o login
// ==========================================================================

async function realizarLogin(evento) {

    evento.preventDefault();

    limparErro("erro-login");

    const btnEntrar = $("btn-entrar");

    alterarBotao(
        btnEntrar,
        "Entrando...",
        true
    );

    try {

        const dadosLogin = obterDadosLogin();

        const resposta = await API.post(

            "/login",

            dadosLogin

        );

        processarLogin(resposta);

    }

    catch (erro) {

        console.error("Erro no login:", erro);

        mostrarErro(
            "erro-login",
            erro.message
        );

    }

    finally {

        alterarBotao(
            btnEntrar,
            "Entrar",
            false
        );

    }

}



// ==========================================================================
// Obtém os dados digitados pelo usuário
// ==========================================================================

function obterDadosLogin() {

    const role =

        usoSelecionado === "pessoal"

            ? "student"

            : converterPerfil(

                $("login-perfil")?.value ||
                $("tipo_usuario")?.value
            );

    return {

        email: $("login-email").value.trim().toLowerCase(),

        password: $("login-senha").value.trim(),

        role

    };

}



// ==========================================================================
// Processa a resposta da API
// ==========================================================================

function processarLogin(resposta) {

    const usuario =

        resposta.user ||

        resposta.usuario ||

        resposta;

    const token =

        resposta.access_token ||

        resposta.token;
    if (token) {
    salvarSessao(

        usuario,

        token

    );
    }
    redirecionarUsuario(usuario);

}



