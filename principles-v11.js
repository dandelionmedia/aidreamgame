
/* V11 — AI 원리 체험실: inspired by the concept categories found on AI Teading Kids.
   All activities, examples, visuals and code are independently authored educational simulations.
   No third-party imagery, pretrained diffusion model, or external AI API is invoked. */
export const PRINCIPLE_GAMES=[
 ['🎨','그림 주문 제작소','주인공과 배경을 골라 나만의 그림 장면을 꾸며요','나의 그림 주문 카드'],
 ['📖','이야기 이어 쓰기','주인공과 사건을 골라 서로 다른 이야기 결말을 비교해요','이야기 조합 카드'],
 ['🎹','멜로디 이어 만들기','건반을 누른 뒤 다음 음을 이어 붙여요','나의 음악 패턴 카드'],
 ['🎲','같은 주문, 다른 결과','같은 선택으로 여러 장면을 만들고 결과를 비교해요','다양한 결과 탐험 카드'],
 ['⚙️','규칙을 만든 기계','규칙을 켜고 꺼서 로봇의 분류 결과를 비교해요','규칙 실험 보고서'],
 ['💬','다음 낱말 예측','다음에 올 법한 말을 확률 막대를 보고 골라요','다음 낱말 예측 카드'],
 ['🧽','노이즈에서 그림 찾기','단계를 밀며 얼룩이 그림이 되는 과정을 관찰해요','이미지 생성 원리 관찰표'],
 ['📊','데이터의 양 비교','적은 예시와 많은 예시를 비교하고 결과 차이를 알아봐요','학습 자료 비교 기록'],
 ['🤖','내가 가르친 분류 로봇','분류 예시를 넣고 처음 보는 그림을 판단하게 해요','분류 로봇 실험 성적표'],
 ['❗','확신하는 AI의 실수','자신 있게 말하는 답도 확인해야 함을 배워요','AI 답변 검증 카드'],
 ['🖼️','그림의 진짜 출처 찾기','겉모습 대신 출처와 제작 설명을 확인해요','출처 검증 탐정 수첩'],
 ['🪄','구체적인 그림 주문','요청 조건을 하나씩 더하고 결과 범위를 좁혀요','구체적인 프롬프트 카드'],
 ['📱','추천 화면의 비밀','취향 선택이 추천에 주는 영향을 관찰해요','추천 다양성 체험 카드'],
 ['🛡️','나만의 AI 약속','중요하게 생각하는 안전 규칙 세 개를 선택해요','나의 AI 약속 카드']
];
const e=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const title=(txt)=>'<h3 class="p11question">'+e(txt)+'</h3>';
const option=(kind,value,label,selected=false)=>'<button type="button" class="p11choice '+(selected?'selected':'')+'" data-p11="'+kind+'" data-value="'+e(value)+'">'+e(label)+'</button>';
const control=(kind,label,disabled=false)=>'<button type="button" class="cta p11action" data-p11="'+kind+'" data-value="go" '+(disabled?'disabled':'')+'>'+e(label)+'</button>';
const panel=(html)=>'<div class="p11result">'+html+'</div>';
const actors=[['🐰','달토끼'],['🤖','꼬마 로봇'],['🐻','모험 곰']];
const stages=[['🌲','신비한 숲'],['🌙','달나라'],['🏰','꿈의 성']];
const events=[['🌧️','비가 내려요'],['💎','보물을 찾아요'],['🤝','친구를 만나요']];
const endings=[['🎉','함께 축하해요'],['🚀','새 모험을 떠나요'],['💛','친구를 도와요']];
const aIcons=['🐰','🤖','🐻'],pIcons=['🌲','🌙','🏰'];
const notes=[['도','C4',262],['레','D4',294],['미','E4',330],['솔','G4',392],['라','A4',440]];
const rulesList=['귀가 있어요','꼬리가 있어요','짖는 소리를 내요'];
const animalCases=[
 ['🐶','강아지',[true,true,true],true],['🐕','강아지 친구',[true,true,true],true],
 ['🐱','고양이',[true,true,false],false],['🦊','여우',[true,true,false],false],
 ['🐰','토끼',[true,false,false],false],['🐻','곰',[true,false,false],false]
];
const predicted=[
 ['나는','오늘','학교에','가요'],['나는','오늘','숲으로','가요'],
 ['친구가','함께','춤을','춰요'],['친구가','함께','노래를','불러요']
];
const hallucinations=[
 {q:'지구는 태양 주위를 도는 행성인가요?',reply:'아니요! 태양이 지구 주위를 돕니다. 확실해요!',correct:false,why:'태양계에서 지구는 태양 주위를 공전해요.'},
 {q:'박쥐는 포유류인가요?',reply:'네! 박쥐는 포유류입니다. 확실해요!',correct:true,why:'박쥐는 날지만 포유류에 속해요.'},
 {q:'낮과 밤은 왜 생길까요?',reply:'달이 지구를 가리기 때문이에요. 틀림없어요!',correct:false,why:'낮과 밤은 주로 지구의 자전 때문에 생겨요.'}
];
const evidence=[
 ['🦄','SNS에 “오늘 학교 앞에 유니콘이 나타났다”는 그림이 올라왔어요.','이미지 작성자와 원본 게시물을 확인해요.'],
 ['🌌','AI로 만든 별 도시 그림을 실제 천체 사진이라고 소개했어요.','제작 방식과 관측 자료 출처를 확인해요.'],
 ['🐧','“동네에서 펭귄을 봤다”는 사진이 날짜 없이 퍼졌어요.','촬영 장소와 날짜, 공식 안내를 확인해요.']
];
const recTopics=['🐶 동물','🚀 우주','🎨 그림','⚽ 운동','🎵 음악','🌲 자연'];
const agreements=[
 'AI가 한 말도 근거를 확인할래요.','비밀번호와 주소를 AI에 쓰지 않을래요.',
 '다른 사람의 사진과 작품을 존중할래요.','숙제는 스스로 생각하며 AI 도움을 받을래요.',
 'AI가 만든 것을 사람들에게 알려 줄래요.','친구에게 친절한 표현을 사용할래요.',
 '다른 의견과 정보를 골고루 살펴볼래요.','어려운 문제는 선생님과 함께 해결할래요.',
 'AI를 쓰기 전에 무엇을 배우려는지 생각할래요.'
];
export function renderPrincipleGame(index,name,state,root,{onChange,onComplete,onBack,onSound,onNote}){
 const meta=PRINCIPLE_GAMES[index];if(!meta)throw Error('실습 게임을 찾지 못했어요.');
 const s=state||{};
 const count=()=>Number(s.count)||0;
 const get=(key,def=0)=>Number.isInteger(Number(s[key]))?Number(s[key]):def;
 let done=false,result=[],tip='',body='',preview='';
 const next=(label='🎉 실습 결과 완성',ready=true)=>control('complete',label,!ready);
 const save=()=>onComplete({game:index+15,title:meta[3],sections:[
   {label:'실습 내용',value:meta[2]},...result.map(([label,value])=>({label:String(label),value:String(value)}))
 ],note:tip||'브라우저에서 직접 계산·조합하는 AI 원리 교육용 시뮬레이션입니다.',finishedAt:new Date().toISOString()});
 const choose=(kind,items,value)=>'<div class="p11grid">'+items.map((x,i)=>option(kind,i,x[0]+' '+x[1],value===i)).join('')+'</div>';
 switch(index){
 case 0:{
   const actor=get('actor'),place=get('place');
   body=title('누가 등장할까요?')+choose('actor',actors,actor)+title('어디에서 만날까요?')+choose('place',stages,place);
   preview=panel('<div class="p11scene">'+stages[place][0]+' '+actors[actor][0]+'</div><b>'+e(stages[place][1])+'의 '+e(actors[actor][1])+'</b><p>이 그림은 선택한 이모지로 즉시 꾸민 시뮬레이션 장면입니다. 실제 생성형 AI가 만든 이미지는 아니에요.</p>');
   result=[['주인공',actors[actor][1]],['배경',stages[place][1]],['완성 그림 주문',stages[place][1]+'에 서 있는 '+actors[actor][1]+'의 밝고 귀여운 그림을 만들어 줘.']];
   tip='그림은 AI 서버에서 생성한 것이 아니라 브라우저의 그림 소재를 조합한 예시예요.';done=s.actor!==undefined&&s.place!==undefined;break;
 }
 case 1:{
   const actor=get('actor'),event=get('event'),ending=get('ending');
   body=title('이야기의 주인공')+choose('actor',actors,actor)+title('어떤 사건이 일어날까요?')+choose('event',events,event)+title('마지막은 어떻게 끝날까요?')+choose('ending',endings,ending);
   const story=actors[actor][1]+'은(는) '+stages[(actor+event)%3][1]+'에서 하루를 시작했어요. '+events[event][1]+'. 용기를 내서 방법을 찾았어요. 마지막에는 '+endings[ending][1]+'.';
   preview=panel('<h3>📖 나의 짧은 동화</h3><p>'+e(story)+'</p><small>사전 작성한 문장 조합으로 작동하는 교육용 이야기 제작입니다.</small>');
   result=[['동화',story]];done=s.actor!==undefined&&s.event!==undefined&&s.ending!==undefined;break;
 }
 case 2:{
   const seq=Array.isArray(s.seq)?s.seq:[],extension=Array.isArray(s.extension)?s.extension:[];
   body=title('건반을 3번 이상 터치해 멜로디를 만들어요')+'<div class="p11keyboard">'+notes.map((n,i)=>option('note',i,'🎵 '+n[0],false)).join('')+'</div>';
   if(seq.length>=3)body+=control('extend','🎹 다음 음 4개 이어 붙이기');
   preview=panel('<strong>내가 연주한 음</strong><div class="p11notes">'+seq.map(x=>'<span>'+e(notes[x]?.[0]||'?')+'</span>').join('')+'</div><strong>규칙으로 이어 붙인 음</strong><div class="p11notes auto">'+extension.map(x=>'<span>'+e(notes[x]?.[0]||'?')+'</span>').join('')+'</div>');
   result=[['내가 선택한 음',seq.map(i=>notes[i]?.[0]).join(' → ')],['프로그램이 이어 붙인 음',extension.map(i=>notes[i]?.[0]).join(' → ')]];
   tip='기본 음정과 이어 붙이기 규칙으로 소리를 만드는 시뮬레이션입니다. 학습된 음악 생성 AI는 아닙니다.';
   done=seq.length>=3&&extension.length>=4;break;
 }
 case 3:{
   const c=count(),a=get('actor'),p=get('place');
   body=title('같은 선택을 유지하고 결과를 두 번 만들어 보세요')+choose('actor',actors,a)+choose('place',stages,p)+control('draw','🎲 같은 주문으로 다시 만들기');
   const variations=['🌟 반짝이는','🌈 알록달록한','💫 꿈꾸는','✨ 눈부신'];
   preview=panel('<div class="p11scene">'+stages[p][0]+' '+actors[a][0]+'</div><h3>'+e(variations[(c+1)%4])+' '+e(actors[a][1])+'</h3><p>현재 시도: '+c+'번 · 같은 요청도 다양한 조합을 보여 줄 수 있어요.</p>');
   result=[['선택한 주문',actors[a][1]+' · '+stages[p][1]],['반복 생성 횟수',c+'회']];
   tip='시각적 변형은 프로그램에서 미리 정한 구성의 반복입니다. 실제 확률적 이미지 생성 모델이 아닙니다.';done=c>=2;break;
 }
 case 4:{
   const enabled=Array.isArray(s.enabled)?s.enabled:[],score=animalCases.filter((v,i)=>{
     const pred=enabled.every(k=>v[2][k]);return pred===v[3];
   }).length;
   body=title('규칙을 누르면 로봇의 판단이 바뀌어요')+'<div class="p11grid">'+rulesList.map((v,i)=>option('rule',i,(enabled.includes(i)?'✅ ':'➕ ')+v,enabled.includes(i))).join('')+'</div>';
   preview=panel('<h3>바르게 맞힌 그림 '+score+' / '+animalCases.length+'개</h3><div class="p11examples">'+animalCases.map(v=>'<span>'+v[0]+' '+(enabled.every(k=>v[2][k])?'🐶':'❌')+'</span>').join('')+'</div><p>규칙을 너무 적게 또는 많이 정하면 결과가 달라져요.</p>');
   result=[['선택한 규칙',enabled.map(i=>rulesList[i]).join(' / ')||'아무 규칙도 선택하지 않음'],['정답 수',score+' / '+animalCases.length]];
   tip='사람이 직접 정한 규칙으로 분류하는 방식과 데이터에서 스스로 패턴을 배우는 머신러닝은 달라요.';done=enabled.length>0;break;
 }
 case 5:{
   const words=Array.isArray(s.words)?s.words:[],choices=[['친구와',10],['교실에서',8],['우주에서',5],['노래해요',2]];
   body=title('다음에 올 말을 골라 문장을 이어 보세요')+panel('<div class="p11sentence">나는 오늘 '+e(words.join(' '))+'</div>');
   if(words.length<3)body+='<div class="p11grid">'+choices.map((v,i)=>option('word',i,v[0]+' ▰'.repeat(Math.max(1,Math.round(v[1]/3))),false)).join('')+'</div>';
   else body+=control('clearWords','↺ 새로운 문장 만들어 보기');
   preview=panel('<p>막대가 길수록 이 작은 예시표에서 더 자주 나오는 말이에요.</p><p>실제 대형 언어 모델의 확률이 아닌 예시 빈도표입니다.</p>');
   result=[['만든 문장','나는 오늘 '+words.join(' ')],['예측 원리','앞선 표현을 참고해 다음 낱말의 후보를 비교합니다.']];done=words.length>=3;break;
 }
 case 6:{
   const step=get('denoise',0);const emoji=['▓▓▓▓','▒▒▓▒','▒🐰▒','🌲🐰✨','🌲🐰🌟'][Math.min(step,4)];
   body=title('버튼을 눌러 얼룩을 조금씩 줄여 보세요')+panel('<div class="p11noise">'+emoji+'</div><div class="p11meter">관찰 단계 '+step+' / 4</div>')+control('denoise',step>=4?'↺ 처음부터 다시 관찰':'🧽 얼룩 한 단계 줄이기');
   result=[['관찰 단계',step+' / 4'],['알게 된 점','이미지 생성 AI에는 여러 번에 걸쳐 잡음을 줄여 나가는 방식이 있습니다.']];
   tip='실제 확산 모델의 중간 결과 이미지는 아니며, 교육용 문자 그림으로 과정을 설명합니다.';done=step>=4;break;
 }
 case 7:{
   const n=get('samples',0),v=[5,50,500,5000][Math.min(n,3)];
   body=title('예시 자료를 늘려 보면서 변화를 관찰해요')+panel('<h3>학습 예시 '+v+'개</h3><div class="p11meter">'+['⚪','🟡','🟢','🔵'][n]+' 예시의 양 단계 '+(n+1)+'</div><p>'+(['예시가 적어서 다양한 상황을 이해하기 어려울 수 있어요.','더 많은 상황을 본다고 가정해요.','자료가 다양해졌지만 여전히 편향이 있을 수 있어요.','자료가 많더라도 정확하고 공정한지는 별도로 확인해야 해요.'][n])+'</p>')+control('samples',n>=3?'🔁 다시 비교':'📈 예시를 더 보여 주기');
   result=[['예시 자료',v+'개(가상의 비교 수치)'],['발견','데이터의 양뿐 아니라 대표성·정확성·공정성이 중요해요.']];
   tip='학습량에 따른 실제 모델 성능 비교는 아닙니다. 교육용 수치를 이용한 개념 실험이에요.';done=n>=3;break;
 }
 case 8:{
   const training=Array.isArray(s.training)?s.training:[],testing=get('testing',-1);
   const examples=[['🐶','동물'],['🐱','동물'],['🐰','동물'],['🚗','탈것'],['🚌','탈것'],['🚲','탈것']];
   if(training.length<6){
     body=title('예시를 하나씩 로봇에게 가르쳐요 ('+training.length+'/6)')+panel('<div class="p11scene">'+examples[training.length][0]+'</div>')+option('train','동물','🐾 동물 바구니')+option('train','탈것','🚗 탈것 바구니');
     preview=panel('<p>로봇에게 보여 준 그림: '+training.map(i=>examples[i][0]).join(' ')+'</p>');
   }else{
     body=title('새 그림 🦊 은 어느 종류일까요?')+option('test','동물','🐾 동물이라고 예상')+option('test','탈것','🚗 탈것이라고 예상');
     preview=panel('<h3>예측: '+(testing===0?'동물':testing===1?'탈것':'아직 예측하지 않음')+'</h3><p>예시에서 배운 분류 개념을 새로운 그림에 적용해 봐요.</p>');
   }
   result=[['훈련 예시',training.length+'개'],['예측 결과',testing===0?'🦊 여우를 동물로 분류했어요.':testing===1?'예측을 다시 생각해 봐요.':'미완료']];
   tip='사람이 정해 둔 정답을 선택해 배우는 분류 실습이며 실제 AI 모델을 훈련하지 않습니다.';done=training.length>=6&&testing===0;break;
 }
 case 9:{
   const i=Math.min(count(),3),picked=get('verify',-1),test=hallucinations[Math.min(i,2)];
   body=title('자신감 있게 말하는 AI의 대답, 믿어도 될까요?')+panel('<h3>'+e(test.q)+'</h3><p>🤖 '+e(test.reply)+'</p><strong>자신감: 매우 높음 📊</strong>');
   if(i<3)body+='<div class="p11grid">'+option('verify',0,'✅ 맞는 내용')+option('verify',1,'⚠️ 틀린 내용')+'</div>'+ (picked>=0?panel('<p>'+e(test.why)+'</p>'):'');
   if(i<3&&picked===(test.correct?0:1))body+=control('nextVerify','다음 답변 확인하기 →');
   result=[['검증한 답',i+' / 3'],['배운 점','확신하는 말투만으로 사실 여부를 알 수 없습니다.']];done=i>=3;break;
 }
 case 10:{
   const i=Math.min(count(),3),look=evidence[Math.min(i,2)];
   body=title('그림과 설명만으로 진짜라고 단정할 수 있을까요?')+panel('<div class="p11scene">'+look[0]+'</div><p>'+e(look[1])+'</p>');
   if(i<3)body+=control('checkSource','🔎 출처와 제작 정보 확인하기');
   if(get('sourceShown',0))body+=panel('<strong>확인 방법</strong><p>'+e(look[2])+'</p>')+control('nextSource','다음 사례 보기 →');
   result=[['확인한 사례',i+' / 3'],['검증 습관','이미지의 출처·원본·촬영 날짜·제작 설명을 확인해요.']];
   tip='실제 사진을 분석하는 진위 판별 모델이 아닙니다. 상황별 검증 방법을 훈련합니다.';done=i>=3;break;
 }
 case 11:{
   const actor=get('actor',-1),place=get('place',-1),style=get('style',-1);
   body=title('요청에 조건을 하나씩 더해 보세요')+choose('actor',actors,actor)+choose('place',stages,place)+'<div class="p11grid">'+option('style',0,'🌈 밝고 귀엽게',style===0)+option('style',1,'🌙 조용하고 신비롭게',style===1)+'</div>';
   const specificity=[actor,place,style].filter(x=>x>=0).length;
   preview=panel('<h3>명확한 조건 '+specificity+' / 3개</h3><p>'+e([actor<0?'누군가':actors[actor][1],place<0?'어딘가':stages[place][1],style<0?'어떤 분위기':' '+(style===0?'밝고 귀여운':'조용하고 신비로운')+' 분위기'].join(' / '))+'</p>');
   result=[['완성 프롬프트',(actor<0?'귀여운 친구':actors[actor][1])+'가 '+(place<0?'예쁜 장소':stages[place][1])+'에서 '+(style===1?'신비롭게':'밝고 귀엽게')+' 등장하는 그림을 표현해 줘.']];
   tip='요청문에 조건을 추가하면 가능한 결과의 범위를 구체화할 수 있어요.';done=specificity===3;break;
 }
 case 12:{
   const picks=Array.isArray(s.picks)?s.picks:[],index=picks.length;
   
   body=title('6번 선택해 나의 추천 화면을 만들어 봐요')+'<div class="p11grid">'+recTopics.map((v,i)=>option('topic',i,v)).join('')+'</div>';
   preview=panel('<p>내가 지금까지 고른 주제: '+picks.map(i=>recTopics[i]).join(' · ')+'</p><p>추천 알고리즘은 내가 자주 선택한 주제를 더 많이 보여 줄 수 있어요.</p>');
   if(index>=6)body+=control('allTopics','🧭 놓친 주제도 모두 보기');
   if(get('revealed',0))preview+=panel('<h3>다양한 주제 '+recTopics.join(' ')+'</h3><p>내가 고르지 않았던 주제도 새로운 발견이 될 수 있어요.</p>');
   result=[['선택한 주제',picks.map(i=>recTopics[i]).join(', ')],['돌아보기','추천에는 보이지 않는 주제도 있을 수 있어요.']];
   tip='추천 점수 실습을 단순화한 예이며 특정 동영상 플랫폼의 실제 추천 알고리즘은 아닙니다.';done=index>=6&&get('revealed',0)===1;break;
 }
 case 13:{
   const selections=Array.isArray(s.rules)?s.rules:[];
   body=title('아래 약속 중 나에게 중요한 세 가지를 골라요')+'<div class="p11rules">'+agreements.map((v,i)=>option('agreement',i,(selections.includes(i)?'✅ ':'💜 ')+v,selections.includes(i))).join('')+'</div>';
   preview=panel('<h3>나의 AI 약속 '+selections.length+' / 3</h3>'+selections.map((i,j)=>'<p>'+(j+1)+'. '+e(agreements[i])+'</p>').join(''));
   result=selections.map((i,j)=>['나의 약속 '+(j+1),agreements[i]]);
   tip='내가 직접 고른 실천 약속입니다. 가족이나 친구와도 생각을 나누어 보세요.';done=selections.length===3;break;
 }
 }
 const canComplete=done&&index!==9?true:done;
 const header='<div class="labToolbar"><button class="mini" type="button" data-p11="back" data-value="go">← AI 원리 체험 목록</button><span class="stepchip">AI 원리 '+(index+1)+' / 14</span></div><div class="labHero"><span class="labHeroIcon">'+meta[0]+'</span><h2>'+e(meta[1])+'</h2><p>'+e(meta[2])+'</p></div>';
 const footer=next('🏆 내 체험 결과 카드 완성',canComplete);
 root.innerHTML=header+body+preview+footer;
 const notify=(sound='tap')=>{onSound(sound);onChange();};
 root.querySelectorAll('[data-p11]').forEach(el=>el.onclick=()=>{
  const kind=el.dataset.p11,v=el.dataset.value,n=Number(v);
  switch(kind){
   case 'back':onBack();return;
   case 'complete':if(done)save();return;
   case 'actor':case 'place':case 'event':case 'ending':case 'style':s[kind]=n;break;
   case 'draw':s.count=count()+1;break;
   case 'note':{const seq=Array.isArray(s.seq)?s.seq:[];if(seq.length<8)seq.push(n);s.seq=seq;onNote?.(notes[n][2]);break;}
   case 'extend':{const seq=Array.isArray(s.seq)?s.seq:[];s.extension=Array.from({length:4},(_,i)=>(seq[(seq.length+i-1)%seq.length]+(i%2))%notes.length);s.extension.forEach((x,i)=>setTimeout(()=>onNote?.(notes[x][2]),i*180));break;}
   case 'rule':{const x=Array.isArray(s.enabled)?s.enabled:[];s.enabled=x.includes(n)?x.filter(i=>i!==n):[...x,n];break;}
   case 'word':{const x=Array.isArray(s.words)?s.words:[];if(x.length<3)x.push(['친구와','교실에서','우주에서','노래해요'][n]);s.words=x;break;}
   case 'clearWords':s.words=[];break;
   case 'denoise':s.denoise=(get('denoise')+1)%5;break;
   case 'samples':s.samples=(get('samples')+1)%4;break;
   case 'train':{const x=Array.isArray(s.training)?s.training:[];if(x.length<6&&v===(x.length<3?'동물':'탈것'))x.push(x.length);s.training=x;break;}
   case 'test':s.testing=v==='동물'?0:1;break;
   case 'verify':s.verify=n;break;
   case 'nextVerify':s.count=count()+1;s.verify=-1;break;
   case 'checkSource':s.sourceShown=1;break;
   case 'nextSource':s.count=count()+1;s.sourceShown=0;break;
   case 'topic':{const x=Array.isArray(s.picks)?s.picks:[];if(x.length<6)x.push(n);s.picks=x;break;}
   case 'allTopics':s.revealed=1;break;
   case 'agreement':{const x=Array.isArray(s.rules)?s.rules:[];s.rules=x.includes(n)?x.filter(i=>i!==n):x.length<3?[...x,n]:x;break;}
  }
  notify('tap');
 });
}
