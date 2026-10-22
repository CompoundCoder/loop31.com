// Loop31 website: the only script, and an optional one. Without it every section reads the same; the row
// of example posts just stays still and scrolls sideways by hand.
//
// What it does: lets the row of posts drift (it adds a second copy so the row loops, and shows a Pause
// button, since anything that moves on its own for more than 5 seconds needs one), and stops the drift
// while the row is off screen, to save the battery. With Reduce Motion on, the stylesheet keeps the row
// still and hides the button, whatever this script does.

document.documentElement.classList.add('js');

const marquee = document.querySelector('[data-marquee]');
const pause = document.querySelector('[data-marquee-pause]');

if (marquee && pause) {
  const list = marquee.querySelector('.marquee-list');
  const copy = list.cloneNode(true);
  copy.classList.add('is-copy');
  copy.setAttribute('aria-hidden', 'true');
  copy.inert = true;
  for (const img of copy.querySelectorAll('img')) img.alt = '';
  list.after(copy);

  const label = pause.querySelector('.label');
  pause.hidden = false;
  pause.addEventListener('click', () => {
    const paused = marquee.classList.toggle('is-paused');
    pause.dataset.state = paused ? 'paused' : 'playing';
    label.textContent = paused ? 'Play' : 'Pause';
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      marquee.classList.toggle('is-offscreen', !entry.isIntersecting);
    }).observe(marquee);
  }
}
