# Share OneDrive videos on LinkedIn, Shorts and Reels for Microsoft 365 teams with PostWire

> **Runs on:** n8n Cloud and self-hosted (plain HTTP Request nodes, no community node).
> **Also on n8n.io:** https://n8n.io/workflows/20160
> **Step-by-step guide:** [How to post to Instagram from n8n](https://postwire.io/n8n/post-to-instagram/)
> **Import:** n8n → Workflows → Import from File → `workflow.json` (or paste its contents onto the canvas).

![Workflow](https://postwire.io/n8n/templates/45-onedrive-video-to-linkedin-shorts-reels.png)

Drop a video in a OneDrive folder and it goes out as a native LinkedIn video post, a YouTube Short, an Instagram Reel and a Facebook video, each with its own caption.

## How it works
1. **Microsoft OneDrive Trigger** watches a folder; **Only video files** skips everything else.
2. **Describe the video** turns the file name into the idea for the captions and holds the networks and brand voice.
3. PostWire hands out an upload slot and the file goes from OneDrive straight to it, so no public link is needed (a OneDrive share link opens a web page, not the file). Up to 50 MB.
4. **Write the posts** returns a long LinkedIn post, a YouTube title and tags, and short captions for Reels and Facebook.
5. **Publish the video** posts it everywhere. The OneDrive file ID is the idempotency key, so a retry never posts twice.
6. If a network refuses, **Microsoft Outlook** emails the team what failed and how to fix it.

## Setup
1. Create a free account at postwire.io, connect your networks and copy your API key. In n8n add a **Header Auth** credential (name `Authorization`, value `Bearer pw_live_…`) and select it in the four PostWire nodes.
2. Connect Microsoft OneDrive and pick the folder in the trigger. Name each file after what the video says, for example quarterly-results-in-60-seconds.mp4.
3. Connect Microsoft Outlook and set the team address.

## Requirements
- A PostWire account — the free plan covers one brand with all its networks and 30 posts a month, no card
- Your PostWire API key in an n8n **Header Auth** credential (name `Authorization`, value `Bearer pw_live_…`)
- A Microsoft 365 or personal Microsoft account with OneDrive
- Microsoft Outlook (the same Microsoft account works)

## Customization
- Edit the networks and brand voice in Describe the video, or swap Outlook for a Microsoft Teams message.

## Additional info
For Microsoft 365 teams (marketing, HR, internal comms) who keep finished videos in OneDrive.

PostWire is called with the standard HTTP Request node, so this template runs on n8n Cloud and self-hosted n8n alike. PostWire writes a different post for each network from one idea and holds the TikTok, Meta and YouTube publishing approvals, so connecting an account is one OAuth click.

Built for companies on Microsoft 365: OneDrive (or a SharePoint library synced to OneDrive) becomes the upload point for LinkedIn video, YouTube Shorts, Instagram Reels and Facebook, with an Outlook alert instead of a silent failure.

---
Made by the PostWire team. PostWire is a paid product with a free plan; this template is MIT-licensed like the rest of the repo.
