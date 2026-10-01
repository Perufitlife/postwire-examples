# Publish to social media from any app with a webhook and PostWire

> **Runs on:** self-hosted n8n (uses the `n8n-nodes-postwire` community node, not yet verified by n8n).
> **Step-by-step guide:** [Social media posting API with a free tier](https://postwire.io/guides/free-social-media-posting-api/)
> **Import:** n8n → Workflows → Import from File → `workflow.json` (or paste its contents onto the canvas).

![Workflow](https://postwire.io/n8n/templates/19-webhook-publish-api.png)

For developers and no-code builders who want one URL that publishes to every network — from a CRM, a form tool, Zapier, a script or a button. Send an idea and a list of networks; get back what was published where.

## How it works
1. **Webhook** receives a POST with JSON: { "idea": "...", "networks": ["linkedin","bluesky"], "id": "optional-unique-id" }.
2. **Valid request?** checks the idea and networks are there; if not, it answers 400 with what to send.
3. **PostWire** writes a native post per network and publishes it. Send an id to make retries safe: the same id never posts twice.
4. **Return the results** answers with one entry per network: ok, url, and a hint if it failed.

## Setup
1. Install the **PostWire** community node (Settings → Community nodes → `n8n-nodes-postwire`), then create a free account at postwire.io, connect your networks and paste the API key into a **PostWire API** credential.
2. Add a Header Auth credential to the Webhook so only your apps can call it.
3. Activate the workflow and call the production URL.

## Requirements
- A PostWire account — the free plan covers one brand with all its networks and 30 posts a month, no card
- Self-hosted n8n with the community node `n8n-nodes-postwire` installed (Settings → Community nodes)

## Customization
- Accept media_url in the body and set Media to URL, or switch to Schedule and accept a date.

## Additional info
This template uses the PostWire community node, so it runs on self-hosted n8n. PostWire writes a different post for each network from one idea and holds the TikTok, Meta and YouTube publishing approvals, so connecting an account is one OAuth click.

---
Made by the PostWire team. PostWire is a paid product with a free plan; this template is MIT-licensed like the rest of the repo.
