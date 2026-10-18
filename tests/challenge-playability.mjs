import {SoapGame} from '../public/game-core.js';
function random(seed){return()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}
let best=null;
for(let seed=1;seed<=100;seed++){
 const game=new SoapGame({random:random(seed)});game.start();game.update(3.01);let input={};let lastDash=-3;
 for(let frame=0;frame<90*60&&game.state==='playing';frame++){
  if(frame%5===0){
   const p=game.player,y=game.h*.79;const target=game.boss?game.w*.5+Math.sin((game.boss.age+(p.y-game.boss.y)/650)*.7)*game.w*.29:game.enemies.filter(e=>e.y<p.y-60&&!e.dead).sort((a,b)=>b.y-a.y)[0]?.x??game.w*.5;
   let pick=target,value=-Infinity;
   for(let x=40;x<game.w-40;x+=20){let score=-Math.abs(x-target)*.14-Math.abs(x-p.x)*.015;for(const b of game.bolts){const t=Math.max(0,Math.min(.65,(y-b.y)/(b.vy||1))),d=Math.hypot(x-b.x-b.vx*t,(y-b.y-b.vy*t)*1.4);if(d<80)score-=(80-d)*5;}for(const e of game.enemies){const d=Math.hypot(x-e.x,y-e.y);if(d<e.r+75)score-=(e.r+75-d)*6;}if(score>value){value=score;pick=x;}}
   input={pointer:{x:pick,y}};if(game.charge>=100&&(game.boss||game.enemies.filter(e=>e.y>30).length>=7))input.rinse=true;
   if(game.boss&&game.t-lastDash>3.1&&game.bolts.some(b=>Math.hypot(b.x-p.x,b.y-p.y)<90)){input.dash=true;lastDash=game.t;}
  }
  game.update(1/60,input);input.rinse=false;input.dash=false;
 }
 if(!best||game.score>best.score)best={seed,score:game.score,seconds:game.t,state:game.state,hp:game.player.hp};
 if(game.state==='victory'&&game.score>=25000){console.log(JSON.stringify({result:'reachable',seed,score:game.score,seconds:game.t,hp:game.player.hp,method:'Normal simulation inputs only; no altered health, score, timing, or enemy stats.'}));process.exit(0);}
}
console.log(JSON.stringify({result:'no qualifying run found by this controller',best}));process.exit(1);
