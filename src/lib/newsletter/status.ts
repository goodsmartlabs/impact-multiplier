import type { IssueStatus } from "./types";

export const ISSUE_STATUS_LABEL: Record<IssueStatus, string> = {
  draft: "Draft",
  awaiting_approval: "Awaiting approval",
  scheduled: "Approved · scheduled",
  published: "Published",
  archived: "Archived",
  failed: "Blocked",
};
