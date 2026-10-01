# PostWire MCP server: Claude, Claude Code, Cursor, VS Code, Windsurf

Let an AI assistant write, publish and schedule social posts to the accounts you connected at postwire.io:
TikTok, Instagram, YouTube, LinkedIn (personal profiles), Facebook Pages, Bluesky, Mastodon, Telegram and Discord.
X, Threads, Reddit and Pinterest are **not** available.

There are two servers. Pick one:

| | Hosted (recommended) | Local (npm) |
|---|---|---|
| Address | `https://postwire.io/api/mcp` (Streamable HTTP) | `npx -y postwire-mcp` (stdio, needs Node) |
| Sign-in | OAuth 2.1 (the client opens a browser) or `Authorization: Bearer pw_live_…` | `POSTWIRE_API_KEY` env var |
| Tools | 15 — including `schedule_post`, `plan_week`, `list_scheduled_posts`, `cancel_scheduled_post`, `create_connect_link`, `create_upload_link`, `get_uploaded_file` | 5 — `generate_posts`, `post_to_social`, `get_post_status`, `list_platforms`, `my_account` |
| Source | — | [Perufitlife/postwire-mcp](https://github.com/Perufitlife/postwire-mcp) |

Both checked on Oct 1, 2026: the hosted server answered `initialize` and listed 15 tools with an API key; the npm
package (0.3.5) listed 5.

Get an API key: create a free account at [postwire.io/dashboard.html](https://postwire.io/dashboard.html), connect
your networks under **Accounts**, then **API & MCP → Copy key**. Free plan: 1 brand, 30 posts a month, 15 AI drafts a day, no card.

## Claude (claude.ai, Claude Desktop, mobile)

PostWire is in Claude's connector directory: open
[PostWire in the directory](https://claude.ai/directory/bc01e7da-eba7-4754-9e88-6cacae80f000) and press **Connect**,
then sign in with your email (a 6-digit code). No config file.

## Claude Code

Hosted server (no install):

```bash
claude mcp add --transport http postwire https://postwire.io/api/mcp \
  --header "Authorization: Bearer pw_live_your_key"
```

Leave out `--header` to sign in with OAuth instead. Or run the npm package locally:

```bash
claude mcp add --env POSTWIRE_API_KEY=pw_live_your_key --transport stdio postwire \
  -- npx -y postwire-mcp
```

The `--` before `npx` is required. Add `--scope user` for every project or `--scope project` to commit it.
Check with `claude mcp list`. Config file it writes: `.mcp.json` (project) or `~/.claude.json` (user).
A hand-written JSON entry with a `url` needs `"type": "http"` — see [`claude-code.mcp.json`](claude-code.mcp.json).

## Claude Desktop (config file)

`claude_desktop_config.json` — macOS `~/Library/Application Support/Claude/`, Windows `%APPDATA%\Claude\`
(Claude menu → Settings → Developer → Edit Config). Fully quit and reopen Claude after editing.
See [`claude_desktop_config.json`](claude_desktop_config.json) (local stdio server). To use the hosted server
from Claude Desktop instead, use the connector directory above.

## Cursor

`.cursor/mcp.json` (this project) or `~/.cursor/mcp.json` (every project), then Cursor Settings → Tools & MCP.
- Local: [`cursor.mcp.json`](cursor.mcp.json)
- Hosted: [`cursor-remote.mcp.json`](cursor-remote.mcp.json)

## VS Code and Windsurf

VS Code uses `"servers"` as the root key (not `"mcpServers"`): [`vscode.mcp.json`](vscode.mcp.json) goes in
`.vscode/mcp.json`. Windsurf uses `"serverUrl"`: [`windsurf.mcp_config.json`](windsurf.mcp_config.json) goes in
`~/.codeium/windsurf/mcp_config.json`.

## What to ask once it is connected

- "Connect my LinkedIn and Bluesky" → `create_connect_link` returns a one-hour link per network.
- "Write a launch post about X for LinkedIn and Bluesky and publish it" → `generate_posts`, you approve, `post_to_social`.
- "Schedule it for Friday 9:00 New York time" → `schedule_post` (hosted only). Posts are published by PostWire's servers, so the chat can be closed.
- "Post this video to TikTok and YouTube Shorts" → chat attachments never reach an MCP server, so the agent calls
  `create_upload_link`, you open the link on the device that has the file (up to 1 GB), and `get_uploaded_file`
  hands the agent its `media_url`.

Two things that surprise people: TikTok posts with no privacy value are published **private** (and YouTube uploads
default to private) — ask for public explicitly. And Instagram, TikTok and YouTube never take a text-only post.

Step-by-step guides:
- [How to schedule social media posts with Claude](https://postwire.io/claude/schedule-social-media-posts/)
- [An MCP server that uploads one video to TikTok and YouTube Shorts](https://postwire.io/mcp/upload-video-to-tiktok-youtube-shorts/)
- [All client configs compared](https://postwire.io/mcp/clients/)
