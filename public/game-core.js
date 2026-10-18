export const C={cyan:'#00FFFF',pink:'#FF006E',violet:'#A36BFF',white:'#F0E5FF'};
export class SoapGame {
 constructor({width=1200,height=720,random=Math.random,onEvent=()=>{}}={}){this.w=width;this.h=height;this.random=random;this.onEvent=onEvent;this.reset();}
 emit(type,data={}){this.onEvent({type,...data});}
 reset(){this.state='menu';this.t=0;this.countdown=3;this.score=0;this.kills=0;this.combo=1;this.maxCombo=1;this.streak=0;this.comboTime=0;this.charge=100;this.phase=1;this.enemies=[];this.shots=[];this.bolts=[];this.pickups=[];this.particles=[];this.labels=[];this.boss=null;this.spawnTimer=1.2;this.shotTimer=0;this.killCause='THE TIMELINE';this.shake=0;this.flash=0;this.rinseRadius=0;this.player={x:this.w/2,y:this.h*.79,r:18,hp:3,shield:true,invincible:2,dash:0,dashCooldown:0,dashX:0,dashY:-1,power:0,tilt:0};this.lastHud={};this.hud(true);}
 start(){this.reset();this.state='countdown';this.emit('state',{state:this.state});}
 pause(){if(this.state==='playing'||this.state==='countdown'){this.resumeState=this.state;this.state='paused';this.emit('state',{state:'paused'});}}
 resume(){if(this.state==='paused'){this.state=this.resumeState||'playing';this.emit('state',{state:this.state});}}
 resize(w,h){const sx=w/this.w,sy=h/this.h;for(const group of [this.enemies,this.shots,this.bolts,this.pickups,this.particles,this.labels])for(const a of group){a.x*=sx;a.y*=sy;if(a.origin!==undefined)a.origin*=sx;}this.player.x*=sx;this.player.y*=sy;if(this.boss){this.boss.x*=sx;this.boss.y*=sy;}this.w=w;this.h=h;}
 hud(force=false){const data={score:this.score,hp:this.player.hp,shield:this.player.shield,combo:this.combo,charge:Math.floor(this.charge),seconds:Math.floor(this.t),phase:this.phase,power:Math.ceil(this.player.power),dash:Math.ceil(this.player.dashCooldown),bossHP:this.boss?Math.ceil(this.boss.hp):-1};for(const key in data)if(force||data[key]!==this.lastHud[key]){this.emit('hud',{key,value:data[key]});this.lastHud[key]=data[key];}}
 addScore(n){this.score+=Math.round(n);}
 label(text,x,y,color=C.cyan){this.labels.push({text,x,y,life:1.3,max:1.3,color});}
 burst(x,y,color=C.cyan,count=14,speed=150){for(let i=0;i<count;i++){const a=this.random()*Math.PI*2,s=(.3+this.random())*speed,life=.3+this.random()*.5;this.particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life,max:life,size:2+this.random()*4,color});}if(this.particles.length>550)this.particles.splice(0,this.particles.length-550);}
 dash(input={}){const p=this.player;if(this.state!=='playing'||p.dashCooldown>0)return false;let dx=input.x||0,dy=input.y||0;if(!dx&&!dy){if(input.pointer){dx=input.pointer.x-p.x;dy=input.pointer.y-p.y;}if(Math.hypot(dx,dy)<8){dx=0;dy=-1;}}const d=Math.hypot(dx,dy)||1;p.dashX=dx/d;p.dashY=dy/d;p.dash=.18;p.dashCooldown=3;p.invincible=Math.max(p.invincible,.45);this.burst(p.x,p.y,C.cyan,12,100);this.emit('dash');this.hud();return true;}
 rinse(){if(this.state!=='playing'||this.charge<100)return false;this.charge=0;this.rinseRadius=1;this.shake=.8;this.flash=.3;this.bolts=[];const targets=[...this.enemies];for(const e of targets)this.destroyEnemy(e,true);if(this.boss){this.boss.hp-=32;this.boss.hit=.2;if(this.boss.hp<=0)this.defeatBoss();}this.player.invincible=Math.max(this.player.invincible,1.2);this.emit('rinse');this.label('MEGA RINSE',this.player.x,this.player.y-70);this.hud();return true;}
 spawnEnemy(type,options={}){const r=this.random;type=type||(['candle','take','candle',...(this.phase>1?['scam','rug']:['take'])][Math.floor(r()*(this.phase>1?5:4))]);const specs={candle:{r:21,hp:2,speed:115,score:65},take:{r:40,hp:3,speed:84,score:100},scam:{r:27,hp:3,speed:100,score:120},rug:{r:53,hp:5,speed:72,score:170}};const spec=specs[type];const x=options.x??(75+r()*(this.w-150));const enemy={type,x,y:-90,origin:x,...spec,hp:spec.hp,age:0,seed:r()*6.28,shoot:1.6+r()*1.8,hit:0,warn:0,dead:false,...options};this.enemies.push(enemy);return enemy;}
 spawnPickup(x,y,type){type=type||(['shield','rainbow','health'][Math.floor(this.random()*3)]);this.pickups.push({x,y,type,r:20,age:0});}
 destroyEnemy(enemy,rinse=false){if(enemy.dead)return;enemy.dead=true;this.kills++;this.streak++;this.comboTime=3;this.combo=Math.min(8,1+Math.floor(this.streak/4));this.maxCombo=Math.max(this.maxCombo,this.combo);this.addScore(enemy.score*this.combo);if(!rinse)this.charge=Math.min(100,this.charge+7);this.burst(enemy.x,enemy.y,enemy.type==='candle'?C.pink:C.cyan,18);if(this.kills%4===0)this.label(`CLEAN ×${this.combo}`,enemy.x,enemy.y,C.cyan);if(!rinse&&(this.kills%7===0||this.random()<.12))this.spawnPickup(enemy.x,enemy.y,this.kills%7===0?'rainbow':undefined);this.emit('kill',{enemy});}
 hitPlayer(cause){const p=this.player;if(p.invincible>0||this.state!=='playing')return;p.invincible=1.7;this.shake=.65;this.flash=.11;this.burst(p.x,p.y,C.pink,24);if(p.shield){p.shield=false;this.label('SHIELD POPPED',p.x,p.y-65,C.pink);this.emit('shield-break');}else{p.hp--;this.streak=0;this.combo=1;this.comboTime=0;this.killCause=cause;this.emit('hit');if(p.hp<=0)this.end(false);}this.hud();}
 collect(pickup){const p=this.player;pickup.dead=true;if(pickup.type==='shield'){p.shield=true;this.label('BUBBLE SHIELD',p.x,p.y-65);}else if(pickup.type==='rainbow'){p.power=9;this.label('RAINBOW SOAP!',p.x,p.y-65);}else{if(p.hp<3)p.hp++;else this.addScore(250);this.label(p.hp===3?'HAPPY LEVEL MAX':'+1 HAPPY',p.x,p.y-65,C.pink);}this.burst(pickup.x,pickup.y,C.cyan,15);this.emit('pickup',{pickup});this.hud();}
 enterBoss(){this.phase=3;for(const e of this.enemies)this.burst(e.x,e.y,C.pink,5);this.enemies=[];this.bolts=[];this.boss={x:this.w/2,y:-150,age:0,hp:160,maxHP:160,shot:1.8,minion:4,hit:0,warn:0};this.emit('boss');this.hud(true);}
 defeatBoss(){if(!this.boss||this.state!=='playing')return;this.burst(this.boss.x,this.boss.y,C.pink,100,350);this.burst(this.boss.x,this.boss.y,C.cyan,70,250);this.addScore(3000+this.player.hp*500);this.bolts=[];this.boss.hp=0;this.shake=1.5;this.flash=.5;this.end(true);}
 end(won){if(this.state!=='playing')return;this.state=won?'victory':'over';this.emit('end',{won,score:this.score,kills:this.kills,combo:this.maxCombo,seconds:this.t,cause:this.killCause,hp:this.player.hp});this.emit('state',{state:this.state});this.hud();}
 fireBolt(x,y,vx,vy,r=9){if(this.bolts.length<140)this.bolts.push({x,y,vx,vy,r,age:0,grazed:false});}
 fire(){const p=this.player;const angles=p.power>0?[-.23,0,.23]:[-.035,.035];for(let i=0;i<angles.length;i++){const a=angles[i];this.shots.push({x:p.x+(i-(angles.length-1)/2)*16,y:p.y-37,vx:Math.sin(a)*600,vy:-Math.cos(a)*650,r:p.power>0?10:8,damage:1,dead:false,rainbow:p.power>0});}this.emit('fire');}
 update(dt,input={}){
  if(this.state==='paused')return;
  for(const p of this.particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=Math.exp(-2*dt);p.vy*=Math.exp(-2*dt);p.life-=dt;}this.particles=this.particles.filter(p=>p.life>0);
  for(const l of this.labels){l.y-=28*dt;l.life-=dt;}this.labels=this.labels.filter(l=>l.life>0);
  this.shake=Math.max(0,this.shake-dt*3);this.flash=Math.max(0,this.flash-dt);if(this.rinseRadius>0){this.rinseRadius+=dt*1700;if(this.rinseRadius>Math.max(this.w,this.h)*1.5)this.rinseRadius=0;}
  if(this.state==='countdown'){this.countdown-=dt;if(this.countdown<=0){this.state='playing';this.emit('state',{state:this.state});this.emit('start');}return;}
  if(this.state!=='playing')return;
  this.t+=dt;const p=this.player;p.invincible=Math.max(0,p.invincible-dt);p.dashCooldown=Math.max(0,p.dashCooldown-dt);p.power=Math.max(0,p.power-dt);this.charge=Math.min(100,this.charge+dt*1.2);
  if(input.rinse)this.rinse();if(this.state!=='playing')return;if(input.dash)this.dash(input);
  const oldX=p.x;
  if(p.dash>0){p.x+=p.dashX*1050*dt;p.y+=p.dashY*1050*dt;p.dash-=dt;this.burst(p.x,p.y,C.cyan,1,20);}
  else if(input.x||input.y){const d=Math.hypot(input.x||0,input.y||0);p.x+=(input.x||0)/d*430*dt;p.y+=(input.y||0)/d*430*dt;}
  else if(input.pointer){const factor=1-Math.exp(-11*dt);p.x+=(input.pointer.x-p.x)*factor;p.y+=(input.pointer.y-p.y)*factor;}
  p.x=Math.max(32,Math.min(this.w-32,p.x));p.y=Math.max(110,Math.min(this.h-65,p.y));p.tilt+=(Math.max(-.22,Math.min(.22,(p.x-oldX)*.025))-p.tilt)*Math.min(1,dt*10);
  if(this.comboTime>0){this.comboTime-=dt;if(this.comboTime<=0){this.streak=0;this.combo=1;}}
  if(this.t>=14&&this.phase===1){this.phase=2;this.emit('wave');}
  if(this.t>=30&&this.phase<3)this.enterBoss();
  this.shotTimer-=dt;if(this.shotTimer<=0){this.shotTimer=.15;this.fire();}
  if(this.phase<3){this.spawnTimer-=dt;if(this.spawnTimer<=0){this.spawnTimer=this.phase===1?.8:.57;this.spawnEnemy();}}
  if(this.boss){const b=this.boss;b.age+=dt;b.hit=Math.max(0,b.hit-dt);const targetY=Math.min(200,this.h*.24);b.y+=(targetY-b.y)*Math.min(1,dt*2.5);b.x=this.w*.5+Math.sin(b.age*.7)*this.w*.29;b.shot-=dt;b.minion-=dt;b.warn=b.shot<.45?1:0;
   if(b.age>1.8&&b.shot<=0){b.shot=b.hp<80?.85:1.2;const n=b.hp<80?9:7;for(let i=0;i<n;i++){const angle=.2+(Math.PI-.4)*i/(n-1);this.fireBolt(b.x,b.y+56,Math.cos(angle)*175,Math.sin(angle)*175,9);}const a=Math.atan2(p.y-b.y,p.x-b.x);this.fireBolt(b.x,b.y+35,Math.cos(a)*240,Math.sin(a)*240,11);this.emit('boss-fire');}
   if(b.minion<=0){b.minion=5;this.spawnEnemy('candle');this.spawnEnemy('take');}
  }
  for(const e of this.enemies){if(e.dead)continue;e.age+=dt;e.hit=Math.max(0,e.hit-dt);e.y+=e.speed*(this.phase===2?1.18:1)*dt;
   if(e.type==='candle')e.x=e.origin+Math.sin(e.age*1.5+e.seed)*32;
   if(e.type==='scam')e.x+=(p.x-e.x)*dt*.5;
   if(e.type==='take'){e.x=e.origin+Math.sin(e.age+e.seed)*40;e.shoot-=dt;e.warn=e.shoot<.55?1:0;if(e.shoot<=0&&e.y>60&&e.y<this.h-100){e.shoot=2.8;const a=Math.atan2(p.y-e.y,p.x-e.x);this.fireBolt(e.x,e.y,Math.cos(a)*155,Math.sin(a)*155,8);}}
   if(e.type==='rug')e.x=e.origin+Math.sin(e.age*2+e.seed)*70;
   e.x=Math.max(e.r,Math.min(this.w-e.r,e.x));
   if(Math.hypot(e.x-p.x,e.y-p.y)<e.r+p.r){this.hitPlayer(e.type==='candle'?'A RED CANDLE':e.type==='scam'?'A SCAM DM':e.type==='rug'?'A RUG PULL':'A REPLY GUY');e.dead=true;this.burst(e.x,e.y,C.pink,12);if(this.state!=='playing')return;}
   if(e.y>this.h+100)e.dead=true;
  }
  for(const shot of this.shots){shot.x+=shot.vx*dt;shot.y+=shot.vy*dt;if(shot.y<-50)shot.dead=true;if(shot.dead)continue;
   for(const e of this.enemies){if(e.dead)continue;if(Math.hypot(shot.x-e.x,shot.y-e.y)<shot.r+e.r){shot.dead=true;e.hp-=shot.damage;e.hit=.1;this.burst(shot.x,shot.y,C.cyan,3,55);if(e.hp<=0)this.destroyEnemy(e);break;}}
   const b=this.boss;if(!shot.dead&&b&&b.y>0&&Math.abs(shot.x-b.x)<96&&Math.abs(shot.y-b.y)<63){shot.dead=true;b.hp-=shot.damage;b.hit=.08;this.burst(shot.x,shot.y,C.cyan,2,60);if(b.hp<=0){this.defeatBoss();return;}}
  }
  for(const bolt of this.bolts){bolt.x+=bolt.vx*dt;bolt.y+=bolt.vy*dt;bolt.age+=dt;const distance=Math.hypot(bolt.x-p.x,bolt.y-p.y);if(distance<bolt.r+p.r){bolt.dead=true;this.hitPlayer(this.boss?'THE ALGORITHM':'A REPLY GUY');if(this.state!=='playing')return;}else if(!bolt.grazed&&distance<bolt.r+p.r+17){bolt.grazed=true;this.addScore(15);this.emit('graze');}if(bolt.x<-50||bolt.x>this.w+50||bolt.y>this.h+70||bolt.y<-100||bolt.age>15)bolt.dead=true;}
  for(const pickup of this.pickups){pickup.y+=70*dt;pickup.age+=dt;if(Math.hypot(pickup.x-p.x,pickup.y-p.y)<pickup.r+p.r+14)this.collect(pickup);if(pickup.y>this.h+50)pickup.dead=true;}
  this.enemies=this.enemies.filter(e=>!e.dead);this.shots=this.shots.filter(s=>!s.dead);this.bolts=this.bolts.filter(b=>!b.dead);this.pickups=this.pickups.filter(p=>!p.dead);this.hud();
 }
}
