import { Card, Eyebrow } from "@/components/ui";

type EvalResult = {
  result: "success" | "failure" | "unknown";
  rationale: string;
};

type VeraAnalysisCardProps = {
  summary?: string;
  evalResults?: Record<string, EvalResult>;
};

// Maps the 4 ConvAI-dashboard criterion identifiers to human labels. Kept
// inline (vs a shared dict) — only 4 entries, and the labels are display
// concerns that don't belong in the API contract.
const CRITERION_LABELS: Record<string, string> = {
  did_both_sides_agree: "Both sides agreed",
  agreed_price_captured: "Price captured",
  delivery_window_set: "Delivery window set",
  no_red_flags: "No red flags",
};

const RESULT_STYLE: Record<
  EvalResult["result"],
  { icon: string; fg: string; bg: string; border: string; label: string }
> = {
  success: {
    icon: "✓",
    fg: "#2f7d57",
    bg: "rgba(47,125,87,0.08)",
    border: "rgba(47,125,87,0.25)",
    label: "PASS",
  },
  failure: {
    icon: "✕",
    fg: "#b54a3a",
    bg: "rgba(181,74,58,0.08)",
    border: "rgba(181,74,58,0.25)",
    label: "FAIL",
  },
  unknown: {
    icon: "?",
    fg: "#8a8478",
    bg: "rgba(50,30,5,0.05)",
    border: "rgba(50,30,5,0.12)",
    label: "UNKNOWN",
  },
};

function humanise(key: string): string {
  return (
    CRITERION_LABELS[key] ??
    key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

/**
 * Renders Vera's post-call self-evaluation: ElevenLabs ConvAI's auto-generated
 * `transcript_summary` plus the per-criterion `evaluation_criteria_results`
 * configured in the dashboard. Persisted by /api/vera/post-call-webhook.
 *
 * Renders nothing when both fields are absent — keeps the deal page clean
 * for deals that pre-date this feature.
 */
export function VeraAnalysisCard({
  summary,
  evalResults,
}: VeraAnalysisCardProps) {
  const entries = evalResults ? Object.entries(evalResults) : [];
  if (!summary && entries.length === 0) return null;

  return (
    <Card tone="indigo">
      <Eyebrow tone="indigo">Vera&rsquo;s analysis</Eyebrow>
      <h2 className="mt-2 font-display text-xl font-semibold">
        Self-graded after the session
      </h2>

      {summary && (
        <p className="mt-4 text-sm leading-relaxed text-[#2a2924]">{summary}</p>
      )}

      {entries.length > 0 && (
        <ul className="mt-5 flex flex-col gap-2">
          {entries.map(([key, value]) => {
            const style = RESULT_STYLE[value.result];
            return (
              <li
                key={key}
                className="rounded-md border px-4 py-3"
                style={{
                  borderColor: style.border,
                  backgroundColor: style.bg,
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="grid h-6 w-6 place-items-center rounded-full font-mono text-xs font-semibold"
                    style={{ color: style.fg, backgroundColor: "white" }}
                  >
                    {style.icon}
                  </span>
                  <span className="text-sm font-medium text-[#2a2924]">
                    {humanise(key)}
                  </span>
                  <span
                    className="ml-auto font-mono text-[10px] uppercase tracking-[0.12em]"
                    style={{ color: style.fg }}
                  >
                    {style.label}
                  </span>
                </div>
                {value.rationale && (
                  <p className="mt-1.5 pl-9 text-xs text-[#5a5548]">
                    {value.rationale}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
