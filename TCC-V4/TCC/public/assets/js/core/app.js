/* Integra as páginas existentes ao banco simulado. */
document.addEventListener('DOMContentLoaded', () => {
  const db = window.EcoDB, page = document.body.dataset.page || 'home.html';
  const $ = selector => document.querySelector(selector);
  const all = selector => Array.from(document.querySelectorAll(selector));
  const value = selector => $(selector)?.value || '';
  const text = (selector, content) => all(selector).forEach(el => el.textContent = content);
  const go = path => { location.href = EcoRoutes.url(path); };
  const safe = content => String(content).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function message(content, error = false, container = $('form') || $('main')) {
    let el = container.querySelector('.eco-message');
    if (!el) { el = document.createElement('p'); el.className = 'eco-message'; el.setAttribute('role', 'status'); el.setAttribute('aria-live','polite'); container.prepend(el); }
    el.classList.toggle('is-error',error); el.textContent = content;
  }
  function bindForm(selector, action) {
    const form = $(selector); if (!form) return;
    form.removeAttribute('action'); form.removeAttribute('method');
    form.addEventListener('submit', async event => {
      event.preventDefault(); if (!form.reportValidity()) return;
      const buttons = Array.from(form.querySelectorAll('[type=submit]')); buttons.forEach(b => b.disabled = true);
      try { await action(form); } catch(e) { message(e.message, true, form); }
      finally { buttons.forEach(b => b.disabled = false); }
    });
  }
  const publicPages = ['home.html','escolha.html','escolha-cadastro.html','cadastro.html','cadastro-professor.html','login.html','login-professor.html','erro404.html','ods.html','sobrenos.html'];
  let user = db.current();
  if (!publicPages.includes(page)) {
    if (!user) { go('escolha.html'); return; }
    if (['classroom.html','create_classroom.html','perfil-professor.html','teacher-tasks.html'].includes(page) && user.role !== 'professor') { go('perfil.html'); return; }
    if (page === 'student-tasks.html' && user.role !== 'aluno') { go('teacher-tasks.html'); return; }
    if (page === 'token.html' && user.role !== 'aluno') { go('classroom.html'); return; }
    if (user.role === 'aluno' && !user.classId && page !== 'token.html') { go('token.html'); return; }
    if (page === 'index.html' && user.role === 'professor') { go('classroom.html'); return; }
    if (page === 'perfil.html' && user.role === 'professor') { go('perfil-professor.html'); return; }
  }
  all('.escolha-card').forEach(card => {
    card.tabIndex = 0; card.setAttribute('role','link');
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); } });
  });
  all('.sair-sidebar, .btn-perigo, a').filter(el => el.matches('.sair-sidebar, .btn-perigo') || /sair/i.test(el.textContent)).forEach(el => el.addEventListener('click', e => { e.preventDefault(); db.logout(); go('home.html'); }));
  if (page === 'cadastro.html') bindForm('#form-cadastro', async () => {
    await db.register({name:value('#username'), email:value('#email'), password:value('#password'), confirm:value('#confirm_password'), role:'aluno'}); go('token.html');
  });
  if (page === 'cadastro-professor.html') bindForm('#form-cadastro-professor', async () => {
    await db.register({name:value('#name_user'), email:value('#main_email'), password:value('#password_user'), confirm:value('#confirm_password'), role:'professor', gender:value('#id_gender'), birth:value('#birth_user'), secondaryEmail:value('#personal_email'), discipline:value('#registration_user')}); go('classroom.html');
  });
  if (['login.html','login-professor.html'].includes(page)) bindForm('form', async () => {
    const teacher = page === 'login-professor.html';
    const logged = await db.login(value(teacher ? '#email_prof' : '#email_aluno'), value(teacher ? '#senha_prof' : '#senha_aluno'), teacher ? 'professor' : 'aluno');
    go(teacher ? 'classroom.html' : logged.classId ? 'index.html' : 'token.html');
  });
  if (page === 'token.html') {
    bindForm('#form-token', () => { db.joinClass(value('#token_codigo')); go('index.html'); });
    $('#token_codigo').addEventListener('input', e => e.target.value = e.target.value.replace(/\D/g,''));
  }
  if (page === 'create_classroom.html') bindForm('#form-cadastrar-turma', () => {
    const c = db.createClass({name:value('#nome-turma'), year:value('#ano-letivo'), period:value('#periodo-letivo'), discipline:value('#disciplina-turma'), description:value('#descricao-turma')}); go('classroom.html?turma=' + c.id);
  });
  const avatarURL = u => {
    if (u.avatar === 'tuga') return '/assets/images/TugaPqn.png';
    if (u.avatar === 'peixe') return '/assets/images/foto.png';
    const emoji = {leao:'🦁',macaco:'🐒',arara:'🦜',capivara:'🦦'}[u.avatar] || '🐢';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><text x="50" y="75" font-size="75" text-anchor="middle">${emoji}</text></svg>`);
  };
  if (page === 'editar-perfil.html') {
    $('#nome-usuario').value = user.name; $('#titulo-usuario').value = user.title;
    all('[name=avatar]').forEach(el => el.checked = el.value === user.avatar);
    if (user.role === 'professor') {
      const group = document.createElement('div'); group.className = 'form-grupo'; group.innerHTML = '<label for="disciplina-editar" class="form-label">Disciplina</label><input id="disciplina-editar" class="form-input">';
      $('.editar-acoes').before(group); $('#disciplina-editar').value = user.discipline;
      $('.btn-cancelar').href = '/gestor/perfil';
    }
    bindForm('.editar-form', () => { db.updateProfile({name:value('#nome-usuario'), title:value('#titulo-usuario'), avatar:value('[name=avatar]:checked'), discipline:value('#disciplina-editar')}); go(user.role === 'professor' ? 'perfil-professor.html' : 'perfil.html'); });
  }
  function updateCommon() {
    user = db.current(); if (!user) return;
    const level = db.level(user.xp);
    text('#saudacao-aluno, #saudacao-sidebar-prof', 'Olá, ' + user.name.split(/\s+/)[0] + '!');
    if ($('#disciplina-sidebar-prof')) $('#disciplina-sidebar-prof').style.display='block';
    text('#prof-nome', user.name); text('#prof-disciplina, #disciplina-sidebar-prof', user.discipline || 'Gestor de turmas');
    all('a[href="/perfil"]').forEach(a => { if (user.role === 'professor') a.href = '/gestor/perfil'; });
    text('.level .star, .badge-nivel:not(.badge-docente)', '★ NÍVEL ' + level.level);
    if (user.role === 'aluno') text('.perfil-sidebar p', 'Nível ' + level.level);
    text('.level .xp', level.progress + '/1000 XP'); text('.xp-valor', level.progress + ' / 1000 XP');
    all('.level .progress, .progress-perfil').forEach(el => { el.style.width = level.progress / 10 + '%'; el.parentElement.setAttribute('role','progressbar'); el.parentElement.setAttribute('aria-valuenow',level.progress); el.parentElement.setAttribute('aria-valuemin','0'); el.parentElement.setAttribute('aria-valuemax','1000'); });
    all('.foto-perfil, .perfil-avatar-main').forEach(img => img.src = avatarURL(user));
    if (['perfil.html','perfil-professor.html'].includes(page)) {
      text('.perfil-detalhes h2',user.name);
      text('.perfil-subtitulo', `${user.role === 'professor' ? user.discipline || 'Gestor de turmas' : user.title} | Cadastrado em ${new Date(user.createdAt).getFullYear()}`);
      const results = db.results(user.id), games = results.filter(r => r.game !== 'quiz' && r.completed), quizzes = results.filter(r => r.game === 'quiz');
      const stats = all('.stat-item strong');
      if (user.role === 'aluno') {
        if (stats[0]) stats[0].textContent = games.length;
        const questions = quizzes.reduce((n,r) => n + (r.details.total || 0),0), correct = quizzes.reduce((n,r) => n + (r.details.correct || 0),0);
        if (stats[1]) stats[1].textContent = questions ? Math.round(correct / questions * 100) + '%' : '0%';
        if (stats[2]) stats[2].textContent = '#' + (db.ranking().findIndex(u => u.id === user.id) + 1);
        text('.tuga-balao p', 'Continue aprendendo e conquiste novas estrelas na sua jornada!');
      } else {
        const classes = db.classes(), students = classes.flatMap(c => db.students(c.id));
        if (stats[0]) stats[0].textContent=classes.length;
        if (stats[1]) stats[1].textContent=students.length;
        if (stats[2]) stats[2].textContent=students.length ? Math.round(students.filter(u => u.xp > 0).length/students.length*100)+'%' : '0%';
        text('.prof-bio','Acompanhe suas turmas e o progresso dos alunos.');
        text('.tuga-balao p','Acesse Turmas para visualizar os tokens e o desempenho dos seus alunos.');
      }
    }
  }
  let studentRankingScope = "";
  function renderRanking() {
    const list = db.ranking(user.role === 'professor' ? value('#eco-ranking-filter') : studentRankingScope);
    text('.texto-ranking-topo h2', user.role === 'aluno' && studentRankingScope ? 'Ranking da minha turma' : 'Ranking global');
    ['first','second','third'].forEach((cls,i) => {
      const card = $('.podium-card.'+cls); if (!card) return; const u = list[i]; card.style.display = u ? '' : 'none';
      if (u) { card.querySelector('.podium-name').textContent=u.name; card.querySelector('.podium-xp').textContent=u.xp+' XP'; card.querySelector('img').src=avatarURL(u); }
    });
    $('.ranking-list').innerHTML = list.length ? list.map((u,i) => `<div class="ranking-item ${u.id === user.id ? 'current-user' : ''}"><span class="position">${i+1}º</span><img class="item-avatar" alt="Avatar" src="${safe(avatarURL(u))}"><span class="player-name">${safe(u.name)}${u.id === user.id ? ' (Você)' : ''}</span><span class="player-xp">${u.xp} XP</span></div>`).join('') : '<p style="padding:20px">Nenhum aluno nesta seleção.</p>';
  }
  if (page === 'ranking.html') {
    if(user.role === 'professor') {
      const filter=document.createElement('select'); filter.id='eco-ranking-filter'; filter.className='form-input'; filter.setAttribute('aria-label','Filtrar ranking por turma');
      filter.innerHTML='<option value="">Ranking global</option>'+db.classes().map(c => `<option value="${c.id}">${safe(c.name)}</option>`).join('');
      $('.ranking-container').prepend(filter); filter.addEventListener('change',renderRanking);
    } else {
      const choices=document.createElement('div');choices.className='ranking-switch';choices.setAttribute('role','group');choices.setAttribute('aria-label','Escolher ranking');
      [['','Global'],[user.classId,'Minha turma']].forEach(([scope,label])=>{
        const button=document.createElement('button');button.type='button';button.textContent=label;button.setAttribute('aria-pressed',String(scope===''));
        button.addEventListener('click',()=>{studentRankingScope=scope;choices.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));renderRanking();});choices.append(button);
      });
      $('.ranking-container').prepend(choices);
    }
    renderRanking();
  }
  function renderClassroom() {
    const classes=db.classes();
    all('#select-turma-token, #select-turma-desempenho').forEach(select => {
      const previous=select.value; select.innerHTML=classes.length ? classes.map(c => `<option value="${c.id}">${safe(c.name)}</option>`).join('') : '<option value="">Crie uma turma primeiro</option>';
      const target = previous || new URLSearchParams(location.search).get('turma'); if (classes.some(c => c.id === target)) select.value=target;
    });
    const tokenClass=classes.find(c => c.id === value('#select-turma-token'));
    text('#token-code',tokenClass?.token || '—');
    $('#btn-copiar-token').disabled=!tokenClass; $('#btn-gerar-novo-token').disabled=!tokenClass;
    const classId=value('#select-turma-desempenho'), students=classId ? db.students(classId) : [];
    $('#lista-alunos-body').innerHTML=students.length ? students.map(u => { const r=db.results(u.id); return `<tr><td><img src="${safe(avatarURL(u))}" width="40" alt="Avatar"></td><td>${safe(u.name)}</td><td>Nível ${db.level(u.xp).level}</td><td>${u.xp} XP</td><td>${r.filter(r => r.game === 'quiz').length}</td><td>${r.filter(r => r.game !== 'quiz' && r.completed).length}</td><td>${r.some(r => r.details.theme === 'terrestres' && r.points > 0) ? 'Concluído' : 'Pendente'}</td></tr>`; }).join('') : '<tr><td colspan="7">Nenhum aluno matriculado nesta turma.</td></tr>';
    const details=$('.teacher-details p'); if(details) details.textContent=(user.discipline || 'Gestor de turmas')+' | '+classes.length+' Turmas Ativas';
  }
  if (page === 'classroom.html') {
    // Esses controles não faziam parte do fluxo solicitado e ainda não têm implementação.
    const content=$('.conteudo-grid')?.closest('section'); if(content) content.remove();
    $('#select-turma-token').addEventListener('change',renderClassroom); $('#select-turma-desempenho').addEventListener('change',renderClassroom);
    $('#btn-gerar-novo-token').addEventListener('click', () => { try { db.rotateToken(value('#select-turma-token')); message('Novo token gerado. O código anterior deixou de permitir novos ingressos.', false, $('.section-card')); } catch(e) { message(e.message,true,$('.section-card')); } });
    $('#btn-copiar-token').addEventListener('click', async () => { try { await navigator.clipboard.writeText($('#token-code').textContent); message('Token copiado!',false,$('.section-card')); } catch { message('Selecione e copie o código exibido.',false,$('.section-card')); } });
    renderClassroom();
  }
  function refresh() { updateCommon(); if(page === 'ranking.html') renderRanking(); if(page === 'classroom.html') renderClassroom(); }
  window.addEventListener('eco:update',refresh); window.addEventListener('storage',refresh); refresh();
});
