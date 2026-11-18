// V7: students' actual selections become a downloadable 6-scene illustrated PNG.
const icons=['🌅','🧭','🧱','🤝','💪','🌟'];
const scenes=[
  '내가 좋아하는 꿈을 발견했어요.',
  '꿈을 이루기 위한 목표를 정했어요.',
  '어려운 일도 있었어요.',
  '도와줄 친구를 만났어요.',
  '다시 용기를 내어 도전했어요.',
  '조금씩 성장하며 웃었어요.'
];
function rounded(ctx,x,y,w,h,r,fill){
 ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill();
}
function wrap(ctx,text,x,y,max,lineHeight,maxLines=3){
 const letters=Array.from(String(text||''));let line='',lines=0;
 for(const ch of letters){
  if(ctx.measureText(line+ch).width>max&&line){ctx.fillText(line,x,y+lines*lineHeight);lines++;line='';if(lines>=maxLines)return;}
  line+=ch;
 }
 if(line&&lines<maxLines)ctx.fillText(line,x,y+lines*lineHeight);
}
export function resultSummary(student){
 const a=student?.answers||{};
 return {
  name:student?.name||'꿈 탐험가',
  dream:a['4']?.dream||'나의 꿈',
  favorite:a['4']?.favorite||'탐험하기',
  reason:a['4']?.reason||'도전',
  title:a['5']?.title||'나의 꿈 이야기',
  challenge:a['5']?.challenge||'도전',
  character:a['6']?.character||'🐰',
  color:a['6']?.color||'파랑',
  order:a['7']?.story?.length===6?a['7'].story:[0,1,2,3,4,5],
  narration:{'도전':'나는 또 도전할 거예요!','함께':'친구와 함께 성장했어요!','꿈':'내 꿈을 향해 출발해요!'}[a['7']?.narration]||'내 꿈을 향해 출발해요!'
 }
}
export function resultPreview(student){
 const a=resultSummary(student);
 const esc=s=>String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
 return `<div class="resultHead"><div class="resultOrb">${a.character}</div><div><span class="minor">나의 선택으로 완성한 작품</span><h3>${esc(a.title)}</h3><p>🌈 꿈: ${esc(a.dream)} · 좋아하는 활동: ${esc(a.favorite)} · 의상: ${esc(a.color)}</p></div></div><div class="resultScenes">${a.order.map((i,n)=>`<div class="resultScene"><span class="sceneIcon">${icons[i]}</span><b>${n+1} 장면</b><small>${esc(n===5?a.narration:scenes[i])}</small></div>`).join('')}</div><p class="subtle">이 결과물은 학생의 선택을 조합한 스토리보드 이미지이며 실제 AI 동영상 파일은 아닙니다.</p><button type="button" class="cta" id="downloadResult">🖼️ 나의 꿈 작품 PNG 저장하기</button>`;
}
export function exportResultPng(student){
 const a=resultSummary(student);
 const c=document.createElement('canvas');c.width=1200;c.height=1600;
 const g=c.getContext('2d');if(!g)throw Error('이 기기에서 그림 저장을 지원하지 않아요.');
 const grad=g.createLinearGradient(0,0,1200,1600);grad.addColorStop(0,'#182456');grad.addColorStop(.65,'#5344b5');grad.addColorStop(1,'#7465df');g.fillStyle=grad;g.fillRect(0,0,1200,1600);
 for(let i=0;i<30;i++){g.globalAlpha=.11;g.fillStyle='#fff';g.beginPath();g.arc((i*137)%1200,(i*229)%1600,3+i%4,0,Math.PI*2);g.fill()}g.globalAlpha=1;
 g.textBaseline='top';
 g.fillStyle='#bfffea';g.font='bold 31px sans-serif';g.fillText('AI DREAM WORLD  •  나의 꿈 탐험 작품',76,78);
 g.fillStyle='#ffffff';g.font='bold 57px sans-serif';wrap(g,a.title,76,146,1030,72,2);
 rounded(g,76,320,1048,210,30,'#ffffff');
 g.font='112px sans-serif';g.fillText(a.character,111,368);
 g.fillStyle='#192d66';g.font='bold 37px sans-serif';wrap(g,'꿈: '+a.dream,295,372,740,48,2);
 g.fillStyle='#586592';g.font='27px sans-serif';g.fillText('내가 좋아하는 일: '+a.favorite+'  |  옷 색깔: '+a.color,295,460);
 for(let n=0;n<6;n++){
  const i=a.order[n],col=n%2,row=Math.floor(n/2),x=76+col*541,y=578+row*250;
  rounded(g,x,y,507,220,24,'#ffffff');
  rounded(g,x+18,y+18,76,56,14,'#e9e5ff');
  g.fillStyle='#4c3d9c';g.font='bold 25px sans-serif';g.fillText('장면 '+(n+1),x+29,y+29);
  g.font='75px sans-serif';g.fillText(icons[i],x+385,y+33);
  g.fillStyle='#24305a';g.font='bold 31px sans-serif';
  wrap(g,n===5?a.narration:scenes[i],x+29,y+115,448,43,2);
 }
 g.fillStyle='#fff';g.font='bold 31px sans-serif';g.fillText('주인공: '+a.name+'     |     8개의 게임을 완성했어요!',76,1390);
 g.font='24px sans-serif';g.fillStyle='#d9e1ff';g.fillText('유쌤클래스 · 학생 선택 기반 창작 스토리보드',76,1460);
 const link=document.createElement('a');link.href=c.toDataURL('image/png');
 link.download='나의꿈_스토리보드_'+a.name.replace(/[^a-zA-Z0-9가-힣_-]/g,'').slice(0,12)+'.png';
 document.body.append(link);link.click();link.remove();
}
