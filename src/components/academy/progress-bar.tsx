import { cn } from "@/lib/utils";

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-ink/10", className)}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-pink to-blue transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
