/**
 * Email delivery boundary for The Impact Brief.
 *
 * No provider is connected yet, so nothing is ever sent and the UI says so.
 * To enable delivery, implement `sendEdition` with a provider (e.g. Resend,
 * Postmark) and set NEWSLETTER_EMAIL_PROVIDER + its API key. Every email must
 * include the subscriber's /pulse/brief/manage?token=… link to unsubscribe.
 */
export function emailDeliveryConfigured(): boolean {
  return false;
}

export async function sendEdition(): Promise<{ sent: number }> {
  throw new Error("Email delivery is not configured. Editions are published to the web archive only.");
}
