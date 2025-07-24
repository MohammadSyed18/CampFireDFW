import {VIEW} from './waves.js';
import {createGame, startGame, togglePause, updateGame, score} from './game.js';
import {attachInput} from './input.js';
import {render} from './render.js';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const input = attachInput(window, document.querySelectorAll('[data-control]'));
const status = document.querySelector('#status');
let game = createGame(19), last = null, accumulator = 0, saved = false, pendingJump = false;
let best = 0;
try { best = Number(localStorage.getItem('campfire-surf:best')) || 0; } catch {}
document.querySelector('#best').textContent = best;
function resize() {
  const ratio = Math.min(devicePixelRatio || 1, 2);
  canvas.width = VIEW.width * ratio; canvas.height = VIEW.height * ratio;
  context.setTransform(ratio,0,0,ratio,0,0);
}
window.addEventListener('resize',resize);resize();
document.querySelector('#start').addEventListener('click', () => {
  if (game.phase === 'over') game = createGame(19);
  if (game.phase === 'paused') togglePause(game);
  startGame(game);saved=false;pendingJump=false;input.clear();status.textContent='Surfing. Avoid rocks and collect shells.';
});
document.querySelector('#pause').addEventListener('click', () => {
  if (!['playing','paused'].includes(game.phase)) return;
  togglePause(game);pendingJump=false;input.clear();status.textContent=game.phase==='paused'?'Paused.':'Surfing.';
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden && game.phase === 'playing') { togglePause(game);pendingJump=false;input.clear();status.textContent='Paused while away.'; }
});
function frame(timestamp) {
  if (last === null) last = timestamp;
  accumulator += Math.min(.2,(timestamp-last)/1000);last=timestamp;
  let sampled = input.sample();
  pendingJump ||= sampled.jump;
  sampled = {...sampled, jump: pendingJump};
  while (accumulator >= 1/120) {
    updateGame(game,sampled,1/120);pendingJump=false;sampled={...sampled,jump:false};accumulator-=1/120;
  }
  if (game.phase === 'over' && !saved) {
    saved=true;best=Math.max(best,score(game));
    try { localStorage.setItem('campfire-surf:best',String(best)); } catch {}
    document.querySelector('#best').textContent=best;status.textContent=`Run complete. Score ${score(game)}.`;
  }
  render(context,game);requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
