# loop31.com

The public website for Loop31, by Compound Coder LLC. Plain HTML, one stylesheet and one small, optional script. No framework, no build step, no outside requests: the font and every image are served from this site, and there are no analytics and no tracking.

## Files

| File | What it is |
|---|---|
| `index.html` | What Loop31 is |
| `teams/index.html` | For managers: how seats work, what a manager sees and never sees, the price, the pilot, and a door to each industry page (served at `/teams/`) |
| `teams/brokerages/index.html`, `teams/dealerships/index.html` | The same pitch written for managing brokers and for dealership sales managers, each with its sources listed at the bottom |
| `privacy.html` | The privacy policy (the page the App Store and Meta require) |
| `terms.html` | Terms of use |
| `support.html` | How to get help, and a short FAQ |
| `404.html` | Shown by GitHub Pages for any missing page, at any depth (its links start with `/` for that reason) |
| `style.css` | The one stylesheet (light and dark, phone width first, all the motion) |
| `site.js` | The one script, optional (see below) |
| `fonts/nunito-latin-var.woff2`, `fonts/OFL.txt` | Nunito, for headlines and the wordmark, with its license |
| `img/` | The app screens and example posts, named by what they show (see Images) |
| `tools/` | Two scripts that make the images in `img/`. Not linked from any page |
| `favicon.png`, `apple-touch-icon.png`, `logo.png` | The app icon, resized from `docs/brand/generated/icon-1024.png` in the app repo |
| `CNAME` | `loop31.com`, which tells GitHub Pages the custom domain |
| `.nojekyll` | Tells GitHub Pages to serve the files as they are |
| `robots.txt`, `sitemap.txt` | Allow all crawlers; list the seven pages |
| `team/` | The team portal's build (a separate app, `apps/admin` in the app repo). The site links to it as "Manager sign-in"; don't confuse it with `teams/` |

## The look

The app's own look, a little warmer: the system font for reading, **Nunito** big and heavy for headlines and the wordmark (the free twin of the logo's SF Pro Rounded, per `docs/brand/BRAND.md` in the app repo; Trevor approved it 2026-10-22), the app's blue (`#008bff`) for buttons and links, the app's peach-and-sky wash behind the hero only, real screens shown without a phone around them (rounded corners and a soft shadow), one flat dark band (Teams), light and dark from the system setting.

What it avoids on purpose, because it reads as a stock AI template (Trevor and the PM, 2026-10-22): small colored labels above every heading, a grid of feature cards, floating chips and pulsing dots, glows and gradient corners on the dark band, a fake browser frame around a screenshot, a brand-colored tail on the headline, and copy built from "X, not Y", triple negatives and three-fragment lists. Sections vary in shape instead: the posts lead their section, How It Works is one sentence and two screens, and the details are one real post with its parts pointed out.

Apple's and Meta's rules the page keeps: no drawn, tilted or 3D iPhones, only the app's real screens with a full status bar; "Loop31 for iPhone" and "Coming to iPhone", no App Store badge until the app is in the store; the feed in the story is generic, with no Facebook or Instagram styling or logos.

## Motion, and what happens without it

| What moves | How | With Reduce Motion | Without JavaScript |
|---|---|---|---|
| The hero, once on load: the words rise in, the screen settles, the post lands (under a second) | CSS | A short fade | The same (it is CSS) |
| The row of example posts drifts sideways, with a Pause button | CSS, started by `site.js` | Still; swipe or scroll it sideways; no button | Still; swipe or scroll it sideways |
| "A year in their feed": the friend's feed scrolls with the page, a week counter runs 1 to 52, then the text arrives | CSS scroll-driven animation (`animation-timeline`), no script | A still list: the four posts with their weeks, then the text | The same (it is CSS) |
| The Real Estate / Car Sales switch | Two radio buttons and CSS `:has()` | The same | The same |
| The two How It Works screens rise in as they scroll into view (computer width only) | CSS scroll-driven animation | Still | The same (it is CSS) |
| Page to page | A cross-fade (`@view-transition`) | None | The same |

Browsers without scroll-driven animation (Firefox today, Safari before 26) get the still versions. `site.js` (about 1.4 KB) does three things only: it copies the row of posts once so the drift loops, shows its Pause button (anything that moves by itself for more than 5 seconds needs one, WCAG 2.2.2), and stops the drift while the row is off screen.

## Images

Every image is in `img/`, named by what it shows, so a new picture is a new file under the same name.

| File | What it is | Where it came from |
|---|---|---|
| `screen-calendar.webp` | Hero: the Calendar tab | iPhone 17 Pro Max simulator, sample account, 2026-10-22 (`site-shots/calendar.png`) |
| `screen-lookover.webp` | How It Works: the look-over | Same (`site-shots/review.png`) |
| `screen-handoff.webp` | How It Works: Post It Yourself | Same (`site-shots/more/handoff-w1.png`) |
| `portal-team.webp`, `portal-team-phone.webp` | The home page's managers band and the team pages: the portal's Team page, computer and phone | The portal's sample mode, 2026-10-22 (`portal-shots/after/team-1440-light.png`, `team-390-light.png`) |
| `portal-person.webp`, `portal-person-phone.webp` | The team pages: one person's page in the portal | Same (`person-1440-light.png`, `person-390-light.png`) |
| `portal-team-table.webp`, `portal-team-table-phone.webp` | The dealership page: the Team page's counts and people, cropped so the sample brokerage's name doesn't lead | Same (`team-1440-light.png`, `team-390-light.png`, cropped) |
| `post-re-*.webp`, `post-auto-*.webp` | The ten example posts (Home Tips, Client Reviews, Around Town, Behind the Scenes, Motivation; Car Care Tips, Customer Reviews and the rest for car sales). `post-re-tips.webp` is also the hero's post and the post with its parts pointed out | Drawn by the app's own graphics code from each starter Loop's first idea, over its bundled example photo |

**Making them again.** With Homebrew's Node 24 and Google Chrome:

- `node tools/render-posts.mjs [~/code/loop31]` draws the ten posts exactly as setup step 5 does (the `tip` template, the hook on the photo, the sample person's line along the bottom) and writes `img/post-*.webp`. It only reads the app repo. Market Updates is left out on purpose: its hook is a real county number.
- `python3 -I tools/make-screens.py <shots-folder> [<portal-shots-folder>]` turns 1320 × 2868 simulator screenshots into the `screen-*.webp` files. It paints over the Dynamic Island (the page shows the screen, not a phone) and draws full signal bars where the simulator shows "no service". The names it reads are in its `ROLES` table.

**Still to replace after the reshoot.** The screens are from the 2026-10-22 sample account: the look-over's first card and the hand-off show a plain color backdrop instead of a photo, the Calendar shows Loop icons instead of photos, every screen is Real Estate, and the battery outline still has the simulator's charging tint. The reminder beside the annotated post is drawn in HTML from the app's own wording until there is a Lock Screen shot.

## Credits

- **Photos in the example posts:** from Unsplash, under the Unsplash License (no credit required; we credit anyway). The same files the app bundles, listed in the app repo's `apps/mobile/assets/examples/CREDITS.md`:
  - Home Tips, water shutoff: Elimende Inagella. Client Reviews, keys: Jakub Żerdzicki. Around Town, coffee: Nathan Dumlao. Behind the Scenes, paint rollers: David Pisnoy. Motivation, notebook: Volodymyr Hryshchenko.
  - Car Care Tips, tire tread: Marvin Sagisi. Customer Reviews, car key: yahdi yasya. Around Town, fall road: Dave Hoefler. Behind the Scenes, car wash: Nik. Motivation, windshield sunset: Ray Zhou.
- **Nunito** (headlines, wordmark): The Nunito Project Authors, SIL Open Font License 1.1, `fonts/OFL.txt`.
- **Inter** (the words drawn on the example posts, as in the app): Rasmus Andersson, SIL Open Font License 1.1. The license covers the font files, not pictures made with them; no font file of Inter is served here.
- The people in the examples (Jess Rivera, Jordan Ellis, Northline Realty, Fall Creek Auto, the friends in the feed) are made up, with 555 phone numbers.

## Publishing with GitHub Pages

1. Create the **public** repository `CompoundCoder/loop31.com` under the CompoundCoder account and push this folder to its `main` branch.
2. In the repository, open **Settings → Pages**. Under **Build and deployment**, set **Source** to "Deploy from a branch", pick **main** and the **/ (root)** folder, and save.
3. Under **Custom domain**, enter `loop31.com` and save. The `CNAME` file in this folder keeps that setting across pushes. Leave **Enforce HTTPS** checked once the certificate is issued (it can take up to an hour after DNS is right).

Every push to `main` publishes within a minute or two.

## DNS at the domain's DNS provider

Point the apex and `www` at GitHub Pages:

| Type | Name | Value |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `compoundcoder.github.io` |

Optional, for IPv6: four AAAA records on `@` with `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`.

If the DNS provider is Cloudflare, leave the proxy off (the gray cloud, "DNS only") for these records so GitHub can issue the certificate. Check that the records are live with `dig loop31.com +noall +answer` and `dig www.loop31.com +noall +answer`.

GitHub's own guide, in case the IPs change: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

## Checking a change locally

From this folder run `python3 -m http.server 8000` and visit http://localhost:8000 (opening the file directly also works, but the 404 page's links start with `/`). The pages must work at phone width (390 px) and computer width (1280 px) with no sideways scrolling, in light and dark mode, and the home page must read fully with Reduce Motion on and with JavaScript off (Chrome's DevTools can turn on both: Rendering → "prefers-reduced-motion", and Settings → Debugger → "Disable JavaScript").

## Rules for the copy

Plain words, no slogans, no AI company names on the home page (the privacy policy names them), nothing the app does not do today. The app's own writing rules are in the app repo under `docs/HANDOFF.md`, "Working rules with Trevor". The privacy policy is written from `docs/data-inventory.md` in the app repo; when that file changes, change `privacy.html` and its date.

## The pages for managers

Every figure on `/teams/brokerages/` and `/teams/dealerships/` has a numbered source in the list at the bottom of the page; the research behind them, with the figures checked against their sources on 2026-10-22, is the PM's manager brief. Rules for changing these pages:

- No customer logos, testimonials, "trusted by", agent counts, ROI multiples, "attorney-approved", "co-op eligible", or any line that says Loop31 makes someone compliant. Name the rule and say what the app does about it, and keep "These checks catch common problems. They aren't legal advice."
- The see / never-see promise is the app's own wording (`teamDisclosure` in `apps/mobile/src/lib/team.ts`, PLAN D38). If the app's wording changes, change it here too.
- The price is PLAN D50 ($10 a seat a month, at least 3). Don't promise what the product doesn't do yet: Android, a weekly manager email, a compliance export, franchise lines, multi-office groups. The 30-day pilot summary is promised (it's being built).
- Every portal screenshot carries a visible "Sample office" label.
- The buttons open prefilled emails to support@loop31.com; there is no form and nothing is collected by the site.
