// Upload a local photo or video (up to 1 GB) and print the media_url to publish with.
//
//   export POSTWIRE_API_KEY=pw_live_...
//   node upload.mjs ./clip.mp4
//   VIDEO_URL=$(node upload.mjs ./clip.mp4 --quiet) node publish.mjs
//
// Up to 50 MB: one PUT. Over 50 MB: the API answers with parts, each with its own upload_url and byte
// range [start, end); every part is PUT, then finalize joins them into one media_url. Kept 30 days.
import fs from "node:fs";
import path from "node:path";
import { pw } from "./postwire.mjs";

const file = process.argv[2];
const quiet = process.argv.includes("--quiet");
if (!file) { console.error("usage: node upload.mjs <file> [--quiet]"); process.exit(1); }
const TYPES = { ".mp4": "video/mp4", ".mov": "video/quicktime", ".webm": "video/webm", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".gif": "image/gif" };
const content_type = TYPES[path.extname(file).toLowerCase()];
if (!content_type) { console.error(`Unsupported file type: ${file}`); process.exit(1); }
const size = fs.statSync(file).size;
const log = (...a) => { if (!quiet) console.error(...a); };

// 1) Ask for a slot. Over 50 MB, ask for a multipart one straight away.
const big = size > 50 * 1024 * 1024;
const slot = await pw("POST", "/api/media/upload-url", { content_type, size_bytes: size, ...(big ? { multipart: true } : {}) });
if (slot.status !== 200) { console.error(slot.status, slot.body); process.exit(1); }

// 2) PUT the bytes straight to storage (they never pass through the API).
async function put(url, start, end) {
  const fd = fs.openSync(file, "r");
  const buf = Buffer.alloc(end - start);
  fs.readSync(fd, buf, 0, buf.length, start);
  fs.closeSync(fd);
  const r = await fetch(url, { method: "PUT", headers: { "Content-Type": content_type }, body: buf });
  if (!r.ok) throw new Error(`upload failed: HTTP ${r.status} ${await r.text()}`);
}
if (slot.body.multipart) {
  for (const p of slot.body.parts) { log(`part ${p.part}/${slot.body.parts.length}…`); await put(p.upload_url, p.start, p.end); }
} else {
  await put(slot.body.upload_url, 0, size);
}

// 3) Finalize: confirms the file landed and returns the media_url.
const fin = await pw("GET", `/api/media/finalize?path=${encodeURIComponent(slot.body.path)}`);
if (fin.status !== 200) { console.error(fin.status, fin.body); process.exit(1); }
log(`uploaded ${fin.body.bytes} bytes; link valid until ${fin.body.expires_at} (renewed automatically when you publish with it), file kept 30 days`);
console.log(fin.body.media_url);
