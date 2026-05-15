import { cn } from "@/lib/utils";

interface DemoModeBannerProps {
  className?: string;
}

/**
 * Small mono ribbon shown on /demo/* surfaces so judges know they're in the
 * interactive walkthrough vs. the live product. Sticks under the page header.
 */
export function DemoModeBanner({ className }: DemoModeBannerProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border border-[#5266eb]/30 bg-[#5266eb]/8 px-3 py-1.5",
        className,
      )}
      role="status"
    >
      <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#5266eb]" />
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#5266eb]">
        Demo mode · interactive walkthrough · no real money moves
      </span>
    </div>
  );
}
