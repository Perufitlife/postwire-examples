# Turn one video into native TikTok, Instagram and YouTube posts with PostWire

> **Runs on:** n8n Cloud and self-hosted (plain HTTP Request nodes, no community node).
> **Also on n8n.io:** https://n8n.io/workflows/18576
> **Step-by-step guide:** [n8n: post to TikTok, Instagram and YouTube](https://postwire.io/n8n/post-to-tiktok-instagram-youtube/)
> **Import:** n8n → Workflows → Import from File → `workflow.json` (or paste its contents onto the canvas).

For creators, solo founders and small agencies who publish the same video to several networks and are tired of rewriting the caption three times.

## How it works
1. **Your idea, video and platforms** holds the idea, a public MP4 link, the networks and a brand voice. It is the only node you edit.
2. **Write a native caption per platform** calls `POST /api/generate`: a TikTok caption, an Instagram caption, and a YouTube title, description and tags. Nothing is published.
3. **Publish to every connected account** calls `POST /api/post` with those drafts as `per_platform`, and returns one result per network with its link or the exact error.

TikTok is sent as `SELF_ONLY` (private) so the first test run stays private — change `privacy_level` to `PUBLIC_TO_EVERYONE` in the last node when you are happy. Instagram has no private mode.

## Setup
1. Create a free account at https://postwire.io/dashboard.html, connect TikTok, Instagram and YouTube under **Accounts**, then copy your API key (**API & MCP → Copy key**).
2. In n8n create a **Header Auth** credential: name `Authorization`, value `Bearer pw_live_your_key`, and select it on both HTTP Request nodes.
3. Put your own idea and video link in **Your idea, video and platforms**. The link must point at the file itself (a Google Drive share page will not work).

## Requirements
- A PostWire account — the free plan covers one brand with all its networks and 30 posts a month, no card
- A publicly reachable MP4. TikTok, Instagram and YouTube refuse text-only posts.

## Customization
- Swap the manual trigger for a Schedule, RSS or Google Sheets trigger.
- To publish later, call `POST /api/schedule` with a `run_at` timestamp instead of `/api/post`.

---
Made by the PostWire team. PostWire is a paid product with a free plan; this template is MIT-licensed like the rest of the repo.
