const samples={clean:`// A small, well-formed program
int score = 7;
float bonus = 2.5;
bool passed = true;
string message = "Keep learning!";
score = score + 3;
if (passed && score > 5) {
  print(message);
}
print(score);`,issues:`// Several semantic issues
int total;
int total = 4;
missing = total + 1;
int ratio = 8 / 0;
print(ratio);
int unused = 12;`,syntax:`// Missing a semicolon after the declaration
int count = 3
print(count);`};
const source=document.querySelector('#source'),numbers=document.querySelector('#numbers'),chars=document.querySelector('#chars'),content=document.querySelector('#content'),badge=document.querySelector('#badge'),summary=document.querySelector('#summary'),issueCount=document.querySelector('#issue-count'),tokenCount=document.querySelector('#token-count');let result=null,tab='issues';
function sync(){numbers.textContent=source.value.split('\n').map((_,i)=>i+1).join('\n');chars.textContent=source.value.length+' chars'}source.value=samples.clean;sync();source.addEventListener('input',sync);
function esc(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function tree(n,d=0){if(!n)return'';let label=n.kind;if(n.name)label+=' '+n.name;if(n.type)label+=' : '+n.type;if(n.op)label+=' '+n.op;if(n.kind==='Literal')label+=' = '+n.value;let html=`<div class="tree-line" style="--depth:${d}"><span class="tree-kind">${esc(n.kind)}</span> <span class="tree-value">${esc(label.slice(n.kind.length))}</span></div>`;for(const [k,v] of Object.entries(n)){if(['kind','name','type','op','line','value','literalType'].includes(k))continue;if(Array.isArray(v))v.forEach(x=>html+=tree(x,d+1));else if(v&&typeof v==='object')html+=tree(v,d+1)}return html}
function render(){if(!result)return;if(tab==='issues'){let errors=result.issues.filter(x=>x.severity==='error').length,warnings=result.issues.filter(x=>x.severity==='warning').length;issueCount.textContent=result.issues.length;content.innerHTML=result.issues.length?'<div class="issues">'+result.issues.map(x=>`<div class="issue ${x.severity}"><span class="issue-icon">${x.severity==='error'?'●':x.severity==='warning'?'▲':'●'}</span><div><div class="title">${esc(x.code)} · ${esc(x.title)}</div><div class="msg">${esc(x.message)}</div></div><span class="loc">${x.line}:${x.column}</span></div>`).join('')+'</div>':'<div class="no-issues"><b>✓ No issues found</b><p>Your program passed lexical, syntax, and semantic analysis.</p></div>';summary.textContent=`${errors} errors · ${warnings} warnings · ${result.issues.length-errors-warnings} info`;badge.className=errors?'error':warnings?'warning':'success';badge.textContent=errors?'ERRORS FOUND':warnings?'REVIEW WARNINGS':'PASSED'}else if(tab==='tokens'){content.innerHTML='<table class="token-table"><thead><tr><th>#</th><th>Type</th><th>Value</th><th>Location</th></tr></thead><tbody>'+result.tokens.map((t,i)=>`<tr><td>${i+1}</td><td>${esc(t.type)}</td><td>${esc(t.value)}</td><td>${t.line}:${t.column}</td></tr>`).join('')+'</tbody></table>';summary.textContent='Lexical analysis · '+result.tokens.length+' tokens'}else{content.innerHTML='<div class="tree">'+(result.ast?tree(result.ast):'<span>Syntax tree unavailable until syntax errors are fixed.</span>')+'</div>';summary.textContent='Recursive-descent parse tree'}}
function run(){result=CodeScopeAnalyzer.analyze(source.value);tab='issues';document.querySelectorAll('nav button').forEach(x=>x.classList.toggle('active',x.dataset.tab==='issues'));tokenCount.textContent=result.tokens.length;render()}
document.querySelector('#analyze').addEventListener('click',run);document.querySelector('#reset').addEventListener('click',()=>{source.value=samples.clean;document.querySelectorAll('.sample').forEach(x=>x.classList.toggle('selected',x.dataset.sample==='clean'));sync();result=null;content.innerHTML='<div class="empty"><b>⌁</b><strong>Ready when you are</strong><p>Write or load a sample program, then analyze it to see compiler diagnostics.</p></div>';summary.textContent='Run the analyzer to inspect your code';badge.className='';badge.textContent='READY';issueCount.textContent='—';tokenCount.textContent='—'});document.querySelectorAll('.sample').forEach(b=>b.addEventListener('click',()=>{source.value=samples[b.dataset.sample];document.querySelectorAll('.sample').forEach(x=>x.classList.toggle('selected',x===b));sync();run()}));document.querySelectorAll('nav button').forEach(b=>b.addEventListener('click',()=>{if(!result)return;tab=b.dataset.tab;document.querySelectorAll('nav button').forEach(x=>x.classList.toggle('active',x===b));render()}));source.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();run()}if(e.key==='Tab'){e.preventDefault();let a=source.selectionStart,z=source.selectionEnd;source.value=source.value.slice(0,a)+'  '+source.value.slice(z);source.selectionStart=source.selectionEnd=a+2;sync()}});
