# Schedule social media posts from a Google Sheets content calendar with PostWire

> **Runs on:** self-hosted n8n (uses the `n8n-nodes-postwire` community node, not yet verified by n8n).
> **Step-by-step guide:** [n8n social media automation](https://postwire.io/n8n-social-media-automation/)
> **Import:** n8n → Workflows → Import from File → `workflow.json` (or paste its contents onto the canvas).

![Workflow](https://postwire.io/n8n/templates/12-google-sheets-content-calendar.png)

For social media managers and small teams who plan in a spreadsheet. Write an idea, the networks and a date in a row, mark it ready, and it is scheduled — with a different post written for each network.

## How it works
1. **Every morning at 8** the workflow reads rows whose status is ready.
2. **Only future dates** skips rows whose time has passed.
3. **PostWire** schedules each row. The connections and the text are checked now, so a problem shows up today, not at publishing time.
4. **Mark row as scheduled** writes the status and the PostWire ID back to the sheet.

## Setup
1. Install the **PostWire** community node (Settings → Community nodes → `n8n-nodes-postwire`), then create a free account at postwire.io, connect your networks and paste the API key into a **PostWire API** credential.
2. Create a sheet with the columns idea, networks (for example: linkedin, facebook, bluesky), publish_at (ISO date such as 2026-10-01T09:00:00-05:00), status and postwire_id.
3. Connect Google Sheets and pick the sheet in both Sheets nodes.

## Requirements
- A PostWire account — the free plan covers one brand with all its networks and 30 posts a month, no card
- Self-hosted n8n with the community node `n8n-nodes-postwire` installed (Settings → Community nodes)
- A Google account with Google Sheets

## Customization
- Change the trigger hour, add a Brand Voice, or add an image column and set Media to URL.

## Additional info
This template uses the PostWire community node, so it runs on self-hosted n8n. PostWire writes a different post for each network from one idea and holds the TikTok, Meta and YouTube publishing approvals, so connecting an account is one OAuth click.

---
Made by the PostWire team. PostWire is a paid product with a free plan; this template is MIT-licensed like the rest of the repo.
