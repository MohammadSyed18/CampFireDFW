import {VIEW, waveHeight} from './waves.js';

/** Reproducible RNG makes a seed replayable in tests and local practice runs. */
export function randomSource(seed) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function spawnEntity(id, environment, random) {
  const type = random() < .38 ? 'rock' : 'shell';
  const worldX = environment.distance + VIEW.width + 80;
  const lift = type === 'shell' ? 30 + random() * 95 : 0;
  return {id, type, worldX, lift, radius: type === 'rock' ? 22 : 13};
}

export function visibleEntities(entities, environment) {
  return entities.map(entity => ({...entity, x: entity.worldX - environment.distance,
    y: waveHeight(entity.worldX, environment.time, environment.level) - entity.radius - entity.lift}));
}
