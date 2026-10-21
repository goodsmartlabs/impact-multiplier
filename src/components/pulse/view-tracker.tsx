"use client";

import { useEffect } from "react";
import { trackPulse } from "@/lib/pulse/track";

/** Counts one anonymous view per page visit for the editorial dashboard. */
export function ViewTracker({ updateId }: { updateId: string }) {
  useEffect(() => {
    trackPulse(updateId, "view");
  }, [updateId]);
  return null;
}
