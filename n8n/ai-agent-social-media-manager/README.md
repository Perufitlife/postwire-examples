# Write and publish social posts from chat with an AI agent and the PostWire tool

> **Runs on:** self-hosted n8n (uses the `n8n-nodes-postwire` community node, not yet verified by n8n).
> **Step-by-step guide:** [How an AI agent can publish to social media](https://postwire.io/guides/ai-agent-post-to-social-media/)
> **Import:** n8n → Workflows → Import from File → `workflow.json` (or paste its contents onto the canvas).

![Workflow](https://postwire.io/n8n/templates/16-ai-agent-social-media-manager.png)

For founders and marketers who want to say "post this on LinkedIn and Bluesky" in plain words. The agent turns your message into a native draft per network, shows it to you, and publishes only after you approve.

## How it works
1. **Chat Trigger** opens a chat in n8n (or embed it on your site).
2. The **AI Agent** uses two PostWire tools: **Write drafts** (preview, publishes nothing) and **Publish approved drafts**.
3. The system message makes it show drafts first, publish only on an explicit yes, and call Publish once — every call is a real post.
4. **Simple Memory** keeps the conversation, so "make the Bluesky one shorter" works.

## Setup
1. Install the **PostWire** community node (Settings → Community nodes → `n8n-nodes-postwire`), then create a free account at postwire.io, connect your networks and paste the API key into a **PostWire API** credential.
2. Add an Anthropic credential to the model (or swap in any chat model).
3. Open the chat and try: "Announce that we now ship to Canada, LinkedIn and Bluesky".

## Requirements
- A PostWire account — the free plan covers one brand with all its networks and 30 posts a month, no card
- Self-hosted n8n with the community node `n8n-nodes-postwire` installed (Settings → Community nodes)
- An Anthropic API key (or any chat model n8n supports)

## Customization
- Edit the system message with your brand voice, or add Schedule as a third tool.

## Additional info
This template uses the PostWire community node, so it runs on self-hosted n8n. PostWire writes a different post for each network from one idea and holds the TikTok, Meta and YouTube publishing approvals, so connecting an account is one OAuth click.

---
Made by the PostWire team. PostWire is a paid product with a free plan; this template is MIT-licensed like the rest of the repo.
