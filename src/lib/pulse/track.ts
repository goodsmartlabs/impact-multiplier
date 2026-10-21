"use client";

import type { PulseEventType } from "./types";

/** Fire-and-forget engagement counter. Sends only the update id and event type. */
export function trackPulse(updateId: string, type: PulseEventType) {
  try {
    const body = JSON.stringify({ updateId, type });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/pulse/events", new Blob([body], { type: "application/json" }));
    else void fetch("/api/pulse/events", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true });
  } catch {
    // Analytics must never break the page.
  }
}
