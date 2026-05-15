interface DesignPendingPlaceholderProps {
  /** Short label saying what surface this represents. */
  surface: string;
  /** What the final design should accomplish. */
  intent: string;
  /** Optional: notes about what the spec needs to cover. */
  notes?: string[];
}

/**
 * Loud visual marker for a /demo wow-moment whose design is pending user input.
 * Renders an obviously-incomplete dashed-border block so reviewers know what's
 * placeholder vs final.
 *
 * Per the Day 1 conversation: the eBay overlay entry, time-skip transition,
 * and dispute-resolution panel are deferred to user-led v0/Figma iteration.
 */
export function DesignPendingPlaceholder({
  surface,
  intent,
  notes,
}: DesignPendingPlaceholderProps) {
  return (
    <section className="rounded-2xl border-2 border-dashed border-[#c98a42]/50 bg-[#c98a42]/8 p-7 text-[#5a5548]">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#c98a42]">
        Design pending · {surface}
      </p>
      <h3 className="mt-2 font-display text-xl font-semibold leading-tight text-[#2a2924]">
        {intent}
      </h3>
      {notes && notes.length > 0 && (
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
          {notes.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      )}
      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-[#8a8478]">
        Iterate visually in v0 or Figma → slot the final composition into this surface
      </p>
    </section>
  );
}
