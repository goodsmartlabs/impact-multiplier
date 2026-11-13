import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { runSchedule } from "@/lib/server/newsletter/pipeline";
import { bearerMatches } from "@/lib/server/newsletter/auth";
import { NEWSLETTER_CACHE_TAG } from "@/lib/server/newsletter/store";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Daily scheduler. Vercel Cron calls this at 05:00 UTC (07:00 Africa/Juba)
 * with `Authorization: Bearer $CRON_SECRET`. It prepares drafts the day
 * before each edition and publishes on Monday and Friday.
 */
export async function GET(request: Request) {
  if (!bearerMatches(request, process.env.CRON_SECRET)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const results = await runSchedule({ trigger: "cron" });
  if (results.some((result) => result.action === "publish" && result.outcome === "success")) {
    revalidateTag(NEWSLETTER_CACHE_TAG, "max");
    revalidatePath("/", "layout");
  }
  const failed = results.some((result) => result.outcome === "failed");
  return NextResponse.json({ ok: !failed, results }, { status: failed ? 500 : 200 });
}
