# postwire-examples

Working examples for posting one video or post to **TikTok, Instagram Reels, YouTube Shorts, LinkedIn, Facebook
Pages, Bluesky, Mastodon, Telegram and Discord** — from **n8n**, **Make.com**, **Claude / any MCP client** and a
plain **REST API** (curl, Node, Python).

They all use [PostWire](https://postwire.io), a posting API with a free plan. These examples are written and maintained by the PostWire team
(Renzo, the founder). PostWire's TikTok, Meta and Google approvals cover the publishing, so none of this needs
your own TikTok developer app, Meta App Review or Google verification.

Not available through PostWire: X/Twitter, Threads, Reddit and Pinterest.

## Examples

| I want to… | Example | Runs on | Guide |
|---|---|---|---|
| Post one video to TikTok, Reels and Shorts with a REST call | [api/](api/) — `publish` in curl, Node, Python | anywhere | [Same video to TikTok, Reels and Shorts](https://postwire.io/guides/post-video-to-tiktok-reels-shorts/) |
| Upload a local video (up to 1 GB) instead of hosting it | [api/ upload](api/) | anywhere | [TikTok Direct Post without your own audit](https://postwire.io/guides/tiktok-direct-post-api-without-audit/) |
| Schedule posts, list and cancel the queue | [api/ schedule](api/) | anywhere | [Schedule social posts with Claude (REST section)](https://postwire.io/claude/schedule-social-media-posts/) |
| Write a different caption per network from one idea | [api/ generate](api/) | anywhere | [A different caption for each network](https://postwire.io/guides/different-caption-for-each-social-network/) |
| n8n: one video → TikTok, Instagram, YouTube | [n8n/video-to-tiktok-instagram-youtube](n8n/video-to-tiktok-instagram-youtube/) | n8n Cloud + self-hosted | [n8n: post to TikTok, Instagram and YouTube](https://postwire.io/n8n/post-to-tiktok-instagram-youtube/) |
| n8n: Google Sheets queue of videos, Gemini captions | [n8n/google-sheets-video-queue](n8n/google-sheets-video-queue/) | n8n Cloud + self-hosted | same |
| n8n: AI video with Veo 3.1 → TikTok, Reels, Shorts | [n8n/veo-ai-video-to-tiktok-reels-shorts](n8n/veo-ai-video-to-tiktok-reels-shorts/) | n8n Cloud + self-hosted | same |
| n8n: OneDrive video → LinkedIn, Shorts, Reels | [n8n/onedrive-video-to-linkedin-shorts-reels](n8n/onedrive-video-to-linkedin-shorts-reels/) | n8n Cloud + self-hosted | [How to post to Instagram from n8n](https://postwire.io/n8n/post-to-instagram/) |
| n8n: Google Drive folder → TikTok, Reels, Shorts | [n8n/google-drive-video-to-tiktok-reels-shorts](n8n/google-drive-video-to-tiktok-reels-shorts/) | self-hosted (community node) | [n8n: post to TikTok, Instagram and YouTube](https://postwire.io/n8n/post-to-tiktok-instagram-youtube/) |
| n8n: chat with an AI agent that drafts and publishes | [n8n/ai-agent-social-media-manager](n8n/ai-agent-social-media-manager/) | self-hosted (community node) | [AI agent that posts to social media](https://postwire.io/guides/ai-agent-post-to-social-media/) |
| n8n: content calendar in Google Sheets → scheduled posts | [n8n/google-sheets-content-calendar](n8n/google-sheets-content-calendar/) | self-hosted (community node) | [n8n social media automation](https://postwire.io/n8n-social-media-automation/) |
| n8n: one webhook URL that publishes everywhere | [n8n/webhook-publish-api](n8n/webhook-publish-api/) | self-hosted (community node) | [Posting API with a free tier](https://postwire.io/guides/free-social-media-posting-api/) |
| Claude, Claude Code, Cursor, VS Code, Windsurf (MCP) | [mcp/](mcp/) | hosted or `npx` | [Schedule posts with Claude](https://postwire.io/claude/schedule-social-media-posts/) · [MCP: video to TikTok and Shorts](https://postwire.io/mcp/upload-video-to-tiktok-youtube-shorts/) |
| Make.com: post a video to TikTok | [make/](make/) | Make HTTP module | [Make.com: post a video to TikTok](https://postwire.io/make/post-video-to-tiktok/) |

## Start in 3 steps

1. Create a free account at [postwire.io/dashboard.html](https://postwire.io/dashboard.html) — 1 brand, 30 posts a
   month, 15 AI drafts a day, no card. (One post to 3 networks counts as 3.)
2. **Accounts → Connect** each network. You sign in on the network itself; Instagram needs a Business or Creator account.
3. **API & MCP → Copy key**, then `export POSTWIRE_API_KEY=pw_live_...` and run any example.

## Limits worth knowing before you build

- **TikTok privacy**: an API post with no privacy value is published private (`SELF_ONLY`). Send `"privacy": "public"`.
  YouTube uploads also default to private. Instagram has no private mode.
- **Video networks need media**: TikTok, Instagram and YouTube never take a text-only post. A Google Drive or
  Dropbox share link is a web page, not the file — use a direct link or upload the file (see [api/](api/)).
- **n8n Cloud**: the `n8n-nodes-postwire` community node is not verified by n8n yet, so on n8n Cloud use the
  templates marked "n8n Cloud + self-hosted" (they use the core HTTP Request node).
- **Make.com**: PostWire's Make app is still in Make's review; [make/](make/) uses the HTTP module.
- **Fewer networks than some alternatives**: if you need X, Threads, Pinterest or Reddit, PostWire is not the tool.

## Related repos

- [Perufitlife/n8n-nodes-postwire](https://github.com/Perufitlife/n8n-nodes-postwire) — the n8n community node
- [Perufitlife/postwire-mcp](https://github.com/Perufitlife/postwire-mcp) — the local MCP server (`npx -y postwire-mcp`)
- API spec: [postwire.io/openapi.json](https://postwire.io/openapi.json) · for AI assistants: [postwire.io/llms.txt](https://postwire.io/llms.txt)

## License

MIT. Copy anything. Issues and fixes welcome — open an issue if an example stops matching the API.
