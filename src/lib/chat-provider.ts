export type ChatDeliveryResult =
  | { status: "sent"; messageId: string }
  | { status: "not_configured" };

export interface OliviaChatProvider {
  send(message: string): Promise<ChatDeliveryResult>;
}

class EndpointChatProvider implements OliviaChatProvider {
  constructor(private readonly endpoint?: string) {}

  async send(message: string): Promise<ChatDeliveryResult> {
    if (!this.endpoint) return { status: "not_configured" };

    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) throw new Error("Message delivery failed");
    const data = (await response.json()) as { messageId: string };
    return { status: "sent", messageId: data.messageId };
  }
}

export const oliviaChatProvider: OliviaChatProvider = new EndpointChatProvider(
  process.env.NEXT_PUBLIC_OLIVIA_CHAT_ENDPOINT
);
