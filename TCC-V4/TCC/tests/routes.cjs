const assert=require('node:assert/strict');
const {createServer}=require('../server.cjs');
const routes=require('../routes.json');
(async()=>{
 const server=createServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base='http://127.0.0.1:'+server.address().port;
 try {
  for(const [legacy,route] of Object.entries(routes)){
   const response=await fetch(base+route.url);assert.equal(response.status,200,route.url);
   const body=await response.text();assert(body.includes('data-page="'+legacy+'"'),route.url+' must render its own page');
   const resources=[...body.matchAll(/(?:src|href)="(\/(?:assets|games)\/[^"#]+)"/g)].map(m=>m[1]);
   for(const resource of resources){const asset=await fetch(base+resource);assert.equal(asset.status,200,resource);}
  }
  for(const path of ['/home.html','/index.html']){const r=await fetch(base+path,{redirect:'manual'});assert.equal(r.headers.get('location'),'/');}
  assert.equal((await fetch(base+'/missing')).status,404);
  assert.equal((await fetch(base+'/package.json')).status,404);
  assert.equal((await fetch(base+'/assets/js/services/mock-db.js')).headers.get('content-type'),'text/javascript; charset=utf-8');
  console.log('PASSOU: '+Object.keys(routes).length+' rotas, recursos, página pública, redirecionamentos antigos e respostas 404.');
 }finally{await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);process.exitCode=1});
