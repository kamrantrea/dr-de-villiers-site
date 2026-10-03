# Dr Chrisna de Villiers - Aesthetic Medicine website

A fast, single-page static site (plain HTML/CSS/JS, no build step), hosted free on GitHub Pages.

Patients fill in an enquiry form, it is emailed to Dr de Villiers via Web3Forms, and she confirms by reply and books them into Clever Clinic as usual. There is also a WhatsApp button and a Call button.

Files: `index.html` (the page), `style.css` (the design, organised as tokens > base > layout > components > sections > responsive), `config.js` (her contact details, the only file she edits), `products.js` (optional shop), `shop.html` + `shop.js` (the shop page), `script.js` (behaviour), `privacy.html` (draft policy), `book.html` (short link that jumps to the booking form), `images/` (photos).

## 1. Fill in the details (config.js)

Open `config.js` and edit:

| Setting | What it is |
|---|---|
| `email` | Email shown on the site |
| `phone` | Phone shown and used for the Call button |
| `whatsapp` | Digits only with country code, e.g. `353871234567` (no `+`, no spaces) |
| `instagram` | Her Instagram handle (optional). Leave empty and the footer link stays hidden |
| `address` | Optional. Her clinic address; adds a Directions link |
| `googleReviews` | Optional. Link to her Google reviews; adds a "Read our Google reviews" link (no quotes shown on the site) |
| `introVideo` | Optional. `images/intro.mp4` (uploaded) or a YouTube link; adds a "Meet Dr de Villiers" video that only loads when played |
| `web3formsKey` | Access key from Web3Forms (step 2) |

Anything left as a placeholder is hidden automatically (no dead Call, WhatsApp or email buttons). Until a real key is added the form runs in demo mode and shows a "not connected yet" message.

## 2. Make the form email her (5 minutes, free)

1. Go to https://web3forms.com and enter **her** email address.
2. They email her an access key. Paste it into `web3formsKey`.
3. Submit a test enquiry. It should arrive in her inbox.

## 3. Publish on GitHub Pages

The repo is `kamrantrea/dr-de-villiers-site`. On GitHub: **Settings > Pages > Build and deployment > Deploy from a branch > `main` / root > Save.**
The site appears at `https://kamrantrea.github.io/dr-de-villiers-site/` within a minute or two.

GitHub Pages sites are public even when the repository is private. Keep nothing secret in the code (the Web3Forms key is designed to be public).

## 4. Custom domain (her own .ie)

1. Buy the domain **in her name** (not yours).
2. Add a file named `CNAME` to the repo containing only the domain.
3. At the registrar add `A` records for `@` to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`, and a `CNAME` for `www` to `kamrantrea.github.io`.
4. In **Settings > Pages**, enter the custom domain and tick **Enforce HTTPS**.

Check these IPs against GitHub's current Pages docs when you do it.

## 5. Photos (drag and drop, no code)

On github.com open the `images` folder, click **Add file > Upload files**, and drop in:

- `hero.jpg` - portrait of Dr de Villiers for the top of the page (portrait orientation)
- `about.jpg` - second photo for the About section

Name them exactly like that. They replace the temporary royalty-free stock images (Unsplash) automatically. Remove the `onerror=` stock fallback in `index.html` once her own photos are in. Use her own photos, ideally under 500 KB each. Good photography is the single biggest thing that makes the site feel premium.

## 6. Instagram link in bio

Use `https://<site-address>/book.html` as her bio link. It jumps straight to the booking form.

## 7. Before going live

- [ ] Add the two photos.
- [ ] Confirm the credentials and experience claims are accurate.
- [ ] Review `privacy.html` (draft template; remove the draft notice when done).
- [ ] Set up the professional email on her domain.
- [ ] Check Irish Medical Council guidance on advertising. Testimonials were deliberately left out because of the Council's restrictions.

## Unlisted pages (share by link)

- `collagen.html`: an interactive guide to how skin builds collagen. The skin picture stays pinned while you scroll four short steps, with a timeline slider, tappable cells and a little character, Fibro the fibroblast, whose face changes at each stage. It is not linked from the home page and is marked `noindex` so Google does not list it. Share the link directly, for example in an Instagram story. To make it public later, add a link to it on the home page and delete the `noindex` line in `collagen.html`.
- `shop.html`: the skincare shop (unlisted, share the link). With no products added it shows clearly marked sample products and nothing is sent.

## Icons and share image

`favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `icon-512.png` and `og-image.png` are already in place. The share image is what shows when the link is sent on WhatsApp or posted on Instagram. In `index.html`, the `og:image` address currently points at the GitHub Pages URL; change it to her real domain once that is live.

## Selling products

The shop lives at `<site-address>/shop.html`. It is unlisted (`noindex`), so share the link directly. Until she adds real products it shows sample ones with a banner. Each product opens in a sheet with a small scripted guide called Fibro (keyword answers built from the product details she writes; it is not AI and gives no medical advice, and anything health-related is passed to Dr de Villiers). Products without a `link` use an Enquire list that is emailed to her through the same Web3Forms key.

Open `products.js` and follow the comment at the top: copy one block per product (name, category, price, size, description, how to use, good for, pairs, optional photo and Stripe Payment Link). A Shop link then appears in the main menu automatically; with an empty list the menu has no Shop link. Stripe Payment Links give Apple Pay and Google Pay with no extra work. Only list skincare and cosmetics; prescription-only medicines (including anti-wrinkle injectables) cannot be advertised or sold online in Ireland.
