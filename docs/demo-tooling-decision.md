# Demo video tooling decision — Remotion vs After Effects (via `ae-mcp`)

**Decision date:** 2026-05-16 (Day 2 of Vouch hackathon)
**Decision:** **Remotion** for the Vouch 75-second demo video.
**Verdict confidence:** High for this specific use case (Claude-driven, typography-heavy, kurzgesagt-style). Not a general claim about AE.

## What we tested

A single 3.5-second test beat — "You should receive your money." — word-by-word fade-in over 2 seconds, hero word "money." rendered in Fraunces italic with an indigo→coral gradient fill. Black 1920×1080 30fps. Same spec in both tools. See `D:\Projects\vouch\docs\demo-test-plan.md` for the original brief.

Outputs landed at `D:\Projects\vouch\tmp\`:

- `test-remotion.mp4` — 223 KB, v1 (indigo→coral)
- `test-remotion-v2.mp4` — 227 KB, v2 (coral→amber iteration test)
- `test-ae.mp4` — 390 KB, AE v1 (visually broken — see issues below)

## Results table

| Axis | Remotion | After Effects (via `ae-mcp`) |
|---|---|---|
| **Font (Fraunces italic)** | ✅ Auto-loaded via `@remotion/google-fonts/Fraunces` | ❌ Silently fell back to default serif — Fraunces not installed system-wide |
| **Word spacing / layout** | ✅ CSS flexbox handled it perfectly first try | ❌ Broken — manual pixel positioning required, words jammed together because Fraunces widths were estimated wrong |
| **Gradient on hero word** | ✅ One line of CSS: `background-clip: text` + linear-gradient | ❌ Gradient Ramp effect produced solid coral (endpoint coords in unfamiliar coordinate space) + visible ghost-duplicate artifact |
| **Word-by-word fade-in** | ✅ `interpolate(t, [start, end], [0, 1])` — readable, parameterised | ⚠️ Keyframes set via MCP, but visual result unclear due to compounding issues above |
| **First render time** | ~76 s (mostly Chromium spin-up the first time; subsequent renders ~10–30 s) | ~30 s of MCP build calls + manual Render Queue clicks (Output Module + Output To + Render) |
| **Iteration time (gradient swap)** | **30.5 s end-to-end** (edit two consts, re-run `pnpm exec remotion render`) | Not measured — first output was broken so iterating colors would have compounded problems |
| **Reproducible in 2 weeks from spec** | ✅ `TestBeat.tsx` is the spec — git-versioned, code-reviewable | ⚠️ Depends on `.aep` binary + system font availability + AE version |
| **Source of truth** | Code in git | Binary `.aep` file |
| **Cost of layering 6 beats for 75 s timeline** | Low — drop in additional components, share font/colour constants | Medium-high — each beat repeats the layout/font/effect ceremony |
| **Bridge / control overhead** | None (Claude writes files directly) | ~120 ms per MCP call × ~22 calls = ~2.6 s of pure bridge time |

## What worked well about AE / `ae-mcp`

Worth noting because the MCP server itself is a great piece of work and would be the right answer for a different use case:

- **`ae-mcp` is fast and stable.** Each MCP call rounds-tripped in ~100–200 ms over a file-based bridge. Zero connection drops across the ~22 calls. The bundled Claude Code skill (`~/.claude/skills/ae-mcp/SKILL.md`) documents property paths and value formats — actually very polished.
- **Tool coverage is genuinely 70+ wide.** Compositions, layers, keyframes, easing, effects, expressions, markers, motion-graphics templates (lower-thirds, title cards, transitions, logo reveals), audio. No gaps in the API for the common motion-graphics surface.
- **Easy ease worked.** `apply_easy_ease(type: BOTH)` per layer/property landed in 100 ms each.
- **The architecture (CEP panel polling a shared folder) is the right design** for a long-running app like AE. Survives reconnections, doesn't fight AE's main thread.

## What didn't work for our use case

The failure modes were all in the **interface between AE's mental model and Claude's**, not in the MCP layer:

1. **AE has no auto-layout.** I had to know Fraunces' rendered width at fontSize 110 to position 5 words side-by-side. I estimated; estimates were wrong; words overlapped. A designer eyeballing the canvas would fix this in 30 seconds. Claude can't see the canvas.
2. **Effect coordinate spaces are implicit.** The Gradient Ramp's "Start of Ramp" / "End of Ramp" are in layer-local pixels — but a text layer's actual extent depends on the rendered text, not on a layer width I can read back. So my `(0, 50) → (400, 50)` endpoints didn't span the text. Need a precomp + matte approach to get this right, which is more MCP calls and more guessing.
3. **Fonts are system-managed.** Remotion's `loadFont()` solves font availability at the bundle level; AE wants the font installed at the OS level. Hackathon laptops don't have every Google Font installed. This is a portability cliff.
4. **Render is not part of the MCP surface.** No `render_composition` tool. Every render requires hand-driving the Render Queue (Output Module → format, Output To → path, Render). Adds ~60 s of clicks per render and breaks the "Claude does it end-to-end" loop.
5. **No visual feedback channel.** Without sharing screenshots after every step, neither Claude nor the user can know intermediate state is correct. Bugs compound silently across the build.

## Why Remotion wins for *this* video

The Vouch demo is:

- Typography-heavy (kurzgesagt-style word-by-word reveals, gradient hero words, black plates with on-screen text)
- Built once and re-rendered as we iterate copy and colours
- Going to live in version control alongside the codebase
- Driven by Claude end-to-end (you don't want to be manually clicking Render Queue every iteration during the 4 days from now to submission)

All four points lean Remotion. The killer ones:

- **Iteration speed.** 30.5 seconds to "swap gradient colors and have a finished MP4" with zero clicks. That's the unit of work we'll do dozens of times in the next 4 days.
- **Reproducibility.** When (not if) we re-export for a 9:16 social cut, the same `TestBeat.tsx` plus a 9:16 composition wrapper produces the alt aspect ratio. No re-creating the AE comp.
- **Vera VO sync is a code problem in Remotion.** `useCurrentFrame()` × a `fps` constant gives us frame-accurate timing for animation beats keyed to ElevenLabs VO MP3s. In AE, we'd be eyeballing markers on a waveform.

## Where AE would still beat Remotion

To be honest about the boundary:

- **Designer-driven motion graphics.** A human in AE GUI with all their muscle memory will out-pace any code-driven path for non-templated, gestural motion.
- **Particle systems / 3D camera moves / Trapcode-style effects.** Remotion can do a lot but the AE plugin ecosystem (Trapcode, Red Giant, Saber) is decades deep.
- **Audio waveform-driven animation.** AE has built-in audio amplitude expressions; Remotion needs you to pre-process the WAV.
- **The hand-off case.** If we ever need a freelance motion designer to polish a scene, they speak AE not Remotion.

## What stays in the repo

| File | Status |
|---|---|
| `D:\Projects\hearsay-intro\src\TestBeat.tsx` | ✅ Keep — basis for the real demo composition |
| `D:\Projects\hearsay-intro\src\Root.tsx` | ✅ Keep — TestBeat registered |
| `D:\Projects\vouch\tmp\test-remotion.mp4` | Reference output, can delete after Day 6 |
| `D:\Projects\vouch\tmp\test-remotion-v2.mp4` | Reference output, can delete after Day 6 |
| `D:\Projects\vouch\tmp\test-ae.mp4` | Keep as the "what AE produced" data point for the OffPlanLog entry |
| `D:\AdobeProjects\vouch-test\vouch-test.aep` | Keep as the test artifact |
| `D:\Projects\after-effects-mcp\` | Keep — the MCP install is fine, may use AE for one-off motion-graphics scenes if needed |

## Next actions

1. **Day 5 evening:** Start building the real Vouch demo composition in Remotion. Either extend `hearsay-intro` or scaffold a fresh `vouch-demo-remotion` project — leaning fresh for hermeticity. Will decide when the time comes based on which is faster.
2. **Day 6 morning:** Wire in Vera's VO MP3s once the narrator A/B test picks a preset (P-001).
3. **Pre-render:** screen recordings of the live `/demo` flow at 60 fps into the Remotion timeline as `<OffthreadVideo>` clips. That handles the "product surface" beats inside the kurzgesagt narrative.
4. **Sound design:** lock-thunk + release-bell + dispute-chime SFX go in `<Audio>` tags at marked timestamps.
5. **Aspect ratios:** Day 6 evening, parametrise the root composition to render 16:9 / 9:16 / 1:1 from the same source.

The AE MCP install stays — zero downside to keeping it. We may still use AE for a one-off "exotic motion" beat if one comes up. But the spine of the video is Remotion.

## Off-plan log entry

Update `Obsidian_Vault/Projects/Vouch/OffPlanLog.md` with `D-007`:

> **D-007 — Demo video tooling: Remotion picked over AE-via-MCP for Claude-driven typography work.** Ran a same-spec 3.5 s test beat in both. Remotion produced clean output on first render and a 30.5 s gradient-swap iteration. AE-via-`ae-mcp` produced broken output (font fallback to Times, words jammed, gradient solid-coral, ghost duplicate text artifact) and requires manual Render Queue clicks per render. The MCP server itself was great — 70+ tools, 100–200 ms bridge round trips, polished bundled skill. The issue is AE's no-auto-layout + system-managed fonts + render-outside-MCP model doesn't fit a Claude-driven loop where there's no visual feedback channel. **Lesson:** for code-driven video work, pick the tool whose primitives match the driver's primitives — flexbox + CSS for code-driving Claude, AE's layer model for human-driving designers. The MCP doesn't bridge the *modality* gap, only the *automation* gap.
