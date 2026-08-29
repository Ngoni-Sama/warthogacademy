# Warthog Academy — Website

A modern, single-page static website for **Warthog Academy** (Ministry of Primary & Secondary Education, Zimbabwe). Boarding & day school, Forms 1–4.

Built with plain HTML/CSS/JS — no build step. Design uses **glassmorphism** cards, **pill buttons**, and the school palette (deep red, royal purple, gold).

## Sections
Navbar · Hero · About Us · Vision / Mission / Values (DROAR) · Why Enroll With Us · Enrollment banner · Gallery · Contact + Social · Footer.

## Run locally
Just open `index.html` in a browser, or serve it:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Deploy (GitHub Pages)
Repo Settings → Pages → Source: `main` / root. The site is fully static.

## Adding real photos
The site references images in `assets/img/`. Until they exist, styled placeholders show automatically. Add these files to replace them:

| File | Used for |
|------|----------|
| `logo.png` | School crest (navbar/footer/favicon) — ideally background-removed, transparent PNG |
| `hero-student.png` | Hero photo (a cropped student) |
| `gallery-1.png` … `gallery-4.png` | Gallery tiles |

### Auto-processing the flyer & logo
Drop the two original images into `assets/img/raw/` as:
- `assets/img/raw/flyer.jpg` (the enrollment flyer)
- `assets/img/raw/logo.jpg` (the crest)

Then run:

```bash
pip install pillow rembg onnxruntime
python process_images.py
```

This crops the people from the flyer into gallery/hero images and removes the background from the crest to produce a clean transparent `logo.png`. Adjust the crop boxes near the top of `process_images.py` if the flyer layout differs.

## Content source
All text (name, tagline, features, contacts, motto) was taken from the official Warthog Academy enrollment flyer. Vision & Mission text is a first draft — edit freely in `index.html`.

## Contact
- +263 772 620 044
- +263 772 620 045 (WhatsApp)
- +263 773 173 515
- thkamota@gmail.com
