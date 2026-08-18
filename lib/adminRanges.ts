export type RangeKey = "today" | "yesterday" | "7d" | "30d" | "all" | "custom";

export interface DateRangeValue {
  since?: string;
  until?: string;
}

export const RANGE_OPTIONS: { key: RangeKey; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "7d", label: "7 Days" },
  { key: "30d", label: "30 Days" },
  { key: "all", label: "All Time" },
  { key: "custom", label: "Custom" },
];

export function computeRange(key: RangeKey, customSince?: string, customUntil?: string): DateRangeValue {
  const now = new Date();

  switch (key) {
    case "today": {
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      return { since: start.toISOString() };
    }
    case "yesterday": {
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      start.setDate(start.getDate() - 1);
      const end = new Date(now);
      end.setHours(0, 0, 0, 0);
      return { since: start.toISOString(), until: end.toISOString() };
    }
    case "7d":
      return { since: new Date(now.getTime() - 7 * 24 * 3600 * 1000).toISOString() };
    case "30d":
      return { since: new Date(now.getTime() - 30 * 24 * 3600 * 1000).toISOString() };
    case "all":
      return {};
    case "custom":
      return {
        since: customSince ? new Date(customSince).toISOString() : undefined,
        until: customUntil ? new Date(`${customUntil}T23:59:59`).toISOString() : undefined,
      };
  }
}

export function rangeToQuery(range: DateRangeValue): string {
  const params = new URLSearchParams();
  if (range.since) params.set("since", range.since);
  if (range.until) params.set("until", range.until);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}
