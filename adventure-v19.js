
/* V19 platform expansion. All activity answers are local, no external AI API requests. */
export const BOTS=[
{id:'spark',name:'반짝봇',icon:'🤖',color:'#8172f2',tag:'질문 마법을 배워요'},
{id:'check',name:'체크봇',icon:'🕵️',color:'#28b8ab',tag:'정보를 확인해요'},
{id:'safe',name:'세이프봇',icon:'🛡️',color:'#478bdc',tag:'안전을 지켜요'},
{id:'create',name:'크리에이봇',icon:'🎨',color:'#ee9667',tag:'작품을 만들어요'}
];
export const GAMES=[
['prompt','🪄','프롬프트 마법사','AI 요청을 네 가지 카드로 완성해요'],
['detective','🔎','AI 탐정단','학교 소식·책·영상의 정보를 확인해요'],
['training','🧠','데이터 분류 훈련소','그림 8장을 바른 바구니에 분류해요'],
['escape','🔐','AI 안전 방탈출','안전한 선택으로 네 개의 문을 열어요'],
['story','📚','AI 창작 어드벤처','5장면을 조합해 디지털 동화를 완성해요']
];
export const ART_TYPES=[
['prompt','📝','AI 질문 카드'],['poster','🎨','AI 안전 포스터'],
['story','📖','디지털 동화'],['pledge','🛡️','나의 AI 사용 약속']
];
const PROMPT=[
['AI에게 어떤 역할을 줄까요?',['친절한 동화 작가','재미있는 과학 선생님','안전을 알려주는 선생님']],
['무엇을 만들까요?',['우주 모험 이야기','우리 반 안전 수칙','동물 보호 안내문']],
['어떤 조건이 좋을까요?',['초등학생에게 쉬운 말로','5문장 이내로','재미있는 예시 2개 넣기']],
['결과는 어떤 모양이 좋을까요?',['번호 있는 목록','짧은 동화','제목과 세 가지 핵심']]
];
const DETECT=[
['🏫 학교가 쉰다는 사진','친구가 “내일 휴교” 이미지를 보냈지만 보낸 곳은 알 수 없어요.',['학교 공식 공지와 날짜 확인','재미있으니 바로 전달','사진 색깔만 보고 믿기'],0,'학교 공식 알림과 날짜를 확인하기 전에는 사실이라고 단정하면 안 돼요.'],
['📚 AI가 추천한 책','AI가 알려준 과학책을 도서관에서 찾을 수 없어요.',['무조건 있다고 믿기','책 제목·지은이 다시 확인','친구에게 소문내기'],1,'AI가 실제 없는 책을 만들어 낼 수 있어서 책 정보를 다시 확인해야 해요.'],
['📰 오래된 동물 영상','3년 전 촬영된 동물 영상이 오늘의 사건이라고 퍼지고 있어요.',['조회수가 많으니 믿기','댓글만 읽고 판단','영상 촬영 날짜와 원본 확인'],2,'사진이 진짜여도 사건이 일어난 시점이 다를 수 있어요.']
];
const TRAIN=[
['🐱','고양이',0],['🚲','자전거',1],['🐶','강아지',0],['👩‍🚀','우주비행사',2],
['🚗','자동차',1],['👩‍🏫','선생님',2],['🦋','나비',0],['🚀','로켓',1]
];
const ESCAPE=[
['🔑 비밀번호의 문','낯선 앱이 비밀번호를 입력하면 선물을 주겠대요.',['그냥 입력하기','어른께 알리고 입력하지 않기'],1,'비밀번호는 낯선 앱이나 사람에게 알려주지 않아요.'],
['📸 친구 사진의 문','친구의 얼굴 사진을 AI 앱에 올려 달래요.',['허락 없이 올리기','동의와 필요성을 확인하기'],1,'친구의 얼굴 사진도 소중한 개인정보예요.'],
['🔗 링크 미로','모르는 사람이 상품 당첨 링크를 보냈어요.',['바로 누르고 주소 입력','공식 안내인지 어른과 확인'],1,'모르는 링크는 위험할 수 있어요.'],
['📢 사실 확인의 문','AI가 알려준 사실을 친구들에게 소개하려고 해요.',['책이나 공식 자료와 비교','AI가 말하면 무조건 믿기'],0,'중요한 사실은 다른 자료로 확인해야 해요.']
];
const STORY=[
['주인공',['호기심 많은 토끼','친절한 로봇','용감한 꼬마 탐험가']],
['장소',['무지개 숲','달빛 도서관','우주 정거장']],
['일어난 일',['친구가 가짜 소식을 믿었어요','소중한 비밀을 잃을 뻔했어요','도움이 필요한 친구를 만났어요']],
['해결 방법',['믿을 만한 자료로 확인했어요','비밀을 지키고 어른께 물었어요','함께 질문을 바꿔 보았어요']],
['마지막 약속',['AI 답도 직접 확인해요','친구의 비밀을 지켜요','함께 생각하고 행동해요']]
];
const COLORS=['#7863dd','#268aaa','#299b87','#df8b66','#c05d9f'];
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const blankAdventure=()=>({version:19,updatedAt:0,robot:null,games:{},artifacts:{}});
export const totalXP=(s,chapters=0)=>Math.min(15,chapters)*20+Object.values(s.games||{}).filter(x=>x?.done).length*65+Object.values(s.artifacts||{}).filter(x=>x?.title).length*50;
export const botLevel=x=>Math.max(1,Math.min(5,Math.floor(x/100)+1));
export const levelName=n=>['AI 새싹 탐험가','AI 질문 연습생','AI 확인 전문가','AI 안전 수호자','AI 창작 마스터'][Math.max(0,Math.min(4,n-1))];
export const storyText=a=>['어느 날 '+a[0]+'는 '+a[1]+'에 도착했어요.','그런데 '+a[2],a[0]+'는 어떻게 해결할지 차근차근 생각했어요.','그래서 '+a[3],'친구들과 함께 배운 약속은 “'+a[4]+'”였어요.'].join('\n');
export function checkContent(){
 if(BOTS.length!==4||GAMES.length!==5||ART_TYPES.length!==4||PROMPT.length!==4||DETECT.length!==3||TRAIN.length!==8||ESCAPE.length!==4||STORY.length!==5)throw Error('V19 콘텐츠가 부족합니다.');
 return true;
}
export function createAdventure({api,sound,notify,goHome,show,chapters,canEnter}){
 let session='',student=null,state=blankAdventure(),game=-1,step=0,selected=[],feedback='',studio=-1,edit={},timer=null,queue=Promise.resolve();
 const $=id=>document.getElementById(id);
 const key=()=> 'aiv19:'+session+':'+student.id;
 const robot=()=>BOTS.find(x=>x.id===state.robot)||BOTS[0];
 const xp=()=>totalXP(state,chapters());
 const save=()=>{
  if(!student)return queue;
  const data=JSON.parse(JSON.stringify(state)),sid=session,uid=student.id;
  queue=queue.catch(()=>{}).then(()=>api.saveAdventureState(sid,uid,data)).then(()=>{const x=$('v19SaveNote');if(x)x.textContent='☁️ 봇·창작 기록 서버 저장 완료'}).catch(e=>{
   const x=$('v19SaveNote');if(x)x.textContent='⚠️ 서버 저장 실패 · 이 기기에 임시 보관';console.warn('V19 save',e);
  });
  return queue;
 };
 const changed=()=>{
  state.updatedAt=Date.now();
  try{localStorage.setItem(key(),JSON.stringify(state))}catch{}
  renderHome();
  clearTimeout(timer);timer=setTimeout(save,800);
 };
 function enter(user,code){
  clearTimeout(timer);student=user;session=code;state=blankAdventure();
  const remote=user.answers?.aiAdventureV19;
  if(remote?.version===19)state=JSON.parse(JSON.stringify(remote));
  let local;try{local=JSON.parse(localStorage.getItem(key())||'null')}catch{}
  if(local?.version===19&&(local.updatedAt||0)>(state.updatedAt||0))state=local;
  renderHome();
 }
 const exit=()=>{clearTimeout(timer);student=null;state=blankAdventure()};
 function revealAward(txt){
  const node=$('reward');if(!node)return;
  node.textContent='🌟 '+txt+' 🌟';node.classList.remove('hidden','rewardAnimate');void node.offsetWidth;node.classList.add('rewardAnimate');
  setTimeout(()=>node.classList.add('hidden'),1600);
 }
 function renderHome(){
  const root=$('adventureHub');if(!student||!root)return;
  const b=robot(),level=botLevel(xp()),chosen=!!state.robot;
  const avatar=chosen?
   '<div class="v19BotPanel"><div class="v19BotFace" style="--bot-color:'+b.color+'">'+b.icon+'</div><div class="v19BotText"><strong>'+esc(b.name)+' · LV.'+level+'</strong><span>'+esc(levelName(level))+'</span><p>'+esc(b.tag)+'</p><div class="v19XpBar"><span style="width:'+(level===5?100:xp()%100)+'%"></span></div><small>⭐ '+xp()+' 경험치 · 게임 '+Object.values(state.games).filter(x=>x.done).length+'/5 · 작품 '+Object.keys(state.artifacts).length+'/4</small></div><button type="button" id="v19ChangeBot" class="v19Alt">봇 바꾸기</button></div>':
   '<div class="v19Choose"><h3>🎉 나의 AI 봇을 선택해요!</h3><div class="v19BotGrid">'+BOTS.map(x=>'<button type="button" data-bot="'+x.id+'" class="v19BotChoice" style="--bot-color:'+x.color+'"><span>'+x.icon+'</span><strong>'+x.name+'</strong><small>'+x.tag+'</small></button>').join('')+'</div></div>';
  root.innerHTML='<div class="v19SectionTitle"><small>✨ ADVENTURE WORLD V19</small><h2>나와 함께 성장하는 AI 탐험 월드</h2><p>다섯 가지 모험을 즐기고 나만의 작품까지 만들어 봐요!</p></div>'+avatar+
  '<div class="v19SectionTitle compact"><h3>🎮 새로운 AI 게임 5종</h3><span>미션마다 별과 경험치를 모아요</span></div><div class="v19GameGrid">'+GAMES.map((g,i)=>'<button type="button" data-game="'+i+'" class="v19GameCard" '+(!chosen?'disabled':'')+'><span>'+g[1]+'</span><strong>'+g[2]+'</strong><small>'+g[3]+'</small><em>'+(state.games[g[0]]?.done?'✅ 완료 · 다시 도전':'▶ 게임 시작')+'</em></button>').join('')+'</div>'+
  '<div class="v19StudioEntry"><div><h3>🎨 나만의 AI 창작 스튜디오</h3><p>안전 포스터, 질문 카드, 동화, 약속 카드를 직접 편집하고 PNG로 저장해요!</p></div><button id="v19StudioOpen" type="button" class="v19Action" '+(!chosen?'disabled':'')+'>창작 스튜디오 입장</button></div><p id="v19SaveNote" class="v19SaveNote" aria-live="polite">나만의 모험 기록은 안전하게 보관해요.</p>';
  root.querySelectorAll('[data-bot]').forEach(btn=>btn.onclick=()=>{state.robot=btn.dataset.bot;changed();sound('success');notify(robot().name+'과 탐험을 시작해요!')});
  root.querySelectorAll('[data-game]').forEach(btn=>btn.onclick=()=>startGame(Number(btn.dataset.game)));
  root.querySelector('#v19StudioOpen').onclick=()=>openStudio();
  const change=root.querySelector('#v19ChangeBot');if(change)change.onclick=()=>{state.robot=null;changed()};
 }
 function startGame(n){
  if(!state.robot)return notify('먼저 나의 봇을 선택해 주세요.');
  if(canEnter&&!canEnter())return notify('선생님이 수업을 일시정지했어요.');
  game=n;step=0;selected=[];feedback='';show('adventurePage');renderGame();
 }
 function reward(result){
  const id=GAMES[game][0],replay=!!state.games[id]?.done;
  state.games[id]={done:true,title:GAMES[game][2],result,savedAt:new Date().toISOString()};
  feedback=replay?'다시 도전 성공!':'미션 성공! 경험치 65XP를 얻었어요.';
  changed();sound('success');revealAward(GAMES[game][2]+' 클리어!');renderGame();
 }
 function choiceClick(n){
  if(game===0){selected.push(n);if(step===3)reward(PROMPT.map((p,i)=>p[1][selected[i]]).join(' · '));else{step++;feedback='✨ 마법 카드가 완성되고 있어요!';sound('correct');renderGame()}}
  else if(game===4){selected.push(n);if(step===4)reward(storyText(STORY.map((p,i)=>p[1][selected[i]])));else{step++;feedback='📖 이야기가 다음 장면으로 이어져요!';sound('correct');renderGame()}}
  else{
   const item=game===1?DETECT[step]:game===2?TRAIN[step]:ESCAPE[step];
   const correct=game===1?item[3]:game===2?item[2]:item[3];
   const explanation=game===1?item[4]:game===2?'그림의 특징을 보고 동물·탈것·사람 중에서 골라야 해요.':item[4];
   if(n!==correct){feedback='🔍 다시 골라 봐요. '+explanation;sound('wrong');renderGame();return}
   selected.push(n);
   const max=game===1?3:game===2?8:4;
   if(step===max-1)reward(game===1?'세 가지 정보의 단서를 모두 확인했어요.':game===2?'8개 자료를 바르게 분류했어요.':'네 개의 안전한 문을 열었어요.');
   else{step++;feedback='✅ 정답! '+explanation;sound('correct');renderGame()}
  }
 }
 function renderGame(){
  const root=$('adventureContent');if(!root||game<0)return;
  const info=GAMES[game],finished=state.games[info[0]]?.done&&(feedback.startsWith('미션 성공')||feedback.startsWith('다시 도전'));
  let html='<div class="v19GameToolbar"><button id="v19Back" class="v19Alt">← 탐험 지도</button><span>MISSION '+(game+1)+'/5</span></div><div class="v19GameBanner"><span>'+info[1]+'</span><div><h2>'+info[2]+'</h2><p>'+info[3]+'</p></div></div>';
  if(finished)html+='<div class="v19Victory"><span>🏆</span><h2>미션 클리어!</h2><p>'+esc(feedback)+'</p><p>현재 경험치 '+xp()+' XP · 봇 레벨 '+botLevel(xp())+'</p><button class="v19Action" id="v19Return">탐험 지도로 돌아가기</button></div>';
  else if(game===0||game===4){
   const p=game===0?PROMPT[step]:STORY[step],max=game===0?4:5;
   html+='<div class="v19Step">STEP '+(step+1)+' / '+max+'</div><h3 class="v19Question">'+p[0]+'</h3><div class="v19Options">'+p[1].map((v,j)=>'<button data-select="'+j+'" class="v19Option">'+['🌟','🌈','🚀'][j]+' '+esc(v)+'</button>').join('')+'</div><div class="v19Draft"><strong>'+(game===0?'🪄 요청문':'📖 나의 이야기')+' 미리보기</strong><p>'+esc(selected.map((v,j)=>(game===0?PROMPT:STORY)[j][1][v]).join(' → ')||'카드를 선택해 보세요.')+'</p></div>';
  }else if(game===1){
   const p=DETECT[step];html+='<div class="v19Step">단서 '+(step+1)+'/3</div><h3 class="v19Question">'+p[0]+'</h3><p class="v19Situation">'+p[1]+'</p><div class="v19Options">'+p[2].map((v,j)=>'<button data-select="'+j+'" class="v19Option">'+esc(v)+'</button>').join('')+'</div>';
  }else if(game===2){
   const p=TRAIN[step];html+='<div class="v19Step">분류 '+(step+1)+'/8</div><p class="v19Situation">이 그림을 동물·탈것·사람 바구니 중 한 곳에 넣어 보세요.</p><div class="v19TrainingCard">'+p[0]+'<strong>'+p[1]+'</strong></div><div class="v19Options">'+['🐾 동물','🚗 탈것','👥 사람'].map((v,j)=>'<button data-select="'+j+'" class="v19Option">'+v+'</button>').join('')+'</div>';
  }else{
   const p=ESCAPE[step];html+='<div class="v19Step">안전의 문 '+(step+1)+'/4</div><h3 class="v19Question">'+p[0]+'</h3><p class="v19Situation">'+p[1]+'</p><div class="v19Options">'+p[2].map((v,j)=>'<button data-select="'+j+'" class="v19Option">'+esc(v)+'</button>').join('')+'</div>';
  }
  if(feedback&&!finished)html+='<p class="v19Feedback" role="status">'+esc(feedback)+'</p>';
  root.innerHTML=html;
  root.querySelector('#v19Back').onclick=goHome;
  root.querySelectorAll('[data-select]').forEach(btn=>btn.onclick=()=>choiceClick(Number(btn.dataset.select)));
  if(finished)root.querySelector('#v19Return').onclick=goHome;
 }
 function initialArtifact(type){
  const variants={
   prompt:['나의 AI 질문 카드','당신은 친절한 동화 작가입니다.\n초등학생이 좋아할 우주 모험 이야기를\n쉬운 말로 5문장 만들어 주세요.'],
   poster:['AI 안전 수칙!','① 비밀번호는 비밀이에요.\n② AI 답변도 확인해요.\n③ 친구 사진은 허락받고 사용해요.'],
   story:['나의 우주 모험',storyText(STORY.map(x=>x[1][0]))],
   pledge:['나는 안전한 AI 탐험가!','나는 AI의 답을 스스로 확인할 거예요.\n나는 친구의 개인정보를 지킬 거예요.\n나는 다른 사람의 작품을 존중할 거예요.']
  };
  return {title:variants[type][0],text:variants[type][1],color:COLORS[0],icon:ART_TYPES.find(a=>a[0]===type)[1]};
 }
 function openStudio(){
  if(!state.robot)return notify('먼저 나의 봇을 선택해 주세요.');
  if(canEnter&&!canEnter())return notify('선생님이 수업을 일시정지했어요.');
  studio=-1;show('studioPage');renderStudio();
 }
 function renderStudio(){
  const root=$('studioContent');if(!root)return;
  if(studio<0){
   root.innerHTML='<h2>🎨 나만의 AI 창작 스튜디오</h2><p>문구를 직접 고치고, 색을 고르고, 이미지로 저장할 수 있어요.</p><div class="v19StudioGrid">'+ART_TYPES.map((v,i)=>'<button data-art="'+i+'" class="v19StudioCard"><span>'+v[1]+'</span><strong>'+v[2]+'</strong><small>제목·내용·색깔을 직접 편집해요.</small><em>'+(state.artifacts[v[0]]?'✅ 내 작품 수정':'🎨 작품 만들기')+'</em></button>').join('')+'</div>';
   root.querySelectorAll('[data-art]').forEach(b=>b.onclick=()=>{studio=Number(b.dataset.art);const id=ART_TYPES[studio][0];edit={...(state.artifacts[id]||initialArtifact(id))};renderStudio()});return;
  }
  const type=ART_TYPES[studio],rootTitle=type[2];
  root.innerHTML='<div class="v19EditorHead"><button id="v19AllArt" class="v19Alt">← 작품 목록</button><strong>'+type[1]+' '+rootTitle+'</strong></div><div class="v19EditorGrid"><div class="v19Controls"><label for="v19Title">작품 제목</label><input id="v19Title" maxlength="50" value="'+esc(edit.title)+'"><label for="v19Text">내가 만든 내용</label><textarea id="v19Text" maxlength="950" rows="9">'+esc(edit.text)+'</textarea><p class="v19SafetyNote">🔒 친구의 이름·전화번호·주소·비밀번호는 적지 않아요.</p><strong>🎨 카드 색깔</strong><div class="v19Colors">'+COLORS.map(c=>'<button data-color="'+c+'" style="--swatch:'+c+'" aria-label="'+c+' 색상" class="'+(c===edit.color?'selected':'')+'"></button>').join('')+'</div><div class="v19EditorButtons"><button class="v19Action" id="v19Save">💾 작품 저장</button><button class="v19Alt" id="v19Download">🖼️ PNG 저장</button></div></div><div class="v19Preview" id="v19Preview" style="--paint:'+edit.color+'"><span>'+edit.icon+'</span><h3>'+esc(edit.title)+'</h3><p>'+esc(edit.text)+'</p><small>AI 리터러시 탐험학교 · '+esc(student.name)+'</small></div></div>';
  const sync=()=>{edit.title=$('v19Title').value.slice(0,50);edit.text=$('v19Text').value.slice(0,950);$('v19Preview').querySelector('h3').textContent=edit.title;$('v19Preview').querySelector('p').textContent=edit.text};
  $('v19Title').oninput=sync;$('v19Text').oninput=sync;
  root.querySelectorAll('[data-color]').forEach(b=>b.onclick=()=>{sync();edit.color=b.dataset.color;renderStudio()});
  $('v19AllArt').onclick=()=>{studio=-1;renderStudio()};
  $('v19Save').onclick=()=>{sync();if(!edit.title.trim()||!edit.text.trim())return notify('제목과 내용을 입력해 주세요.');const id=type[0],first=!state.artifacts[id];state.artifacts[id]={...edit,savedAt:new Date().toISOString()};changed();sound('success');revealAward(first?'내 첫 창작 작품 완성!':'작품을 다시 저장했어요!');notify(first?'작품 완성! 경험치 50XP를 얻었어요.':'작품 수정 내용을 저장했어요.')};
  $('v19Download').onclick=()=>{sync();download()};
 }
 function download(){
  if(!edit.title.trim()||!edit.text.trim())return notify('제목과 작품 내용을 입력해 주세요.');
  try{
   const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1500;
   const c=canvas.getContext('2d');if(!c)throw Error('이 기기에서 이미지 저장을 할 수 없어요.');
   const grad=c.createLinearGradient(0,0,1080,1500);grad.addColorStop(0,edit.color);grad.addColorStop(1,'#15275d');c.fillStyle=grad;c.fillRect(0,0,1080,1500);
   c.fillStyle='white';c.beginPath();if(c.roundRect)c.roundRect(50,60,980,1380,30);else c.rect(50,60,980,1380);c.fill();
   c.textBaseline='top';c.fillStyle='#5c4dae';c.font='bold 28px sans-serif';c.fillText('AI LITERACY · CREATIVE STUDIO',95,105);
   c.font='90px sans-serif';c.fillText(edit.icon,95,167);c.fillStyle='#202d58';c.font='bold 45px sans-serif';
   function writeLines(value,y,fontWidth,lineHeight,maxLines){
    let line='',lines=0;for(const ch of value){if(ch==='\n'||c.measureText(line+ch).width>fontWidth){c.fillText(line,95,y);y+=lineHeight;line='';lines++;if(lines>=maxLines)return y}if(ch!=='\n')line+=ch}if(line)c.fillText(line,95,y);return y+lineHeight;
   }
   let y=writeLines(edit.title,310,860,60,3)+25;
   c.strokeStyle='#ddd9f2';c.beginPath();c.moveTo(95,y);c.lineTo(990,y);c.stroke();y+=34;c.font='29px sans-serif';writeLines(edit.text,y,870,43,22);
   c.fillStyle='#71809e';c.font='23px sans-serif';c.fillText(student.name.slice(0,15)+'의 작품',95,1360);
   const a=document.createElement('a');a.href=canvas.toDataURL('image/png');a.download='AI창작_'+edit.title.replace(/[^가-힣a-zA-Z0-9]/g,'').slice(0,16)+'.png';a.click();sound('success');
  }catch(e){notify('이미지 생성 실패: '+e.message)}
 }
 function teacherRows(rows){
  return '<h3>🤖 학생별 봇 성장·창작 현황</h3><div class="v19TeacherRows">'+rows.map(r=>{
   const s=r.answers?.aiAdventureV19||blankAdventure(),xp=totalXP(s,Object.keys(r.answers?.aiLiteracyV16?.completed||{}).length);
   return '<div class="v19TeacherItem"><strong>'+esc(r.name)+'</strong><span>'+esc(BOTS.find(b=>b.id===s.robot)?.name||'미선택')+' · LV.'+botLevel(xp)+' · '+xp+' XP</span><span>게임 '+Object.values(s.games||{}).filter(x=>x.done).length+'/5 · 작품 '+Object.keys(s.artifacts||{}).length+'/4</span><details><summary>작품 확인</summary>'+Object.values(s.artifacts||{}).map(a=>'<div><b>'+esc(a.title)+'</b><p>'+esc(a.text)+'</p></div>').join('')+'</details></div>';
  }).join('')+'</div>';
 }
 return {enter,exit,renderHome,startGame,openStudio,teacherRows,save,state:()=>state};
}
