/* Cabeçalho compartilhado e navegação: uma única fonte para todas as telas. */
document.addEventListener('DOMContentLoaded', () => {
  const user = EcoDB.current(), page = document.body.dataset.page;
  const isPublic = ['home.html','ods.html','sobrenos.html','erro404.html'].includes(page);
  const isAuth = ['escolha.html','escolha-cadastro.html','login.html','login-professor.html','cadastro.html','cadastro-professor.html'].includes(page);
  document.body.classList.add(isPublic ? 'public-layout' : isAuth ? 'auth-layout' : 'app-layout');
  const teacher = user?.role === 'professor', home = teacher ? '/turmas' : '/app';
  const links = isPublic || isAuth ? [['/','Início'],['/ods','Conheça os ODS'],['/sobre','Sobre o projeto']] : teacher ? [['/turmas','Minhas turmas'],['/gestor/tarefas','Atribuir tarefas'],['/ranking','Ranking'],['/gestor/perfil','Meu perfil']] : [['/app','Minha jornada'],['/jogos','Jogos'],['/quizzes','Quizzes'],['/tarefas','Minhas tarefas'],['/ranking','Ranking'],['/perfil','Meu perfil']];
  const navIcons={'/gestor/tarefas':'','/tarefas':'','/':'','/ods':'','/sobre':'','/turmas':'','/ranking':'','/gestor/perfil':'🙂','/app':'','/jogos':'','/quizzes':'💡','/perfil':'🙂'};
  const nav = links.map(([href,label]) => `<a href="${href}" ${location.pathname === href ? 'aria-current="page"' : ''}><span aria-hidden="true">${navIcons[href] || "🌱"}</span>${label}</a>`).join('');
  document.getElementById('site-header').innerHTML = `<div class="header-inner"><a class="brand" href="/" aria-label="Cultivando o Saber: página inicial"><img src="/assets/images/TugaPqn.png" alt=""><span>Cultivando<small>o Saber</small></span></a><button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation" aria-label="Abrir menu">☰</button><nav id="primary-navigation" aria-label="Menu principal">${nav}</nav>${user?.role === 'aluno' && !isPublic && !isAuth && page !== 'perfil.html' ? `<div class="sidebar-grow"><span class="eyebrow">CRESCENDO JUNTOS</span><div class="sidebar-progress-ring" role="progressbar" aria-label="Progresso para o próximo nível" aria-valuemin="0" aria-valuemax="1000" aria-valuenow="0"><img src="/assets/images/TugaPqn.png" alt=""></div><strong id="sidebar-level">Aprender é uma aventura!</strong><small id="sidebar-progress-copy">Um pequeno passo por dia.</small></div>` : ''}<div class="header-actions">${user ? `<a class="account-link" href="${home}">${isPublic || isAuth ? 'Acessar minha área ↗' : 'Minha área'}</a><button class="logout-button" type="button">Sair</button>` : '<a class="account-link" href="/entrar">Entrar</a><a class="btn-principal compact" href="/cadastro">Criar conta ↗</a>'}</div></div>`;
  const toggle = document.querySelector('.nav-toggle');
  function closeMenu(){toggle.setAttribute('aria-expanded','false');document.getElementById('site-header').classList.remove('menu-open');}
  toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));document.getElementById('site-header').classList.toggle('menu-open',!open);});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
  document.querySelectorAll('#primary-navigation a').forEach(a=>a.addEventListener('click',closeMenu));
  document.querySelector('.logout-button')?.addEventListener('click',()=>{EcoDB.logout();location.href='/';});
  if(user && !isPublic && !isAuth && !['index.html','perfil.html'].includes(page)){
    const toolbar=document.createElement('div');toolbar.className='context-bar';
    const greeting=document.createElement('span');greeting.id='saudacao-aluno';greeting.textContent='Olá, '+user.name.split(/\s+/)[0]+'!';toolbar.append(greeting);
    if(user.role==='aluno'){
      const level=document.createElement('div');level.className='level';level.innerHTML='<span class="star"></span><div class="bar"><div class="progress"></div></div><span class="xp"></span>';toolbar.append(level);
    }else {const label=document.createElement('span');label.className='eyebrow';label.textContent='ÁREA DO GESTOR';toolbar.append(label);}
    document.querySelector('.platform-content').prepend(toolbar);
  }
  const updateDashboard = () => {
    const current=EcoDB.current();
    const ring=document.querySelector('.sidebar-progress-ring');
    if(ring && current?.role==='aluno'){
      const progress=EcoDB.level(current.xp);ring.style.setProperty('--progress',`${progress.progress/10}%`);ring.setAttribute('aria-valuenow',progress.progress);
      document.getElementById('sidebar-level').textContent='Nível '+progress.level;
      document.getElementById('sidebar-progress-copy').textContent=progress.progress+' de 1.000 XP';
    } else if(ring) {ring.removeAttribute('role');ring.removeAttribute('aria-valuenow');}
    if(!['index.html','perfil.html'].includes(page)||!current)return;
    const set=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value;};
    set('dashboard-greeting','Olá, '+current.name.split(/\s+/)[0]+'! Bom te ver aqui!');
    set('dashboard-xp',current.xp.toLocaleString('pt-BR')+' XP');set('dashboard-level','Nível '+EcoDB.level(current.xp).level);
    const results=EcoDB.results(current.id);
    set('dashboard-games',results.filter(r=>r.game!=='quiz' && r.completed).length);
    set('dashboard-quizzes',results.filter(r=>r.game==='quiz').length);
    const earned={first:current.xp>0,water:results.some(r=>r.game==='jogo1' && r.points>0 || r.details.theme==='agua' && r.points>0),recycle:results.some(r=>r.game==='jogo2' && r.completed || r.details.theme==='reciclagem' && r.points>0),earth:results.some(r=>r.details.theme==='terrestres' && r.points>0),level:current.xp>=1000,guardian:current.xp>=3000};
    document.querySelectorAll('[data-award]').forEach(el=>{el.classList.toggle('is-earned',earned[el.dataset.award]);el.querySelector('small').textContent=earned[el.dataset.award]?'Conquistado!':'A conquistar';});
    set('dashboard-next',(1000-current.xp%1000).toLocaleString('pt-BR')+' XP para o próximo nível');set('dashboard-class',EcoDB.classes()[0]?.name || 'Nenhuma turma');
  };
  updateDashboard();window.addEventListener('eco:update',updateDashboard);window.addEventListener('storage',updateDashboard);
});
// Modais: acesso por teclado, Escape e retorno ao elemento que os abriu.
document.addEventListener('DOMContentLoaded', () => {
  let opener = null;
  const dialogs = Array.from(document.querySelectorAll('#modalODS, .modal-membro'));
  dialogs.forEach(dialog => {
    dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');
    const title=dialog.querySelector('h2');if(title){if(!title.id)title.id=dialog.id+'-title';dialog.setAttribute('aria-labelledby',title.id);}
    dialog.querySelector('button')?.setAttribute('aria-label','Fechar janela');
  });
  document.querySelectorAll('.membro[onclick]').forEach(card=>{
    card.setAttribute('role','button');card.tabIndex=0;
    card.addEventListener('keydown',event=>{if(['Enter',' '].includes(event.key)){event.preventDefault();card.click();}});
  });
  const active = () => dialogs.find(dialog=>dialog.classList.contains('active')||dialog.classList.contains('ativo'));
  document.addEventListener('click',event=>{
    if(event.target.closest('[onclick*="abrirModal"]')){
      opener=event.target.closest('[onclick]');const dialog=active();dialog?.querySelector('button')?.focus();
    }else if(event.target.closest('[onclick*="fechar"]'))opener?.focus();
  });
  document.addEventListener('keydown',event=>{
    const dialog=active();if(!dialog)return;
    if(event.key==='Escape'){
      if(typeof fecharModalODS==='function')fecharModalODS();
      if(typeof fecharTodosModais==='function')fecharTodosModais();
      opener?.focus();
    }
    if(event.key==='Tab'){
      const focusable=Array.from(dialog.querySelectorAll('button,a[href],input,select,[tabindex="0"]')).filter(el=>!el.disabled);
      const first=focusable[0],last=focusable[focusable.length-1];if(!first)return;
      if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}
    }
  });
});
