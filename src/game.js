import {createSurfer, advanceSurfer, overlaps} from './physics.js';
import {levelAt, VIEW} from './waves.js';
import {randomSource, spawnEntity, visibleEntities} from './entities.js';

export function createGame(seed = 19) {
  return {seed, random: randomSource(seed), phase: 'ready', surfer: createSurfer(), entities: [],
    distance: 0, time: 0, points: 0, shells: 0, lives: 3, combo: 0,
    spawnIn: 1.4, nextId: 1, message: 'Catch a wave.', messageFor: 3};
}

export function startGame(game) {
  if (game.phase === 'ready') game.phase = 'playing';
}
export function togglePause(game) {
  if (game.phase === 'playing') game.phase = 'paused';
  else if (game.phase === 'paused') game.phase = 'playing';
}
export function score(game) { return Math.floor(game.distance / 5) + game.points; }

function damage(game, reason) {
  if (game.surfer.invulnerable > 0) return;
  game.lives--;
  game.combo = 0;
  game.surfer.invulnerable = 2;
  game.message = reason;
  game.messageFor = 2;
  if (game.lives <= 0) game.phase = 'over';
}

export function updateGame(game, input, dt) {
  if (!Number.isFinite(dt) || dt <= 0 || dt > .05) throw new Error('Invalid update step');
  if (game.phase !== 'playing') return game;
  game.time += dt;
  const level = levelAt(game.distance);
  game.distance += level.speed * dt;
  const environment = {distance: game.distance, time: game.time, level: level.level};
  const result = advanceSurfer(game.surfer, input, environment, dt);
  game.surfer = result.surfer;
  if (result.landing) {
    if (!result.landing.clean) damage(game, 'Wipeout! Land with the wave.');
    else if (result.landing.flips) {
      game.combo++;
      game.points += result.landing.flips * 100 * Math.min(game.combo, 5);
      game.message = `${result.landing.flips} flip${result.landing.flips > 1 ? 's' : ''} · ${game.combo}x combo`;
      game.messageFor = 2;
    }
  }
  game.spawnIn -= dt;
  if (game.spawnIn <= 0) {
    game.entities.push(spawnEntity(game.nextId++, environment, game.random));
    game.spawnIn += level.spawnSeconds;
  }
  const consumed = new Set();
  for (const entity of visibleEntities(game.entities, environment)) {
    if (entity.x < -80) { consumed.add(entity.id); continue; }
    if (!overlaps(game.surfer, entity)) continue;
    consumed.add(entity.id);
    if (entity.type === 'shell') { game.shells++; game.points += 25; }
    else damage(game, 'Rock ahead! Jump earlier.');
  }
  game.entities = game.entities.filter(entity => !consumed.has(entity.id));
  game.messageFor = Math.max(0, game.messageFor - dt);
  return game;
}
