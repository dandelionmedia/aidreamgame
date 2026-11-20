import {DREAM_PROMPT} from './practice-prompt-content-v18.js?v=20261120-director-v4';

export function setupPracticePrompt({showPage}) {
  const byId=id=>document.getElementById(id);
  const openButton=byId('practiceTabOpen');
  const backButton=byId('practiceTabBack');
  const copyButton=byId('practiceCopyButton');
  const prompt=byId('practicePromptText');
  const scrollButton=byId('practiceTopButton');
  const toc=byId('practiceTocItem1');
  let returnPage='joinPage';
  if(!openButton||!backButton||!copyButton||!prompt||!scrollButton||!toc) {
    console.warn('실습프롬프트 탭 요소가 없습니다.');
    return;
  }
  prompt.value=DREAM_PROMPT;
  const count=byId('practiceCharCount');
  if(count)count.textContent=DREAM_PROMPT.length.toLocaleString('ko-KR')+'자 · 9단계 전체 포함';
  const status=byId('practiceCopyStatus');
  openButton.addEventListener('click',()=>{
    const current=document.querySelector('main > .screen:not(.hidden)');
    if(current&&current.id!=='promptPage')returnPage=current.id;
    showPage('promptPage');
    openButton.classList.add('practiceNavActive');
    openButton.setAttribute('aria-current','page');
    window.scrollTo({top:0,behavior:'smooth'});
  });
  backButton.addEventListener('click',()=>{
    openButton.classList.remove('practiceNavActive');
    openButton.removeAttribute('aria-current');
    showPage(returnPage);
    window.scrollTo({top:0,behavior:'smooth'});
  });
  async function copyFullText(){
    let success=false;
    if(navigator.clipboard&&typeof navigator.clipboard.writeText==='function') {
      try{await navigator.clipboard.writeText(DREAM_PROMPT);success=true}catch(e){}
    }
    if(!success) {
      try {
        prompt.focus();prompt.select();prompt.setSelectionRange(0,prompt.value.length);
        success=!!document.execCommand('copy');
        prompt.setSelectionRange(0,0);copyButton.focus();
      } catch(e) {success=false}
    }
    if(success) {
      copyButton.textContent='✅ 프롬프트 복사완료';
      copyButton.classList.add('practiceCopied');
      if(status)status.textContent='🎉 전체 실습 프롬프트가 복사됐어요! ChatGPT에 붙여넣기 해 보세요.';
    } else {
      copyButton.textContent='📋 프롬프트 복사하기';
      copyButton.classList.remove('practiceCopied');
      if(status)status.textContent='복사가 제한된 브라우저입니다. 아래 프롬프트를 길게 누르거나 선택해서 직접 복사해 주세요.';
      prompt.focus();prompt.select();
    }
  }
  copyButton.addEventListener('click',copyFullText);
  toc.addEventListener('click',e=>{
    e.preventDefault();
    byId('practicePromptCard')?.scrollIntoView({behavior:'smooth',block:'start'});
  });
  scrollButton.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
}
