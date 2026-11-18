import * as api from './backend-v7.js';
import {isSoundOn,toggleSound,playSound} from './sound-v7.js';
import {resultPreview,exportResultPng} from './artwork-v7.js';
const SESSIONS={1119:{date:'2026-11-19',label:'11월 19일',school:'마장아이꿈누리터',expected:12,planned:22},1120:{date:'2026-11-20',label:'11월 20일',school:'서울금북초등학교',expected:20,planned:30},1125:{date:'2026-11-25',label:'11월 25일',school:'서울행현초등학교',expected:18,planned:28}};
const GAMES=[['🤖','AI 탐정 게임','AI가 사용되는 곳을 찾아요'],['🧐','AI 말이 진짜일까?','확인하는 습관을 배워요'],['🎁','AI 마법 상자','글·그림·영상·소리를 맞혀요'],['🌈','나의 꿈 찾기','좋아하는 꿈을 골라요'],['📖','이야기 제목 뽑기','나만의 이야기를 만들어요'],['🎨','나만의 주인공 꾸미기','꿈속 캐릭터를 꾸며요'],['🧩','이야기 6장면 퍼즐','장면을 순서대로 연결해요'],['🎬','나의 꿈 영화관','나의 작품을 감상해요']];
const $=id=>document.getElementById(id), esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const localKey=s=>'dream-v4-active:'+s;
let session='',student=null,current=0,temp={},busy=false,unwatch=null,teacherActive=false,slideTimer=null,unwatchControl=null,studentControl=null,classroom={unlocked:8,paused:false,configured:false};
function kstDate(){const parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());let x={};parts.forEach(p=>x[p.type]=p.value);return `${x.year}-${x.month}-${x.day}`}
function activeDay(){return Object.keys(SESSIONS).find(k=>SESSIONS[k].date===kstDate())||''}
function toast(msg){$('toast').textContent=msg;$('toast').classList.remove('hidden');clearTimeout(toast.t);toast.t=setTimeout(()=>$('toast').classList.add('hidden'),3900)}
function note(text,error=false){$('notice').textContent=text;$('notice').classList.toggle('hidden',!text);$('notice').classList.toggle('error',error)}
function show(id){['entry','lobby','play','teacher'].forEach(x=>$(x).classList.toggle('hidden',x!==id));window.scrollTo({top:0,behavior:'smooth'})}
function demoSession(){return $('demoDay').value||'1119'}
function chooseDay(){session=api.live?activeDay():demoSession();let s=SESSIONS[session];$('joinBtn').disabled=!s;$('nickname').disabled=!s;
  $('todayCard').classList.toggle('off',!s);$('todayCard').innerHTML=s?`<span class="dayicon">🏫</span><span>${esc(s.school)}<small>📅 ${s.label} · 준비 ${s.planned}명 · 추가 등록도 가능</small></span>`:'<span class="dayicon">🗓️</span><span>오늘 예정된 수업이 없어요.<small>교육 일정: 11월 19일 · 20일 · 25일</small></span>';
  if(!s&&api.live)note('수업이 없는 날에는 학생 신규 등록이 중단됩니다. 테스트는 데모 모드에서 먼저 진행하세요.');else note(api.live?'':'🧪 데모 모드: 이 기기 안에서만 결과가 저장됩니다. 여러 태블릿의 실시간 기록을 공유하려면 Firebase 설정이 필요합니다.');
}
async function init(){
  // 교실 날짜는 Firebase 네트워크 요청과 별개로 즉시 표시합니다.
  $('demoDay').value=activeDay()||'1119';
  chooseDay();
  $('joinBtn').disabled=true;
  $('nickname').disabled=true;
  show('entry');
  try{
    await Promise.race([
      api.connect(),
      new Promise((_,reject)=>setTimeout(()=>reject(new Error('Firebase 연결 시간이 초과되었습니다. 네트워크와 인증 설정을 확인해 주세요.')),12000))
    ]);
    $('mode').textContent=api.live?'🟢 실시간 연결':'🧪 데모 모드';
    $('demoDayWrap').classList.toggle('hidden',api.live);
    $('teacherLoginInputs').classList.toggle('hidden',!api.live);
    chooseDay();
    if(session){
      const saved=localStorage.getItem(localKey(session));
      if(saved){
        try{
          student=await api.restoreStudent(session,saved);
          if(student){attachStudentControl();lobby();return;}
          localStorage.removeItem(localKey(session));
        }catch(e){toast('기존 기록 복원에 실패했어요. 새로 등록해 주세요.')}
      }
    }
    show('entry');
  }catch(e){
    $('mode').textContent='🔴 연결 오류';
    note('Firebase 연결에 실패했습니다: '+e.message+' · 관리자에게 알려주세요.',true);
    $('joinBtn').disabled=true;
    $('nickname').disabled=true;
    show('entry');
    console.error('AI 게임 교실 Firebase 초기화 실패:',e);
  }
}
async function join(){if(busy)return;const s=SESSIONS[session];if(!s)return toast('오늘 진행할 수업이 없습니다.');const name=$('nickname').value.trim().replace(/[<>\\]/g,'').slice(0,14);if(!name)return toast('별명을 입력해 주세요.');busy=true;$('joinBtn').disabled=true;
 try{student=await api.registerStudent(session,name);localStorage.setItem(localKey(session),student.id);attachStudentControl();lobby();toast('✨ 등록 성공! 꿈 탐험 시작!')}catch(e){toast('등록 실패: '+e.message)}finally{busy=false;$('joinBtn').disabled=!SESSIONS[session]}}
async function anotherStudent(){if(!confirm('다른 학생으로 시작할까요? 기존 학생의 기록은 그대로 저장됩니다.'))return;if(unwatchControl){unwatchControl();unwatchControl=null;}try{await api.switchStudent();localStorage.removeItem(localKey(session));student=null;$('nickname').value='';show('entry')}catch(e){toast(e.message)}}
function lobby(){if(!student)return show('entry');clearInterval(slideTimer);show('lobby');$('lobbySchool').textContent=SESSIONS[session].school+' · '+SESSIONS[session].label;$('greeting').textContent=`${student.name}의 꿈 탐험`;$('xpFill').style.width=(student.step/8*100)+'%';$('xpLabel').textContent=`${student.step} / 8 미션`;
 $('missions').innerHTML=GAMES.map(([icon,title,desc],i)=>`<button type="button" data-open="${i+1}" ${(i>student.step||i+1>classroom.unlocked||(classroom.paused&&i>=student.step))?'disabled':''} class="mission ${i<student.step?'done':''}"><span class="flag">${i<student.step?'✅':i===student.step?'🌟':'🔒'}</span><span class="emblem">${icon}</span><span class="number">MISSION ${String(i+1).padStart(2,'0')}</span><strong>${esc(title)}</strong><small>${i<student.step?'완료! 다시 체험 가능':i+1>classroom.unlocked?'선생님이 공개하면 시작해요':classroom.paused&&i>=student.step?'잠시 쉬는 시간이에요':i>student.step?'앞 미션을 먼저 완료해요':esc(desc)}</small></button>`).join('');$('missions').querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>openGame(+b.dataset.open));
 $('award').classList.toggle('hidden',student.step<8);if(student.step>=8)$('award').innerHTML=`<div class="huge">🏆</div><h2>꿈 탐험 수료!</h2><p><strong>${esc(student.name)}</strong> 탐험가가 8개 미션을 모두 완성했어요!</p><button class="cta" id="watchAgain">🎬 나의 작품 다시 보기</button>`;
 if($('watchAgain'))$('watchAgain').onclick=()=>openGame(8);
  const showcase=$('resultGallery');
  showcase.classList.toggle('hidden',student.step<4);
  if(student.step>=4){
    showcase.innerHTML='<h2>🎨 내 손으로 만든 작품</h2>'+resultPreview(student);
    const save=$('downloadResult');if(save)save.onclick=()=>{try{exportResultPng(student);playSound('success')}catch(e){toast('이미지 저장 실패: '+e.message)}};
  }
  renderBonus();
}
function openGame(n){playSound('start');if(!student||n>student.step+1||n>classroom.unlocked||(classroom.paused&&n>student.step)){toast('선생님이 다음 미션을 열어주면 시작해요!');return;}current=n;temp=JSON.parse(JSON.stringify(student.answers?.[String(n)]||{}));show('play');$('playStep').textContent=`MISSION ${n} / 8`;renderGame()}
function options(id,items,single=false){return `<div class="options ${single?'single':''}">${items.map(([v,icon,label])=>`<button type="button" class="option ${temp[id]===v?'picked':''}" data-pick="${esc(id)}" data-value="${esc(v)}"><span class="emoji">${icon}</span>${esc(label)}</button>`).join('')}</div>`}
function stage(title,intro,body){return `<h2 class="gameTitle">${title}</h2><p class="lead">${intro}</p>${body}`}
function feedback(msg,style=''){return `<div class="feedback ${style}">${msg}</div>`}
function finishButton(label,can){return `<button class="cta" id="finish" ${!can?'disabled':''}>${label} →</button>`}
function nextQuestion(can,more){return `<button class="cta" id="nextQ" ${!can?'disabled':''}>${more?'다음 문제':'마지막 문제'} →</button>`}
const quizSets={
 1:[['🤖','로봇청소기는 AI를 사용할 수 있을까요?','yes','센서와 AI를 이용해 집안을 청소할 수 있어요.'],['✏️','평범한 연필도 AI일까요?','no','연필은 스스로 판단하지 않는 일반 도구예요.'],['🔊','말을 알아듣는 음성비서는 AI를 사용할까요?','yes','음성을 인식하고 답변을 만들 수 있어요.'],['🧸','일반 봉제 인형은 혼자 공부하는 AI일까요?','no','일반 인형은 AI가 아니에요.'],['📱','사진 속 얼굴을 찾아 분류하는 기능에 AI가 쓰일까요?','yes','사진 속 특징을 찾아볼 수 있어요.'],['🧱','그냥 쌓아 놓은 블록에 AI가 있을까요?','no','일반 블록은 AI가 아니에요.']],
 2:[['🧐','AI가 말하면 언제나 정답이에요.','no','AI도 실수할 수 있어요.'],['📚','중요한 정보는 선생님이나 책에서 다시 확인해요.','yes','AI가 알려준 내용은 확인하는 습관이 필요해요.'],['🔒','친구의 비밀번호를 AI에게 알려줘도 괜찮아요.','no','비밀번호와 개인정보는 공유하면 안 돼요.'],['🖼️','AI가 만든 사진이 진짜 사진처럼 보여도 확인해야 해요.','yes','그럴듯한 이미지라도 진짜인지 살펴봐요.'],['🧑‍🏫','AI가 어려운 말을 하면 선생님에게 물어봐도 돼요.','yes','어른과 함께 확인하면 더 안전해요.'],['🪪','주소와 전화번호를 AI에 모두 적어도 괜찮아요.','no','개인정보는 입력하지 않아요.']],
 3:[['📝','AI에게 동화 이야기를 써 달라고 해요.','글','글을 만드는 활동이에요.'],['🖼️','AI에게 고양이 그림을 그려 달라고 해요.','그림','그림을 만드는 활동이에요.'],['🎞️','AI에게 움직이는 장면을 만들어 달라고 해요.','영상','영상을 만드는 활동이에요.'],['🎵','AI에게 목소리나 음악을 만들어 달라고 해요.','소리','소리를 만드는 활동이에요.'],['💬','AI에게 감사 편지를 써 달라고 해요.','글','문장과 편지를 만드는 활동이에요.'],['🎨','AI에게 바닷속 그림을 그려 달라고 해요.','그림','그림을 만들어 낼 수 있어요.']]};
function renderGame(){const ans=student.answers||{},dream=ans['4']?.dream||'나의 꿈',title=ans['5']?.title||'꿈을 향한 멋진 도전',char=ans['6']?.character||'🐰';let h='';
 if([1,2,3].includes(current)){
 const q=quizSets[current],idx=Math.min(Number(temp.idx)||0,q.length-1),v=q[idx],picked=temp['q'+idx],correct=picked===v[2];const os=current===3?[['글','📝','글'],['그림','🖼️','그림'],['영상','🎞️','영상'],['소리','🎵','소리']]:[['yes','⭕',current===1?'AI를 사용해요':'맞아요'],['no','❌',current===1?'일반 도구예요':'아니에요']];
 h=stage(GAMES[current-1][0]+' '+GAMES[current-1][1],`${idx+1} / ${q.length} 문제 · 알맞은 답을 선택해요`, `<div class="scene"><span class="giant">${v[0]}</span><div class="question">${v[1]}</div></div>${options('q'+idx,os)}${picked?feedback((correct?'🎉 정답이에요! ':'💡 다시 골라 보세요! ')+esc(v[3]),correct?'good':'bad'):''}${idx===q.length-1?finishButton('🎉 미션 완료',correct):nextQuestion(correct,true)}`);
 }else if(current===4){const list=[['우주 탐험가','🚀','우주 탐험가'],['동물 돌보미','🐶','동물 돌보미'],['그림 작가','🎨','그림 작가'],['축구 선수','⚽','축구 선수'],['과학자','🔬','과학자'],['요리사','👩‍🍳','요리사'],['선생님','📚','선생님'],['소방관','🚒','소방관']];h=stage('🌈 나의 꿈 찾기','내가 좋아하는 꿈을 눌러요. 꿈은 나중에 바뀌어도 괜찮아요!',options('dream',list)+`<h3>좋아하는 활동을 골라요</h3>${options('favorite',[['만들기','🧩','만들기'],['도와주기','🤝','도와주기'],['탐험하기','🔭','탐험하기'],['표현하기','🎤','표현하기']])}<h3>내 꿈을 이루고 싶은 이유는?</h3>${options('reason',[['행복','😊','행복해지고 싶어요'],['도움','❤️','누군가를 돕고 싶어요'],['호기심','🔍','새로운 것을 알고 싶어요'],['도전','🏅','도전하고 싶어요']])}`+(temp.dream?feedback(`🌟 나는 멋진 ${esc(temp.dream)}이(가) 되고 싶어요!`,'good'):'')+finishButton('나의 꿈 카드 완성',!!(temp.dream&&temp.favorite&&temp.reason)));
 }else if(current===5){const titles=[`${dream}의 반짝반짝 첫 도전`,`${dream}, 친구들과 함께 꿈을 이루다`,'꿈을 향해 출발! 나의 특별한 하루'];h=stage('📖 이야기 제목 뽑기','세 가지 이야기 제목 중 가장 마음에 드는 것을 골라요!',options('title',titles.map((v,i)=>[v,['🌟','💛','🎈'][i],v]),true)+`<h3>주인공이 만날 어려움을 골라요</h3>${options('challenge',[['실수','🌧️','실수했어요'],['문제','🧩','어려운 문제가 생겼어요'],['두려움','💭','용기가 필요해요'],['시간','⏳','연습할 시간이 필요해요']])}`+feedback('이야기는 꿈 발견 → 연습 → 어려움 → 도움 → 다시 도전 → 성장으로 이어져요.')+finishButton('내 이야기 제목 결정',!!(temp.title&&temp.challenge)));
 }else if(current===6){const chars=[['🐰','🐰','토끼'],['🦊','🦊','여우'],['🐻','🐻','곰'],['🐱','🐱','고양이']];const colors=[['빨강','🔴','빨간 옷'],['파랑','🔵','파란 옷'],['초록','🟢','초록 옷'],['노랑','🟡','노란 옷']];h=stage('🎨 나만의 주인공 꾸미기','주인공과 옷 색깔을 고르고 6가지 표정을 만나요!',`<h3>어떤 친구가 주인공일까요?</h3>${options('character',chars)}<h3>옷 색깔을 골라요</h3>${options('color',colors)}${temp.character&&temp.color?`<div class="scene"><span class="giant">${temp.character}</span><strong>${esc(temp.color)} 옷을 입은 주인공</strong></div><div class="storyGrid">${['😊 기뻐요','🤔 생각해요','💪 도전해요','😮 놀라워요','🥳 축하해요','🌟 성공해요'].map(x=>`<div class="storyTile"><span class="emoji">${temp.character}</span>${x}</div>`).join('')}</div>`:''}${finishButton('주인공 만들기 완료',!!(temp.character&&temp.color))}`);
 }else if(current===7){const scenes=[['🌅','꿈을 발견해요'],['🧭','목표를 정해요'],['🧱','어려움을 만나요'],['🤝','도움을 받아요'],['💪','다시 도전해요'],['🌟','성장하고 웃어요']];const order=temp.story||[],remaining=scenes.map((x,i)=>i).filter(i=>!order.includes(i));h=stage('🧩 이야기 6장면 퍼즐','아래 그림을 순서대로 눌러 나만의 6장면 이야기를 만들어요!',`<h3>내 이야기 (${order.length} / 6)</h3><div class="storyGrid">${order.length?order.map((id,i)=>`<div class="storyTile"><span class="emoji">${scenes[id][0]}</span>${i+1}. ${scenes[id][1]}</div>`).join(''):'<p class="subtle">아래에서 첫 장면을 골라 주세요!</p>'}</div><h3>다음 장면을 골라요</h3><div class="options">${remaining.map(i=>`<button class="option" data-scene="${i}"><span class="emoji">${scenes[i][0]}</span>${scenes[i][1]}</button>`).join('')}</div><button class="mini" id="resetStory">↺ 처음부터 다시 고르기</button>${`<h3>마지막 장면의 나레이션을 골라요</h3>${options('narration',[['도전','💪','나는 또 도전할 거예요!'],['함께','🤝','친구와 함께 성장했어요!'],['꿈','🌟','내 꿈을 향해 출발해요!']])}`+finishButton('6장면 스토리보드 완성',order.length===6&&!!temp.narration)}`);
 }else if(current===8){const sceneText=[['🌅','나는 새로운 꿈을 발견했어요.'],['🧭','그 꿈을 이루기 위한 목표를 세웠어요.'],['🧱','어려운 일도 있었어요.'],['🤝','친구들과 방법을 찾았어요.'],['💪','용기를 내서 다시 도전했어요.'],['🌟','조금씩 성장하며 꿈에 다가갔어요.']];let order=ans['7']?.story||[0,1,2,3,4,5],slide=Math.max(0,Math.min(5,Number(temp.slide)||0));const [icon,baseText]=sceneText[order[slide]];const text=slide===5&&ans['7']?.narration?({'도전':'나는 또 도전할 거예요!','함께':'친구와 함께 성장했어요!','꿈':'내 꿈을 향해 출발해요!'})[ans['7'].narration]||baseText:baseText;h=stage('🎬 나의 꿈 영화관','내가 만든 이야기를 6장면으로 감상해요!',`<div class="scene"><p class="subtle">장면 ${slide+1} / 6 · ${esc(title)}</p><span class="giant">${char} ${icon}</span><div class="question">${text}</div><p class="subtle">나의 꿈: ${esc(dream)} · 옷 색깔: ${esc(ans['6']?.color||'')}</p></div><div class="row" style="justify-content:space-between"><button class="mini" id="prevSlide">← 이전</button><button class="mini" id="autoSlide">${slideTimer?'⏸ 자동 재생 중':'▶ 자동 재생'}</button><button class="mini" id="nextSlide">다음 →</button></div>${feedback('실제 AI 생성 영상이 아닌, 나의 선택으로 만든 6장면 스토리 작품이에요.')}${finishButton(student.step>=8?'🏆 수료증 다시 보기':'🏆 꿈 영화관 완료',true)}`);}
 $('game').innerHTML=h;
 $('game').querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>{
  const id=b.dataset.pick,v=b.dataset.value;
  if([1,2,3].includes(current)){
    const q=quizSets[current][Number(temp.idx)||0];
    playSound(q&&q[2]===v?'correct':'wrong');
  }else playSound('tap');
  temp[id]=v;renderGame();
});
 $('game').querySelectorAll('[data-scene]').forEach(b=>b.onclick=()=>{playSound('tap');temp.story=[...(temp.story||[]),Number(b.dataset.scene)];renderGame()});
 const next=$('nextQ');if(next)next.onclick=()=>{playSound('correct');temp.idx=(Number(temp.idx)||0)+1;renderGame()};
 const finish=$('finish');if(finish)finish.onclick=completeGame;
 if($('resetStory'))$('resetStory').onclick=()=>{temp.story=[];renderGame()};
 if($('prevSlide'))$('prevSlide').onclick=()=>{playSound('slide');temp.slide=((Number(temp.slide)||0)+5)%6;renderGame()};
 if($('nextSlide'))$('nextSlide').onclick=()=>{playSound('slide');temp.slide=((Number(temp.slide)||0)+1)%6;renderGame()};
 if($('autoSlide'))$('autoSlide').onclick=()=>{if(slideTimer){clearInterval(slideTimer);slideTimer=null}else{slideTimer=setInterval(()=>{temp.slide=((Number(temp.slide)||0)+1)%6;renderGame()},2300)}renderGame()};
}

function attachStudentControl(){
 if(unwatchControl){unwatchControl();unwatchControl=null;}
 if(!student||!session)return;
 unwatchControl=api.watchClassroom(session,c=>{
   const changed=c.unlocked!==classroom.unlocked||c.paused!==classroom.paused;
   classroom=c;
   if(changed&&$('lobby')&&!$('lobby').classList.contains('hidden'))lobby();
 },e=>{
   classroom={unlocked:8,paused:false,configured:false};
   console.warn('수업 제어 규칙을 적용하면 단계 잠금이 활성화됩니다:',e.message);
 });
}
const BONUS=[
 ['🔍','우리 교실의 AI 발견하기','교실 안에서 AI가 쓰일 수 있는 물건을 떠올려 보고 선생님께 이야기해요.'],
 ['🎭','캐릭터 목소리 연기','내 캐릭터가 인사한다면 어떤 목소리일지 친구에게 들려주세요.'],
 ['🌈','꿈을 돕는 친구 찾기','친구에게 어떤 꿈을 가졌는지 물어보고, 응원 한마디를 전해요.'],
 ['🎬','장면 표정 연습','내 이야기의 기쁨·놀람·용기 표정을 직접 표현해 보세요.'],
 ['🧠','AI의 말 다시 확인하기','AI가 틀릴 수도 있는 예를 하나 생각하고 누구에게 확인할지 이야기해요.'],
 ['🎨','주인공의 특별한 능력','나의 주인공에게 멋진 능력 하나를 만들어 주세요.']
];
function renderBonus(){
 const el=$('bonusPanel');if(!el||!student)return;
 const index=Number(sessionStorage.getItem('bonus-v6:'+session)||0)%BONUS.length;
 const b=BONUS[index];el.innerHTML=`<div class="bonusTitle">🎁 빨리 끝난 친구의 보너스 탐험</div><p>다음 게임을 기다리는 동안 별도의 점수 경쟁 없이 활동해 보세요.</p><div class="bonusCard"><strong>${b[0]} ${b[1]}</strong><p>${b[2]}</p></div><button type="button" class="mini" id="nextBonus">다른 보너스 활동 보기 ↻</button>`;
 $('nextBonus').onclick=()=>{sessionStorage.setItem('bonus-v6:'+session,String(index+1));renderBonus()};
}
async function saveClassroom(){
 const key=$('teacherSession').value,unlocked=Number($('unlockStage').value),paused=$('pauseClass').checked,btn=$('saveClassroom');
 btn.disabled=true;
 try{await api.setClassroom(key,unlocked,paused);$('classStatus').textContent=`저장 완료! ${unlocked}번까지 공개${paused?' · 일시정지':''}`;toast('강사 진행 설정을 저장했습니다.');}
 catch(e){$('classStatus').textContent='저장 실패: '+e.message;toast('보안 규칙을 확인해 주세요.');}
 finally{btn.disabled=false}
}
function resetFirstStage(){$('unlockStage').value='1';$('pauseClass').checked=false;saveClassroom()}

function party(){playSound('success');const c=$('confetti');c.innerHTML='';for(let i=0;i<25;i++){const s=document.createElement('span');s.textContent=['⭐','✨','🎉','💜','🌈'][i%5];s.style.left=(Math.random()*100)+'%';s.style.animationDelay=(Math.random()*.65)+'s';s.style.fontSize=(14+Math.random()*18)+'px';c.append(s)}setTimeout(()=>c.innerHTML='',2600)}
async function completeGame(){if(busy)return;busy=true;const btn=$('finish');if(btn)btn.disabled=true;const result={...temp};delete result.idx;delete result.slide;const answers={...(student.answers||{}),[String(current)]:result};const next=Math.max(current,student.step);
 try{await api.saveStudent(session,student.id,next,answers);student={...student,step:next,answers};clearInterval(slideTimer);slideTimer=null;party();lobby();toast('🎉 미션 완료! 잘했어요!')}catch(e){toast('저장 실패: '+e.message);if(btn)btn.disabled=false}finally{busy=false}}
function startTeacher(){clearInterval(slideTimer);slideTimer=null;show('teacher')}
async function teacherLogin(){try{$('teacherLogin').disabled=true;await api.teacherLogin($('teacherEmail').value.trim(),$('teacherPassword').value);teacherActive=true;$('teacherAuth').classList.add('hidden');$('teacherContent').classList.remove('hidden');$('teacherSession').value=session||'1119';watch()}catch(e){toast('현황판 접속 실패: '+e.message)}finally{$('teacherLogin').disabled=false}}
function watch(){if(unwatch){unwatch();unwatch=null}if(studentControl){studentControl();studentControl=null}const key=$('teacherSession').value;unwatch=api.watchStudents(key,students=>drawTeacher(key,students),e=>toast('조회 오류: '+e.message));studentControl=api.watchClassroom(key,c=>{const sel=$('unlockStage');if(sel)sel.value=String(c.unlocked);const p=$('pauseClass');if(p)p.checked=c.paused;const status=$('classStatus');if(status)status.textContent=c.configured?'실시간 수업 제어 활성화':'제어 데이터가 아직 없습니다. [1단계부터 진행]을 누르세요.';},e=>{$('classStatus').textContent='수업 제어 권한을 확인하세요: '+e.message})}
function drawTeacher(key,students){const s=SESSIONS[key];const total=students.length;const done=students.filter(x=>x.step>=8).length;$('stats').innerHTML=`<div class="stat"><strong>${total}</strong><span>등록 학생</span></div><div class="stat"><strong>${s.planned}</strong><span>준비 기준</span></div><div class="stat"><strong>${done}</strong><span>8단계 완료</span></div>`;
 $('stages').innerHTML=GAMES.map(([e,n],i)=>{const c=students.filter(x=>x.step>=i+1).length;return `<div class="barRow"><div class="barHeader"><span>${e} ${esc(n)}</span><span>${c}명</span></div><div class="bar"><div style="width:${total?c/total*100:0}%"></div></div></div>`}).join('');
 const d={};for(const x of students){let v=x.answers?.['4']?.dream;if(v)d[v]=(d[v]||0)+1}$('dreams').innerHTML=Object.entries(d).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<span class="stepchip" style="display:inline-block;margin:4px">${esc(k)} ${v}명</span>`).join('')||'<p class="subtle">아직 꿈을 선택한 학생이 없어요.</p>';
 $('students').innerHTML=students.slice().sort((a,b)=>b.step-a.step).map(x=>`<div class="student"><div class="barHeader"><span>${esc(x.name)}</span><span>${Number(x.step)||0} / 8</span></div><div class="bar"><div style="width:${Math.min(100,Math.max(0,(Number(x.step)||0)/8*100))}%"></div></div><small class="subtle">${esc(x.answers?.['4']?.dream||'꿈 선택 전')} · ${esc(x.answers?.['5']?.title||'제목 선택 전')}</small><button type="button" class="mini dangerDelete" data-delete-student="${esc(x.id)}" data-student-name="${esc(x.name)}">🗑️ 이 학생 기록 삭제</button></div>`).join('')||'<p class="subtle">아직 등록한 학생이 없어요.</p>';
  $('students').querySelectorAll('[data-delete-student]').forEach(btn=>btn.onclick=async()=>{
    const id=btn.dataset.deleteStudent,name=btn.dataset.studentName,key=$('teacherSession').value;
    if(!confirm(`[${SESSIONS[key].school}] ${name} 학생의 모든 게임 기록을 삭제할까요?\n삭제 후 복구할 수 없습니다.`))return;
    btn.disabled=true;
    try{await api.deleteStudentRecord(key,id);toast(name+' 학생 기록을 삭제했습니다.');}
    catch(e){toast('삭제 실패: '+e.message);btn.disabled=false;}
  });
}
async function clearTestingStudents(){
 const key=$('teacherSession').value,school=SESSIONS[key].school;
 if(!confirm(`[${school}] 수업의 모든 학생 기록을 삭제하시겠습니까?\n실제 수업 기록도 삭제되며 복구할 수 없습니다.`))return;
 const phrase=prompt(`정말 전체 삭제하려면 아래 글자를 정확히 입력하세요.\n\n초기화 ${key}`);
 if(phrase!==`초기화 ${key}`){toast('확인 문구가 맞지 않아 취소했습니다.');return;}
 const b=$('clearStudents');b.disabled=true;
 try{
  const count=await api.clearSessionStudents(key,(done,total)=>{$('deleteStatus').textContent=`기록 삭제 중: ${done}/${total}`;});
  $('deleteStatus').textContent=`학생 기록 ${count}건 삭제 완료. 다른 수업의 기록은 유지됩니다.`;
  toast('수업 학생 기록을 초기화했습니다.');
 }catch(e){$('deleteStatus').textContent='초기화 실패: '+e.message;toast('기록 삭제에 실패했습니다.');}
 finally{b.disabled=false}
}
async function teacherLogout(){if(unwatch){unwatch();unwatch=null}if(studentControl){studentControl();studentControl=null}teacherActive=false;await api.teacherLogout();$('teacherAuth').classList.remove('hidden');$('teacherContent').classList.add('hidden');student=null;localStorage.removeItem(localKey(session));show('entry');toast('현황판에서 나왔습니다.')}
$('joinBtn').onclick=join;$('nickname').onkeydown=e=>{if(e.key==='Enter')join()};$('demoDay').onchange=()=>{chooseDay();show('entry')};$('newStudent').onclick=anotherStudent;$('back').onclick=()=>{clearInterval(slideTimer);slideTimer=null;lobby()};$('teacherLink').onclick=startTeacher;$('teacherBack').onclick=()=>{if(teacherActive){toast('현황판 종료 버튼을 눌러 로그아웃해 주세요.');return}show('entry')};$('teacherLogin').onclick=teacherLogin;$('teacherSession').onchange=watch;$('teacherLogout').onclick=teacherLogout;
$('saveClassroom').onclick=saveClassroom;$('firstStage').onclick=resetFirstStage;
$('clearStudents').onclick=clearTestingStudents;
$('soundToggle').textContent=isSoundOn()?'🔊 소리 켜짐':'🔇 소리 꺼짐';
$('soundToggle').setAttribute('aria-pressed',String(isSoundOn()));
$('soundToggle').onclick=()=>{
 const on=toggleSound();$('soundToggle').textContent=on?'🔊 소리 켜짐':'🔇 소리 꺼짐';
 $('soundToggle').setAttribute('aria-pressed',String(on));
 toast(on?'게임 효과음이 켜졌어요!':'소리를 껐어요.');
};

init();
