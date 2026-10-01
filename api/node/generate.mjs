// One idea in, a separate draft per network out — then (with --publish) publish exactly those drafts.
//
//   export POSTWIRE_API_KEY=pw_live_...
//   node generate.mjs "We cut our weekly report from 2 hours to 10 minutes with one formula"
//   VIDEO_URL=https://.../clip.mp4 PRIVACY=public node generate.mjs "..." --publish
//
// /api/generate publishes nothing. Its `drafts` object goes straight back to /api/post as `per_platform`:
// TikTok gets a hook-first caption, Instagram a shorter one, YouTube a title, description and tags.
// Takes 10-30 seconds. Free plan: 15 generations a day.
// Docs: https://postwire.io/guides/different-caption-for-each-social-network/
import { pw, summary } from "./postwire.mjs";

const idea = process.argv.slice(2).find((a) => !a.startsWith("--"));
if (!idea) { console.error('usage: node generate.mjs "<idea>" [--publish]'); process.exit(1); }
const platforms = (process.env.PLATFORMS || "tiktok,instagram,youtube").split(",").map((s) => s.trim());
const video_url = process.env.VIDEO_URL;

const gen = await pw("POST", "/api/generate", { prompt: idea, platforms, ...(video_url ? { media_url: video_url } : {}) });
if (gen.status !== 200) { console.error(`generate: HTTP ${gen.status}`, gen.body); process.exit(1); }
for (const [p, d] of Object.entries(gen.body.drafts)) {
  console.log(`\n── ${p}${d.title ? `  [title] ${d.title}` : ""}\n${d.text}${d.tags ? `\n[tags] ${d.tags.join(", ")}` : ""}`);
}
if (gen.body.missing?.length) console.log(`\n(no draft came back for: ${gen.body.missing.join(", ")} — retry those)`);

if (process.argv.includes("--publish")) {
  if (!video_url && platforms.some((p) => ["tiktok", "instagram", "youtube"].includes(p))) {
    console.error("\nTikTok, Instagram and YouTube need a video or photo: set VIDEO_URL."); process.exit(1);
  }
  const res = await pw("POST", "/api/post", {
    platforms, per_platform: gen.body.drafts, ...(video_url ? { video_url } : {}),
    privacy: process.env.PRIVACY || "private",
  });
  console.log(`\npublish: HTTP ${res.status}\n${summary(res)}`);
}
