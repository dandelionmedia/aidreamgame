// V7 original synthesised UI effects; no audio files or third-party assets.
const key='dream-v7-sound';
let enabled=localStorage.getItem(key)==='on';
let audio=null;
function context(){
 if(!audio){const Cls=window.AudioContext||window.webkitAudioContext;if(!Cls)return null;audio=new Cls();}
 if(audio.state==='suspended')audio.resume().catch(()=>{});
 return audio;
}
function tone(freq=440,duration=.12,delay=0,type='sine',gain=.045){
 if(!enabled)return;
 const c=context();if(!c)return;
 const o=c.createOscillator(),g=c.createGain(),now=c.currentTime+delay;
 o.type=type;o.frequency.setValueAtTime(freq,now);
 g.gain.setValueAtTime(0,now);
 g.gain.linearRampToValueAtTime(gain,now+.018);
 g.gain.exponentialRampToValueAtTime(.001,now+duration);
 o.connect(g);g.connect(c.destination);o.start(now);o.stop(now+duration+.02);
}
export function isSoundOn(){return enabled}
export function toggleSound(){
 enabled=!enabled;localStorage.setItem(key,enabled?'on':'off');
 if(enabled){context();playSound('start')}
 return enabled;
}
export function playSound(kind='tap'){
 if(!enabled)return;
 if(kind==='tap')tone(460,.085,0,'sine',.026);
 else if(kind==='correct'){tone(540,.14,0);tone(810,.18,.12)}
 else if(kind==='wrong'){tone(300,.14,0,'triangle',.025)}
 else if(kind==='success'){[523,659,784,1047].forEach((f,i)=>tone(f,.24,i*.115,'sine',.045))}
 else if(kind==='start'){tone(380,.1);tone(580,.12,.1)}
 else if(kind==='slide')tone(760,.075,0,'sine',.018);
}


/* User-initiated classroom melody keyboard. Independent original tones. */
export function playNote(frequency=330){
 if(!enabled)return;
 const c=context();if(!c)return;
 const safeHz=Math.max(180,Math.min(900,Number(frequency)||330));
 const o=c.createOscillator(),gain=c.createGain(),now=c.currentTime;
 o.type='sine';o.frequency.setValueAtTime(safeHz,now);
 gain.gain.setValueAtTime(.0001,now);
 gain.gain.exponentialRampToValueAtTime(.043,now+.025);
 gain.gain.exponentialRampToValueAtTime(.0001,now+.34);
 o.connect(gain);gain.connect(c.destination);o.start(now);o.stop(now+.38);
}
