
/* Run at repo root: node test-v16.cjs
 * No Firebase connection or user data is touched.
 */
const fs=require('node:fs');
const assert=require('node:assert/strict');
const file=name=>fs.readFileSync(name,'utf8');
const stripExports=s=>s.replace(/^export /gm,'');
const cleanImports=s=>s.replace(/^import .*;\s*/gm,'');
function syntax(name){const text=file(name);new Function(stripExports(cleanImports(text)));console.log('✔ JavaScript syntax: '+name)}
['app-v16.js','backend-v16.js','mini-games-v16.js','question-bank-v14.js','curriculum-v14.js'].forEach(syntax);
const questions=file('question-bank-v14.js');
const courses=file('curriculum-v14.js');
const study=new Function(stripExports(questions)+'\n'+stripExports(cleanImports(courses))+';return {COURSES,PRODUCTS,LEVELS,esc,verifyCourseData,createReport};')();
study.verifyCourseData();
assert.equal(study.COURSES.length,15);
assert.equal(study.COURSES.reduce((n,c)=>n+c.q.length,0),150);
for(let n=0;n<15;n++){
 assert.equal(study.COURSES[n].q.length,10);
 assert.equal(new Set(study.COURSES[n].q.map(q=>q[1])).size,10);
 const report=study.createReport(n,{},['A','B','C']);
 assert(report.sections.every(p=>p&&!Array.isArray(p)&&typeof p.label==='string'&&typeof p.value==='string'));
}
console.log('✔ Curriculum: 15 chapters, 150 distinct questions, 15 Firestore-safe result formats');
const mini=new Function(stripExports(file('mini-games-v16.js'))+';return {renderMini,MINI_TYPES,safety};')();
let completed=0;
for(let chapter=0;chapter<15;chapter++)for(let slot=0;slot<5;slot++){
 let state={picked:[]},finished=false;
 const hooks={onSound(){},onChange(v){state=v},onFinish(){finished=true}};
 const play=v=>mini.renderMini(chapter,slot,state,hooks).apply(v);
 const type=mini.MINI_TYPES[(chapter+slot)%5];
 if(type==='sort')for(const x of mini.safety[chapter])play(x?'caution':'safe');
 if(type==='sequence'||type==='build')for(let i=0;i<3;i++)play('order-'+i);
 if(type==='memory')for(const i of [0,3,1,2])play('card-'+i);
 if(type==='verify')play('check');
 const screen=mini.renderMini(chapter,slot,state,hooks);
 assert(screen.done,chapter+':'+slot+' should finish');
 screen.apply('finish');assert(finished);
 completed++;
}
assert.equal(completed,75);
console.log('✔ Mini-games: all 75 simulated interaction paths reach completion');
const html=file('index-v16.html'),app=file('app-v16.js');
for(const m of app.matchAll(/\$\('([^']+)'\)/g)){
 const id=m[1];
 if(id==='studentIdea'||id==='downloadAll')continue; // generated dynamically
 assert(html.includes('id="'+id+'"'),'HTML missing #'+id);
}
const css=file('style-v16.css');
assert.equal(css.split('{').length,css.split('}').length,'unbalanced CSS rules');
for(const rule of ['.courseGrid','.microChoice','.editorGrid','.highContrast','.bonusGrid'])assert(css.includes(rule));
assert(html.includes('app-v16.js')&&html.includes('style-v16.css'));
console.log('✔ UI: all static DOM IDs present and CSS blocks balanced');
const rules=file('firestore-v16.rules');
for(const token of ['function teacher()','function own(uid)','settings/literacy','openClass(session)','request.resource.data.answers is map'])assert(rules.includes(token));
console.log('✔ Security rules: key student/teacher access structure present (server deployment must be checked separately)');
const appBody=cleanImports(app).split("$('classCheck').onclick=")[0];
const invoke=new Function('COURSES','PRODUCTS','LEVELS','createReport','verifyCourseData','esc','renderMini','api','playSound','toggleSound','isSoundOn',
 appBody+'\nreturn {set:(i,p)=>{active=i;picks=p;student={name:"test",id:"test",answers:{aiLiteracyV16:{completed:{}}}}},phase:()=>phase(),finish:(i)=>{student.answers.aiLiteracyV16.completed[String(i+1)]={title:"OK"}}};');
const h=invoke(study.COURSES,study.PRODUCTS,study.LEVELS,study.createReport,study.verifyCourseData,study.esc,mini.renderMini,{},()=>{},()=>{},()=>false);
for(let chapter=0;chapter<15;chapter++){
 const choices={};h.set(chapter,choices);
 assert.equal(h.phase(),'quiz:0');
 for(let q=0;q<10;q++){
  choices['q'+q]=study.COURSES[chapter].q[q][3];
  assert.equal(h.phase(),'explain:'+q);
  choices['seen'+q]=true;
  if(q%2===1){
   const miniIndex=Math.floor(q/2);
   assert.equal(h.phase(),'mini:'+miniIndex);
   choices['mini'+miniIndex]={done:true};
  }
  if(q<9)assert.equal(h.phase(),'quiz:'+(q+1));
 }
 for(let i=0;i<3;i++){assert.equal(h.phase(),'make:'+i);choices['field'+i]=1}
 assert.equal(h.phase(),'studio');choices.studioDone=true;
 assert.equal(h.phase(),'ready');h.finish(chapter);assert.equal(h.phase(),'complete');
}
console.log('✔ Learning flow: 15 complete chapter paths (quizzes → explanations → mini-games → creation → saved)');
console.log('ALL V16 STATIC/MOCK TESTS PASSED');
