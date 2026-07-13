/* somente cadastro
proximoPassoCadastro()

selecionarPerfil()

voltarAoInicioCadastro()

ajustarCamposEspecificos()

realizarCadastro()

validarCadastro()
DOMContentLoaded()

↓

proximoPassoCadastro()

↓

selecionarPerfil()

↓

ajustarCamposEspecificos()

↓

validarCadastro()

↓

obterDadosCadastro()

↓

enviarCadastro()

*/
// ==========================================================================
// CONFIGURAÇÕES
// ==========================================================================



let usoSelecionado = "individual";
// ==========================================================================
// 6. INTERFACE - CADASTRO
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

function proximoPassoCadastro(tipoUso) {

    usoSelecionado = tipoUso;

    esconder($("etapa-tipo-uso"));

    mostrar($("form-cadastro"));

    mostrarOuEsconderGrupoPerfil(
        tipoUso === "institutional"
    );

    selecionarPerfil("student");

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
    const email = $("cad-email").value.trim();

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(email)) {

        throw new Error(
            "Informe um e-mail válido."
        );

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
            age = parseInt(campoIdade.value, 10);
           

        }

    }

    // ---------------------------------------------------------
    // Instituição
    // ---------------------------------------------------------

    if (

    role === "teacher" &&

    !institution 

) {

    throw new Error(

        "Informe a instituição."

    );

}

        return {

            name:
                $("cad-nome").value.trim(),

            email:
                $("cad-email").value.trim().toLowerCase(),

            password:
                $("cad-senha").value.trim(),

            role,

            use_type: usoSelecionado,

            age,

            institution

        };

}
document.addEventListener("DOMContentLoaded", () => {

    $("cadastro-perfil")?.addEventListener(

        "change",

        () => {

            selecionarPerfil(

                $("cadastro-perfil").value

            );

        }

    );

});


