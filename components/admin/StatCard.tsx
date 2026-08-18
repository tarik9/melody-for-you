export default function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <p className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-2">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {hint && <p className="text-gray-400 text-xs mt-1">{hint}</p>}
    </div>
  );
}
