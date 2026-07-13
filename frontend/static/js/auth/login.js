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

    formLogin.addEventListener("submit", login);

}



// ==========================================================================
// Realiza o login
// ==========================================================================


const dadosLogin = obterDadosLogin();

const erro = validarFormularioLogin(dadosLogin);

if (erro) {

    mostrarErro(
        "erro-login",
        erro
    );

    return;

}

async function login(evento) {

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

        usoSelecionado === "individual"

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

    const usuario = resposta.user;

    const token =

        resposta.access_token ||

        resposta.token;
    if (token) {
    session.salvarSessao(

        usuario,

        token

    );
    }
    redirecionarUsuario(usuario);

}
// ==========================================================================
// Fluxo exclusivo do aluno
// ==========================================================================

function iniciarFluxoAluno(usuario) {

    const etapaTurma = $("etapa-turma");

    // --------------------------------------------------------------
    // Caso exista a etapa de código da turma
    // --------------------------------------------------------------

    if (etapaTurma) {

        esconder($("form-login"));

        mostrar(etapaTurma);

        const primeiroNome =
            usuario?.name?.split(" ")[0] || "Aluno";

        const titulo =

            $("nome-aluno-boas-vindas");

        if (titulo) {

            titulo.textContent =
                `👋 Olá, ${primeiroNome}!`;

        }

        return;

    }

    // --------------------------------------------------------------
    // Fluxo padrão
    // --------------------------------------------------------------

    window.location.href =
        "/dashboard";

}





