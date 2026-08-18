import Stripe from "stripe";
import { stripe } from "@/lib/stripe";

export interface AdminOrderRow {
  id: string;
  email: string;
  amount: number; // dollars
  currency: string;
  status: string;
  date: string; // ISO timestamp
  source: "Form" | "Payment Link";
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
    date: new Date(pi.created * 1000).toISOString(),
    source: hasFormData ? "Form" : "Payment Link",
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
    });

    rows.push(...result.data.map(toRow));

    if (!result.has_more || result.data.length === 0) break;
    startingAfter = result.data[result.data.length - 1].id;
  }

  rows.sort((a, b) => (a.date < b.date ? 1 : -1));
  cache = { rows, expires: Date.now() + CACHE_TTL_MS };
  return rows;
}

export async function listOrders(): Promise<AdminOrderRow[]> {
  const all = await getAllPaymentIntents();
  return all.filter((r) => r.status === "succeeded");
}

export async function listLeads(): Promise<AdminOrderRow[]> {
  const all = await getAllPaymentIntents();
  return all.filter((r) => r.status !== "succeeded" && r.source === "Form");
}

export async function listLiveEvents(limit = 40): Promise<(AdminOrderRow & { type: "order" | "lead" })[]> {
  const all = await getAllPaymentIntents();
  return all
    .filter((r) => r.status === "succeeded" || r.source === "Form")
    .map((r) => ({ ...r, type: (r.status === "succeeded" ? "order" : "lead") as "order" | "lead" }))
    .slice(0, limit);
}

export async function getStats(): Promise<AdminStats> {
  const orders = await listOrders();
  const leads = await listLeads();

  const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
  const totalOrders = orders.length;
  const totalLeads = leads.length;
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

  return { totalOrders, totalRevenue, totalLeads, conversionRate, revenueByDay, topStyles };
}
