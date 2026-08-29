"""
Warthog Academy — image processor.

Turns the two original images into web-ready assets:
  - Crops the people from the enrollment flyer into hero + gallery photos.
  - Removes the background from the crest to produce a transparent logo.png.

Usage:
    pip install pillow rembg onnxruntime
    python process_images.py

Put source files here first:
    assets/img/raw/flyer.jpg   (the enrollment flyer)
    assets/img/raw/logo.jpg    (the crest)

Crop boxes are fractions of the flyer's width/height (left, top, right, bottom),
so they scale to any flyer resolution. Tweak them if your flyer layout differs.
"""
import os
from PIL import Image

RAW = os.path.join("assets", "img", "raw")
OUT = os.path.join("assets", "img")
os.makedirs(OUT, exist_ok=True)

# Fractional crop boxes (left, top, right, bottom) for the top flyer panel.
CROPS = {
    "hero-student.png": (0.02, 0.11, 0.26, 0.47),   # pointing student, left
    "gallery-1.png":    (0.35, 0.12, 0.62, 0.48),   # two students with books, centre
    "gallery-2.png":    (0.62, 0.10, 0.99, 0.50),   # students reading at desk, right
    "gallery-3.png":    (0.35, 0.12, 0.62, 0.48),   # reuse centre pair
}


def crop_flyer():
    src = os.path.join(RAW, "flyer.jpg")
    if not os.path.exists(src):
        print(f"[skip] {src} not found — add the flyer to crop people from it.")
        return
    im = Image.open(src).convert("RGB")
    w, h = im.size
    for name, (l, t, r, b) in CROPS.items():
        box = (int(l * w), int(t * h), int(r * w), int(b * h))
        im.crop(box).save(os.path.join(OUT, name))
        print(f"[ok] wrote {name} from {box}")


def process_logo():
    src = os.path.join(RAW, "logo.jpg")
    if not os.path.exists(src):
        print(f"[skip] {src} not found — add the crest to make a transparent logo.")
        return
    out = os.path.join(OUT, "logo.png")
    try:
        from rembg import remove  # noqa: WPS433
        with open(src, "rb") as f:
            data = remove(f.read())
        with open(out, "wb") as f:
            f.write(data)
        print(f"[ok] background removed -> {out}")
    except Exception as exc:  # rembg not installed / model download failed
        print(f"[warn] rembg unavailable ({exc}); copying logo without bg removal.")
        Image.open(src).convert("RGBA").save(out)
        # gallery crest tile
    try:
        Image.open(out).convert("RGBA").save(os.path.join(OUT, "gallery-4.png"))
    except Exception:
        pass


if __name__ == "__main__":
    crop_flyer()
    process_logo()
    print("Done. Refresh the site to see the images.")
