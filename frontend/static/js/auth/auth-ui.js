/* funções visuais compartilhadas com auth
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
// CONTROLE DAS TELAS
// ==========================================================================

function irParaFormulario(tipoUso) {

    usoSelecionado = tipoUso;
    $("tipo_uso").value = tipoUso;

    // ---------------- Login ----------------

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

}



// ==========================================================================
// Voltar para seleção inicial
// ==========================================================================

function voltarParaSelecao() {

    esconder($("form-login"));

    esconder($("form-register"));

    mostrar($("etapa-selecao"));

    limparErro("erro-login");

    limparErro("erro-cadastro");

}



// ==========================================================================
// 5. INTERFACE - LOGIN
// ==========================================================================

function proximoPassoLogin(tipoUso) {

    usoSelecionado = tipoUso;
    $("tipo_uso").value = tipoUso;

    esconder($("etapa-tipo-uso"));

    mostrar($("form-login"));

    const mostrarPerfil =
        tipoUso === "institucional";

    mostrarOuEsconderPerfil(
        mostrarPerfil
    );

    selecionarPerfilLogin("estudante");

}



function selecionarPerfilLogin(perfil) {

    $("tipo_usuario").value = perfil;

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
    $("tipo_uso").value = tipoUso;

    esconder($("etapa-tipo-uso"));

    mostrar($("form-cadastro"));

    const mostrarPerfil =
        tipoUso === "institucional";

    mostrarOuEsconderPerfil(
        mostrarPerfil
    );

    selecionarPerfil("student");

}


function selecionarPerfil(perfil) {

    $("tipo_usuario").value = perfil;

    $("cadastro-perfil").value = perfil;

    atualizarEstadoFormulario(
        "form-cadastro",
        perfil,
        "opcao-estudante",
        "opcao-professor"
    );

    atualizarLabelNome(perfil);

    ajustarCamposEspecificos();
}

/*function selecionarPerfil(perfil) {

   usoSelecionado = tipoUso;

    $("#tipo_uso").value = tipoUso;

    atualizarEstadoFormulario(

        "form-cadastro",

        perfil,

        "opcao-estudante",

        "opcao-professor"

    );

    atualizarLabelNome(perfil);

    ajustarCamposEspecificos();

}*/



function voltarAoInicioCadastro() {

    esconder($("form-cadastro"));

    mostrar($("etapa-tipo-uso"));

    limparErro("erro-cadastro");

}


// ==========================================================================
// Helpers da Interface
// ==========================================================================

function mostrarOuEsconderPerfil(mostrarSeletores) {

    if (mostrarSeletores) {

        mostrar($("container-seletores-finais"));

        mostrar($("rotulo-perfil-dinamico"));

    }

    else {

        esconder($("container-seletores-finais"));

        esconder($("rotulo-perfil-dinamico"));

    }

}



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

    formulario.classList.add(

        perfil === "estudante"

            ? "estado-estudante"

            : "estado-professor"

    );

    estudante?.classList.remove("ativo-estudante");

    professor?.classList.remove("ativo-professor");

    if (perfil === "estudante") {

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

        perfil === "estudante"

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

    if (usoSelecionado === "pessoal") {

        mostrar(grupoIdade);

        esconder(grupoInstituicao);

        return;

    }

    // -------------------------------------------------
    // Uso institucional
    // -------------------------------------------------

    const perfil = $("cadastro-perfil")?.value;

    if (perfil === "estudante") {

        mostrar(grupoIdade);

        esconder(grupoInstituicao);

    }

    else {

        esconder(grupoIdade);

        mostrar(grupoInstituicao);

    }

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

            usuario.name
                ?.split(" ")[0]

            ||

            "Aluno";

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

    }

}
// ==========================================================================
// 4. FUNÇÕES DO CÓDIGO DA TURMA
// (Fluxo exclusivo do aluno)
// ==========================================================================

function validarTurma() {

    const codigo = $("codigo-turma")?.value.trim();

    limparErro("erro-turma");

    if (!codigo || codigo.length !== 6) {

        mostrarErro(
            "erro-turma",
            "O código deve conter exatamente 6 caracteres."
        );

        return;

    }

    // ----------------------------------------------------------------------
    // TODO
    // Validar o código da turma na API.
    //
    // POST /api/classes/join
    //
    // Após implementar:
    //  • validar existência da turma;
    //  • matricular aluno;
    //  • retornar mensagem de sucesso/erro.


    /*
    async function validarTurma() {

    const codigo = $("codigo-turma").value.trim();

    limparErro("erro-turma");

    if (!codigo || codigo.length !== 6) {

        mostrarErro(
            "erro-turma",
            "O código deve conter exatamente 6 caracteres."
        );

        return;

    }

    try {

        await API.post("/classes/join", {

            code: codigo

        });

        window.location.href = "/dashboard";

    }

    catch (erro) {

        mostrarErro(
            "erro-turma",
            erro.message
        );

    }

}
    */
    // ----------------------------------------------------------------------

    alert("Turma conectada com sucesso!");

    window.location.href = "/dashboard";

}



function pularTurma() {

    // ----------------------------------------------------------------------
    // TODO
    // Permitir posteriormente exigir obrigatoriamente
    // a vinculação a uma turma.
    // ----------------------------------------------------------------------

    window.location.href = "/dashboard";

}

