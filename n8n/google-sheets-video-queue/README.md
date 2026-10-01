# Publish videos from Google Sheets to TikTok, Reels and Shorts with Gemini and PostWire

> **Runs on:** n8n Cloud and self-hosted (plain HTTP Request nodes, no community node).
> **Step-by-step guide:** [n8n: post to TikTok, Instagram and YouTube](https://postwire.io/n8n/post-to-tiktok-instagram-youtube/)
> **Import:** n8n → Workflows → Import from File → `workflow.json` (or paste its contents onto the canvas).

![Workflow](https://postwire.io/n8n/templates/30-google-sheets-video-queue.png)

Post short videos from a Google Sheets queue to TikTok, Instagram Reels and YouTube Shorts, with a caption Gemini writes for each network. A bulk upload queue for creators and agencies who batch-produce videos.

## How it works
1. **At each posting slot** (10:00 and 18:00) takes the first row marked ready that has a video link.
2. **Mark the row as publishing** claims it, so it is never picked twice.
3. **Write captions with Gemini** writes a TikTok hook, an Instagram caption, a YouTube title and description, and LinkedIn and Facebook posts from the row's caption.
4. **Publish with PostWire** checks the video link first (a Drive or Dropbox share link opens a web page, not the file) and publishes each network with its own text. The row is the idempotency key: a retry never posts twice.
5. When every network published, the row gets the post links; otherwise the row gets the exact fix and **Gmail** emails you the report.

## Setup
1. Create a free account at postwire.io, connect your networks and copy your API key. In n8n add a **Header Auth** credential (name `Authorization`, value `Bearer pw_live_…`) and select it in **Publish with PostWire**.
2. Create a sheet with the columns video_url, caption, title, networks, status, posted_at, links and note. Mark rows ready to queue them; networks defaults to tiktok, instagram, youtube.
3. Connect Google Sheets and pick the same sheet in the four Sheets nodes.
4. Add a Google Gemini credential (a free API key from Google AI Studio), connect Gmail and put your address in **Email me the fix**.

## Requirements
- A PostWire account — the free plan covers one brand with all its networks and 30 posts a month, no card
- Your PostWire API key in an n8n **Header Auth** credential (name `Authorization`, value `Bearer pw_live_…`)
- A Google account with Google Sheets
- A Google Gemini API key from Google AI Studio
- A Gmail account

## Customization
- Change the slots in the trigger, the tone in the Gemini system message, or add linkedin and facebook in the networks column.

## Additional info
PostWire is called with the standard HTTP Request node, so this template runs on n8n Cloud and self-hosted n8n alike. PostWire writes a different post for each network from one idea and holds the TikTok, Meta and YouTube publishing approvals, so connecting an account is one OAuth click.

Use it as a multi-platform video scheduler for Shorts, Reels and TikTok: each row is one upload, Gemini adapts the caption to every network, and the sheet stays the single source of truth for what was posted, where, and what needs fixing.

---
Made by the PostWire team. PostWire is a paid product with a free plan; this template is MIT-licensed like the rest of the repo.
