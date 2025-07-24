import {VIEW, waveHeight, levelAt} from './waves.js';
import {visibleEntities} from './entities.js';
import {score} from './game.js';

function text(context, content, x, y, size = 20, color = '#fff5d7') {
  context.fillStyle = color; context.font = `600 ${size}px system-ui`; context.fillText(content, x, y);
}

export function render(context, game) {
  const {width, height} = VIEW;
  const sky = context.createLinearGradient(0,0,0,height);
  sky.addColorStop(0,'#172d48'); sky.addColorStop(.7,'#ee9c75');
  context.fillStyle = sky; context.fillRect(0,0,width,height);
  context.fillStyle = '#ffd89b'; context.beginPath(); context.arc(760,145,57,0,2*Math.PI); context.fill();
  const environment = {distance: game.distance, time: game.time, level: levelAt(game.distance).level};
  context.beginPath(); context.moveTo(0,height);
  for (let x = 0; x <= width; x += 5) context.lineTo(x,waveHeight(game.distance+x,game.time,environment.level));
  context.lineTo(width,height); context.closePath(); context.fillStyle = '#137c91'; context.fill();
  context.beginPath();
  for (let x = 0; x <= width; x += 5) {
    const y = waveHeight(game.distance+x,game.time,environment.level);
    if (!x) context.moveTo(x,y); else context.lineTo(x,y);
  }
  context.strokeStyle = '#9df4df'; context.lineWidth = 4; context.stroke();
  for (const entity of visibleEntities(game.entities,environment)) {
    context.save(); context.translate(entity.x,entity.y);
    if (entity.type === 'rock') {
      context.fillStyle = '#344957'; context.beginPath();
      context.moveTo(-23,20);context.lineTo(-17,-10);context.lineTo(3,-22);context.lineTo(22,5);context.lineTo(23,20);context.closePath();context.fill();
    } else {
      context.fillStyle = '#ffd86e';context.beginPath();context.arc(0,0,entity.radius,0,2*Math.PI);context.fill();
      context.strokeStyle = '#ad662c';context.lineWidth = 2;context.beginPath();context.arc(0,0,7,0,1.6*Math.PI);context.stroke();
    }
    context.restore();
  }
  context.save(); context.translate(game.surfer.x,game.surfer.y); context.rotate(game.surfer.angle);
  if (game.surfer.invulnerable && Math.floor(game.time*12)%2) context.globalAlpha=.4;
  context.strokeStyle='#ffdd75';context.lineWidth=8;context.lineCap='round';context.beginPath();context.moveTo(-28,15);context.lineTo(28,15);context.stroke();
  context.strokeStyle='#172d48';context.lineWidth=7;context.beginPath();context.moveTo(-10,10);context.lineTo(0,-8);context.lineTo(13,10);context.moveTo(0,-8);context.lineTo(4,-28);context.moveTo(3,-22);context.lineTo(-17,-12);context.moveTo(3,-22);context.lineTo(22,-15);context.stroke();
  context.fillStyle='#fff0c6';context.beginPath();context.arc(5,-38,8,0,2*Math.PI);context.fill();context.restore();
  text(context,`Score ${score(game)}`,25,38,24);text(context,`Shells ${game.shells}`,25,68,16);
  text(context,`Level ${environment.level}`,790,38,20);text(context,`Lives ${game.lives}`,790,68,16);
  if (game.messageFor > 0) text(context,game.message,25,height-25,18);
  if (game.phase !== 'playing') {
    context.fillStyle='rgba(9,26,43,.72)';context.fillRect(0,0,width,height);
    text(context,game.phase==='over'?'The next wave is yours.':game.phase==='paused'?'Take a breath.':'Campfire Surf',210,220,46);
    text(context,game.phase==='over'?`Final score: ${score(game)}`:'Steer with arrows. Jump with Space. Rotate in the air.',210,268,19);
    text(context,'Use the buttons below to start, pause, or retry.',210,305,17);
  }
}
