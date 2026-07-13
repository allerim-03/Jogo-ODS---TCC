
// ==========================================================================
// Controle do fluxo de autenticação
// ==========================================================================

let usoSelecionado = "pessoal";


// ==========================================================================
// 1. TRANSIÇÃO ENTRE TELAS
// ==========================================================================

function irParaFormulario(tipoUso) {

    usoSelecionado = tipoUso;

    // ---------- Login ----------
    const campoPerfilLogin =
        document.getElementById("campo-perfil");

    const tituloLogin =
        document.getElementById("titulo-login");

    if (tituloLogin) {

        if (tipoUso === "institucional") {

            campoPerfilLogin?.classList.remove("oculto");

            tituloLogin.textContent =
                "Acesso Escolar 🏫";

        } else {

            campoPerfilLogin?.classList.add("oculto");

            tituloLogin.textContent =
                "Acesso Pessoal 🏠";

        }

        document
            .getElementById("etapa-selecao")
            ?.classList.add("oculto");

        document
            .getElementById("form-login")
            ?.classList.remove("oculto");

    }

    // ---------- Cadastro ----------
    const grupoPerfilCadastro =
        document.getElementById("grupo-perfil");

    if (grupoPerfilCadastro) {

        if (tipoUso === "institucional") {

            grupoPerfilCadastro.classList.remove("oculto");

        } else {

            grupoPerfilCadastro.classList.add("oculto");

        }

        ajustarCamposEspecificos();

        document
            .getElementById("etapa-selecao")
            ?.classList.add("oculto");

        document
            .getElementById("form-register")
            ?.classList.remove("oculto");

    }

}


// ==========================================================================
// Voltar para a primeira etapa
// ==========================================================================

function voltarParaSelecao() {

    document
        .getElementById("form-login")
        ?.classList.add("oculto");

    document
        .getElementById("form-register")
        ?.classList.add("oculto");

    document
        .getElementById("etapa-selecao")
        ?.classList.remove("oculto");

    document
        .getElementById("erro-login")
        ?.classList.add("oculto");

    document
        .getElementById("erro-cadastro")
        ?.classList.add("oculto");

}


// ==========================================================================
// Ajusta os campos específicos do cadastro
// ==========================================================================

function ajustarCamposEspecificos() {

    const grupoIdade =
        document.getElementById("grupo-idade");

    const grupoInstituicao =
        document.getElementById("grupo-instituicao");

    // Não está na página de cadastro
    if (!grupoIdade && !grupoInstituicao) {

        return;

    }

    // Uso pessoal
    if (usoSelecionado === "pessoal") {

        grupoIdade?.classList.remove("oculto");

        grupoInstituicao?.classList.add("oculto");

        return;

    }

    // Uso institucional
    const perfil =
        document.getElementById("cadastro-perfil")?.value;
    //aluno
    if (perfil === "student") {

        grupoIdade?.classList.remove("oculto");

        grupoInstituicao?.classList.add("oculto");
        //teacher
    } else if(perfil == 'teacher') {

        grupoIdade?.classList.add("oculto");

        grupoInstituicao?.classList.remove("oculto");

    }
        // admin (caso exista futuramente)
    else {

        grupoIdade?.classList.add("oculto");

        grupoInstituicao?.classList.remove("oculto");

    }

}
         
/* ==========================================================================
   2. PROCESSAMENTO DO FORMULÁRIO DE LOGIN
   ========================================================================== */

const formLogin = document.getElementById("form-autenticacao");

if (formLogin) {

    formLogin.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email =
            document.getElementById("login-email").value;

        const password =
            document.getElementById("login-senha").value;

        const erroDiv =
            document.getElementById("erro-login");

        const btnEntrar =
            document.getElementById("btn-entrar");

        // Uso pessoal = student
        // Uso institucional = perfil escolhido
        const role =
            usoSelecionado === "pessoal"
                ? "student"
                : document.getElementById("login-perfil").value;

        erroDiv.classList.add("oculto");

        btnEntrar.textContent = "Entrando...";

        btnEntrar.disabled = true;

        try {

            const resposta = await fetch("/api/login"//fetch("http://localhost:5000/api/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password,
                        role
                    })

                }
            );


/*
            // Compatibilidade com diferentes formatos da API
            const usuario =
                dados.user ||
                dados.usuario ||
                dados;

            const papel =
                usuario.role ||
                usuario.perfil ||
                usuario.tipo;

            const token =
                dados.access_token ||
                dados.token;

            // Salva sessão local
            if (token) {

                localStorage.setItem(
                    "token_usuario",
                    token
                );

            }

           */
            const dados = await resposta.json();

            if (!resposta.ok) {

                throw new Error(
                    dados.message ||
                    "Erro ao efetuar login."
                );

            }

            console.log("Resposta do servidor:", dados);

            const usuario = dados.user;

            const token = dados.access_token;

            // Salva o token JWT
            localStorage.setItem(
                "token_usuario",
                token
            );

            // Salva os dados do usuário
            localStorage.setItem(
                "usuario",
                JSON.stringify(usuario)
            );
            localStorage.setItem(
                "current_user",
                JSON.stringify(usuario)
            );

            // Fluxo do estudante
            if (usuario.role === "student") {

                const etapaTurma =
                    document.getElementById("etapa-turma");

                if (etapaTurma) {

                    document
                        .getElementById("form-login")
                        .classList.add("oculto");

                    etapaTurma.classList.remove("oculto");

                    const primeiroNome =
                        usuario.name.split(" ")[0];

                    document.getElementById(
                        "nome-aluno-boas-vindas"
                    ).textContent =
                        `👋 Olá, ${primeiroNome}!`;

                }
                else {

                    window.location.href = "/dashboard";

                }

            }

            // Professor
            else if (usuario.role === "teacher") {

                window.location.href =
                    "/teacher/dashboard";

            }

            // Admin
            else if (usuario.role === "admin") {

                window.location.href =
                    "/admin/dashboard";

            }

            else {

                throw new Error(
                    "Perfil de usuário inválido."
                );

            }

        }

        catch (erro) {

            console.error(erro);

            erroDiv.textContent =
                erro.message;

            erroDiv.classList.remove("oculto");

        }

        finally {

            btnEntrar.textContent =
                "Entrar";

            btnEntrar.disabled = false;

        }

    });

}
/* ==========================================================================
   3. PROCESSAMENTO DO FORMULÁRIO DE CADASTRO (REGISTER)
   ========================================================================== */

const formCadastro = document.getElementById("form-cadastro");

if (formCadastro) {

    formCadastro.addEventListener("submit", async (e) => {

        e.preventDefault();

        const nome =
            document.getElementById("cad-nome").value;

        const email =
            document.getElementById("cad-email").value;

        const senha =
            document.getElementById("cad-senha").value;

        const confirmaSenha =
            document.getElementById("cad-confirma").value;

        const erroDiv =
            document.getElementById("erro-cadastro");

        const btnCadastrar =
            document.getElementById("btn-cadastrar");

        erroDiv.classList.add("oculto");

        // Validação das senhas
        if (senha !== confirmaSenha) {

            erroDiv.textContent =
                "As senhas informadas não coincidem.";

            erroDiv.classList.remove("oculto");

            return;

        }

        let perfilFinal = "student";
        let idade = null;
        let instituicao = null;

        // Perfil escolhido no uso institucional
        if (usoSelecionado === "institucional") {

            const perfilSelecionado =
                document.getElementById("cadastro-perfil").value;

            if (perfilSelecionado === "aluno") {

                perfilFinal = "student";

            }

            else if (perfilSelecionado === "teacher") {

                perfilFinal = "teacher";

            }

        }

        // Dados específicos
        if (
            perfilFinal === "teacher" ||
            perfilFinal === "student"
        ) {

            const campoIdade =
                document.getElementById("cad-idade");

            if (campoIdade && campoIdade.value) {

                idade =
                    parseInt(campoIdade.value);

            }

        }

        else if (perfilFinal === "teacher") {

            const campoInstituicao =
                document.getElementById("cad-instituicao");

            if (campoInstituicao) {

                instituicao =
                    campoInstituicao.value;

            }

        }

        btnCadastrar.textContent =
            "Processando...";

        btnCadastrar.disabled = true;

        try {

            const resposta = await fetch(
                "http://localhost:5000/api/cadastro",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({

                        name: nome,
                        email,
                        password: senha,
                        role: perfilFinal,
                        age: idade,
                        institution: instituicao

                    })
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {

                throw new Error(
                    dados.message ||
                    dados.error ||
                    "Erro ao realizar o cadastro."
                );

            }
        
            document.getElementById("texto-sucesso").textContent =
                dados.message ||
                "Sua conta foi criada com sucesso!";

            // Esconde formulário
            const telaCadastro =
                document.getElementById("form-register") ||
                document.getElementById("etapa-formulario");

            if (telaCadastro) {

                telaCadastro.classList.add("oculto");

            }

            // Mostra tela de sucesso
            const telaSucesso =
                document.getElementById("etapa-sucesso");

            if (telaSucesso) {

                telaSucesso.classList.remove("oculto");

            }

            formCadastro.reset();

        }

        catch (erro) {

            console.error(erro);

            erroDiv.textContent =
                erro.message;

            erroDiv.classList.remove("oculto");

        }

        finally {

            btnCadastrar.textContent =
                "Cadastrar";

            btnCadastrar.disabled = false;

        }

    });

}

/* ==========================================================================
   4. FUNÇÕES DO CÓDIGO DA TURMA
   (Fluxo exclusivo do aluno)
   ========================================================================== */

function validarTurma() {

    const codigo =
        document.getElementById("codigo-turma").value.trim();

    const erroTurma =
        document.getElementById("erro-turma");

    erroTurma.classList.add("oculto");

    if (codigo.length !== 6) {

        erroTurma.textContent =
            "O código deve conter exatamente 6 caracteres.";

        erroTurma.classList.remove("oculto");

        return;

    }

    // Futuramente será feita uma chamada à API
    // para validar o código da turma.

    alert("Turma conectada com sucesso! Bem-vindo à jornada!");

    window.location.href = "/dashboard";

}

function pularTurma() {

    window.location.href = "/dashboard";

}
/* ==========================================================================
   5. FUNÇÕES DE INTERFACE (LOGIN E CADASTRO)
   ========================================================================== */

/* ---------- LOGIN ---------- */

function proximoPassoLogin(escolha) {

    const painel =
        document.getElementById("etapa-tipo-uso");

    const formulario =
        document.getElementById("form-login");

    const seletores =
        document.getElementById("container-seletores-finais");

    const rotulo =
        document.getElementById("rotulo-perfil-dinamico");

    painel.classList.add("oculto");
    formulario.classList.remove("oculto");

    if (escolha === "pessoal") {

        seletores.classList.add("oculto");
        rotulo.classList.add("oculto");

    } else {

        seletores.classList.remove("oculto");
        rotulo.classList.remove("oculto");

    }

    selecionarPerfilLogin("student");

}

function selecionarPerfilLogin(perfil) {

    const form =
        document.getElementById("form-login");

    const input =
        document.getElementById("tipo_usuario");

    const estudante =
        document.getElementById("opcao-estudante");

    const professor =
        document.getElementById("opcao-professor");

    const botao =
        document.getElementById("btn-entrar");

    input.value = perfil;

    if (perfil === "student") {

        form.classList.remove("estado-professor");
        form.classList.add("estado-estudante");

        estudante.className =
            "quadrinho-opcao ativo-estudante";

        professor.className =
            "quadrinho-opcao";

    } else {

        form.classList.remove("estado-estudante");
        form.classList.add("estado-professor");

        estudante.className =
            "quadrinho-opcao";

        professor.className =
            "quadrinho-opcao ativo-professor";

    }

    botao.textContent = "Entrar";

}

function voltarAoInicioLogin() {

    document
        .getElementById("form-login")
        .classList.add("oculto");

    document
        .getElementById("etapa-tipo-uso")
        .classList.remove("oculto");

}


/* ---------- CADASTRO ---------- */

function proximoPassoCadastro(escolha) {

    const painel =
        document.getElementById("etapa-tipo-uso");

    const formulario =
        document.getElementById("form-cadastro");

    const seletores =
        document.getElementById("container-seletores-finais");

    const rotulo =
        document.getElementById("rotulo-perfil-dinamico");

    painel.classList.add("oculto");
    formulario.classList.remove("oculto");

    if (escolha === "pessoal") {

        seletores.classList.add("oculto");
        rotulo.classList.add("oculto");

    } else {

        seletores.classList.remove("oculto");
        rotulo.classList.remove("oculto");

    }

    selecionarPerfil("student");

}

function selecionarPerfil(perfil) {

    const form =
        document.getElementById("form-cadastro");

    const input =
        document.getElementById("tipo_usuario");

    const estudante =
        document.getElementById("opcao-estudante");

    const professor =
        document.getElementById("opcao-professor");

    const labelNome =
        document.getElementById("label-nome");

    const botao =
        document.getElementById("btn-registrar");

    input.value = perfil;

    if (perfil === "estudante") {

        form.classList.remove("estado-professor");
        form.classList.add("estado-estudante");

        estudante.className =
            "quadrinho-opcao ativo-estudante";

        professor.className =
            "quadrinho-opcao";

        if (labelNome)
            labelNome.textContent =
                "Nome do Aluno";

    } else {

        form.classList.remove("estado-estudante");
        form.classList.add("estado-professor");

        estudante.className =
            "quadrinho-opcao";

        professor.className =
            "quadrinho-opcao ativo-professor";

        if (labelNome)
            labelNome.textContent =
                "Nome do Professor / Gestor";

    }

    botao.textContent = "Criar Conta";

}

function voltarAoInicioCadastro() {

    document
        .getElementById("form-cadastro")
        .classList.add("oculto");

    document
        .getElementById("etapa-tipo-uso")
        .classList.remove("oculto");

}


/* ---------- Inicialização ---------- */

document.addEventListener("DOMContentLoaded", () => {

    if (document.getElementById("form-login")) {

        selecionarPerfilLogin("student");

    }

    if (document.getElementById("form-cadastro")) {

        selecionarPerfil("student");

    }

});
/* arquivo antigo e duplicado talvez usar para basear e fazer pequenas alterações futuras
// Variável global de controle de fluxo dentro do módulo de autenticação
let usoSelecionado = 'pessoal';
/* ==========================================================================
   1. FUNÇÕES DE TRANSIÇÃO DE TELAS (Otimizadas para ambos os formulários)
   ========================================================================== *

function irParaFormulario(tipoUso) {
    usoSelecionado = tipoUso;
    
    // Elementos da tela de Login (se existirem na página atual)
    const campoPerfilLogin = document.getElementById('campo-perfil');
    const tituloLogin = document.getElementById('titulo-login');
    
    // Elementos da tela de Cadastro/Registro (se existirem na página atual)
    const grupoPerfilCadastro = document.getElementById('grupo-perfil');

    // Se estiver na tela de Login
    if (tituloLogin) {
        if (tipoUso === 'institucional') {
            campoPerfilLogin.classList.remove('oculto');
            tituloLogin.textContent = "Acesso Escolar 🏫";
        } else {
            campoPerfilLogin.classList.add('oculto');
            tituloLogin.textContent = "Acesso Pessoal 🏠";
        }
    }

    // Se estiver na tela de Cadastro
    if (grupoPerfilCadastro) {
        if (tipoUso === 'institucional') {
            grupoPerfilCadastro.classList.remove('oculto');
        } else {
            grupoPerfilCadastro.classList.add('oculto');
        }
        // Ajusta os campos específicos de Aluno (idade) ou Professor (instituição)
        ajustarCamposEspecificos();
    }

    // Transição universal: esconde a caixinha de seleção e mostra a do formulário
    document.getElementById('etapa-selecao').classList.add('oculto');
    document.getElementById('etapa-formulario').classList.remove('oculto');
}

function voltarParaSelecao() {
    document.getElementById('etapa-formulario').classList.add('oculto');
    document.getElementById('etapa-selecao').classList.remove('oculto');
    
    // Limpa mensagens de erro ocultando-as
    const erroLogin = document.getElementById('erro-login');
    const erroCadastro = document.getElementById('erro-cadastro');
    if (erroLogin) erroLogin.classList.add('oculto');
    if (erroCadastro) erroCadastro.classList.add('oculto');
}

function ajustarCamposEspecificos() {
    const grupoIdade = document.getElementById('grupo-idade');
    const grupoInstituicao = document.getElementById('grupo-institicao');
    
    if (!grupoIdade || !grupoInstituicao) return; // Segurança caso não esteja na tela de cadastro

    // Se for uso pessoal, age por padrão como Aluno (pede idade), ocultando escola
    if (usoSelecionado === 'pessoal') {
        grupoIdade.classList.remove('oculto');
        grupoInstituicao.classList.add('oculto');
        return;
    }

    // Se for escolar, analisa o valor selecionado no select de perfil
    const perfil = document.getElementById('cadastro-perfil').value;
    if (perfil === 'aluno') {
        grupoIdade.classList.remove('oculto');
        grupoInstituicao.classList.add('oculto');
    } else {
        grupoIdade.classList.add('oculto');
        grupoInstituicao.classList.remove('oculto');
    }
}




/*1. FUNÇÕES DE TRANSIÇÃO DE TELAS

function irParaFormulario(tipoUso) {
    usoSelecionado = tipoUso;
    
    const campoPerfilLogin = document.getElementById('campo-perfil');
    const tituloLogin = document.getElementById('titulo-login');
    const grupoPerfilCadastro = document.getElementById('grupo-perfil');

    // Se estiver na página de Login
    if (tituloLogin) {
        if (tipoUso === 'institucional') {
            if (campoPerfilLogin) campoPerfilLogin.classList.remove('oculto');
            tituloLogin.textContent = "Acesso Escolar 🏫";
        } else {
            if (campoPerfilLogin) campoPerfilLogin.classList.add('oculto');
            tituloLogin.textContent = "Acesso Pessoal 🏠";
        }
        document.getElementById('etapa-selecao').classList.add('oculto');
        document.getElementById('form-login').classList.remove('oculto');
    }

    // Se estiver na página de Cadastro
    if (grupoPerfilCadastro) {
        if (tipoUso === 'institucional') {
            grupoPerfilCadastro.classList.remove('oculto');
        } else {
            grupoPerfilCadastro.classList.add('oculto');
        }
        ajustarCamposEspecificos();
        
        document.getElementById('etapa-selecao').classList.add('oculto');
        document.getElementById('form-register').classList.remove('oculto');
    }
}

function voltarParaSelecao() {
    const telaLogin = document.getElementById('form-login');
    const telaRegister = document.getElementById('form-register');
    
    if (telaLogin) telaLogin.classList.add('oculto');
    if (telaRegister) telaRegister.classList.add('oculto');
    
    document.getElementById('etapa-selecao').classList.remove('oculto');
    
    const erroLogin = document.getElementById('erro-login');
    const erroCadastro = document.getElementById('erro-cadastro');
    if (erroLogin) erroLogin.classList.add('oculto');
    if (erroCadastro) erroCadastro.classList.add('oculto');
}

function ajustarCamposEspecificos() {
    const grupoInstituicao = document.getElementById('grupo-instituicao');
    if (!grupoInstituicao) return; 

    if (usoSelecionado === 'pessoal') {
        grupoInstituicao.classList.add('oculto');
        return;
    }

    const perfil = document.getElementById('cadastro-perfil').value;
    if (perfil === 'aluno') {
        grupoInstituicao.classList.add('oculto');
    } else {
        grupoInstituicao.classList.remove('oculto');
    }
}


* ==========================================================================
   2. PROCESSAMENTO DO FORMULÁRIO DE LOGIN
   ========================================================================== *

const formLogin = document.getElementById('form-autenticacao');
if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const senha = document.getElementById('login-senha').value;
        const erroDiv = document.getElementById('erro-login');
        const btnEntrar = document.getElementById('btn-entrar');

        // Se o uso for pessoal, a role enviada é 'pessoal', senão pega do select ('aluno'/'professor')
        const perfil = usoSelecionado === 'pessoal' ? 'pessoal' : document.getElementById('login-perfil').value;

        erroDiv.classList.add('oculto');
        btnEntrar.textContent = "Carregando...";
        btnEntrar.disabled = true;

        try {
            const resposta = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha, perfil })
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(dados.message || 'Erro ao efetuar login.');
            }

            // Armazena a sessão localmente
            localStorage.setItem('token_usuario', dados.access_token);
            localStorage.setItem('usuario', JSON.stringify(dados.user));

            // Fluxo condicional igual ao do Vue antigo
            if (dados.user.role === 'aluno') {
                document.getElementById('nome-aluno-boas-vindas').textContent = `👋 ${dados.user.nome}`;
                document.getElementById('etapa-formulario').classList.add('oculto');
                document.getElementById('etapa-turma').classList.remove('oculto');
            } else {
                // Professor ou Pessoal vão direto para o Dashboard correspondente
                window.location.href = '../dashboard/dashboard.html'; 
            }

        } catch (erro) {
            erroDiv.textContent = erro.message;
            erroDiv.classList.remove('oculto');
        } finally {
            btnEntrar.textContent = "Entrar ➔";
            btnEntrar.disabled = false;
        }
    });
}

*2. PROCESSAMENTO DO FORMULÁRIO DE LOGIN*

const formLogin = document.getElementById('form-autenticacao');
if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const senha = document.getElementById('login-senha').value;
        const erroDiv = document.getElementById('erro-login');
        const btnEntrar = document.getElementById('btn-entrar');

        const perfil = usoSelecionado === 'pessoal' ? 'pessoal' : document.getElementById('login-perfil').value;

        erroDiv.classList.add('oculto');
        btnEntrar.textContent = "Carregando...";
        btnEntrar.disabled = true;

        try {
            const resposta = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha, perfil })
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(dados.message || 'Erro ao efetuar login.');
            }

            console.log("=== RESPOSTA DO SERVER ===", dados);

            const usuarioObj = dados.user || dados.usuario || dados;
            const papelUsuario = usuarioObj.role || usuarioObj.perfil || usuarioObj.tipo;

            //Salvamento do Token obtido do Flask
            localStorage.setItem('token_usuario', dados.token);
            localStorage.setItem('usuario', JSON.stringify(usuarioObj));

            //Mapeando 'aluno' conforme o banco
            if (papelUsuario === 'aluno') {
                document.getElementById('form-login').classList.add('oculto');
                
                const etapaTurma = document.getElementById('etapa-turma');
                if (etapaTurma) {
                    etapaTurma.classList.remove('oculto');
                    const primeiroNome = usuarioObj.nome.split(' ')[0];
                    document.getElementById('nome-aluno-boas-vindas').innerText = `👋 Olá, ${primeiroNome}!`;
                } else {
                    window.location.href = '../dashboard/profile-student.html';
                }
            } else {
                window.location.href = '../dashboard/dashboard-manager.html';
            }
            
        } catch (erro) {
            console.error("Erro no login:", erro);
            erroDiv.textContent = erro.message;
            erroDiv.classList.remove('oculto');
        } finally {
            btnEntrar.textContent = "Entrar";
            btnEntrar.disabled = false;
        }
    });
}

* ==========================================================================
   3. PROCESSAMENTO DO FORMULÁRIO DE CADASTRO (REGISTER)
   ========================================================================== *

const formCadastro = document.getElementById('form-cadastro');
if (formCadastro) {
    formCadastro.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nome = document.getElementById('cad-nome').value;
        const email = document.getElementById('cad-email').value;
        const senha = document.getElementById('cad-senha').value;
        const confirmaSenha = document.getElementById('cad-confirma').value;
        const erroDiv = document.getElementById('erro-cadastro');
        const btnCadastrar = document.getElementById('btn-cadastrar');

        erroDiv.classList.add('oculto');

        // Validação básica de segurança no Front
        if (senha !== confirmaSenha) {
            erroDiv.textContent = "As senhas informadas não coincidem.";
            erroDiv.classList.remove('oculto');
            return;
        }

        let perfilFinal = 'pessoal';
        let idade = null;
        let instituicao = null;

        if (usoSelecionado === 'institucional') {
            perfilFinal = document.getElementById('cadastro-perfil').value;
        }

        // Mapeamento dinâmico dos atributos extras aceitos pelo backend
        if (perfilFinal === 'aluno' || perfilFinal === 'pessoal') {
            const campoIdade = document.getElementById('cad-idade').value;
            idade = campoIdade ? parseInt(campoIdade) : null;
        } else if (perfilFinal === 'professor') {
            instituicao = document.getElementById('cad-instituicao').value;
        }

        btnCadastrar.textContent = "Processando...";
        btnCadastrar.disabled = true;

        try {
            const resposta = await fetch('http://localhost:5000/api/cadastro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome,
                    email,
                    senha,
                    uso: usoSelecionado,
                    perfil: perfilFinal,
                    idade,
                    instituicao
                })
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(dados.message || 'Erro ao realizar o cadastro.');
            }

            // Transição para o estado de sucesso
            document.getElementById('texto-sucesso').textContent = dados.message || "A sua conta ecológica foi criada com sucesso!";
            document.getElementById('etapa-formulario').classList.add('oculto');
            document.getElementById('etapa-sucesso').classList.remove('oculto');

            formCadastro.reset();

        } catch (erro) {
            erroDiv.textContent = erro.message;
            erroDiv.classList.remove('oculto');
        } finally {
            btnCadastrar.textContent = "Cadastrar ➔";
            btnCadastrar.disabled = false;
        }
    });
}
*3. PROCESSAMENTO DO FORMULÁRIO DE CADASTRO (REGISTER)*

const formCadastro = document.getElementById('form-cadastro');
if (formCadastro) {
    formCadastro.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nome = document.getElementById('cad-nome').value;
        const email = document.getElementById('cad-email').value;
        const senha = document.getElementById('cad-senha').value;
        const confirmaSenha = document.getElementById('cad-confirma').value;
        const erroDiv = document.getElementById('erro-cadastro');
        const btnCadastrar = document.getElementById('btn-cadastrar');

        erroDiv.classList.add('oculto');

        if (senha !== confirmaSenha) {
            erroDiv.textContent = "As senhas informadas não coincidem.";
            erroDiv.classList.remove('oculto');
            return;
        }

        let perfilFinal = 'pessoal';
        let instituicao = null;

        if (usoSelecionado === 'institucional') {
            perfilFinal = document.getElementById('cadastro-perfil').value;
        }

        if (perfilFinal === 'professor') {
            instituicao = document.getElementById('cad-instituicao').value;
        }

        btnCadastrar.textContent = "Processando...";
        btnCadastrar.disabled = true;

        try {
            const resposta = await fetch('http://localhost:5000/api/cadastro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome,
                    email,
                    senha,
                    uso: usoSelecionado,
                    perfil: perfilFinal,
                    instituicao
                })
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(dados.message || 'Erro ao realizar o cadastro.');
            }

            document.getElementById('texto-sucesso').textContent = dados.message || "Conta criada com sucesso!";
            document.getElementById('form-register').classList.add('oculto');
            document.getElementById('etapa-sucesso').classList.remove('oculto');

            formCadastro.reset();

        } catch (erro) {
            erroDiv.textContent = erro.message;
            erroDiv.classList.remove('oculto');
        } finally {
            btnCadastrar.textContent = "Criar Conta ➔";
            btnCadastrar.disabled = false;
        }
    });
}

* ==========================================================================
   4. FUNÇÕES DO CÓDIGO DA TURMA (Exclusivo do fluxo de login do Aluno)
   ========================================================================== *

function validarTurma() {
    const codigo = document.getElementById('codigo-turma').value;
    const erroTurma = document.getElementById('erro-turma');

    if (codigo.length < 6) {
        erroTurma.textContent = 'O código deve conter exatamente 6 caracteres.';
        erroTurma.classList.remove('oculto');
        return;
    }

    alert("Turma conectada com sucesso! Bem-vindo à jornada!");
    window.location.href = '../dashboard/dashboard.html';
}

function pularTurma() {
    window.location.href = '../dashboard/dashboard.html';
}






*4. FUNÇÕES DE FLUXO ADICIONAL (Código da Turma)*
function validarTurma() {
    const codigo = document.getElementById('codigo-turma').value;
    const erroTurma = document.getElementById('erro-turma');

    if (codigo.length < 6) {
        erroTurma.textContent = 'O código deve conter exatamente 6 caracteres.';
        erroTurma.classList.remove('oculto');
        return;
    }

    alert("Turma conectada com sucesso! Bem-vindo à jornada!");
    window.location.href = '../dashboard/profile-student.html';
}

function pularTurma() {
    window.location.href = '../dashboard/profile-student.html';
}



// ==========================================================================
// Controle do fluxo de autenticação
// ==========================================================================

let usoSelecionado = "pessoal";


// ==========================================================================
// 1. TRANSIÇÃO ENTRE TELAS
// ==========================================================================

function irParaFormulario(tipoUso) {

    usoSelecionado = tipoUso;

    // ---------- Login ----------
    const campoPerfilLogin =
        document.getElementById("campo-perfil");

    const tituloLogin =
        document.getElementById("titulo-login");

    if (tituloLogin) {

        if (tipoUso === "institucional") {

            campoPerfilLogin?.classList.remove("oculto");

            tituloLogin.textContent =
                "Acesso Escolar 🏫";

        } else {

            campoPerfilLogin?.classList.add("oculto");

            tituloLogin.textContent =
                "Acesso Pessoal 🏠";

        }

        document
            .getElementById("etapa-selecao")
            ?.classList.add("oculto");

        document
            .getElementById("form-login")
            ?.classList.remove("oculto");

    }

    // ---------- Cadastro ----------
    const grupoPerfilCadastro =
        document.getElementById("grupo-perfil");

    if (grupoPerfilCadastro) {

        if (tipoUso === "institucional") {

            grupoPerfilCadastro.classList.remove("oculto");

        } else {

            grupoPerfilCadastro.classList.add("oculto");

        }

        ajustarCamposEspecificos();

        document
            .getElementById("etapa-selecao")
            ?.classList.add("oculto");

        document
            .getElementById("form-register")
            ?.classList.remove("oculto");

    }

}


// ==========================================================================
// Voltar para a primeira etapa
// ==========================================================================

function voltarParaSelecao() {

    document
        .getElementById("form-login")
        ?.classList.add("oculto");

    document
        .getElementById("form-register")
        ?.classList.add("oculto");

    document
        .getElementById("etapa-selecao")
        ?.classList.remove("oculto");

    document
        .getElementById("erro-login")
        ?.classList.add("oculto");

    document
        .getElementById("erro-cadastro")
        ?.classList.add("oculto");

}


// ==========================================================================
// Ajusta os campos específicos do cadastro
// ==========================================================================

function ajustarCamposEspecificos() {

    const grupoIdade =
        document.getElementById("grupo-idade");

    const grupoInstituicao =
        document.getElementById("grupo-instituicao");

    // Não está na página de cadastro
    if (!grupoIdade && !grupoInstituicao) {

        return;

    }

    // Uso pessoal
    if (usoSelecionado === "pessoal") {

        grupoIdade?.classList.remove("oculto");

        grupoInstituicao?.classList.add("oculto");

        return;

    }

    // Uso institucional
    const perfil =
        document.getElementById("cadastro-perfil")?.value;
    //aluno
    if (perfil === "student") {

        grupoIdade?.classList.remove("oculto");

        grupoInstituicao?.classList.add("oculto");
        //teacher
    } else if(perfil == 'teacher') {

        grupoIdade?.classList.add("oculto");

        grupoInstituicao?.classList.remove("oculto");

    }
        // admin (caso exista futuramente)
    else {

        grupoIdade?.classList.add("oculto");

        grupoInstituicao?.classList.remove("oculto");

    }

}
         
/* ==========================================================================
   2. PROCESSAMENTO DO FORMULÁRIO DE LOGIN
   ========================================================================== *

const formLogin = document.getElementById("form-autenticacao");

if (formLogin) {

    formLogin.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email =
            document.getElementById("login-email").value;

        const password =
            document.getElementById("login-senha").value;

        const erroDiv =
            document.getElementById("erro-login");

        const btnEntrar =
            document.getElementById("btn-entrar");

        // Uso pessoal = student
        // Uso institucional = perfil escolhido
        const role =
            usoSelecionado === "pessoal"
                ? "student"
                : document.getElementById("login-perfil").value;

        erroDiv.classList.add("oculto");

        btnEntrar.textContent = "Entrando...";

        btnEntrar.disabled = true;

        try {

            const resposta = await fetch("/api/login"//fetch("http://localhost:5000/api/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password,
                        role
                    })

                }
            );


/*
            // Compatibilidade com diferentes formatos da API
            const usuario =
                dados.user ||
                dados.usuario ||
                dados;

            const papel =
                usuario.role ||
                usuario.perfil ||
                usuario.tipo;

            const token =
                dados.access_token ||
                dados.token;

            // Salva sessão local
            if (token) {

                localStorage.setItem(
                    "token_usuario",
                    token
                );

            }

           */
            const dados = await resposta.json();

            if (!resposta.ok) {

                throw new Error(
                    dados.message ||
                    "Erro ao efetuar login."
                );

            }

            console.log("Resposta do servidor:", dados);

            const usuario = dados.user;

            const token = dados.access_token;

            // Salva o token JWT
            localStorage.setItem(
                "token_usuario",
                token
            );

            // Salva os dados do usuário
            localStorage.setItem(
                "usuario",
                JSON.stringify(usuario)
            );
            localStorage.setItem(
                "current_user",
                JSON.stringify(usuario)
            );

            // Fluxo do estudante
            if (usuario.role === "student") {

                const etapaTurma =
                    document.getElementById("etapa-turma");

                if (etapaTurma) {

                    document
                        .getElementById("form-login")
                        .classList.add("oculto");

                    etapaTurma.classList.remove("oculto");

                    const primeiroNome =
                        usuario.name.split(" ")[0];

                    document.getElementById(
                        "nome-aluno-boas-vindas"
                    ).textContent =
                        `👋 Olá, ${primeiroNome}!`;

                }
                else {

                    window.location.href = "/dashboard";

                }

            }

            // Professor
            else if (usuario.role === "teacher") {

                window.location.href =
                    "/teacher/dashboard";

            }

            // Admin
            else if (usuario.role === "admin") {

                window.location.href =
                    "/admin/dashboard";

            }

            else {

                throw new Error(
                    "Perfil de usuário inválido."
                );

            }

        }

        catch (erro) {

            console.error(erro);

            erroDiv.textContent =
                erro.message;

            erroDiv.classList.remove("oculto");

        }

        finally {

            btnEntrar.textContent =
                "Entrar";

            btnEntrar.disabled = false;

        }

    });

}
/* ==========================================================================
   3. PROCESSAMENTO DO FORMULÁRIO DE CADASTRO (REGISTER)
   ========================================================================== *

const formCadastro = document.getElementById("form-cadastro");

if (formCadastro) {

    formCadastro.addEventListener("submit", async (e) => {

        e.preventDefault();

        const nome =
            document.getElementById("cad-nome").value;

        const email =
            document.getElementById("cad-email").value;

        const senha =
            document.getElementById("cad-senha").value;

        const confirmaSenha =
            document.getElementById("cad-confirma").value;

        const erroDiv =
            document.getElementById("erro-cadastro");

        const btnCadastrar =
            document.getElementById("btn-cadastrar");

        erroDiv.classList.add("oculto");

        // Validação das senhas
        if (senha !== confirmaSenha) {

            erroDiv.textContent =
                "As senhas informadas não coincidem.";

            erroDiv.classList.remove("oculto");

            return;

        }

        let perfilFinal = "student";
        let idade = null;
        let instituicao = null;

        // Perfil escolhido no uso institucional
        if (usoSelecionado === "institucional") {

            const perfilSelecionado =
                document.getElementById("cadastro-perfil").value;

            if (perfilSelecionado === "aluno") {

                perfilFinal = "student";

            }

            else if (perfilSelecionado === "professor") {

                perfilFinal = "teacher";

            }

        }

        // Dados específicos
        if (
            perfilFinal === "teacher" ||
            perfilFinal === "student"
        ) {

            const campoIdade =
                document.getElementById("cad-idade");

            if (campoIdade && campoIdade.value) {

                idade =
                    parseInt(campoIdade.value);

            }

        }

        else if (perfilFinal === "professor") {

            const campoInstituicao =
                document.getElementById("cad-instituicao");

            if (campoInstituicao) {

                instituicao =
                    campoInstituicao.value;

            }

        }

        btnCadastrar.textContent =
            "Processando...";

        btnCadastrar.disabled = true;

        try {

            const resposta = await fetch(
                "http://localhost:5000/api/cadastro",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({

                        name: nome,
                        email,
                        password: senha,
                        role: perfilFinal,
                        age: idade,
                        institution: instituicao

                    })
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {

                throw new Error(
                    dados.message ||
                    dados.error ||
                    "Erro ao realizar o cadastro."
                );

            }
        
            document.getElementById("texto-sucesso").textContent =
                dados.message ||
                "Sua conta foi criada com sucesso!";

            // Esconde formulário
            const telaCadastro =
                document.getElementById("form-register") ||
                document.getElementById("etapa-formulario");

            if (telaCadastro) {

                telaCadastro.classList.add("oculto");

            }

            // Mostra tela de sucesso
            const telaSucesso =
                document.getElementById("etapa-sucesso");

            if (telaSucesso) {

                telaSucesso.classList.remove("oculto");

            }

            formCadastro.reset();

        }

        catch (erro) {

            console.error(erro);

            erroDiv.textContent =
                erro.message;

            erroDiv.classList.remove("oculto");

        }

        finally {

            btnCadastrar.textContent =
                "Cadastrar";

            btnCadastrar.disabled = false;

        }

    });

}

/* ==========================================================================
   4. FUNÇÕES DO CÓDIGO DA TURMA
   (Fluxo exclusivo do aluno)
   ========================================================================== *

function validarTurma() {

    const codigo =
        document.getElementById("codigo-turma").value.trim();

    const erroTurma =
        document.getElementById("erro-turma");

    erroTurma.classList.add("oculto");

    if (codigo.length !== 6) {

        erroTurma.textContent =
            "O código deve conter exatamente 6 caracteres.";

        erroTurma.classList.remove("oculto");

        return;

    }

    // Futuramente será feita uma chamada à API
    // para validar o código da turma.

    alert("Turma conectada com sucesso! Bem-vindo à jornada!");

    window.location.href = "/dashboard";

}

function pularTurma() {

    window.location.href = "/dashboard";

}
/* ==========================================================================
   5. FUNÇÕES DE INTERFACE (LOGIN E CADASTRO)
   ========================================================================== *

/* ---------- LOGIN ---------- *

function proximoPassoLogin(escolha) {

    const painel =
        document.getElementById("etapa-tipo-uso");

    const formulario =
        document.getElementById("form-login");

    const seletores =
        document.getElementById("container-seletores-finais");

    const rotulo =
        document.getElementById("rotulo-perfil-dinamico");

    painel.classList.add("oculto");
    formulario.classList.remove("oculto");

    if (escolha === "pessoal") {

        seletores.classList.add("oculto");
        rotulo.classList.add("oculto");

    } else {

        seletores.classList.remove("oculto");
        rotulo.classList.remove("oculto");

    }

    selecionarPerfilLogin("student");

}

function selecionarPerfilLogin(perfil) {

    const form =
        document.getElementById("form-login");

    const input =
        document.getElementById("tipo_usuario");

    const estudante =
        document.getElementById("opcao-estudante");

    const professor =
        document.getElementById("opcao-professor");

    const botao =
        document.getElementById("btn-entrar");

    input.value = perfil;

    if (perfil === "estudante") {

        form.classList.remove("estado-professor");
        form.classList.add("estado-estudante");

        estudante.className =
            "quadrinho-opcao ativo-estudante";

        professor.className =
            "quadrinho-opcao";

    } else {

        form.classList.remove("estado-estudante");
        form.classList.add("estado-professor");

        estudante.className =
            "quadrinho-opcao";

        professor.className =
            "quadrinho-opcao ativo-professor";

    }

    botao.textContent = "Entrar";

}

function voltarAoInicioLogin() {

    document
        .getElementById("form-login")
        .classList.add("oculto");

    document
        .getElementById("etapa-tipo-uso")
        .classList.remove("oculto");

}


/* ---------- CADASTRO ---------- *

function proximoPassoCadastro(escolha) {

    const painel =
        document.getElementById("etapa-tipo-uso");

    const formulario =
        document.getElementById("form-cadastro");

    const seletores =
        document.getElementById("container-seletores-finais");

    const rotulo =
        document.getElementById("rotulo-perfil-dinamico");

    painel.classList.add("oculto");
    formulario.classList.remove("oculto");

    if (escolha === "pessoal") {

        seletores.classList.add("oculto");
        rotulo.classList.add("oculto");

    } else {

        seletores.classList.remove("oculto");
        rotulo.classList.remove("oculto");

    }

    selecionarPerfil("student");

}

function selecionarPerfil(perfil) {

    const form =
        document.getElementById("form-cadastro");

    const input =
        document.getElementById("tipo_usuario");

    const estudante =
        document.getElementById("opcao-estudante");

    const professor =
        document.getElementById("opcao-professor");

    const labelNome =
        document.getElementById("label-nome");

    const botao =
        document.getElementById("btn-registrar");

    input.value = perfil;

    if (perfil === "estudante") {

        form.classList.remove("estado-professor");
        form.classList.add("estado-estudante");

        estudante.className =
            "quadrinho-opcao ativo-estudante";

        professor.className =
            "quadrinho-opcao";

        if (labelNome)
            labelNome.textContent =
                "Nome do Aluno";

    } else {

        form.classList.remove("estado-estudante");
        form.classList.add("estado-professor");

        estudante.className =
            "quadrinho-opcao";

        professor.className =
            "quadrinho-opcao ativo-professor";

        if (labelNome)
            labelNome.textContent =
                "Nome do Professor / Gestor";

    }

    botao.textContent = "Criar Conta";

}

function voltarAoInicioCadastro() {

    document
        .getElementById("form-cadastro")
        .classList.add("oculto");

    document
        .getElementById("etapa-tipo-uso")
        .classList.remove("oculto");

}


/* ---------- Inicialização ---------- 

document.addEventListener("DOMContentLoaded", () => {

    if (document.getElementById("form-login")) {

        selecionarPerfilLogin("student");

    }

    if (document.getElementById("form-cadastro")) {

        selecionarPerfil("student");

    }

});


/*COMUNICAÇÃO HTTP*
export async function post(url, data){

    const response = await fetch(url,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
    });

    return response.json();
}
*/
