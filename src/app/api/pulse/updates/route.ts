import { NextResponse } from "next/server";
import { getPublicUpdates } from "@/lib/server/pulse/repository";

/** Public, read-only list of live updates (used by site search). */
export async function GET() {
  const updates = await getPublicUpdates();
  return NextResponse.json({ updates }, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } });
}
