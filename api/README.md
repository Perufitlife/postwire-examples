# PostWire REST API examples: curl, Node and Python

Publish, schedule, upload a local video and generate per-network drafts. Every script here was run against
`https://postwire.io` on Oct 1, 2026 with a test account. The test account had no social networks connected, so
the publish calls returned `not_connected` for each network and nothing was posted anywhere. Uploads, drafts,
scheduling and cancelling ran through to the end.

```bash
export POSTWIRE_API_KEY=pw_live_...   # dashboard → API & MCP → Copy key (free plan, no card)
```

| Task | curl | Node 18+ (no deps) | Python 3 (`requests`) | Endpoint |
|---|---|---|---|---|
| Publish one video to TikTok, Instagram Reels and YouTube Shorts | [publish-video.sh](curl/publish-video.sh) | [publish.mjs](node/publish.mjs) | [publish.py](python/publish.py) | `POST /api/post` |
| Upload a video from your disk (up to 1 GB, multipart over 50 MB) | [upload-local-video.sh](curl/upload-local-video.sh) (≤ 50 MB) | [upload.mjs](node/upload.mjs) | [upload.py](python/upload.py) | `POST /api/media/upload-url` → `PUT` → `GET /api/media/finalize` |
| Schedule a post, list the queue, cancel | [schedule.sh](curl/schedule.sh) | [schedule.mjs](node/schedule.mjs) | [schedule.py](python/schedule.py) | `POST/GET /api/schedule`, `DELETE /api/schedule/{id}` |
| One idea → a draft per network (→ publish it) | [generate-drafts.sh](curl/generate-drafts.sh) | [generate.mjs](node/generate.mjs) | [generate.py](python/generate.py) | `POST /api/generate` (+ `/api/post` with `per_platform`) |

Typical chain:

```bash
cd node
VIDEO_URL=$(node upload.mjs ./clip.mp4 --quiet) PRIVACY=public node publish.mjs
```

## Things the API does that are worth knowing

- **Auth**: `Authorization: Bearer pw_live_…` (the `X-API-Key` header also works). Keep the key server-side.
- **Networks**: `tiktok`, `instagram`, `youtube`, `linkedin` (personal profiles), `facebook` (Pages), `bluesky`,
  `mastodon`, `telegram`, `discord`. X, Threads, Reddit and Pinterest are not available.
- **Connecting accounts** happens once, in the dashboard (**Accounts**), or for your own users with
  `POST /api/connect-link` (a one-hour hosted link). You don't need your own TikTok, Meta or Google developer app:
  PostWire's TikTok Direct Post audit, Meta App Review and Google `youtube.upload` verification cover it.
- **One result per network**: `/api/post` answers `200` with `posted` (how many went out) and `results[]`. A network
  that fails — not connected, video refused — is `ok: false` with `code`, `error` and a `fix` sentence; the others
  still publish. Check `posted`, not only the HTTP status.
- **Privacy**: TikTok posts without a `privacy` value are published **private** (`SELF_ONLY`), and YouTube uploads
  default to private. These scripts default to `private` so a first run is not public; send `"privacy": "public"`
  when you mean it. Instagram, LinkedIn and the rest have no private mode.
- **Video networks need media**: TikTok, Instagram and YouTube refuse text-only posts. Media URLs must point at the
  file itself (not a Google Drive share page). PostWire converts PNG/WebP/AVIF/still GIF to JPEG for Instagram and TikTok.
- **No double posts**: send `idempotency_key` and a retry with the same key is refused for 24 hours (`409 duplicate_post`).
  Without one, an identical payload is refused for 2 minutes. A request where nothing went out releases the lock.
- **Scheduling** checks connections and media at scheduling time, accepts `run_at` up to 365 days ahead, and up to
  500 queued posts. PostWire's servers publish them.
- **Processing**: TikTok and YouTube keep processing after the upload. `GET /api/post/status?platform=tiktok&id=<id>`
  reports when the post is live and returns its link.
- **Free plan limits** (from the code, Oct 1, 2026): 1 brand, 30 posts a month (one post to 3 networks counts as 3),
  15 AI draft generations a day. Starter is $9/month (3 brands, 300 posts), Pro $29 (10 brands, 2,000 posts).

Spec: [postwire.io/openapi.json](https://postwire.io/openapi.json) ·
Guides: [TikTok Direct Post without your own app audit](https://postwire.io/guides/tiktok-direct-post-api-without-audit/) ·
[Social media posting API with a free tier](https://postwire.io/guides/free-social-media-posting-api/) ·
[API reference](https://postwire.io/guides/postwire-api-reference/)
