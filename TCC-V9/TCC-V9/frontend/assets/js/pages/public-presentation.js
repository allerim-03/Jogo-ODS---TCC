document.addEventListener('DOMContentLoaded',()=>{
 document.querySelectorAll('.team-card').forEach(card=>{
  function flip(open){card.setAttribute('aria-expanded',String(open));card.classList.toggle('is-flipped',open);card.querySelector('.team-card-front').setAttribute('aria-hidden',String(open));card.querySelector('.team-card-back').setAttribute('aria-hidden',String(!open));const name=card.querySelector('.team-card-back>strong').textContent;card.setAttribute('aria-label',(open?'Voltar à foto de ':'Conhecer ')+name);}
  card.addEventListener('click',()=>flip(card.getAttribute('aria-expanded')!=='true'));
  card.addEventListener('keydown',e=>{if(e.key==='Escape')flip(false);});
 });
 document.querySelectorAll('[data-game-preview]').forEach(figure=>{
  const img=figure.querySelector('img');img.addEventListener('load',()=>{img.hidden=false;figure.querySelector('.game-preview-placeholder').hidden=true;figure.querySelector('figcaption').textContent='Cena do jogo';});
  img.addEventListener('error',()=>{img.hidden=true;figure.querySelector('.game-preview-placeholder').hidden=false;});
  img.src='/assets/img/game-previews/'+figure.dataset.gamePreview+'.png';
 });
});
