function toggleSidebar() {

    const sidebar =
        document.getElementById("sidebar");

    if (sidebar) {
        sidebar.classList.toggle("aberto");
    }

}

document.querySelectorAll(".xp-progress").forEach(bar => {
    bar.style.width = bar.dataset.progress + "%";
});
/*

// COMPONENTE UNIFICADO: TOPBAR TRÍPLICE (Público Oficial, Gestor e Estudante)
function injetarTopbar(tipoUsuario = 'publico') {
    if (document.querySelector('.topbar')) return;

    let linksMenu = '';
    let configuracaoClique = '';
    let tituloAviso = '';
    let classeInterativa = '';

    // 1. ESCOPO GESTOR INSTITUCIONAL
    if (tipoUsuario === 'gestor') {
        linksMenu = `
            <a href="dashboard-manager.html">Painel Geral</a>
            <a href="#" class="ativo-menu-item">Diário de Classe</a>
            <a href="#">Atividades</a>
            <a href="../login.html" class="btn-login-top">Sair</a>
        `;
        configuracaoClique = 'onclick="toggleSidebar(\'gestor\')"';
        tituloAviso = 'Configurações do Gestor';
        classeInterativa = 'clicavel';
        injetarSidebar('gestor');

    // 2. ESCOPO ESTUDANTE INSTITUCIONAL
    } else if (tipoUsuario === 'estudante') {
        linksMenu = `
            <a href="#" class="ativo-menu-item">Meu Painel</a>
            <a href="#atividades">Minhas Atividades</a>
            <a href="#conquistas">Minhas Conquistas</a>
            <a href="../login.html" class="btn-login-top">Sair</a>
        `;
        configuracaoClique = 'onclick="toggleSidebar(\'estudante\')"';
        tituloAviso = 'Meu Perfil de Estudante';
        classeInterativa = 'clicavel';
        injetarSidebar('estudante');

    // 3. ESCOPO PÚBLICO OFICIAL (Alinhado com o modelo de vocês)
    } else {
        linksMenu = `
            <a href="index.html" class="ativo-menu-item">Início</a>
            <a href="#sobre-nos">Sobre Nós</a>
            <a href="#nossos-jogos">Nossos Jogos</a>
            <a href="login.html" class="btn-login-top">Entrar</a>
        `;
        tituloAviso = 'Plataforma Educa';
        classeInterativa = 'estatica'; // Sem hambúrguer ativo antes do login
    }

    const topbarHTML = `
        <header class="topbar">
            <div class="left">
                <div class="logo-banner" ${configuracaoClique} title="${tituloAviso}">
                    <span class="banner-icon icone-hamburguer-plantinha ${classeInterativa}">🌱</span>
                    <div class="brand-text">
                        <h1>PLATAFORMA EDUCA</h1>
                        <p>CULTIVANDO O SABER</p>
                    </div>
                </div>
            </div>
            <nav class="menu">
                ${linksMenu}
            </nav>
        </header>
    `;

    document.body.insertAdjacentHTML('afterbegin', topbarHTML);
}

// SIDEBAR ADAPTATIVA (Diferencia Gestor de Aluno na hora de abrir)
function injetarSidebar(papel) {
    if (document.getElementById('sidebar-gestor')) return;
    
    const nome = papel === 'gestor' ? 'Prof. Carlos Silva' : 'Sabine Klein';
    const cargo = papel === 'gestor' ? 'Gestor Escolar' : 'Estudante • Turma A';
    const emoji = papel === 'gestor' ? '👨‍🏫' : '👧🏻';

    const sidebarHTML = `
        <aside id="sidebar-gestor" class="sidebar-lateral">
            <div class="sidebar-header">
                <div class="perfil-resumo">
                    <div class="foto-perfil-wrapper"><span class="emoji-foto">${emoji}</span></div>
                    <div class="perfil-info-texto"><h4>${nome}</h4><p>${cargo}</p></div>
                </div>
                <button class="btn-fechar-sidebar" onclick="toggleSidebar()">×</button>
            </div>
            <nav class="sidebar-menu">
                <a href="#perfil">👤 Meu Perfil</a>
                <a href="#preferencias">🎨 Personalizar App</a>
                <a href="#ajuda">❓ Central de Ajuda</a>
                <a href="../login.html">🚪 Sair do Sistema</a>
            </nav>
        </aside>
    `;
    document.body.insertAdjacentHTML('beforeend', sidebarHTML);
}

// COMPONENTE: FOOTER GLOBAL
function injetarFooter() {
    if (document.querySelector('footer')) return;
    const footerHTML = `<footer><p>© 2026 Plataforma Educa - Cultivando o Saber de forma inclusiva e tecnológica.</p></footer>`;
    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar-gestor');
    if (sidebar) sidebar.classList.toggle('aberto');
}
*/