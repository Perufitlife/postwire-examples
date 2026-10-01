# Make.com: post a video to TikTok (and Reels and Shorts) with the HTTP module

Make's own TikTok app lists campaign and ads modules plus a generic API call, but no module that publishes a
video (checked on apps.make.com, Oct 1, 2026). Calling TikTok's API yourself needs a TikTok developer app that
has passed TikTok's audit; until then TikTok only allows private posts. The route that works today is Make's
**HTTP → Make a request** module calling PostWire, whose TikTok app passed the Direct Post audit — one request,
and the same request can also post to Instagram Reels and YouTube Shorts.

PostWire's own Make app was submitted to Make's review on Sept 8, 2026 and is not listed yet. Until it is,
the HTTP module does the same job.

## Before you start

1. Create a free account at [postwire.io/dashboard.html](https://postwire.io/dashboard.html) (1 brand,
   30 posts a month, no card). Each network a post goes to counts as one post.
2. **Accounts → Connect → Continue to TikTok** (and Instagram, YouTube if you want them). Instagram needs a
   Business or Creator account.
3. **API & MCP → Copy key**. It starts with `pw_live_`.

## The scenario

```
[ Google Drive / Dropbox / your video tool ]  →  [ HTTP: Make a request → postwire.io/api/post ]
                                                   (optional, before it: HTTP → postwire.io/api/generate)
```

### Module: HTTP → Make a request

| Field | Value |
|---|---|
| URL | `https://postwire.io/api/post` |
| Method | `POST` |
| Headers | `Authorization` = `Bearer pw_live_your_key` |
| Body type | `Raw` |
| Content type | `JSON (application/json)` |
| Request content | [`publish-body.json`](publish-body.json), with your module numbers |
| Parse response | Yes |

```json
{
  "platforms": ["tiktok", "instagram", "youtube"],
  "video_url": "{{1.video_url}}",
  "text": "{{1.caption}}",
  "title": "{{1.title}}",
  "privacy": "public",
  "idempotency_key": "{{1.id}}"
}
```

- `video_url` must be a **public link straight to the file** (up to 1 GB). A Google Drive or Dropbox share link
  opens a web page, not the file: use the storage module's direct download link, or upload the file to PostWire
  first (`POST /api/media/upload-url`, see [`../api`](../api)).
- Leave out `"privacy": "public"` and the TikTok post is **private** (only you can see it). That is TikTok's rule
  for API posts without an explicit choice. YouTube also defaults to private. Instagram has no private mode.
- `title` is used by YouTube only.
- `idempotency_key`: if Make retries a run, the same key is refused for 24 hours, so nothing is
  posted twice. Without a key, an identical payload is still refused for 2 minutes.

### Optional: a different caption per network

Add another **HTTP → Make a request** before it:

| Field | Value |
|---|---|
| URL | `https://postwire.io/api/generate` |
| Method | `POST`, same `Authorization` header, Raw JSON |
| Request content | [`generate-body.json`](generate-body.json) |

```json
{
  "prompt": "{{1.description}}",
  "platforms": ["tiktok", "instagram", "youtube"],
  "media_url": "{{1.video_url}}"
}
```

It answers `{"drafts": {"tiktok": {"text": …}, "instagram": {"text": …}, "youtube": {"text": …, "title": …, "tags": […]}}}`
(10–30 seconds, nothing published). In the publish module replace `text` and `title` with
`"per_platform": {{2.data.drafts}}` — map the whole `drafts` object. The free plan allows 15 of these a day.

### Reading the result

The publish response has `posted` (how many networks went out) and `results`, one per network, each with
`ok`, `id`, and on failure `code`, `error` and a `fix` sentence. A network you did not connect comes back as
`ok: false, code: "not_connected"` while the others still publish. TikTok and YouTube keep processing for a
moment after upload: `GET https://postwire.io/api/post/status?platform=tiktok&id=<id>` says when it is live.

To publish later, POST the same body plus `"run_at": "2026-10-09T09:00:00-05:00"` to
`https://postwire.io/api/schedule` instead.

What we tested: the request bodies on this page were sent to the live API on Oct 1, 2026 with a test account
(no networks connected, so nothing was published). We have not exported a Make blueprint; build the module by hand
with the table above.

Full guide: [How to post a video to TikTok from Make.com](https://postwire.io/make/post-video-to-tiktok/)

---
Made by the PostWire team.
