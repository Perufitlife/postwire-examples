"""Queue a post for later, list the queue, and (optionally) cancel it.

    export POSTWIRE_API_KEY=pw_live_...
    RUN_AT=2026-10-09T09:00:00-05:00 python schedule.py
    RUN_AT=... CANCEL=1 python schedule.py      # schedules, then cancels the same post

run_at: ISO 8601 with an offset, up to 365 days ahead. PostWire's servers publish it when due.
Connections and media are checked at scheduling time, so a problem shows up now (400 + code).
Docs: https://postwire.io/claude/schedule-social-media-posts/
"""
import json
import os
import sys

from postwire import pw

run_at = os.environ.get("RUN_AT") or sys.exit("Set RUN_AT, e.g. 2026-10-09T09:00:00-05:00")
status, body = pw("POST", "/api/schedule", {
    "run_at": run_at,
    "platforms": [p.strip() for p in os.environ.get("PLATFORMS", "linkedin,bluesky").split(",")],
    "text": "Launch day: scheduling is live.",
    "label": "Launch",
    # A video post is scheduled the same way: add video_url (and title for YouTube).
})
print(f"schedule: HTTP {status}", json.dumps(body, indent=2))

_, queue = pw("GET", "/api/schedule")
print(f"queue: {len(queue.get('scheduled', []))} post(s)")

if os.environ.get("CANCEL") and body.get("scheduled", {}).get("id"):
    status, res = pw("DELETE", f"/api/schedule/{body['scheduled']['id']}")
    print(f"cancel: HTTP {status}", res)
