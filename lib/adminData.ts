import Stripe from "stripe";
import { stripe } from "@/lib/stripe";

// Admin views only surface activity from this point on — hides pre-launch
// test/dev payments without touching anything in Stripe or the Sheet.
// Override with ADMIN_DATA_SINCE (ISO timestamp) to move the cutoff.
const DATA_SINCE = new Date(process.env.ADMIN_DATA_SINCE || "2026-08-18T22:31:52Z");

export interface DateRange {
  since?: string; // ISO
  until?: string; // ISO
}

export interface AdminOrderRow {
  id: string;
  email: string;
  amount: number; // dollars
  currency: string;
  status: string;
  refunded: boolean;
  date: string; // ISO timestamp
  source: "Form" | "Payment Link";
  country?: string;
  recipientName?: string;
  style?: string;
  vocalPreference?: string;
  relationship?: string;
  occasion?: string;
  story?: string;
  specificLyrics?: string;
}

export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  totalLeads: number;
  totalRefunded: number;
  emailCaptures: number;
  conversionRate: number;
  revenueByDay: { date: string; revenue: number; orders: number }[];
  topStyles: { style: string; count: number }[];
}

const CACHE_TTL_MS = 20_000;
const MAX_PAGES = 10; // caps at ~1000 PaymentIntents

let cache: { rows: AdminOrderRow[]; expires: number } | null = null;

function toRow(pi: Stripe.PaymentIntent): AdminOrderRow {
  const meta = pi.metadata || {};
  const charge =
    pi.latest_charge && typeof pi.latest_charge === "object" ? pi.latest_charge : null;
  const email = meta.email || pi.receipt_email || charge?.billing_details?.email || "";
  const hasFormData = Boolean(meta.recipient_name || meta.style);

  return {
    id: pi.id,
    email,
    amount: pi.amount / 100,
    currency: pi.currency.toUpperCase(),
    status: pi.status,
    refunded: Boolean(charge?.refunded),
    date: new Date(pi.created * 1000).toISOString(),
    source: hasFormData ? "Form" : "Payment Link",
    country: meta.country || undefined,
    recipientName: meta.recipient_name || undefined,
    style: meta.style || undefined,
    vocalPreference: meta.vocal_preference || undefined,
    relationship: meta.relationship || undefined,
    occasion: meta.occasion || undefined,
    story: meta.story || undefined,
    specificLyrics: meta.specific_lyrics || undefined,
  };
}

async function getAllPaymentIntents(): Promise<AdminOrderRow[]> {
  if (cache && cache.expires > Date.now()) return cache.rows;

  const rows: AdminOrderRow[] = [];
  let startingAfter: string | undefined;

  for (let page = 0; page < MAX_PAGES; page++) {
    const result = await stripe.paymentIntents.list({
      limit: 100,
      starting_after: startingAfter,
      expand: ["data.latest_charge"],
      created: { gte: Math.floor(DATA_SINCE.getTime() / 1000) },
    });

    rows.push(...result.data.map(toRow));

    if (!result.has_more || result.data.length === 0) break;
    startingAfter = result.data[result.data.length - 1].id;
  }

  rows.sort((a, b) => (a.date < b.date ? 1 : -1));
  cache = { rows, expires: Date.now() + CACHE_TTL_MS };
  return rows;
}

function inRange(row: AdminOrderRow, range?: DateRange): boolean {
  if (range?.since && row.date < range.since) return false;
  if (range?.until && row.date > range.until) return false;
  return true;
}

export async function listOrders(range?: DateRange): Promise<AdminOrderRow[]> {
  const all = await getAllPaymentIntents();
  return all.filter((r) => r.status === "succeeded" && inRange(r, range));
}

export async function listLeads(range?: DateRange): Promise<AdminOrderRow[]> {
  const all = await getAllPaymentIntents();
  return all.filter((r) => r.status !== "succeeded" && r.source === "Form" && inRange(r, range));
}

export async function listLiveEvents(
  limit = 40
): Promise<(AdminOrderRow & { type: "order" | "lead" })[]> {
  const all = await getAllPaymentIntents();
  return all
    .filter((r) => r.status === "succeeded" || r.source === "Form")
    .map((r) => ({ ...r, type: (r.status === "succeeded" ? "order" : "lead") as "order" | "lead" }))
    .slice(0, limit);
}

export interface EmailRow {
  email: string;
  country?: string;
  status: "customer" | "lead";
  date: string;
}

export async function listEmails(range?: DateRange): Promise<EmailRow[]> {
  const all = await getAllPaymentIntents();
  const inRangeRows = all.filter((r) => r.email && inRange(r, range));

  const byEmail = new Map<string, EmailRow>();
  for (const r of inRangeRows) {
    const existing = byEmail.get(r.email);
    const status: "customer" | "lead" = r.status === "succeeded" ? "customer" : "lead";
    if (!existing) {
      byEmail.set(r.email, { email: r.email, country: r.country, status, date: r.date });
    } else {
      // Prefer "customer" status and the most recent date across duplicate entries
      existing.status = existing.status === "customer" || status === "customer" ? "customer" : "lead";
      if (r.date > existing.date) existing.date = r.date;
      if (!existing.country && r.country) existing.country = r.country;
    }
  }

  return Array.from(byEmail.values()).sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getStats(range?: DateRange): Promise<AdminStats> {
  const orders = await listOrders(range);
  const leads = await listLeads(range);
  const emails = await listEmails(range);

  const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
  const totalOrders = orders.length;
  const totalLeads = leads.length;
  const totalRefunded = orders.filter((o) => o.refunded).length;
  const conversionRate =
    totalOrders + totalLeads > 0 ? (totalOrders / (totalOrders + totalLeads)) * 100 : 0;

  const revenueByDay: { date: string; revenue: number; orders: number }[] = [];
  const now = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const dayOrders = orders.filter((o) => o.date.slice(0, 10) === key);
    revenueByDay.push({
      date: key,
      revenue: dayOrders.reduce((s, o) => s + o.amount, 0),
      orders: dayOrders.length,
    });
  }

  const styleCounts: Record<string, number> = {};
  for (const o of orders) {
    const key = o.style || "Payment Link";
    styleCounts[key] = (styleCounts[key] || 0) + 1;
  }
  const topStyles = Object.entries(styleCounts)
    .map(([style, count]) => ({ style, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return {
    totalOrders,
    totalRevenue,
    totalLeads,
    totalRefunded,
    emailCaptures: emails.length,
    conversionRate,
    revenueByDay,
    topStyles,
  };
}
