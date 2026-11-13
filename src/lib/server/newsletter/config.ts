/** Every environment switch the newsletter engine reads, in one place. */
export function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://impactfools.innergency.com";
  return raw.replace(/\/$/, "");
}

/** Approval mode is the default: drafts wait for an editor unless this is "true". */
export function autoPublishEnabled(): boolean {
  return process.env.NEWSLETTER_AUTO_PUBLISH === "true";
}

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.NEWSLETTER_FROM_EMAIL);
}

/** Emails go out on publish when a provider is configured, unless explicitly switched off. */
export function emailSendingEnabled(): boolean {
  return emailConfigured() && process.env.NEWSLETTER_SEND_EMAIL !== "false";
}

export function cronConfigured(): boolean {
  return (process.env.CRON_SECRET ?? "").length >= 16;
}

export function socialExportConfigured(): boolean {
  return (process.env.RULO_SOCIAL_TOKEN ?? "").length >= 24;
}

export function newsletterConfigSummary() {
  return {
    autoPublish: autoPublishEnabled(),
    email: emailConfigured(),
    emailSending: emailSendingEnabled(),
    cron: cronConfigured(),
    socialExport: socialExportConfigured(),
    siteUrl: siteUrl(),
  };
}
