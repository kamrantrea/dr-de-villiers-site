# Dr Chrisna de Villiers - Aesthetic Medicine website

A fast, single-page static site (plain HTML/CSS/JS, no build step). Hosted free on GitHub Pages.

Patients fill in an enquiry form, it is emailed to Dr de Villiers via Web3Forms, and she confirms by reply and books them into Clever Clinic as usual. There is also a WhatsApp button and a Call button.

## 1. Fill in the five details (index.html)

Open `index.html`, scroll to the `CONFIG` block near the bottom, and edit:

| Setting | What it is |
|---|---|
| `email` | Email shown on the site |
| `phone` | Phone shown and used for the Call button |
| `whatsapp` | Digits only with country code, e.g. `353871234567` (no `+`, no spaces) |
| `location` | Already set to `Ballincollig, Co. Cork` |
| `web3formsKey` | Access key from Web3Forms (step 2) |

Until a real key is added the form runs in demo mode and just shows a "not connected yet" message, so you can safely show it to her.

## 2. Make the form email her (5 minutes, free)

1. Go to https://web3forms.com and enter **her** email address.
2. They email her an access key. Paste it into `web3formsKey`.
3. Submit a test enquiry. It should arrive in her inbox.

Free plan limits apply, so check their pricing page if she expects very high volume.

## 3. Publish on GitHub Pages

```bash
cd dr-de-villiers-site
git init -b main
git add .
git commit -m "Initial site"
# create an empty repo on github.com first (private is fine), then:
git remote add origin git@github.com:<your-username>/<repo-name>.git
git push -u origin main
```

Then on GitHub: **Settings > Pages > Build and deployment > Deploy from a branch > `main` / root > Save.**
The site appears at `https://<your-username>.github.io/<repo-name>/` within a minute or two.

Note: GitHub Pages sites are public even when the repository is private, which is fine for a brochure site. Do not put anything secret in the code (the Web3Forms key is designed to be public).

## 4. Custom domain (her own .ie)

1. Buy the domain **in her name** (not yours).
2. In the repo, add a file named `CNAME` containing only the domain, e.g. `drchrisnadevilliers.ie`.
3. At the domain registrar, add DNS records:
   - `A` records for `@` to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` for `www` to `<your-username>.github.io`
4. In **Settings > Pages**, enter the custom domain and tick **Enforce HTTPS**.

Double-check these IPs against GitHub's current Pages docs when you do it.

## 5. Photos (drag and drop, no code)

On github.com open the repo, go to the `images` folder, click **Add file > Upload files**, and drop in:

- `hero.jpg` - portrait of Dr de Villiers for the top of the page (portrait orientation works best)
- `about.jpg` - second photo for the About section

Name them exactly like that. They appear on the site automatically within a minute or two and replace the placeholders. Photos should be hers (or ones she has the rights to use), ideally under 500 KB each.

## 6. Instagram link in bio

Use `https://<site-address>/book.html` as her Instagram bio link. It jumps straight to the booking form. Once the custom domain is set up it becomes `https://her-domain.ie/book.html`.

## 7. Before going live checklist

- [ ] Add the two photos (step 5).
- [ ] Confirm the "10+ years", "1000s patients" and credential claims are accurate.
- [ ] Review and finalise `privacy.html` (it is a draft template; delete the pink DRAFT box when done).
- [ ] Set up a professional email on her domain (Google Workspace or Microsoft 365).
- [ ] Add Instagram/Facebook links if she wants them (a footer social row was removed because the links were empty).
- [ ] Check Irish Medical Council guidance on advertising aesthetic treatments. The testimonials section from her draft was **removed** because of the Council's restrictions on patient testimonials in advertising. She should confirm before adding any back.

## What changed from her original draft

- Removed the preloader and custom cursor (slower, no benefit on mobile).
- Removed placeholder testimonials (see above).
- Replaced the non-working contact form with a real enquiry form plus WhatsApp and Call buttons.
- Fixed the broken Google Fonts link, the mobile and tablet menu, the hero stats box overlapping text on phones, the cramped form, an invalid CSS value, and the misspelt email address.
- Replaced all emoji with consistent line icons.
- Hamburger menu now starts at tablet width so the logo and links never collide.
- Added accessibility basics (focus outlines, form labels, reduced-motion support) and a privacy page.
