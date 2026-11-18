
// V16 — five touch-first interactive exercise types; chapter-specific context.
// A simplified educational simulation; no remote AI service is called.
export const MINI_TYPES=['sort','sequence','memory','verify','build'];
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const scenarios=[
 ['AI 도구','🧠 AI','✏️ 연필','🤖 음성비서'],
 ['AI 입력','📷 그림','🎤 소리','❌ AI는 절대 틀리지 않는다는 주장'],
 ['정보 보호','🔑 비밀번호','⚽ 취미','🏠 주소'],
 ['사실 확인','📚 교과서','🗣️ 소문','🏛️ 공식 자료'],
 ['좋은 질문','🎯 목표','📋 형식','🌫️ 막연한 요청'],
 ['학습 데이터','🏷️ 올바른 라벨','❌ 잘못된 예시','🗂️ 다양한 자료'],
 ['예측','📈 가능성','🎲 불확실성','✅ 확정'],
 ['프롬프트','🎭 역할','🎯 목적','🌫️ 아무거나 해 달라는 요청'],
 ['창작','🖌️ 직접 제작','©️ 이용 허락','📸 무단 사용'],
 ['공정성','⚖️ 고른 기회','🔁 한쪽 추천','👥 다양한 의견'],
 ['팩트체크','🔎 사실 확인','📢 무조건 전파','📚 출처'],
 ['AI 협업','🤖 아이디어 제안','🙋 사람의 검토','🧠 AI 맹신'],
 ['이미지 검증','🔗 원본 링크','📅 날짜','📤 무조건 공유'],
 ['프로젝트','🎯 기획','🛠️ 제작','⚠️ 확인 없이 발표'],
 ['AI 마스터','🔒 정보 보호','🔎 출처 확인','❌ AI 답을 무조건 믿기']
];
const sortLabels=[
 ['🤖 AI 관련','🧰 일반 도구'],['✅ AI가 다루는 정보','⚠️ 잘못된 주장'],['✅ 일반 취향','🛡️ 개인정보'],
 ['📚 근거 있는 자료','🗣️ 근거 없는 말'],['🎯 구체적 요청','🌫️ 모호한 요청'],['📘 좋은 학습 자료','❌ 잘못된 자료'],
 ['📈 가능성·불확실성','⚠️ 단정'],['🪄 좋은 요청 구성','🌫️ 모호한 요청'],['🎨 책임 있는 창작','⚠️ 무단 사용'],
 ['⚖️ 공정한 판단','🚨 편향된 판단'],['🔍 사실 확인 행동','⚠️ 확인 없는 전파'],['🤝 책임 있는 협업','🚫 무조건 AI 맹신'],
 ['🔎 출처 확인','📢 확인 없이 공유'],['🚀 좋은 제작 과정','⚠️ 검증 생략'],['🛡️ 책임 있는 활용','🚫 무조건 믿기']
];
const safety=[
 [0,1,0],[0,0,1],[1,0,1],[0,1,0],[0,0,1],
 [0,1,0],[0,0,1],[0,0,1],[0,0,1],[0,1,0],
 [0,1,0],[0,0,1],[0,0,1],[0,0,0],[0,0,0]
];
const orderNames=[
 ['🎯 목표 정하기','🛠️ 시도하기','✅ 결과 확인하기'],
 ['📷 입력 모으기','🤖 분석하기','🔍 결과 확인하기'],
 ['🔒 정보 가리기','📤 필요한 내용만 전송','✅ 다시 점검하기'],
 ['❓ 의심하는 정보','🔎 출처 찾기','✅ 판단하기'],
 ['🎯 목적 정하기','📋 조건 정하기','✍️ 질문 작성하기'],
 ['🗂️ 예시 준비','🏷️ 알맞은 라벨','🧪 결과 확인'],
 ['📈 규칙 찾기','🎲 예측하기','✅ 실제 결과 비교'],
 ['🎭 역할 정하기','🎯 목적과 조건','📝 결과 형식'],
 ['💡 아이디어 구상','©️ 권리 확인','🎨 작품 완성'],
 ['👂 의견 듣기','⚖️ 기준 점검','🤝 공정하게 결정'],
 ['🤖 AI 답변 읽기','📚 자료 확인','✍️ 올바르게 수정'],
 ['🤖 AI 아이디어','🙋 사람이 검토','✅ 안전하게 발표'],
 ['🖼️ 이미지 살펴보기','🔗 원본 확인','📢 공유 여부 결정'],
 ['🎯 계획','🛠️ 제작','🔍 검증·발표'],
 ['🧠 AI 이해','🛡️ 안전한 활용','🏆 책임 있는 행동']
];
export function renderMini(chapter,slot,progress,handlers){
 const id=MINI_TYPES[(chapter+slot)%MINI_TYPES.length],ctx=scenarios[chapter],order=orderNames[chapter];
 let html='<div class="microHeader"><span>🎲 미니 게임 '+(slot+1)+' / 5</span><strong>'+({sort:'분류왕',sequence:'순서 탐험',memory:'기억력 카드',verify:'안전 탐정',build:'프롬프트 조립'}[id])+'</strong></div>';
 let s=progress||{picked:[]};const picked=Array.isArray(s.picked)?s.picked:[];
 let buttons=[];
 if(id==='sort'){
  const n=picked.length;
  html+='<p class="microPrompt">그림을 보고 어느 바구니에 넣어야 할지 골라 보세요.</p>';
  if(n<3){html+='<div class="microScene">'+esc(ctx[n+1]||ctx[1])+'</div><div class="microGrid">'+[['safe',sortLabels[chapter][0]],['caution',sortLabels[chapter][1]]].map(([v,t])=>'<button class="microChoice" data-mini="'+v+'">'+t+'</button>').join('')+'</div>';}
  else html+='<div class="microVictory">✅ 3개 카드 분류를 완료했어요!</div>';
  buttons=[0,1,2].map(i=>safety[chapter][i]);
 }else if(id==='sequence'){
  const list=[2,0,1];
  html+='<p class="microPrompt">활동을 올바른 순서로 터치하세요.</p><div class="microStack">'+list.map(j=>'<button data-mini="order-'+j+'" class="microChoice" '+(picked.includes(j)?'disabled':'')+'>'+esc(order[j])+'</button>').join('')+'</div><p class="microStatus">진행: '+picked.length+' / 3</p>';
 }else if(id==='memory'){
  html+='<p class="microPrompt">같은 학습 단서를 찾아 짝을 맞추세요. 카드를 두 장씩 눌러 보세요.</p>';
  const cards=[0,1,1,0],names=[ctx[1],ctx[2]],matched=Array.isArray(s.matched)?s.matched:[],revealed=Array.isArray(s.revealed)?s.revealed:[];
  html+='<div class="microMemory">'+cards.map((v,j)=>'<button class="microCard" data-mini="card-'+j+'" '+(matched.includes(j)?'disabled':'')+'>'+((matched.includes(j)||revealed.includes(j))?esc(names[v]):'❔')+'</button>').join('')+'</div><p class="microStatus">'+matched.length/2+' / 2쌍</p>';
 }else if(id==='verify'){
  html+='<p class="microPrompt">이 정보가 맞는지 확인할 방법을 찾으세요.</p><div class="microScene">'+esc(ctx[2])+'</div><div class="microGrid"><button class="microChoice" data-mini="check">🔎 출처·날짜·근거를 확인해요</button><button class="microChoice" data-mini="share">📢 확인 없이 바로 전달해요</button></div>';
 }else{
  html+='<p class="microPrompt">AI 요청의 3가지 조건을 올바른 순서로 완성해 보세요.</p><div class="microStack">'+[2,0,1].map(j=>'<button class="microChoice" data-mini="order-'+j+'" '+(picked.includes(j)?'disabled':'')+'>'+esc(order[j])+'</button>').join('')+'</div><p class="microStatus">'+picked.length+' / 3 선택</p>';
 }
 const done=(id==='sort'||id==='sequence'||id==='build')?picked.length>=3:id==='memory'?(s.matched||[]).length===4:!!s.verified;
 html+='<div class="microFeedback" aria-live="polite">'+esc(s.message||'정답을 선택하고 학습 단서를 확인해 보세요.')+'</div>';
 if(done)html+='<button class="cta microFinish" type="button" data-mini="finish">🏅 미니 게임 완료 · 다음 활동</button>';
 return {html,done,type:id,apply(choice){
  if(choice==='finish'){if(done)handlers.onFinish();return}
  if(id==='sort'){
   const n=picked.length,expected=buttons[n],actual=choice==='caution'?1:0;
   if(n<3&&actual===expected){s.picked=[...picked,choice];s.message='멋져요! 단서를 정확하게 살펴봤어요.';handlers.onSound('correct')}
   else{s.message='다시 생각해 보고 골라 주세요.';handlers.onSound('wrong')}
  }else if(id==='sequence'||id==='build'){
   const n=Number(choice.replace('order-',''));
   if(n===picked.length){s.picked=[...picked,n];s.message='좋아요! 다음 순서를 골라 주세요.';handlers.onSound('correct')}
   else{s.message='순서를 다시 확인해 보세요.';handlers.onSound('wrong')}
  }else if(id==='memory'){
   const j=Number(choice.replace('card-','')),revealed=s.revealed||[],matched=s.matched||[];
   if(matched.includes(j)||revealed.includes(j))return;
   if(revealed.length===0){s.revealed=[j];s.message='짝이 되는 카드를 한 장 더 골라요.';}
   else{const card=[0,1,1,0];if(card[revealed[0]]===card[j]){s.matched=[...matched,revealed[0],j];s.message='짝을 맞췄어요!';handlers.onSound('correct')}else{s.message='다른 카드와 다시 짝을 찾아요.';handlers.onSound('wrong')}s.revealed=[]}
  }else if(id==='verify'){
   if(choice==='check'){s.verified=true;s.message='맞아요! 확인 후 공유하는 것이 안전해요.';handlers.onSound('correct')}
   else{s.message='근거 없이 공유하면 잘못된 정보가 퍼질 수 있어요.';handlers.onSound('wrong')}
  }
  handlers.onChange(s);
 }};
}
