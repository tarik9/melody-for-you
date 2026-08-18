const STYLES: Record<string, string> = {
  succeeded: "bg-green-50 text-green-700",
  requires_payment_method: "bg-amber-50 text-amber-700",
  requires_confirmation: "bg-amber-50 text-amber-700",
  requires_action: "bg-amber-50 text-amber-700",
  processing: "bg-blue-50 text-blue-700",
  canceled: "bg-gray-100 text-gray-500",
};

const LABELS: Record<string, string> = {
  requires_payment_method: "Abandoned",
  requires_confirmation: "Pending",
  requires_action: "Pending",
  processing: "Processing",
  canceled: "Canceled",
  succeeded: "Paid",
};

export default function StatusBadge({ status }: { status: string }) {
  const cls = STYLES[status] || "bg-gray-100 text-gray-500";
  const label = LABELS[status] || status;

  return (
    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${cls}`}>{label}</span>
  );
}
