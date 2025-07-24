# Campfire Surf

A browser surfing game for the DFW Hack Club project. It runs on Canvas with no external game engine or runtime packages.

```sh
npm test
npm start
# http://127.0.0.1:8084
```

Steer with the arrow keys or A/D, jump with Space or W, and keep steering in the air to rotate. Collect shells, avoid rocks, and align the board with the wave to land. Touch controls are available beneath the canvas. Runs have three lives; leaving the tab pauses the game.

## Source map

| File | Purpose |
| --- | --- |
| [waves.js](src/waves.js) | Wave height/slope, level progression, angle wrapping |
| [physics.js](src/physics.js) | Fixed-step movement, jumps, air rotation, landing alignment, collision geometry |
| [entities.js](src/entities.js) | Seeded entity generation and world-to-screen positions |
| [game.js](src/game.js) | Game phases, scoring, combos, lives, protection windows, entity lifecycle |
| [input.js](src/input.js) | Keyboard and pointer controls with edge-triggered jumps and cleanup |
| [render.js](src/render.js) | Procedural ocean, surfer, obstacles, shells, HUD, and overlays |
| [main.js](src/main.js) | Animation accumulator, display scaling, visibility pause, local high scores |
| [server.js](server.js) | Local static server with an asset allowlist |

The simulation advances at 120 fixed steps per second. A capped accumulator limits catch-up after a long frame, and jump edges remain pending until a simulation step consumes them. World generation uses a seeded random source so the same seed and inputs produce the same run. High scores stay in browser storage; there is no account or public leaderboard.

Tests cover seeded replay, pause behavior, jumps and landings, difficulty bounds, hazard protection, and single-use shell scoring. Browser checks cover rendering, start/pause, and console errors.
