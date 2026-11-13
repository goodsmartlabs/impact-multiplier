import { GOALS } from "./top3-questions";
import { EDITIONS, formatIssueDate } from "./schedule";
import type { NewsletterIssue } from "./types";

/**
 * The structured payload Rulo Social turns into Monday / Friday campaigns.
 * Built only from a published issue's public content.
 */
export function toSocialExport(issue: NewsletterIssue, site: string) {
  const url = (href: string) => (href.startsWith("/") ? `${site}${href}` : href);
  const edition = EDITIONS[issue.kind];
  const common = {
    schema: "impactfools.newsletter.social/v1",
    edition: issue.kind === "whats_hot" ? "monday" : "friday",
    kind: issue.kind,
    title: issue.title,
    issueDate: issue.issueDate,
    issueDateLabel: formatIssueDate(issue.issueDate),
    publishedAt: issue.publishedAt,
    newsletterUrl: url(`/newsletter/${issue.slug}`),
    subscribeUrl: url("/newsletter#subscribe"),
    findMyTop3Url: url("/newsletter/top-3"),
    hashtags: ["#ImpactFools", issue.kind === "whats_hot" ? "#WhatsHot" : "#WeekendTop3"],
  };

  if (issue.content.kind === "whats_hot") {
    const { discoveries, bigPicture, opportunityMatch } = issue.content;
    return {
      ...common,
      headline: bigPicture.headline,
      insights: bigPicture.points,
      discoveries: discoveries.map((discovery) => ({
        name: discovery.name,
        category: discovery.category,
        freshness: discovery.freshness,
        hook: discovery.whyItMatters,
        whatsHappening: discovery.whatsHappening,
        whoShouldPayAttention: discovery.whoShouldPayAttention,
        firstAction: discovery.firstAction,
        difficulty: discovery.difficulty,
        link: url(discovery.link),
        source: { name: discovery.sourceName, url: discovery.sourceUrl, lastVerifiedAt: discovery.lastVerifiedAt },
      })),
      audienceSegments: opportunityMatch.map((match) => ({ goal: match.goalLabel, discoveries: match.discoveryIds.map((id) => discoveries.find((discovery) => discovery.id === id)?.name).filter(Boolean) })),
      ctas: [
        { label: "DISCOVER WHAT’S HOT", url: common.newsletterUrl },
        { label: "FIND MY TOP 3", url: common.findMyTop3Url },
      ],
      campaignAngles: [
        `${edition.emoji} ${bigPicture.headline}`,
        ...discoveries.slice(0, 3).map((discovery) => `Who should pay attention: ${discovery.whoShouldPayAttention}`),
      ],
    };
  }

  const { intro, featured, examples, practicalActions } = issue.content;
  return {
    ...common,
    headline: intro.headline,
    featuredOpportunities: featured.map((discovery) => ({ name: discovery.name, hook: discovery.whyItMatters, link: url(discovery.link), deadline: discovery.deadline, source: { name: discovery.sourceName, url: discovery.sourceUrl } })),
    goalExamples: examples.map((example) => ({ profile: example.profile, goals: example.goalLabels, project: example.recommendation.title, successLooksLike: example.recommendation.success, link: url(example.recommendation.href) })),
    practicalActions,
    goals: GOALS.map((goal) => goal.label),
    ctas: [
      { label: "FIND MY TOP 3", url: common.findMyTop3Url },
      { label: "BUILD MY WEEKEND PLAN", url: common.findMyTop3Url },
    ],
    campaignAngles: [
      intro.headline,
      ...examples.map((example) => `${example.profile}? Try: ${example.recommendation.title}.`),
    ],
  };
}
