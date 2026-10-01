#!/usr/bin/env bash
# Upload a video from your disk (no hosting of your own) and print the media_url to publish with.
#
#   export POSTWIRE_API_KEY=pw_live_...
#   ./upload-local-video.sh ./clip.mp4
#
# Files up to 50 MB go in one PUT, as here. Bigger files (up to 1 GB) are uploaded in parts:
# use ../node/upload.mjs or ../python/upload.py, which handle both cases.
# The uploaded file is kept for 30 days.
set -euo pipefail
: "${POSTWIRE_API_KEY:?set POSTWIRE_API_KEY}"
FILE="${1:?usage: $0 ./clip.mp4}"
SIZE=$(wc -c < "$FILE" | tr -d ' ')
TYPE="video/mp4"   # or video/quicktime, video/webm, image/jpeg, image/png, image/webp, image/gif

# 1) Ask for a signed upload slot.
SLOT=$(curl -sS -X POST https://postwire.io/api/media/upload-url \
  -H "Authorization: Bearer $POSTWIRE_API_KEY" -H "Content-Type: application/json" \
  -d "{\"content_type\":\"$TYPE\",\"size_bytes\":$SIZE}")
field() { printf '%s' "$SLOT" | grep -o "\"$1\":\"[^\"]*\"" | head -1 | cut -d'"' -f4 || true; }
UPLOAD_URL=$(field upload_url)
UPLOAD_PATH=$(field path)
[ -n "$UPLOAD_URL" ] || { echo "no upload slot: $SLOT" >&2; exit 1; }

# 2) PUT the raw bytes. They go straight to storage, not through the API.
curl -sS -o /dev/null -w "upload: HTTP %{http_code}\n" -X PUT "$UPLOAD_URL" \
  -H "Content-Type: $TYPE" --data-binary @"$FILE"

# 3) Confirm it landed and get the media_url.
curl -sS -G https://postwire.io/api/media/finalize \
  -H "Authorization: Bearer $POSTWIRE_API_KEY" --data-urlencode "path=$UPLOAD_PATH"
echo
# -> {"ok":true,"path":"...","bytes":11090,"content_type":"video/mp4","media_url":"https://...","expires_at":"..."}
# Pass media_url as video_url to publish-video.sh (VIDEO_URL=...). The link itself expires after 24 h
# (expires_at); PostWire renews its own expired links when you publish with them, and keeps the file 30 days.
