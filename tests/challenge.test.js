import test from 'node:test';
import assert from 'node:assert/strict';
import {CHALLENGE,challengeResult,loadRuns,saveRun} from '../public/challenge.js';
const run={score:25000,seconds:90,won:true,kills:42,combo:8};
function storage(){const data=new Map();return {getItem:key=>data.get(key)||null,setItem:(key,value)=>data.set(key,value)};}
test('the published challenge accepts its exact score and time boundaries',()=>{assert.equal(challengeResult(run).completed,true);assert.equal(CHALLENGE.prizeStatus,'not-live');assert.equal(CHALLENGE.proposedPrizeUSD,1000);});
test('score, boss victory, and time must all belong to the same qualifying run',()=>{for(const change of [{score:24999},{seconds:90.01},{won:false}])assert.equal(challengeResult({...run,...change}).completed,false);});
test('missing or non-finite results cannot qualify',()=>{for(const value of [null,{}, {...run,score:NaN},{...run,score:Infinity},{...run,seconds:0}])assert.equal(challengeResult(value).completed,false);});
test('real run records round-trip and history is bounded',()=>{const s=storage();for(let i=0;i<15;i++)assert.equal(saveRun(s,{...run,score:25000+i}),true);const history=loadRuns(s);assert.equal(history.length,12);assert.equal(history[0].score,25014);assert.equal(history[0].won,true);});
test('unavailable storage, malformed data and invalid runs are handled safely',()=>{const denied={getItem(){throw new Error('Disabled');},setItem(){throw new Error('Disabled');}};assert.deepEqual(loadRuns(denied),[]);assert.equal(saveRun(denied,run),false);assert.equal(saveRun(storage(),{score:-1}),false);assert.deepEqual(loadRuns({getItem:()=>'{broken'}),[]);});
