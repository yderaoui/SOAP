export const CHALLENGE=Object.freeze({
 id:'clean-run-v1',name:'The Clean Run',minScore:25000,maxSeconds:90,
 proposedPrizeUSD:1000,prizeStatus:'not-live',requiresBossVictory:true
});
export function challengeResult(run){
 const valid=Boolean(run)&&Number.isFinite(run.score)&&run.score>=0&&Number.isFinite(run.seconds)&&run.seconds>0;
 const scoreMet=valid&&run.score>=CHALLENGE.minScore;
 const timeMet=valid&&run.seconds<=CHALLENGE.maxSeconds;
 const bossMet=valid&&run.won===true;
 return {scoreMet,timeMet,bossMet,completed:scoreMet&&timeMet&&bossMet};
}
const RUN_KEY='soap-arcade-runs-v1';
function normalizedRun(run){
 if(!run||!Number.isFinite(run.score)||run.score<0||!Number.isFinite(run.seconds)||run.seconds<=0||typeof run.won!=='boolean')return null;
 return {score:Math.floor(run.score),seconds:run.seconds,won:run.won,kills:Number.isFinite(run.kills)?Math.max(0,Math.floor(run.kills)):0,combo:Number.isFinite(run.combo)?Math.max(1,Math.floor(run.combo)):1,date:typeof run.date==='string'?run.date:new Date().toISOString()};
}
export function loadRuns(storage){
 try{const data=JSON.parse(storage.getItem(RUN_KEY)||'[]');return Array.isArray(data)?data.map(normalizedRun).filter(Boolean).slice(0,12):[];}catch{return [];}
}
export function saveRun(storage,run){
 const clean=normalizedRun(run);if(!clean)return false;
 try{storage.setItem(RUN_KEY,JSON.stringify([clean,...loadRuns(storage)].slice(0,12)));return true;}catch{return false;}
}
