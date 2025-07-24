import {VIEW, waveHeight, waveSlope, wrapAngle} from './waves.js';

export function createSurfer() {
  return {x: 240, y: waveHeight(240, 0) - 18, vx: 0, vy: 0, angle: 0,
    grounded: true, radius: 18, rotation: 0, invulnerable: 0};
}

/** Fixed-step physics is pure: input records never become mutable game state. */
export function advanceSurfer(previous, input, environment, dt) {
  if (!Number.isFinite(dt) || dt <= 0 || dt > .05) throw new Error('Physics step must be 0..0.05 seconds');
  const surfer = {...previous};
  const steering = Math.max(-1, Math.min(1, input.steer ?? 0));
  surfer.invulnerable = Math.max(0, surfer.invulnerable - dt);
  surfer.vx += steering * 500 * dt;
  surfer.vx *= Math.exp(-5 * dt);
  surfer.x = Math.max(70, Math.min(VIEW.width - 70, surfer.x + surfer.vx * dt));
  const worldX = environment.distance + surfer.x;
  const surface = waveHeight(worldX, environment.time, environment.level);
  const slope = Math.atan(waveSlope(worldX, environment.time, environment.level));
  let landing = null;
  if (input.jump && surfer.grounded) {
    surfer.grounded = false;
    surfer.vy = -490;
    surfer.rotation = 0;
  }
  if (surfer.grounded) {
    surfer.y = surface - surfer.radius;
    surfer.angle += wrapAngle(slope - surfer.angle) * Math.min(1, 12 * dt);
  } else {
    surfer.vy += 800 * dt;
    surfer.y += surfer.vy * dt;
    const turn = steering * 5.8 * dt;
    surfer.angle += turn;
    surfer.rotation += turn;
    if (surfer.vy > 0 && surfer.y + surfer.radius >= surface) {
      const alignment = Math.abs(wrapAngle(surfer.angle - slope));
      landing = {clean: alignment < .85, flips: Math.floor(Math.abs(surfer.rotation) / (2 * Math.PI))};
      surfer.grounded = true;
      surfer.vy = 0;
      surfer.y = surface - surfer.radius;
      surfer.angle = slope;
      surfer.rotation = 0;
    }
  }
  return {surfer, landing};
}

export function overlaps(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y) < a.radius + b.radius;
}
