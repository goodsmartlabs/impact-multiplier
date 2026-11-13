import type { NewsletterSubscriber } from "@/lib/pulse/types";
import { EDITIONS, formatIssueDate } from "@/lib/newsletter/schedule";
import type { Discovery, NewsletterIssue, ResourceLink } from "@/lib/newsletter/types";
import { emailConfigured, siteUrl } from "./config";

/**
 * Email delivery through Resend's REST API (server-side only). Every send
 * carries an Idempotency-Key, so a retried request can't produce a second
 * email; the newsletter_sends ledger is the primary duplicate guard.
 */

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
  idempotencyKey: string;
  unsubscribeUrl?: string;
}

export async function sendEmail(message: EmailMessage): Promise<{ id: string }> {
  if (!emailConfigured()) throw new Error("Email delivery is not configured (RESEND_API_KEY and NEWSLETTER_FROM_EMAIL).");
  const headers: Record<string, string> = {};
  if (message.unsubscribeUrl) {
    headers["List-Unsubscribe"] = `<${message.unsubscribeUrl}>`;
    headers["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": message.idempotencyKey.slice(0, 256),
    },
    body: JSON.stringify({
      from: process.env.NEWSLETTER_FROM_EMAIL,
      to: [message.to],
      reply_to: process.env.NEWSLETTER_REPLY_TO || undefined,
      subject: message.subject,
      html: message.html,
      text: message.text,
      headers,
    }),
    signal: AbortSignal.timeout(15_000),
  });
  const body = (await response.json().catch(() => ({}))) as { id?: string; message?: string };
  if (!response.ok || !body.id) throw new Error(`Email provider rejected the message (${response.status}): ${body.message ?? "unknown error"}`);
  return { id: body.id };
}

/* ---------- Rendering ---------- */

const escape = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const absolute = (href: string) => (href.startsWith("/") ? `${siteUrl()}${href}` : href);

function layout(title: string, body: string, footer: string) {
  return `<!doctype html><html><body style="margin:0;background:#f6f4ef;font-family:Arial,Helvetica,sans-serif;color:#141414">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" style="max-width:600px;background:#ffffff;border:2px solid #141414;border-radius:16px" cellpadding="0" cellspacing="0">
<tr><td style="padding:20px 24px;border-bottom:2px solid #141414"><span style="font-size:20px;font-weight:bold"><span style="color:#2b59ff">Impact</span><span style="color:#ff3e8a">Fools</span></span><div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;margin-top:6px">${escape(title)}</div></td></tr>
<tr><td style="padding:24px">${body}</td></tr>
<tr><td style="padding:16px 24px;border-top:1px solid #ddd;font-size:12px;color:#555">${footer}</td></tr>
</table></td></tr></table></body></html>`;
}

const button = (label: string, href: string) => `<a href="${escape(absolute(href))}" style="display:inline-block;background:#141414;color:#ffffff;padding:12px 20px;border-radius:999px;font-weight:bold;text-decoration:none;font-size:14px">${escape(label)}</a>`;

function discoveryHtml(discovery: Discovery, index: number) {
  return `<div style="margin:0 0 20px;padding:0 0 16px;border-bottom:1px solid #eee">
<p style="margin:0;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#ff3e8a">${index + 1}. ${escape(discovery.category)} · ${discovery.freshness === "new" ? "New this week" : "Ongoing"} · ${escape(discovery.difficulty)}</p>
<h3 style="margin:6px 0 8px;font-size:18px">${escape(discovery.name)}</h3>
<p style="margin:0 0 6px;font-size:14px"><b>What’s happening:</b> ${escape(discovery.whatsHappening)}</p>
<p style="margin:0 0 6px;font-size:14px"><b>Why it matters:</b> ${escape(discovery.whyItMatters)}</p>
<p style="margin:0 0 6px;font-size:14px"><b>Who should pay attention:</b> ${escape(discovery.whoShouldPayAttention)}</p>
<p style="margin:0 0 6px;font-size:14px"><b>First action:</b> ${escape(discovery.firstAction)}</p>
<p style="margin:0;font-size:13px"><a href="${escape(absolute(discovery.link))}">Explore this opportunity</a> · Source: <a href="${escape(discovery.sourceUrl)}">${escape(discovery.sourceName)}</a> (checked ${escape(discovery.lastVerifiedAt)})</p>
</div>`;
}

const resourceLine = (resource: ResourceLink) => `<li style="margin:0 0 6px"><a href="${escape(absolute(resource.href))}">${escape(resource.title)}</a> — ${escape(resource.accessLabel)}</li>`;

export function renderIssueEmail(issue: NewsletterIssue, subscriber: Pick<NewsletterSubscriber, "unsubscribeToken" | "goals">) {
  const manageUrl = `${siteUrl()}/newsletter/manage?token=${encodeURIComponent(subscriber.unsubscribeToken)}`;
  const unsubscribeUrl = `${siteUrl()}/api/newsletter/unsubscribe?token=${encodeURIComponent(subscriber.unsubscribeToken)}`;
  const webUrl = `${siteUrl()}/newsletter/${issue.slug}`;
  const edition = EDITIONS[issue.kind];
  const footer = `You’re receiving this because you subscribed to the ImpactFools newsletter and confirmed your email. <a href="${escape(manageUrl)}">Manage preferences</a> · <a href="${escape(unsubscribeUrl)}">Unsubscribe</a>`;
  const textLines: string[] = [`${edition.label} — ${formatIssueDate(issue.issueDate)}`, ""];
  let body = `<p style="margin:0 0 4px;font-size:12px;color:#555">${escape(formatIssueDate(issue.issueDate))} · <a href="${escape(webUrl)}">Read on the web</a></p>`;

  if (issue.content.kind === "whats_hot") {
    const content = issue.content;
    body += `<h1 style="font-size:26px;margin:8px 0 12px">The Big Picture</h1><p style="font-size:15px;font-weight:bold;margin:0 0 8px">${escape(content.bigPicture.headline)}</p><ul style="padding-left:18px;font-size:14px">${content.bigPicture.points.map((point) => `<li style="margin:0 0 6px">${escape(point)}</li>`).join("")}</ul>`;
    body += `<h2 style="font-size:22px;margin:24px 0 12px">What’s Hot This Week</h2>${content.discoveries.map(discoveryHtml).join("")}`;
    if (content.opportunityMatch.length) body += `<h2 style="font-size:20px;margin:24px 0 8px">Opportunity Match</h2><ul style="padding-left:18px;font-size:14px">${content.opportunityMatch.map((match) => `<li style="margin:0 0 6px"><b>${escape(match.goalLabel)}:</b> ${escape(match.note)}</li>`).join("")}</ul>`;
    body += `<h2 style="font-size:20px;margin:24px 0 8px">${escape(content.action.headline)}</h2><p style="font-size:14px">${escape(content.action.body)}</p><ul style="padding-left:18px;font-size:14px">${content.action.resources.map(resourceLine).join("")}</ul><p style="margin:20px 0 0">${button("DISCOVER WHAT’S HOT", `/newsletter/${issue.slug}`)}</p>`;
    textLines.push("THE BIG PICTURE", content.bigPicture.headline, ...content.bigPicture.points.map((point) => `- ${point}`), "", "WHAT’S HOT THIS WEEK");
    content.discoveries.forEach((discovery, index) => textLines.push(`${index + 1}. ${discovery.name}`, `   ${discovery.whyItMatters}`, `   First action: ${discovery.firstAction}`, `   ${absolute(discovery.link)}`, `   Source: ${discovery.sourceName} ${discovery.sourceUrl}`, ""));
  } else {
    const content = issue.content;
    const goals = subscriber.goals?.length ? `?goals=${encodeURIComponent(subscriber.goals.join(","))}` : "";
    const top3Url = `/newsletter/top-3${goals}`;
    body += `<h1 style="font-size:26px;margin:8px 0 12px">${escape(content.intro.headline)}</h1><p style="font-size:15px">${escape(content.intro.body)}</p><p style="margin:16px 0 24px">${button("FIND MY TOP 3", top3Url)}</p>`;
    body += `<h2 style="font-size:20px;margin:0 0 8px">How it adapts to you</h2>${content.examples.map((example) => `<div style="margin:0 0 14px"><p style="margin:0;font-size:12px;color:#555">${escape(example.profile)}</p><p style="margin:4px 0;font-size:15px;font-weight:bold">${escape(example.recommendation.title)}</p><p style="margin:0;font-size:13px">Success looks like: ${escape(example.recommendation.success)}</p></div>`).join("")}`;
    if (content.featured.length) body += `<h2 style="font-size:20px;margin:24px 0 8px">Featured this weekend</h2>${content.featured.map(discoveryHtml).join("")}`;
    body += `<h2 style="font-size:20px;margin:24px 0 8px">This weekend</h2><ul style="padding-left:18px;font-size:14px">${content.practicalActions.map((action) => `<li style="margin:0 0 6px">${escape(action)}</li>`).join("")}</ul><p style="margin:20px 0 0">${button("BUILD MY WEEKEND PLAN", top3Url)}</p>`;
    textLines.push(content.intro.headline, content.intro.body, "", `FIND MY TOP 3: ${absolute(top3Url)}`, "");
    content.examples.forEach((example) => textLines.push(`${example.profile}: ${example.recommendation.title}`));
  }
  textLines.push("", `Read on the web: ${webUrl}`, `Manage preferences: ${manageUrl}`, `Unsubscribe: ${unsubscribeUrl}`);
  return {
    subject: `${edition.emoji} ${edition.short} — ${formatIssueDate(issue.issueDate, "short")}`,
    html: layout(edition.label, body, footer),
    text: textLines.join("\n"),
    unsubscribeUrl,
  };
}

export function renderVerificationEmail(verifyToken: string) {
  const url = `${siteUrl()}/newsletter/verify?token=${encodeURIComponent(verifyToken)}`;
  const body = `<h1 style="font-size:24px;margin:0 0 12px">Confirm your subscription</h1><p style="font-size:15px">Tap the button to confirm you want the ImpactFools newsletter: <b>What’s Hot</b> on Mondays and <b>Your Weekend Top 3</b> on Fridays, at 7:00 AM Juba time.</p><p style="margin:20px 0">${button("Confirm my subscription", `/newsletter/verify?token=${encodeURIComponent(verifyToken)}`)}</p><p style="font-size:13px;color:#555">If you didn’t sign up, ignore this email — you won’t be subscribed.</p>`;
  return {
    subject: "Confirm your ImpactFools newsletter subscription",
    html: layout("Confirm your email", body, "This link confirms one subscription. It can only be used by someone with access to this inbox."),
    text: `Confirm your ImpactFools newsletter subscription:\n${url}\n\nIf you didn’t sign up, ignore this email.`,
  };
}
