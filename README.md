# loop31.com

The public website for Loop31, by Compound Coder LLC. Plain HTML, one stylesheet and one small, optional script. No framework, no build step, no outside requests: the fonts and every image are served from this site, and there are no analytics and no tracking.

Since 2026-10-23 the site is written for the people who approve and buy seats: a dealership's general manager or dealer principal (and, at a group's store, the group), a brokerage's broker-owner or managing broker, and leaders of agent teams. The GSM, office manager and marketing director are named as the people who run it day to day, not as the buyers (2026-10-24, from `docs/research/2026-10-24-decision-makers.md` in the app repo). The salesperson's page is one quiet link in the nav. The plan behind it was approved by Trevor on 2026-10-23 (seven calls; the research is in the app repo, `docs/research/2026-10-23-*.md`).

## Files

| File | What it is |
|---|---|
| `index.html` | The home page, for managers: the promise, Joe Girard, the leak, how it works, what managers see and never see, the checks and the check record, the math and the calculator, price and the pilot, who you're dealing with, questions |
| `teams/dealerships/index.html`, `teams/brokerages/index.html` | The same pitch for dealerships and for brokerages, each with its rules section, "Who approves it, and who runs it", and its sources at the bottom; dealerships adds a section for a group's store (`#groups`), brokerages one for leaders of agent teams (`#agent-teams`) (the pitch kit links these URLs; keep them) |
| `teams/index.html` | Pricing and seats: the price, what a seat includes, how seats work, the calculator, the pilot (served at `/teams/`, "Pricing" in the nav) |
| `pilot/index.html` | The pilot's terms and a short form that writes an email to support@loop31.com in the visitor's own mail app |
| `security/index.html` | Security and data: what is kept, where, who sees what, what managers never see, deletion, what we don't have |
| `for-salespeople/index.html` | The salesperson's page: the home page from before 2026-10-23, with its year-in-a-feed story, and a band for asking their manager |
| `privacy.html` | The privacy policy (the page the App Store and Meta require) |
| `terms.html` | Terms of use |
| `support.html` | How to get help, and a short FAQ |
| `404.html` | Shown by GitHub Pages for any missing page, at any depth (its links start with `/` for that reason) |
| `style.css` | The one stylesheet (light and dark, phone width first, all the motion) |
| `site.js` | The one script, optional (see below) |
| `fonts/inter-latin-*.woff2`, `fonts/Inter-OFL.txt` | Inter, for reading and for every number, with its license |
| `fonts/nunito-latin-var.woff2`, `fonts/OFL.txt` | Nunito, for headlines and the wordmark, with its license |
| `img/` | The app screens, portal screens and example posts, named by what they show (see Images) |
| `tools/` | The scripts that make the images in `img/`. Not linked from any page |
| `favicon.png`, `apple-touch-icon.png`, `logo.png` | The app icon, resized from `docs/brand/generated/icon-1024.png` in the app repo |
| `CNAME` | `loop31.com`, which tells GitHub Pages the custom domain |
| `.nojekyll` | Tells GitHub Pages to serve the files as they are |
| `robots.txt`, `sitemap.txt` | Allow all crawlers; list the ten pages (and the test lot's vehicle sitemap) |
| `team/` | The team portal's build (a separate app, `apps/admin` in the app repo). The site links to it as "Manager sign-in"; don't confuse it with `teams/` |
| `test-lot/` | A pretend dealership for testing the dealer reader (see its README); not linked from any page |

Every page carries the same header (Dealerships, Brokerages, Pricing, Security, a quiet "For salespeople", Manager sign-in, Start a pilot) and the same footer. There is no build step, so a change to either is made on every page.

## The look

Calm and plain for the people who buy seats; warm on the salespeople's page.

- **Type.** Nunito for headlines and the wordmark (the free twin of the logo's SF Pro Rounded, per `docs/brand/BRAND.md` in the app repo), at 800 so it reads firm. **Inter** for reading and for every number (Inter 4.001 Regular, SemiBold and Bold, cut to Latin with `pyftsubset` from the pitch kit's OFL files, about 19 KB each), with tabular figures wherever numbers line up: figures, prices, tables, the calculator, the pilot's days.
- **Color.** A calm off-white base (dark in dark mode), the app's blue for buttons and links, and each Loop's own color from the app (`LoopColors` and `LoopInks` in `apps/mobile/src/constants/theme.ts`) as the accent: Car Care and Home Tips blue, Reviews green, Around Town orange. Green, orange and red also mark the check record's words ("Nothing flagged", "A warning", "A rule"), always with the word. The salespeople's page keeps the app's peach-and-sky wash; the manager pages have none.
- **Pictures.** Real product screens only: the app's screens and the portal's sample mode, always labeled "Sample store" or "Sample office". Example posts are the app's own, for made-up people, labeled as samples. No stock photos of people, no illustrations, no drawn devices.

What it avoids on purpose: check marks as bullets (a check means done or passed; lists of what's included use a plain dot, `.dots`, and "never" lists a short dash), small colored labels above every heading, grids of feature cards, floating chips and pulsing dots, glows and gradients behind text, a fake browser frame around a screenshot, logo walls, "#1", "all-in-one", fake dashboards, sparkles and anything that says "AI" in a headline.

Apple's and Meta's rules the pages keep: no drawn, tilted or 3D iPhones, only the app's real screens with a full status bar; "Coming to iPhone", no App Store badge until the app is in the store; the feed in the salespeople's story is generic, with no Facebook or Instagram styling or logos.

## Motion, and what happens without it

The manager pages don't move. The salespeople's page keeps the old home page's motion.

| What moves | How | With Reduce Motion | Without JavaScript |
|---|---|---|---|
| Salespeople's page hero, once on load: the words rise in, the screen settles, the post lands (under a second) | CSS | A short fade | The same (it is CSS) |
| Salespeople's page: the row of example posts drifts sideways, with a Pause button | CSS, started by `site.js` | Still; swipe or scroll it sideways; no button | Still; swipe or scroll it sideways |
| Salespeople's page: "A year in their feed" scrolls with the page, a week counter runs 1 to 52 | CSS scroll-driven animation (`animation-timeline`) | A still list: the four posts with their weeks, then the text | The same (it is CSS) |
| The Real Estate / Car Sales switch | Two radio buttons and CSS `:has()` | The same | The same |
| Page to page | A cross-fade (`@view-transition`) | None | The same |

Browsers without scroll-driven animation (Firefox today, Safari before 26) get the still versions.

`site.js` does three things, each only on a page that has the part:

1. **The drifting row of posts** (salespeople's page): copies the row once so the drift loops, shows its Pause button (WCAG 2.2.2), stops the drift while the row is off screen.
2. **The calculator** (home, pricing, dealerships, brokerages). Seats and what one sale makes, in; the extra sales a year that could cover Loop31, out. `cost a year = max(seats, 3) × $10 × 12`; `ratio = cost a year ÷ what one sale makes`; it says "One extra sale a year could cover it" when the ratio is 1 or less, "About one extra sale…" up to 1.05, and otherwise "About 1.2 extra sales…" (one decimal; whole numbers from 10), the same rounding as the worked examples. The seat price, the 3-seat floor and the unit ("sale" or "side") come from the calculator's own `data-` attributes, next to the price the page shows, so no price is written in the script. Defaults: 20 seats and $2,784 (a used car's front gross after a 25% commission plus F&I, Presidio-NCM 2026) on home, pricing and dealerships; 20 agents and $2,075 company dollar a side on brokerages. It always says **could**, never "will" or "pays for itself", and every page says it could also take more. Without JavaScript the calculator stays hidden; the worked examples are in the page.
3. **The pilot form** (`/pilot/`): writes an email to support@loop31.com in the visitor's own mail app (subject "Free 30-day pilot: <store>", the four answers in the body). Nothing is sent or kept by the site. Without JavaScript a plain prefilled `mailto:` link shows instead.

## Images

Every image is in `img/`, named by what it shows, so a new picture is a new file under the same name.

| File | What it is | Where it came from |
|---|---|---|
| `portal-board-dealer.webp`, `-phone.webp` | Home hero and the dealership page: the portal's Team page for the sample dealership (Fall Creek Auto): its three numbers (posted this week, posts this month, shared of planned), the cars line, then this week and this month per salesperson, Remind and "Sent" | The portal's sample mode, `?sample=this-week&office=dealer`, 1440 × 1100 at 2×, from `apps/admin` at `integration/2026-10-23-b2b` (the D63 look), 2026-10-23; the phone file is the people table's name, this week and this month columns |
| `portal-board-realty.webp`, `-phone.webp` | The brokerage page and the salespeople's band: the same for the sample brokerage (Northline Realty) | `?sample=this-week`, the same way |
| `portal-person-numbers.webp`, `-phone.webp` | Home: one person's page, this week, this month, streak, last post | `?sample=person&office=dealer`, 1440 × 1900 at 2× |
| `portal-check-record.webp`, `-phone.webp` | Home and the dealership page: posts that went out with "Checked when shared … Nothing flagged." | Same shot, lower down; the phone file from the same page 560 px wide, so each line is whole |
| `portal-check-record-realty.webp`, `-phone.webp` | The brokerage page: the same for a sample agent (fair housing wording checked) | `?sample=person` |
| `screen-calendar.webp` | Salespeople's page hero: the Week tab | iPhone 17 Pro simulator, the app's sample account, `integration/2026-10-23-b2b` (the picture-first look), 2026-10-23 (`calendar.png`) |
| `screen-lookover.webp` | How it works, step 2: Check posts, with Skip and Looks good | Same (`review.png`) |
| `screen-handoff.webp` | How it works, step 3: Share | Same (`handoff-w1.png`) |
| `portal-team.webp`, `portal-person.webp`, `portal-team-table.webp` and their `-phone` files | The old portal screens (2026-10-22), before the D60 numbers; no page uses them now | Kept for the pitch kit until it is redone; the tools no longer make them |
| `post-re-*.webp`, `post-auto-*.webp` | The ten example posts. `post-auto-tips`, `-reviews` and `-hood` are How it works, step 1 | Drawn by the app's own graphics code from each starter Loop's first idea, over its bundled example photo |

**Making them again.** With Homebrew's Node 24 and Google Chrome:

- `node tools/render-posts.mjs [~/code/loop31]` draws the ten posts exactly as setup step 5 does and writes `img/post-*.webp`. It only reads the app repo. Market Updates is left out on purpose: its hook is a real county number.
- The app screens: boot the iPhone 17 Pro simulator, give it a full status bar (`xcrun simctl status_bar booted override --time 9:41 --dataNetwork wifi --wifiBars 3 --cellularMode active --cellularBars 4 --batteryState discharging --batteryLevel 100`, and `xcrun simctl status_bar booted clear` after), then from `apps/mobile` in the app repo run `SHOT_PORT=8098 NO_SETUP=1 npm run shots -- <shots-folder> /calendar /review /handoff/w1` (the app's sample account; light mode).
- The portal shots: run the portal's dev server (`apps/admin`; sample mode is development only, see `tools/shoot-portal.mjs` for the command), then `node tools/shoot-portal.mjs <portal-shots-folder>` shoots each `?sample=` page above at 2×, light mode, with the page's clock at 1:45 PM today (so the sample's reminder reads as sent in the morning; real ones go out 9 AM to 7 PM).
- `python3 -I tools/make-screens.py <shots-folder> [<portal-shots-folder>]` turns the simulator screenshots into the `screen-*.webp` files (840 px wide) and crops the portal shots into the `portal-*.webp` files (quality 82, 1200 px wide, 680 for the phone files). The crop boxes are in the script; check them after the portal's layout changes. The sample names and stores are made up; every picture carries a visible "Sample" tag on the page.

**Still to replace.** There is no Lock Screen shot of the manager's reminder; the pages say "a reminder" and that it shows at the top of Home, and never promise a phone notification until push is on. There is no picture of the pilot summary (its sample page doesn't render in headless Chrome).

## Credits

- **Photos in the example posts:** from Unsplash, under the Unsplash License (no credit required; we credit anyway). The same files the app bundles, listed in the app repo's `apps/mobile/assets/examples/CREDITS.md`:
  - Home Tips, water shutoff: Elimende Inagella. Client Reviews, keys: Jakub Żerdzicki. Around Town, coffee: Nathan Dumlao. Behind the Scenes, paint rollers: David Pisnoy. Motivation, notebook: Volodymyr Hryshchenko.
  - Car Care Tips, tire tread: Marvin Sagisi. Customer Reviews, car key: yahdi yasya. Around Town, fall road: Dave Hoefler. Behind the Scenes, car wash: Nik. Motivation, windshield sunset: Ray Zhou.
- **Nunito** (headlines, wordmark): The Nunito Project Authors, SIL Open Font License 1.1, `fonts/OFL.txt`.
- **Inter** (reading and numbers, and the words drawn on the example posts, as in the app): The Inter Project Authors (Rasmus Andersson), SIL Open Font License 1.1, `fonts/Inter-OFL.txt`. The served files are a Latin subset of Inter 4.001 (Inter declares no Reserved Font Name).
- The people and stores in the examples and the portal pictures (Jess Rivera, Jordan Ellis, Northline Realty, Fall Creek Auto, the friends in the feed, the salespeople and agents on the Team pages) are made up, with 555 phone numbers and example.com addresses.

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

From this folder run `python3 -m http.server 8000` and visit http://localhost:8000 (the pages use paths from the site root, such as `/style.css`, so serve the folder rather than opening a file directly). The pages must work at phone width (390 px) and computer width (1280 px) with no sideways scrolling, in light and dark mode, and every page must read fully with Reduce Motion on and with JavaScript off (Chrome's DevTools can turn on both: Rendering → "prefers-reduced-motion", and Settings → Debugger → "Disable JavaScript").

## Rules for the copy

Plain words, numbers first for managers, sources linked, limits stated, nothing the app does not do when the page ships. No AI company names on the marketing pages (the privacy policy and the security page name them); no "AI" in any headline. The app's own writing rules are in the app repo under `docs/HANDOFF.md`, "Working rules with Trevor". The privacy policy is written from `docs/data-inventory.md` in the app repo; when that file changes, change `privacy.html` and its date.

## The pages for managers

Every figure has a numbered source in the list at the bottom of its page; the research behind them is in the app repo, `docs/research/2026-10-23-*.md` (top-of-mind-evidence, how-managers-buy, b2b-site-and-brand, dealer-buyers, brokerage-buyers). Rules for changing these pages:

- **"Could", always.** "One extra sale a year could cover it", never "will" or "pays for itself" (Trevor: it depends on the price and what the store makes, so it might not), and every price block says it could also take more. <!-- trope-ignore: this rule quotes the banned phrase -->
- **Who it's for** (`docs/research/2026-10-24-decision-makers.md`): at a dealership the GM or dealer principal approves and the GSM runs it (a champion and portal admin, never "the buyer"); the marketing or digital director owns the website and social media; at a group's store, one store first, with the group's OK, and the security page for their review. At a brokerage, the broker-owner or managing broker approves (Indiana's 876 IAC 8-1-1 and 8-1-8, quoted); leaders of agent teams can hold their own team's seats. Say "leaders of agent teams" or "team lead", never "team leader" alone: a Keller Williams market center's leader is its Team Leader. Only the research's [A] and [S] items go on the site as facts, each with its source; its [J] and [V] items shape the wording, never a claim. Break-even numbers only: no reach, impressions, earned media value, lift, leads or income claims. The reach estimate on the home page appears only with every input shown and says it is an estimate.
- **Joe Girard: verified facts only** (13,001 cars at one Chevrolet store in Eastpointe, 1963 to 1977; a piece of mail to every customer once a month; he also paid for referrals). Never "holds the Guinness record", never the "Law of 250". **Never mention Grant Cardone on the site** (his line goes in emails and the deck). Keep off the "Rule of 7" and the "8×" and "561%" sharing figures.
- No customer logos, testimonials, "trusted by", agent counts, ROI multiples, "attorney-approved", "co-op eligible", certifications we don't have, or any line that says Loop31 makes someone compliant. Name the rule and say what the app does about it, and keep "These checks catch common problems. They aren't legal advice."
- The see / never-see promise is the app's own wording, quoted word for word (`teamDisclosure` in `packages/model/src/team.ts`, version `team-2026-10-v2` with the reminder line, PLAN D38 and D60). If the app's wording changes, change it here too.
- The price is PLAN D50 ($10 a seat a month, at least 3). The pilot is PLAN D54: one person approves it by name (the GM or dealer principal, with the group's OK at a group's store; the broker-owner or managing broker; or an agent team's lead, whom the pages ask to tell the managing broker first); 3 to 10 people; free for 30 days with those days left off the invoice; a one-page summary in the portal; **on day 31 the team carries on at the seat price** unless the office has told us to end the seats; either side can end it any day; one pilot per team.
- Built and fine to describe: who posted this week and this month as posted of planned, the 3 months before, the last post, the streak, and a manager's reminder (1 a day, 3 a week, 9 AM to 7 PM their time, only with a post due today), shown at the top of Home in the app (D60); the check record and its CSV (D56); the office logo and line (D57); new arrivals from a dealership's website (D59); the Monday email (D55, needs `TEAM_DIGEST_SECRET` and `RESEND_API_KEY` on the hosted project). Not live, so not promised: a push notification for the reminder (no EAS project yet), Android, multi-store groups, single sign-on.
- Every portal and app picture carries a visible "Sample store" or "Sample office" tag, and every example post says it's a sample.
- The buttons open prefilled emails to support@loop31.com, and the pilot form only writes one; nothing is collected by the site. "Book 15 minutes with Trevor" is the same address until there is a calendar link.
