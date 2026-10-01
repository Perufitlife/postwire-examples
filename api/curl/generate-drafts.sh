#!/usr/bin/env bash
# Turn one idea into a separate draft per network. Nothing is published.
#
#   export POSTWIRE_API_KEY=pw_live_...
#   ./generate-drafts.sh
#
# Returns {"drafts": {"tiktok": {"text": ...}, "youtube": {"text": ..., "title": ..., "tags": [...]}, ...}}.
# Send `drafts` back to /api/post as `per_platform` to publish exactly what was written (see ../node/generate.mjs).
# Takes 10-30 seconds. The free plan allows 15 drafts calls a day.
# Docs: https://postwire.io/guides/different-caption-for-each-social-network/
set -euo pipefail
: "${POSTWIRE_API_KEY:?set POSTWIRE_API_KEY}"

curl -sS -X POST https://postwire.io/api/generate \
  -H "Authorization: Bearer $POSTWIRE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A 30-second video showing how we cut our weekly report from 2 hours to 10 minutes with one spreadsheet formula",
    "platforms": ["tiktok", "instagram", "youtube"]
  }'
echo
