// Run: npm i jsdom (once), then: node platform/tests/feed-escape.test.js
// Checks the feed escaping in index.html with hostile rows; runs the page's own paintFeed.
const {JSDOM}=require('jsdom'); const fs=require('fs');
const html=fs.readFileSync(require('path').join(__dirname,'../../index.html'),'utf8').replace(/<script src=[^>]+><\/script>/,'');
const w=new JSDOM(html,{runScripts:'dangerously',beforeParse(w){w.supabase={createClient:()=>({from:()=>({insert:async()=>({}),select(){return this},eq(){return this},order:async()=>({data:[],error:null})})})};}}).window;
w.eval(`paintFeed([{headline:'<img src=x onerror=alert(1)>',category:'<b>x</b>',published_at:'2026-10-01',url:'javascript:alert(1)'},{headline:'ok',category:'c',published_at:'bad',url:'https://example.com/a?b="c"'},{headline:'h',category:'c',published_at:'2026-10-02',url:null}])`);
const g=w.document.getElementById('feedGrid'); const r=[];
r.push(['no injected elements', !g.querySelector('img,b')]);
r.push(['javascript: url not linked', ![...g.querySelectorAll('a')].some(a=>/^javascript/i.test(a.getAttribute('href')))]);
r.push(['https url linked with noopener', g.querySelector('a[href^="https://example.com/a"]')?.rel==='noopener noreferrer']);
r.push(['bad date does not throw', g.children.length===3]);
r.push(['text shown literally', g.textContent.includes('<img src=x onerror=alert(1)>')]);
for(const [n,ok] of r) console.log((ok?'PASS ':'FAIL ')+n); process.exit(r.every(x=>x[1])?0:1);
