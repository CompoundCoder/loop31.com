// Loop31 website: the only script, and an optional one. Without it every page still reads the same: the row of
// example posts stays still and scrolls sideways by hand, the calculator stays hidden (its worked examples are in
// the page), and the pilot form falls back to a plain email link.
//
// What it does, each only on a page that has the part:
// 1. The row of example posts (the salespeople's page) drifts: it adds a second copy so the row loops, shows a
//    Pause button (anything that moves on its own for more than 5 seconds needs one), and stops the drift while
//    the row is off screen. With Reduce Motion on, the stylesheet keeps the row still and hides the button.
// 2. The calculator: seats and what one sale makes, in; the extra sales a year that could cover Loop31, out. The
//    seat price, the 3-seat floor and the unit ("sale" or "side") come from the page's own data attributes, next
//    to the price it shows, so no price is written here.
// 3. The pilot form writes an email in the visitor's own mail app, to support@loop31.com. Nothing is sent or kept
//    by this site.

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

// ---- 2. The calculator ----
//
// cost a year = max(seats, floor) × seat price × 12
// ratio       = cost a year ÷ what one sale makes
// shown       = "One extra sale a year could cover it" when the ratio is 1 or less; otherwise "About 1.2 extra
//               sales…", to one decimal (whole numbers from 10). The same rounding as the worked examples.
// It always says "could": the sales may not come, and it could take more.

const dollars = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

function couldCover(seats, gross, seatCents, minSeats) {
  const billed = Math.max(seats, minSeats);
  const yearly = (billed * seatCents * 12) / 100;
  const ratio = yearly / gross;
  return { billed, yearly, ratio };
}

function coverLine(ratio, unit) {
  if (ratio <= 1) return `One extra ${unit} a year could cover it.`;
  if (ratio < 1.05) return `About one extra ${unit} a year could cover it.`;
  const shown = ratio < 10 ? ratio.toFixed(1) : Math.round(ratio).toLocaleString('en-US');
  return `About ${shown} extra ${unit}s a year could cover it.`;
}

for (const calc of document.querySelectorAll('[data-calc]')) {
  const seatCents = Number(calc.dataset.seatCents);
  const minSeats = Number(calc.dataset.minSeats);
  const unit = calc.dataset.unit || 'sale';
  const seatsIn = calc.querySelector('[name="seats"]');
  const grossIn = calc.querySelector('[name="gross"]');
  const big = calc.querySelector('[data-calc-big]');
  const detail = calc.querySelector('[data-calc-detail]');

  const update = () => {
    const seats = Math.floor(Number(seatsIn.value));
    const gross = Number(grossIn.value);
    if (!(seats >= 1) || !(gross > 0)) {
      big.textContent = 'Type the number of seats and what one ' + unit + ' makes.';
      detail.textContent = '';
      return;
    }
    const { billed, yearly, ratio } = couldCover(seats, gross, seatCents, minSeats);
    big.textContent = coverLine(ratio, unit);
    detail.textContent =
      `${billed.toLocaleString('en-US')} seats cost ${dollars.format(yearly)} a year` +
      (billed > seats ? ` (seats start at ${minSeats})` : '') +
      `, and one ${unit} makes ${dollars.format(gross)}: ${ratio.toFixed(2)} ${unit}s. It could also take more.`;
  };

  calc.hidden = false;
  calc.addEventListener('input', update);
  update();
}

// ---- 3. The pilot form ----

const pilot = document.querySelector('[data-pilot-form]');

if (pilot) {
  const done = document.querySelector('[data-pilot-done]');
  pilot.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = (name) => pilot.elements[name].value.trim();
    const store = value('store');
    const body = [
      'Hi Trevor,',
      '',
      'We would like to start a free 30-day Loop31 pilot.',
      '',
      `Store or office: ${store}`,
      `Who approves it: ${value('approver')}, ${value('title')}`,
      `Salespeople or agents: ${value('people')}`,
      `Email for a reply: ${value('email')}`,
      '',
      'Thanks',
    ].join('\n');
    const subject = `Free 30-day pilot: ${store}`;
    window.location.href =
      `mailto:${pilot.dataset.to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    if (done) done.hidden = false;
  });
}
