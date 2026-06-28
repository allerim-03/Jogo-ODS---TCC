// Variável global de controle de fluxo dentro do módulo de autenticação
let usoSelecionado = 'pessoal';

/* ==========================================================================
   1. FUNÇÕES DE TRANSIÇÃO DE TELAS (Otimizadas para ambos os formulários)
   ========================================================================== */

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


/* ==========================================================================
   2. PROCESSAMENTO DO FORMULÁRIO DE LOGIN
   ========================================================================== */

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


/* ==========================================================================
   3. PROCESSAMENTO DO FORMULÁRIO DE CADASTRO (REGISTER)
   ========================================================================== */

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


/* ==========================================================================
   4. FUNÇÕES DO CÓDIGO DA TURMA (Exclusivo do fluxo de login do Aluno)
   ========================================================================== */

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