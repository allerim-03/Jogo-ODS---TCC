// Regressão da separação entre entrada pública, matrícula e áreas por perfil.
const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const source=fs.readFileSync(path.join(__dirname,'../public/assets/js/core/app.js'),'utf8');
const routes=require('../routes.json');
const student={id:'student',role:'aluno',name:'Aluna',xp:0,classId:'class'};
const teacher={id:'teacher',role:'professor',name:'Gestora',xp:0};
function destination(page,user){
 const location={href:null};
 const context={location,document:{body:{dataset:{page}},querySelector:()=>null,querySelectorAll:()=>[],addEventListener:(name,fn)=>{if(name==='DOMContentLoaded')fn();}},window:{addEventListener(){}}};
 context.window.EcoDB={current:()=>user,level:()=>({level:1,progress:0})};
 context.EcoRoutes={url:value=>routes[value]?.url || value};
 vm.runInNewContext(source,context);return location.href;
}
for(const page of ['home.html','ods.html','sobrenos.html','escolha.html','cadastro.html'])assert.equal(destination(page,null),null,page+' must be public');
assert.equal(destination('index.html',null),'/entrar');
assert.equal(destination('index.html',student),null);
assert.equal(destination('index.html',{...student,classId:null}),'/turma/entrar');
assert.equal(destination('home.html',{...student,classId:null}),null);
assert.equal(destination('classroom.html',student),'/perfil');
assert.equal(destination('index.html',teacher),'/turmas');
assert.equal(destination('perfil.html',teacher),'/gestor/perfil');
assert.equal(destination('teacher-tasks.html',student),'/perfil');
assert.equal(destination('student-tasks.html',teacher),'/gestor/tarefas');
console.log('PASSOU: entrada pública sem login, matrícula pendente e navegação por perfil.');
