import type { ChallengeResource } from "./types";

/**
 * External links point only to official product homepages or top-level
 * documentation, so they stay valid as vendors reorganise their sites.
 * Bundled datasets are fictional and live in /public/challenge-data.
 */
export const RESOURCES: ChallengeResource[] = [
  // AI assistants
  { id: "claude-prompting", title: "Prompt engineering overview", provider: "Anthropic", url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview", kind: "docs", note: "How to write clear instructions, give examples and structure prompts — applies to any AI assistant." },
  { id: "claude", title: "Claude", provider: "Anthropic", url: "https://claude.ai", kind: "tool", note: "AI assistant for drafting, classifying and summarising text inside your workflows." },
  { id: "chatgpt", title: "ChatGPT", provider: "OpenAI", url: "https://chatgpt.com", kind: "tool", note: "Alternative AI assistant; the prompting skills in this challenge transfer directly." },

  // Automation
  { id: "zapier", title: "Zapier", provider: "Zapier", url: "https://zapier.com", kind: "tool", note: "Beginner-friendly automation. Free plan supports simple two-step workflows." },
  { id: "make", title: "Make", provider: "Make", url: "https://www.make.com", kind: "tool", note: "Visual automation builder with branching and data mapping on its free tier." },
  { id: "n8n-docs", title: "n8n documentation", provider: "n8n", url: "https://docs.n8n.io", kind: "docs", note: "Open-source automation tool you can self-host; docs include beginner courses." },
  { id: "google-forms", title: "Google Forms", provider: "Google", url: "https://forms.google.com", kind: "tool", note: "Free way to collect enquiries that can trigger an automation." },

  // Spreadsheets & BI
  { id: "google-sheets", title: "Google Sheets", provider: "Google", url: "https://sheets.google.com", kind: "tool", note: "Free spreadsheet with pivot tables, charts and sharing links for proof." },
  { id: "excel", title: "Microsoft Excel", provider: "Microsoft", url: "https://www.microsoft.com/microsoft-365/excel", kind: "tool", note: "Industry-standard spreadsheet; the free web version covers this challenge." },
  { id: "power-bi", title: "Power BI", provider: "Microsoft", url: "https://www.microsoft.com/power-platform/products/power-bi", kind: "tool", note: "Business intelligence tool; Power BI Desktop is free on Windows." },
  { id: "power-bi-docs", title: "Power BI documentation", provider: "Microsoft Learn", url: "https://learn.microsoft.com/power-bi/", kind: "docs", note: "Official guides and free learning paths for Power BI." },
  { id: "looker-studio", title: "Looker Studio", provider: "Google", url: "https://lookerstudio.google.com", kind: "tool", note: "Free dashboard tool that connects directly to Google Sheets." },

  // Marketing
  { id: "canva", title: "Canva", provider: "Canva", url: "https://www.canva.com", kind: "tool", note: "Design social posts, carousels and simple ads from templates." },
  { id: "meta-business-suite", title: "Meta Business Suite", provider: "Meta", url: "https://business.facebook.com", kind: "tool", note: "Plan, schedule and review Facebook and Instagram posts in one place." },
  { id: "google-analytics", title: "Google Analytics", provider: "Google", url: "https://analytics.google.com", kind: "tool", note: "Website traffic and conversion measurement." },
  { id: "google-skillshop", title: "Google Skillshop", provider: "Google", url: "https://skillshop.withgoogle.com", kind: "course", note: "Free official training for Google Analytics and Google Ads." },

  // Web
  { id: "mdn-web", title: "MDN Web Docs", provider: "Mozilla", url: "https://developer.mozilla.org/en-US/docs/Web", kind: "docs", note: "The reference for HTML, CSS and how the web works." },
  { id: "framer", title: "Framer", provider: "Framer", url: "https://www.framer.com", kind: "tool", note: "Visual website builder with responsive breakpoints and free publishing." },
  { id: "wordpress", title: "WordPress.org", provider: "WordPress", url: "https://wordpress.org", kind: "tool", note: "Open-source site builder used by a large share of small-business websites." },
  { id: "w3c-wai", title: "Web Accessibility Initiative", provider: "W3C", url: "https://www.w3.org/WAI/", kind: "guide", note: "Official accessibility guidance — what makes a site usable for everyone." },
  { id: "pagespeed", title: "PageSpeed Insights", provider: "Google", url: "https://pagespeed.web.dev", kind: "tool", note: "Free speed, accessibility and SEO checks for any public page." },

  // Process
  { id: "drawio", title: "draw.io (diagrams.net)", provider: "draw.io", url: "https://www.drawio.com", kind: "tool", note: "Free flowchart and swimlane diagram tool, no account required." },

  // Finance
  { id: "cfi", title: "Corporate Finance Institute", provider: "CFI", url: "https://corporatefinanceinstitute.com", kind: "guide", note: "Free articles on forecasting, financial statements and modelling." },
  { id: "sba", title: "U.S. Small Business Administration", provider: "SBA", url: "https://www.sba.gov", kind: "guide", note: "Plain-language guidance on small-business planning and cash management." },

  // Bundled fictional datasets
  { id: "data-enquiries", title: "Bloom & Co. enquiries (fictional)", provider: "ImpactFools sample data", url: "/challenge-data/florist-enquiries-sample.csv", kind: "dataset", note: "30 made-up customer enquiries for testing a follow-up automation." },
  { id: "data-sales", title: "Kibo Home Goods sales (fictional)", provider: "ImpactFools sample data", url: "/challenge-data/sales-performance-sample.csv", kind: "dataset", note: "Six months of made-up orders by region, channel and category." },
  { id: "data-workflow", title: "Greenline invoice approvals (fictional)", provider: "ImpactFools sample data", url: "/challenge-data/invoice-approval-log-sample.csv", kind: "dataset", note: "Timestamped steps for 30 made-up invoices, including rework." },
  { id: "data-bakery", title: "Sunrise Bakery financials (fictional)", provider: "ImpactFools sample data", url: "/challenge-data/bakery-financials-sample.csv", kind: "dataset", note: "Six months of made-up revenue, costs and cash for a forecast." },
];

const BY_ID = new Map(RESOURCES.map((resource) => [resource.id, resource]));

export function getResource(id: string): ChallengeResource | undefined {
  return BY_ID.get(id);
}
