"""Publish one video to TikTok, Instagram (Reel) and YouTube (Short) in one call.

    export POSTWIRE_API_KEY=pw_live_...
    VIDEO_URL=https://example.com/clip.mp4 python publish.py
    VIDEO_URL=... PRIVACY=public PLATFORMS=tiktok,youtube python publish.py

VIDEO_URL must be a public link straight to the file, or the media_url printed by upload.py.
PRIVACY applies to TikTok and YouTube; it defaults to "private" so a first run is not public.
Instagram has no private mode.
Docs: https://postwire.io/n8n/post-to-tiktok-instagram-youtube/
"""
import os
import sys
import time

from postwire import pw, summary

video_url = os.environ.get("VIDEO_URL") or sys.exit("Set VIDEO_URL")
status, body = pw("POST", "/api/post", {
    "platforms": [p.strip() for p in os.environ.get("PLATFORMS", "tiktok,instagram,youtube").split(",")],
    "video_url": video_url,
    "title": "How we cut our weekly report from 2 hours to 10 minutes",  # YouTube title
    "text": "One spreadsheet formula replaced 2 hours of copy-paste. #spreadsheets #productivity",
    "privacy": os.environ.get("PRIVACY", "private"),
    # Same key on a retry = never published twice (kept 24 h). Use your row / file / job id.
    "idempotency_key": os.environ.get("IDEMPOTENCY_KEY", f"demo-{int(time.time())}"),
})
print(f"HTTP {status}")
print(summary(body))
