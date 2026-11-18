
/** V10: Seven additional tap-first AI literacy games for elementary school learners.
 * These are educational simulations and never send student answers to external AI services. */
export const EXTRA_GAMES=[
 ['🧺','AI 데이터 분류왕','그림 카드를 보고 알맞은 바구니에 넣어요','데이터 분류 도감'],
 ['🛡️','개인정보 방패 수호대','AI에 입력해도 안전한 말과 위험한 정보를 구분해요','개인정보 수호 배지'],
 ['⚖️','AI 공정 심판','AI의 불공정한 추천을 찾아 공정하게 고쳐요','공정한 AI 심판장'],
 ['🔍','이미지 단서 수색대','사진처럼 보이는 그림도 출처와 근거를 확인해요','이미지 검증 탐정 노트'],
 ['🍳','프롬프트 레시피 챌린지','같은 요청도 구체적으로 바꾸면 달라져요','프롬프트 개선 레시피'],
 ['🤝','사람과 AI 협동 구조대','AI가 도울 일과 사람이 판단할 일을 구분해요','AI 협동 탐험 배지'],
 ['🔮','AI 패턴 예측 연구소','규칙을 찾아 다음 모양을 예측하고 오류도 확인해요','패턴 연구 성적표']
];
const DATA=[
 {tag:'어떤 바구니?',choices:['🐾 동물','🚗 탈것','🍎 음식'],questions:[
 ['🐶','강아지',0,'강아지는 동물이에요.'],['🚌','버스',1,'버스는 탈것이에요.'],['🍌','바나나',2,'바나나는 음식이에요.'],['🐱','고양이',0,'고양이는 동물이에요.'],['🚲','자전거',1,'자전거는 탈것이에요.'],['🍕','피자',2,'피자는 음식이에요.']]},
 {tag:'공개해도 될까요?',choices:['✅ 일반적인 취향이에요','🛡️ 개인정보라 조심해요'],questions:[
 ['🌈','제가 좋아하는 색은 보라색이에요.',0,'좋아하는 색 같은 일반적 취향을 예시로 사용할 수 있어요.'],['🔑','우리 집 현관 비밀번호는 1234예요.',1,'비밀번호는 절대 입력하지 않아요.'],['📞','제 전화번호는 010-0000-0000이에요.',1,'전화번호는 개인정보예요.'],['⚽','저는 축구와 그림 그리기를 좋아해요.',0,'취미를 일반적으로 설명하는 것은 상대적으로 안전해요.'],['📍','제가 사는 집의 정확한 주소는 여기예요.',1,'집 주소처럼 위치를 특정하는 정보는 지켜야 해요.'],['🐱','저는 고양이를 좋아해요.',0,'개인정보를 밝히지 않고 좋아하는 것을 말할 수 있어요.']]},
 {tag:'더 공정한 선택은?',choices:['💚 공정하게 고쳐요','⚠️ 그대로 두면 불공정해요'],questions:[
 ['🏃','달리기 팀을 구성할 때 모두에게 도전 기회를 줍니다.',0,'공평한 참여 기회를 제공하는 것은 좋은 방법이에요.'],['🧑‍🤝‍🧑','AI가 특정 이름을 가진 학생만 계속 팀장으로 추천합니다.',1,'이름 때문에 기회를 제한한다면 기준을 점검해야 해요.'],['📚','독서 추천 AI가 읽은 책과 관심사를 다양하게 고려합니다.',0,'다양한 자료와 조건을 살피는 것이 도움이 돼요.'],['🏫','AI가 한 반 학생들의 의견만 듣고 전교생의 생각이라고 말합니다.',1,'자료가 한쪽에 치우치면 결론도 편향될 수 있어요.'],['🎨','미술 활동에 서로 다른 관심과 수준을 반영합니다.',0,'학생마다 다른 요구를 고려하는 것은 중요해요.']]},
 {tag:'이 그림을 확인하려면?',choices:['🔗 출처 확인','👀 보기만 하고 믿기'],questions:[
 ['🛸','“학교 운동장에 UFO가 착륙했다”는 그럴듯한 합성 이미지가 퍼졌어요.',0,'이미지의 출처와 촬영·제작 정보를 살펴봐요.'],['🐯','실제 뉴스처럼 보이는 호랑이 사진 아래 출처가 없어요.',0,'멋진 그림이라고 해서 사실이라는 뜻은 아니에요.'],['🏆','“친구가 상을 받았다”는 사진이 공유됐지만 날짜를 알 수 없어요.',0,'촬영 시점과 공식 안내를 확인해 봐요.'],['🌙','AI가 만든 달 위 도시 그림을 실제 사진이라고 소개해요.',0,'그림이 생성되었는지 원본 설명을 살펴봐요.'],['📺','공식 발표라고 적혀 있지만 링크가 엉뚱한 사이트예요.',0,'공식 홈페이지와 발표 원문을 비교해요.']]},
 {tag:'더 좋은 프롬프트는?',choices:['✨ 구체적인 요청','🌫️ 너무 막연한 요청'],questions:[
 ['📚','“초등학교 3학년에게 AI를 예시 2개로 쉽게 설명해 줘.”',0,'대상과 예시의 개수를 알려 주었어요.'],['✏️','“그냥 알아서 잘 써 줘.”',1,'목표나 원하는 형식이 분명하지 않아요.'],['🎨','“보라색 우주에서 웃는 토끼 그림을 그려 줘.”',0,'색·배경·주인공을 구체적으로 말했어요.'],['💬','“뭔가 멋진 거 해 줘.”',1,'무엇을 만들지 더 알려 주면 좋아요.'],['📝','“안전한 인터넷 사용법 3가지를 번호로 정리해 줘.”',0,'주제·개수·출력 형식을 알려 주었어요.']]},
 {tag:'누가 최종 책임을 질까요?',choices:['🤖 AI가 도울 수 있어요','🙋 사람이 확인하고 판단해요'],questions:[
 ['📖','동화 제목 후보를 여러 개 제안하기',0,'AI가 다양한 아이디어를 제안하는 일을 도울 수 있어요.'],['🔒','친구의 사진을 허락 없이 공유할지 결정하기',1,'사람이 동의와 권리를 확인해야 해요.'],['🧠','어려운 단어를 쉽게 설명하는 초안 만들기',0,'AI가 쉬운 표현을 제안할 수 있어요.'],['🚑','친구가 다쳤을 때 진료와 치료 여부 결정하기',1,'선생님과 의료 전문가 등 사람이 책임 있게 판단해요.'],['🖼️','그림을 위한 여러 배경 아이디어 제안하기',0,'AI는 아이디어를 제공할 수 있어요.'],['📰','AI가 작성한 뉴스 내용이 맞는지 최종 확인하기',1,'사람이 근거와 출처를 확인해야 해요.']]},
 {tag:'다음에는 무엇이 올까요?',choices:['🌈 첫 번째 규칙','🔢 두 번째 규칙'],questions:[
 ['🔴🔵🔴🔵','다음 색은? ① 빨강 ② 파랑',0,'빨강·파랑이 반복되므로 빨강이 와요.'],['⭐🌙⭐🌙','다음 모양은? ① 달 ② 별',1,'별·달이 반복되므로 별이 와요.'],['1 → 2 → 3 → 4','다음 수는? ① 5 ② 9',0,'1씩 커지는 규칙을 찾았어요.'],['2 → 4 → 6 → 8','다음 수는? ① 11 ② 10',1,'2씩 커지는 규칙을 찾았어요.'],['🟩🟨🟩🟨','다음 색은? ① 노랑 ② 초록',1,'초록·노랑이 반복되므로 초록이 와요.']]}
];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const colors=['#e3f7ff','#f3edff','#e8fff5','#fff8df'];
export function renderExtraGame(index,name,state,root,{onChange,onComplete,onBack,onSound}){
 const meta=EXTRA_GAMES[index],data=DATA[index];if(!meta||!data)throw Error('게임 정보가 없습니다.');
 const st=state;st.step=Math.max(0,Math.min(data.questions.length,Number(st.step)||0));st.choices=st.choices&&typeof st.choices==='object'&&!Array.isArray(st.choices)?st.choices:{};
 const i=st.step,total=data.questions.length,completed=i===total;
 let html='<div class="labToolbar"><button class="mini" type="button" data-back="1">← AI 리터러시 목록</button><span class="stepchip">AI LITERACY '+(index+8)+' / 14</span></div><div class="labHero"><span class="labHeroIcon">'+meta[0]+'</span><h2>'+esc(meta[1])+'</h2><p>'+esc(meta[2])+'</p></div>';
 if(!completed){
  const [visual,question,answer,why]=data.questions[i],chosen=st.choices[String(i)];
  html+='<div class="labProgress"><div style="width:'+Math.round(i/total*100)+'%"></div></div><p class="labCounter">'+(i+1)+' / '+total+' 도전</p>';
  html+='<div class="extraScene"><span class="extraVisual">'+esc(visual)+'</span><h3>'+esc(question)+'</h3><p>'+esc(data.tag)+'</p></div>';
  html+='<div class="extraChoices">'+data.choices.map((v,n)=>'<button class="extraChoice '+(chosen===n?'selected':'')+'" type="button" data-extra="'+n+'">'+esc(v)+'</button>').join('')+'</div>';
  if(chosen!==undefined){
    const right=chosen===answer;
    html+='<div class="labFeedback '+(right?'good':'bad')+'">'+(right?'✅ 잘했어요! ':'💡 다시 골라 볼까요? ')+esc(why)+'</div>';
    if(right)html+='<button type="button" data-next="1" class="cta labPrimary">'+(i===total-1?'🏆 결과물 완성하기':'다음 문제 도전 →')+'</button>';
  }
  root.innerHTML=html;
  root.querySelectorAll('[data-extra]').forEach(b=>b.onclick=()=>{const n=Number(b.dataset.extra);st.choices[String(i)]=n;onSound(n===answer?'correct':'wrong');onChange();});
  const next=root.querySelector('[data-next]');if(next)next.onclick=()=>{st.step=i+1;onSound(st.step===total?'success':'tap');onChange();};
 }else{
  const sections=data.questions.map((q,j)=>({label:'도전 '+(j+1)+' · '+q[1],value:q[3]}));
  sections.unshift({label:'나의 성취',value:total+'개 활동을 완료하고 AI 사용 원리를 배웠어요.'});
  const report={game:index+8,title:meta[3],sections,note:index===3?'그림과 설명은 모두 수업용 가상 상황입니다. 실제 사진의 진위는 공식 출처를 확인해야 합니다.':index===0?'실제 AI 모델 학습이 아닌 그림 분류 학습 시뮬레이션입니다.':'초등학생의 AI 리터러시 학습을 위한 가상 사례와 선택형 활동입니다.',finishedAt:new Date().toISOString()};
  html+='<div class="labReport"><div class="labStamp">🏆</div><h3>'+esc(meta[3])+'</h3><p>'+esc(name)+' 탐험가</p>'+sections.map(s=>'<div class="labReportRow"><b>'+esc(s.label)+'</b><p>'+esc(s.value)+'</p></div>').join('')+'</div>';
  html+='<button class="cta labPrimary" type="button" data-save-extra="1">💾 내 결과물 저장하고 완료</button>';
  root.innerHTML=html;
  root.querySelector('[data-save-extra]').onclick=()=>onComplete(report);
 }
 root.querySelector('[data-back]').onclick=onBack;
}
