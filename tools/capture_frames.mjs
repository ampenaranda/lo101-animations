import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const req = createRequire('/Users/anapenaranda/Desktop/BARDUKE_MAC/MOTION/library/package.json'); const { chromium } = req('playwright-core');
const ROOT = process.cwd(), SP = process.argv[2]; const T = {'.html':'text/html','.mp4':'video/mp4','.jpg':'image/jpeg'};
const srv = http.createServer((q,r)=>{ let u=decodeURIComponent(q.url.split('?')[0]); if(u==='/host')return r.end(host(q.url)); const f=path.join(ROOT,u); if(!fs.existsSync(f)){r.writeHead(404);return r.end();} r.writeHead(200,{'Content-Type':T[path.extname(f)]||'x'}); fs.createReadStream(f).pipe(r); }).listen(8825);
const host = (u) => { const p = new URLSearchParams(u.split('?')[1]); const m=p.get('m'), lay=p.get('layout'), pb = lay==='phone'?115:41.67;
  return `<html><body style="margin:16px;background:#fff"><div style="max-width:${lay==='phone'?360:760}px;margin:auto"><div style="position:relative;padding-bottom:${pb}%;height:0;overflow:hidden;border-radius:16px"><iframe src="/index.html?m=${m}&layout=${lay}" style="position:absolute;inset:0;width:100%;height:100%;border:0"></iframe></div></div></body></html>`; };
const b = await chromium.launch({ executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless:true });
for (const [m,lay,t,rm] of [['W','wide',5.0,false],['M1','wide',4.6,false],['M2','wide',4.6,false],['M3','wide',4.4,false],['M4','wide',7.6,false],['M5','wide',4.6,false],['M6','wide',4.4,false],['M7','wide',4.4,false]]) {
  const ctx = await b.newContext({viewport:{width:lay==='phone'?392:800,height:lay==='phone'?480:360},deviceScaleFactor:2,reducedMotion:rm?'reduce':'no-preference'}); const p = await ctx.newPage();
  await p.goto(`http://127.0.0.1:8825/host?m=${m}&layout=${lay}`); await p.waitForTimeout(rm?1500:(t*1000+1200));
  const fr = p.frames().find(f=>f.url().includes('index.html')); const st = await fr.evaluate(()=>({t:+document.getElementById('v').currentTime.toFixed(1), on:[...document.querySelectorAll('.line.on')].map(e=>e.textContent), paused:document.getElementById('v').paused}));
  console.log(m,lay,rm?'reduced':'',JSON.stringify(st)); await p.screenshot({path:`${SP}/v3_${m}_${lay}_${t}${rm?"_rm":""}.png`}); await ctx.close(); }
await b.close(); srv.close();
