#!/usr/bin/env bash
# Publish one video to TikTok, Instagram (as a Reel) and YouTube (as a Short) in one call.
#
#   export POSTWIRE_API_KEY=pw_live_...
#   export VIDEO_URL=https://example.com/clip.mp4   # a public link straight to the file (or a media_url from upload-local-video.sh)
#   ./publish-video.sh
#
# PRIVACY applies to TikTok and YouTube only. It defaults to "private" here so a first test is not public;
# set PRIVACY=public when you are ready. Instagram has no private mode: the Reel is public as soon as it posts.
# Docs: https://postwire.io/n8n/post-to-tiktok-instagram-youtube/
set -euo pipefail
: "${POSTWIRE_API_KEY:?set POSTWIRE_API_KEY}"
: "${VIDEO_URL:?set VIDEO_URL to a public .mp4 link}"
PRIVACY="${PRIVACY:-private}"

curl -sS -X POST https://postwire.io/api/post \
  -H "Authorization: Bearer $POSTWIRE_API_KEY" \
  -H "Content-Type: application/json" \
  -d @- <<JSON
{
  "platforms": ["tiktok", "instagram", "youtube"],
  "video_url": "$VIDEO_URL",
  "title": "How we cut our weekly report from 2 hours to 10 minutes",
  "text": "One spreadsheet formula replaced 2 hours of copy-paste. #spreadsheets #productivity",
  "privacy": "$PRIVACY",
  "idempotency_key": "demo-video-001"
}
JSON
echo
# The answer has one entry per network: {"posted": 3, "results": [{"ok": true, "platform": "tiktok", "id": "...", ...}, ...]}.
# A network you have not connected comes back as ok:false with code "not_connected" — the others still go out.
