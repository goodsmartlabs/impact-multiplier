export type InterestNotification = {
  leadId: string;
  learnerName: string;
  courseSlugs: string[];
};

// Provider-independent boundary. Connect email/WhatsApp here later without coupling
// lead storage to a particular notification vendor.
export async function notifyOwnerOfInterest(_lead: InterestNotification): Promise<void> {
  void _lead;
  return;
}
