/* Formulários de autenticação; sessão mantida pelo servidor Python. */
document.addEventListener('DOMContentLoaded', async () => {
  try { await EcoAPI.ready; } catch { return; }
  const db=EcoAPI,page=document.body.dataset.page,$=s=>document.querySelector(s),value=s=>$(s)?.value||'',go=p=>location.href=EcoRoutes.url(p);
  function bindForm(selector, action){const form=$(selector);if(!form)return;form.addEventListener('submit',async event=>{event.preventDefault();if(!form.reportValidity())return;const button=form.querySelector('button:not([type]), [type=submit]');if(button)button.disabled=true;try{await action();}catch(error){let el=form.querySelector('[role=status]');if(!el){el=document.createElement('p');el.setAttribute('role','status');form.prepend(el);}el.textContent=error.message;}finally{if(button)button.disabled=false;}});}
  if (page === 'cadastro.html') {
    bindForm('#check-code',async ()=>{const c=await db.validateCode(value('#signup-code'));$('#class-confirmed').textContent='Turma: '+c.name;$('#form-cadastro').hidden=false;$('#check-code').hidden=true;$('#username').focus();});
  }
  if (page === 'cadastro.html') bindForm('#form-cadastro', async () => {
    await db.register({name:value('#username'), code:value('#signup-code'), password:value('#password'), role:'aluno'}); go('editar-perfil.html?onboarding=1');
  });
  if (page === 'cadastro-professor.html') bindForm('#form-cadastro-professor', async () => {
    await db.register({name:value('#name_user'), email:value('#main_email'), password:value('#password_user'), role:'professor'}); go('classroom.html');
  });
  if (['login.html','login-professor.html'].includes(page)) bindForm('form', async () => {
    const teacher = page === 'login-professor.html';
    const logged = await db.login(value(teacher ? '#email_prof' : '#email_aluno'), value(teacher ? '#senha_prof' : '#senha_aluno'), teacher ? 'professor' : 'aluno');
    go(teacher ? 'classroom.html' : logged.classId ? (logged.avatarChosen===false ? 'editar-perfil.html?onboarding=1' : 'index.html') : 'token.html');
  });

});
