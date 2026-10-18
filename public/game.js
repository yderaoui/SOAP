import {SoapGame,C} from './game-core.js';
import {Renderer} from './renderer.js';
import {CHALLENGE,challengeResult,saveRun} from './challenge.js';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const stage=$('#stage'),canvas=$('#game'),hero=$('#hero-character');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const renderer=new Renderer(canvas,hero,{reduced});
const keys=new Set();
const input={x:0,y:0,pointer:null,dash:false,rinse:false};
let best=0,soundOn=false,audio=null,lastShotSound=0,announcementTimeout=0,game,finalStats=null,previous=performance.now(),visualTime=0;
try{best=Number(localStorage.getItem('soap-arcade-best'))||0;}catch{}
$('#best').textContent=String(best).padStart(6,'0');
function tone(frequency,duration=.12,type='sine',volume=.045,slide=0){if(!soundOn)return;try{if(!audio)audio=new(window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume().catch(()=>{});const osc=audio.createOscillator(),gain=audio.createGain();osc.type=type;osc.frequency.setValueAtTime(frequency,audio.currentTime);if(slide)osc.frequency.exponentialRampToValueAtTime(Math.max(35,frequency+slide),audio.currentTime+duration);gain.gain.setValueAtTime(volume,audio.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);osc.connect(gain).connect(audio.destination);osc.start();osc.stop(audio.currentTime+duration);}catch{}}
function announce(title,subtitle='',duration=2300){clearTimeout(announcementTimeout);const el=$('#announcement');el.replaceChildren(document.createTextNode(title));if(subtitle){const small=document.createElement('small');small.textContent=subtitle;el.append(small);}el.classList.add('visible');announcementTimeout=setTimeout(()=>el.classList.remove('visible'),duration);}
function updateHud(key,value){
 if(key==='score')$('#score').textContent=String(value).padStart(6,'0');
 if(key==='hp'){$('#hearts').replaceChildren();for(let i=0;i<3;i++){const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');if(i>=value)svg.classList.add('lost');const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d','M12 21C8 17 2 13 2 8a5 5 0 0 1 10-1A5 5 0 0 1 22 8c0 5-6 9-10 13Z');svg.append(path);$('#hearts').append(svg);}$('#hearts').setAttribute('aria-label',`${value} lives remaining`);}
 if(key==='combo'){$('#combo').textContent=`×${value}`;$('#combo-label').textContent=value>5?'UNREASONABLY CLEAN':value>2?'SOAP STREAK':'KEEP IT CLEAN';}
 if(key==='seconds')$('#timer').textContent=formatTime(value);
 if(key==='charge'){$('#rinse-value').textContent=`${value}%`;$('#rinse-progress').style.width=`${value}%`;$('#rinse').disabled=value<100;}
 if(key==='dash'){$('#dash-status').textContent=value>0?`${value}s`:'READY';$('#dash').disabled=value>0;}
 if(key==='phase'){$('#chapter').textContent=['','01 / THE FEED','02 / FOMO OVERLOAD','03 / THE ALGORITHM'][value];}
 if(key==='bossHP'){$('#boss-hud').hidden=value<0;$('#boss-health').value=Math.max(0,value);$('#boss-health').textContent=`${Math.max(0,value)} / 160`;$('#boss-percent').textContent=`${Math.max(0,Math.ceil(value/160*100))}%`;}
 if(key==='power'){$('#power-badge').hidden=value<=0;$('#power-badge').textContent=`RAINBOW SOAP / ${value}s`;}
}
function syncState(state){stage.dataset.state=state;$('#menu').hidden=state!=='menu';$('#countdown').hidden=state!=='countdown';$('#pause-overlay').hidden=state!=='paused';$('#end-overlay').hidden=!['over','victory'].includes(state);if(state==='menu'){$('#boss-hud').hidden=true;$('#power-badge').hidden=true;clearTimeout(announcementTimeout);$('#announcement').classList.remove('visible');}if(state==='paused'){keys.clear();input.pointer=null;$('#resume').focus({preventScroll:true});}if(state==='over'||state==='victory'){$('#announcement').classList.remove('visible');$('#boss-hud').hidden=true;$('#retry').focus({preventScroll:true});}}
function formatTime(seconds){return `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(Math.floor(seconds%60)).padStart(2,'0')}`;}
function onEvent(event){
 switch(event.type){
  case 'hud':updateHud(event.key,event.value);break;
  case 'state':syncState(event.state);break;
  case 'start':announce('KEEP IT CLEAN.','DODGE. DASH. LET THE BUBBLES DO THE TALKING.',1700);break;
  case 'wave':announce('FOMO OVERLOAD','THE BAD TAKES HAVE EVOLVED. UNFORTUNATELY.',2200);tone(160,.3,'sawtooth',.025,180);break;
  case 'boss':announce('THE ALGORITHM','IT KNOWS YOU’RE STILL SCROLLING.',2500);tone(100,.8,'sawtooth',.035,-55);$('#bottom-message').textContent='FINAL BOSS: BREAK THE ALGORITHM. ESCAPE THE FEED.';break;
  case 'fire':if(performance.now()-lastShotSound>170){lastShotSound=performance.now();tone(480,.045,'sine',.018,160);}break;
  case 'kill':tone(700+Math.random()*300,.07,'sine',.025,-300);break;
  case 'hit':tone(130,.22,'sawtooth',.04,-80);break;
  case 'shield-break':tone(500,.2,'triangle',.04,-350);break;
  case 'pickup':tone(540,.13,'sine',.05,350);setTimeout(()=>tone(880,.18,'sine',.035,220),100);break;
  case 'rinse':tone(100,.7,'triangle',.06,900);announce('MEGA RINSE','BAD VIBES: REMOVED.',1000);break;
  case 'dash':tone(160,.18,'sine',.03,650);break;
  case 'boss-fire':tone(110,.1,'triangle',.018,80);break;
  case 'end':showEnd(event);break;
 }
}
game=new SoapGame({onEvent});
function resize(){const rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height)return;const w=rect.width<650?600:1200,h=Math.round(w*rect.height/rect.width);game.resize(w,h);renderer.resize(w,h);input.pointer=null;}
new ResizeObserver(resize).observe(stage);resize();
function start(){if($('#help-dialog').open)$('#help-dialog').close();keys.clear();input.pointer=null;input.dash=false;input.rinse=false;$('#download-status').textContent='';$('#bottom-message').textContent='SURVIVE THE FEED. DEFEAT THE ALGORITHM.';game.start();canvas.focus({preventScroll:true});tone(250,.17,'triangle',.045,250);}
$('#play').addEventListener('click',start);$('#retry').addEventListener('click',start);
function toTitle(){game.reset();syncState('menu');$('#play').focus({preventScroll:true});$('#bottom-message').textContent='SURVIVE THE FEED. DEFEAT THE ALGORITHM.';}
$('#quit').addEventListener('click',toTitle);$('#title').addEventListener('click',toTitle);
function togglePause(){if(game.state==='paused'){game.resume();canvas.focus({preventScroll:true});}else game.pause();}
$('#pause').addEventListener('click',togglePause);$('#resume').addEventListener('click',togglePause);
$('#rinse').addEventListener('click',()=>{game.rinse();canvas.focus({preventScroll:true});});$('#dash').addEventListener('click',()=>{game.dash(input);canvas.focus({preventScroll:true});});
$('#sound').addEventListener('click',()=>{soundOn=!soundOn;$('#sound').setAttribute('aria-pressed',String(soundOn));$('#sound').setAttribute('aria-label',soundOn?'Turn sound off':'Turn sound on');$('#sound-lines').setAttribute('d',soundOn?'M16 7c5 3 5 7 0 10m3-13c8 4 8 12 0 16':'m16 8 6 8m0-8-6 8');if(soundOn)tone(620,.12,'sine',.035,180);});
$('#help').addEventListener('click',()=>{game.pause();$('#help-dialog').showModal();$('#help-done').focus();});
function closeHelp(){$('#help-dialog').close();if(game.state==='paused')$('#resume').focus({preventScroll:true});else $('#play').focus({preventScroll:true});}
$('#help-close').addEventListener('click',closeHelp);$('#help-done').addEventListener('click',closeHelp);
$('#fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await stage.requestFullscreen();}catch{$('#bottom-message').textContent='FULLSCREEN UNAVAILABLE. THE GAME STILL WORKS HERE.';}});
document.addEventListener('fullscreenchange',resize);
document.addEventListener('visibilitychange',()=>{if(document.hidden)game.pause();});
window.addEventListener('blur',()=>{keys.clear();game.pause();});
document.addEventListener('keydown',event=>{
 if($('#help-dialog').open)return;
 const key=event.key.toLowerCase();
 if(key===' '&&event.target.closest?.('button'))return;
 if(['arrowup','arrowdown','arrowleft','arrowright',' ','shift','p','escape','w','a','s','d'].includes(key)&&['playing','countdown','paused'].includes(game.state)){
  event.preventDefault();if((key==='p'||key==='escape')&&!event.repeat){togglePause();return;}
  if(game.state==='playing'||game.state==='countdown'){if(game.state==='playing'){if(key===' '&&!event.repeat)input.rinse=true;if(key==='shift'&&!event.repeat)input.dash=true;}keys.add(key);if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(key))input.pointer=null;}
 }
});
document.addEventListener('keyup',event=>keys.delete(event.key.toLowerCase()));
function pointerPosition(event){const r=canvas.getBoundingClientRect();return {x:(event.clientX-r.left)/r.width*game.w,y:(event.clientY-r.top)/r.height*game.h-(event.pointerType==='touch'?65:0)};}
let touching=false;
canvas.addEventListener('pointerdown',event=>{if(event.button!==0)return;if(['playing','countdown'].includes(game.state)){touching=true;input.pointer=pointerPosition(event);canvas.setPointerCapture(event.pointerId);canvas.focus({preventScroll:true});}});
canvas.addEventListener('pointermove',event=>{if(['playing','countdown'].includes(game.state)&&(event.pointerType==='mouse'||touching)){input.pointer=pointerPosition(event);}});
canvas.addEventListener('pointerup',()=>touching=false);canvas.addEventListener('pointercancel',()=>touching=false);
function showEnd(event){
 finalStats={...event};try{saveRun(localStorage,event);}catch{}const challenge=challengeResult(event);$('#practice-result')?.remove();const practice=document.createElement('div');practice.id='practice-result';practice.className='practice-result';const summary=document.createElement('strong');summary.textContent=challenge.completed?'CLEAN RUN COMPLETE':'THE CLEAN RUN / PRACTICE';const detail=document.createElement('span');detail.textContent=challenge.completed?'25,000+ points. Boss defeated. Under 90 seconds.':`${Math.min(CHALLENGE.minScore,event.score).toLocaleString()} / 25,000 points · ${event.won?'Boss defeated':'Defeat the boss'} · 90-second limit`;const link=document.createElement('a');link.href='/#challenge';link.textContent='$1,000 proposed prize · competition not live';practice.append(summary,detail,link);$('.end-stats').after(practice);const won=event.won,isBest=event.score>best;$('#end-kicker').textContent=won?'YOU ESCAPED THE TIMELINE':'ANOTHER APE LOST TO THE FEED';
 $('#end-title').replaceChildren(document.createTextNode(won?'FEED OFF.':'YOU GOT'),document.createElement('br'));const span=document.createElement('span');span.textContent=won?'HAPPY ON.':'RINSED.';$('#end-title').append(span);
 const jokes={'A RED CANDLE':'The red candle sends its regards.','A SCAM DM':'“Hello dear” was your final warning.','A RUG PULL':'You were standing on the investment thesis.','A REPLY GUY':'He really did have one more thing to add.','THE ALGORITHM':'It recommended this L specifically for you.'};$('#end-joke').textContent=won?'You defeated the Algorithm. Now go touch something that isn’t a screen.':jokes[event.cause]||'The timeline remains undefeated. For now.';
 $('#final-score').textContent=String(event.score).padStart(6,'0');$('#final-time').textContent=formatTime(event.seconds);$('#final-combo').textContent=`×${event.combo}`;$('#final-kills').textContent=event.kills;$('#new-best').hidden=!isBest;
 $('#rank').replaceChildren();const rank=won?['TOUCHED','GRASS']:event.score>3000?['CERTIFIED','SOAP LORD']:event.score>1000?['CERTIFIED','DEGEN']:['NEEDS','MORE SOAP'];$('#rank').append(document.createTextNode(rank[0]),document.createElement('br'),document.createTextNode(rank[1]));
 if(isBest){best=event.score;$('#best').textContent=String(best).padStart(6,'0');try{localStorage.setItem('soap-arcade-best',String(best));}catch{}}
 tone(won?620:200,won?.5:.4,won?'triangle':'sawtooth',.04,won?300:-110);
}
$('#download').addEventListener('click',()=>{
 if(!finalStats)return;const s=finalStats,c=document.createElement('canvas');c.width=1080;c.height=1350;const ctx=c.getContext('2d');const bg=ctx.createLinearGradient(0,0,1080,1350);bg.addColorStop(0,'#0a0014');bg.addColorStop(.6,'#230b37');bg.addColorStop(1,'#0a0014');ctx.fillStyle=bg;ctx.fillRect(0,0,1080,1350);ctx.strokeStyle='#ff006e22';ctx.lineWidth=1;for(let x=0;x<1080;x+=45){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,1350);ctx.stroke();}for(let y=0;y<1350;y+=45){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(1080,y);ctx.stroke();}
 ctx.strokeStyle='#00ffff55';ctx.strokeRect(34,34,1012,1282);ctx.font='800 30px Orbitron';ctx.fillStyle=C.cyan;ctx.fillText('SOAP ARCADE',75,105);ctx.font='17px "Space Mono"';ctx.fillStyle='#b099c7';ctx.fillText('ESCAPE THE TIMELINE',75,148);
 ctx.font='900 68px Orbitron';ctx.fillStyle='#e5d9ef';ctx.fillText(s.won?'FEED OFF.':'I GOT',75,260);ctx.fillStyle=C.cyan;ctx.shadowColor=C.cyan;ctx.shadowBlur=25;ctx.fillText(s.won?'HAPPY ON.':'RINSED.',75,340);ctx.shadowBlur=0;
 if(hero.complete&&hero.naturalWidth)ctx.drawImage(hero,170,327,760,760);
 ctx.fillStyle='#0a0014e8';ctx.fillRect(55,938,970,340);ctx.font='18px "Space Mono"';ctx.fillStyle='#a98dbd';ctx.fillText('FINAL SCORE',85,994);ctx.font='800 80px Orbitron';ctx.fillStyle=C.cyan;ctx.fillText(String(s.score).padStart(6,'0'),80,1085);
 ctx.strokeStyle='#ff006e55';ctx.beginPath();ctx.moveTo(80,1123);ctx.lineTo(995,1123);ctx.stroke();ctx.font='15px "Space Mono"';ctx.fillStyle='#9176a6';ctx.fillText('TIME ALIVE',85,1167);ctx.fillText('BEST COMBO',415,1167);ctx.fillText('TAKES CLEANED',735,1167);ctx.font='700 27px Orbitron';ctx.fillStyle='#dfc5ee';ctx.fillText(formatTime(s.seconds),85,1217);ctx.fillText(`×${s.combo}`,415,1217);ctx.fillText(String(s.kills),735,1217);ctx.font='14px "Space Mono"';ctx.fillStyle=C.pink;ctx.fillText('WASH THE NOISE. STAY HAPPY. #STAYSOAPPY',80,1294);
 c.toBlob(blob=>{if(!blob){$('#download-status').textContent='Could not export. Please try again.';return;}const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='soap-escape-the-timeline-score.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),2500);$('#download-status').textContent='SCORE CARD SAVED. YOUR GROUP CHAT IS NEXT.';},'image/png');
});
function frame(now){const dt=Math.min(.033,Math.max(0,(now-previous)/1000));previous=now;if(game.state!=='paused')visualTime+=dt;input.x=(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0);input.y=(keys.has('s')||keys.has('arrowdown')?1:0)-(keys.has('w')||keys.has('arrowup')?1:0);game.update(dt,input);input.dash=false;input.rinse=false;if(game.state==='countdown')$('#countdown-value').textContent=Math.max(1,Math.ceil(game.countdown));renderer.draw(game,visualTime);requestAnimationFrame(frame);}
requestAnimationFrame(frame);
// Read-only diagnostics make browser QA possible without exposing game controls.
Object.defineProperty(window,'soapArcade',{value:Object.freeze({snapshot:()=>({state:game.state,score:game.score,seconds:game.t,kills:game.kills,hp:game.player.hp,shield:game.player.shield,charge:game.charge,phase:game.phase,bossHP:game.boss?.hp??null,boss:game.boss?{x:game.boss.x,y:game.boss.y,hp:game.boss.hp}:null,player:{x:game.player.x,y:game.player.y},enemies:game.enemies.map(e=>({x:e.x,y:e.y,r:e.r,type:e.type})),bolts:game.bolts.map(b=>({x:b.x,y:b.y,vx:b.vx,vy:b.vy,r:b.r})),pickups:game.pickups.map(p=>({x:p.x,y:p.y,type:p.type})),world:{width:game.w,height:game.h}})})});
