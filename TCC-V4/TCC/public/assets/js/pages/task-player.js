document.addEventListener('DOMContentLoaded',()=>{
  const id=new URLSearchParams(location.search).get('assignment');if(!id)return;
  const user=EcoDB.current();if(!user || user.role!=='aluno')return;
  try{
    const task=EcoDB.assignment(id),page=document.body.dataset.page;
    const expected=task.kind==='game'?(task.resourceId==='jogo1'?'jogo1.html':'jogo2.html'):'quiz.html';
    if(page!==expected)throw Error('Abra a tarefa pela página Minhas tarefas.');
    const banner=document.createElement('section');banner.className='task-player-banner';
    const title=document.createElement('strong');title.textContent=task.title;
    const instructions=document.createElement('p');instructions.textContent=task.instructions || (task.kind==='game'?'Conclua o objetivo do jogo para finalizar a tarefa.':'Responda todas as perguntas para concluir a tarefa.');
    const back=document.createElement('a');back.href='/tarefas';back.textContent='← Minhas tarefas';banner.append(back,title,instructions);document.getElementById('main-content').prepend(banner);
    if(task.kind!=='game')startAssignedQuiz(task);
  }catch(e){
    const main=document.getElementById('main-content');main.replaceChildren();
    const message=document.createElement('p');message.textContent=e.message;
    const back=document.createElement('a');back.href='/tarefas';back.className='btn-principal';back.textContent='Voltar às tarefas';main.append(message,back);
  }
});
