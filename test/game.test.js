import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,startGame,togglePause,updateGame,score} from '../src/game.js';
import {advanceSurfer,createSurfer} from '../src/physics.js';
import {randomSource} from '../src/entities.js';
import {levelAt,waveHeight,wrapAngle} from '../src/waves.js';

test('same seed and fixed inputs produce identical runs',()=>{
  const a=createGame(12),b=createGame(12);startGame(a);startGame(b);
  for(let step=0;step<2000;step++) {const input={steer:Math.sin(step/80),jump:step%180===0};updateGame(a,input,1/120);updateGame(b,input,1/120);}
  assert.equal(score(a),score(b));assert.deepEqual(a.entities,b.entities);assert.deepEqual(a.surfer,b.surfer);
});
test('paused and ready games do not advance',()=>{
  const game=createGame();updateGame(game,{},1/120);assert.equal(game.distance,0);
  startGame(game);updateGame(game,{},1/120);togglePause(game);const distance=game.distance;
  updateGame(game,{},1/120);assert.equal(game.distance,distance);
});
test('jump leaves surface and eventually lands without changing input state',()=>{
  let surfer=createSurfer();const input={jump:true,steer:0};let landed=false;
  for(let step=0;step<300;step++) {
    const result=advanceSurfer(surfer,step===0?input:{steer:0},{distance:0,time:step/120,level:1},1/120);
    surfer=result.surfer;if(result.landing){landed=true;break;}
  }
  assert.ok(landed);assert.equal(surfer.grounded,true);assert.equal(input.jump,true);
});
test('difficulty and angle helpers stay bounded',()=>{
  assert.equal(levelAt(999999).level,10);assert.ok(Math.abs(wrapAngle(20))<=Math.PI);
  assert.ok(Number.isFinite(waveHeight(1e6,1e5,10)));
  const a=randomSource(4),b=randomSource(4);for(let index=0;index<20;index++)assert.equal(a(),b());
  assert.throws(()=>updateGame(createGame(),{},1));
});

test('hazards cost one life per protection window and shells score once',()=>{
  const game=createGame();startGame(game);
  game.entities=[{id:100,type:'rock',worldX:240,lift:0,radius:22}];
  updateGame(game,{},1/120);assert.equal(game.lives,2);
  game.entities.push({id:101,type:'rock',worldX:game.distance+game.surfer.x,lift:0,radius:22});
  updateGame(game,{},1/120);assert.equal(game.lives,2);
  game.entities.push({id:102,type:'shell',worldX:game.distance+game.surfer.x,lift:0,radius:13});
  updateGame(game,{},1/120);assert.equal(game.shells,1);
  const points=game.points;updateGame(game,{},1/120);assert.equal(game.points,points);
});
