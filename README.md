# Warthog Academy — Website

A modern, single-page website for **Warthog Academy** — a Zimbabwean secondary school (boarding & day, Forms 1–4).

Plain HTML/CSS/JS (no build step) with a light, classic design — frosted-white cards, pill buttons, and the school palette (red / purple / gold) as accents. A tiny Express server (`server.js`) lets it run on Node.js hosting (cPanel Passenger) as well as any static host.

## Sections
Navbar · Hero · About Us · Vision / Mission / Values (DROAR) · Why Enroll With Us · Enrollment banner · Gallery · Contact + Social · Floating chat widget (FAQ bot + WhatsApp handoff).

## Run locally
```bash
npm install
npm start          # http://localhost:3000
# or, no Node:  python -m http.server 8000
```

## Deploy

### Option A — cPanel Node.js app (this server: canchemc@quokka)
The repo already contains `server.js`, `package.json` and `.cpanel.yml`.

1. **cPanel → Git™ Version Control → Create.**
   - Clone URL: `https://github.com/Ngoni-Sama/warthogacademy.git`
   - Repository Path: `warthogacademy`  → clones to `/home/canchemc/warthogacademy`
   - Branch: `main`
2. **cPanel → Setup Node.js App → Create Application:**

   | Field | Value |
   |-------|-------|
   | Node.js version | 18.x or 20.x (any 18+ LTS offered) |
   | Application mode | **Production** |
   | Application root | `warthogacademy` |
   | Application URL | your domain/subdomain (e.g. `warthogacademy.canchem.co.zw`) |
   | Application startup file | `server.js` |
   | Environment variables | **none required** (that's why the search shows "No result found") |

3. Click **Create**, then **Run NPM Install**, then **Start App**. Done.

**Updating after a `git push` (GitHub → server):**
- cPanel → **Git Version Control → Manage → Pull or Deploy HEAD Commit**, then in **Setup Node.js App** click **Restart**.
- Or over SSH — see below.

### Option B — GitHub Pages (static mirror)
Settings → Pages → Source `main` / root → https://ngoni-sama.github.io/warthogacademy/

## Update over SSH
```bash
ssh canchemc@quokka                 # your cPanel SSH login
cd ~/warthogacademy
git pull origin main
npm install --production            # only needed if dependencies changed
mkdir -p tmp && touch tmp/restart.txt   # Passenger picks up the restart
```

## Images
Web-ready images live in `assets/img/`; originals are in `assets/img/raw/`. To regenerate after replacing a source:
```bash
pip install pillow          # add: rembg onnxruntime  (only if the crest needs bg removal)
python process_images.py
```

## Chat bot
The floating widget answers common questions (fees, enrollment, boarding, subjects, contact) and hands off to WhatsApp. To upgrade to a real AI bot (Cloudflare Workers AI, like the CanChem bot), set `BOT_ENDPOINT` in `script.js` to your Worker URL.

## Contact
- +263 772 620 044
- +263 772 620 045 (WhatsApp)
- +263 773 173 515
- thkamota@gmail.com
