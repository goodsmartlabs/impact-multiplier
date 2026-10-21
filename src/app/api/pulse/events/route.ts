import { NextResponse } from "next/server";
import { getPulseStore } from "@/lib/server/pulse/repository";
import type { PulseEventType } from "@/lib/pulse/types";

const TYPES = new Set<PulseEventType>(["view", "save", "cta_click", "source_click"]);

/** Anonymous engagement counts for the editorial dashboard. Stores no personal data. */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  const updateId = typeof body.updateId === "string" ? body.updateId.slice(0, 80) : "";
  const type = body.type as PulseEventType;
  if (!updateId || !TYPES.has(type)) return new NextResponse(null, { status: 400 });
  try {
    await getPulseStore().recordEvent(updateId, type);
  } catch (error) {
    console.error("[impact-pulse] event failed", error);
  }
  return new NextResponse(null, { status: 204 });
}
