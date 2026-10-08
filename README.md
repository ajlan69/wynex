# WYNEX — portfolio-business website

Static site. HTML, CSS and vanilla JS only: no build step, no framework, no
runtime dependency, no tracking. Deploys as-is to GitHub Pages or Cloudflare
Pages.

## Files

```
index.html              the whole page
terms.html              terms of service
privacy.html            privacy policy
404.html                not-found page (used by both hosts automatically)
robots.txt              crawler rules
sitemap.xml             home, terms, privacy + three live demos
demos/designer/index.html      designer portfolio demo (self-contained)
demos/photographer/index.html  photographer portfolio demo (self-contained)
demos/freelancer/index.html    freelancer portfolio demo (self-contained)
assets/css/style.css    design tokens + all components
assets/js/main.js       nav, scroll reveal, copy-UPI, UPI mobile/desktop, footer year
assets/favicon.svg      favicon
assets/og-image.svg     source for the social preview
assets/img/og-image.png exported 1200x630 link preview (regenerate on copy edits)
assets/img/upi-qr.svg   replaceable UPI QR placeholder, desktop only
assets/img/demo-live-480.webp    real screenshot of the live demo, mobile width
assets/img/demo-live-960.webp    real screenshot of the live demo, desktop width
assets/img/demo-designer.webp      960px screenshot of demos/designer/ (auto-captured, ~20 KB)
assets/img/demo-photographer.webp  960px screenshot of demos/photographer/ (auto-captured, ~60 KB)
assets/img/demo-freelancer.webp    960px screenshot of demos/freelancer/ (auto-captured, ~20 KB)
assets/img/demo-personal.svg     generic wireframe used as a demo placeholder
assets/img/demo-creative.svg     generic wireframe used as a demo placeholder
assets/img/demo-developer.svg     generic wireframe used as a demo placeholder
```

Section ids are stable and worth knowing before editing: `#proof` (social proof
placeholders and the first-clients offer), `#services` (the 10 service cards,
each with a Malayalam subtitle and its own prefilled WhatsApp link),
`#examples` (live demos plus honest niche placeholders), `#themes`, `#who`,
`#why`, `#includes`, `#process` (4 steps), `#pricing` (3 packages + ₹500/month
maintenance add-on), `#ownership`, `#trust`, `#faq` (10 questions), `#contact`.

File structure stays as-is (`index.html` + `assets/css/style.css` +
`assets/js/main.js` + `assets/`): moving CSS/JS to the root would break every
existing link, deploy and the demos' backlink badges, so the "simple structure"
rule is met by keeping paths stable instead.

## Before you publish: edit these

The WhatsApp number is confirmed and needs no edits. The other three values
appear in several places, and each occurrence in the HTML carries an
`<!-- EDIT -->` comment next to it.

| What | Where | Current value |
| --- | --- | --- |
| WhatsApp number | every `wa.me/` link, `tel:` link | `+91 62387 12579` / `916238712579` |
| UPI ID | pricing links, contact card, `main.js` `CONTACT.upi` | `ajlanwynex@upi` |
| Instagram handle | contact card | `@wynex.studio` |
| Email address | contact card, footer, terms, privacy | `ajlanabduljlaeel@gmail.com` |

Also replace:

- **The client reviews in `#proof` are an empty shell on purpose.** WYNEX has no
  reviews yet, so the three cards are visibly marked `Placeholder — do not
  publish`, with dashed borders and unfilled stars. Fill in a card only with a
  review a real client actually sent, using their real name, and switch
  `stars--todo` to `stars--filled`. The counter strip has two `—` values that
  show a small `TODO`; replace them with numbers you can evidence or leave them
  as they are. Never publish an invented name, rating or client count.
- **The first-5-clients offer** (20% off for an honest testimonial) is on the
  home page and drafted in `terms.html` §2a. Confirm and tighten that section
  before you rely on the offer.
- **The demo cards in `#examples`.** Three of the four cards are live
  (`demos/designer/`, `demos/photographer/`, `demos/freelancer/`) with real
  screenshots, `Live demo` flags and `target="_blank"` links; the student card
  is still `Coming soon`. There is one external live demo
  (`adeela.vercel.app`) above them. The instructions for adding a demo are in
  the comment above `<ul class="demos">`. Every demo page carries a
  `Made by WYNEX` badge linking back to `../../#examples` — keep it on
  every new demo. To re-capture a preview after editing a demo:
  ```powershell
  & "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new `
    --disable-gpu --hide-scrollbars --window-size=1280,960 `
    --virtual-time-budget=8000 `
    --screenshot="$env:TEMP\shot-<slug>.png" `
    "file:///D:/project/WYNEX/demos/<slug>/index.html"
  python3 -c "from PIL import Image; im=Image.open(r'$env:TEMP\shot-<slug>.png').convert('RGB').resize((960,720)); im.save(r'assets\img\demo-<slug>.webp','WEBP',quality=72)"
  ```
- **The niche cards in `#examples`.** Salon, clinic, restaurant and shop are
  honest placeholders ("Your project here") with per-niche WhatsApp links.
  Swap a card for a screenshot + live link only after a real project ships —
  exactly like the demo cards. Never invent a client or a project.
- **`assets/img/upi-qr.svg`** → your real UPI QR code, square, 512px or larger,
  under ~20 KB. It is only shown on desktop, where the `upi://` links do
  nothing. Keep the filename or update the `src`.
- `assets/img/og-image.png` is the exported 1200x630 PNG used for link previews.
  Re-export it from `assets/og-image.svg` whenever the headline changes — most
  platforms ignore SVG previews. In PowerShell:
  ```powershell
  & "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new `
    --disable-gpu --hide-scrollbars --window-size=1200,630 `
    --screenshot="assets\img\og-image.png" `
    "file:///$((Resolve-Path assets\og-image.svg).Path -replace '\\','/')"
  ```

Pricing amounts live in the `upi://` links as the 50% advance: `am=999.50`,
`am=2499.50`, `am=4999.50`. Change all three together with the visible price,
and keep the two in agreement with `terms.html`.

## Payments

Each plan has a UPI deep link:

```
upi://pay?pa=<UPI_ID>&pn=WYNEX&am=<AMOUNT>&cu=INR&tn=<NOTE>
```

A `upi://` link silently does nothing in a desktop browser, so the page ships in
the **desktop state by default**: the deep link is hidden and the copyable UPI
ID plus a QR placeholder are shown instead. `main.js` adds `html.upi-mobile` on
phones, and the CSS falls back to a `(hover:none) and (pointer:coarse)` media
query, so it also works with JavaScript disabled. If a desktop visitor clicks a
pay link anyway, the UPI ID is copied to the clipboard and a toast explains why.

**Nothing is charged until the client has approved a written scope.** After
that, 50% starts the work and 50% is due when the site is delivered. The page
never says the advance "confirms a slot", because no slots are held.

## Contact

There is **no enquiry form**, and that is deliberate. The old one was a `mailto:`
handoff: it opened the visitor's mail app with a half-written message and there
was no way to know it ever arrived, so it quietly lost enquiries. The four
channels below are the whole contact method, and each one works with JavaScript
disabled:

- WhatsApp `+91 62387 12579` (primary, every CTA on the page)
- Phone `tel:+916238712579`
- Instagram `@wynex.studio`
- Email `ajlanabduljlaeel@gmail.com`

If you later want a real form, add a hosted endpoint that actually accepts
POSTs (Formspree, Web3Forms, Netlify Forms), a success state, and keep the
channels above as the fallback. Never point a form at a URL you have not tested.

## Hosting note (already in the pricing section and FAQ)

> Domain is purchased by client in their own name. Hosting: we set up on your
> Cloudflare account; if you don't have one, we can host on WYNEX Cloudflare
> with a written agreement.

## Deploy

**GitHub Pages** — the repo is already `ajlan69/wynex`. Settings → Pages →
Deploy from a branch → `main` / `/ (root)`. The site is then at
`https://ajlan69.github.io/wynex/`, which is already the canonical URL in
`index.html`, `robots.txt` and `sitemap.xml`. Workflow files at
`https://ajlan69.github.io/wynex/.github/workflows/pages.yml` take precedence
over the branch setting, so push to `main` and let the workflow publish.

**Cloudflare Pages** — Workers & Pages → Create → Pages → Upload assets.
Drag this whole folder in (or connect the Git repo, build command empty,
output directory `/`). Then set a custom domain if you have one.

Nothing needs compiling, so both hosts work in "static, no build" mode.

## Performance and accessibility notes

- Three fonts, loaded non-blocking; the page renders immediately in system
  fonts and swaps when Inter, Fraunces and JetBrains Mono arrive.
- No render-blocking JavaScript. `main.js` is ~5 KB and deferred.
- Every image has `width`/`height` and `loading="lazy"` (except the About
  photo, which sits near the top of its section).
- The FAQ uses native `<details>`, so it opens and closes with JavaScript
  disabled. The secondary package features, eight extra FAQ questions and the
  policies are collapsed by default behind a labelled `<summary>`.
- Reveal animations are opt-in: the script adds `html.js-reveal` before hiding
  anything, so content is never invisible if JS fails. Three further guarantees
  in `initReveal()`: content inside a *closed* `<details>` is never hidden (it
  has no box, so it could never intersect and would stay blank when opened), a
  scroll-position sweep catches anything `IntersectionObserver` misses during a
  fast flick-scroll, and each revealed element drops its `data-reveal` attribute
  once the animation window has passed, so visibility never depends on a
  transition actually running.
- Every major section ends in a CTA (`.section-cta`), so there is a next action
  without scrolling back to the top.
- Dark mode follows `prefers-color-scheme`; both palettes are defined in CSS
  variables.
- Skip link, visible focus rings, `aria-expanded` on the menu, `aria-current`
  on the active nav item. Placeholder star ratings are `aria-hidden` with
  adjacent screen-reader text, so nothing is announced as a real rating.
- No "100% guaranteed", no invented client counts, no fabricated testimonials
  presented as real. No fake urgency ("slots left", countdowns). The review
  cards are visibly marked as placeholders and the demo cards carry a
  `Coming soon` flag, so a wireframe is never passed off as client work. The
  one live demo links to the real built site.
- Delivery is always framed as a *target* per package (Starter about 48 hours,
  Professional 3-5 days, Premium 5-7 days, Custom agreed in writing) and starts
  once the written scope is approved and content is in. Nothing on the page
  promises every package in 48 hours.

## Still to confirm before publishing

- The UPI ID, Instagram handle and email in the table above are placeholders
  until you have checked them against your real accounts.
- The two `—` counters in `#proof` need real numbers, or they should stay as
  they are. Do not publish a figure you cannot evidence.
- The first-5-clients offer in `#proof` and `terms.html` §2a needs confirming.
- The 50% advance amounts in the `upi://` links (`999.50`, `2499.50`, `4999.50`)
  assume those are the advances you want.
- `sitemap.xml` and `robots.txt` point at `https://ajlan69.github.io/wynex/`.
  Update them if you move to a custom domain or Cloudflare Pages.
