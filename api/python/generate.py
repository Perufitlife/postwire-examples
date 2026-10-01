"""One idea in, a separate draft per network out — then (with --publish) publish exactly those drafts.

    export POSTWIRE_API_KEY=pw_live_...
    python generate.py "We cut our weekly report from 2 hours to 10 minutes with one formula"
    VIDEO_URL=https://.../clip.mp4 PRIVACY=public python generate.py "..." --publish

/api/generate publishes nothing. Its `drafts` go straight back to /api/post as `per_platform`.
Takes 10-30 seconds. Free plan: 15 generations a day.
Docs: https://postwire.io/guides/different-caption-for-each-social-network/
"""
import os
import sys

from postwire import pw, summary

args = [a for a in sys.argv[1:] if not a.startswith("--")]
if not args:
    sys.exit('usage: python generate.py "<idea>" [--publish]')
platforms = [p.strip() for p in os.environ.get("PLATFORMS", "tiktok,instagram,youtube").split(",")]
video_url = os.environ.get("VIDEO_URL")

status, gen = pw("POST", "/api/generate",
                 {"prompt": args[0], "platforms": platforms, **({"media_url": video_url} if video_url else {})})
if status != 200:
    sys.exit(f"generate: HTTP {status} {gen}")
for p, d in gen["drafts"].items():
    print(f"\n-- {p}" + (f"  [title] {d['title']}" if d.get("title") else ""))
    print(d["text"])
    if d.get("tags"):
        print("[tags] " + ", ".join(d["tags"]))
if gen.get("missing"):
    print(f"\n(no draft came back for: {', '.join(gen['missing'])} - retry those)")

if "--publish" in sys.argv:
    if not video_url and any(p in ("tiktok", "instagram", "youtube") for p in platforms):
        sys.exit("\nTikTok, Instagram and YouTube need a video or photo: set VIDEO_URL.")
    status, res = pw("POST", "/api/post", {
        "platforms": platforms, "per_platform": gen["drafts"],
        **({"video_url": video_url} if video_url else {}),
        "privacy": os.environ.get("PRIVACY", "private"),
    })
    print(f"\npublish: HTTP {status}\n{summary(res)}")
