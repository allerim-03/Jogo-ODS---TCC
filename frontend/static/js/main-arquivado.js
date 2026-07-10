// frontend/js/main.js

document.addEventListener("DOMContentLoaded", () => {
    renderizarLayoutGlobal();
});

/* ==========================================================================
   LAYOUT GLOBAL (Navbar/Header)
   ========================================================================== */

function renderizarLayoutGlobal() {
    const usuarioLogado = localStorage.getItem("token_usuario") !== null;

    const naSubpasta =
        window.location.pathname.includes("/auth/") ||
        window.location.pathname.includes("/dashboard/") ||
        window.location.pathname.includes("/quizzes/") ||
        window.location.pathname.includes("/classroom/") ||
        window.location.pathname.includes("/games/");

    const prefixo = naSubpasta ? "../" : "";

    // Descobre automaticamente qual painel mostrar
    let paginaPainel = "profile-student.html";

    try {
        const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
        const papel = usuario.role || usuario.perfil || usuario.tipo || "estudante";

        if (papel === "professor" || papel === "gestor") {
            paginaPainel = "dashboard-manager.html";
        }
    } catch (erro) {
        console.warn("Não foi possível identificar o perfil do usuário.");
    }

    const header = document.querySelector("header.topbar");

    if (!header) return;

    header.innerHTML = `
        <div class="left">
            ${
                usuarioLogado
                    ? `
                <label for="menu-check" class="hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                </label>
            `
                    : ""
            }

            <div class="info-container">
                <div class="logo-banner"
                     onclick="window.location.href='${prefixo}home.html'">

                    <span class="banner-icon">🌱</span>

                    <div class="brand-text">
                        <h1>PLATAFORMA EDUCA</h1>
                        <p>CULTIVANDO O SABER</p>
                    </div>
                </div>
            </div>
        </div>

        <nav class="menu">
            ${
                !usuarioLogado
                    ? `
                <a href="#" onclick="alternarAbaPublica('inicio')">INÍCIO</a>
                <a href="#" onclick="alternarAbaPublica('ods')">SOBRE NÓS</a>
                <a href="#" onclick="alternarAbaPublica('jogos')">NOSSOS JOGOS</a>

                <button
                    class="btn-login-top"
                    onclick="window.location.href='${prefixo}auth/login.html'">
                    Entrar ➔
                </button>
            `
                    : `
                <a href="${prefixo}dashboard/${paginaPainel}">
                    PAINEL
                </a>

                <a href="#">
                    MEU PERFIL
                </a>

                <button
                    onclick="fazerLogout()"
                    style="
                        background:#e63946;
                        color:white;
                        border:none;
                        padding:8px 15px;
                        border-radius:8px;
                        cursor:pointer;">
                    Sair
                </button>
            `
            }
        </nav>
    `;
}

/* ==========================================================================
   NAVEGAÇÃO PÚBLICA
   ========================================================================== */

function alternarAbaPublica(aba) {

    if (window.location.pathname.includes("/auth/")) {
        window.location.href = "../home.html";
        return;
    }

    const secInicio = document.getElementById("secao-inicio");
    const secOds = document.getElementById("secao-ods");
    const secJogos = document.getElementById("secao-jogos");

    if (!secInicio || !secOds || !secJogos) return;

    secInicio.classList.add("oculto");
    secOds.classList.add("oculto");
    secJogos.classList.add("oculto");

    switch (aba) {
        case "inicio":
            secInicio.classList.remove("oculto");
            break;

        case "ods":
            secOds.classList.remove("oculto");
            break;

        case "jogos":
            secJogos.classList.remove("oculto");
            break;
    }
}

/* ==========================================================================
   LOGOUT
   ========================================================================== */

function fazerLogout() {

    localStorage.removeItem("token_usuario");
    localStorage.removeItem("usuario");

    window.location.href = "../home.html";
}


/*function renderizarLayoutGlobal() {
    const usuarioLogado = localStorage.getItem("token_usuario") !== null;
    const naSubpasta = window.location.pathname.includes("/auth/") || 
                       window.location.pathname.includes("/dashboard/") || 
                       window.location.pathname.includes("/quizzes/") || 
                       window.location.pathname.includes("/classroom/") ||
                       window.location.pathname.includes("/games/");
                       
    const prefixo = naSubpasta ? "../" : "";

    const header = document.querySelector("header.topbar");
    if (header) {
        header.innerHTML = `
          <div class="left">
            ${usuarioLogado ? `
              <label for="menu-check" class="hamburger">
                <span></span><span></span><span></span>
              </label>
            ` : ''}
            
            <div class="info-container">
              <div class="logo-banner" onclick="window.location.href='${prefixo}home.html'">
                <span class="banner-icon">🌱</span>
                <div class="brand-text">
                  <h1>PLATAFORMA EDUCA</h1>
                  <p>CULTIVANDO O SABER</p>
                </div>
              </div>
            </div>
          </div>

          <nav class="menu">
            ${!usuarioLogado ? `
              <a href="#" onclick="alternarAbaPublica('inicio')">INÍCIO</a>
              <a href="#" onclick="alternarAbaPublica('ods')">SOBRE NÓS</a>
              <a href="#" onclick="alternarAbaPublica('jogos')">NOSSOS JOGOS</a>
              <button onclick="window.location.href='${prefixo}auth/login.html'" class="btn-login-top">Entrar ➔</button>
            ` : `
              <a href="${prefixo}dashboard/dashboard.html">PAINEL</a>
              <a href="#">MEU PERFIL</a>
              <button onclick="fazerLogout()" style="background-color: #e63946; padding: 8px 15px; border-radius: 8px; color: white; border: none; cursor: pointer;">Sair</button>
            `}
          </nav>
        `;
    }
}
    
document.addEventListener("DOMContentLoaded", () => {
    renderizarLayoutGlobal();
});


function renderizarLayoutGlobal() {
    const usuarioLogado = localStorage.getItem("token_usuario") !== null;

    const naSubpasta =
        window.location.pathname.includes("/auth/") ||
        window.location.pathname.includes("/dashboard/") ||
        window.location.pathname.includes("/quizzes/") ||
        window.location.pathname.includes("/classroom/") ||
        window.location.pathname.includes("/games/");

    const prefixo = naSubpasta ? "../" : "";

    let paginaPainel = "profile-student.html";

    try {
        const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

        const papel =
            usuario.role ||
            usuario.perfil ||
            usuario.tipo ||
            "estudante";

        if (papel === "professor" || papel === "gestor") {
            paginaPainel = "dashboard-manager.html";
        }

    } catch (e) {}

    // resto exatamente igual ao seu...
}
function alternarAbaPublica(aba) {
    if (window.location.pathname.includes("/auth/")) {
        window.location.href = "../home.html";
        return;
    }

    const secInicio = document.getElementById('secao-inicio');
    const secOds = document.getElementById('secao-ods');
    const secJogos = document.getElementById('secao-jogos');

    if (!secInicio || !secOds || !secJogos) return;

    secInicio.classList.add('oculto');
    secOds.classList.add('oculto');
    secJogos.classList.add('oculto');

    if (aba === 'inicio') secInicio.classList.remove('oculto');
    if (aba === 'ods') secOds.classList.remove('oculto');
    if (aba === 'jogos') secJogos.classList.remove('oculto');
}

function fazerLogout() {
    localStorage.removeItem("token_usuario");
    localStorage.removeItem("usuario");
    window.location.href = "../home.html";
}


//main.js da khay

document.addEventListener("DOMContentLoaded", () => {
    // 1. Inicializa o layout padrão da barra superior
    renderizarLayoutGlobal();
    
    // 2. Conecta os formulários de login e cadastro ao back-end de forma segura
    configurarFormulariosAutenticacao();
});

function renderizarLayoutGlobal() {
    const usuarioLogado = localStorage.getItem("token_usuario") !== null;
    const naSubpasta = window.location.pathname.includes("/auth/") || 
                       window.location.pathname.includes("/dashboard/") || 
                       window.location.pathname.includes("/quizzes/") || 
                       window.location.pathname.includes("/classroom/") ||
                       window.location.pathname.includes("/games/");
                       
    const prefixo = naSubpasta ? "../" : "";

    // Descobre dinamicamente para qual painel personalizado levar o usuário logado
    let paginaPainel = "profile-student.html"; 
    try {
        const dadosUsuario = JSON.parse(localStorage.getItem("usuario") || "{}");
        const papel = dadosUsuario.role || dadosUsuario.perfil || dadosUsuario.tipo || "estudante";
        if (papel === "professor" || papel === "gestor") {
            paginaPainel = "dashboard-manager.html";
        }
    } catch(e) { /* fallback em caso de localStorage vazio * }

    const header = document.querySelector("header.topbar");
    if (header) {
        header.innerHTML = `
          <div class="left">
            ${usuarioLogado ? `
              <label for="menu-check" class="hamburger">
                <span></span><span></span><span></span>
              </label>
            ` : ''}
            
            <div class="info-container">
              <div class="logo-banner" onclick="window.location.href='${prefixo}home.html'">
                <span class="banner-icon">🌱</span>
                <div class="brand-text">
                  <h1>PLATAFORMA EDUCA</h1>
                  <p>CULTIVANDO O SABER</p>
                </div>
              </div>
            </div>
          </div>

          <nav class="menu">
            ${!usuarioLogado ? `
              <a href="#" onclick="alternarAbaPublica('inicio')">INÍCIO</a>
              <a href="#" onclick="alternarAbaPublica('ods')">SOBRE NÓS</a>
              <a href="#" onclick="alternarAbaPublica('jogos')">NOSSOS JOGOS</a>
              <button onclick="window.location.href='${prefixo}auth/login.html'" class="btn-login-top">Entrar ➔</button>
            ` : `
              <a href="${prefixo}dashboard/${paginaPainel}">PAINEL</a>
              <a href="#">MEU PERFIL</a>
              <button onclick="fazerLogout()" style="background-color: #e63946; padding: 8px 15px; border-radius: 8px; color: white; border: none; cursor: pointer;">Sair</button>
            `}
          </nav>
        `;
    }
}

function alternarAbaPublica(aba) {
    if (window.location.pathname.includes("/auth/")) {
        window.location.href = "../home.html";
        return;
    }

    const secInicio = document.getElementById('secao-inicio');
    const secOds = document.getElementById('secao-ods');
    const secJogos = document.getElementById('secao-jogos');

    if (!secInicio || !secOds || !secJogos) return;

    secInicio.classList.add('oculto');
    secOds.classList.add('oculto');
    secJogos.classList.add('oculto');

    if (aba === 'inicio') secInicio.classList.remove('oculto');
    if (aba === 'ods') secOds.classList.remove('oculto');
    if (aba === 'jogos') secJogos.classList.remove('oculto');
}

function fazerLogout() {
    localStorage.removeItem("token_usuario");
    localStorage.removeItem("usuario");
    window.location.href = "../home.html";
}

/* ==========================================================================
   🔌 ESCUTADORES ISOLADOS PARA CONEXÃO COM O BACK-END
   ========================================================================== *
function configurarFormulariosAutenticacao() {
    // FORMULÁRIO DE LOGIN
    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault(); // Impede o recarregamento da página!
            
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            const perfilInput = document.getElementById('tipo_usuario');
            const perfil = perfilInput ? perfilInput.value : 'estudante';
            const btnEntrar = document.getElementById('btn-entrar');

            if (btnEntrar) { btnEntrar.textContent = "Carregando..."; btnEntrar.disabled = true; }

            try {
                const resposta = await fetch('http://localhost:5000/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, senha, perfil })
                });

                const dados = await resposta.json();
                if (!resposta.ok) throw new Error(dados.message || 'Erro ao efetuar login.');

                const usuarioObj = dados.user || dados.usuario || dados;
                const papelUsuario = usuarioObj.role || usuarioObj.perfil || usuarioObj.tipo || perfil;

                localStorage.setItem('token_usuario', dados.access_token || dados.token);
                localStorage.setItem('usuario', JSON.stringify(usuarioObj));

                // Redirecionamento correto para as suas páginas reais
                if (papelUsuario === 'aluno' || papelUsuario === 'estudante' || papelUsuario === 'pessoal') {
                    window.location.href = '../dashboard/profile-student.html';
                } else {
                    window.location.href = '../dashboard/dashboard-manager.html';
                }
            } catch (erro) {
                alert(erro.message);
            } finally {
                if (btnEntrar) { btnEntrar.textContent = "Entrar"; btnEntrar.disabled = false; }
            }
        });
    }

    // FORMULÁRIO DE CADASTRO
    const formCadastro = document.getElementById('form-cadastro');
    if (formCadastro) {
        formCadastro.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            const perfilInput = document.getElementById('tipo_usuario');
            const perfilFinal = perfilInput ? perfilInput.value : 'estudante';
            const btnRegistrar = document.getElementById('btn-registrar');

            if (btnRegistrar) { btnRegistrar.textContent = "Processando..."; btnRegistrar.disabled = true; }

            try {
                const resposta = await fetch('http://localhost:5000/api/cadastro', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome, email, senha, perfil: perfilFinal })
                });

                const dados = await resposta.json();
                if (!resposta.ok) throw new Error(dados.message || 'Erro ao realizar o cadastro.');

                alert(dados.message || "Conta criada com sucesso! Faça seu login.");
                window.location.href = 'login.html';
            } catch (erro) {
                alert(erro.message);
            } finally {
                if (btnRegistrar) { btnRegistrar.textContent = "Criar Conta"; btnRegistrar.disabled = false; }
            }
        });
    }
}
*/

