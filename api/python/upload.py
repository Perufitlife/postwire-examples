"""Upload a local photo or video (up to 1 GB) and print the media_url to publish with.

    export POSTWIRE_API_KEY=pw_live_...
    python upload.py ./clip.mp4
    VIDEO_URL=$(python upload.py ./clip.mp4 --quiet) python publish.py

Up to 50 MB: one PUT. Over 50 MB: the API answers with parts, each with its own upload_url and byte
range [start, end); every part is PUT, then finalize joins them into one media_url. Kept 30 days.
"""
import os
import sys
from urllib.parse import quote

import requests

from postwire import pw

TYPES = {".mp4": "video/mp4", ".mov": "video/quicktime", ".webm": "video/webm", ".jpg": "image/jpeg",
         ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".gif": "image/gif"}

args = [a for a in sys.argv[1:] if not a.startswith("--")]
quiet = "--quiet" in sys.argv
if not args:
    sys.exit("usage: python upload.py <file> [--quiet]")
path = args[0]
content_type = TYPES.get(os.path.splitext(path)[1].lower()) or sys.exit(f"Unsupported file type: {path}")
size = os.path.getsize(path)
log = (lambda *a: None) if quiet else (lambda *a: print(*a, file=sys.stderr))

# 1) Ask for a slot. Over 50 MB, ask for a multipart one straight away.
big = size > 50 * 1024 * 1024
status, slot = pw("POST", "/api/media/upload-url",
                  {"content_type": content_type, "size_bytes": size, **({"multipart": True} if big else {})})
if status != 200:
    sys.exit(f"{status} {slot}")


def put(url, start, end):
    """PUT bytes [start, end) straight to storage (they never pass through the API)."""
    with open(path, "rb") as f:
        f.seek(start)
        data = f.read(end - start)
    r = requests.put(url, data=data, headers={"Content-Type": content_type}, timeout=600)
    r.raise_for_status()


# 2) Upload.
if slot.get("multipart"):
    for p in slot["parts"]:
        log(f"part {p['part']}/{len(slot['parts'])}...")
        put(p["upload_url"], p["start"], p["end"])
else:
    put(slot["upload_url"], 0, size)

# 3) Finalize: confirms the file landed and returns the media_url.
status, fin = pw("GET", f"/api/media/finalize?path={quote(slot['path'], safe='')}")
if status != 200:
    sys.exit(f"{status} {fin}")
log(f"uploaded {fin['bytes']} bytes; link valid until {fin['expires_at']} (renewed automatically when you publish with it), file kept 30 days")
print(fin["media_url"])
