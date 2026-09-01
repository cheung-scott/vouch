// Bulk-import Vera's 12 webhook tools into ConvAI via REST.
//
//   pnpm tools:import
//
// Reads docs/vera-tools.json, POSTs each tool to /v1/convai/tools, then
// PATCHes the agent with the resulting tool_ids array. Idempotent: existing
// tools with the same name are detected and updated in-place rather than
// duplicated.
//
// Requires in .env.local:
//   ELEVENLABS_API_KEY            (64-char)
//   ELEVENLABS_VERA_AGENT_ID      (agent_… prefix)
//   APP_URL                       (https://… — public URL; localhost works
//                                  for "import the schema" but tool calls
//                                  from ElevenLabs cloud will fail until
//                                  the URL is reachable)
//
// Per ConvAI research § Open questions §1 — the API has historically wrapped
// the tool body in {tool_config: ...} but more-recent docs show flat bodies.
// We try the wrapped shape first; on 422 we retry flat.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..");

const API_KEY = process.env.ELEVENLABS_API_KEY;
const AGENT_ID = process.env.ELEVENLABS_VERA_AGENT_ID;
const BASE_URL = process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL;
const TOOL_SECRET = process.env.VERA_TOOL_SECRET;

if (!API_KEY || !AGENT_ID || !BASE_URL) {
  console.error("✗ Missing env. Need:");
  console.error(`  ELEVENLABS_API_KEY        ${API_KEY ? "✓" : "✗"}`);
  console.error(`  ELEVENLABS_VERA_AGENT_ID  ${AGENT_ID ? "✓" : "✗"}`);
  console.error(`  APP_URL                   ${BASE_URL ? "✓" : "✗"}`);
  process.exit(1);
}

if (AGENT_ID === "REPLACE" || AGENT_ID.length < 20) {
  console.error(`✗ ELEVENLABS_VERA_AGENT_ID looks like a placeholder (got "${AGENT_ID}")`);
  process.exit(1);
}

// Every vera/* tool route is authenticated (NEW-1). Importing tool definitions
// without the shared secret would register tools that 401 on every call, which
// looks like a broken agent rather than a config mistake. Refuse instead.
if (!TOOL_SECRET) {
  console.error("✗ VERA_TOOL_SECRET is not set.");
  console.error("  The vera/* routes now require it. Importing without it would");
  console.error("  register tools that fail with 401 on every call.");
  console.error("  Generate one:  node -e \"console.log(require(String.fromCharCode(110,111,100,101,58,99,114,121,112,116,111)).randomBytes(32).toString(String.fromCharCode(104,101,120)))\"");
  process.exit(1);
}

const API = "https://api.elevenlabs.io";
const headers = {
  "xi-api-key": API_KEY,
  "content-type": "application/json",
};

const spec = JSON.parse(
  fs.readFileSync(path.join(repoRoot, "docs", "vera-tools.json"), "utf8"),
);

console.log(`Importing ${spec.tools.length} tools for agent ${AGENT_ID}`);
console.log(`Tool URLs will point at ${BASE_URL}\n`);

// 1. List existing tools so we can detect name collisions and update in-place
//    rather than creating duplicates.
const existing = await listExistingTools();
const existingByName = new Map(existing.map((t) => [t.tool_config?.name ?? t.name, t]));
console.log(`Found ${existing.length} existing tools on this account`);

const toolIds = [];

for (const tool of spec.tools) {
  const body = buildToolBody(tool);
  const existingTool = existingByName.get(tool.name);

  let result;
  if (existingTool) {
    result = await updateTool(existingTool.id ?? existingTool.tool_id, body);
    console.log(`↻ ${tool.name} → ${result.id ?? result.tool_id} (updated)`);
  } else {
    result = await createTool(body);
    console.log(`+ ${tool.name} → ${result.id ?? result.tool_id} (created)`);
  }
  toolIds.push(result.id ?? result.tool_id);
}

console.log(`\nAttaching ${toolIds.length} tools to agent ${AGENT_ID}...`);
await attachToolsToAgent(toolIds);
console.log("✓ done");

// ---- helpers ----

function buildToolBody(tool) {
  const properties = {};
  const required = [];
  for (const [name, p] of Object.entries(tool.parameters)) {
    properties[name] = { type: p.type, description: p.description };
    if (p.required !== false) required.push(name);
  }

  const longTimeoutTools = new Set(["lock_escrow", "release_escrow"]);

  // pre_tool_speech config per ConvAI audit (ElevenAgents-Full-Audit
  // MUST ADD #4) + EL Apr 27 feature scan:
  // - "off" for most tools — preserves Vera's "never explain that you
  //   used a tool" hard rule.
  // - "force" for money-movement tools (lock_escrow + release_escrow +
  //   refund_deal) — guarantees Vera ALWAYS narrates before the tool
  //   fires (never sits silent during the ~200-500ms Stripe cold-start).
  //   Upgraded from "auto" 2026-05-19 per Tier 1 #7: "auto" left it to
  //   the model to decide and produced variance; "force" removes the
  //   variance and the silent-tool-call demo failure mode.
  const moneyMovementTools = new Set([
    "lock_escrow",
    "release_escrow",
    "refund_deal",
  ]);
  const preToolSpeech = moneyMovementTools.has(tool.name) ? "force" : "off";

  // Build the inner config; we'll wrap it in {tool_config: ...} for the
  // first attempt and fall back to flat on 422.
  return {
    type: "webhook",
    name: tool.name,
    description: tool.description,
    api_schema: {
      url: tool.url.replace("{BASE_URL}", BASE_URL),
      method: tool.method,
      // ⚠ VERIFY THIS FIELD NAME against current ElevenLabs ConvAI docs before
      // running. The auth design does not depend on it, but the exact key for
      // per-tool request headers has moved between API versions.
      request_headers: { "X-Vera-Tool-Secret": TOOL_SECRET },
      request_body_schema: { type: "object", properties, required },
    },
    response_timeout_secs: longTimeoutTools.has(tool.name) ? 30 : 20,
    pre_tool_speech: preToolSpeech,
  };
}

async function tryRequest(method, url, innerBody) {
  // Try wrapped (newer docs) first.
  let res = await fetch(`${API}${url}`, {
    method,
    headers,
    body: JSON.stringify({ tool_config: innerBody }),
  });
  if (res.ok) return res.json();

  if (res.status === 422 || res.status === 400) {
    const wrappedErr = await res.text().catch(() => "<no body>");
    // Try flat (older shape).
    res = await fetch(`${API}${url}`, {
      method,
      headers,
      body: JSON.stringify(innerBody),
    });
    if (res.ok) return res.json();
    const flatErr = await res.text().catch(() => "<no body>");
    throw new Error(
      `Both shapes rejected.\n  wrapped: ${wrappedErr}\n  flat: ${flatErr}`,
    );
  }

  const errBody = await res.text().catch(() => "<no body>");
  throw new Error(`${method} ${url} → ${res.status}: ${errBody}`);
}

async function createTool(innerBody) {
  return tryRequest("POST", "/v1/convai/tools", innerBody);
}

async function updateTool(toolId, innerBody) {
  return tryRequest("PATCH", `/v1/convai/tools/${toolId}`, innerBody);
}

async function listExistingTools() {
  const res = await fetch(`${API}/v1/convai/tools`, { headers });
  if (!res.ok) {
    console.warn(
      `[list] ${res.status} — proceeding without dedup; duplicates may be created`,
    );
    return [];
  }
  const json = await res.json();
  // API shape: { tools: [...] } per most docs versions.
  return Array.isArray(json) ? json : (json.tools ?? []);
}

async function attachToolsToAgent(toolIds) {
  const res = await fetch(`${API}/v1/convai/agents/${AGENT_ID}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({
      conversation_config: {
        agent: { prompt: { tool_ids: toolIds } },
      },
    }),
  });
  if (!res.ok) {
    const err = await res.text().catch(() => "<no body>");
    throw new Error(`Attach failed: ${res.status} ${err}`);
  }
}
