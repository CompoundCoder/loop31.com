# loop31.com

The public website for Loop31, by Compound Coder LLC. Plain HTML and one stylesheet. No framework, no build step, no JavaScript, no outside requests (no fonts, no analytics, no tracking).

## Files

| File | What it is |
|---|---|
| `index.html` | What Loop31 is |
| `privacy.html` | The privacy policy (the page the App Store and Meta require) |
| `terms.html` | Terms of use |
| `support.html` | How to get help, and a short FAQ |
| `404.html` | Shown by GitHub Pages for any missing page |
| `style.css` | The one stylesheet (light and dark, phone width first) |
| `favicon.png`, `apple-touch-icon.png`, `logo.png` | The app icon, resized from `docs/brand/generated/icon-1024.png` in the app repo |
| `CNAME` | `loop31.com`, which tells GitHub Pages the custom domain |
| `.nojekyll` | Tells GitHub Pages to serve the files as they are |
| `robots.txt`, `sitemap.txt` | Allow all crawlers; list the four pages |

The footer on every page carries one placeholder, `[exact address to be added]`. Replace it on all five pages (search for the text) once the business address is settled.

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

Open any `.html` file in a browser, or from this folder run `python3 -m http.server 8000` and visit http://localhost:8000. The pages must work at phone width with no sideways scrolling, in light and dark mode.

## Rules for the copy

Plain words, no slogans, no AI company names on the home page (the privacy policy names them), nothing the app does not do today. The app's own writing rules are in the app repo under `docs/HANDOFF.md`, "Working rules with Trevor". The privacy policy is written from `docs/data-inventory.md` in the app repo; when that file changes, change `privacy.html` and its date.
