# Dr Chrisna de Villiers - Aesthetic Medicine website

A fast, single-page static site (plain HTML/CSS/JS, no build step), hosted free on GitHub Pages.

Patients fill in an enquiry form, it is emailed to Dr de Villiers via Web3Forms, and she confirms by reply and books them into Clever Clinic as usual. There is also a WhatsApp button and a Call button.

Files: `index.html` (the page), `style.css` (the design), `privacy.html` (draft policy), `book.html` (short link that jumps to the booking form), `images/` (photos).

## 1. Fill in the details (index.html)

Open `index.html`, scroll to the `CONFIG` block near the bottom, and edit:

| Setting | What it is |
|---|---|
| `email` | Email shown on the site |
| `phone` | Phone shown and used for the Call button |
| `whatsapp` | Digits only with country code, e.g. `353871234567` (no `+`, no spaces) |
| `location` | Already set to `Ballincollig, Co. Cork` |
| `instagram` | Her Instagram handle (optional). Leave empty and the footer link stays hidden |
| `web3formsKey` | Access key from Web3Forms (step 2) |

Until a real key is added the form runs in demo mode and shows a "not connected yet" message, so you can safely show it to her.

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

Name them exactly like that. They replace the placeholders automatically. Use her own photos, ideally under 500 KB each. Good photography is the single biggest thing that makes the site feel premium.

## 6. Instagram link in bio

Use `https://<site-address>/book.html` as her bio link. It jumps straight to the booking form.

## 7. Before going live

- [ ] Add the two photos.
- [ ] Confirm the credentials and experience claims are accurate.
- [ ] Review `privacy.html` (draft template; remove the draft notice when done).
- [ ] Set up the professional email on her domain.
- [ ] Check Irish Medical Council guidance on advertising. Testimonials were deliberately left out because of the Council's restrictions.

## Later: selling products

Easiest route is Stripe Payment Links or a Shopify Buy Button, linked from a Shop section. No rebuild needed.
