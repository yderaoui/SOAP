import {C} from './game-core.js';
export class Renderer {
 constructor(canvas,hero,{reduced=false}={}){this.canvas=canvas;this.ctx=canvas.getContext('2d',{alpha:false});this.hero=hero;this.reduced=reduced;this.w=1200;this.h=720;}
 resize(w,h){this.w=w;this.h=h;const rect=this.canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);this.canvas.width=Math.round(rect.width*dpr);this.canvas.height=Math.round(rect.height*dpr);}
 text(text,x,y,size=14,color=C.white,align='center',font='Space Mono'){const c=this.ctx;c.font=`700 ${size}px "${font}",monospace`;c.textAlign=align;c.textBaseline='middle';c.fillStyle=color;c.fillText(text,x,y);}
 box(x,y,w,h,r=6){this.ctx.beginPath();this.ctx.roundRect(x,y,w,h,r);}
 background(t,playing){const c=this.ctx,w=this.w,h=this.h;const bg=c.createLinearGradient(0,0,w,h);bg.addColorStop(0,'#10031D');bg.addColorStop(.5,'#11051F');bg.addColorStop(1,'#080015');c.fillStyle=bg;c.fillRect(0,0,w,h);
  const haze=c.createRadialGradient(w*.78,h*.38,0,w*.78,h*.38,w*.5);haze.addColorStop(0,'#57145938');haze.addColorStop(1,'#57145900');c.fillStyle=haze;c.fillRect(0,0,w,h);
  for(let i=0;i<95;i++){const x=((i*293+17)%1200)/1200*w;const y=(((i*137+43)%1000)/1000*h+t*(playing?16:4))%h;c.fillStyle=i%4?'#9E74C355':'#00FFFF77';c.fillRect(x,y,i%7===0?2:1,i%7===0?2:1);}
  const horizon=h*.64;c.save();c.globalAlpha=playing?.42:.7;for(let i=0;i<32;i++){const bw=w/24;const bx=i*bw*.9-10,bh=35+(i*71)%150;const by=horizon-bh;c.fillStyle=i%2?'#170825':'#1c0a2e';c.fillRect(bx,by,bw*.8,bh);c.strokeStyle='#ff006e1c';c.strokeRect(bx,by,bw*.8,bh);for(let row=0;row<bh/14;row++)for(let col=0;col<3;col++){if((i+row*3+col)%4===0){c.fillStyle=(i+row)%3?'#00ffff1c':'#ff006e30';c.fillRect(bx+7+col*9,by+10+row*14,3,5);}}}c.restore();
  c.strokeStyle='#FF006E23';c.lineWidth=1;for(let i=-9;i<=9;i++){c.beginPath();c.moveTo(w*.5+i*16,horizon);c.lineTo(w*.5+i*w/7,h);c.stroke();}
  for(let i=0;i<15;i++){const f=((i/15+t*.08)%1);const y=horizon+Math.pow(f,2.4)*(h-horizon);c.strokeStyle=`rgba(255,0,110,${.08+f*.12})`;c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke();}
  c.strokeStyle='#ff006e45';c.beginPath();c.moveTo(0,horizon);c.lineTo(w,horizon);c.stroke();
  if(playing){c.save();c.globalAlpha=.12;for(let i=0;i<7;i++){const cy=((i*157+t*30)%(h+180))-90;const cx=i%2===0?35:w-150;c.strokeStyle=i%2?C.pink:C.cyan;this.box(cx,cy,115,57,3);c.stroke();this.text(['GM.','TRUST ME BRO','NEXT 100×','NGMI','SER?','BULLISH.','IT’S EARLY'][i],cx+57,cy+28,10,i%2?C.pink:C.cyan);}c.restore();}
 }
 enemy(e,t){const c=this.ctx;c.save();c.translate(e.x,e.y);c.shadowColor=C.pink;c.shadowBlur=e.hit>0?22:8;if(e.hit>0)c.globalAlpha=.65;
  if(e.type==='candle'){c.rotate(Math.sin(e.age*1.5+e.seed)*.12);c.strokeStyle=C.pink;c.lineWidth=3;c.beginPath();c.moveTo(0,-43);c.lineTo(0,43);c.stroke();const g=c.createLinearGradient(-14,0,14,0);g.addColorStop(0,'#7c0038');g.addColorStop(1,C.pink);c.fillStyle=g;c.fillRect(-13,-27,26,53);c.strokeStyle='#ff77ad';c.lineWidth=1;c.strokeRect(-13,-27,26,53);c.shadowBlur=0;c.strokeStyle='#ffbfd8';c.lineWidth=2;c.beginPath();c.moveTo(-5,-4);c.lineTo(0,3);c.lineTo(5,-4);c.stroke();}
  else if(e.type==='take'){c.rotate(Math.sin(e.age+e.seed)*.08);c.fillStyle='#251130';c.strokeStyle=e.warn?C.cyan:C.pink;c.lineWidth=1.5;this.box(-50,-32,100,64,5);c.fill();c.stroke();c.shadowBlur=0;c.fillStyle=C.pink;c.beginPath();c.arc(-32,-15,6,0,Math.PI*2);c.fill();this.text('@reply_guy',-20,-15,7,'#9b6e9f','left');c.strokeStyle='#5e2855';c.beginPath();c.moveTo(-40,0);c.lineTo(40,0);c.stroke();this.text(e.warn?'INCOMING…':'ACTUALLY…',0,15,11,e.warn?C.cyan:'#eec4e4');c.fillStyle='#251130';c.strokeStyle=C.pink;c.beginPath();c.moveTo(-22,32);c.lineTo(-27,42);c.lineTo(-10,32);c.fill();c.stroke();}
  else if(e.type==='scam'){c.rotate(Math.sin(e.age*2)*.16);c.fillStyle='#2c0d37';c.strokeStyle=C.pink;c.lineWidth=2;this.box(-22,-34,44,69,6);c.fill();c.stroke();c.shadowBlur=0;c.fillStyle='#12051b';c.fillRect(-17,-24,34,46);this.text('DM',0,-9,14,C.pink);this.text('SCAM',0,9,7,'#b781b8');c.fillStyle=C.pink;c.beginPath();c.arc(0,28,2,0,Math.PI*2);c.fill();}
  else {c.rotate(Math.sin(e.age*2+e.seed)*.2);c.fillStyle='#5d103e';c.strokeStyle=C.pink;c.lineWidth=2;c.beginPath();c.moveTo(-57,-24);c.quadraticCurveTo(0,-41,57,-24);c.lineTo(57,25);c.quadraticCurveTo(0,7,-57,25);c.closePath();c.fill();c.stroke();c.shadowBlur=0;c.strokeStyle='#ff006e77';c.lineWidth=1;for(let i=-40;i<55;i+=15){c.beginPath();c.moveTo(i,-24);c.lineTo(i,24);c.stroke();}this.text('RUG PULL',0,0,12,'#ffc4df');for(let i=-52;i<=55;i+=12){c.beginPath();c.moveTo(i,25);c.lineTo(i,33);c.stroke();}}
  c.restore();
 }
 boss(b,t){const c=this.ctx;const rage=b.hp<80;c.save();c.translate(b.x,b.y);c.shadowColor=C.pink;c.shadowBlur=b.hit>0?35:14;c.save();c.rotate(t*.15);c.strokeStyle='#ff006e22';c.lineWidth=1;for(let i=0;i<3;i++){c.beginPath();c.ellipse(0,0,120+i*12,90+i*10,0,0,Math.PI*2);c.stroke();}c.restore();
  c.strokeStyle=C.pink;c.lineWidth=3;c.beginPath();c.moveTo(-95,0);c.lineTo(-135,25);c.lineTo(-148,0);c.moveTo(95,0);c.lineTo(135,25);c.lineTo(148,0);c.stroke();
  for(const side of [-1,1]){c.fillStyle='#290e2f';c.strokeStyle=C.pink;this.box(side*150-23,-20,46,40,3);c.fill();c.stroke();this.text(side<0?'FOMO':'RAGE',side*150,0,8,C.pink);}
  const gradient=c.createLinearGradient(0,-65,0,65);gradient.addColorStop(0,b.hit>0?'#541f65':'#291037');gradient.addColorStop(1,'#12071b');c.fillStyle=gradient;c.strokeStyle=rage?'#ff72af':C.pink;c.lineWidth=2.5;this.box(-100,-65,200,130,10);c.fill();c.stroke();
  c.shadowBlur=0;c.fillStyle='#080010';this.box(-82,-43,164,77,5);c.fill();c.strokeStyle='#ff006e50';c.lineWidth=1;c.stroke();
  c.fillStyle=b.warn?'#fff0f7':C.pink;c.shadowColor=C.pink;c.shadowBlur=18;for(const side of [-1,1]){c.save();c.translate(side*39,-12);c.rotate(side*-.22);c.fillRect(-17,-5,34,11);c.restore();}c.fillStyle=C.cyan;c.shadowColor=C.cyan;c.fillRect(-10,-27,20,5);
  c.strokeStyle=C.pink;c.lineWidth=3;c.beginPath();c.moveTo(-28,16);c.lineTo(-10,10);c.lineTo(9,17);c.lineTo(28,10);c.stroke();c.shadowBlur=0;
  this.text(rage?'ENGAGEMENT RAGE':'FEEDING ON YOUR ATTENTION',0,49,7,'#b27fba');c.strokeStyle=C.pink;c.lineWidth=2;c.beginPath();c.moveTo(0,-65);c.lineTo(0,-86);c.stroke();c.fillStyle=b.warn?C.white:C.pink;c.beginPath();c.arc(0,-90,5+Math.sin(t*5)*1.5,0,Math.PI*2);c.fill();
  c.restore();
 }
 bubble(x,y,r,color=C.cyan,trail=true){const c=this.ctx;c.save();if(trail){c.strokeStyle=color+'40';c.lineWidth=r*.6;c.beginPath();c.moveTo(x,y+4);c.lineTo(x,y+22);c.stroke();}c.shadowColor=color;c.shadowBlur=12;const grad=c.createRadialGradient(x-r*.3,y-r*.3,0,x,y,r);grad.addColorStop(0,'#ffffffa0');grad.addColorStop(.4,color+'22');grad.addColorStop(1,color+'55');c.fillStyle=grad;c.strokeStyle=color;c.lineWidth=1.5;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();c.stroke();c.shadowBlur=0;c.fillStyle='#ffffffbb';c.beginPath();c.arc(x-r*.3,y-r*.3,r*.2,0,Math.PI*2);c.fill();c.restore();}
 pickup(p,t){const c=this.ctx;c.save();c.translate(p.x,p.y+Math.sin(p.age*4)*3);c.rotate(Math.sin(p.age*2)*.08);const color=p.type==='health'?C.pink:C.cyan;c.shadowColor=color;c.shadowBlur=15;c.fillStyle='#10071b';c.strokeStyle=color;c.lineWidth=1.5;this.box(-24,-21,48,42,6);c.fill();c.stroke();c.shadowBlur=0;if(p.type==='health')this.text('+1',0,0,16,C.pink,'center','Orbitron');else if(p.type==='shield'){c.strokeStyle=C.cyan;c.beginPath();c.arc(0,-1,11,0,Math.PI*2);c.stroke();c.fillStyle=C.cyan;c.beginPath();c.arc(-4,-5,2,0,Math.PI*2);c.fill();}else{const colors=[C.pink,C.cyan,'#a36bff'];for(let i=0;i<3;i++){c.strokeStyle=colors[i];c.lineWidth=4;c.beginPath();c.moveTo(-11,-8+i*8);c.lineTo(11,-8+i*8);c.stroke();}}this.text(p.type==='rainbow'?'RAINBOW':p.type==='health'?'HAPPY':'SHIELD',0,32,7,color);c.restore();}
 player(p,t){const c=this.ctx;const blink=p.invincible>0&&!this.reduced&&Math.floor(t*9)%2===0;c.save();c.translate(p.x,p.y);c.rotate(p.tilt);c.globalAlpha=blink?.55:1;
  const trailColors=['#ff006e','#a36bff','#00ffff'];for(let i=0;i<3;i++){const grad=c.createLinearGradient(0,20,0,135);grad.addColorStop(0,trailColors[i]+'aa');grad.addColorStop(1,trailColors[i]+'00');c.strokeStyle=grad;c.lineWidth=p.dash>0?8:3;c.beginPath();c.moveTo((i-1)*11,25);c.bezierCurveTo((i-1)*12,65,Math.sin(t*6+i)*8,92,(i-1)*13,125);c.stroke();}
  c.shadowColor=C.cyan;c.shadowBlur=20;c.strokeStyle='#00ffff50';c.lineWidth=2;c.beginPath();c.ellipse(0,39,40,11,0,0,Math.PI*2);c.stroke();c.shadowBlur=0;
  if(this.hero.complete&&this.hero.naturalWidth)c.drawImage(this.hero,-62,-65,124,124);else{c.fillStyle='#264bff';c.strokeStyle=C.cyan;c.lineWidth=2;this.box(-25,-31,50,70,12);c.fill();c.stroke();this.text('SOAP',0,0,10,C.cyan);}
  if(p.shield||p.dash>0){c.strokeStyle=p.dash>0?C.white:C.cyan;c.lineWidth=p.dash>0?2:1;c.shadowColor=C.cyan;c.shadowBlur=12;c.setLineDash(p.dash>0?[]:[8,5]);c.beginPath();c.arc(0,0,52+Math.sin(t*4)*2,0,Math.PI*2);c.stroke();c.setLineDash([]);c.shadowBlur=0;}
  c.fillStyle=C.cyan;c.beginPath();c.arc(0,0,2.3,0,Math.PI*2);c.fill();c.restore();
 }
 draw(game,t){const c=this.ctx,w=this.w,h=this.h;c.setTransform(this.canvas.width/w,0,0,this.canvas.height/h,0,0);const active=game.state!=='menu';this.background(this.reduced?0:t,active);
  if(!active)return;c.save();if(!this.reduced&&game.shake>0){const force=Math.min(1,game.shake);c.translate(Math.sin(t*91)*force*5,Math.sin(t*73)*force*4);}
  for(const p of game.pickups)this.pickup(p,t);
  for(const e of game.enemies)this.enemy(e,t);
  if(game.boss)this.boss(game.boss,t);
  for(const s of game.shots)this.bubble(s.x,s.y,s.r,s.rainbow?[C.cyan,C.pink,C.violet][Math.floor(s.x/14)%3]:C.cyan);
  for(const b of game.bolts){c.save();c.translate(b.x,b.y);c.rotate(Math.atan2(b.vy,b.vx)+Math.PI*.5);c.shadowColor=C.pink;c.shadowBlur=12;c.fillStyle=C.pink;c.strokeStyle='#ffabd0';c.lineWidth=1;c.beginPath();c.moveTo(0,-b.r-3);c.lineTo(b.r,0);c.lineTo(0,b.r+3);c.lineTo(-b.r,0);c.closePath();c.fill();c.stroke();c.restore();}
  this.player(game.player,t);
  for(const p of game.particles){c.globalAlpha=Math.max(0,p.life/p.max);c.fillStyle=p.color;c.fillRect(p.x-p.size*.5,p.y-p.size*.5,p.size,p.size);}c.globalAlpha=1;
  if(game.rinseRadius>0){c.save();c.strokeStyle=C.cyan;c.shadowColor=C.cyan;c.shadowBlur=20;c.lineWidth=8;c.globalAlpha=Math.max(0,1-game.rinseRadius/(Math.max(w,h)*1.5));c.beginPath();c.arc(game.player.x,game.player.y,game.rinseRadius,0,Math.PI*2);c.stroke();c.strokeStyle=C.pink;c.lineWidth=2;c.beginPath();c.arc(game.player.x,game.player.y,game.rinseRadius*.9,0,Math.PI*2);c.stroke();c.restore();}
  for(const l of game.labels){c.globalAlpha=Math.min(1,l.life*2);this.text(l.text,l.x,l.y,13,l.color);}c.globalAlpha=1;
  if(game.flash>0&&!this.reduced){c.fillStyle=`rgba(255,0,110,${Math.min(.15,game.flash*.4)})`;c.fillRect(0,0,w,h);}c.restore();
 }
}
