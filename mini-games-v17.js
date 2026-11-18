
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
const verifyCases=[
 ['친구가 “AI가 모든 숙제를 대신해도 된다”고 말해요.','숙제를 해도 배우는 것은 내 몫이에요. 선생님과 사용 규칙을 확인해요.'],
 ['친구가 “AI는 사진 속 사람 마음까지 다 알아”라고 말해요.','사진만 보고 마음을 확정할 수 없어요. 무엇을 알 수 있는지 확인해요.'],
 ['낯선 앱이 집 주소를 알려 달라고 해요.','주소는 개인정보예요. 입력하지 말고 어른과 확인해요.'],
 ['사진 속 “오늘 학교 휴교”라는 글에 출처가 없어요.','학교 공식 알림과 날짜를 확인해야 해요.'],
 ['AI가 만들어 준 문장에 낯선 사실이 있어요.','내용의 출처와 뜻을 확인하고 질문을 고쳐요.'],
 ['고양이 사진 한 장으로 모든 동물을 구분할 수 있다고 해요.','여러 상황의 올바른 학습 예시가 필요해요.'],
 ['내일 비가 올 확률이 70%면 무조건 비가 온다고 해요.','70%는 일어날 가능성이 높다는 뜻이지 확정은 아니에요.'],
 ['AI가 그럴듯한 출처를 알려줬지만 링크가 열리지 않아요.','출처도 AI가 잘못 만들 수 있어요. 실제 자료인지 확인해요.'],
 ['인터넷에서 찾은 그림이면 허락 없이 써도 된다고 해요.','그림마다 이용 조건이 달라요. 출처와 사용 허락을 확인해요.'],
 ['AI가 같은 친구만 계속 발표자로 뽑아요.','추천 기준이 공정한지 선생님과 함께 살펴봐요.'],
 ['AI가 “박쥐는 새다”라고 설명해요.','박쥐는 포유류예요. 과학책 등 믿을 만한 자료와 비교해요.'],
 ['AI가 알려준 건강 정보를 혼자 결정해도 된다고 해요.','건강과 안전은 어른과 전문가의 판단이 필요해요.'],
 ['친구 얼굴을 바꾼 사진을 진짜 사진처럼 퍼뜨리려 해요.','친구의 권리와 동의를 생각하고, 원본·제작 정보를 확인해요.'],
 ['발표 포스터가 예뻐서 사실 확인은 하지 않겠다고 해요.','보기 좋은 디자인만큼 정확성·안전·권리를 확인해야 해요.'],
 ['AI가 말한 것은 모두 정답이라고 친구가 주장해요.','AI도 틀릴 수 있어요. 스스로 생각하고 근거를 확인해요.']
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
  html+='<p class="microPrompt">다음 이야기에서 무엇을 해야 안전할까요?</p><div class="microScene microCase">'+esc(verifyCases[chapter][0])+'</div><div class="microGrid"><button class="microChoice" data-mini="check">🔎 왜 그런지 확인하고 어른과 이야기해요</button><button class="microChoice" data-mini="share">📢 확인하지 않고 친구에게 바로 전해요</button></div>';
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
   if(n<3&&actual===expected){s.picked=[...picked,choice];s.message='잘했어요! “'+ctx[n+1]+'”는 '+sortLabels[chapter][expected]+'에 해당해요. 그림 속 정보가 어떤 뜻인지 생각해 보세요.';handlers.onSound('correct')}
   else{s.message='아직 맞지 않아요. “'+ctx[n+1]+'”의 뜻을 생각해 보세요. 이 카드는 “'+sortLabels[chapter][expected]+'”에 들어가요. 다시 골라 보세요.';handlers.onSound('wrong')}
  }else if(id==='sequence'||id==='build'){
   const n=Number(choice.replace('order-',''));
   if(n===picked.length){s.picked=[...picked,n];s.message='좋아요! '+order[n]+'부터 해야 하는 이유를 생각해 보고 다음 행동을 골라요.';handlers.onSound('correct')}
   else{s.message='순서가 달라요. 먼저 '+order[picked.length]+'부터 하면 더 안전하고 알맞아요. 다시 골라 보세요.';handlers.onSound('wrong')}
  }else if(id==='memory'){
   const j=Number(choice.replace('card-','')),revealed=s.revealed||[],matched=s.matched||[];
   if(matched.includes(j)||revealed.includes(j))return;
   if(revealed.length===0){s.revealed=[j];s.message='짝이 되는 카드를 한 장 더 골라요.';}
   else{const card=[0,1,1,0];if(card[revealed[0]]===card[j]){s.matched=[...matched,revealed[0],j];s.message='정답! 같은 그림 두 장을 기억해서 찾았어요. 기억력은 중요한 학습 힘이에요.';handlers.onSound('correct')}else{s.message='다른 그림이 나왔어요. 처음 선택한 카드의 위치를 기억하고 다시 도전해 보세요.';handlers.onSound('wrong')}s.revealed=[]}
  }else if(id==='verify'){
   if(choice==='check'){s.verified=true;s.message='정답이에요! '+verifyCases[chapter][1];handlers.onSound('correct')}
   else{s.message='확인 없이 전하면 다른 사람이 잘못 믿을 수 있어요. '+verifyCases[chapter][1]+' 다시 골라 보세요.';handlers.onSound('wrong')}
  }
  handlers.onChange(s);
 }};
}
