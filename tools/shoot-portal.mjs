// Shoots the team portal's sample pages for the site's portal pictures: light mode, reduced motion, at 2x.
//
//   export PATH=/opt/homebrew/bin:$PATH          # Homebrew Node 24
//   node tools/shoot-portal.mjs <out-folder> [http://localhost:5181]
//
// Run the portal's dev server first (sample mode is development only), from the app repo:
//   VITE_SUPABASE_URL=http://127.0.0.1:54321 VITE_SUPABASE_ANON_KEY=sb_publishable_sample \
//     npm --workspace apps/admin run dev -- --port 5181
// (the two values only have to be there; sample mode answers every call itself). Then
// `python3 -I tools/make-screens.py <app-shots> <out-folder>` crops these into img/portal-*.webp.
//
// Needs Google Chrome (headless, through the DevTools protocol). Nothing is written outside <out-folder>.

import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';

const OUT = resolve(process.argv[2] ?? 'portal-shots');
const BASE = (process.argv[3] ?? 'http://localhost:5181').replace(/\/$/, '');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

// file: [CSS width, CSS height, ?sample= and the rest of the query]
const SHOTS = {
  'd-week': [1440, 1100, 'this-week&office=dealer'],
  'p-week': [1440, 1100, 'this-week'],
  'd-person': [1440, 1900, 'person&office=dealer'],
  'p-person': [1440, 1900, 'person'],
  // The posts again at 560 px, where each line wraps whole and reads larger, for the phone files.
  'd-person-560': [560, 1900, 'person&office=dealer'],
  'p-person-560': [560, 1900, 'person'],
};

mkdirSync(OUT, { recursive: true });
const profile = join(OUT, '.chrome-profile');
const port = 9700 + Math.floor(Math.random() * 200);
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`,
  '--no-first-run', '--disable-gpu', '--hide-scrollbars', '--force-color-profile=srgb', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let ws;
for (let i = 0; i < 50 && !ws; i++) {
  try {
    const page = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === 'page');
    if (page) ws = new WebSocket(page.webSocketDebuggerUrl);
  } catch {}
  await sleep(200);
}
if (!ws) throw new Error('Chrome did not start');
if (ws.readyState !== WebSocket.OPEN) await new Promise((r) => ws.addEventListener('open', r));
let id = 0;
const waits = new Map();
ws.addEventListener('message', (m) => {
  const d = JSON.parse(m.data);
  if (d.id && waits.has(d.id)) { waits.get(d.id)(d); waits.delete(d.id); }
});
const send = (method, params = {}) => new Promise((r) => { const n = ++id; waits.set(n, r); ws.send(JSON.stringify({ id: n, method, params })); });

await send('Page.enable');
// The page's clock reads today at 1:45 PM, whatever time it is: the sample's reminder "sent this morning" is two
// hours before now, and a real one only goes out between 9 AM and 7 PM. Only the time of day moves.
const at = new Date();
at.setHours(13, 45, 0, 0);
await send('Page.addScriptToEvaluateOnNewDocument', { source: `(() => {
  const RealDate = Date, offset = ${at.getTime() - Date.now()};
  class ShotDate extends RealDate {
    constructor(...args) { if (args.length === 0) super(RealDate.now() + offset); else super(...args); }
    static now() { return RealDate.now() + offset; }
  }
  window.Date = ShotDate;
})();` });
await send('Emulation.setEmulatedMedia', { features: [
  { name: 'prefers-color-scheme', value: 'light' }, { name: 'prefers-reduced-motion', value: 'reduce' }] });
for (const [name, [width, height, query]] of Object.entries(SHOTS)) {
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 2, mobile: false });
  await send('Page.navigate', { url: `${BASE}/?sample=${query}` });
  // Wait for the page's rows or posts (a fresh dev server takes a while on the first page), then let it settle.
  for (let i = 0; i < 60; i++) {
    const ready = await send('Runtime.evaluate', { returnByValue: true,
      expression: "document.querySelectorAll('ul.rows > li, article.post').length > 0" });
    if (ready.result?.result?.value) break;
    await sleep(250);
  }
  await sleep(1500);
  const shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width, height, scale: 1 } });
  writeFileSync(join(OUT, `${name}.png`), Buffer.from(shot.result.data, 'base64'));
  console.log(`${name}.png  ${width * 2} x ${height * 2}  ?sample=${query}`);
}
chrome.kill();
await sleep(500);
rmSync(profile, { recursive: true, force: true });
process.exit(0);
