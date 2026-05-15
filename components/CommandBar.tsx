"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandBarProps {
  className?: string;
}

/**
 * ⌘K command bar — Linear muscle-memory pattern.
 *
 * Stub for Day 1+: opens on ⌘K / Ctrl+K, shows search + recent deals + actions.
 * Currently just renders the trigger; the floating panel is built out
 * during the app-shell work.
 *
 * Required on every app screen per DESIGN.md §4.
 */
export function CommandBar({ className }: CommandBarProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        type="button"
        className={cn(
          "flex w-72 items-center gap-2 rounded-md border border-ink/10 bg-white px-3 py-1.5",
          "text-xs text-ink-muted transition-colors hover:border-ink/20",
          "focus-within:border-indigo focus-within:ring-2 focus-within:ring-indigo/10",
          className,
        )}
      >
        <Search className="h-3.5 w-3.5" />
        <span className="flex-1 text-left">Search deals, people, or amounts…</span>
        <kbd className="ml-auto rounded border border-ink/10 bg-cream-alt px-1.5 py-0.5 font-mono text-[10px]">
          ⌘ K
        </kbd>
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-32 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass w-full max-w-xl rounded-xl p-2 shadow-lg"
          >
            <input
              autoFocus
              placeholder="Search anything…"
              className="w-full rounded-md bg-transparent px-4 py-3 font-mono text-sm outline-none placeholder:text-ink-dim"
            />
            <div className="border-t border-ink/10 px-4 py-3 text-xs text-ink-muted">
              Day 1 stub — wire to real search index when product code lands.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
