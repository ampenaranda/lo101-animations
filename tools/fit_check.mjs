import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const req = createRequire('/Users/anapenaranda/Desktop/BARDUKE_MAC/MOTION/library/package.json'); const { chromium } = req('playwright-core');
const ROOT = process.cwd(); const T = {'.html':'text/html','.mp4':'video/mp4','.jpg':'image/jpeg'};
const srv = http.createServer((q,r)=>{ let u=decodeURIComponent(q.url.split('?')[0]); const f=path.join(ROOT,u); if(!fs.existsSync(f)){r.writeHead(404);return r.end();} r.writeHead(200,{'Content-Type':T[path.extname(f)]||'x'}); fs.createReadStream(f).pipe(r); }).listen(8826);
const b = await chromium.launch({ executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless:true, args:['--force-prefers-reduced-motion'] });
const bad = [];
for (const [lay, widths, ratio] of [['wide',[540,640,760],1/2.4],['phone',[300,360,420],1.15]]) for (const W of widths) for (const m of ['W','M1','M2','M3','M4','M5','M6','M7']) {
  const H = Math.round(W * (lay==='phone' ? ({W:1.20,M4:1.32}[m]||1.12) : ratio));
  const p = await (await b.newContext({viewport:{width:W,height:H},reducedMotion:'reduce'})).newPage();
  await p.goto(`http://127.0.0.1:8826/index.html?m=${m}&layout=${lay}`); await p.waitForTimeout(400);
  const r = await p.evaluate(() => { const c = document.getElementById('c').getBoundingClientRect(), w = document.getElementById('w'), wr = w.getBoundingClientRect();
    const v = document.getElementById('v').getBoundingClientRect(); const pills = [...w.children].map(e => e.getBoundingClientRect());
    return { overflowY: wr.top < c.top - 1 || wr.bottom > c.bottom + 1 || w.scrollHeight > w.clientHeight + 1, maxRight: Math.max(...pills.map(x => x.right)), cardW: c.width, fs: getComputedStyle(w).fontSize,
             rows: [...w.querySelectorAll('.pill')].map(e => Math.round(e.getBoundingClientRect().height)) }; });
  const tooWide = lay === 'wide' ? r.maxRight > r.cardW * 0.5 : r.maxRight > r.cardW - 4;
  const wrapped = r.rows.some(h => h > r.rows[0] * 1.5);
  if (r.overflowY || tooWide || wrapped) bad.push({lay, W, m, ...r, tooWide, wrapped});
  await p.context().close();
}
console.log(bad.length ? JSON.stringify(bad, null, 0) : 'ALL FIT'); await b.close(); srv.close();
