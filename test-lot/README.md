# Loop31 Test Lot

A pretend dealership website, used only to test Loop31's dealer inventory reader (Loop-31-V2 `docs/DATA_MODEL.md`,
"Dealer inventory from the website") on the live server. None of these cars exist and nothing here is for sale: every
page says so in a banner, is `noindex, nofollow`, and is linked from nowhere on loop31.com. The only way in for a
reader is `robots.txt`'s `Sitemap: https://loop31.com/test-lot/vehicles.xml` line.

The VINs are made up: a real model's pattern (positions 1–8 and 10–11), our own serial number, and the check digit
worked out, so NHTSA vPIC decodes each one cleanly (ErrorCode 0), which Loop31 needs before it offers a car. They
were checked against vPIC on 2026-10-23.

| # | Car | VIN | In `vehicles.xml` |
|---|---|---|---|
| 1 | 2019 Honda Civic Type R Touring | SHHFK8G79KU204417 | yes |
| 2 | 2020 Toyota RAV4 XLE | 2T3W1RFVXLC054812 | yes |
| 3 | 2018 Ford F-150 XLT | 1FTEW1EP4JFC31840 | yes |
| 4 | 2018 Toyota Tacoma TRD Off-Road | 3TMCZ5AN2JM143122 | yes |
| 5 | 2019 Jeep Wrangler Unlimited Rubicon | 1C4HJXFG1KW528806 | **not yet** (step 2) |

Each page carries schema.org `Car` JSON-LD: the VIN, make, model, year, trim, miles, color, a stock number, the price
in one offer and a sample monthly payment in another (`unitCode` `MON`), and two photos (`img/<VIN>-1.jpg`, `-2.jpg`).
The payment is there on purpose: Loop31 must never put a price or a payment in a post.

The photos are free Unsplash photos (the Unsplash License; each page links them), downloaded once, shrunk to at most
1600 px and 300 KB, metadata dropped. They show the right model, not these exact cars: the RAV4's two are different
colors (blue, then silver; no second blue one was free), the F-150's are two different black trucks.

## Testing it

1. **The first read.** In the team portal (a team with at least one seated Auto Sales member), Settings →
   Inventory: give `https://loop31.com/`, tick the box, Save, then Read It Now (3 a day). The first good read only
   notes the lot: 4 cars, nothing offered.
2. **A new car arrives.** Add car 5's line to `vehicles.xml` (and, if you like, a link on `index.html`), push, wait
   for GitHub Pages, then Read It Now. Car 5 is offered to one seated salesperson, who claims it or passes it on.
   ```xml
   <url><loc>https://loop31.com/test-lot/used-2019-jeep-wrangler-1C4HJXFG1KW528806.html</loc></url>
   ```
3. **A car leaves.** Take one car's line out of `vehicles.xml` and push. One read without it marks it missing;
   a second good read at least 20 hours later marks it gone (its posts not yet out are paused and the app asks
   about it). So this step spans two nights, or two Read It Nows a day apart.

Don't share the posts these cars make: they describe cars that don't exist.

When testing is done, delete this folder and the `Sitemap:` line for it in `robots.txt`, then remove the website in
the portal (Settings → Inventory).
