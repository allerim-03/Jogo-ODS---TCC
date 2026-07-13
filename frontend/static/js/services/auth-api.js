/* 
 auth-api.js service 
Login, cadastro, refresh token



• processarCadastro()

• processarLogin()

• fazerLogin()

• fazerCadastro()

• fazerLogout()

• verificarSessao()

• refreshToken() (futuro)

*/






// ==========================================================================
// CHAMADAS À API
// ==========================================================================


// ==========================================================================
// Processa a resposta da API
// ==========================================================================

function processarCadastro(resposta) {

    const mensagem =

        resposta.message ||

        "Conta criada com sucesso!";

    const textoSucesso =
        $("texto-sucesso");
    if (resposta.token) {

        processarLogin(resposta);

        return;

    }

    if (textoSucesso) {

        textoSucesso.textContent =
            mensagem;

    }

    esconder(

        $("form-cadastro")

    );

    mostrar(

        $("etapa-sucesso")

    );

    const formCadastro = $("form-cadastro");

    formCadastro?.reset();

    }


// ==========================================================================
// Inicialização
// ==========================================================================

document.addEventListener(

    "DOMContentLoaded",

     async () => {

        // --------------------------------------------------------------
        // Configuração inicial das telas
        // --------------------------------------------------------------

        if ($("form-login")) {

            selecionarPerfilLogin("estudante");

        }

        if ($("form-cadastro")) {

            selecionarPerfil("student");

        }

        // --------------------------------------------------------------
        // Atualiza os campos quando o perfil muda
        // --------------------------------------------------------------

        $("cadastro-perfil")
            ?.addEventListener(

                "change",

                ajustarCamposEspecificos

            );

        // --------------------------------------------------------------
        // 
        // Caso exista um JWT válido:
        //
        // • verificar expiração;
        // • consultar usuário na API;
        // • redirecionar automaticamente.
        // --------------------------------------------------------------
        // Verifica se existe um token salvo

        if (API.getToken()) {

            try {

                const usuario = await API.get("/me");

                redirecionarUsuario(usuario);

            }

            catch {

                API.removeToken();

            }

        }


    }

);

