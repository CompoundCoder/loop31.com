// Draws the example posts on the home page the way the app draws them, and saves them as img/post-*.webp.
//
//   export PATH=/opt/homebrew/bin:$PATH          # Homebrew Node 24 (it runs the app's .ts files directly)
//   node tools/render-posts.mjs [app-repo] [tmp-dir]
//
// app-repo defaults to ~/code/loop31. It only reads from it: the graphics package (compose and the SVG),
// the starter packs (each Loop's first idea, its hook with the pack's example answers), the bundled
// example photos and the Inter font. Nothing is written there.
//
// Each post is what setup step 5 shows for that Loop (apps/mobile/src/features/onboarding/starter-loop-sheet.tsx
// and hookGraphicSpec in apps/mobile/src/lib/graphics.ts): the `tip` template with the hook as its title,
// over the Loop's example photo with light text on a dark scrim, and the band line a real post carries
// (name · business · phone). Market Updates is left out on purpose: its hook is a real county number.
//
// Needs Google Chrome (headless, through the DevTools protocol) and cwebp (Homebrew `webp`).

import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const APP = resolve(process.argv[2] ?? join(homedir(), 'code/loop31'));
const TMP = resolve(process.argv[3] ?? join(tmpdir(), 'loop31-site-posts'));
const SITE = resolve(fileURLToPath(new URL('..', import.meta.url)));
const OUT = join(SITE, 'img');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const G = await import(pathToFileURL(join(APP, 'packages/graphics/src/index.ts')).href);
const P = await import(pathToFileURL(join(APP, 'packages/packs/src/index.ts')).href);

/** The Loops drawn, in the order the home page shows them. */
const LOOPS = ['tips', 'reviews', 'hood', 'bts', 'motivation'];
/** A photo nobody has measured: the app's UNMEASURED_PHOTO, so the scrim is the app's. */
const UNMEASURED = { lightest: '#FFFFFF', darkest: '#000000' };

const posts = [];
for (const industry of ['re', 'auto']) {
  const pack = P.PACKS[industry];
  const { name, brokerage, phone } = pack.words.defaults.ob;
  for (const loopId of LOOPS) {
    const loop = pack.starterLoops.find((l) => l.id === loopId);
    const idea = P.STARTER_PACKS[industry].ideas.find((i) => i.loop === loopId);
    const hook = P.exampleHook(idea);
    const spec = {
      template: 'tip',
      industry,
      business: { line: `${name} · ${brokerage} · ${phone}`, org: brokerage },
      background: { kind: 'own-photo', ref: `example:${idea.id}`, behind: UNMEASURED },
      content: { title: hook },
    };
    const result = G.composeGraphic(spec, '4:5', G.approxMeasure, { prefer: 'light-text' });
    if (!result.ok) throw new Error(`${idea.id}: ${result.errors.map((e) => e.message).join(' ')}`);
    const photo = readFileSync(join(APP, 'apps/mobile/assets/examples', `${idea.id}.jpg`)).toString('base64');
    const svg = G.renderSvg(result.graphic, { idPrefix: idea.id, photoHref: () => `data:image/jpeg;base64,${photo}` });
    posts.push({ file: `post-${industry}-${loopId}`, industry, loop: loop.name, hook, idea: idea.id, svg });
  }
}

// One page per post, set in the app's own Inter files.
rmSync(TMP, { recursive: true, force: true });
mkdirSync(TMP, { recursive: true });
const font = (weight, file) =>
  `@font-face{font-family:Inter;font-weight:${weight};src:url("${pathToFileURL(join(APP, 'apps/mobile/assets/fonts', file)).href}")}`;
const fonts = [font(400, 'Inter-Regular.ttf'), font(500, 'Inter-Medium.ttf'), font(600, 'Inter-SemiBold.ttf'), font(700, 'Inter-Bold.ttf'), font(800, 'Inter-ExtraBold.ttf')].join('');
for (const p of posts) {
  writeFileSync(join(TMP, `${p.file}.html`), `<!doctype html><meta charset="utf-8"><style>${fonts}html,body{margin:0;background:#000}svg{display:block}</style>${p.svg}`);
}

const port = 9400 + Math.floor(Math.random() * 100);
const chrome = spawn(CHROME, ['--headless=new', '--hide-scrollbars', '--allow-file-access-from-files', `--user-data-dir=${join(TMP, 'profile')}`,
  `--remote-debugging-port=${port}`, 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let targets;
for (let i = 0; i < 100 && !targets?.length; i++) {
  try { targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); } catch { await sleep(100); }
}
const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let id = 0;
const pending = new Map();
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); pending.get(m.id)?.(m); pending.delete(m.id); });
const send = (method, params = {}) => new Promise((r) => { const n = ++id; pending.set(n, r); ws.send(JSON.stringify({ id: n, method, params })); });
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1080, height: 1350, deviceScaleFactor: 1, mobile: false });

mkdirSync(OUT, { recursive: true });
for (const p of posts) {
  await send('Page.navigate', { url: pathToFileURL(join(TMP, `${p.file}.html`)).href });
  await sleep(600);
  await send('Runtime.evaluate', { expression: 'document.fonts.ready', awaitPromise: true });
  const shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: 1080, height: 1350, scale: 1 } });
  const png = join(TMP, `${p.file}.png`);
  writeFileSync(png, Buffer.from(shot.result.data, 'base64'));
  execFileSync('cwebp', ['-quiet', '-q', '80', '-resize', '640', '800', png, '-o', join(OUT, `${p.file}.webp`)]);
  console.log(`img/${p.file}.webp  ${p.loop} (${p.industry}): ${p.hook}`);
}
ws.close();
const exited = new Promise((r) => chrome.once('exit', r));
chrome.kill();
await exited;
rmSync(TMP, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
