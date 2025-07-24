import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const allowed = new Set(['index.html','style.css',...['waves','physics','entities','game','input','render','main'].map(name=>`src/${name}.js`)]);
createServer(async(request,response)=>{
  try {
    const path = new URL(request.url,'http://localhost').pathname.slice(1) || 'index.html';
    if (request.method!=='GET' || !allowed.has(path)) {response.writeHead(404);response.end('Not found');return;}
    const file=await readFile(fileURLToPath(new URL(path,import.meta.url)));
    response.writeHead(200,{'content-type':path.endsWith('.html')?'text/html; charset=utf-8':path.endsWith('.css')?'text/css; charset=utf-8':'text/javascript; charset=utf-8','x-content-type-options':'nosniff'});response.end(file);
  } catch {response.writeHead(500);response.end('Unable to load game');}
}).listen(Number(process.env.PORT??8084),'127.0.0.1',()=>console.log('Campfire Surf ready on localhost'));
