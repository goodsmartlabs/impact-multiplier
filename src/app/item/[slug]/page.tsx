import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { DISCOVERY_ITEMS, getDiscoveryItemBySlug } from "@/lib/data/discovery-items";
import { getCourseBySlug } from "@/lib/data/courses";
import { DetailSection } from "@/components/ui/detail-section";
import { IncreaseTags } from "@/components/ui/increase-tags";
import { StatusPill } from "@/components/ui/status-pill";
import { SaveButton } from "@/components/ui/save-button";
import { StartImpactMoveButton } from "@/components/discovery/start-impact-move-button";
import { WhyThisFitsYou } from "@/components/discovery/why-this-fits-you";
import { DiscoveryCard } from "@/components/discovery/discovery-card";
import { TYPE_LABELS } from "@/lib/data/constants";
import { computeOpportunityStatus, isTimeSensitive } from "@/lib/opportunity";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return DISCOVERY_ITEMS.map((item) => ({ slug: item.slug }));
}

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getDiscoveryItemBySlug(slug);
  if (!item) notFound();

  const status = isTimeSensitive(item) ? computeOpportunityStatus(item) : item.status;
  const linkedCourse = item.academyCourseSlug ? getCourseBySlug(item.academyCourseSlug) : undefined;
  const related = (item.relatedItemSlugs ?? [])
    .map((s) => getDiscoveryItemBySlug(s))
    .filter((v): v is NonNullable<typeof v> => !!v);

  const meta: { label: string; value: string }[] = [];
  if (item.timeRequirement) meta.push({ label: "Time Commitment", value: item.timeRequirement });
  if (item.estimatedCost) meta.push({ label: "Cost", value: item.estimatedCost });
  if (item.deadline) meta.push({ label: "Deadline", value: formatDate(item.deadline) });
  if (item.location) meta.push({ label: "Location", value: item.location });
  if (item.difficulty) meta.push({ label: "Difficulty", value: item.difficulty });
  if (item.eligibility) meta.push({ label: "Eligibility", value: item.eligibility });

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-6 md:px-6 md:pt-10">
      <Link
        href="/explore"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Explore
      </Link>

      <div className="mb-4 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">
          {item.categoryLabel}
        </span>
        {status && <StatusPill status={status} />}
      </div>

      <h1 className="font-display text-3xl font-medium leading-tight tracking-tight text-ink md:text-4xl">
        {item.title}
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-muted">{item.shortDescription}</p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <SaveButton itemId={item.id} itemKind="discovery" size="md" />
        <StartImpactMoveButton title={item.title} sourceItemSlug={item.slug} />
      </div>

      {item.increaseAreas.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
            What this could increase
          </p>
          <IncreaseTags areas={item.increaseAreas} />
        </div>
      )}

      <WhyThisFitsYou item={item} />

      {linkedCourse && (
        <Link
          href={`/academy/${linkedCourse.slug}`}
          className="mt-6 flex items-center justify-between rounded-2xl border border-blue bg-blue-dim px-5 py-4 text-blue transition-opacity hover:opacity-90"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide">We teach this</p>
            <p className="font-display text-lg">{linkedCourse.title}</p>
          </div>
          <span className="text-sm font-semibold">View Class →</span>
        </Link>
      )}

      {!linkedCourse && item.externalCourseUrl && (
        <a
          href={item.externalCourseUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex items-center justify-between rounded-2xl border border-line px-5 py-4 transition-colors hover:border-ink"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              External course
            </p>
            <p className="font-display text-lg text-ink">Visit official course page</p>
          </div>
          <ExternalLink className="h-5 w-5 text-muted" />
        </a>
      )}

      <div className="mt-6">
        <DetailSection title="What Is It?">
          <p className="whitespace-pre-line">{item.fullDescription}</p>
        </DetailSection>

        {item.whyItMatters && (
          <DetailSection title="Why It Matters">
            <p>{item.whyItMatters}</p>
          </DetailSection>
        )}

        {item.whyNow && (
          <DetailSection title="Why Now?">
            <p>{item.whyNow}</p>
          </DetailSection>
        )}

        {item.whoItsFor && (
          <DetailSection title="Who It's For">
            <p>{item.whoItsFor}</p>
          </DetailSection>
        )}

        {meta.length > 0 && (
          <DetailSection title="Details">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
              {meta.map((m) => (
                <div key={m.label}>
                  <dt className="text-xs text-muted">{m.label}</dt>
                  <dd className="font-medium capitalize text-ink">{m.value}</dd>
                </div>
              ))}
            </dl>
          </DetailSection>
        )}

        {item.requirements && item.requirements.length > 0 && (
          <DetailSection title="Requirements">
            <ul className="list-inside list-disc space-y-1">
              {item.requirements.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </DetailSection>
        )}

        {item.whatYoullNeed && item.whatYoullNeed.length > 0 && (
          <DetailSection title="What You'll Need">
            <ul className="list-inside list-disc space-y-1">
              {item.whatYoullNeed.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </DetailSection>
        )}

        {item.whatYoullLearn && item.whatYoullLearn.length > 0 && (
          <DetailSection title="What You'll Learn">
            <ul className="list-inside list-disc space-y-1">
              {item.whatYoullLearn.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </DetailSection>
        )}

        {item.whatYouCouldDoWithIt && (
          <DetailSection title="What You Could Do With It">
            <p>{item.whatYouCouldDoWithIt}</p>
          </DetailSection>
        )}

        {item.howToGetStarted && (
          <DetailSection title="How to Get Started">
            <p>{item.howToGetStarted}</p>
          </DetailSection>
        )}

        {item.howToApply && (
          <DetailSection title="How to Apply">
            <p>{item.howToApply}</p>
          </DetailSection>
        )}

        {item.howToLearnIt && (
          <DetailSection title="How to Learn It">
            <p>{item.howToLearnIt}</p>
          </DetailSection>
        )}

        {item.howToProveIt && (
          <DetailSection title="How to Prove It">
            <p>{item.howToProveIt}</p>
          </DetailSection>
        )}

        {item.economicApplication && (
          <DetailSection title="Economic Application">
            <p>{item.economicApplication}</p>
          </DetailSection>
        )}

        {related.length > 0 && (
          <DetailSection title="Related">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {related.map((r) => (
                <DiscoveryCard key={r.id} item={r} />
              ))}
            </div>
          </DetailSection>
        )}

        {(item.sources?.length || item.sourceUrl) && (
          <DetailSection title="Sources">
            <ul className="space-y-1">
              {item.sources?.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline">
                    {s.name}
                  </a>
                </li>
              ))}
              {!item.sources?.length && item.sourceUrl && (
                <li>
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {item.sourceName ?? "Official link"}
                  </a>
                </li>
              )}
            </ul>
            {item.lastVerified && (
              <p className="mt-3 text-xs text-muted">Last verified {formatDate(item.lastVerified)}</p>
            )}
            {item.status === "sample" && (
              <p className="mt-1 text-xs text-muted">
                This is sample demo data, not a live verified opportunity.
              </p>
            )}
          </DetailSection>
        )}
      </div>

      <p className="mt-8 text-xs text-muted">{TYPE_LABELS[item.type]}</p>
    </div>
  );
}
