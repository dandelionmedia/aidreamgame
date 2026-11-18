
import * as api from './backend-v16.js';
import {COURSES,LEVELS,PRODUCTS,esc,createReport,verifyCourseData} from './curriculum-v14.js';
import {isSoundOn,toggleSound,playSound} from './sound-v11.js';
import {renderMini} from './mini-games-v16.js';
const $=id=>document.getElementById(id);
const SCHOOL={
 '1119':{day:'2026-11-19',label:'11월 19일',name:'마장아이꿈누리터'},
 '1120':{day:'2026-11-20',label:'11월 20일',name:'서울금북초등학교'},
 '1125':{day:'2026-11-25',label:'11월 25일',name:'서울행현초등학교'}
};
const PREFIX='ai-literacy-v16:';
const LS=s=>PREFIX+s;
const fieldExamples=[
 [['AI를 이용하는 물건','AI가 아닌 도구','두 종류를 구분하고 싶어요'],['사진 속 물건 분류','음성비서 기능','AI에게 말로 질문하기'],['AI도 틀릴 수 있어요','스스로 판단하지 않는 도구도 있어요','중요한 정보는 확인해요']],
 [['사진','음성','영상'],['고양이 그림','말한 내용을 글로','사진 속 물건 찾기'],['AI는 의미를 오해할 수 있어요','결과를 사람이 확인해요','사진처럼 보여도 사실 확인이 필요해요']],
 [['비밀번호','집 주소','친구 사진'],['입력하지 않아요','선생님께 확인해요','허락받은 정보만 사용해요'],['부모님 또는 보호자','선생님','믿을 수 있는 어른']],
 [['AI가 만든 뉴스','온라인 사진','친구가 전한 소문'],['교과서','학교 공식 홈페이지','믿을 만한 기관의 자료'],['확인 전 공유하지 않아요','출처를 확인해요','판단을 보류해요']],
 [['동화 만들기','AI 설명 듣기','공부 계획 세우기'],['초등학생','친구','선생님'],['번호 목록 3개','짧은 이야기 5문장','표로 정리하기']],
 [['동물 사진','탈것 그림','음식 분류'],['다양한 배경','여러 종류의 예시','정확한 라벨'],['다른 자료도 살펴요','한쪽으로 치우친 예시를 고쳐요','틀린 예시를 수정해요']],
 [['빨강·파랑 반복','2·4·6 숫자','계절 변화'],['다음 색 예측','다음 숫자 예측','내일 날씨 추측'],['실제 결과와 비교해요','다른 규칙도 찾아요','다시 계산해요']],
 [['친절한 동화 작가','과학을 알려주는 선생님','안전 전문가'],['꿈 이야기 만들기','AI 안전 수칙 알리기','우주 탐험 소개'],['초등학생이 이해하기 쉽게, 목록 3개','그림처럼 생생하게, 5문장','예시 2개 포함, 표로 정리']],
 [['내 캐릭터 그림','짧은 동화','AI 안전 포스터'],['직접 제목 정하기','내 의견 추가하기','그림 색 고르기'],['원작자 확인','사용 허락 확인','출처 표시']],
 [['팀원 추천','독서 추천','체험 기회 배분'],['모두에게 기회 주기','자료가 고른지 살피기','추천 이유 설명하기'],['선생님과 논의','추천 기준 수정','다른 의견도 듣기']],
 [['박쥐가 새라는 답','물은 어디서나 100도에 끓는다는 답','지구는 평평하다는 답'],['과학 교과서','박물관·연구기관','교육기관 자료'],['박쥐는 포유류','끓는점은 기압에 따라 달라짐','지구는 둥근 행성']],
 [['이야기 제목 추천','발표 계획 초안','그림 배경 아이디어'],['정확한 정보 확인','개인정보 보호','발표 결과 검토'],['교과서로 검증','선생님과 확인','출처를 밝히기']],
 [['출처 없는 그림','가짜 학교 공지','제작 방식이 불분명한 이미지'],['원본 링크 찾기','촬영 날짜 확인','공식 발표 비교'],['허락 없는 합성 금지','확인 전 공유 금지','가짜 사진을 사실처럼 소개하지 않기']],
 [['친구들을 위한 AI 안전 포스터','우리 반 AI 학습 안내서','AI를 설명하는 동화책'],['주제와 대상 정하기','AI로 초안 만들기','직접 수정하고 꾸미기'],['사실 확인','개인정보 보호','출처와 저작권 검토']],
 [['개인정보 지키기','근거 확인하기','내 생각으로 판단하기'],['친구에게 설명하기','AI 답변 함께 확인하기','안전한 사용법 발표하기'],['확인하고 사용하기','비밀번호 입력하지 않기','AI를 도구로 활용하기']]
];
let session='',student=null,active=-1,picks={},busy=false,watchStudentsStop=null,authTeacher=false,studentsCache=[];
let classroom={unlocked:15,paused:false,active:true,grade:'all',school:'',date:''},classStop=null,teacherControlStop=null,checkpointTimer=null,checkpointQueue=Promise.resolve();
function dateKST(){const parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());const values={};parts.forEach(p=>values[p.type]=p.value);return values.year+'-'+values.month+'-'+values.day}
function todaySession(){return Object.keys(SCHOOL).find(k=>SCHOOL[k].day===dateKST())||''}
function show(page){['joinPage','homePage','gamePage','teacherPage','portfolioPage'].forEach(id=>$(id).classList.toggle('hidden',id!==page));document.body.dataset.page=page;window.scrollTo({top:0,behavior:'smooth'})}
function toast(t){$('toast').textContent=t;$('toast').classList.remove('hidden');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').classList.add('hidden'),4000)}
function displaySchool(){displayClass()}
function results(){return student?.answers?.aiLiteracyV16?.completed||{}}
function doneCount(){return Object.values(results()).filter(x=>x&&x.title).length}
function progressNote(){const d=doneCount();$('progressLabel').textContent=d+' / 15 챕터 완료';$('progressFill').style.width=(d/15*100)+'%'}
function levelStatus(i){const done=!!results()[String(i+1)]?.title;const prior=i===0||!!results()[String(i)]?.title;return {done,available:done||(prior&&i+1<=classroom.unlocked&&!classroom.paused&&classroom.active!==false)}}
function paintHome(){
 show('homePage');
 $('welcome').textContent=(student?.name||'꿈 탐험가')+'의 AI 리터러시 모험';
 $('homeSchool').textContent=classroom.school||SCHOOL[session]?.name||'AI 게임 교실';
 if($('studentGrade'))$('studentGrade').textContent=gradeText();
 if($('pausedNotice'))$('pausedNotice').classList.toggle('hidden',!classroom.paused);
 progressNote();
 $('tierGrid').innerHTML=LEVELS.map((name,tier)=>'<div class="tier"><div class="tierHeader"><span>'+['🌱','🚀','🏆'][tier]+'</span><div><small>LEVEL '+(tier+1)+' · '+['기초','활용','심화'][tier]+'</small><h2>'+esc(name)+'</h2></div><strong>'+COURSES.filter((x,i)=>x.tier===tier&&!!results()[String(i+1)]).length+' / 5</strong></div><div class="courseGrid">'+COURSES.map((course,i)=>course.tier!==tier?'':(()=>{const x=levelStatus(i);return '<button type="button" class="course '+(x.done?'done':x.available?'':'locked')+'" data-course="'+i+'" '+(x.available?'':'disabled')+'><span class="courseIcon">'+course.icon+'</span><span class="courseNumber">MISSION '+String(i+1).padStart(2,'0')+'</span><strong>'+esc(course.title)+'</strong><small>'+esc(course.goal)+'</small><em>'+(x.done?'✅ 완료한 미션 다시 보기':x.available?'▶ 미션 시작':'🔒 앞 미션을 완료하세요')+'</em></button>'})()).join('')+'</div></div>').join('');
 $('tierGrid').querySelectorAll('[data-course]').forEach(b=>b.onclick=()=>openGame(Number(b.dataset.course)));
 $('finishedBadge').classList.toggle('hidden',doneCount()<15);
 if(doneCount()===15){$('finishedBadge').innerHTML='<div class="finishMedal">🏅</div><h2>AI 리터러시 마스터!</h2><p>15개 챕터의 탐험과 창작을 모두 완료했어요.</p><button type="button" id="downloadAll" class="cta">🏆 나의 수료증 이미지 저장</button>';$('downloadAll').onclick=()=>downloadCertificate();}
}
function draftKey(i){return LS(session+':'+student.id+':'+i)}
function openGame(i){
 if(!levelStatus(i).available)return toast('앞 미션을 먼저 완료해 주세요.');
 active=i;
 try{const local=JSON.parse(localStorage.getItem(draftKey(i))||'{}')||{},remote=student.answers?.aiLiteracyV16?.drafts?.[String(i+1)]||{};picks=Object.keys(remote).length>=Object.keys(local).length?{...remote}:{...local}}catch{picks={}}
 show('gamePage');paintGame();
}
function correctAnswers(){return COURSES[active].q.map((q,i)=>picks['q'+i]===q[3])}
function phase(){
 const done=results()[String(active+1)];
 if(done)return 'complete';
 const ans=correctAnswers();
 for(let i=0;i<ans.length;i++){if(!ans[i])return 'quiz:'+i;if(i%2===1&&!picks['mini'+Math.floor(i/2)]?.done)return 'mini:'+Math.floor(i/2)}
 for(let i=0;i<3;i++){if(picks['field'+i]===undefined)return 'make:'+i}
 if(!picks.studioDone)return 'studio';
 return 'ready';
}
function paintGame(){
 const data=COURSES[active],p=phase(),root=$('gameContent'),done=results()[String(active+1)],quiz=correctAnswers().filter(Boolean).length,make=[0,1,2].filter(i=>picks['field'+i]!==undefined).length,mini=[0,1,2,3,4].filter(i=>picks['mini'+i]?.done).length;
 $('gamePosition').textContent='MISSION '+String(active+1).padStart(2,'0')+' / 15';
 const progress=Math.round((quiz+make+mini+(picks.studioDone?1:0))/19*100);
 let html='<div class="gameHero"><div class="heroEmoji">'+data.icon+'</div><small>'+LEVELS[data.tier]+' · '+esc(data.type)+' 게임 · '+gradeText()+'</small><h2>'+esc(data.title)+'</h2><p>'+esc(data.goal)+'</p><div class="tinyBar"><span style="width:'+progress+'%"></span></div><small>이해 '+quiz+'/10 · 미니게임 '+mini+'/5 · 창작 '+(make+(picks.studioDone?1:0))+'/4</small></div>';
 if(p.startsWith('mini:')){
 const i=Number(p.split(':')[1]),state=picks['mini'+i]||{picked:[]};
 html+=renderMini(active,i,state,{onChange:()=>{},onFinish:()=>{},onSound:playSound}).html;
 }else if(p.startsWith('quiz:')){
  const i=Number(p.split(':')[1]),q=data.q[i],choice=picks['q'+i];html+='<div class="roundTitle">🎮 이해 게임 '+(i+1)+' / 10</div><div class="quizVisual">'+q[0]+'</div><h3 class="question">'+esc(q[1])+'</h3><div class="choices">'+q[2].map((x,k)=>'<button type="button" data-q="'+k+'" class="choice '+(choice===k?'selected':'')+'">'+['💡','🌟'][k]+' '+esc(x)+'</button>').join('')+'</div>';
  if(choice!==undefined){html+='<p class="feedback '+(choice===q[3]?'correct':'tryagain')+'">'+(choice===q[3]?'✅ 잘했어요! ':'🔍 다시 생각해 볼까요? ')+esc(q[4])+'</p>';}
 }else if(p.startsWith('make:')){
  const i=Number(p.split(':')[1]),meta=PRODUCTS[active],opts=fieldExamples[active][i];
  html+='<div class="roundTitle">🎨 나만의 창작 '+(i+1)+' / 3</div><h3 class="question">'+esc(meta[i+2])+'</h3><p class="minor">아래 카드 중 마음에 드는 하나를 골라요. 모든 선택이 나만의 작품에 들어갑니다.</p><div class="choices">'+opts.map((v,k)=>'<button type="button" class="choice" data-field="'+k+'"><span class="choiceIcon">'+['🌟','💜','🚀'][k]+'</span> '+esc(v)+'</button>').join('')+'</div>';
 }else if(p==='studio'){
  const title=PRODUCTS[active][1],chosen=fieldExamples[active].map((opts,i)=>opts[picks['field'+i]||0]);
  html+='<div class="roundTitle">✏️ 나만의 작품 만들기 · 최종 실습</div><h3 class="question">내 생각을 한 문장으로 추가해 볼까요?</h3>';
  html+='<p class="minor">'+(classroom.grade==='low'?'말로 생각해 보고 선생님의 도움을 받아 입력하거나, 그냥 완성해도 좋아요.':classroom.grade==='high'?'AI에 도움을 부탁한 뒤 내가 확인할 내용과 보완할 점을 써 보세요.':'선택한 내용을 보고 나의 생각을 더해 보세요.')+'</p>';
  html+='<div class="studioPreview"><h3>'+esc(title)+'</h3>'+chosen.map((v,i)=>'<p><b>'+esc(PRODUCTS[active][i+2])+'</b> '+esc(v)+'</p>').join('')+'</div>';
  html+='<label for="studentIdea">나만의 아이디어 (선택, 최대 200자)</label><textarea id="studentIdea" rows="4" maxlength="200" placeholder="예: 저는 친구가 AI의 답을 그대로 믿지 않도록 알려주고 싶어요.">'+esc(picks.studentIdea||'')+'</textarea>';
  html+='<button type="button" class="cta" data-action="finishStudio">✅ 내 작품 완성하기</button>';
 }else{
  const report=done||createReport(active,picks,fieldExamples[active].map((opts,i)=>opts[picks['field'+i]||0]));
  if(!done&&picks.studentIdea)report.sections.push({label:'내가 직접 작성한 생각',value:String(picks.studentIdea).slice(0,200)});
  html+='<div class="roundTitle">'+(done?'✅ 완료한 챕터':'🏆 완성한 작품')+'</div><div class="report"><div class="reportStamp">'+PRODUCTS[active][0]+'</div><h2>'+esc(report.title)+'</h2><p>탐험가: '+esc(student.name)+'</p>'+report.sections.map(x=>'<div class="reportPart"><b>'+esc(x.label)+'</b><span>'+esc(x.value)+'</span></div>').join('')+'</div>';
  html+=done?'<button class="cta" data-action="download">🖼️ 내 결과물 PNG 저장</button><button class="secondaryAction" data-action="home">🗺️ 탐험 지도로 돌아가기</button>':'<button class="cta" data-action="save">💾 내 작품 저장하고 미션 완료</button>';
 }
 root.innerHTML=html;
 if(p.startsWith('mini:')){
 const i=Number(p.split(':')[1]),state=picks['mini'+i]||{picked:[]};
 const game=renderMini(active,i,state,{onChange:updated=>{picks['mini'+i]=updated;persistDraft();paintGame()},onFinish:()=>{picks['mini'+i]={...state,done:true};persistDraft();playSound('success');reward('미니 게임 성공!');paintGame()},onSound:playSound});
 root.querySelectorAll('[data-mini]').forEach(b=>b.onclick=()=>game.apply(b.dataset.mini));
}
root.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{const v=Number(b.dataset.q),i=Number(p.split(':')[1]);picks['q'+i]=v;const correct=v===data.q[i][3];if(!correct){picks.misses={...(picks.misses||{}),['q'+i]:(picks.misses?.['q'+i]||0)+1}}playSound(correct?'correct':'wrong');persistDraft();paintGame()});
 root.querySelectorAll('[data-field]').forEach(b=>b.onclick=()=>{const i=Number(p.split(':')[1]);picks['field'+i]=Number(b.dataset.field);persistDraft();playSound('correct');paintGame()});
 root.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>{const k=b.dataset.action;if(k==='finishStudio'){picks.studentIdea=($('studentIdea')?.value||'').trim().slice(0,200);picks.studioDone=true;persistDraft();playSound('success');paintGame()}else if(k==='save')saveCompleted();else if(k==='download')downloadReport(done);else paintHome()});
}

function reward(text){
 const el=$('reward');if(!el)return;
 el.textContent='🌟 '+text+' 🌟';el.classList.remove('hidden');el.classList.remove('rewardAnimate');void el.offsetWidth;el.classList.add('rewardAnimate');setTimeout(()=>el.classList.add('hidden'),1600);
}
function persistDraft(){
 if(!student||active<0)return;
 try{localStorage.setItem(draftKey(active),JSON.stringify(picks))}catch{}
 clearTimeout(checkpointTimer);checkpointTimer=setTimeout(()=>checkpointNow(),850);
}
function checkpointNow(){
 if(!student||active<0)return checkpointQueue;
 const uid=student.id,code=session,k=String(active+1);
 const payload={...(student.answers?.aiLiteracyV16||{}),completed:{...results()},drafts:{...(student.answers?.aiLiteracyV16?.drafts||{}),[k]:JSON.parse(JSON.stringify(picks))}};
 checkpointQueue=checkpointQueue.catch(()=>{}).then(async()=>{
  await api.checkpointStudent(code,uid,payload);
  if(student?.id===uid&&session===code)student.answers={...(student.answers||{}),aiLiteracyV16:payload};
 }).catch(e=>{console.warn('checkpoint',e);const info=$('saveInfo');if(info)info.textContent='⚠️ 서버 임시 저장 실패 · 이 기기에는 임시 보관됨';});
 return checkpointQueue;
}
function flushDraft(){clearTimeout(checkpointTimer);return checkpointNow()}
function gradeText(){return {low:'🌈 저학년',mid:'🧠 중학년',high:'🚀 고학년',all:'🌟 전체 학년'}[classroom.grade]||'전체 학년'}
function displayClass(){
 const school=classroom.school||SCHOOL[session]?.name||'수업 코드를 입력해 주세요';
 $('schoolName').textContent=school+(classroom.date?' · '+classroom.date:'')+(session?' · 코드 '+session:'');
 $('join').disabled=!session||classroom.active===false;
 $('studentName').disabled=!session||classroom.active===false;
 if($('classStatus'))$('classStatus').textContent=classroom.paused?'⏸ 수업 일시정지':classroom.active===false?'🔒 수강 등록 중지':'🎮 '+classroom.unlocked+' / 15단계 공개 · '+gradeText();
 if($('studentGrade'))$('studentGrade').textContent=gradeText();
}
async function applyCode(code,silent=false){
 const normalized=String(code||'').trim().toUpperCase();
 if(!/^[A-Z0-9]{4,8}$/.test(normalized)){if(!silent)toast('수업 코드를 4~8자로 입력하세요.');return false}
 try{
  const result=await api.findLiteracyClassroom(normalized);
  if(!result){if(!silent)toast('수업을 찾을 수 없어요.');return false}
  session=normalized;classroom={...classroom,...result};
  $('classCode').value=normalized;localStorage.setItem(LS('lastClass'),normalized);
  displayClass();return true;
 }catch(e){if(!silent)toast('수업 확인 실패: '+e.message);return false}
}
function subscribeClass(){
 if(classStop){classStop();classStop=null}
 if(!student||!session)return;
 classStop=api.watchLiteracyClassroom(session,c=>{
  classroom={...classroom,...c};displayClass();
  if(!$('homePage').classList.contains('hidden'))paintHome();
  if(!$('gamePage').classList.contains('hidden')&&active>=0&&!levelStatus(active).available){toast('선생님이 챕터를 잠갔어요.');paintHome()}
 },e=>{console.warn('class control',e);$('classStatus').textContent='⚠️ 수업 제어 서버 설정 확인 필요'});
}
function positionOf(s){
 const v=s.answers?.aiLiteracyV16||{},n=Object.keys(v.completed||{}).length,i=n+1;
 if(i>15)return '완주';
 const answers=v.drafts?.[String(i)]||{};
 return i+'장 · '+Object.keys(answers).filter(k=>/^q\d+$/.test(k)).length+'/10문항';
}
function renderPortfolio(){
 if(!student)return;show('portfolioPage');
 const collection=results();$('portfolioItems').innerHTML=COURSES.map((c,i)=>{
  const record=collection[String(i+1)];if(!record?.title)return '';
  return '<div class="portfolioItem"><span class="portfolioEmoji">'+c.icon+'</span><div><strong>'+esc(record.title)+'</strong><p>'+esc(c.title)+'</p></div><button class="secondaryAction" data-save-report="'+i+'">PNG</button></div>';
 }).join('')||'<p class="hint">완성한 작품이 없습니다. 첫 번째 챕터부터 도전해 보세요.</p>';
 $('portfolioItems').querySelectorAll('[data-save-report]').forEach(b=>b.onclick=()=>downloadReport(collection[String(Number(b.dataset.saveReport)+1)]));
}
function readCurrentQuestion(){
 if(!('speechSynthesis' in window))return toast('이 브라우저에는 음성 읽기 기능이 없어요.');
 speechSynthesis.cancel();
 const root=$('gameContent'),words=[root.querySelector('.question')?.textContent,root.querySelector('.microPrompt')?.textContent,...[...root.querySelectorAll('.choice,.microChoice')].map(x=>x.textContent)].filter(Boolean).join('. ');
 const u=new SpeechSynthesisUtterance(words||COURSES[active]?.goal||'AI 탐험');u.lang='ko-KR';u.rate=classroom.grade==='low'?.84:.95;
 speechSynthesis.speak(u);
}
function setTeacherFields(c){
 $('classSchool').value=c.school||SCHOOL[c.code]?.name||'';
 $('classDate').value=c.date||SCHOOL[c.code]?.day||new Date().toISOString().slice(0,10);
 $('classUnlock').value=String(c.unlocked||1);$('classPaused').checked=!!c.paused;$('classActive').checked=c.active!==false;
 $('classGrade').value=c.grade||'all';$('classLiveStatus').textContent=c.configured?'🟢 실시간 설정 연결':'⚠️ 서버 규칙 설정이 아직 없어요';
}
async function saveClassSettings(){
 const code=$('sessionTeacher').value.trim().toUpperCase(),values={school:$('classSchool').value,date:$('classDate').value,unlocked:Number($('classUnlock').value),paused:$('classPaused').checked,active:$('classActive').checked,grade:$('classGrade').value};
 $('saveTeacherClass').disabled=true;
 try{await api.saveLiteracyClassroom(code,values);toast('✅ 수업 설정 저장 완료 · 학생에게 반영됩니다.')}
 catch(e){toast('수업 설정 저장 실패: '+e.message)}
 finally{$('saveTeacherClass').disabled=false}
}

async function saveCompleted(){
 if(busy||!student)return;busy=true;
 const btn=$('gameContent').querySelector('[data-action="save"]');if(btn)btn.disabled=true;
 const report=createReport(active,picks,fieldExamples[active].map((opts,i)=>opts[picks['field'+i]||0]));
 if(picks.studentIdea)report.sections.push({label:'내가 직접 작성한 생각',value:String(picks.studentIdea).slice(0,200)});
 await flushDraft();
 const record={...(student.answers?.aiLiteracyV16||{}),completed:{...results(),[String(active+1)]:report}};
 const doc={...(student.answers||{}),aiLiteracyV16:record};
 try{
  await api.checkpointStudent(session,student.id,record);
  student={...student,answers:doc};localStorage.removeItem(draftKey(active));playSound('success');reward('챕터 완료!');toast('🎉 작품 저장 완료! 다음 챕터가 열렸어요.');paintGame();
 }catch(err){toast('저장 실패: '+err.message);if(btn)btn.disabled=false}
 finally{busy=false}
}
function drawPicture(name,title,lines){
 const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=1700;const g=canvas.getContext('2d');if(!g)throw Error('이미지 저장을 지원하지 않는 기기예요.');
 const grad=g.createLinearGradient(0,0,1200,1700);grad.addColorStop(0,'#1a2865');grad.addColorStop(1,'#7e63ea');g.fillStyle=grad;g.fillRect(0,0,1200,1700);
 g.fillStyle='#fff';g.beginPath();if(typeof g.roundRect==='function'){g.roundRect(56,65,1088,1565,35)}else{g.rect(56,65,1088,1565)}g.fill();g.textBaseline='top';g.fillStyle='#6652c8';g.font='bold 30px sans-serif';g.fillText('AI LITERACY · 유쌤클래스',102,115);
 g.fillStyle='#23326f';g.font='bold 50px sans-serif';g.fillText(title.slice(0,19),102,188);
 g.font='bold 33px sans-serif';g.fillText('탐험가: '+name.slice(0,14),102,277);
 let y=375;
 function wrapped(text,x,width,size=28,lineHeight=41,max=4){
  g.font=size+'px sans-serif';let line='',used=0;
  for(const ch of String(text)){if(g.measureText(line+ch).width>width&&line){g.fillText(line,x,y);y+=lineHeight;line='';if(++used>=max)return;}line+=ch}
  if(line){g.fillText(line,x,y);y+=lineHeight}
 }
 for(const [label,value] of lines.slice(0,8)){
  if(y>1440)break;
  g.fillStyle='#6455b3';g.font='bold 29px sans-serif';wrapped(label,108,970,29,42,2);y+=7;
  g.fillStyle='#253568';wrapped(value,108,950,27,40,5);y+=35;
 }
 g.fillStyle='#7f86aa';g.font='22px sans-serif';g.fillText('배우고 실행하는 AI · 나의 창작 결과',102,1555);
 const link=document.createElement('a');link.href=canvas.toDataURL('image/png');link.download='AI리터러시_'+title.replace(/[^가-힣a-zA-Z0-9]/g,'').slice(0,16)+'.png';document.body.append(link);link.click();link.remove();
}
function downloadReport(report){try{drawPicture(student.name,report.title,report.sections.map(x=>[x.label,x.value]));playSound('success')}catch(err){toast(err.message)}}
function downloadCertificate(){try{drawPicture(student.name,'AI 리터러시 마스터 수료증',[['교육과정','기초 5개 · 핵심 활용 5개 · 심화 5개'],['완성 미션','15개 챕터의 총 285개 학습 활동'],['나의 약속','AI의 답변을 확인하고 사람의 책임을 지켜요.']]);playSound('success')}catch(e){toast(e.message)}}
async function init(){
 verifyCourseData();
 session=todaySession();show('joinPage');$('join').disabled=true;$('studentName').disabled=true;
 const preferred=new URLSearchParams(location.search).get('class')||localStorage.getItem(LS('lastClass'))||session;
 if(preferred)$('classCode').value=preferred;
 displaySchool();
 $('sound').textContent=isSoundOn()?'🔊 효과음 켜짐':'🔇 효과음 꺼짐';
 try{
  await Promise.race([api.connect(),new Promise((_,reject)=>setTimeout(()=>reject(new Error('연결 시간이 초과되었습니다.')),12000))]);
  $('connection').textContent=api.live?'🟢 실시간 연결':'🧪 연습 모드';
  $('demoSelect').classList.toggle('hidden',api.live);
  if(!api.live&&!preferred){session=$('demoSchool').value}
  if(preferred)await applyCode(preferred,true);else if(session)await applyCode(session,true);
  displaySchool();
  if(session){
   const saved=localStorage.getItem(LS('active:'+session));
   if(saved){const restored=await api.restoreStudent(session,saved);if(restored){student=restored;subscribeClass();paintHome();return}}
  }
 }catch(e){$('connection').textContent='🔴 연결 오류';$('join').disabled=true;$('studentName').disabled=true;$('alert').classList.remove('hidden');$('alert').textContent='Firebase 연결을 확인해 주세요: '+e.message;console.error(e)}
}
async function join(){
 if(!session||busy)return;const name=$('studentName').value.trim().replace(/[<>\\]/g,'').slice(0,14);
 if(!name)return toast('친구들이 볼 별명을 입력해 주세요.');
 busy=true;$('join').disabled=true;
 try{student=await api.registerStudent(session,name);localStorage.setItem(LS('active:'+session),student.id);subscribeClass();paintHome();toast('✨ AI 리터러시 모험에 오신 것을 환영해요!')}
 catch(e){toast('등록 실패: '+e.message)}
 finally{busy=false;$('join').disabled=!session}
}
async function changeStudent(){
 if(!confirm('다른 탐험가로 시작할까요? 기존 학생의 기록은 보존됩니다.'))return;
 if(classStop){classStop();classStop=null}await api.switchStudent();localStorage.removeItem(LS('active:'+session));student=null;$('studentName').value='';displaySchool();show('joinPage')
}
function teacherView(){show('teacherPage')}
async function teacherLogin(){
 try{
  $('loginTeacher').disabled=true;
  await api.teacherLogin($('teacherEmail').value.trim(),$('teacherPassword').value);
  authTeacher=true;$('teacherForm').classList.add('hidden');$('teacherDashboard').classList.remove('hidden');
  $('sessionTeacher').value=session||'1119';watchTeacher();
 }catch(e){toast('강사 로그인 실패: '+e.message)}
 finally{$('loginTeacher').disabled=false}
}
function watchTeacher(){
 if(watchStudentsStop){watchStudentsStop();watchStudentsStop=null}
 const key=$('sessionTeacher').value.trim().toUpperCase();
 if(!/^[A-Z0-9]{4,8}$/.test(key))return toast('수업 코드를 확인해 주세요.');
 if(teacherControlStop){teacherControlStop();teacherControlStop=null}
 teacherControlStop=api.watchLiteracyClassroom(key,setTeacherFields,e=>toast('수업 설정 조회 실패: '+e.message));
 watchStudentsStop=api.watchStudents(key,rows=>{studentsCache=rows;drawTeacher(rows)},e=>toast('학생 조회 오류: '+e.message))
}
function drawTeacher(rows){
 const total=rows.length,records=rows.map(x=>({student:x,completed:x.answers?.aiLiteracyV16?.completed||{}}));
 $('teacherStats').innerHTML='<div class="teacherMetric"><strong>'+total+'</strong><span>등록 학생</span></div><div class="teacherMetric"><strong>'+records.filter(x=>Object.keys(x.completed).length===15).length+'</strong><span>전체 완주 학생</span></div><div class="teacherMetric"><strong>'+records.reduce((n,x)=>n+Object.keys(x.completed).length,0)+'</strong><span>완료한 챕터 총합</span></div><div class="teacherMetric"><strong>'+records.reduce((n,x)=>n+Object.values(x.student.answers?.aiLiteracyV16?.drafts||{}).reduce((m,d)=>m+Object.values(d.misses||{}).reduce((q,v)=>q+Number(v||0),0),0),0)+'</strong><span>현재 기록된 오답 시도</span></div>';
 $('teacherLevels').innerHTML=COURSES.map((c,i)=>{const n=records.filter(x=>x.completed[String(i+1)]?.title).length;return '<div class="teacherLevel"><span>'+c.icon+' '+esc(c.title)+'</span><strong>'+n+'명</strong><div class="tinyBar"><span style="width:'+(total?n/total*100:0)+'%"></span></div></div>'}).join('');
 $('teacherStudents').innerHTML=rows.slice().sort((a,b)=>Object.keys(b.answers?.aiLiteracyV16?.completed||{}).length-Object.keys(a.answers?.aiLiteracyV16?.completed||{}).length).map(x=>'<div class="teacherStudent"><strong>'+esc(x.name)+'</strong><span>새 교육과정 '+Object.keys(x.answers?.aiLiteracyV16?.completed||{}).length+' / 15 · '+positionOf(x)+'</span><button class="danger" type="button" data-delete="'+esc(x.id)+'" data-name="'+esc(x.name)+'">이 학생 삭제</button></div>').join('')||'<p>등록한 학생이 없습니다.</p>';
 $('teacherStudents').querySelectorAll('[data-delete]').forEach(b=>b.onclick=async()=>{
  const key=$('sessionTeacher').value;
  if(!confirm('['+(SCHOOL[key]?.name||key)+'] '+b.dataset.name+' 학생의 모든 기록을 삭제할까요? 복구할 수 없습니다.'))return;
  b.disabled=true;try{await api.deleteStudentRecord(key,b.dataset.delete);toast('학생 기록을 삭제했습니다.')}catch(e){toast('삭제 실패: '+e.message);b.disabled=false}
 });
}
async function clearClass(){
 const k=$('sessionTeacher').value;
 if(!confirm((SCHOOL[k]?.name||k)+' 수업의 모든 학생 기록을 삭제할까요? 이 작업은 되돌릴 수 없습니다.'))return;
 if(prompt('전체 삭제하려면 정확히 입력: 초기화 '+k)!=='초기화 '+k)return toast('삭제를 취소했습니다.');
 $('clearClass').disabled=true;
 try{const total=await api.clearSessionStudents(k);toast('전체 학생 '+total+'명의 기록을 삭제했습니다.')}catch(e){toast('초기화 실패: '+e.message)}finally{$('clearClass').disabled=false}
}
async function teacherLogout(){
 if(watchStudentsStop){watchStudentsStop();watchStudentsStop=null}
 if(teacherControlStop){teacherControlStop();teacherControlStop=null}
 await api.teacherLogout();authTeacher=false;$('teacherDashboard').classList.add('hidden');$('teacherForm').classList.remove('hidden');student=null;
 show('joinPage');displaySchool();toast('강사 로그아웃 완료')
}
$('classCheck').onclick=async()=>{if(await applyCode($('classCode').value))toast('수업을 확인했습니다. 별명으로 입장해 주세요.')};
$('classCode').onkeydown=e=>{if(e.key==='Enter')$('classCheck').click()};
$('join').onclick=join;$('studentName').onkeydown=e=>{if(e.key==='Enter')join()};
$('returnHome').onclick=paintHome;
$('portfolioOpen').onclick=renderPortfolio;$('portfolioClose').onclick=paintHome;
$('readQuestion').onclick=readCurrentQuestion;
$('contrast').onclick=()=>{document.body.classList.toggle('highContrast');localStorage.setItem(LS('contrast'),document.body.classList.contains('highContrast')?'on':'off')};
if(localStorage.getItem(LS('contrast'))==='on')document.body.classList.add('highContrast');$('switchStudent').onclick=changeStudent;
$('teacherOpen').onclick=teacherView;$('teacherClose').onclick=()=>authTeacher?toast('관리자 종료 버튼으로 로그아웃해 주세요.'):show('joinPage');
$('loginTeacher').onclick=teacherLogin;$('logoutTeacher').onclick=teacherLogout;$('sessionTeacher').onchange=watchTeacher;
$('clearClass').onclick=clearClass;
$('saveTeacherClass').onclick=saveClassSettings;$('teacherRefresh').onclick=watchTeacher;
$('sound').onclick=()=>{const on=toggleSound();$('sound').textContent=on?'🔊 효과음 켜짐':'🔇 효과음 꺼짐';toast(on?'효과음 켜짐':'효과음 꺼짐')};
$('demoSchool').onchange=()=>{session=$('demoSchool').value;displaySchool()};
init();
