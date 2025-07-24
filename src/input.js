export function attachInput(target, controls) {
  const held = new Set();
  let jump = false;
  const handlers = [];
  const listen = (element, type, handler) => { element.addEventListener(type, handler); handlers.push(() => element.removeEventListener(type, handler)); };
  const known = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'Space', 'KeyA', 'KeyD', 'KeyW']);
  listen(target, 'keydown', event => {
    if (!known.has(event.code)) return;
    event.preventDefault();
    if (['ArrowUp','Space','KeyW'].includes(event.code) && !held.has(event.code)) jump = true;
    held.add(event.code);
  });
  listen(target, 'keyup', event => held.delete(event.code));
  listen(target, 'blur', () => { held.clear(); jump = false; });
  for (const button of controls) {
    const key = button.dataset.control;
    listen(button, 'pointerdown', event => {
      event.preventDefault(); button.setPointerCapture(event.pointerId);
      held.add(key); if (key === 'Space') jump = true;
    });
    for (const type of ['pointerup','pointercancel','lostpointercapture']) listen(button, type, () => held.delete(key));
  }
  return {
    sample() {
      const result = {steer: Number(held.has('ArrowRight') || held.has('KeyD')) - Number(held.has('ArrowLeft') || held.has('KeyA')), jump};
      jump = false;
      return result;
    },
    clear() { held.clear(); jump = false; },
    dispose() { handlers.forEach(remove => remove()); }
  };
}
