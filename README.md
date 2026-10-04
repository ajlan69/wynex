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
sitemap.xml             three URLs: home, terms, privacy
assets/css/style.css    design tokens + all components
assets/js/main.js       nav, scroll reveal, copy-UPI, contact form, footer year
assets/favicon.svg      favicon
assets/og-image.svg     social preview (replace with a 1200x630 PNG)
assets/img/demo-live-480.webp    real screenshot of the live demo, mobile width
assets/img/demo-live-960.webp    real screenshot of the live demo, desktop width
```

Section ids are stable and worth knowing before editing: `#examples` (live demo
plus six concept directions), `#themes`, `#who`, `#why`, `#includes`,
`#process`, `#pricing`, `#ownership`, `#trust`, `#faq`, `#contact`.

## Before you publish: edit these

Four values appear in several places. Each occurrence in the HTML carries an
`<!-- EDIT -->` comment next to it.

| What | Where | Current placeholder |
| --- | --- | --- |
| WhatsApp number | every `wa.me/` link | `+91 62387 12579` → `916238712579` |
| UPI ID | pricing buttons, contact card, `main.js` `CONTACT.upi` | `ajlanwynex@upi` |
| Instagram handle | contact card | `@wynex.studio` |
| Email address | contact card, footer, terms, privacy, `main.js` `CONTACT.email` | `ajlanabduljlaeel@gmail.com` |

Also replace:

- The concept cards in `#examples` are deliberate, hand-built CSS previews
  labelled `Concept`, not client work. Each card is a WhatsApp link with a
  concept-specific message, so nothing is a dead `href="#"`. If you build any
  of them for real, keep the `Concept` label until it is a paid client project,
  then replace the card with a real link. Never present a concept as client
  work.
- `assets/og-image.svg` → a 1200x630 PNG (most platforms ignore SVG previews),
  and update the `og:image` URL.

Pricing amounts live in the `upi://` links as the 50% advance: `am=999.50`,
`am=2499.50`, `am=4999.50`. Change all three together with the visible price,
and keep the two in agreement with `terms.html`.

## Payments

Each plan has a UPI deep link:

```
upi://pay?pa=<UPI_ID>&pn=WYNEX&am=<AMOUNT>&cu=INR&tn=<NOTE>
```

On Android this opens the UPI app with the amount filled in. On desktop there
is usually no handler, so the script copies the UPI ID to the clipboard and
shows a toast. The click is never cancelled, so nothing breaks on mobile.

**50% advance starts the work, 50% is due when the site is delivered.** The page
never says the advance "confirms a slot", because no slots are held.

## Contact form

`#contactForm` has no backend — it validates, then opens the visitor's own mail
app with the message pre-filled (a `mailto:` handoff). Nothing is sent to a
server and no data is stored here.

To collect submissions on a server instead, replace the `submit` handler in
`assets/js/main.js` with a `fetch()` to Formspree, Web3Forms or your own
endpoint, and add the hidden field their docs specify.

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
- Dark mode follows `prefers-color-scheme`; both palettes are defined in CSS
  variables.
- Skip link, visible focus rings, `aria-expanded` on the menu, `aria-current`
  on the active nav item, labelled form errors.
- No "100% guaranteed", no invented client counts, no fabricated testimonials
  presented as real. No fake urgency ("slots left", countdowns). Concepts are
  labelled as concepts; the only live demo links to the real built site.
- Delivery is always framed as a *target* per package (Starter about 48 hours,
  Professional 3–5 days, Premium 5–7 days, Custom agreed in writing) and starts
  once content and the advance are in. Nothing on the page promises every
  package in 48 hours.

## Still to confirm before publishing

- The four contact values in the table above are placeholders until you have
  checked them against your real accounts.
- The 50% advance amounts in the `upi://` links (`999.50`, `2499.50`, `4999.50`)
  assume those are the advances you want.
- `sitemap.xml` and `robots.txt` point at `https://ajlan69.github.io/wynex/`.
  Update them if you move to a custom domain or Cloudflare Pages.
