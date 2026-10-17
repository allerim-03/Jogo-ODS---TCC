process.chdir(require('node:path').resolve(__dirname, '..'));
const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{
 const eventTarget=new EventTarget(), reports=[];
 const canvas={width:800,height:450,getContext:()=>({clearRect(){}})};
 const context=vm.createContext({window:eventTarget,document:{getElementById:()=>canvas,fonts:{ready:Promise.resolve()}},Image:class{},CustomEvent,console,Math,requestAnimationFrame(){},setInterval(){},setTimeout(){}});
 eventTarget.EcoGame={maxPhase:1,start(){},finish(points,phase,completed){reports.push({points,phase,completed})}};
 const config=new vm.SourceTextModule(fs.readFileSync('public/games/recycle/src/config.js','utf8'),{context});
 const names=['desenharMenu','desenharSelecaoFases','desenharPartida','desenharMenuPausa','desenharGameOver','desenharVitoria','desenharTutorialInterativo','desenharConfig'];
 const render=new vm.SyntheticModule(names,function(){for(const n of names)this.setExport(n,()=>{})},{context});
 const controls=new vm.SyntheticModule([],function(){},{context});
 const main=new vm.SourceTextModule(fs.readFileSync('public/games/recycle/src/main.js','utf8'),{context});
 await main.link(name=>name==='./config.js'?config:name==='./render.js'?render:controls);await main.evaluate();
 main.namespace.carregarFase(1);const c=config.namespace;
 for(const bin of c.lixeirasAtivas)for(let i=0;i<4;i++){const lixo={sprite:bin.spriteInfo};c.listaLixos.push(lixo);eventTarget.dispatchEvent(new CustomEvent('lixoSoltoNaLixeira',{detail:{lixo,lixeira:bin}}));}
 assert.equal(c.estadoJogo,'VITORIA');assert.equal(c.pontos,280);assert.equal(c.fasesDesbloqueadas[2],true);assert.deepEqual(reports,[{points:280,phase:1,completed:true}]);
 c.setEstadoJogo('VITORIA');assert.equal(reports.length,1);
 main.namespace.carregarFase(2);c.setPontos(70);c.setVidas(1);const bin=c.lixeirasAtivas[0],wrong={sprite:c.lixeirasAtivas[1].spriteInfo};c.listaLixos.push(wrong);eventTarget.dispatchEvent(new CustomEvent('lixoSoltoNaLixeira',{detail:{lixo:wrong,lixeira:bin}}));assert.equal(c.estadoJogo,'GAMEOVER');assert.deepEqual(reports[1],{points:70,phase:2,completed:false});
 console.log('PASSOU: motor original do JOGO 2, coleta, vitória, desbloqueio de fase, derrota e emissão única de resultados.');
})().catch(e=>{console.error(e);process.exit(1)});
