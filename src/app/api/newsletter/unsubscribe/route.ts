import { NextResponse } from "next/server";
import { getPulseStore } from "@/lib/server/pulse/repository";

/** RFC 8058 one-click unsubscribe (mail clients POST here). */
export async function POST(request: Request) {
  const token = new URL(request.url).searchParams.get("token")?.trim() ?? "";
  if (token.length < 20) return NextResponse.json({ error: "Invalid link." }, { status: 400 });
  const store = getPulseStore();
  if (store.kind === "none") return NextResponse.json({ error: "Not available." }, { status: 503 });
  const subscriber = await store.findSubscriber({ token });
  if (subscriber && subscriber.status !== "unsubscribed") await store.patchSubscriber(subscriber.id, { status: "unsubscribed", unsubscribedAt: new Date().toISOString() });
  return NextResponse.json({ ok: true });
}

/** A person clicking the link lands on the manage page, which asks before unsubscribing. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token") ?? "";
  return NextResponse.redirect(new URL(`/newsletter/manage?token=${encodeURIComponent(token)}&unsubscribe=1`, url.origin), 303);
}
