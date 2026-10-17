document.addEventListener('DOMContentLoaded', () => {
  const db=EcoDB, user=db.current(), page=document.body.dataset.page;
  const teacher=page==='teacher-tasks.html';
  if(!user || (teacher ? user.role!=='professor' : user.role!=='aluno'||!user.classId))return;
  const $=selector=>document.querySelector(selector);
  const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const activities=[['quiz:agua','Quiz · Uso consciente da água'],['quiz:terrestres','Quiz · Vida terrestre'],['quiz:reciclagem','Quiz · Reciclagem'],['game:jogo1','JOGO 1 · Cuidado com a água'],['game:jogo2','JOGO 2 · ReciclaCoop']];
  const url=a=>(a.kind==='game'?(a.resourceId==='jogo1'?'/jogos/agua':'/jogos/reciclagem'):'/quizzes')+'?assignment='+encodeURIComponent(a.id);
  const notice=(id,text,error=false)=>{const el=$(id);el.textContent=text;el.className='eco-message'+(error?' is-error':'');};
  function render(){
    const tasks=db.assignments().slice().reverse();
    if(!teacher){
      $('#student-task-list').innerHTML=tasks.length?tasks.map(a=>`<article class="section-card task-card"><div class="task-card-heading"><span class="pill">${a.kind==='game'?'🎮 Jogo':'💡 Quiz'}</span><span class="task-state ${a.completed?'done':''}">${a.completed?'Concluída ✓':'Para fazer'}</span></div><h2>${escape(a.title)}</h2><p class="task-instructions">${escape(a.instructions || 'Complete a atividade para concluir esta tarefa.')}</p><a class="btn-principal" href="${url(a)}">${a.completed?'Jogar novamente':'Começar tarefa'} →</a></article>`).join(''):'<section class="section-card"><h2>Tudo tranquilo por aqui! </h2><p>Assim que seu professor atribuir uma tarefa, ela aparecerá nesta página.</p><a class="btn-outline" href="/jogos">Explorar os jogos</a></section>';
      return;
    }
    const classes=db.classes(),quizzes=db.myQuizzes();
    const previousClass=$('#task-class').value,previousResource=$('#task-resource').value;
    $('#task-class').innerHTML=classes.length?classes.map(c=>`<option value="${c.id}">${escape(c.name)}</option>`).join(''):'<option value="">Crie uma turma primeiro</option>';
    if(classes.some(c=>c.id===previousClass))$('#task-class').value=previousClass;
    $('#assign-task-form [type=submit]').disabled=!classes.length;
    $('#task-resource').innerHTML='<optgroup label="Atividades da plataforma">'+activities.map(([id,label])=>`<option value="${id}">${label}</option>`).join('')+'</optgroup>'+(quizzes.length?'<optgroup label="Meus quizzes autorais">'+quizzes.map(q=>`<option value="custom-quiz:${q.id}">${escape(q.title)}</option>`).join('')+'</optgroup>':'');
    if(Array.from($('#task-resource').options).some(o=>o.value===previousResource))$('#task-resource').value=previousResource;
    $('#my-quiz-list').innerHTML='<h3>Meus quizzes autorais</h3>'+(quizzes.length?'<ul>'+quizzes.map(q=>`<li><strong>${escape(q.title)}</strong> · ${q.questions.length} pergunta(s)</li>`).join('')+'</ul>':'<p>Os quizzes que você criar aparecerão aqui e na seleção de atividades.</p>');
    $('#teacher-task-list').innerHTML=tasks.length?tasks.map(a=>{
      const students=db.taskProgress(a.id),completed=students.filter(s=>s.completed).length;
      return `<article class="task-summary"><div class="task-card-heading"><h3>${escape(a.title)}</h3><span class="pill">${a.kind==='game'?'Jogo':'Quiz'}</span></div><p>${escape(classes.find(c=>c.id===a.classId)?.name || '')} · ${completed} de ${students.length} alunos concluíram</p><p class="task-instructions">${escape(a.instructions)}</p><details><summary>Ver alunos</summary>${students.length?'<ul>'+students.map(s=>`<li>${escape(s.name)} — ${s.completed?'Concluída ✓':'Pendente'}</li>`).join('')+'</ul>':'<p>A turma ainda não tem alunos.</p>'}</details></article>`;
    }).join(''):'<p>Nenhuma tarefa atribuída. Escolha uma turma e uma atividade acima.</p>';
  }
  if(teacher){
    let questionId=0;
    function renumber(){
      const questions=Array.from($('#author-questions').children);
      questions.forEach((el,i)=>{el.querySelector('legend').textContent='Pergunta '+(i+1);el.querySelector('.remove-question').disabled=questions.length===1;});
      $('#add-question').disabled=questions.length>=20;
    }
    function addQuestion(){
      if($('#author-questions').children.length>=20)return;
      const id=++questionId,card=document.createElement('fieldset');card.className='author-question';
      card.innerHTML=`<legend></legend><label class="form-label" for="question-${id}">Enunciado</label><textarea id="question-${id}" class="question-prompt" required maxlength="1000" rows="2"></textarea><p class="question-help">Preencha as alternativas e marque a resposta correta.</p><div class="author-options">${[0,1,2,3].map(i=>`<div class="author-option"><label><input type="radio" name="answer-${id}" value="${i}" required> ${String.fromCharCode(65+i)} correta</label><label class="visually-hidden" for="option-${id}-${i}">Texto da alternativa ${String.fromCharCode(65+i)}</label><input id="option-${id}-${i}" class="question-option" required maxlength="300" placeholder="Alternativa ${String.fromCharCode(65+i)}"></div>`).join('')}</div><button class="btn-outline remove-question" type="button">Remover pergunta</button>`;
      card.querySelector('.remove-question').addEventListener('click',()=>{card.remove();renumber();});$('#author-questions').append(card);renumber();
    }
    $('#add-question').addEventListener('click',()=>{addQuestion();$('#author-questions').lastElementChild.querySelector('textarea').focus();});addQuestion();
    $('#author-quiz-form').addEventListener('submit',event=>{
      event.preventDefault();if(!event.currentTarget.reportValidity())return;
      try{
        const quiz=db.createQuiz({title:$('#quiz-title').value,questions:Array.from($('#author-questions').children).map(card=>({q:card.querySelector('textarea').value,options:Array.from(card.querySelectorAll('.question-option')).map(o=>o.value),answer:Number(card.querySelector('input[type=radio]:checked')?.value)}))});
        $('#author-quiz-form').reset();$('#author-questions').replaceChildren();addQuestion();
        $('#task-resource').value='custom-quiz:'+quiz.id;$('#task-title').value=quiz.title;
        notice('#quiz-author-message','Quiz salvo! Selecione a turma no formulário acima e clique em “Atribuir à turma”.');
      }catch(e){notice('#quiz-author-message',e.message,true);}
    });
    $('#assign-task-form').addEventListener('submit',event=>{
      event.preventDefault();if(!event.currentTarget.reportValidity())return;
      try{
        const [kind,resourceId]=$('#task-resource').value.split(':');
        db.assignTask({classId:$('#task-class').value,title:$('#task-title').value,instructions:$('#task-instructions').value,kind,resourceId});
        $('#task-title').value='';$('#task-instructions').value='';notice('#assign-message','Tarefa atribuída! Os alunos da turma já podem acessá-la em “Minhas tarefas”.');
      }catch(e){notice('#assign-message',e.message,true);}
    });
  }
  window.addEventListener('eco:update',render);window.addEventListener('storage',render);render();
});
