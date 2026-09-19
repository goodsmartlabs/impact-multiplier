"use client";

import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";
import { useImpactMovesStore } from "@/lib/store/impact-moves-store";
import { cn } from "@/lib/utils";

export function StartImpactMoveButton({
  title,
  sourceItemSlug,
  sourceCourseSlug,
  className,
  label = "Start as Impact Move",
}: {
  title: string;
  sourceItemSlug?: string;
  sourceCourseSlug?: string;
  className?: string;
  label?: string;
}) {
  const router = useRouter();
  const createMove = useImpactMovesStore((s) => s.createMove);

  return (
    <button
      type="button"
      onClick={() => {
        const id = createMove({ title, sourceItemSlug, sourceCourseSlug });
        router.push(`/impact-moves/${id}`);
      }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper transition-opacity hover:opacity-90",
        className
      )}
    >
      <Zap className="h-4 w-4" />
      {label}
    </button>
  );
}
