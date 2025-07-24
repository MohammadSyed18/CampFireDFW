export const VIEW = Object.freeze({width: 960, height: 540});

export function waveHeight(worldX, time, level = 1) {
  const amplitude = 22 + Math.min(20, level * 2);
  return 350 + amplitude * Math.sin(worldX / 160 + time * .7)
    + 12 * Math.sin(worldX / 73 - time * 1.2);
}

export function waveSlope(worldX, time, level = 1) {
  const amplitude = 22 + Math.min(20, level * 2);
  return amplitude / 160 * Math.cos(worldX / 160 + time * .7)
    + 12 / 73 * Math.cos(worldX / 73 - time * 1.2);
}

export function levelAt(distance) {
  if (!Number.isFinite(distance) || distance < 0) throw new Error('Invalid distance');
  const level = Math.min(10, 1 + Math.floor(distance / 1600));
  return {level, speed: 165 + (level - 1) * 12, spawnSeconds: Math.max(.8, 1.8 - level * .09)};
}

export function wrapAngle(value) {
  return ((value + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
}
