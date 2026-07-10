// ==========================================================================
// AUTH.JS
// Controle de autenticação da Plataforma cultivando o saber
//
// Responsabilidades:
//
// • Fluxo das telas de Login/Cadastro
// • Comunicação com a API Flask
// • Armazenamento do JWT
// • Controle visual da interface
//
// Backend:
// Python + Flask
// JWT Authentication
// ==========================================================================



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
// SESSÃO DO USUÁRIO
// ==========================================================================

function salvarSessao(usuario, token) {

    if (token) {

        localStorage.setItem(
            "token_usuario",
            token
        );

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

function obterToken() {

    return localStorage.getItem("token_usuario");

}

function limparSessao() {

    localStorage.removeItem("usuario");

    localStorage.removeItem("token_usuario");

}



// ==========================================================================
// CHAMADAS À API
// ==========================================================================

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

}



// ==========================================================================
// CONTROLE DAS TELAS
// ==========================================================================

function irParaFormulario(tipoUso) {

    usoSelecionado = tipoUso;

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

        esconder($("etapa-selecao"));

        mostrar($("form-login"));

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

    if (perfil === "aluno") {

        mostrar(grupoIdade);

        esconder(grupoInstituicao);

    }

    else {

        esconder(grupoIdade);

        mostrar(grupoInstituicao);

    }

}
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

        const resposta = await enviarRequisicao(

            "/login",

            "POST",

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

        email: $("login-email").value.trim(),

        password: $("login-senha").value,

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

    salvarSessao(

        usuario,

        token

    );

    redirecionarUsuario(usuario);

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
// 3. PROCESSAMENTO DO FORMULÁRIO DE CADASTRO (REGISTER)
// ==========================================================================

const formCadastro = $("form-cadastro");

if (formCadastro) {

    formCadastro.addEventListener(
        "submit",
        realizarCadastro
    );

}



// ==========================================================================
// Realiza o cadastro
// ==========================================================================

async function realizarCadastro(evento) {

    evento.preventDefault();

    limparErro("erro-cadastro");

    const btnCadastrar = $("btn-cadastrar");

    alterarBotao(

        btnCadastrar,

        "Cadastrando...",

        true

    );

    try {

        validarCadastro();

        const dadosCadastro =
            obterDadosCadastro();

        const resposta =
            await enviarRequisicao(

                "/cadastro",

                "POST",

                dadosCadastro

            );

        processarCadastro(resposta);

    }

    catch (erro) {

        console.error("Erro no cadastro:", erro);

        mostrarErro(

            "erro-cadastro",

            erro.message

        );

    }

    finally {

        alterarBotao(

            btnCadastrar,

            "Cadastrar",

            false

        );

    }

}



// ==========================================================================
// Validação dos campos
// ==========================================================================

function validarCadastro() {

    const senha =
        $("cad-senha").value;

    const confirmar =
        $("cad-confirma").value;

    if (senha !== confirmar) {

        throw new Error(
            "As senhas informadas não coincidem."
        );

    }

}



// ==========================================================================
// Obtém os dados do formulário
// ==========================================================================

function obterDadosCadastro() {

    let role = "student";

    let age = null;

    let institution = null;

    // ---------------------------------------------------------
    // Perfil escolhido
    // ---------------------------------------------------------

    if (usoSelecionado === "institucional") {

        role = converterPerfil(

            $("cadastro-perfil")?.value

        );

    }

    // ---------------------------------------------------------
    // Idade
    // ---------------------------------------------------------

    if (role === "student") {

        const campoIdade =
            $("cad-idade");

        if (

            campoIdade &&
            campoIdade.value

        ) {

            age =
                parseInt(campoIdade.value);

        }

    }

    // ---------------------------------------------------------
    // Instituição
    // ---------------------------------------------------------

    if (role === "teacher") {

        institution =
            $("cad-instituicao")?.value.trim();

    }

    return {

        name:
            $("cad-nome").value.trim(),

        email:
            $("cad-email").value.trim(),

        password:
            $("cad-senha").value,

        role,

        age,

        institution

    };

}



// ==========================================================================
// Processa a resposta da API
// ==========================================================================

function processarCadastro(resposta) {

    const mensagem =

        resposta.message ||

        "Conta criada com sucesso!";

    const textoSucesso =
        $("texto-sucesso");

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



// ==========================================================================
// 5. INTERFACE - LOGIN
// ==========================================================================

function proximoPassoLogin(tipoUso) {

    usoSelecionado = tipoUso;

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

    esconder($("etapa-tipo-uso"));

    mostrar($("form-cadastro"));

    const mostrarPerfil =
        tipoUso === "institucional";

    mostrarOuEsconderPerfil(
        mostrarPerfil
    );

    selecionarPerfil("estudante");

}



function selecionarPerfil(perfil) {

    $("tipo_usuario").value = perfil;

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

            selecionarPerfil("estudante");

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
        // TODO
        // Caso exista um JWT válido:
        //
        // • verificar expiração;
        // • consultar usuário na API;
        // • redirecionar automaticamente.
        // --------------------------------------------------------------

    }

);