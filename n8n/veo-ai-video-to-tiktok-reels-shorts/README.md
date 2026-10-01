# Create Veo 3.1 videos with Gemini and post to TikTok, Reels and Shorts with PostWire

> **Runs on:** n8n Cloud and self-hosted (plain HTTP Request nodes, no community node).
> **Step-by-step guide:** [n8n: post to TikTok, Instagram and YouTube](https://postwire.io/n8n/post-to-tiktok-instagram-youtube/)
> **Import:** n8n → Workflows → Import from File → `workflow.json` (or paste its contents onto the canvas).

![Workflow](https://postwire.io/n8n/templates/32-veo-video-to-tiktok-reels-shorts.png)

Turn ideas in Google Sheets into AI videos: Gemini writes the Veo 3.1 prompt and a caption per network, Veo renders an 8-second vertical clip, and PostWire posts it to TikTok, Instagram Reels, YouTube Shorts and Facebook.

## How it works
1. **Every day at 9:00** takes the first idea marked ready in the sheet and marks it as generating.
2. **Plan the video with Gemini** returns the Veo prompt and a caption for each network, plus the YouTube title.
3. **Generate the clip with Veo 3.1** renders it in 9:16 and the file goes straight to a PostWire upload slot: no Drive, no public link.
4. **Publish with PostWire** posts it to every network with its own text. The row is the idempotency key, so a retry never posts twice.
5. The row gets the post links, or the exact fix plus a **Gmail** report when a network refused.

## Setup
1. Create a free account at postwire.io, connect your networks and copy your API key. In n8n add a **Header Auth** credential (name `Authorization`, value `Bearer pw_live_…`) and select it in the three PostWire nodes.
2. Create a sheet with the columns idea, style, networks, status, posted_at, links and note, and mark ideas ready. Pick it in the four Sheets nodes.
3. Add a Google Gemini credential. Veo needs billing enabled in Google AI Studio (about one dollar per 8-second Veo 3.1 Fast clip); the captions fit the free tier.
4. Connect Gmail and put your address in **Email me the fix**.

## Requirements
- A PostWire account — the free plan covers one brand with all its networks and 30 posts a month, no card
- Your PostWire API key in an n8n **Header Auth** credential (name `Authorization`, value `Bearer pw_live_…`)
- A Google account with Google Sheets
- A Google Gemini API key from Google AI Studio
- A Gmail account

## Customization
- Switch to Veo 3.1 (not Fast) for quality, or add linkedin in the networks column.

## Additional info
PostWire is called with the standard HTTP Request node, so this template runs on n8n Cloud and self-hosted n8n alike. PostWire writes a different post for each network from one idea and holds the TikTok, Meta and YouTube publishing approvals, so connecting an account is one OAuth click.

An AI video generator that finishes the job: Veo 3.1 text-to-video, one prompt per idea written by Gemini, and native posting to TikTok, YouTube Shorts, Instagram Reels and Facebook with the results logged back in Google Sheets.

---
Made by the PostWire team. PostWire is a paid product with a free plan; this template is MIT-licensed like the rest of the repo.
