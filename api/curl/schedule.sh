#!/usr/bin/env bash
# Queue a post for later. PostWire's servers publish it at run_at, so nothing has to stay running on your side.
#
#   export POSTWIRE_API_KEY=pw_live_...
#   RUN_AT=2026-10-09T09:00:00-05:00 ./schedule.sh
#
# run_at is ISO 8601 with an offset, up to 365 days ahead. The connections and the media are checked NOW:
# a network you have not connected is refused here (400 not_connected), not silently at publish time.
# Docs: https://postwire.io/claude/schedule-social-media-posts/
set -euo pipefail
: "${POSTWIRE_API_KEY:?set POSTWIRE_API_KEY}"
RUN_AT="${RUN_AT:?set RUN_AT, e.g. 2026-10-09T09:00:00-05:00}"

curl -sS -X POST https://postwire.io/api/schedule \
  -H "Authorization: Bearer $POSTWIRE_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"run_at\":\"$RUN_AT\",\"platforms\":[\"linkedin\",\"bluesky\"],\"text\":\"Launch day: scheduling is live.\",\"label\":\"Launch\"}"
echo

# List what is queued:
curl -sS https://postwire.io/api/schedule -H "Authorization: Bearer $POSTWIRE_API_KEY"
echo
# Cancel one before it goes out:  curl -X DELETE https://postwire.io/api/schedule/<id> -H "Authorization: Bearer $POSTWIRE_API_KEY"
