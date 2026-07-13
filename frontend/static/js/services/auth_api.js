/* 
auth service 
Login, cadastro, refresh token */
// ==========================================================================
// CONFIGURAÇÕES
// ==========================================================================

const API_BASE_URL = "http://localhost:5000/api";

let usoSelecionado = "pessoal";


// ==========================================================================
// HELPERS
// ==========================================================================

function $(id) {

    return document.getElementById(id);

}

function mostrar(elemento) {

    elemento?.classList.remove("oculto");

}

function esconder(elemento) {

    elemento?.classList.add("oculto");

}

function mostrarErro(id, mensagem) {

    const erro = $(id);

    if (!erro) return;

    erro.textContent = mensagem;

    mostrar(erro);

}

function limparErro(id) {

    esconder($(id));

}

function alterarBotao(botao, texto, desabilitado = false) {

    if (!botao) return;

    botao.textContent = texto;

    botao.disabled = desabilitado;

}


// ==========================================================================
// CHAMADAS À API
// ==========================================================================
/*function limparSessao() {

    localStorage.removeItem("usuario");

    localStorage.removeItem("token_usuario");

}
async function enviarRequisicao(endpoint, metodo, dados) {

    const resposta = await fetch(

        `${API_BASE_URL}${endpoint}`,

        {

            method: metodo,

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(dados)

        }

    );

    const json = await resposta.json();

    if (!resposta.ok) {

        throw new Error(

            json.message ||
            "Erro ao comunicar com o servidor."

        );

    }

    return json;

}*/


// ==========================================================================
// Processa a resposta da API
// ==========================================================================

function processarCadastro(resposta) {

    const mensagem =

        resposta.message ||

        "Conta criada com sucesso!";

    const textoSucesso =
        $("texto-sucesso");
    if (resposta.token || resposta.access_token) {

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

    formCadastro.reset();

}


// ==========================================================================
// Inicialização
// ==========================================================================

document.addEventListener(

    "DOMContentLoaded",

    () => {

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

                const usuario = await API.get("/auth/me");

                redirecionarUsuario(usuario);

            }

            catch {

                API.removeToken();

            }

        }


    }

);

