import {firebaseConfig} from './firebase-config.js';
const isReady = firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith('PASTE_') && firebaseConfig.projectId !== 'PASTE_PROJECT_ID';
export const live = !!isReady;
let auth, db, sdk, app;
const prefix = 'dream-v4-demo:';
const read = (key, fallback) => {try{return JSON.parse(localStorage.getItem(prefix + key)) ?? fallback}catch{return fallback}};
const write = (key, val) => localStorage.setItem(prefix + key, JSON.stringify(val));
function uuid(){return crypto.randomUUID?.() || Math.random().toString(36).slice(2)+Date.now()}
export async function connect(){
  if(!live)return;
  const [core,A,F] = await Promise.all([
    import('https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js'),
    import('https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js')
  ]);
  app=core.initializeApp(firebaseConfig);auth=A.getAuth(app);db=F.getFirestore(app);sdk={A,F};
  await new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>{unsubscribe();reject(new Error('Firebase 인증 응답이 지연되고 있습니다.'));},10000);
    let unsubscribe=()=>{};
    unsubscribe=A.onAuthStateChanged(auth,()=>{clearTimeout(timer);unsubscribe();resolve();},e=>{clearTimeout(timer);unsubscribe();reject(e);});
  });
}
async function anonymous(){if(auth.currentUser && auth.currentUser.isAnonymous)return auth.currentUser;if(auth.currentUser)await sdk.A.signOut(auth);return (await sdk.A.signInAnonymously(auth)).user}
function demoKey(s){return 'students:'+s}
export async function registerStudent(session,name){
  if(live){const u=await anonymous();const ref=sdk.F.doc(db,'sessions',session,'students',u.uid);let snap=await sdk.F.getDoc(ref);
    if(!snap.exists()){await sdk.F.setDoc(ref,{name,step:0,answers:{},joinedAt:sdk.F.serverTimestamp(),updatedAt:sdk.F.serverTimestamp()});snap=await sdk.F.getDoc(ref)}
    return {id:u.uid,...snap.data()};}
  const id=uuid();const data={id,name,step:0,answers:{},joinedAt:new Date().toISOString()};const arr=read(demoKey(session),[]);arr.push(data);write(demoKey(session),arr);return data;
}
export async function restoreStudent(session,id){
  if(live){if(!auth.currentUser || auth.currentUser.uid!==id || !auth.currentUser.isAnonymous)return null;const d=await sdk.F.getDoc(sdk.F.doc(db,'sessions',session,'students',id));return d.exists()?{id,...d.data()}:null;}
  return read(demoKey(session),[]).find(x=>x.id===id)||null;
}
export async function saveStudent(session,id,nextStep,answers){
  if(live){if(auth.currentUser?.uid!==id || !auth.currentUser?.isAnonymous)throw Error('학생 로그인 정보가 달라요. 다시 등록해 주세요.');
    const ref=sdk.F.doc(db,'sessions',session,'students',id);
    await sdk.F.updateDoc(ref,{step:nextStep,answers,updatedAt:sdk.F.serverTimestamp()});return;}
  const arr=read(demoKey(session),[]),idx=arr.findIndex(x=>x.id===id);if(idx<0)throw Error('기존 기록이 없습니다. 다시 등록해 주세요.');
  if(nextStep>arr[idx].step+1)throw Error('게임을 순서대로 완료해 주세요.');arr[idx]={...arr[idx],step:Math.max(arr[idx].step,nextStep),answers};write(demoKey(session),arr);
}
export async function switchStudent(){if(live&&auth.currentUser)await sdk.A.signOut(auth)}
export async function teacherLogin(email,password){
  if(live){if(!email || !password)throw Error('선생님 이메일과 비밀번호가 필요합니다.');if(auth.currentUser)await sdk.A.signOut(auth);await sdk.A.signInWithEmailAndPassword(auth,email,password);return;}
  return;
}
export async function teacherLogout(){if(live&&auth.currentUser)await sdk.A.signOut(auth)}
export function watchStudents(session,handler,onError){
  if(live){return sdk.F.onSnapshot(sdk.F.collection(db,'sessions',session,'students'),snap=>handler(snap.docs.map(d=>({id:d.id,...d.data()}))),onError)}
  const tick=()=>handler(read(demoKey(session),[]));tick();const timer=setInterval(tick,2000);return()=>clearInterval(timer);
}


const controlKey=s=>'control:'+s;
export function watchClassroom(session,handler,onError){
 if(live){
   return sdk.F.onSnapshot(sdk.F.doc(db,'sessions',session,'settings','classroom'),snap=>{
      const v=snap.exists()?snap.data():null;
      handler({unlocked:v?.unlocked??8,paused:!!v?.paused,configured:!!v});
   },onError);
 }
 const tick=()=>{const v=read(controlKey(session),null);handler({unlocked:v?.unlocked??8,paused:!!v?.paused,configured:!!v})};
 tick();const timer=setInterval(tick,1200);return()=>clearInterval(timer);
}
export async function setClassroom(session,unlocked,paused){
 if(!['1119','1120','1125'].includes(session))throw Error('수업 코드가 올바르지 않습니다.');
 if(!Number.isInteger(unlocked)||unlocked<1||unlocked>8||typeof paused!=='boolean')throw Error('진행 단계가 올바르지 않습니다.');
 if(live){
   if(!auth.currentUser||auth.currentUser.isAnonymous)throw Error('강사 로그인이 필요합니다.');
   await sdk.F.setDoc(sdk.F.doc(db,'sessions',session,'settings','classroom'),
     {unlocked,paused,updatedAt:sdk.F.serverTimestamp()});return;
 }
 write(controlKey(session),{unlocked,paused});
}


/** 관리자 전용: 학생 활동 문서 1개 삭제. Firebase Authentication 계정은 삭제하지 않습니다. */
export async function deleteStudentRecord(session,uid){
  if(!['1119','1120','1125'].includes(String(session))||!uid)throw Error('학생 기록을 확인해 주세요.');
  if(live){
    if(!auth.currentUser||auth.currentUser.isAnonymous)throw Error('강사 로그인이 필요합니다.');
    await sdk.F.deleteDoc(sdk.F.doc(db,'sessions',String(session),'students',String(uid)));
    return;
  }
  const items=read(demoKey(session),[]);write(demoKey(session),items.filter(x=>String(x.id)!==String(uid)));
}
/** 관리자 전용: 선택한 수업의 활동 문서만 초기화 (다른 수업의 기록 유지) */
export async function clearSessionStudents(session,onProgress){
  if(!['1119','1120','1125'].includes(String(session)))throw Error('수업을 선택해 주세요.');
  if(live){
    if(!auth.currentUser||auth.currentUser.isAnonymous)throw Error('강사 로그인이 필요합니다.');
    const snap=await sdk.F.getDocs(sdk.F.collection(db,'sessions',String(session),'students'));
    const docs=snap.docs;
    let total=0;
    for(let i=0;i<docs.length;i+=350){
      const batch=sdk.F.writeBatch(db);
      docs.slice(i,i+350).forEach(d=>batch.delete(d.ref));
      await batch.commit();total+=Math.min(350,docs.length-i);
      onProgress?.(total,docs.length);
    }
    return total;
  }
  const count=read(demoKey(session),[]).length;write(demoKey(session),[]);onProgress?.(count,count);return count;
}
