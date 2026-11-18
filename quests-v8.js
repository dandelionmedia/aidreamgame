
const tasks=[
 {title:'AI 숨은그림찾기',icon:'🔍',kind:'find',guide:'AI를 사용할 수 있는 물건 세 개를 찾아요!',cells:[['🤖','로봇청소기',1],['✏️','연필',0],['🔊','음성비서',1],['🧸','인형',0],['📷','사진 분류',1],['📚','종이책',0]],q:['AI는 언제나 정답을 말할까요?','아니요, 틀릴 수 있어요','네, 절대 틀리지 않아요','AI의 정보는 다시 확인할 수 있어요.']},
 {title:'안전한 AI 미로',icon:'🧭',kind:'path',guide:'안전한 길 세 개를 터치해 탈출해요!',cells:[['🔒','비밀번호 지키기',1],['📢','비밀번호 공개',0],['📚','책에서 확인하기',1],['⚡','무조건 믿기',0],['🙋','선생님께 물어보기',1],['📞','전화번호 알리기',0]],q:['AI가 한 말이 이상하면 어떻게 하나요?','선생님께 물어봐요','그냥 믿어요','중요한 내용은 다른 자료와 비교해요.']},
 {title:'AI 마법 카드 짝맞추기',icon:'🃏',kind:'memory',guide:'같은 그림 카드를 세 쌍 찾아요!',cells:[['📝','글'],['🎨','그림'],['🎬','영상'],['🎬','영상'],['🎨','그림'],['📝','글']],q:['AI가 동화를 만들어 주면 어떤 결과인가요?','글','냄새','AI는 글도 만들 수 있어요.']},
 {title:'꿈 보물찾기',icon:'💎',kind:'find',guide:'꿈을 이루는 보물 세 개를 모아요!',cells:[['🌱','노력',1],['🤝','협력',1],['📖','배움',1],['🙈','포기',0],['😴','아무것도 안 하기',0],['😠','친구 놀리기',0]],q:['꿈을 이루는 데 도움 되는 행동은?','연습하고 배우기','바로 포기하기','도전과 연습을 통해 성장해요.']},
 {title:'꿈의 마을 건축하기',icon:'🏡',kind:'build',guide:'차례대로 눌러 작은 마을을 완성해요!',cells:[['🌱','씨앗 심기'],['🏠','집 짓기'],['🌳','나무 심기']],q:['멋진 이야기를 시작하려면 무엇이 필요할까요?','주인공의 꿈 소개','바로 끝내기','이야기에는 시작과 중간과 끝이 있어요.']},
 {title:'캐릭터 성장 게임',icon:'🐣',kind:'build',guide:'내 캐릭터를 세 번 돌봐 주세요!',cells:[['🍎','건강한 간식'],['👕','옷 입기'],['💖','용기 주기']],q:['같은 캐릭터가 여러 장면에 나오면?','모습을 비슷하게 유지해요','매번 완전히 바꿔요','캐릭터의 모습이 이어지면 이해하기 쉬워요.']},
 {title:'이야기 순서 퍼즐',icon:'🧩',kind:'order',guide:'시작 → 도전 → 성장 순서로 선택해요!',cells:[['🏆','성장',2],['🌅','시작',0],['💪','도전',1]],q:['이야기 중간에 어려움이 생기면?','방법을 찾아 다시 도전해요','그대로 멈춰요','도전과 해결 과정이 이야기를 풍성하게 해요.']},
 {title:'꿈 영화관 리듬 축제',icon:'🎵',kind:'rhythm',guide:'별을 여섯 번 눌러 영화관 불을 밝혀요!',cells:[],q:['영상의 음악과 목소리는 왜 필요할까요?','이야기의 느낌을 전하려고요','아무 의미가 없어요','소리도 이야기를 전달하는 도구예요.']}
];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function tile(icon,label,attr){return '<button type="button" class="v8tile" '+attr+'><span>'+icon+'</span><b>'+esc(label)+'</b></button>';}
export function getQuestState(temp){
 if(!temp.v8||typeof temp.v8!=='object')temp.v8={phase:'fun',picked:[],flipped:[],matched:[],count:0,answer:false};
 return temp.v8;
}
export function questRender(stage,temp,root,repaint,sound){
 const item=tasks[stage-1];if(!item)return false;
 const state=getQuestState(temp);
 if(state.phase==='create')return false;
 const fun=state.phase==='fun';
 let html='';
 if(fun){
  let success=false;
  if(item.kind==='find'||item.kind==='path'||item.kind==='order'){
   success=state.picked.length===3;
   html='<div class="v8progress">⭐ '+state.picked.length+' / 3 성공</div><div class="v8tiles">'+item.cells.map(([ico,name],i)=>tile(ico,name,'data-v8-pick="'+i+'" '+(state.picked.includes(i)?'disabled':''))).join('')+'</div>';
   if(state.picked.length)html+='<div class="v8picked">획득한 보물: '+state.picked.map(i=>item.cells[i][0]).join(' ')+'</div>';
  }else if(item.kind==='memory'){
   success=state.matched.length===3;
   html='<div class="v8progress">🧠 같은 그림 '+state.matched.length+' / 3 쌍</div><div class="v8tiles">'+item.cells.map(([ico,name],i)=>tile(state.flipped.includes(i)||state.matched.includes(name)?ico:'❔',state.flipped.includes(i)||state.matched.includes(name)?name:'카드 뒤집기','data-v8-memory="'+i+'" '+(state.matched.includes(name)?'disabled':''))).join('')+'</div>';
  }else if(item.kind==='build'){
   success=state.count>=3;
   html='<div class="v8progress">🏡 완성 '+state.count+' / 3</div><div class="v8built">'+item.cells.slice(0,state.count).map(x=>'<span>'+x[0]+' '+x[1]+'</span>').join('')+'</div>';
   if(!success)html+=tile(item.cells[state.count][0],item.cells[state.count][1],'data-v8-build="1"');
  }else if(item.kind==='rhythm'){
   success=state.count>=6;
   html='<div class="v8progress">🎶 반짝임 '+state.count+' / 6</div><button type="button" class="v8beat" data-v8-beat="1">'+['🌟','✨','💫','⭐','🌈','🎉'][state.count%6]+'</button>';
  }
  if(success)html+='<div class="v8win">🎉 놀이 미션 성공! 잘했어요!</div><button type="button" class="cta" data-v8-next="learn">📚 AI 배움 단계로 →</button>';
 }else{
  html='<div class="v8progress">📚 AI 이해 확인</div><h3>'+esc(item.q[0])+'</h3><div class="v8tiles">'+tile('✅',item.q[1],'data-v8-answer="good" '+(state.answer?'disabled':''))+tile('💭',item.q[2],'data-v8-answer="bad" '+(state.answer?'disabled':''))+'</div>';
  if(state.answer)html+='<div class="v8win">✅ '+esc(item.q[3])+'</div><button type="button" class="cta" data-v8-next="create">🎨 나의 작품 만들기 →</button>';
 }
 root.innerHTML='<section class="v8quest"><div class="v8stages"><span class="'+(fun?'active':'')+'">🎮 놀이</span><span class="'+(!fun?'active':'')+'">📚 AI 배움</span><span>🎨 창작</span></div><div class="v8hero"><span class="v8icon">'+item.icon+'</span><h2>'+esc(item.title)+'</h2><p>'+esc(fun?item.guide:'내가 배운 내용을 확인해요!')+'</p></div>'+html+'</section>';
 const go=(kind)=>{sound(kind);repaint();};
 root.querySelectorAll('[data-v8-pick]').forEach(b=>b.onclick=()=>{
  const i=Number(b.dataset.v8Pick),c=item.cells[i];if(state.picked.includes(i))return;
  const ok=item.kind==='order'?c[2]===state.picked.length:!!c[2];
  if(ok){state.picked.push(i);go(state.picked.length===3?'success':'correct');}else{b.classList.add('v8wrong');sound('wrong');}
 });
 root.querySelectorAll('[data-v8-memory]').forEach(b=>b.onclick=()=>{
  const i=Number(b.dataset.v8Memory),name=item.cells[i][1];
  if(state.flipped.includes(i)||state.flipped.length>1||state.matched.includes(name))return;
  state.flipped.push(i);sound('tap');repaint();
  if(state.flipped.length===2){
   const pair=[...state.flipped];
   if(item.cells[pair[0]][1]===item.cells[pair[1]][1]){state.matched.push(name);state.flipped=[];go(state.matched.length===3?'success':'correct');}
   else setTimeout(()=>{if(pair.join(',')===state.flipped.join(',')){state.flipped=[];repaint();}},700);
  }
 });
 root.querySelectorAll('[data-v8-build]').forEach(b=>b.onclick=()=>{state.count++;go(state.count===3?'success':'tap')});
 root.querySelectorAll('[data-v8-beat]').forEach(b=>b.onclick=()=>{state.count++;go(state.count===6?'success':'tap')});
 root.querySelectorAll('[data-v8-answer]').forEach(b=>b.onclick=()=>{if(b.dataset.v8Answer==='good'){state.answer=true;go('correct')}else{b.classList.add('v8wrong');sound('wrong')}});
 root.querySelectorAll('[data-v8-next]').forEach(b=>b.onclick=()=>{state.phase=b.dataset.v8Next;go('start')});
 return true;
}
