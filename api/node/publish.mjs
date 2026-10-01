// Publish one video to TikTok, Instagram (Reel) and YouTube (Short) in one call.
//
//   export POSTWIRE_API_KEY=pw_live_...
//   VIDEO_URL=https://example.com/clip.mp4 node publish.mjs
//   VIDEO_URL=... PRIVACY=public PLATFORMS=tiktok,youtube node publish.mjs
//
// VIDEO_URL must be a public link straight to the file (a Google Drive / Dropbox share page is not), or the
// media_url printed by upload.mjs. PRIVACY applies to TikTok and YouTube; it defaults to "private" so a
// first run is not public. Instagram has no private mode.
// Docs: https://postwire.io/n8n/post-to-tiktok-instagram-youtube/
import { pw, summary } from "./postwire.mjs";

const video_url = process.env.VIDEO_URL;
if (!video_url) { console.error("Set VIDEO_URL"); process.exit(1); }

const res = await pw("POST", "/api/post", {
  platforms: (process.env.PLATFORMS || "tiktok,instagram,youtube").split(",").map((s) => s.trim()),
  video_url,
  title: "How we cut our weekly report from 2 hours to 10 minutes",       // YouTube title
  text: "One spreadsheet formula replaced 2 hours of copy-paste. #spreadsheets #productivity",
  privacy: process.env.PRIVACY || "private",
  // Same key on a retry = never published twice (kept 24 h). Use your row / file / job id.
  idempotency_key: process.env.IDEMPOTENCY_KEY || `demo-${Date.now()}`,
});
console.log(`HTTP ${res.status}`);
console.log(summary(res));
// TikTok and YouTube keep processing after the upload; the result's id can be checked with
// GET /api/post/status?platform=tiktok&id=<id> until it says the post is live.
