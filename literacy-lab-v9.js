
/* AI Literacy Lab V9: seven self-contained real interactive classroom games.
   Assessment simulations, not real remote AI training or real-world fact verification. */
export const LAB_GAMES=[
 ['🪄','프롬프트 마법사','역할·목적·조건·형식으로 요청을 완성해요','프롬프트 카드'],
 ['🕵️','AI 탐정단: 진짜와 가짜','출처·단서·근거를 찾아 판단해요','디지털 탐정 인증서'],
 ['🤖','AI 로봇 훈련소','예시로 분류 규칙을 가르쳐요','모델 훈련 성적표'],
 ['🚪','AI 방탈출','다섯 개의 AI 퍼즐을 풀어 탈출해요','탈출 성공 배지'],
 ['⚖️','AI 윤리 선택 게임','개인정보·공정성·저작권을 생각해요','AI 윤리 수호자 인증서'],
 ['🔎','AI 오류 찾기','틀린 답변의 문제를 찾고 확인해요','팩트체크 보고서'],
 ['📚','AI 스토리 어드벤처','주인공·배경·협력을 선택해 동화를 완성해요','나만의 디지털 동화']
];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safe=(v,max=100)=>String(v??'').trim().slice(0,max);
const pick=(items,field,st,{multi=false}={})=>'<div class="labChoices">'+items.map(([name,description],i)=>'<button type="button" data-choice="'+esc(field)+'" data-val="'+i+'" class="labChoice '+(multi?(st[field]||[]).includes(i)?'selected':'':st[field]===i?'selected':'')+'"><strong>'+esc(name)+'</strong>'+(description?'<small>'+esc(description)+'</small>':'')+'</button>').join('')+'</div>';
const bar=(value,total)=>'<div class="labProgress"><div style="width:'+Math.round(value/total*100)+'%"></div></div><p class="labCounter">'+Math.min(value,total)+' / '+total+' 완료</p>';
const btn=(text,disabled=false,kind='labNext')=>'<button type="button" class="cta labPrimary" data-action="'+kind+'" '+(disabled?'disabled':'')+'>'+text+'</button>';
const promptRoles=[['책을 잘 설명하는 선생님','친절한 말투'],['상상력 많은 동화 작가','재미있는 이야기'],['환경을 지키는 과학자','관찰과 발견']];
const promptGoals=[['초등학생에게 AI를 설명해 줘','AI 학습'],['우주 탐험 이야기를 만들어 줘','동화 창작'],['쓰레기 줄이기 방법을 알려 줘','환경 실천']];
const promptConstraints=[['초등학교 3학년도 이해하게','쉬운 낱말'],['실생활 예시를 2개 포함해','구체적인 예시'],['개인정보 없이 안전하게','안전한 사용']];
const promptFormats=[['표 3줄로 정리해 줘','표'],['짧은 이야기 5문장으로 써 줘','이야기'],['번호를 붙인 목록으로 정리해 줘','목록']];
const detectiveCases=[
 {claim:'공식 학교 공지라고 쓰인 메시지가 낯선 사이트의 비밀번호 입력을 요구합니다.',clue:'보낸 주소가 학교 공식 홈페이지와 다릅니다.',source:'학교 홈페이지 또는 선생님에게 직접 확인',answer:1,why:'로고와 제목만으로 진짜 공지인지 확정할 수 없어요. 비밀번호를 입력하지 말고 공식 경로로 확인해요.'},
 {claim:'친구가 “AI가 만든 그림은 항상 실제로 있었던 일을 보여 줘”라고 합니다.',clue:'AI는 실제로 촬영하지 않은 장면도 만들 수 있습니다.',source:'원본 파일·제작 설명·신뢰할 수 있는 보도 확인',answer:1,why:'사진처럼 보이는 AI 그림도 실제 사건의 증거가 아닐 수 있어요.'},
 {claim:'“우리 반 급식 메뉴가 내일 바뀐다”는 글을 출처 없이 전달받았습니다.',clue:'작성자와 날짜가 없고 공식 공지는 보이지 않습니다.',source:'학교 공식 급식 안내',answer:2,why:'진짜인지 가짜인지 바로 단정하지 말고 학교 안내에서 확인해야 해요.'}
];
const ethicCases=[
 {title:'친구 사진을 AI에 올려도 될까요?',desc:'친구의 사진을 허락 없이 멋진 캐릭터로 바꾸고 싶어요.',choices:['허락 없이 바로 업로드','당사자와 보호자·선생님에게 확인하고 다른 방법 찾기','몰래 친구에게만 보여 주기'],answer:1,why:'사진은 개인정보가 될 수 있어요. 허락과 학교 규칙을 먼저 확인해요.',tag:'개인정보'},
 {title:'AI가 한쪽 친구들만 추천해요',desc:'팀원을 고르는 AI가 항상 같은 친구만 선택해요.',choices:['그대로 팀을 구성하기','선택 이유와 기준을 살펴보고 공정하게 다시 구성하기','선정되지 않은 친구를 놀리기'],answer:1,why:'AI의 추천도 편향될 수 있어요. 사람의 공정한 판단이 필요해요.',tag:'공정성'},
 {title:'인터넷 만화를 그대로 내 작품으로?',desc:'다른 사람이 그린 만화 이미지를 AI로 수정한 뒤 내 작품이라고 발표하려고 해요.',choices:['원작자 표시 없이 제출','사용 허락·출처·라이선스를 확인하고 직접 만든 요소를 구분하기','인터넷 그림은 무조건 자유롭게 쓰기'],answer:1,why:'다른 사람의 창작물을 사용할 때는 이용 조건과 출처를 확인해야 해요.',tag:'저작권'}
];
const wrongCases=[
 {answer:'태양은 지구 주위를 하루에 한 번 돌기 때문에 낮과 밤이 생겨요.',parts:['태양은 지구 주위를 하루에 한 번 돌기 때문에','낮과 밤이 생겨요'],wrong:0,source:'과학 교과서와 천문 교육 자료',correct:'낮과 밤은 지구가 자전하면서 생겨요.'},
 {answer:'물은 어느 곳에서나 반드시 100°C에 끓어요.',parts:['물은 어느 곳에서나 반드시','100°C에 끓어요'],wrong:0,source:'과학 교과서의 기압과 끓는점 설명',correct:'물의 끓는점은 기압에 따라 달라질 수 있어요.'},
 {answer:'박쥐는 새라서 날개를 펄럭여요.',parts:['박쥐는 새라서','날개를 펄럭여요'],wrong:0,source:'동물 분류 교과서 또는 박물관 자료',correct:'박쥐는 새가 아니라 포유류예요.'}
];
const exits=[
 ['🤖 AI란?','AI는 어떤 역할을 할 수 있을까요?',['배우거나 예측하는 일을 도울 수 있어요','언제나 모든 것을 아는 존재예요'],0,'AI는 다양한 작업을 도울 수 있지만 언제나 맞지는 않아요.'],
 ['🔐 개인정보','다음 중 AI에 쓰지 말아야 할 것은?',['내 별명','집 비밀번호'],1,'비밀번호 등 민감한 정보는 입력하지 않아요.'],
 ['🎨 생성형 AI','AI에게 그림을 부탁할 때 유용한 방법은?',['색과 배경을 구체적으로 설명','아무 설명도 하지 않기'],0,'구체적인 요청을 하면 의도를 표현하기 쉬워요.'],
 ['🔎 사실 확인','AI 답변이 낯설면 어떻게 하나요?',['책과 신뢰할 수 있는 출처 확인','무조건 친구에게 전달'],0,'AI 답변의 출처와 근거를 확인해요.'],
 ['🤝 책임 있는 사용','AI를 이용한 숙제를 발표한다면?',['AI 사용 여부를 수업 규칙에 맞게 밝히기','모두 내가 혼자 했다고 말하기'],0,'AI를 어떻게 활용했는지 정직하게 설명해요.']
];
const robotTrain=[
 ['🐶','강아지','동물'],['🐱','고양이','동물'],['🐰','토끼','동물'],
 ['🚗','자동차','탈것'],['🚌','버스','탈것'],['🚲','자전거','탈것']
];
const robotTests=[['🦊','여우','동물'],['🚀','우주선','탈것'],['🐻','곰','동물'],['🚂','기차','탈것']];
const roles=[['🦊','용감한 여우'],['🐰','호기심 많은 토끼'],['🤖','친절한 로봇']];
const places=[['🌲','신비한 숲'],['🚀','반짝이는 우주'],['🏫','미래의 학교']];
const troubles=[['🌧️','비가 와서 길을 잃었어요'],['🧩','어려운 수수께끼를 만났어요'],['💔','친구가 자신감을 잃었어요']];
const help=[['🤝','친구와 힘을 합쳐요'],['💡','새로운 아이디어를 떠올려요'],['💪','다시 용기 내어 도전해요']];
export function renderLabGame(game,studentName,state,root,{onChange,onComplete,onBack,onSound}){
 const id=Number(game),meta=LAB_GAMES[id],st=state||{};
 if(!meta)return;
 let html='<div class="labToolbar"><button class="mini" type="button" data-back="1">← 7개 게임 목록</button><span class="stepchip">AI LITERACY '+(id+1)+' / 7</span></div><div class="labHero"><span class="labHeroIcon">'+meta[0]+'</span><h2>'+esc(meta[1])+'</h2><p>'+esc(meta[2])+'</p></div>';
 let completed=false,report=null,progress=0,total=1;
 const step=Number(st.step)||0;
 const next=()=>{st.step=step+1;onSound('correct');onChange();};
 const choice=(field,items,correctIndex=null,desc='')=>{
   html+=pick(items,field,st);
   if(correctIndex!==null && st[field]!==undefined){
     const ok=st[field]===correctIndex;
     html+='<div class="labFeedback '+(ok?'good':'bad')+'">'+(ok?'✅ 좋은 선택이에요! ':'💡 다른 선택도 생각해 봐요. ')+esc(desc)+'</div>';
     html+=btn('다음 단계 →',!ok);
   }else html+=btn('다음 단계 →',st[field]===undefined);
 };
 if(id===0){
   const groups=[['① 역할을 정해요',promptRoles,'role'],['② 무엇을 요청할까요?',promptGoals,'goal'],['③ 어떤 조건이 좋을까요?',promptConstraints,'constraint'],['④ 결과를 어떻게 받을까요?',promptFormats,'format']];
   total=4;progress=Math.min(step,4);
   if(step<4){const [label,items,field]=groups[step];html+='<h3>'+label+'</h3>';choice(field,items);}
   else{completed=true;const val=(field,items)=>items[st[field]||0]?.[0]||items[0][0];
     const prompt='너는 '+val('role',promptRoles)+'야. '+val('goal',promptGoals)+'. '+val('constraint',promptConstraints)+'. '+val('format',promptFormats)+'.';
     report={title:'나만의 프롬프트 카드',sections:[['역할',val('role',promptRoles)],['목적',val('goal',promptGoals)],['조건',val('constraint',promptConstraints)],['출력 형식',val('format',promptFormats)],['완성 프롬프트',prompt]],note:'완성한 문장을 복사해서 AI에 요청해 보세요. AI의 답변은 사람이 확인해야 합니다.'};
   }
 }else if(id===1){
   total=3;progress=Math.min(step,3);
   if(step<3){const c=detectiveCases[step];html+='<h3>🔍 사건 '+(step+1)+' / 3</h3><div class="labEvidence"><strong>의심스러운 주장</strong><p>'+esc(c.claim)+'</p><strong>관찰한 단서</strong><p>'+esc(c.clue)+'</p><strong>확인할 곳</strong><p>'+esc(c.source)+'</p></div><h3>어떤 판단이 가장 알맞을까요?</h3>';
     choice('case'+step,[['믿을 수 있어요','확인할 필요가 없어요'],['주의해야 해요','위험한 신호가 있어요'],['아직 판단을 보류해요','공식 출처로 더 확인해요']],c.answer,c.why);
   }else{completed=true;report={title:'디지털 탐정 인증서',sections:detectiveCases.map((c,i)=>['사건 '+(i+1),['믿을 수 있어요','주의해야 해요','판단 보류'][st['case'+i]]+' / '+c.source]),note:'제시된 이야기는 수업용 가상 사례입니다. 실제 사진이나 뉴스의 진위를 자동 판별하는 도구는 아닙니다.'};}
 }else if(id===2){
   total=10;progress=Math.min(step,10);
   if(step<6){const c=robotTrain[step];html+='<h3>🤖 훈련용 예시 '+(step+1)+' / 6</h3><div class="labObject">'+c[0]+'</div><h3>'+c[1]+'은(는) 어떤 종류일까요?</h3>';
     choice('train'+step,[['동물','살아 있는 생물'],['탈것','타고 이동하는 물건']],c[2]==='동물'?0:1,'그림의 특징을 보고 분류할 수 있어요.');
   }else if(step<10){const i=step-6,c=robotTests[i];html+='<h3>🧪 처음 보는 그림을 예측해요 '+(i+1)+' / 4</h3><div class="labObject">'+c[0]+'</div><p>여섯 개의 예시에서 배운 규칙을 사용해 보세요.</p>';
     choice('test'+i,[['동물','생물 친구'],['탈것','이동 수단']],c[2]==='동물'?0:1,'예시와 닮은 점을 찾으면 분류할 수 있어요.');
   }else{completed=true;const hits=robotTests.filter((x,i)=>st['test'+i]===(x[2]==='동물'?0:1)).length;
     report={title:'AI 모델 훈련 성적표',sections:[['훈련 자료','동물 3개 + 탈것 3개'],['새 문제 예측',hits+' / 4개 정답'],['정확도',Math.round(hits/4*100)+'%'],['분류 원리','라벨을 붙인 예시를 보고 새로운 그림을 분류해요']],note:'이 게임은 분류 학습을 설명하는 규칙 기반 교육 시뮬레이션입니다. 실제 기계학습 모델을 학습시키는 과정은 아닙니다.'};
   }
 }else if(id===3){
   total=5;progress=Math.min(step,5);
   if(step<5){const q=exits[step];html+='<div class="labEscape"><span>🚪</span><strong>탈출의 문 '+(step+1)+' / 5</strong></div><h3>'+esc(q[1])+'</h3>';choice('door'+step,[[q[2][0],'첫 번째 열쇠'],[q[2][1],'두 번째 열쇠']],q[3],q[4]);}
   else{completed=true;report={title:'AI 방탈출 성공 배지',sections:[['도전 결과','5개의 AI 방을 모두 통과했어요!'],['찾은 열쇠','AI 이해 · 개인정보 · 프롬프트 · 사실 확인 · 책임 있는 사용']],note:'다섯 개의 문제를 해결한 AI 리터러시 탐험가입니다.'};}
 }else if(id===4){
   total=3;progress=Math.min(step,3);
   if(step<3){const c=ethicCases[step];html+='<h3>⚖️ '+c.tag+' 이야기 '+(step+1)+' / 3</h3><div class="labEvidence"><strong>'+esc(c.title)+'</strong><p>'+esc(c.desc)+'</p></div>';choice('ethic'+step,c.choices.map(v=>[v,'']),c.answer,c.why);}
   else{completed=true;report={title:'AI 윤리 수호자 인증서',sections:ethicCases.map((c,i)=>[c.tag,'안전한 행동을 선택했어요.']),note:'학교 규칙과 다른 사람의 권리를 존중하며 AI를 사용해요.'};}
 }else if(id===5){
   total=6;progress=Math.min(step,6);
   if(step<6){const i=Math.floor(step/2),c=wrongCases[i];
     if(step%2===0){html+='<h3>⚠️ AI 답변에서 잘못된 설명을 찾아요</h3><div class="labEvidence"><strong>AI가 한 말 (수업용 가상 예시)</strong><p>'+esc(c.answer)+'</p></div><p>잘못된 내용을 포함한 부분을 골라 주세요.</p>';choice('wrong'+i,c.parts.map(x=>[x,'틀렸을 수 있는 표현']),c.wrong,'어떤 부분을 근거와 비교해야 할지 살펴봐요.');}
     else{html+='<h3>📖 어디서 다시 확인할까요?</h3><div class="labEvidence"><strong>검증 자료</strong><p>'+esc(c.source)+'</p><strong>바르게 고친 문장</strong><p>'+esc(c.correct)+'</p></div>';choice('verify'+i,[['교과서·공식 교육자료에서 확인','검증'],['출처 없는 댓글을 그대로 믿기','재전파']],0,'신뢰할 수 있는 자료와 비교해요.');}
   }else{completed=true;report={title:'팩트체크 보고서',sections:wrongCases.map((c,i)=>['검증 '+(i+1),c.correct]),note:'이 문제들은 학습용 예시이며 실제 인터넷 기사 자동 검증이 아닙니다.'};}
 }else if(id===6){
   const groups=[['주인공을 선택해요',roles,'hero'],['어디서 모험을 할까요?',places,'place'],['어떤 어려움이 생길까요?',troubles,'trouble'],['어떻게 문제를 해결할까요?',help,'solution'],['이야기의 마지막은?', [['🌟','함께 성장했어요'],['🎉','모두 축하했어요'],['🚀','다음 모험을 시작했어요']],'ending']];
   total=5;progress=Math.min(step,5);
   if(step<5){const [label,items,field]=groups[step];html+='<h3>📚 '+label+'</h3>';choice(field,items.map(a=>[a[0]+' '+a[1],'']));}
   else{completed=true;
     const v=(field,items)=>items[st[field]||0]?.[1]||items[0][1],h=v('hero',roles),p=v('place',places),t=v('trouble',troubles),so=v('solution',help),end=['함께 성장했어요','모두 축하했어요','다음 모험을 시작했어요'][st.ending||0];
     report={title:'나만의 디지털 동화',sections:[['1장면 · 새로운 시작',h+'은(는) '+p+'에 살고 있었어요.'],['2장면 · 꿈 발견','어느 날 멋진 모험을 하기로 했어요.'],['3장면 · 어려움',t+'.'],['4장면 · 함께 해결',so+'.'],['5장면 · 변화','주인공은 새로운 방법을 배웠어요.'],['6장면 · 마무리',end+'.']],note:'친구에게 이야기를 들려주고 서로 어떤 점이 좋았는지 이야기해 보세요.'};
   }
 }
 if(!completed){
   html=html.replace('</div></div></div>','</div></div></div>'); // Keep semantic HTML stable
   html+=bar(progress,total);
   const stateLabel=(id===2&&step>=6)?'로봇 분류 예측':'현재 미션';
   html+='<p class="labStageLabel">'+stateLabel+' · '+(step+1)+'단계</p>';
   root.innerHTML=html;
   root.querySelectorAll('[data-choice]').forEach(el=>el.onclick=()=>{
     st[el.dataset.choice]=Number(el.dataset.val);onSound('tap');onChange();});
   const nextBtn=root.querySelector('[data-action="labNext"]');
   if(nextBtn)nextBtn.onclick=next;
 }else{
   const fields=report.sections.map(([key,value])=>'<div class="labReportRow"><b>'+esc(key)+'</b><p>'+esc(value)+'</p></div>').join('');
   html+='<div class="labReport"><div class="labStamp">🏆</div><h3>'+esc(report.title)+'</h3><p>'+esc(studentName)+' 탐험가의 결과물</p>'+fields+'<p class="labNote">'+esc(report.note)+'</p></div>';
   html+=btn('💾 결과 저장하고 게임 완료',false,'complete');
   root.innerHTML=html;
   root.querySelector('[data-action="complete"]').onclick=()=>onComplete({game:id+1,title:report.title,sections:report.sections.map(([label,value])=>({label,value})),note:report.note,finishedAt:new Date().toISOString()});
 }
 root.querySelector('[data-back]').onclick=onBack;
}
const sectionPair=s=>Array.isArray(s)?[s[0],s[1]]:[s?.label,s?.value];
export function renderSavedLabResult(name,record){
 if(!record||!Array.isArray(record.sections))return '';
 return '<div class="labReport"><div class="labStamp">🏆</div><h3>'+esc(record.title)+'</h3><p>'+esc(name)+' 탐험가의 결과물</p>'+record.sections.map(item=>{const [k,v]=sectionPair(item);return '<div class="labReportRow"><b>'+esc(k)+'</b><p>'+esc(v)+'</p></div>'}).join('')+'<p class="labNote">'+esc(record.note||'')+'</p></div>';
}
export function downloadLabReport(name,record){
 const text=[record.title,'탐험가: '+name,'',...record.sections.map(item=>{const [k,v]=sectionPair(item);return k+'\\n'+v+'\\n'}),'',record.note||''].join('\\n');
 const c=document.createElement('canvas');c.width=1100;c.height=1500;
 const x=c.getContext('2d');if(!x)throw Error('이 기기에서는 이미지 저장을 사용할 수 없어요.');
 const grad=x.createLinearGradient(0,0,1100,1500);grad.addColorStop(0,'#243a87');grad.addColorStop(1,'#8c5ed6');x.fillStyle=grad;x.fillRect(0,0,1100,1500);
 x.fillStyle='#fff';x.fillRect(55,52,990,1390);
 x.fillStyle='#6b51c2';x.textBaseline='top';x.font='bold 28px sans-serif';x.fillText('AI LITERACY GAME LAB',102,105);
 x.fillStyle='#293765';x.font='bold 48px sans-serif';x.fillText((record.title||'AI 리터러시 결과물').slice(0,17),102,163);
 x.font='bold 29px sans-serif';x.fillText('탐험가: '+String(name).slice(0,14),102,238);
 let y=325;
 function wrap(v,maxWidth,size,lineHeight,maxLines=4){
   x.font=size+'px sans-serif';const chars=Array.from(String(v??''));let line='',count=0;
   for(const ch of chars){if(x.measureText(line+ch).width>maxWidth&&line){x.fillText(line,115,y);y+=lineHeight;line='';count++;if(count>=maxLines)return;}line+=ch;}
   if(line){x.fillText(line,115,y);y+=lineHeight;}
 }
 for(const item of record.sections.slice(0,7)){
  const [key,value]=sectionPair(item);
  if(y>1300)break;
  x.fillStyle='#7763bc';x.font='bold 23px sans-serif';x.fillText(String(key),103,y);y+=39;
  x.fillStyle='#283c67';wrap(value,870,25,36,4);y+=34;
 }
 x.fillStyle='#6c75a1';x.font='22px sans-serif';x.fillText('유쌤클래스 · 나의 AI 리터러시 창작 결과',103,1385);
 const link=document.createElement('a');link.download='AI리터러시_'+String(record.title).replace(/[^가-힣a-zA-Z0-9_-]/g,'').slice(0,18)+'.png';link.href=c.toDataURL('image/png');document.body.append(link);link.click();link.remove();
}
