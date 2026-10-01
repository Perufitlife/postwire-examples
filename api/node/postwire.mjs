// Tiny helper shared by the Node examples. Node 18+ (global fetch), no dependencies.
// The API key comes from the environment: export POSTWIRE_API_KEY=pw_live_...
export const BASE = process.env.POSTWIRE_BASE || "https://postwire.io";

export function apiKey() {
  const k = process.env.POSTWIRE_API_KEY;
  if (!k) { console.error("Set POSTWIRE_API_KEY (dashboard → API & MCP → Copy key)."); process.exit(1); }
  return k;
}

// Calls the API and returns { status, body }. Never throws on a 4xx: PostWire's errors carry a
// machine-readable `code` (not_connected, media_required, duplicate_post…) worth showing as is.
export async function pw(method, path, body) {
  const r = await fetch(BASE + path, {
    method,
    headers: { Authorization: `Bearer ${apiKey()}`, ...(body ? { "Content-Type": "application/json" } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await r.text();
  let json; try { json = JSON.parse(text); } catch { json = { raw: text }; }
  return { status: r.status, body: json };
}

// One line per network from a /api/post answer.
export function summary(res) {
  if (!Array.isArray(res.body?.results)) return JSON.stringify(res.body, null, 2);
  const lines = res.body.results.map((r) => r.ok
    ? `  ok   ${r.platform}  ${r.url || r.id || ""}${r.status ? `  (${r.status})` : ""}`
    : `  FAIL ${r.platform}  ${r.code || ""}  ${r.fix || r.error}`);
  return [`posted to ${res.body.posted} network(s)`, ...lines].join("\n");
}
