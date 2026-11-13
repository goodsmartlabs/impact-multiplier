import { NextResponse } from "next/server";
import { bearerMatches } from "@/lib/server/newsletter/auth";
import { siteUrl } from "@/lib/server/newsletter/config";
import { getArchive, getPublicIssue } from "@/lib/server/newsletter/repository";
import { toSocialExport } from "@/lib/newsletter/social";
import type { EditionKind } from "@/lib/newsletter/types";

export const dynamic = "force-dynamic";

/**
 * Rulo Social export. Bearer RULO_SOCIAL_TOKEN.
 *   GET /api/social/newsletter?edition=monday|friday   latest published edition
 *   GET /api/social/newsletter?slug=whats-hot-2026-11-16
 * Returns public, published content only — never subscribers or anyone's personal Top 3.
 */
export async function GET(request: Request) {
  if (!bearerMatches(request, process.env.RULO_SOCIAL_TOKEN, 24)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const params = new URL(request.url).searchParams;
  const slug = params.get("slug");
  const edition = params.get("edition");
  const kind: EditionKind | null = edition === "monday" || edition === "whats_hot" ? "whats_hot" : edition === "friday" || edition === "weekend_top3" ? "weekend_top3" : null;
  if (!slug && !kind) return NextResponse.json({ error: "Pass ?edition=monday|friday or ?slug=…" }, { status: 400 });

  const issue = slug ? await getPublicIssue(slug) : (await getArchive(kind!))[0] ?? null;
  if (!issue) return NextResponse.json({ error: "No published edition found." }, { status: 404 });
  return NextResponse.json(toSocialExport(issue, siteUrl()), { headers: { "Cache-Control": "no-store" } });
}
