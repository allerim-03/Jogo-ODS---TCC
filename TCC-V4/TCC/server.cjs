// Servidor estático e rotas da aplicação. Sem dependências externas.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const routes = require('./routes.json');
const publicRoot = path.join(__dirname, 'public');
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.gif':'image/gif','.svg':'image/svg+xml','.ttf':'font/ttf','.json':'application/json'};
function createServer() {
  return http.createServer((req,res) => {
    let pathname;
    try { pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname); } catch { res.writeHead(400); res.end('Endereço inválido'); return; }
    if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD'});res.end();return;}
    if(pathname.length > 1 && pathname.endsWith('/')){res.writeHead(302,{Location:pathname.slice(0,-1)});res.end();return;}
    // index.html é uma entrada pública; /app é o painel autenticado.
    const legacy = pathname.slice(1);
    if(routes[legacy]){res.writeHead(302,{Location:legacy==='index.html' ? '/' : routes[legacy].url});res.end();return;}
    const route = Object.values(routes).find(r => r.url === pathname);
    const file = path.resolve(publicRoot, route ? route.file : '.' + pathname);
    if(!file.startsWith(publicRoot + path.sep)){res.writeHead(404);res.end('Página não encontrada');return;}
    fs.readFile(file,(err,data)=>{
      if(err){fs.readFile(path.join(publicRoot,routes['erro404.html'].file),(e,body)=>{res.writeHead(404,{'Content-Type':types['.html']});res.end(body || 'Página não encontrada');});return;}
      res.writeHead(200,{'Content-Type':types[path.extname(file)] || 'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
      res.end(req.method === 'HEAD' ? undefined : data);
    });
  });
}
if(require.main === module){const server=createServer();server.listen(Number(process.env.PORT || 3000),'127.0.0.1',()=>console.log(`Cultivando o Saber: http://localhost:${server.address().port}`));}
module.exports={createServer};
