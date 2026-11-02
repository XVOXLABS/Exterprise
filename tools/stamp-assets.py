#!/usr/bin/env python3
"""Stamp style.css / site.js links in every page with a content hash (style.css?v=1a2b3c4d).

GitHub Pages lets browsers cache files for ~10 minutes. Without a version on the link, a
visitor clicking through sub-pages right after a deploy can get new HTML with an old cached
stylesheet or script, and the page looks broken. Run this before every commit that touches
style.css or site.js; the hash only changes when the file's content does.

    python3 tools/stamp-assets.py
"""
import hashlib, pathlib, re

root = pathlib.Path(__file__).resolve().parent.parent
assets = {name: hashlib.sha1((root / name).read_bytes()).hexdigest()[:8] for name in ("style.css", "site.js")}
changed = 0
for page in sorted(root.glob("*.html")):
    html = page.read_text(encoding="utf-8")
    new = html
    for name, ver in assets.items():
        new = re.sub(r'((?:href|src)=")' + re.escape(name) + r'(?:\?v=[0-9a-f]+)?(")', r'\g<1>' + f"{name}?v={ver}" + r"\2", new)
    if new != html:
        page.write_text(new, encoding="utf-8")
        changed += 1
print(f"stamped {changed} page(s): " + ", ".join(f"{k}?v={v}" for k, v in assets.items()))
