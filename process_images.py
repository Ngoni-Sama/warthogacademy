"""
Warthog Academy — image processor (reproducible asset build).

Regenerates the web-ready images in assets/img/ from the originals in
assets/img/raw/. Run this again whenever you replace a source image.

    pip install pillow
    python process_images.py

Source files expected in assets/img/raw/:
    logo.png              transparent crest (already background-removed)
    students_reading.jpg  students in the hallway with books
    students_learning.jpg students studying at a desk

If your crest still has a white background, install rembg and it will be
removed automatically:  pip install rembg onnxruntime
"""
import os
from PIL import Image

RAW = os.path.join("assets", "img", "raw")
OUT = os.path.join("assets", "img")
os.makedirs(OUT, exist_ok=True)


def save_jpg(im, name, w, q=86):
    im = im.convert("RGB")
    h = round(im.height * w / im.width)
    im.resize((w, h), Image.LANCZOS).save(
        os.path.join(OUT, name), "JPEG", quality=q, optimize=True, progressive=True
    )
    print(f"[ok] {name} ({w}px)")


def build_logo():
    src_png = os.path.join(RAW, "logo.png")
    src_jpg = os.path.join(RAW, "logo.jpg")
    if os.path.exists(src_png):
        im = Image.open(src_png).convert("RGBA")
    elif os.path.exists(src_jpg):
        im = Image.open(src_jpg)
        try:
            from rembg import remove
            import io
            buf = io.BytesIO(); im.save(buf, "PNG")
            im = Image.open(io.BytesIO(remove(buf.getvalue()))).convert("RGBA")
            print("[ok] removed logo background with rembg")
        except Exception as exc:
            print(f"[warn] rembg unavailable ({exc}); using logo as-is")
            im = im.convert("RGBA")
    else:
        print("[skip] no logo in raw/ — add logo.png (transparent) or logo.jpg")
        return
    im.resize((512, 512), Image.LANCZOS).save(os.path.join(OUT, "logo.png"))
    im.resize((512, 512), Image.LANCZOS).save(os.path.join(OUT, "gallery-4.png"))
    print("[ok] logo.png + gallery-4.png")


def build_photos():
    reading = os.path.join(RAW, "students_reading.jpg")
    learning = os.path.join(RAW, "students_learning.jpg")
    if os.path.exists(reading):
        im = Image.open(reading); w, h = im.size
        cw = int(h * 4 / 5); left = (w - cw) // 2
        save_jpg(im.crop((left, 0, left + cw, h)), "hero-student.jpg", 720)  # hero portrait
        save_jpg(im, "gallery-1.jpg", 1000)
        save_jpg(im.crop((int(w * 0.5), int(h * 0.06), int(w * 0.98), h)), "gallery-3.jpg", 700)
    else:
        print("[skip] students_reading.jpg not found")
    if os.path.exists(learning):
        save_jpg(Image.open(learning), "gallery-2.jpg", 1000)
    else:
        print("[skip] students_learning.jpg not found")


if __name__ == "__main__":
    build_logo()
    build_photos()
    print("Done. Refresh the site to see the images.")
