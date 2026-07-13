/* somente cadastro
proximoPassoCadastro()

selecionarPerfil()

voltarAoInicioCadastro()

ajustarCamposEspecificos()

enviarCadastro()

validarCadastro()

*/
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

        const resposta = await API.post(
            "/register",
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
    if (!$("cad-nome").value.trim()) {

    throw new Error("Informe seu nome.");

    }

    if (!$("cad-email").value.trim()) {

        throw new Error("Informe um e-mail.");

    }

    if ($("cad-senha").value.length < 6) {

        throw new Error(
            "A senha deve possuir pelo menos 6 caracteres."
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
            $("cad-email").value.trim().toLowerCase(),

        password:
            $("cad-senha").value.trim(),

        role,

        age,

        institution

    };

}



