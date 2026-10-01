// Queue a post for later, list the queue, and (optionally) cancel it.
//
//   export POSTWIRE_API_KEY=pw_live_...
//   RUN_AT=2026-10-09T09:00:00-05:00 node schedule.mjs
//   RUN_AT=... CANCEL=1 node schedule.mjs       # schedules, then cancels the same post
//
// run_at: ISO 8601 with an offset, up to 365 days ahead. PostWire's servers publish it when due.
// Connections and media are checked at scheduling time, so a problem shows up now (400 + code).
// Docs: https://postwire.io/claude/schedule-social-media-posts/
import { pw } from "./postwire.mjs";

const run_at = process.env.RUN_AT;
if (!run_at) { console.error("Set RUN_AT, e.g. 2026-10-09T09:00:00-05:00"); process.exit(1); }

const res = await pw("POST", "/api/schedule", {
  run_at,
  platforms: (process.env.PLATFORMS || "linkedin,bluesky").split(",").map((s) => s.trim()),
  text: "Launch day: scheduling is live.",
  label: "Launch",
  // A video post is scheduled the same way: add video_url (and title for YouTube).
});
console.log(`schedule: HTTP ${res.status}`, JSON.stringify(res.body, null, 2));

const list = await pw("GET", "/api/schedule");
console.log(`queue: ${list.body.scheduled?.length ?? 0} post(s)`);

if (process.env.CANCEL && res.body?.scheduled?.id) {
  const del = await pw("DELETE", `/api/schedule/${res.body.scheduled.id}`);
  console.log(`cancel: HTTP ${del.status}`, JSON.stringify(del.body));
}
