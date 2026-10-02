# Ben Tye — portfolio site

A static site. No build step, no dependencies, no framework. Every file is plain HTML, CSS and vanilla JavaScript, so it will run on any host that serves files.

## Files

The page content, its styling and its behaviour are kept apart so each can be learned and tweaked on its own.

| File | What it is |
| --- | --- |
| `index.html` | Page content only: text, images, links. No styles or scripts inside |
| `404.html` | Not-found page, styled to match (self-contained) |
| `css/tokens.css` | **Start here.** Every colour, font and motion setting as a variable |
| `css/base.css` | Reset, body text, shared headings and section spacing |
| `css/header.css` | Sticky header, nav links, theme and menu buttons, progress line |
| `css/hero.css` | Intro block and the animated foot figure |
| `css/projects.css` | Project cards, image stages, metrics and the CAD gallery |
| `css/sections.css` | Focus, Capabilities and Background |
| `css/contact.css` | Contact block, footer and back-to-top button |
| `css/lightbox.css` | Full-screen image viewer |
| `css/motion.css` | Scroll reveals and pointer effects |
| `js/theme-init.js` | Applies the saved theme before the page draws (loaded in `<head>`) |
| `js/theme.js` | Dark / light toggle |
| `js/nav.js` | Progress line, active section highlight, mobile menu, back to top |
| `js/reveal.js` | Animates text and images in as you scroll |
| `js/counters.js` | Counts the headline numbers up when they appear |
| `js/pointer-effects.js` | Figure tilt and card spotlight (mouse only) |
| `js/lightbox.js` | Click an image to enlarge it, arrow keys to browse |
| `img/` | Project photographs, renders, drawings and result figures |
| `og-image.png` | Social preview card (1200×630) shown when the link is shared |
| `favicon.svg` | Browser tab icon |
| `Ben-Tye-CV.pdf` | The CV the download buttons link to |

## Common tweaks

- **Accent colour:** change `--signal` in `css/tokens.css` (and its dark value further down the same file)
- **Animation speed or distance:** `--reveal-time`, `--reveal-shift`, `--stagger` and `--word-stagger` in `css/tokens.css`
- **Animate a new element:** add its selector to the `EFFECTS` list at the top of `js/reveal.js`
- **Turn an effect off:** delete its `<script>` line at the bottom of `index.html`. Each script works on its own, and the page still reads normally with none of them
- **Reduced motion:** visitors whose system asks for less motion get the finished page with no animation. Keep that in mind if you add effects: the `prefers-reduced-motion` block at the end of `css/motion.css` is the place to switch them off

## Publishing it

### GitHub Pages — free, custom domain supported

1. Create a GitHub account if you do not have one
2. Create a new **public** repository named `bentye.github.io` (substitute your username)
3. Upload every file in this folder to the root of that repository. The `img` folder must go up too, keeping its name and staying one level down — the page looks for `img/platform-render.jpg` and so on. GitHub's web uploader accepts a dragged folder and preserves the structure, so drag `img` in as a folder alongside the loose files
4. Go to **Settings → Pages**, set Source to `Deploy from a branch`, branch `main`, folder `/ (root)`, and Save
5. Wait a minute or two. The site appears at `https://bentye.github.io`

### Netlify — free, drag and drop

1. Create a Netlify account
2. Go to **Sites** and drag this entire folder onto the drop zone
3. It deploys immediately to a random subdomain, which you can rename in **Site settings → Change site name**

Cloudflare Pages and Vercel work the same way, as does any traditional host with FTP access — upload the files and you are done.

### A custom domain

A `.co.uk` domain costs roughly £8–12 a year. Buy one from any registrar, then point it at your host: GitHub Pages and Netlify both have a "custom domain" setting that walks through the DNS records. `bentye.co.uk` on a CV reads considerably better than a `github.io` subdomain.

## Editing it later

Open `index.html` to change words or images; it is commented by section — hero, focus, work, capabilities, background, contact. Change the look in the matching file in `css/`, and the behaviour in `js/`. Each file starts with a comment saying what it covers.

To add a fourth project, copy any `<article class="proj">` block and edit the contents. The layout adapts automatically.

## Notes on how it is built

- **Fonts** load from Google Fonts. If you would rather not depend on that, download Archivo, Source Serif 4 and JetBrains Mono, put the files alongside the HTML and swap the `<link>` for `@font-face` rules
- **Accessibility**: keyboard focus is visible throughout, the animated figure has a text description, and everything animated stops for anyone who has "reduce motion" enabled in their operating system
- **No tracking or analytics.** Nothing to disclose in a cookie banner, and nothing to slow the page down
