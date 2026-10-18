import {CHALLENGE,challengeResult,loadRuns} from './challenge.js';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const names={overview:'Overview',coin:'The coin',story:'The story',future:'The road ahead',challenge:'The challenge'};
const mobile=matchMedia('(max-width:650px)');
const sidebar=$('#sidebar'),workspace=$('.workspace'),toggle=$('#menu-toggle');
let navOpen=false;
function setMenu(open,returnFocus=false){
 navOpen=open&&mobile.matches;sidebar.classList.toggle('is-open',navOpen);$('#mobile-backdrop').hidden=!navOpen;toggle.setAttribute('aria-expanded',String(navOpen));toggle.setAttribute('aria-label',navOpen?'Close navigation':'Open navigation');sidebar.inert=mobile.matches&&!navOpen;workspace.inert=navOpen;document.body.style.overflow=navOpen?'hidden':'';
 if(navOpen){sidebar.setAttribute('role','dialog');sidebar.setAttribute('aria-modal','true');sidebar.setAttribute('aria-label','Navigation');sidebar.querySelector('a.active').focus();}
 else{sidebar.removeAttribute('role');sidebar.removeAttribute('aria-modal');sidebar.removeAttribute('aria-label');if(returnFocus&&mobile.matches)toggle.focus();}
}
toggle.addEventListener('click',()=>setMenu(!navOpen));$('#mobile-backdrop').addEventListener('click',()=>setMenu(false,true));mobile.addEventListener('change',()=>setMenu(false));setMenu(false);
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&navOpen){event.preventDefault();setMenu(false,true);}if(event.key==='Tab'&&navOpen){const links=[...sidebar.querySelectorAll('a')],first=links[0],last=links.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}});
function route(focus=false){
 if(location.hash==='#content')return;
 const requested=location.hash.slice(1),view=Object.hasOwn(names,requested)?requested:'overview';
 $$('[data-section]').forEach(s=>s.hidden=s.dataset.section!==view);
 $$('[data-view]').forEach(a=>{const active=a.dataset.view===view;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 $('#current-view').textContent=names[view];document.title='SOAP Universe — '+names[view];setMenu(false);
 if(focus){window.scrollTo(0,0);$('#content').focus({preventScroll:true});}
}
addEventListener('hashchange',()=>route(true));route();
$$('[data-view]').forEach(a=>a.addEventListener('click',()=>{if(location.hash===a.getAttribute('href')){setMenu(false);$('#content').focus({preventScroll:true});}}));
const lore=[
 {title:'THE FEED GOT LOUD.\nHE STAYED HAPPY.',copy:'In our fictional timeline, every candle had an opinion and every reply guy had a prophecy. One ape looked at all of it through rainbow glasses and decided the internet needed a bath.',quote:'“sir, this is a laundromat.”'},
 {title:'HE BROUGHT SOAP\nTO A FLAME WAR.',copy:'The legend in this imagined world is that SOAP found a blue bar big enough to surf, built a bubble blaster, and washed a thousand hot takes into one very confused silence. The glasses never came off.',quote:'“your bags are not machine washable.”'},
 {title:'THE LEGACY?\nSTAYING HAPPY.',copy:'In this fictional next chapter, the happy ape keeps coming back for the noise, the memes, and the impossible-to-ignore reply guys. His imagined legacy is a community that chooses play over another argument.',quote:'“feed off. happy on.”'}
];
function selectLore(index,focus=false){const story=lore[index];$$('[data-lore]').forEach(b=>{const active=Number(b.dataset.lore)===index;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;if(active&&focus)b.focus();});$('#lore-story').setAttribute('aria-labelledby','lore-tab-'+index);$('#lore-number').textContent=String(index+1).padStart(2,'0');$('#lore-title').textContent=story.title;$('#lore-copy').textContent=story.copy;$('#lore-quote').textContent=story.quote;}
$$('[data-lore]').forEach(b=>{b.addEventListener('click',()=>selectLore(Number(b.dataset.lore)));b.addEventListener('keydown',event=>{const current=Number(b.dataset.lore);let next;if(['ArrowRight','ArrowDown'].includes(event.key))next=(current+1)%3;else if(['ArrowLeft','ArrowUp'].includes(event.key))next=(current+2)%3;else if(event.key==='Home')next=0;else if(event.key==='End')next=2;else return;event.preventDefault();selectLore(next,true);});});
$$('[data-portrait]').forEach(button=>button.addEventListener('click',()=>{const original=button.dataset.portrait==='original';$$('[data-portrait]').forEach(b=>{const chosen=b===button;b.classList.toggle('selected',chosen);b.setAttribute('aria-pressed',String(chosen));});const image=$('#portrait');image.src=original?'/assets/pfp.png':'/assets/hero.png';image.alt=original?'Original supplied ape profile image':'Fictional SOAP arcade hero riding a blue soap hoverboard';image.classList.toggle('original',original);$('#portrait-type').textContent=original?'SUPPLIED PROFILE REFERENCE':'FICTIONAL ARCADE REIMAGINING';}));
$$('.roadmap-trigger').forEach(button=>button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')==='true';button.setAttribute('aria-expanded',String(!open));document.getElementById(button.getAttribute('aria-controls')).hidden=open;}));
let previousFocus=null;
$$('[data-open-rules]').forEach(button=>button.addEventListener('click',()=>{previousFocus=button;$('#rules-dialog').showModal();$('#close-rules').focus();}));
$('#close-rules').addEventListener('click',()=>$('#rules-dialog').close());
$('#rules-dialog').addEventListener('close',()=>previousFocus?.focus());
$('#rules-dialog').addEventListener('click',event=>{if(event.target!==$('#rules-dialog'))return;const r=event.target.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)event.target.close();});
function svg(symbol){const element=document.createElementNS('http://www.w3.org/2000/svg','svg'),use=document.createElementNS('http://www.w3.org/2000/svg','use');use.setAttribute('href','#'+symbol);element.setAttribute('aria-hidden','true');element.append(use);return element;}
function formatTime(s){return String(Math.floor(s/60)).padStart(2,'0')+':'+String(Math.floor(s%60)).padStart(2,'0');}
function readLocal(){try{const n=Number(localStorage.getItem('soap-arcade-best'));return {best:Number.isFinite(n)&&n>=0?Math.floor(n):0,runs:loadRuns(localStorage)};}catch{return {best:0,runs:[]};}}
function renderRuns(runs){$$('[data-runs]').forEach(container=>{container.replaceChildren();if(!runs.length){const empty=document.createElement('div');empty.className='empty-runs';const title=document.createElement('strong');title.textContent='YOUR FIRST RUN STARTS HERE.';const copy=document.createElement('p');copy.textContent='No runs saved on this browser yet. Play the arcade and your real results will appear here.';empty.append(svg('i-play'),title,copy);container.append(empty);return;}runs.slice(0,Number(container.dataset.limit)||5).forEach((run,index)=>{const row=document.createElement('div');row.className='run-row';const rank=document.createElement('span');rank.className='run-rank';rank.textContent=String(index+1).padStart(2,'0');const values=document.createElement('div'),score=document.createElement('strong'),detail=document.createElement('small');score.textContent=run.score.toLocaleString();detail.textContent=formatTime(run.seconds)+' · '+run.kills+' cleaned · ×'+run.combo;values.append(score,detail);const tag=document.createElement('span');const complete=challengeResult(run).completed;tag.className='run-tag'+(complete?' completed':'');tag.textContent=complete?'CLEAN RUN':run.won?'ESCAPED':'RINSED';row.append(rank,values,tag);container.append(row);});});}
function renderProgress(runs){
 const candidate=[...runs].sort((a,b)=>{const ra=challengeResult(a),rb=challengeResult(b);const na=Number(ra.scoreMet)+Number(ra.bossMet)+Number(ra.timeMet),nb=Number(rb.scoreMet)+Number(rb.bossMet)+Number(rb.timeMet);return nb-na||b.score-a.score;})[0];
 const result=challengeResult(candidate),count=Number(result.scoreMet)+Number(result.timeMet)+Number(result.bossMet);
 $('#overview-progress').textContent=count+' / 3';$('#overview-progress-label').firstChild.textContent=result.completed?'Practice target completed.':runs.length?'From your strongest saved run.':'Three conditions. One clean run.';
 $('#challenge-progress').replaceChildren(document.createTextNode(String(count)));const denominator=document.createElement('span');denominator.textContent='/ 3';$('#challenge-progress').append(denominator);$('#challenge-progress-bar').style.width=(count/3*100)+'%';
 $('#challenge-progress-copy').textContent=result.completed?'Practice target completed. No cash competition is active.':candidate?'Your strongest saved run: '+candidate.score.toLocaleString()+' points in '+formatTime(candidate.seconds)+'.':'Play a run to start your practice record.';
 $('#personal-goals').replaceChildren();for(const [label,met] of [['25,000 points',result.scoreMet],['Boss defeated',result.bossMet],['Within 90s',result.timeMet]]){const chip=document.createElement('span');chip.className=met?'met':'';if(met)chip.append(svg('i-check'));chip.append(document.createTextNode(label));$('#personal-goals').append(chip);}
}
function refresh(){const {best,runs}=readLocal();$$('[data-best]').forEach(el=>el.textContent=String(best).padStart(6,'0'));renderRuns(runs);renderProgress(runs);}
refresh();addEventListener('storage',refresh);addEventListener('pageshow',refresh);
Object.defineProperty(window,'soapShowcase',{value:Object.freeze({challenge:CHALLENGE,refresh})});
