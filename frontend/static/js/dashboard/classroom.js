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
