# Demo video tooling: Remotion vs After Effects (MCP) — Head-to-Head Test Plan

> Picked up mid-session. The user is choosing between Remotion and After Effects for the Vouch hackathon demo video. They've installed AE 2026 + the `ae-mcp` MCP server (https://github.com/ishu86/after-effects-mcp). The MCP is connected (`claude mcp list` → `ae-mcp: ✓ Connected`). The bundled `ae-mcp` skill is installed at `~/.claude/skills/ae-mcp/`.

## Context

- Demo video target: 75-second kurzgesagt-style narrated piece. Black plates → cream product surfaces → black dispute pivot → closing. Heavy on typography animation + gradient italic words.
- Vouch brand tokens (locked in `docs/DESIGN.md`):
  - Cream surface: `#f6f5f2`
  - Indigo accent: `#5266eb` (gradient start)
  - Coral/A24-red accent: `#b54a3a` (gradient end)
  - Headline font: **Fraunces** (variable, italic + display weights)
  - Mono font: **JetBrains Mono** for eyebrows
- Vera's voice will narrate. ElevenLabs Creator tier is provisioned (1 mo free). The narrator A/B test script is pre-staged at `D:\Projects\vouch\scripts\vera-narrator-ab.mjs` — runs when `ELEVENLABS_API_KEY` + `ELEVENLABS_VERA_VOICE_ID` are set.
- Existing Remotion install: `D:\Projects\hearsay-intro` (smoke-tested 2026-04-19, per memory `reference_video_tooling.md`).

## The test beat (≤5 s, used in both tools)

Spec:

- 1920×1080, 30 fps, **3.5 seconds** total
- Background: solid black (`#0a0a0a`)
- Sentence: **"You should receive your money."**
- Word-by-word fade-in from t=0.2s → t=2.0s — 5 words, ~0.35 s apart with 0.4 s overlap each
- Hero word **"money"** renders in Fraunces **italic** with a left-to-right gradient fill from `#5266eb` (indigo) to `#b54a3a` (coral)
- Hold the full sentence from t=2.0s → t=3.5s
- No motion blur for v1 (we want to compare clean default behaviour)

### Why this beat

- Tests custom font rendering (Fraunces italic is the brand font for the hero one-liner)
- Tests gradient fill on a single hero word (this is the cinematic flourish from the locked aesthetic)
- Tests word-by-word timing precision
- Tests black-background plate (the kurzgesagt-style opener)
- Short enough to render in <30 s each so iteration speed is observable

## Test deliverables (per tool)

For each of Remotion and AE, produce:

1. `D:\Projects\vouch\tmp\test-{tool}.mp4` — the rendered 3.5 s clip
2. A timing log:
   - **T0:** start of work (tool open / first prompt)
   - **T1:** first preview frame visible
   - **T2:** final render written to disk
   - **T3 (iteration):** after the first render, swap the gradient to `#b54a3a → #f6c167` (coral → amber), re-render, log how long. This is the "edit-and-re-render" speed test.
3. A note on output quality (eyeball the gradient + italic Fraunces rendering — is it clean?)
4. A note on what would have happened if VO had to be synced in (markers, peak detection, manual eyeballing)

## Remotion side — STATUS

> Run in the existing Remotion install at `D:\Projects\hearsay-intro` OR scaffold a new minimal Remotion project at `D:\Projects\vouch-demo-remotion` — whichever the executing session decides. Recommendation: scaffold fresh under `D:\Projects\vouch-demo-remotion` so the test is hermetic.

Required steps:

```
pnpm create video --name vouch-demo-remotion   # or npx remotion create
cd D:\Projects\vouch-demo-remotion
# Add Fraunces via @remotion/google-fonts
# Build a 105-frame composition (3.5 s @ 30fps) named TestBeat
# Use spring() or interpolate() with easing for the word fade-ins
# Gradient text: linear-gradient(90deg, #5266eb, #b54a3a) clipped to text via CSS background-clip
# pnpm exec remotion render TestBeat ../vouch/tmp/test-remotion.mp4
```

## After Effects side — STATUS

> Requires the `ae-mcp` MCP tools, which are only available after Claude Code is restarted. AE 2026 must be open with the AE-MCP panel docked (`Window → Extensions → AE-MCP`) and showing "listening for commands".

Tool calls expected (all `mcp__ae-mcp__*`):

```
1. create_project (name: "vouch-test")
2. create_composition (name: "TestBeat", width: 1920, height: 1080, duration: 3.5, frameRate: 30, bgColor: {r: 0.039, g: 0.039, b: 0.039})
3. For each word ["You","should","receive","your","money."]:
   a. add_text_layer_advanced (or create_text_animator with fadeIn style)
   b. font: "Fraunces" (need italic variant for "money.")
   c. set position centered horizontally, vertically aligned around y=540
   d. set keyframes on Opacity: 0 → 100 over 0.4 s, starting at t = 0.2 + (index * 0.35)
   e. apply_easy_ease on the opacity keyframes
4. For the "money." word specifically:
   a. apply gradient fill (likely via Layer Styles → Gradient Overlay, or via a fill effect)
   b. font weight italic
5. add_composition_marker at t=2.0s ("hold start") and t=3.5s ("end") for future VO-sync reference
6. Save project to D:\AdobeProjects\vouch-test\vouch-test.aep
7. Render: queue a composition render to D:\Projects\vouch\tmp\test-ae.mp4
   (NOTE: the MCP may or may not have a render-out-of-AE tool. If not, the
   user does File → Add to Render Queue → Render. Document either way.)
```

If the gradient on "money" turns out to be non-trivial via MCP, fall back to two manual options to compare iteration cost:

- Option A: pre-compose the "money" word and apply a gradient mask layer
- Option B: use a Linear Wipe + two-color text trick

Log which path the MCP can fully automate vs. which need manual GUI clicks.

## Comparison criteria (output these as a markdown table at the end)

| Axis | Remotion | After Effects |
|---|---|---|
| Time to first preview (T1) | ?? sec | ?? sec |
| Time to final render (T2) | ?? sec | ?? sec |
| Iteration time (T3 — recolor and re-render) | ?? sec | ?? sec |
| Gradient italic Fraunces — looks clean? | y/n | y/n |
| How would VO sync work? | code timing | markers + waveform |
| Reproducible in 2 weeks from spec? | y (code) | depends on .aep |
| Cost of layering 6 beats into 75 s timeline | low/med/high | low/med/high |
| Verdict for Vouch demo | | |

Write the final comparison report into `D:\Projects\vouch\docs\demo-tooling-decision.md` and update `Obsidian_Vault\Projects\Vouch\OffPlanLog.md` with a `D-007` entry summarising the decision and the workflow chosen.

## Key constraints to remember

- All output goes to **D:** drive (C: has only 40 GB free). AE caches are redirected to `D:\AdobeCache\*`. Save AE projects to `D:\AdobeProjects\<name>\`. Remotion projects under `D:\Projects\`. Rendered MP4s under `D:\Projects\vouch\tmp\`.
- Don't introduce production dependencies into the Vouch Next.js codebase. The demo tooling lives in a sibling directory.
- Vouch hackathon deadline: **Thu 21 May 17:00 UK**. Today is Day 2 (Sat 16). Demo video is a Day 6 deliverable; tooling decision should be made today so we know which we're using.

## What's already committed on `main` of the Vouch repo (so don't re-do)

Last commit `3fbddbd` — "Day 2 starter: seller-invitation notify stub + Vera narrator A/B test script". Repo state is clean. The demo-tooling decision work happens in `D:\Projects\vouch-demo-remotion\` and via the AE MCP — not inside `D:\Projects\vouch\` source.
