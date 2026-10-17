const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{webcrypto}=require('node:crypto');
class Storage{constructor(){this.data=new Map()}getItem(k){return this.data.get(k)||null}setItem(k,v){this.data.set(k,String(v))}removeItem(k){this.data.delete(k)}}
const root=path.resolve(__dirname,'..');
const localStorage=new Storage(),sessionStorage=new Storage();
// Simula banco de uma versão anterior, sem as novas coleções.
localStorage.setItem('cultivando.db.v1',JSON.stringify({users:[],classes:[],results:[]}));
const context=vm.createContext({crypto:webcrypto,TextEncoder,localStorage,sessionStorage,Event,window:{dispatchEvent(){}}});
vm.runInContext(fs.readFileSync(path.join(root,'public/assets/js/services/mock-db.js'),'utf8'),context);const db=context.window.EcoDB;
const register=(email,role)=>db.register({email,role,name:email.split('@')[0],password:'teste123',confirm:'teste123'});
const classroom=name=>db.createClass({name,year:'2026',period:'anual',discipline:'Ciências',description:''});
(async()=>{
 const teacher=await register('prof@teste.com','professor'),c=classroom('Turma A');
 assert.throws(()=>db.createQuiz({title:'Inválido',questions:[]}),/perguntas/);
 assert.throws(()=>db.createQuiz({title:'Inválido',questions:[{q:'Questão',options:['A','A','B','C'],answer:0}]}),/diferentes/);
 assert.throws(()=>db.createQuiz({title:'Inválido',questions:[{q:'Questão',options:['A','B','C','D'],answer:4}]}),/correta/);
 const quiz=db.createQuiz({title:'Nossa aula',questions:[{q:'Qual material é reciclável?',options:['Papel limpo','Guardanapo sujo','Papel higiênico','Adesivo'],answer:0},{q:'Onde vai a garrafa plástica?',options:['Azul','Vermelha','Verde','Marrom'],answer:1}]});
 const custom=db.assignTask({classId:c.id,title:'Quiz da aula',kind:'custom-quiz',resourceId:quiz.id,instructions:'Responda com atenção.'});
 const builtin=db.assignTask({classId:c.id,title:'Água',kind:'quiz',resourceId:'agua'});
 const game=db.assignTask({classId:c.id,title:'Reciclagem',kind:'game',resourceId:'jogo2'});
 await register('outroprof@teste.com','professor');const otherClass=classroom('Turma B');
 assert.throws(()=>db.assignTask({classId:c.id,title:'Não permitido',kind:'game',resourceId:'jogo1'}),/turma sua/);
 assert.throws(()=>db.assignTask({classId:otherClass.id,title:'Não permitido',kind:'custom-quiz',resourceId:quiz.id}),/seus quizzes/);
 await register('alunoB@teste.com','aluno');db.joinClass(otherClass.token);assert.equal(db.assignments().length,0);assert.throws(()=>db.assignment(custom.id),/não está disponível/);
 const student=await register('alunoA@teste.com','aluno');db.joinClass(c.token);assert.equal(db.assignments().length,3);
 assert.throws(()=>db.createQuiz({title:'Aluno não pode',questions:[]}),/perfil correto/);
 assert.throws(()=>db.assignTask({classId:c.id,title:'Aluno não pode',kind:'game',resourceId:'jogo1'}),/perfil correto/);
 assert.throws(()=>db.recordResult({runId:'wrong',game:'jogo1',points:100,details:{assignmentId:custom.id}}),/não corresponde/);
 // Exercita o player real de quiz com perguntas autorais, inclusive deduplicação.
 const elements=new Map(),element=()=>({style:{},innerText:'',textContent:'',className:'',disabled:false,classList:{add(){}}});
 const options=Array.from({length:4},element);
 const player=vm.createContext({EcoDB:db,crypto:webcrypto,location:{},document:{getElementById:id=>{if(!elements.has(id))elements.set(id,element());return elements.get(id)},querySelectorAll:()=>options},setTimeout:fn=>fn()});
 vm.runInContext(fs.readFileSync(path.join(root,'public/assets/js/pages/quiz.js'),'utf8'),player);
 player.startAssignedQuiz(db.assignment(custom.id));player.selectOption(0);player.selectOption(1);
 assert.equal(db.current().xp,200);assert.equal(db.assignment(custom.id).completed,true);assert.equal(elements.get('final-score').innerText,200);
 player.showResults();assert.equal(db.current().xp,200);
 db.recordResult({runId:'ordinary-quiz',game:'quiz',points:300,details:{theme:'agua'}});assert.equal(db.assignment(builtin.id).completed,false);
 db.recordResult({runId:'assigned-quiz',game:'quiz',points:100,details:{theme:'agua',assignmentId:builtin.id}});assert.equal(db.assignment(builtin.id).completed,true);
 db.recordResult({runId:'game-loss',game:'jogo2',points:10,completed:false,details:{phase:1,assignmentId:game.id}});assert.equal(db.assignment(game.id).completed,false);
 db.recordResult({runId:'game-win',game:'jogo2',points:280,completed:true,details:{phase:1,assignmentId:game.id}});assert.equal(db.assignment(game.id).completed,true);
 await db.login('prof@teste.com','teste123','professor');assert.equal(db.taskProgress(custom.id)[0].completed,true);assert.equal(db.taskProgress(game.id)[0].id,student.id);assert.equal(db.myQuizzes().length,1);
 assert.equal(db.assignments().length,3);assert(!db.assignments().some(a=>a.classId===otherClass.id));
 console.log('PASSOU: migração, criação de quiz, validação de perguntas, permissões, atribuição por turma, player autoral e acompanhamento de conclusões.');
})().catch(error=>{console.error(error);process.exitCode=1});
