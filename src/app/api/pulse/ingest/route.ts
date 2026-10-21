import { NextResponse } from "next/server";
import { getAgent } from "@/lib/pulse/agents";
import { validateUpdateInput } from "@/lib/pulse/validate";
import { verifyIngestToken } from "@/lib/server/admin-auth";
import { createUpdate, getPulseStore } from "@/lib/server/pulse/repository";

/**
 * Agent ingestion endpoint.
 *
 * POST /api/pulse/ingest
 * Authorization: Bearer <PULSE_INGEST_TOKEN>
 * { "agent": "job-spy", "updates": [ { title, category, summary, signal, sourceName, sourceUrl, cta, … } ] }
 *
 * Every accepted record is stored as "pending_review". Nothing an agent
 * submits is published until an editor approves it in /admin.
 */
export async function POST(request: Request) {
  if (!verifyIngestToken(request.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (getPulseStore().kind === "none") {
    return NextResponse.json({ error: "Storage is not configured." }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body must be JSON." }, { status: 400 });
  }

  const agent = typeof body.agent === "string" ? getAgent(body.agent) : undefined;
  if (!agent) return NextResponse.json({ error: "Unknown agent id." }, { status: 400 });
  const records = Array.isArray(body.updates) ? body.updates.slice(0, 50) : [];
  if (!records.length) return NextResponse.json({ error: "Provide 1–50 records in `updates`." }, { status: 400 });

  const results: Array<{ index: number; id?: string; slug?: string; errors?: string[] }> = [];
  for (const [index, record] of records.entries()) {
    const validation = validateUpdateInput(record, { submittedBy: agent.id });
    if (!validation.ok) {
      results.push({ index, errors: validation.errors });
      continue;
    }
    const value = validation.value;
    if (!agent.categories.includes(value.category)) {
      results.push({ index, errors: [`${agent.name} cannot submit to the “${value.category}” category.`] });
      continue;
    }
    // Agents can propose, never publish or self-certify. Only the Impact Editor's
    // verification pass may mark a record verified (and it still needs approval).
    const verification = agent.id === "impact-editor" && value.verification === "verified" ? "verified" : "unverified";
    try {
      const created = await createUpdate({ ...value, status: "pending_review", featured: false, verification, submittedBy: agent.id });
      results.push({ index, id: created.id, slug: created.slug });
    } catch (error) {
      results.push({ index, errors: [error instanceof Error ? error.message : "Could not store record."] });
    }
  }

  const accepted = results.filter((result) => result.id).length;
  return NextResponse.json({ accepted, rejected: results.length - accepted, results }, { status: accepted ? 201 : 422 });
}
