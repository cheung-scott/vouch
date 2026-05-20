"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * Ambient SVG signature: cycles waveform → blob → padlock → wordmark
 * on a 3.5s loop. The visual signature of voice → escrow → trust → brand.
 *
 * True path morphing needs flubber/MorphSVG. Here we cross-fade four distinct
 * shapes — the eye does the morphing illusion. 85% of the look, no extra deps.
 */
const SHAPES = ["waveform", "blob", "lock", "mark"] as const;
type Shape = (typeof SHAPES)[number];

const HOLD_MS = 700;
const MORPH_MS = 400;

export function MorphChain({
  size = 64,
  color = "var(--stripe-purple)",
  className,
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setI((n) => (n + 1) % SHAPES.length), HOLD_MS + MORPH_MS);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <div className={className} style={{ width: size, height: size }} aria-hidden>
      <svg viewBox="0 0 64 64" width={size} height={size} style={{ overflow: "visible" }}>
        <AnimatePresence mode="popLayout">
          <motion.g
            key={SHAPES[i]}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ duration: MORPH_MS / 1000, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "32px 32px" }}
          >
            <ShapeRenderer shape={SHAPES[i]} color={color} />
          </motion.g>
        </AnimatePresence>
      </svg>
    </div>
  );
}

function ShapeRenderer({ shape, color }: { shape: Shape; color: string }) {
  switch (shape) {
    case "waveform":
      return (
        <>
          {[18, 28, 14, 32, 22].map((h, idx) => (
            <rect
              key={idx}
              x={10 + idx * 10}
              y={32 - h / 2}
              width={4}
              height={h}
              rx={1.5}
              fill={color}
            />
          ))}
        </>
      );
    case "blob":
      return (
        <path
          d="M32 8 C 48 8, 56 20, 52 36 C 48 52, 32 56, 20 50 C 8 44, 8 24, 20 14 C 24 10, 28 8, 32 8 Z"
          fill={color}
        />
      );
    case "lock":
      return (
        <>
          <rect x={14} y={28} width={36} height={28} rx={4} fill={color} />
          <path
            d="M22 28 V 20 a 10 10 0 0 1 20 0 V 28"
            stroke={color}
            strokeWidth={4}
            fill="none"
          />
          <circle cx={32} cy={42} r={3} fill="#ffffff" />
          <rect x={31} y={42} width={2} height={6} fill="#ffffff" />
        </>
      );
    case "mark":
      return (
        <>
          <circle cx={32} cy={32} r={22} fill={color} />
          <circle cx={32} cy={32} r={8} fill="#ffffff" />
        </>
      );
  }
}
