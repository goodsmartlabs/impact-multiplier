// Usage: node scripts/generate-challenge-data.mjs public/challenge-data
// Generates FICTIONAL sample datasets for the 7-Day Skill Challenge. Deterministic (seeded).
import { writeFileSync } from "node:fs";
const out = process.argv[2];
let seed = 20261016;
const rand = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
const pick = (a) => a[Math.floor(rand() * a.length)];
const csv = (rows) => rows.map((r) => r.map((v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : v)).join(",")).join("\n") + "\n";
const pad = (n) => String(n).padStart(2, "0");

// 1. Florist enquiries (AI Automation)
{
  const first = ["Amara", "Ben", "Chen", "Dina", "Eli", "Fatima", "Gabe", "Hana", "Ivan", "Joy", "Kofi", "Lina", "Moses", "Nadia", "Omar"];
  const types = [["Wedding flowers", "event"], ["Birthday bouquet", "gift"], ["Weekly office flowers", "subscription"], ["Funeral arrangement", "sympathy"], ["Corporate event", "event"], ["Anniversary bouquet", "gift"]];
  const msgs = {
    event: ["Can you quote for flowers for about 80 guests next month?", "We need table centrepieces and an arch. What packages do you have?"],
    gift: ["Can you deliver a bouquet tomorrow afternoon?", "What is the price range for a medium bouquet with delivery?"],
    subscription: ["We'd like fresh flowers for reception every Monday. How does billing work?", "Do you offer a monthly plan for two office vases?"],
    sympathy: ["We need a respectful arrangement delivered to a service on Friday.", "Can you help with a wreath and a card message?"],
  };
  const rows = [["enquiry_id", "received_at", "customer_name", "email", "channel", "enquiry_type", "message", "budget_estimate", "responded_within_hours"]];
  for (let i = 1; i <= 30; i++) {
    const [type, group] = pick(types);
    const name = `${pick(first)} ${String.fromCharCode(65 + Math.floor(rand() * 26))}.`;
    const day = 1 + Math.floor(rand() * 28), hour = 8 + Math.floor(rand() * 11);
    const responded = rand() < 0.3 ? "" : String(Math.round(rand() * 46 + 1));
    rows.push([`ENQ-${String(i).padStart(3, "0")}`, `2026-03-${pad(day)} ${pad(hour)}:${pad(Math.floor(rand() * 60))}`, name, `customer${i}@example.com`, pick(["Website form", "Instagram DM", "Email", "WhatsApp"]), type, pick(msgs[group]), pick(["", "Under $50", "$50-$150", "$150-$500", "$500+"]), responded]);
  }
  writeFileSync(`${out}/florist-enquiries-sample.csv`, csv(rows));
}

// 2. Sales performance (Data Analytics)
{
  const products = [["Kitchen", "Ceramic Mug Set", 18, 7], ["Kitchen", "Bamboo Cutting Board", 24, 9], ["Bedding", "Cotton Duvet Cover", 64, 29], ["Bedding", "Linen Pillowcase Pair", 32, 13], ["Decor", "Woven Wall Basket", 27, 11], ["Decor", "Scented Candle", 14, 4], ["Bath", "Waffle Bath Towel", 22, 8], ["Bath", "Bamboo Bath Mat", 29, 12]];
  const regions = { North: 1.2, South: 0.8, East: 1.0, West: 1.05 };
  const rows = [["order_id", "order_date", "region", "channel", "category", "product", "units", "unit_price", "discount_pct", "revenue", "cost_of_goods", "gross_profit"]];
  let id = 1000;
  for (let m = 1; m <= 6; m++) {
    const season = [0.85, 0.8, 0.95, 1.0, 1.1, 1.3][m - 1];
    for (let k = 0; k < 40; k++) {
      const [cat, prod, price, cost] = pick(products);
      const region = pick(Object.keys(regions));
      const channel = rand() < 0.55 ? "Online" : rand() < 0.6 ? "Store" : "Marketplace";
      const units = Math.max(1, Math.round((1 + rand() * 6) * regions[region] * season));
      const discount = channel === "Marketplace" ? pick([10, 15, 20]) : pick([0, 0, 0, 5, 10]);
      const revenue = +(units * price * (1 - discount / 100)).toFixed(2);
      const cogs = +(units * cost).toFixed(2);
      rows.push([`KHG-${++id}`, `2026-${pad(m)}-${pad(1 + Math.floor(rand() * 28))}`, region, channel, cat, prod, units, price.toFixed(2), discount, revenue.toFixed(2), cogs.toFixed(2), (revenue - cogs).toFixed(2)]);
    }
  }
  writeFileSync(`${out}/sales-performance-sample.csv`, csv(rows));
}

// 3. Invoice approval workflow log (Process Improvement)
{
  const steps = [["Invoice received by email", "Accounts inbox", 5, 240], ["Data entered into spreadsheet", "AP clerk", 12, 480], ["Matched to purchase order", "AP clerk", 10, 720], ["Manager approval", "Department manager", 3, 2880], ["Finance approval", "Finance lead", 4, 1440], ["Payment scheduled", "AP clerk", 6, 360]];
  const rows = [["invoice_id", "step_no", "step", "owner", "work_minutes", "wait_minutes_before_step", "rework", "rework_reason", "invoice_amount"]];
  for (let i = 1; i <= 30; i++) {
    const amount = Math.round(150 + rand() * 9500);
    steps.forEach(([step, owner, work, wait], idx) => {
      const rework = (idx === 2 && rand() < 0.3) || (idx === 3 && rand() < 0.15);
      const reason = !rework ? "" : idx === 2 ? "PO number missing or wrong" : "Approver asked for missing details";
      rows.push([`GL-INV-${String(i).padStart(3, "0")}`, idx + 1, step, owner, Math.round(work * (0.7 + rand() * 0.8)) + (rework ? 15 : 0), idx === 0 ? 0 : Math.round(wait * (0.3 + rand() * 1.4)), rework ? "yes" : "no", reason, amount]);
    });
  }
  writeFileSync(`${out}/invoice-approval-log-sample.csv`, csv(rows));
}

// 4. Bakery financials (Financial Analysis)
{
  const rows = [["month", "retail_sales", "wholesale_sales", "total_revenue", "ingredients", "packaging", "wages", "rent", "utilities", "marketing", "loan_repayment", "total_costs", "net_cash_flow", "closing_cash"]];
  let cash = 6000;
  const months = ["2025-10", "2025-11", "2025-12", "2026-01", "2026-02", "2026-03"];
  months.forEach((month, i) => {
    const retail = Math.round(9800 * [1, 1.05, 1.32, 0.82, 0.88, 0.97][i] * (0.97 + rand() * 0.06));
    const wholesale = Math.round(3200 + i * 260 + rand() * 300);
    const revenue = retail + wholesale;
    const ingredients = Math.round(revenue * (0.31 + rand() * 0.03));
    const packaging = Math.round(revenue * 0.04);
    const wages = i === 2 ? 5600 : 4800;
    const rent = 1800, utilities = Math.round(520 + (i >= 2 && i <= 4 ? 140 : 0) + rand() * 40), marketing = [250, 300, 650, 150, 200, 250][i], loan = 700;
    const costs = ingredients + packaging + wages + rent + utilities + marketing + loan;
    const net = revenue - costs; cash += net;
    rows.push([month, retail, wholesale, revenue, ingredients, packaging, wages, rent, utilities, marketing, loan, costs, net, cash]);
  });
  writeFileSync(`${out}/bakery-financials-sample.csv`, csv(rows));
}
console.log("ok");
