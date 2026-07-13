/* 
auth-ui.js
funções visuais compartilhadas com auth
somente componentes visuais
mostrar()

esconder()

mostrarErro()

limparErro()

alterarBotao()

mostrarLoading()

abrirModal()

fecharModal()


*/
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
// CONTROLE DAS TELAS -- FLUXO VISUAL
// ==========================================================================

function irParaFormulario(tipoUso) {

    usoSelecionado = tipoUso;
   /* $("tipo_uso").value = tipoUso;*/

  /*  // ---------------- Login ----------------

    const campoPerfilLogin = $("campo-perfil");

    const tituloLogin = $("titulo-login");

    if (tituloLogin) {

        if (tipoUso === "institucional") {

            mostrar(campoPerfilLogin);

            tituloLogin.textContent =
                "Acesso Escolar 🏫";

        }

        else {

            esconder(campoPerfilLogin);

            tituloLogin.textContent =
                "Acesso Pessoal 🏠";

        }

            esconder($("etapa-tipo-uso"));
            mostrar($("form-cadastro"));

           

    }

    // ---------------- Cadastro ----------------

    const grupoPerfilCadastro =
        $("grupo-perfil");

    if (grupoPerfilCadastro) {

        if (tipoUso === "institucional") {

            mostrar(grupoPerfilCadastro);

        }

        else {

            esconder(grupoPerfilCadastro);

        }

        ajustarCamposEspecificos();

        esconder($("etapa-selecao"));

        mostrar($("form-register"));

    }


*/}
// ==========================================================================
// Voltar para seleção inicial
// ==========================================================================

function voltarParaSelecao() {

    esconder($("form-login"));
    esconder($("form-cadastro"));

    mostrar($("etapa-tipo-uso"));

    limparErro("erro-login");
    limparErro("erro-cadastro");

}

// ==========================================================================
// 5. INTERFACE - LOGIN
// ==========================================================================

function proximoPassoLogin(tipoUso) {

    usoSelecionado = tipoUso;

    esconder($("etapa-tipo-uso"));

    mostrar($("form-login"));

    const campoPerfil = $("campo-perfil");

    if (!campoPerfil) return;

    if (tipoUso === "institutional") {

        mostrar(campoPerfil);

    } else {

        esconder(campoPerfil);

    }

    selecionarPerfilLogin("student");

}


function selecionarPerfilLogin(perfil) {

    const tipoUsuario = $("tipo_usuario");

    if (tipoUsuario) {

        tipoUsuario.value = perfil;

    }
    /*$("login-perfil")?.value = perfil;*/
    atualizarEstadoFormulario(

        "form-login",

        perfil,

        "opcao-estudante",

        "opcao-professor"

    );

}

   

 

function voltarAoInicioLogin() {

    esconder($("form-login"));

    mostrar($("etapa-tipo-uso"));

    limparErro("erro-login");

}
// ==========================================================================
// 6. INTERFACE - CADASTRO
// ==========================================================================



function proximoPassoCadastro(tipoUso) {

    usoSelecionado = tipoUso;

    esconder($("etapa-tipo-uso"));
    mostrar($("form-cadastro"));

    mostrarOuEsconderGrupoPerfil(
        tipoUso === "institutional"
    );

    selecionarPerfil("student");

}

function selecionarPerfil(perfil) {

    const tipoUsuario = $("tipo_usuario");

    const cadastroPerfil = $("cadastro-perfil");

    if (tipoUsuario) {

        tipoUsuario.value = perfil;

    }

    if (cadastroPerfil) {

        cadastroPerfil.value = perfil;

    }

    atualizarEstadoFormulario(
        "form-cadastro",
        perfil,
        "opcao-estudante",
        "opcao-professor"
    );

    atualizarLabelNome(perfil);

    ajustarCamposEspecificos();

}

function voltarAoInicioCadastro() {

    esconder($("form-cadastro"));

    mostrar($("etapa-tipo-uso"));

    limparErro("erro-cadastro");

}

// ==========================================================================
// Helpers da Interface
// ==========================================================================
/*
function mostrarOuEsconderPerfil(exibir) {

    const grupoPerfil = $("grupo-perfil");

    if (!grupoPerfil) return;

    if (exibir) {

        mostrar(grupoPerfil);

    } else {

        esconder(grupoPerfil);

    }

}*/

function atualizarEstadoFormulario(

    formularioId,

    perfil,

    estudanteId,

    professorId

) {

    const formulario = $(formularioId);

    const estudante = $(estudanteId);

    const professor = $(professorId);

    if (!formulario) return;

    formulario.classList.remove(

        "estado-estudante",

        "estado-professor"

    );


    if (perfil === "student") {

        formulario.classList.add("estado-estudante");

    } else {

        formulario.classList.add("estado-professor");

    }
    estudante?.classList.remove("ativo-estudante");

    professor?.classList.remove("ativo-professor");

    if (perfil === "student") {

        estudante?.classList.add("ativo-estudante");

    }

    else {

        professor?.classList.add("ativo-professor");

    }

}
function atualizarLabelNome(perfil) {

    const label = $("label-nome");

    if (!label) return;

    label.textContent =

        perfil === "student"

            ? "Nome do Estudante"

            : "Nome do Professor / Gestor";

}



// ==========================================================================
// Tela de sucesso
// ==========================================================================
//
// Futuramente:
//
// • Enviar e-mail de confirmação.
// • Fazer login automático.
// • Redirecionar para onboarding.
// • Solicitar confirmação de e-mail.
//
// ==========================================================================

function continuarParaLogin() {

    window.location.href = "/login";

}









// ==========================================================================
// Exibe ou oculta o seletor de perfil do cadastro
// ==========================================================================

function mostrarOuEsconderGrupoPerfil(exibir) {

    const grupo = $("grupo-perfil");

    if (!grupo) return;

    if (exibir) {

        mostrar(grupo);

    }

    else {

        esconder(grupo);

    }

}

// ==========================================================================
// Ajusta campos específicos do cadastro
// ==========================================================================

function ajustarCamposEspecificos() {

    const grupoIdade =
        $("grupo-idade");

    const grupoInstituicao =
        $("grupo-instituicao");

    // Não está na tela de cadastro

    if (!grupoIdade && !grupoInstituicao) {

        return;

    }

    // -------------------------------------------------
    // Uso pessoal
    // -------------------------------------------------

    if (usoSelecionado === "individual") {

        mostrar(grupoIdade);

        esconder(grupoInstituicao);

        return;

    }

    // -------------------------------------------------
    // Uso institucional
    // -------------------------------------------------

    const perfil = $("cadastro-perfil")?.value;

    if (perfil === "student") {

        mostrar(grupoIdade);

        esconder(grupoInstituicao);

    }

    else {

        esconder(grupoIdade);

        mostrar(grupoInstituicao);

    }

}





// ==========================================================================
// Conversão do perfil do HTML para o Backend
// ==========================================================================
//
// HTML:
//
// estudante
// professor
//
// Backend:
//
// student
// teacher
// admin
//
// ==========================================================================

function converterPerfil(perfil) {

    switch (perfil) {

        case "estudante":
        case "aluno":

            return "student";

        case "professor":
        case "gestor":

            return "teacher";

        case "admin":

            return "admin";

        default:

            return "student";

    }}

